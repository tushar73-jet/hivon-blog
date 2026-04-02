import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  let isConnected = false;
  let errorMsg = null;

  try {
    const { error } = await supabase.auth.getSession();
    if (error) throw error;
    isConnected = true;
  } catch (err) {
    errorMsg = err.message;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold tracking-tight">
          Hivon Blogging Platform
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          A modern blogging platform built with Next.js, Supabase, and AI.
        </p>

        <div className="mt-8 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900 w-full">
          <h2 className="text-xl font-semibold mb-2">Supabase Connection Test:</h2>
          {isConnected ? (
            <p className="text-green-600 font-bold flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
              Connected successfully!
            </p>
          ) : (
            <div>
              <p className="text-red-500 font-bold flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                Connection failed
              </p>
              <p className="text-sm text-red-400 mt-2 font-mono break-words">{errorMsg || "Invalid credentials or URL."}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
