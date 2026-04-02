'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { uploadImage } from '@/utils/supabase/storage';
import { createPostAction } from './actions';

export default function CreatePostForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.target);
      const title = formData.get('title');
      const body = formData.get('body');
      
      let imageUrl = null;
      const file = fileInputRef.current?.files?.[0];
      
      if (file) {
        imageUrl = await uploadImage(file);
      }


      const postId = await createPostAction(title, body, imageUrl);
      
      // Navigate to the newly created post immediately
      router.push(`/posts/${postId}`);
    } catch (error) {
      console.error(error);
      alert('Failed to create post. See console for details.');
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      {/* Title Input */}
      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Post Title</label>
        <input 
          name="title"
          required 
          type="text" 
          className="w-full border border-gray-300 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-lg" 
          placeholder="E.g., The Future of Artificial Intelligence" 
        />
      </div>
      
      {/* Featured Image Input */}
      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Featured Image</label>
        
        {imagePreview && (
          <div className="mb-4 relative w-full rounded-xl overflow-hidden aspect-video border dark:border-gray-700">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            <button 
              type="button" 
              onClick={() => { setImagePreview(null); fileInputRef.current.value = ""; }}
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

      <div>
        <div className="flex justify-between items-end mb-2">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Document Body</label>
          <span className="text-xs text-gray-500 font-medium badge">Markdown Supported</span>
        </div>
        <textarea 
          name="body"
          required 
          rows={12} 
          className="w-full border border-gray-300 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono text-sm leading-relaxed" 
          placeholder="Start writing your amazing article right here..."
        ></textarea>
      </div>

      <div className="border-t dark:border-gray-800 pt-6 mt-2 flex items-center justify-between">
        <p className="text-sm text-gray-500 italic">An AI summary will be generated upon publishing.</p>
        <button 
          disabled={isSubmitting} 
          type="submit" 
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin text-xl leading-none">⟳</span> Publishing
            </>
          ) : 'Publish Post'}
        </button>
      </div>
    </form>
  );
}
