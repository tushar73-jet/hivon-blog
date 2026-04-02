import { createClient } from '@/utils/supabase/server';
import { requireAuthorOrAdmin } from '@/utils/auth';
import { notFound, redirect } from 'next/navigation';
import EditPostForm from './EditPostForm';
import Link from 'next/link';

export default async function EditPage({ params }) {
  const { id } = await params;
  const { user, role } = await requireAuthorOrAdmin();
  const supabase = await createClient();

  // Fetch target post
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !post) {
    notFound();
  }

  // Double-Check Edit Permission (Security)
  // Only the original author or an admin can edit
  if (role !== 'admin' && post.author_id !== user.id) {
    redirect(`/?message=You are not authorized to edit this post.`);
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight flex items-center gap-3">
            <span className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-xl">✍️</span>
            Edit Post
          </h1>
          <p className="text-gray-500 font-medium">Update the content, summary, or featured image of your article.</p>
        </div>
        <Link href={`/posts/${id}`} className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 dark:bg-blue-500/10 px-4 py-2 rounded-lg">
          ← Preview Post
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm p-6 sm:p-10 transition-colors">
        <EditPostForm post={post} />
      </div>
    </div>
  );
}
