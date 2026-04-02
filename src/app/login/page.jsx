import { login } from './actions'
import Link from 'next/link'

export default async function LoginPage({ searchParams }) {
  const resolvedParams = await searchParams;

  return (
    <div className="flex h-screen items-center justify-center p-4 bg-gray-50 dark:bg-black">
      <div className="w-full max-w-sm rounded-2xl border shadow-xl p-8 bg-white dark:bg-gray-900 dark:border-gray-800">
        <h1 className="text-3xl font-bold mb-2 text-center tracking-tight text-blue-600 dark:text-blue-400">Welcome Back</h1>
        <p className="text-center text-sm text-gray-500 mb-6">Enter your credentials to access your account</p>

        <form className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="email">Email</label>
            <input className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-black dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="password">Password</label>
            <input className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-black dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" id="password" name="password" type="password" placeholder="••••••••" required />
          </div>
          
          <div className="mt-2">
            <button formAction={login} className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition-colors shadow-sm">
              Log In
            </button>
          </div>
          
          {resolvedParams?.message && (
            <p className="mt-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-center text-sm font-medium text-red-700 dark:text-red-300">
              {resolvedParams.message}
            </p>
          )}

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-600 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
