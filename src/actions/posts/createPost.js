'use server'

import { createClient } from '@/utils/supabase/server';
import { requireAuthorOrAdmin } from '@/utils/auth';

async function generateSummary(body) {
  const apiKey = process.env.GROQ_API_KEY?.trim();

  if (!apiKey) {
    console.error('DEBUG [AI Summary]: GROQ_API_KEY is not set in environment variables.');
    return null;
  }

  console.log('DEBUG [AI Summary]: Starting summary generation for content length:', body.length);

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert copywriter. Write a concise, engaging summary of the following blog post. Keep it to 1-2 sentences.',
          },
          {
            role: 'user',
            content: `Here is the post content:\n${body}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 256,
      }),
      cache: 'no-store',
    });

    const rawText = await response.text();
    console.log('DEBUG [AI Summary]: Raw response from Groq received.');

    let json = null;
    try {
      json = rawText ? JSON.parse(rawText) : null;
    } catch (parseError) {
      console.error('DEBUG [AI Summary]: Failed to parse JSON response.', rawText);
      return null;
    }

    if (!response.ok) {
      console.error('DEBUG [AI Summary]: Groq API request failed.', {
        status: response.status,
        statusText: response.statusText,
        errorData: json
      });
      return null;
    }

    const generatedSummary = json?.choices?.[0]?.message?.content?.trim();

    if (!generatedSummary) {
      console.error('DEBUG [AI Summary]: No summary content found in the response.', json);
      return null;
    }

    console.log('DEBUG [AI Summary]: Summary successfully generated.');
    return generatedSummary;
  } catch (error) {
    console.error('DEBUG [AI Summary]: AI Fetch Operation failed.', error);
    return null;
  }
}

export async function createPostAction(title, body, imageUrl) {
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
