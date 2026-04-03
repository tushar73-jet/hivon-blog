'use server'

import { createClient } from '@/utils/supabase/server';
import { requireAuthorOrAdmin } from '@/utils/auth';
import { revalidatePath } from 'next/cache';
import { PostSchema } from '@/lib/validation';

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
    throw new Error(updateError.message);
  }

  // Clear cache for updated post
  revalidatePath('/');
  revalidatePath(`/posts/${postId}`);
  
  return data.id;
}
