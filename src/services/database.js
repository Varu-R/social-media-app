import { Client, Databases, Query } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const databases = new Databases(client);

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const USERS_COLLECTION = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;
const POSTS_COLLECTION = import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID;
const COMMENTS_COLLECTION = import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID;
const LIKES_COLLECTION = import.meta.env.VITE_APPWRITE_LIKES_COLLECTION_ID;

export const databaseService = {
  // ===== USER OPERATIONS =====
  
  // Create user profile
  async createUserProfile(userId, email, name) {
    try {
      const user = await databases.createDocument(
        DB_ID,
        USERS_COLLECTION,
        userId,
        {
          userId,
          email,
          name,
          bio: '',
          profileImage: '',
          createdAt: new Date().toISOString(),
        }
      );
      return user;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  },

  // Get user by ID
  async getUser(userId) {
    try {
      return await databases.getDocument(DB_ID, USERS_COLLECTION, userId);
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Update user profile
  async updateUserProfile(userId, data) {
    try {
      return await databases.updateDocument(DB_ID, USERS_COLLECTION, userId, data);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // ===== POST OPERATIONS =====

  // Create post
  async createPost(postId, userId, content, imageUrl = '') {
    try {
      const post = await databases.createDocument(
        DB_ID,
        POSTS_COLLECTION,
        postId,
        {
          postId,
          userId,
          content,
          imageUrl,
          likes: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );
      return post;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Get all posts (with pagination)
  async getPosts(limit = 10, offset = 0) {
    try {
      const posts = await databases.listDocuments(
        DB_ID,
        POSTS_COLLECTION,
        [
          Query.orderDesc('createdAt'),
          Query.limit(limit),
          Query.offset(offset),
        ]
      );
      return posts;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  // Get posts by user
  async getUserPosts(userId, limit = 10, offset = 0) {
    try {
      const posts = await databases.listDocuments(
        DB_ID,
        POSTS_COLLECTION,
        [
          Query.equal('userId', userId),
          Query.orderDesc('createdAt'),
          Query.limit(limit),
          Query.offset(offset),
        ]
      );
      return posts;
    } catch (error) {
      console.error('Error fetching user posts:', error);
      throw error;
    }
  },

  // Get single post
  async getPost(postId) {
    try {
      return await databases.getDocument(DB_ID, POSTS_COLLECTION, postId);
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  },

  // Update post
  async updatePost(postId, data) {
    try {
      return await databases.updateDocument(DB_ID, POSTS_COLLECTION, postId, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  // Delete post
  async deletePost(postId) {
    try {
      return await databases.deleteDocument(DB_ID, POSTS_COLLECTION, postId);
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  // ===== LIKE OPERATIONS =====

  // Check if user liked post
  async checkUserLike(postId, userId) {
    try {
      const likes = await databases.listDocuments(
        DB_ID,
        LIKES_COLLECTION,
        [
          Query.equal('postId', postId),
          Query.equal('userId', userId),
        ]
      );
      return likes.documents.length > 0 ? likes.documents[0].$id : null;
    } catch (error) {
      console.error('Error checking like:', error);
      return null;
    }
  },

  // Add like
  async addLike(postId, userId, likeId) {
    try {
      // Create like document
      await databases.createDocument(
        DB_ID,
        LIKES_COLLECTION,
        likeId,
        {
          likeId,
          postId,
          userId,
          createdAt: new Date().toISOString(),
        }
      );

      // Increment post likes count
      const post = await this.getPost(postId);
      await this.updatePost(postId, {
        likes: (post.likes || 0) + 1,
      });

      return true;
    } catch (error) {
      console.error('Error adding like:', error);
      throw error;
    }
  },

  // Remove like
  async removeLike(postId, likeId) {
    try {
      // Delete like document
      await databases.deleteDocument(DB_ID, LIKES_COLLECTION, likeId);

      // Decrement post likes count
      const post = await this.getPost(postId);
      await this.updatePost(postId, {
        likes: Math.max(0, (post.likes || 0) - 1),
      });

      return true;
    } catch (error) {
      console.error('Error removing like:', error);
      throw error;
    }
  },

  // ===== COMMENT OPERATIONS =====

  // Create comment
  async createComment(commentId, postId, userId, content) {
    try {
      const comment = await databases.createDocument(
        DB_ID,
        COMMENTS_COLLECTION,
        commentId,
        {
          commentId,
          postId,
          userId,
          content,
          createdAt: new Date().toISOString(),
        }
      );
      return comment;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  // Get comments for post
  async getComments(postId, limit = 20, offset = 0) {
    try {
      const comments = await databases.listDocuments(
        DB_ID,
        COMMENTS_COLLECTION,
        [
          Query.equal('postId', postId),
          Query.orderAsc('createdAt'),
          Query.limit(limit),
          Query.offset(offset),
        ]
      );
      return comments;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  // Delete comment
  async deleteComment(commentId) {
    try {
      return await databases.deleteDocument(DB_ID, COMMENTS_COLLECTION, commentId);
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },
};

export { databases, client };
