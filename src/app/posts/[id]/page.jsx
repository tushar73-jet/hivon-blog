import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function SinglePostPage({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from('posts')
    .select('*, users(name)')
    .eq('id', id)
    .single();

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
          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            {/* If body matches generic markdown, a library like react-markdown would be used here. For now, white-space formatting */}
            <div className="whitespace-pre-wrap">{post.body}</div>
          </div>
        </div>
      </article>

      {/* Placeholder for Step 12: Comments */}
      <div className="mt-16 border-t pt-16">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <div className="p-8 text-center bg-gray-50 dark:bg-gray-900 border border-dashed rounded-2xl text-gray-500">
        </div>
      </div>
    </main>
  );
}
