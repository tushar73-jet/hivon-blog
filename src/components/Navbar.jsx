import Link from 'next/link';
import { getUserAndRole } from '@/utils/auth';
import { logout } from '@/app/login/actions';

export default async function Navbar() {
  const { user, role } = await getUserAndRole();

  return (
    <nav className="border-b bg-white dark:bg-gray-950 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Hivon Blog
            </Link>
            
            <div className="hidden sm:flex md:space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Articles
              </Link>
              
              {/* Conditional Nav Links Based on Role */}
              {user && (role === 'author' || role === 'admin') && (
                <>
                  <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Dashboard
                  </Link>
                  <Link href="/create" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    New Post
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500 hidden sm:block">
                  {user.email} <span className="ml-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs uppercase font-semibold">{role}</span>
                </div>
                <form action={logout}>
                  <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400">
                    Log out
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
                  Log in
                </Link>
                <Link href="/signup" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
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
