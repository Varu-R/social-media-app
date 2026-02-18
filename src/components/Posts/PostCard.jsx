import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { usePosts } from '../../hooks/usePosts';
import { databaseService } from '../../services/database';
import CommentSection from './CommentSection';

const PostCard = ({ post, onDelete }) => {
  const { user } = useAuthContext();
  const { useLikePost } = usePosts();
  const likePost = useLikePost();

  const [showComments, setShowComments] = useState(false);
  const [userLiked, setUserLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);

  const isOwner = user?.$id === post.userId;

  const handleLike = async () => {
    try {
      const liked = !userLiked;
      setUserLiked(liked);
      setLikes(liked ? likes + 1 : Math.max(0, likes - 1));

      await likePost.mutateAsync({
        postId: post.$id,
        userId: user.$id,
      });
    } catch (error) {
      setUserLiked(!userLiked);
      setLikes(userLiked ? likes + 1 : Math.max(0, likes - 1));
      console.error('Error liking post:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await databaseService.deletePost(post.$id);
        onDelete?.(post.$id);
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="card mb-4 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">
              {post.userId.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">
              {post.userId}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>

        {isOwner && (
          <button
            onClick={handleDelete}
            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition"
            title="Delete post"
          >
            🗑️
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-slate-900 dark:text-white whitespace-pre-wrap break-words">
          {post.content}
        </p>

        {/* Image */}
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt="Post"
            className="w-full h-96 object-cover rounded-lg mt-4"
          />
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex gap-4">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition"
        >
          <span className={userLiked ? 'text-lg' : 'text-xl'}>
            {userLiked ? '❤️' : '🤍'}
          </span>
          <span className="text-sm">{likes}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          <span className="text-xl">💬</span>
          <span className="text-sm">Comment</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && <CommentSection postId={post.$id} />}
    </div>
  );
};

export default PostCard;