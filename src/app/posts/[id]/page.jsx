import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getUserAndRole } from '@/utils/auth';
import PostCommentForm from './CommentForm';
import CommentList from './CommentList';

export default async function SinglePostPage({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from('posts')
    .select('*, users(name)')
    .eq('id', id)
    .single();

  const { data: comments } = await supabase
    .from('comments')
    .select('*, users(name)')
    .eq('post_id', id)
    .order('created_at', { ascending: false })
    .limit(50); // 📦 Pagination (Fix Gap #10)

  const { user, role } = await getUserAndRole();
  const isAuthor = user?.id === post?.author_id;
  const isAdmin = role === 'admin';
  const canEdit = isAuthor || isAdmin;

  if (error || !post) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors mb-8">
        ← Back to all posts
      </Link>

      <article className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
        {/* Featured Image */}
        {post.image_url && (
          <div className="w-full aspect-[21/9] bg-gray-100 dark:bg-gray-800 relative">
            <img
              src={post.image_url}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        <div className="p-8 md:p-12">
          {/* Header Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {post.users?.name?.charAt(0) || 'A'}
              </div>
              {post.users?.name || 'Unknown Author'}
            </div>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
            <time dateTime={post.created_at}>
              {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </time>

            {canEdit && (
              <Link href={`/posts/${id}/edit`} className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors border border-gray-200 dark:border-gray-700">
                <span className="text-sm leading-none">✏️</span> Edit Post
              </Link>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8 leading-tight">
            {post.title}
          </h1>

          {/* AI Generated Summary Block */}
          {post.summary && (
            <div className="mb-10 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 border border-purple-100 dark:border-purple-800/30 p-6 rounded-2xl relative">
              <div className="absolute -top-3 -left-3 text-2xl">✨</div>
              <h3 className="text-sm font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-2">AI Generated Summary</h3>
              <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed font-medium italic">
                &quot;{post.summary}&quot;
              </p>
            </div>
          )}

          {/* Main Body Content */}
          <div 
            className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 post-content"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        </div>
      </article>

      {/* Step 12: Comments Section */}
      <div className="mt-16 border-t dark:border-gray-800 pt-16">
        <h2 className="text-3xl font-extrabold mb-10 tracking-tight text-gray-950 dark:text-gray-50 flex items-center gap-3">
          <span className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-xl">💬</span>
          Comments
          <span className="ml-2 text-sm font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            {comments?.length || 0}
          </span>
        </h2>

        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-sm transition-shadow">
          <PostCommentForm postId={id} user={user} />

          <div className="mt-12">
            <CommentList
              comments={comments}
              postId={id}
              currentUser={user}
              role={role}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
