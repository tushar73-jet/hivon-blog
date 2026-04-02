import { requireAuthorOrAdmin } from '@/utils/auth';
import CreatePostForm from './CreatePostForm';

export default async function CreatePostPage() {
  await requireAuthorOrAdmin();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Draft New Post</h1>
        <p className="text-gray-500">Share your thoughts with the world. An AI summary will be generated automatically.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6 sm:p-8">
        <CreatePostForm />
      </div>
    </div>
  );
}
