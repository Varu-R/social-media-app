import { Client, Account, ID } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);

export const authService = {
  // Register new user
  async register(email, password, name) {
    try {
      const user = await account.create(ID.unique(), email, password, name);
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Login user
  async login(email, password) {
    try {
      const session = await account.createEmailSession(email, password);
      return session;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      return await account.get();
    } catch (error) {
      return null;
    }
  },

  // Logout user
  async logout() {
    try {
      await account.deleteSession('current');
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Check if user is logged in
  async isLoggedIn() {
    try {
      await account.get();
      return true;
    } catch (error) {
      return false;
    }
  },
};

export { client };