import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function Home({ searchParams }) {
  const resolvedParams = await searchParams;
  const supabase = await createClient();
  
  const search = resolvedParams?.q || '';
  const page = parseInt(resolvedParams?.page || '1');
  const limit = 9;
  const offset = (page - 1) * limit;

  // Fetch posts and the author's name
  let query = supabase
    .from('posts')
    .select('id, title, summary, image_url, created_at, users(name)', { count: 'exact' });
  
  if (search) {
     query = query.ilike('title', `%${search}%`);
  }
  
  const { data: posts, count, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  const totalPages = count ? Math.ceil(count / limit) : 0;

  return (
    <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">Latest from Hivon</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Discover insights, tutorials, and updates.</p>
        </div>

        {/* Search Bar */}
        <form className="w-full md:w-auto flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <input 
            type="text" 
            name="q" 
            defaultValue={search} 
            placeholder="Search articles..." 
            className="px-4 py-2 bg-transparent outline-none w-full md:w-64 dark:text-white"
          />
          <button type="submit" className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium border-l border-gray-200 dark:border-gray-800">
            Search
          </button>
        </form>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">Error loading posts: {error.message}</div>
      ) : posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link href={`/posts/${post.id}`} key={post.id} className="group flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="aspect-video w-full bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                {post.image_url ? (
                  <img src={post.image_url} alt={post.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                
                {/* AI Summary Badge */}
                {post.summary && (
                  <div className="mb-3 flex items-start">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20">
                      ✨ AI Summary
                    </span>
                  </div>
                )}
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                  {post.summary || 'Click to read full article...'}
                </p>
                
                <div className="mt-auto flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-4">
                  <span className="font-medium">{post.users?.name || 'Unknown Author'}</span>
                  <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
          <p className="text-gray-500 text-lg">No posts found.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-16">
          {page > 1 && (
            <Link href={`/?page=${page - 1}${search ? `&q=${search}` : ''}`} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors">
              Previous
            </Link>
          )}
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          {page < totalPages && (
            <Link href={`/?page=${page + 1}${search ? `&q=${search}` : ''}`} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors">
              Next
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
