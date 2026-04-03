'use client';
import { useState } from 'react';
import { deletePostAction } from '@/actions/posts/admin';
import Link from 'next/link';
import ConfirmModal from '@/components/ConfirmModal';

export default function PostManagementTools({ postId }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function performDelete() {
    try {
      setIsDeleting(true);
      await deletePostAction(postId);
    } catch (error) {
      alert(error.message);
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link 
          href={`/posts/${postId}/edit`}
          className="px-3 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-800 rounded-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          Edit
        </Link>
        <button
          onClick={() => setShowConfirm(true)}
          disabled={isDeleting}
          className="px-3 py-1.5 text-xs font-bold text-red-600 hover:text-white hover:bg-red-600 border border-red-50 dark:border-red-900/30 rounded-lg transition-all disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>

      <ConfirmModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={performDelete}
        title="Permanently Delete Article?"
        message="This action will permanently erase this article and all its community discussions. Once deleted, this information cannot be recovered."
        confirmText="Yes, delete article"
        type="danger"
      />
    </>
  );
}
