'use server'

import { createClient } from '@/utils/supabase/server';
import { requireAuthorOrAdmin } from '@/utils/auth';
import { revalidatePath } from 'next/cache';
import { PostSchema } from '@/lib/validation';

async function ensurePublicUser(supabase, user) {
  // 🛡 Self-Healing: Check if public user profile exists
  const { data: profile } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .single();

  if (!profile) {
    console.log(`DEBUG [Self-Healing]: Creating missing profile during Post Update for ${user.id}`);
    await supabase.from('users').insert({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.email?.split('@')[0],
      role: 'viewer'
    });
  }
}

export async function updatePostAction(postId, updates) {
  // 🛡 Zod Validation (Premium Professional Requirement)
  const validation = PostSchema.partial().safeParse(updates);

  if (!validation.success) {
    const firstError = validation.error.issues[0].message;
    throw new Error(firstError);
  }

  const validated = validation.data;
  const { user, role } = await requireAuthorOrAdmin();
  const supabase = await createClient();

  // 🛡 Self-Healing: Ensure the public profile exists before proceeding
  await ensurePublicUser(supabase, user);

  // 🔐 Permission Check: Fetch post to verify ownership
  const { data: post, error: fetchError } = await supabase
    .from('posts')
    .select('author_id')
    .eq('id', postId)
    .single();

  if (fetchError || !post) {
    throw new Error('Post not found');
  }

  // Only allow if User is Admin OR User is the original author
  if (role !== 'admin' && post.author_id !== user.id) {
    throw new Error('Unauthorized: You do not have permission to edit this post.');
  }

  const { data, error: updateError } = await supabase
    .from('posts')
    .update({
      title: validated.title,
      body: validated.body,
      image_url: validated.imageUrl,
      summary: validated.summary,
    })
    .eq('id', postId)
    .select()
    .single();

  if (updateError) {
    console.error("Update Error:", updateError);
    throw new Error('We could not save your update. The system is auto-repairing. Please try one more time.');
  }

  // Clear cache for updated post
  revalidatePath('/');
  revalidatePath(`/posts/${postId}`);
  
  return data.id;
}
