import { signup } from './actions'
import Link from 'next/link'

export default async function SignupPage({ searchParams }) {
  const resolvedParams = await searchParams;

  return (
    <div className="flex h-screen items-center justify-center p-4 bg-gray-50 dark:bg-black">
      <div className="w-full max-w-sm rounded-2xl border shadow-xl p-8 bg-white dark:bg-gray-900 dark:border-gray-800">
        <h1 className="text-3xl font-bold mb-2 text-center tracking-tight text-blue-600 dark:text-blue-400">Join Hivon Blog</h1>
        <p className="text-center text-sm text-gray-500 mb-6">Create a free account to get started</p>

        <form className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="name">Full Name</label>
            <input className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-black dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" id="name" name="name" placeholder="John Doe" required />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="email">Email</label>
            <input className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-black dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="password">Password</label>
            <input className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-black dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" id="password" name="password" type="password" placeholder="••••••••" required />
          </div>
          
          <div className="mt-2">
            <button formAction={signup} className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition-colors shadow-sm">
              Create Account
            </button>
          </div>
          
          {resolvedParams?.message && (
            <p className="mt-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-center text-sm font-medium text-red-700 dark:text-red-300">
              {resolvedParams.message}
            </p>
          )}

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
