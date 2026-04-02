'use server'

import { createClient } from '@/utils/supabase/server';
import { requireAuthorOrAdmin } from '@/utils/auth';

async function generateSummary(body) {
  const apiKey = process.env.GOOGLE_AI_API_KEY?.trim();

  if (!apiKey) {
    console.error('DEBUG [AI Summary]: GOOGLE_AI_API_KEY is missing from process.env. Please check your .env.local file.');
    return null;
  }

  console.log('DEBUG [AI Summary]: Starting summary generation for content length:', body.length);

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
      console.error('DEBUG [AI Summary]: HTTP ERROR', response.status, data);
      return `AI Summary Error: HTTP ${response.status} - ${data.error?.message || 'Unknown error'}`;
    }

    const generatedSummary = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!generatedSummary) {
      console.error('DEBUG [AI Summary]: No summary content found in the response.', data);
      return 'AI Summary: No summary could be generated for this content.';
    }

    console.log('DEBUG [AI Summary]: Summary successfully generated.');
    return generatedSummary;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('DEBUG [AI Summary]: AI Fetch Operation timed out.');
      return 'AI Summary Error: Request timed out (20s).';
    } else {
      console.error('DEBUG [AI Summary]: AI Fetch Operation failed.', error);
      return `AI Summary Error: ${error.message}`;
    }
  }
}

export async function createPostAction(title, body, imageUrl) {
  // 🔐 Input Validation (Fix Gap #4)
  if (!title || title.length > 255) throw new Error("Title must be 1-255 characters");
  if (!body || body.length > 50000) throw new Error("Body content is too long (max 50k chars)");

  const { user } = await requireAuthorOrAdmin();
  const summary = await generateSummary(body);
  
  console.log('DEBUG [createPostAction]: Summary status:', summary ? 'SUCCESS' : 'FAILED/EMPTY');

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .insert([{
      title,
      body,
      image_url: imageUrl,
      summary,
      author_id: user.id
    }])
    .select()
    .single();

  if (error) {
    console.error("Database Insert Error:", error);
    throw new Error(error.message);
  }

  return data.id;
}
