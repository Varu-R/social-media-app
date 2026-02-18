import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { databaseService } from '../services/database';
import { storageService } from '../services/storage';
import { v4 as uuidv4 } from 'uuid';

export const useProfile = () => {
  const queryClient = useQueryClient();

  // Fetch user profile
  const useFetchUserProfile = (userId) => {
    return useQuery({
      queryKey: ['userProfile', userId],
      queryFn: () => databaseService.getUser(userId),
      enabled: !!userId,
    });
  };

  // Update profile mutation
  const useUpdateProfile = () => {
    return useMutation({
      mutationFn: async ({ userId, name, bio, profileImage }) => {
        let imageUrl = '';

        // Upload profile image if provided
        if (profileImage && typeof profileImage === 'object') {
          const fileId = uuidv4();
          await storageService.uploadFile(profileImage, fileId);
          imageUrl = storageService.getFilePreview(fileId).href;
        }

        // Update user profile
        const updateData = {
          name,
          bio,
          ...(imageUrl && { profileImage: imageUrl }),
        };

        return databaseService.updateUserProfile(userId, updateData);
      },
      onSuccess: (_, { userId }) => {
        queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      },
    });
  };

  // Create user profile
  const useCreateUserProfile = () => {
    return useMutation({
      mutationFn: ({ userId, email, name }) =>
        databaseService.createUserProfile(userId, email, name),
      onSuccess: (_, { userId }) => {
        queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
      },
    });
  };

  return {
    useFetchUserProfile,
    useUpdateProfile,
    useCreateUserProfile,
  };
};
