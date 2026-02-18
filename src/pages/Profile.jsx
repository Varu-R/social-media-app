import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { usePosts } from '../hooks/usePosts';
import ProfileCard from '../components/Profile/ProfileCard';
import EditProfile from '../components/Profile/EditProfile';
import PostCard from '../components/Posts/PostCard';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuthContext();
  const { useFetchUserPosts } = usePosts();
  const [isEditing, setIsEditing] = useState(false);

  const { data: postsData, isLoading: postsLoading } = useFetchUserPosts(userId);
  const posts = postsData?.documents || [];

  const isOwnProfile = currentUser?.id === userId;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="container-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar - Profile Card */}
          <div className="md:col-span-1">
            {isEditing ? (
              <EditProfile
                userId={userId}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <ProfileCard
                userId={userId}
                onEditClick={() => setIsEditing(true)}
              />
            )}
          </div>

          {/* Main Content - User Posts */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              {isOwnProfile ? 'Your Posts' : 'Posts'}
            </h2>

            {postsLoading ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="card p-6 animate-pulse">
                    <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-slate-600 dark:text-slate-400">
                  {isOwnProfile
                    ? 'You haven\'t posted anything yet'
                    : 'No posts yet'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard key={post.$id} post={post} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
