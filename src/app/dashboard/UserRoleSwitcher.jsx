'use client';
import { useState } from 'react';
import { updateUserRoleAction } from '@/actions/posts/admin';
import ConfirmModal from '@/components/ConfirmModal';

export default function UserRoleSwitcher({ userId, currentRole, isAdmin }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingRole, setPendingRole] = useState(null);
  
  if (!isAdmin) return <span className="text-xs uppercase font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{currentRole}</span>;

  function handleSelectChange(e) {
    setPendingRole(e.target.value);
    setShowConfirm(true);
  }

  async function performUpdate() {
    if (!pendingRole) return;
    try {
      setIsUpdating(true);
      await updateUserRoleAction(userId, pendingRole);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsUpdating(false);
      setPendingRole(null);
    }
  }

  return (
    <>
      <div className="relative inline-flex items-center">
        <select
          value={pendingRole || currentRole}
          onChange={handleSelectChange}
          disabled={isUpdating}
          className="appearance-none bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold px-3 py-1 pr-6 rounded-lg uppercase tracking-tight focus:ring-2 focus:ring-blue-500/30 outline-none transition-all cursor-pointer disabled:opacity-50"
        >
          <option value="viewer">Viewer</option>
          <option value="author">Author</option>
          <option value="admin">Admin</option>
        </select>
        <div className="absolute right-1.5 pointer-events-none text-blue-400/50">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </div>

      <ConfirmModal 
        isOpen={showConfirm}
        onClose={() => {
          setShowConfirm(false);
          setPendingRole(null);
        }}
        onConfirm={performUpdate}
        title="Confirm Role Update"
        message={`You are about to modify this member's access level to ${pendingRole}. This change will apply instantly across the entire platform.`}
        confirmText="Update Role"
        type="primary"
      />
    </>
  );
}
