import React, { useState, useRef } from 'react';
import { usePosts } from '../../hooks/usePosts';
import { useAuthContext } from '../../context/AuthContext';
import { v4 as uuidv4 } from 'uuid';

const CreatePost = () => {
  const { user } = useAuthContext();
  const { useCreatePost } = usePosts();
  const createPost = useCreatePost();
  
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('Please write something');
      return;
    }

    try {
      setIsLoading(true);
      await createPost.mutateAsync({
        userId: user.$id,
        content: content.trim(),
        file: selectedFile,
      });
      setContent('');
      setSelectedFile(null);
      setPreviewUrl('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm p-6 mb-6">
      {/* User Avatar + Name */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </span>
        </div>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {user?.name || 'User'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full">
        {/* Textarea */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-4"
          rows="3"
          disabled={isLoading}
        />

        {/* Image Preview */}
        {previewUrl && (
          <div className="relative mb-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
            >
              ✕
            </button>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-between">
          {/* Upload Image Button */}
          <label className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
              disabled={isLoading}
            />
            <span className="text-2xl">🖼️</span>
          </label>

          {/* Post Button */}
          <button
            type="submit"
            disabled={isLoading || !content.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;