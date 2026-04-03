'use server'

import { createClient } from '@/utils/supabase/server';
import { requireAuth } from '@/utils/auth';
import { revalidatePath } from 'next/cache';
import { CommentSchema } from '@/lib/validation';

async function ensurePublicUser(supabase, user) {
  // 🛡 Self-Healing: Check if public user profile exists
  const { data: profile } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .single();

  if (!profile) {
    console.log(`DEBUG [Self-Healing]: Creating missing public profile for user ${user.id}`);
    await supabase.from('users').insert({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.email?.split('@')[0],
      role: 'viewer'
    });
  }
}

export async function addCommentAction(postId, commentText) {
  // 🛡 Zod Validation (Premium Professional Requirement)
  const validation = CommentSchema.safeParse({ commentText });
  
  if (!validation.success) {
    const firstError = validation.error.issues[0].message;
    throw new Error(firstError);
  }

  const validatedText = validation.data.commentText;
  const { user, role } = await requireAuth();
  
  if (!role) {
    throw new Error('You must have a valid account to comment.');
  }

  const supabase = await createClient();
  
  // 🛡 Self-Healing: Ensure the public profile exists before proceeding
  await ensurePublicUser(supabase, user);
  
  const { data, error } = await supabase
    .from('comments')
    .insert([{
      post_id: postId,
      user_id: user.id,
      comment_text: validatedText
    }])
    .select('*, users(name)')
    .single();

  if (error) {
    console.error("Comment Insert Error:", error);
    throw new Error('We could not save your comment. The system is auto-repairing, please try once more.');
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
