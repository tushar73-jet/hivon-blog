'use server'

import { createClient } from '@/utils/supabase/server';
import { requireAuthorOrAdmin } from '@/utils/auth';
import { revalidatePath } from 'next/cache';

/**
 * Delete a post (Admin or Author only)
 */
export async function deletePostAction(postId) {
  const { user, role } = await requireAuthorOrAdmin();
  const supabase = await createClient();

  // 🔐 Security: Fetch post to verify ownership
  const { data: post, error: fetchError } = await supabase
    .from('posts')
    .select('author_id')
    .eq('id', postId)
    .single();

  if (fetchError || !post) throw new Error('Post not found');

  // Verify permission
  if (role !== 'admin' && post.author_id !== user.id) {
    throw new Error('Unauthorized: You cannot delete this post.');
  }

  const { error: deleteError } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);

  if (deleteError) throw new Error(deleteError.message);

  revalidatePath('/');
  revalidatePath('/dashboard');
  
  return { success: true };
}

/**
 * Update user role (Admin ONLY)
 */
export async function updateUserRoleAction(targetUserId, newRole) {
  const { role } = await requireAuthorOrAdmin();
  
  if (role !== 'admin') {
    throw new Error('Unauthorized: Admins only.');
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('users')
    .update({ role: newRole })
    .eq('id', targetUserId);

  if (error) throw new Error(error.message);

  revalidatePath('/dashboard');
}
