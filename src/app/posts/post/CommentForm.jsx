'use client';
import { useState } from 'react';
import { addCommentAction } from '@/actions/posts/comments';

export default function PostCommentForm({ postId, user }) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border border-dashed rounded-2xl text-center">
        <p className="text-gray-500">Please <a href="/login" className="text-blue-600 font-bold hover:underline">log in</a> to share your thoughts.</p>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      await addCommentAction(postId, comment);
      setComment('');
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white font-bold">
          {user.email.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none min-h-[100px] text-sm"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          disabled={isSubmitting || !comment.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl transition-all disabled:opacity-50"
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
}
