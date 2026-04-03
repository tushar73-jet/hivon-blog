'use server'

import { createClient } from '@/utils/supabase/server';
import { requireAuthorOrAdmin } from '@/utils/auth';
import { revalidatePath } from 'next/cache';
import { PostSchema } from '@/lib/validation';

async function generateSummary(body) {
  const apiKey = process.env.GOOGLE_AI_API_KEY?.trim();

  if (!apiKey) {
    console.error('DEBUG [AI Summary]: GOOGLE_AI_API_KEY is missing from process.env. Please check your .env.local file.');
    return null;
  }

  console.log('DEBUG [AI Summary]: Starting summary generation for content length:', body.length);

  const maxRetries = 3;
  let lastError = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // ⏱ 20s timeout

      // Truncate to prevent token limit issues
      const truncatedBody = body.substring(0, 10000);

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Summarize the following blog post. 
- Length: Around 200 words. 
- Tone: Professional and engaging.
- Requirement: Provide a thorough, comprehensive paragraph. Do NOT use introductory phrases like "This post is about" or wrap the response in quotes.

Post content:
${truncatedBody}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
        cache: 'no-store',
      });

      const data = await response.json();
      clearTimeout(timeoutId);

      if (!response.ok) {
        lastError = `HTTP ${response.status} - ${data.error?.message || 'Unknown error'}`;

        // If it's a transient error (Server Busy or Rate Limit), wait and retry
        if (response.status === 503 || response.status === 429) {
          console.warn(`DEBUG [AI Summary]: Attempt ${i + 1} failed with ${response.status}. Retrying...`);
          await new Promise(res => setTimeout(res, 2000 * (i + 1))); // Exponential-ish backoff
          continue;
        }

        console.error('DEBUG [AI Summary]: HTTP ERROR', response.status, data);
        return `AI Summary Error: ${lastError}`;
      }

      const generatedSummary = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!generatedSummary) {
        console.error('DEBUG [AI Summary]: No summary content found in the response.', data);
        return 'AI Summary: No summary could be generated for this content.';
      }

      console.log('DEBUG [AI Summary]: Summary successfully generated on attempt', i + 1);
      return generatedSummary;

    } catch (error) {
      lastError = error.message;
      if (error.name === 'AbortError') {
        console.warn(`DEBUG [AI Summary]: Attempt ${i + 1} timed out. Retrying...`);
        await new Promise(res => setTimeout(res, 1000));
        continue;
      } else {
        console.error('DEBUG [AI Summary]: AI Fetch Operation failed.', error);
        return `AI Summary Error: ${error.message}`;
      }
    }
  }

  return `AI Summary Error: Failed after ${maxRetries} attempts. Last error: ${lastError}`;
}

export async function createPostAction(title, body, imageUrl) {
  // 🛡 Zod Validation (Premium Professional Requirement)
  const validation = PostSchema.safeParse({ title, body, imageUrl });
  
  if (!validation.success) {
    const firstError = validation.error.issues[0].message;
    throw new Error(firstError);
  }

  const validated = validation.data;
  const { user } = await requireAuthorOrAdmin();
  const summary = await generateSummary(validated.body);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .insert([{
      title: validated.title,
      body: validated.body,
      image_url: validated.imageUrl,
      summary,
      author_id: user.id
    }])
    .select()
    .single();

  if (error) {
    console.error("Database Insert Error:", error);
    throw new Error(error.message);
  }

  // Clear cache for homepage and dashboard
  revalidatePath('/');
  revalidatePath('/dashboard');

  return data.id;
}
