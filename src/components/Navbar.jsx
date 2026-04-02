import Link from 'next/link';
import { getUserAndRole } from '@/utils/auth';
import { logout } from '@/app/login/actions';

export default async function Navbar() {
  const { user, role } = await getUserAndRole();

  return (
    <nav className="sticky top-0 z-50 border-b border-border glass transition-all">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          <div className="flex items-center gap-10">
            <Link href="/" className="text-2xl font-black text-gradient tracking-tighter">
              Hivon
            </Link>

            <div className="hidden sm:flex md:space-x-6">
              <Link href="/" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-1 py-2 text-sm font-bold transition-colors">
                Articles
              </Link>

              {/* Conditional Nav Links Based on Role */}
              {user && (role === 'author' || role === 'admin') && (
                <>
                  <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-1 py-2 text-sm font-bold transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/create" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-1 py-2 text-sm font-bold transition-colors">
                    New Post
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-6">
                <div className="text-sm text-gray-500 hidden sm:flex items-center gap-2">
                  <span className="font-medium">{user.email}</span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] uppercase font-black tracking-widest border border-blue-100 dark:border-blue-500/20">{role}</span>
                </div>
                <form action={logout}>
                  <button type="submit" className="text-sm font-bold text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                    Log out
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">
                  Log in
                </Link>
                <Link href="/signup" className="text-sm font-bold bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                  Sign up
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
