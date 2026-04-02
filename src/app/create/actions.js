'use server'

import { createClient } from '@/utils/supabase/server';
import { requireAuthorOrAdmin } from '@/utils/auth';
import { redirect } from 'next/navigation';

export async function createPostAction(title, body, imageUrl) {
  const { user } = await requireAuthorOrAdmin();
  
  let summary = "AI Summary could not be generated. Please check API Key.";
  
  // 1. Generate Summary with Groq API directly via fetch
  if (process.env.GROQ_API_KEY) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", // Replaced deprecated llama3-8b model
          messages: [
            {
              role: "system",
              content: "You are an expert copywriter. Write a concise, engaging summary (around 200 words) of the following blog post."
            },
            {
              role: "user",
              content: `Here is the post:\n${body}`
            }
          ]
        })
      });

      const json = await response.json();
      
      if (json.choices && json.choices.length > 0) {
        summary = json.choices[0].message.content;
      } else {
        console.error("Groq AI response error:", json);
        summary = "Summary generation failed. Error: " + (json.error?.message || "Unknown error");
      }
    } catch (error) {
      console.error("Groq AI fetch failed:", error);
    }
  } else {
    console.warn("GROQ_API_KEY is not set in environment variables.");
  }

  // 2. Finalize Post Creation Flow to Supabase
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

  // Return the newly created post ID so the client can redirect to it!
  return data.id;
}
