import { createClient } from '@/utils/supabase/server';
import { requireAuthorOrAdmin } from '@/utils/auth';
import Link from 'next/link';
import PostManagementTools from './PostManagementTools';
import UserRoleSwitcher from './UserRoleSwitcher';

export default async function DashboardPage() {
  const { user, role } = await requireAuthorOrAdmin();
  const isAdmin = role === 'admin';
  const supabase = await createClient();

  // 📰 FETCH POSTS
  // If admin, fetch all posts. If author, only their own.
  let postsQuery = supabase
    .from('posts')
    .select('id, title, summary, created_at, author_id, users(name)');

  if (!isAdmin) {
    postsQuery = postsQuery.eq('author_id', user.id);
  }

  const { data: posts, error: postsError } = await postsQuery.order('created_at', { ascending: false });

  // 👥 FETCH USERS (Admins Only)
  let users = [];
  if (isAdmin) {
    const { data: usersData } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    users = usersData || [];
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-12 gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tighter text-gray-950 dark:text-gray-50 flex items-center gap-3">
             Editor Dashboard
          </h1>
          <p className="text-lg text-gray-500 font-medium tracking-tight">
            Manage your blog content {isAdmin && "and platform users"} effortlessly.
          </p>
        </div>
        <Link href="/create" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]">
           Create New Article
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* POSTS MANAGEMENT SECTION */}
        <div className={`${isAdmin ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-6`}>
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm shadow-gray-100/10">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="p-1 px-2 bg-blue-100 dark:bg-blue-500/10 text-blue-600 rounded-lg text-sm">📝</span>
                Your Articles {isAdmin && <span className="text-gray-400 font-medium ml-1">Across Platform</span>}
              </h2>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{posts?.length || 0} Total</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-transparent border-b border-gray-100 dark:border-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Article Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Settings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {posts && posts.length > 0 ? posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-900/30 transition-colors group">
                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-1">
                          <Link href={`/posts/${post.id}`} className="font-bold text-gray-950 dark:text-gray-50 group-hover:text-blue-600 transition-colors text-base line-clamp-1 decoration-2 underline-offset-2">
                            {post.title}
                          </Link>
                          <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className="text-gray-500 font-bold">{post.users?.name || 'Self'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <PostManagementTools postId={post.id} />
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="2" className="px-6 py-12 text-center text-gray-500 italic font-medium">No posts found. Start by writing your first article!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* USERS MANAGEMENT SECTION (Admins Only) */}
        {isAdmin && (
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm shadow-gray-100/10 h-full">
              <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span className="p-1 px-2 bg-purple-100 dark:bg-purple-500/10 text-purple-600 rounded-lg text-sm">👥</span>
                  Team Management
                </h2>
              </div>
              <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
                {users && users.length > 0 ? users.map((u) => (
                  <div key={u.id} className="px-6 py-6 hover:bg-gray-50/30 dark:hover:bg-gray-800/20 transition-colors">
                    <div className="flex flex-col gap-3">
                      <div>
                        <div className="font-bold text-gray-900 dark:text-gray-50 text-sm truncate">{u.name || 'User'}</div>
                        <div className="text-xs text-gray-400 font-medium truncate">{u.email}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <UserRoleSwitcher userId={u.id} currentRole={u.role} isAdmin={isAdmin} />
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="px-6 py-8 text-center text-xs font-bold text-gray-400">No other users found.</div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
