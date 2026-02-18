import React, { useState } from 'react';
import { usePosts } from '../../hooks/usePosts';
import PostCard from './PostCard';

const PostFeed = () => {
  const { useFetchPosts } = usePosts();
  const [page, setPage] = useState(0);
  const { data: postsData, isLoading, error } = useFetchPosts(page);

  const posts = postsData?.documents || [];

  const handleNextPage = () => {
    if (posts.length > 0) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage((prev) => prev - 1);
    }
  };

  const handlePostDelete = (postId) => {
    // Posts will be automatically refetched due to React Query invalidation
  };

  if (isLoading && posts.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
              <div className="flex-grow">
                <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6 text-center">
        <p className="text-red-600 dark:text-red-400">
          Error loading posts: {error.message}
        </p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="card p-12 text-center">
        <p className="text-slate-600 dark:text-slate-400">
          No posts yet. Be the first to share something!
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Posts List */}
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post.$id}
            post={post}
            onDelete={handlePostDelete}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={handlePrevPage}
          disabled={page === 0}
          className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        <span className="text-slate-600 dark:text-slate-400">
          Page {page + 1}
        </span>

        <button
          onClick={handleNextPage}
          disabled={posts.length < 10}
          className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default PostFeed;
