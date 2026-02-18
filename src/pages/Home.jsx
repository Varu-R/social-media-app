import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import CreatePost from '../components/Posts/CreatePost';
import PostFeed from '../components/Posts/PostFeed';

const Home = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="container-lg">
        <div className="max-w-2xl mx-auto">
          {isAuthenticated ? (
            <>
              <CreatePost />
              <PostFeed />
            </>
          ) : (
            <div className="card p-12 text-center">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Welcome to Social
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Sign in to see posts from your friends and share your own!
              </p>
              <a
                href="/login"
                className="btn-primary inline-block"
              >
                Get Started
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
