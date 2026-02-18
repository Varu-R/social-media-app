import React from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useProfile } from '../../hooks/useProfile';

const ProfileCard = ({ userId, onEditClick }) => {
  const { user: currentUser } = useAuthContext();
  const { useFetchUserProfile } = useProfile();
  const { data: profile, isLoading } = useFetchUserProfile(userId);

  const isOwnProfile = currentUser?.id === userId;

  if (isLoading) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="w-24 h-24 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-4"></div>
        <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-1/2 mx-auto mb-4"></div>
        <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-3/4 mx-auto"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="card p-6 text-center">
        <p className="text-slate-600 dark:text-slate-400">User not found</p>
      </div>
    );
  }

  return (
    <div className="card p-8 text-center">
      {/* Avatar */}
      <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
        {profile.profileImage ? (
          <img
            src={profile.profileImage}
            alt={profile.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-white text-4xl font-bold">
            {profile.name[0].toUpperCase()}
          </span>
        )}
      </div>

      {/* Name */}
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
        {profile.name}
      </h2>

      {/* Email */}
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
        {profile.email}
      </p>

      {/* Bio */}
      {profile.bio && (
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          {profile.bio}
        </p>
      )}

      {/* Edit Button */}
      {isOwnProfile && (
        <button
          onClick={onEditClick}
          className="btn-primary"
        >
          Edit Profile
        </button>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">0</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Posts</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">0</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Followers</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">0</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Following</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
