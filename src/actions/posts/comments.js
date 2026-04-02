'use server'

import { createClient } from '@/utils/supabase/server';
import { requireAuth } from '@/utils/auth';
import { revalidatePath } from 'next/cache';

export async function addCommentAction(postId, commentText) {
  const { user, role } = await requireAuth();
  
  if (!role) {
    throw new Error('You must have a valid account to comment.');
  }
  
  if (!commentText || commentText.trim().length === 0) {
    throw new Error('Comment cannot be empty.');
  }

  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('comments')
    .insert([{
      post_id: postId,
      user_id: user.id,
      comment_text: commentText.trim()
    }])
    .select('*, users(name)')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/posts/${postId}`);
  return data;
}

export async function deleteCommentAction(commentId, postId) {
  const { user, role } = await requireAuth();
  const supabase = await createClient();

  // Check if owner or admin
  const { data: comment, error: fetchError } = await supabase
    .from('comments')
    .select('user_id')
    .eq('id', commentId)
    .single();

  if (fetchError || !comment) throw new Error('Comment not found');

  if (role !== 'admin' && comment.user_id !== user.id) {
    throw new Error('Unauthorized');
  }

  const { error: deleteError } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (deleteError) throw new Error(deleteError.message);

  revalidatePath(`/posts/${postId}`);
}
