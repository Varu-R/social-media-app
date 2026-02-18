import { Client, Storage } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const storage = new Storage(client);
const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

export const storageService = {
  // Upload file to bucket
  async uploadFile(file, fileId) {
    try {
      const response = await storage.createFile(BUCKET_ID, fileId, file);
      return response;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Get file preview URL
  getFilePreview(fileId) {
    try {
      return storage.getFilePreview(BUCKET_ID, fileId);
    } catch (error) {
      console.error('Error getting preview:', error);
      return null;
    }
  },

  // Get file download URL
  getFileDownload(fileId) {
    try {
      return storage.getFileDownload(BUCKET_ID, fileId);
    } catch (error) {
      console.error('Error getting download:', error);
      return null;
    }
  },

  // Delete file
  async deleteFile(fileId) {
    try {
      await storage.deleteFile(BUCKET_ID, fileId);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  // List files in bucket
  async listFiles(limit = 25, offset = 0) {
    try {
      return await storage.listFiles(BUCKET_ID, undefined, limit, offset);
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  },
};

export { storage };
