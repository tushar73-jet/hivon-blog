'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { uploadImage } from '@/utils/supabase/storage';
import { updatePostAction } from '@/actions/posts/updatePost';

export default function EditPostForm({ post }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(post.image_url);
  const fileInputRef = useRef(null);

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.target);
      const title = formData.get('title');
      const body = formData.get('body');
      const summary = formData.get('summary');
      
      let imageUrl = post.image_url;
      const file = fileInputRef.current?.files?.[0];
      
      if (file) {
        imageUrl = await uploadImage(file);
      }

      await updatePostAction(post.id, { title, body, imageUrl, summary });
      
      router.push(`/posts/${post.id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Failed to update post: ' + error.message);
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      {/* Title */}
      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Post Title</label>
        <input 
          name="title"
          defaultValue={post.title}
          required 
          type="text" 
          className="w-full border border-gray-300 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-lg" 
        />
      </div>
      
      {/* Featured Image */}
      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Featured Image</label>
        {imagePreview && (
          <div className="mb-4 relative w-full rounded-xl overflow-hidden aspect-video border dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            <button 
              type="button" 
              onClick={() => { setImagePreview(null); if(fileInputRef.current) fileInputRef.current.value = ""; }}
              className="absolute top-3 right-3 bg-red-600/90 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        )}
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          onChange={handleImageChange}
          className={`w-full border border-gray-300 dark:border-gray-700 rounded-xl p-3 bg-gray-50 dark:bg-black text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all ${imagePreview ? 'hidden' : 'block'}`}
        />
      </div>

      {/* Summary Editor */}
      <div>
        <label className="block text-sm font-bold text-purple-600 dark:text-purple-400 mb-2 font-mono uppercase tracking-tight">AI Generated Summary</label>
        <textarea 
          name="summary"
          defaultValue={post.summary}
          rows={2} 
          className="w-full border border-purple-100 dark:border-purple-900/30 rounded-xl p-4 bg-purple-50/20 dark:bg-purple-950/10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm italic" 
          placeholder="Edit the summary manually if needed..."
        ></textarea>
      </div>

      {/* Body */}
      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Internal Content Body (Markdown OK)</label>
        <textarea 
          name="body"
          defaultValue={post.body}
          required 
          rows={12} 
          className="w-full border border-gray-300 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono text-sm leading-relaxed" 
        ></textarea>
      </div>

      <div className="border-t dark:border-gray-800 pt-6 mt-2 flex items-center justify-end gap-6">
        <button 
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 font-bold text-gray-500 hover:text-gray-900 transition-colors"
        >
          Cancel
        </button>
        <button 
          disabled={isSubmitting} 
          type="submit" 
          className="bg-blue-600 text-white font-bold py-3 px-10 rounded-xl flex items-center gap-2 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 transition-all shadow-md active:scale-[0.98]"
        >
          {isSubmitting ? 'Updating...' : 'Update Article'}
        </button>
      </div>
    </form>
  );
}
