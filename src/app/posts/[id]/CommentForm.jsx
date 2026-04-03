'use client';
import { useState } from 'react';
import { addCommentAction } from '@/actions/posts/comments';
import ConfirmModal from '@/components/ConfirmModal';

export default function CommentForm({ postId, user }) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '' });

  if (!user) {
    return (
      <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl p-6 text-center">
        <p className="text-blue-800 dark:text-blue-300 font-medium text-sm">Please log in to participate in the discussion.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      await addCommentAction(postId, comment);
      setComment('');
    } catch (err) {
      console.error(err);
      
      // Attempt to parse Zod error JSON
      let displayMessage = err.message;
      try {
        const parsed = JSON.parse(err.message);
        if (Array.isArray(parsed) && parsed[0].message) {
          displayMessage = parsed[0].message;
        }
      } catch (inner) {
        // Not JSON, use as is
      }

      setModal({
        isOpen: true,
        title: 'Interaction Issue',
        message: displayMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex-shrink-0 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What are your thoughts on this article?"
              className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800 dark:text-gray-200 placeholder:text-gray-400 placeholder:font-medium resize-none shadow-sm"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            disabled={isSubmitting || !comment.trim()}
            type="submit"
            className="bg-blue-600 text-white font-black py-2.5 px-8 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      <ConfirmModal 
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        message={modal.message}
        isAlert={true}
        type="primary"
      />
    </>
  );
}
