export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold tracking-tight">
          Hivon Blogging Platform
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          A modern blogging platform built with Next.js, Supabase, and AI.
        </p>
      </main>
    </div>
  );
}
