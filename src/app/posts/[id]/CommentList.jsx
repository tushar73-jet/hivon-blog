'use client';
import { useState } from 'react';
import { deleteCommentAction } from '@/actions/posts/comments';
import ConfirmModal from '@/components/ConfirmModal';

export default function CommentList({ comments, postId, currentUser, role }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingId, setPendingId] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '' });
  const isAdmin = role === 'admin';

  async function performDelete() {
    if (!pendingId) return;
    try {
      await deleteCommentAction(pendingId, postId);
    } catch (err) {
      setModal({
        isOpen: true,
        title: 'Moderation Problem',
        message: 'Unable to delete comment: ' + err.message
      });
    } finally {
      setPendingId(null);
    }
  }

  function handleDeleteClick(id) {
    setPendingId(id);
    setShowConfirm(true);
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500 font-medium italic border-2 border-dashed border-gray-100 dark:border-gray-900 rounded-3xl mt-8">
        No comments yet. Be the first to start the conversation!
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 space-y-8">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4 group">
            {/* Avatar Icon */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 flex-shrink-0 flex items-center justify-center text-gray-700 dark:text-gray-400 font-bold uppercase ring-2 ring-white dark:ring-black">
              {comment.users?.name?.charAt(0) || comment.user_id.charAt(0)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1.5">
                <span className="font-bold text-sm text-gray-950 dark:text-gray-50">
                  {comment.users?.name || 'Anonymous User'}
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                <time className="text-xs text-gray-400 font-medium tracking-tight uppercase">
                  {new Date(comment.created_at).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                </time>
                
                {(isAdmin || currentUser?.id === comment.user_id) && (
                  <button 
                    onClick={() => handleDeleteClick(comment.id)}
                    className="ml-auto text-xs font-bold text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
              
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium bg-gray-50 dark:bg-gray-900/40 p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-800/50 shadow-sm relative before:content-[''] before:absolute before:top-[-1px] before:left-[-12px] before:w-0 before:h-0 before:border-r-[12px] before:border-r-gray-50 dark:before:border-r-gray-900/40 before:border-t-[12px] before:border-t-transparent group-hover:shadow-md transition-shadow">
                {comment.comment_text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal 
        isOpen={showConfirm}
        onClose={() => {
          setShowConfirm(false);
          setPendingId(null);
        }}
        onConfirm={performDelete}
        title="Remove this comment?"
        message="This will permanently remove this contribution from the discussion. This action is irreversible."
        confirmText="Delete Comment"
        type="danger"
      />

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
