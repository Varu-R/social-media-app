import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { databaseService } from '../services/database';
import { storageService } from '../services/storage';
import { v4 as uuidv4 } from 'uuid';

export const usePosts = () => {
  const queryClient = useQueryClient();

  // Fetch all posts
  const useFetchPosts = (page = 0) => {
    return useQuery({
      queryKey: ['posts', page],
      queryFn: () => databaseService.getPosts(10, page * 10),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  // Fetch user's posts
  const useFetchUserPosts = (userId) => {
    return useQuery({
      queryKey: ['userPosts', userId],
      queryFn: () => databaseService.getUserPosts(userId, 20),
      enabled: !!userId,
    });
  };

  // Fetch single post
  const useFetchPost = (postId) => {
    return useQuery({
      queryKey: ['post', postId],
      queryFn: () => databaseService.getPost(postId),
      enabled: !!postId,
    });
  };

  // Create post mutation
  const useCreatePost = () => {
    return useMutation({
      mutationFn: async ({ userId, content, file }) => {
        let imageUrl = '';
        
        // Upload image if provided
        if (file) {
          const fileId = uuidv4();
          await storageService.uploadFile(file, fileId);
          imageUrl = storageService.getFilePreview(fileId).href;
        }

        // Create post
        const postId = uuidv4();
        const post = await databaseService.createPost(postId, userId, content, imageUrl);
        return post;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      },
    });
  };

  // Update post mutation
  const useUpdatePost = () => {
    return useMutation({
      mutationFn: ({ postId, data }) => databaseService.updatePost(postId, data),
      onSuccess: (_, { postId }) => {
        queryClient.invalidateQueries({ queryKey: ['post', postId] });
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      },
    });
  };

  // Delete post mutation
  const useDeletePost = () => {
    return useMutation({
      mutationFn: (postId) => databaseService.deletePost(postId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      },
    });
  };

  // Like post mutation
  const useLikePost = () => {
    return useMutation({
      mutationFn: async ({ postId, userId }) => {
        const existingLike = await databaseService.checkUserLike(postId, userId);
        
        if (existingLike) {
          // Unlike
          await databaseService.removeLike(postId, existingLike);
          return { liked: false };
        } else {
          // Like
          const likeId = uuidv4();
          await databaseService.addLike(postId, userId, likeId);
          return { liked: true };
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      },
    });
  };

  return {
    useFetchPosts,
    useFetchUserPosts,
    useFetchPost,
    useCreatePost,
    useUpdatePost,
    useDeletePost,
    useLikePost,
  };
};
