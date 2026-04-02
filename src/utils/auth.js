import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function getUserAndRole() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { user: null, role: null };

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  return { user, role: userData?.role || 'viewer' };
}

export async function requireAuth() {
  const { user, role } = await getUserAndRole();
  if (!user) redirect('/login');
  return { user, role };
}

export async function requireAuthorOrAdmin() {
  const { user, role } = await requireAuth();
  if (role !== 'author' && role !== 'admin') {
    redirect('/?message=Unauthorized. Authors and Admins only.');
  }
  return { user, role };
}

export async function requireAdmin() {
  const { user, role } = await requireAuth();
  if (role !== 'admin') {
    redirect('/?message=Unauthorized. Admins only.');
  }
  return { user, role };
}
