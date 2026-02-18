import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '../../context/AuthContext';
import { databaseService } from '../../services/database';
import { v4 as uuidv4 } from 'uuid';

const CommentSection = ({ postId }) => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch comments
  const { data: commentsData, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => databaseService.getComments(postId),
  });

  const comments = commentsData?.documents || [];

  // Create comment mutation
  const createCommentMutation = useMutation({
  mutationFn: async (content) => {
    const commentId = uuidv4();
    return databaseService.createComment(commentId, postId, user.$id, content);
  },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setCommentText('');
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId) => databaseService.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    try {
      setIsSubmitting(true);
      await createCommentMutation.mutateAsync(commentText.trim());
    } catch (error) {
      console.error('Error creating comment:', error);
      alert('Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (window.confirm('Delete this comment?')) {
      try {
        await deleteCommentMutation.mutateAsync(commentId);
      } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Failed to delete comment');
      }
    }
  };

  return (
    <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-800">
      {/* Comment Input */}
      <form onSubmit={handleSubmit} className="mb-4 flex gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </span>
        </div>
        <div className="flex-grow flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-grow input-field text-sm"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting || !commentText.trim()}
            className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Post
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.$id} className="flex gap-2 text-sm">
              <div className="w-6 h-6 bg-slate-300 dark:bg-slate-700 rounded-full flex-shrink-0"></div>
              <div className="flex-grow bg-slate-100 dark:bg-slate-800 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {comment.userId}
                  </p>
                  {user?.id === comment.userId && (
                    <button
                      onClick={() => handleDelete(comment.$id)}
                      className="text-red-600 hover:text-red-700 transition"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <p className="text-slate-700 dark:text-slate-300">{comment.content}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
