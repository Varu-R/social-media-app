import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useProfile } from '../../hooks/useProfile';

const EditProfile = ({ userId, onCancel }) => {
  const { useUpdateProfile, useFetchUserProfile } = useProfile();
  const updateProfile = useUpdateProfile();
  const { data: profile, isLoading } = useFetchUserProfile(userId);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setBio(profile.bio || '');
      if (profile.profileImage) {
        setPreviewUrl(profile.profileImage);
      }
    }
  }, [profile]);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Name cannot be empty');
      return;
    }

    try {
      await updateProfile.mutateAsync({
        userId,
        name: name.trim(),
        bio: bio.trim(),
        profileImage,
      });
      onCancel();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <div className="card p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-1/4"></div>
          <div className="h-10 bg-slate-300 dark:bg-slate-700 rounded"></div>
          <div className="h-10 bg-slate-300 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Edit Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image */}
        <div className="text-center">
          <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile preview"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-4xl">📷</span>
            )}
          </div>
          <label className="btn-primary inline-block cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            Change Photo
          </label>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="Your name"
            disabled={updateProfile.isPending}
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="input-field resize-none"
            placeholder="Tell us about yourself"
            rows="4"
            disabled={updateProfile.isPending}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {bio.length}/500
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 btn-secondary"
            disabled={updateProfile.isPending}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
