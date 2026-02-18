# 🚀 Full-Stack Social Media App

A modern, responsive social media web application built with React, Tailwind CSS, and Appwrite. Perfect for interviews!

## 🎯 Features

✅ **User Authentication** - Email/Password registration and login
✅ **Create Posts** - Share text and images with the community
✅ **Like Posts** - Show appreciation for posts (optimistic updates)
✅ **Comment** - Engage in discussions on posts
✅ **User Profiles** - View and edit your profile with bio and profile picture
✅ **Dark Mode** - Toggle between light and dark themes
✅ **Responsive Design** - Works perfectly on mobile, tablet, and desktop
✅ **Real-time Updates** - React Query handles all data synchronization
✅ **Error Handling** - Graceful error messages throughout the app
✅ **Loading States** - Skeleton screens while data loads

## 🛠️ Tech Stack

**Frontend:**
- React 18 with Vite (blazing fast development)
- Tailwind CSS (utility-first styling)
- React Router v6 (client-side routing)
- React Query (server state management)
- React Context API (client state management)

**Backend:**
- Appwrite Cloud (BaaS - Backend as a Service)
  - Authentication (Email/Password)
  - Database (Collections for posts, comments, likes, users)
  - File Storage (for image uploads)
  - Security Rules & Permissions

## ⚡ Quick Start (5 Minutes)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd social-media-app
npm install
```

### 2. Setup Appwrite Account
- Go to [Appwrite Cloud](https://cloud.appwrite.io)
- Create a free account
- Create a new project
- Note your **Project ID** and **API Endpoint**

### 3. Create `.env.local` File
Copy `.env.local.example` and update with your Appwrite credentials:
```bash
cp .env.local.example .env.local
```

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here
VITE_APPWRITE_DATABASE_ID=social_db
VITE_APPWRITE_USERS_COLLECTION_ID=users
VITE_APPWRITE_POSTS_COLLECTION_ID=posts
VITE_APPWRITE_COMMENTS_COLLECTION_ID=comments
VITE_APPWRITE_LIKES_COLLECTION_ID=likes
VITE_APPWRITE_BUCKET_ID=post_images
```

### 4. Setup Appwrite Database

Go to **Appwrite Console → Database**

#### Step 1: Create Database
- Click "Create Database"
- Name: `social_db`
- Save the Database ID

#### Step 2: Create Collections

**Collection 1: `users`**
```
Attributes:
- userId (String, 36 chars, Required, Unique)
- email (Email, Required, Unique)
- name (String, 255 chars, Required)
- bio (String, 500 chars)
- profileImage (String, 2048 chars)
- createdAt (DateTime, Required)

Indexes:
- userId (Unique, Ascending)
- email (Unique, Ascending)
```

**Collection 2: `posts`**
```
Attributes:
- postId (String, 36 chars, Required, Unique)
- userId (String, 36 chars, Required)
- content (String, 2000 chars, Required)
- imageUrl (String, 2048 chars)
- likes (Integer, Default: 0, Required)
- createdAt (DateTime, Required)
- updatedAt (DateTime, Required)

Indexes:
- postId (Unique, Ascending)
- userId (Ascending)
- createdAt (Descending)
```

**Collection 3: `comments`**
```
Attributes:
- commentId (String, 36 chars, Required, Unique)
- postId (String, 36 chars, Required)
- userId (String, 36 chars, Required)
- content (String, 500 chars, Required)
- createdAt (DateTime, Required)

Indexes:
- commentId (Unique, Ascending)
- postId (Ascending)
- createdAt (Descending)
```

**Collection 4: `likes`**
```
Attributes:
- likeId (String, 36 chars, Required, Unique)
- postId (String, 36 chars, Required)
- userId (String, 36 chars, Required)
- createdAt (DateTime, Required)

Indexes:
- likeId (Unique, Ascending)
- postId (Ascending)
- userId (Ascending)
```

#### Step 3: Create Storage Bucket
- Go to **Storage**
- Click "Create Bucket"
- Name: `post_images`
- Set to Public (allow read access)

#### Step 4: Set Permissions
**For each Collection:**
- Database role: Everyone can read
- For create/update/delete: Only authenticated users

The code handles permissions automatically!

### 5. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:5173`

### 6. Test the App
Create a test account and start posting!

## 📁 Project Structure

```
social-media-app/
├── src/
│   ├── components/          # React components
│   │   ├── Auth/
│   │   │   ├── LoginForm.jsx
│   │   │   └── SignupForm.jsx
│   │   ├── Posts/
│   │   │   ├── CreatePost.jsx
│   │   │   ├── PostCard.jsx
│   │   │   ├── PostFeed.jsx
│   │   │   └── CommentSection.jsx
│   │   ├── Profile/
│   │   │   ├── ProfileCard.jsx
│   │   │   └── EditProfile.jsx
│   │   └── Common/
│   │       └── Navbar.jsx
│   ├── pages/               # Page components
│   │   ├── Home.jsx
│   │   ├── Profile.jsx
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── services/            # API services
│   │   ├── auth.js          # Authentication
│   │   ├── database.js      # Database operations
│   │   └── storage.js       # File uploads
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── usePosts.js
│   │   └── useProfile.js
│   ├── context/             # React Context
│   │   └── AuthContext.jsx
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── .env.local               # Environment variables
├── .env.local.example       # Example environment file
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── index.html
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Set Environment Variables in Vercel Dashboard**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`
   - Redeploy

### Deploy to Netlify

1. **Build the project**
```bash
npm run build
```

2. **Connect to GitHub**
   - Push code to GitHub
   - Go to [Netlify](https://netlify.com)
   - Connect GitHub repository
   - Set environment variables in Netlify

3. **Deploy**
   - Netlify auto-deploys on push to main branch

## 📝 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Format code (if eslint is setup)
npm run lint
```

## 🔐 Security Features

- ✅ User authentication with secure session handling
- ✅ Users can only modify their own posts/comments
- ✅ Database permissions enforced at the backend
- ✅ File upload validation
- ✅ Input sanitization
- ✅ Protected routes (redirect unauthenticated users)
- ✅ Secure password handling via Appwrite

## 🎤 Interview Talking Points

### Architecture
"I used Appwrite as a BaaS to eliminate the need for backend development. This lets me focus on the frontend while having a production-ready backend."

### State Management
"I use React Query for server state (fetching posts, comments) and Context API for client state (authentication, theme). This separation keeps the code clean and maintainable."

### Performance
"React Query handles caching automatically. Optimistic updates make likes/comments feel instant. Tailwind CSS with tree-shaking keeps the bundle size small."

### Scalability
"The architecture is modular. If we hit Appwrite limits, we could swap it with a custom backend without changing much code since I abstracted all API calls into service files."

### Real-World Features
"The app includes authentication, file uploads, real-time updates, comments, likes, and user profiles - basically a real social media platform."

## 🐛 Troubleshooting

### "Failed to connect to Appwrite"
- Verify `.env.local` has correct credentials
- Check Appwrite project is active
- Verify CORS settings in Appwrite Console

### "Unauthorized" errors
- Ensure user is logged in
- Check Appwrite collection permissions
- Verify `userId` matches authenticated user

### "Images not uploading"
- Ensure `post_images` bucket exists
- Check file size (typically 10MB max)
- Verify bucket permissions allow uploads

### Port 5173 already in use
```bash
npm run dev -- --port 3000
```

## 📚 Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Query](https://tanstack.com/query)
- [Vite](https://vitejs.dev)

## 🎯 Next Steps (After Interview)

1. Add real-time updates with WebSockets
2. Implement user follow/followers system
3. Add hashtags and search functionality
4. Push notifications
5. Direct messaging
6. Infinite scroll pagination
7. Image compression before upload

## 📄 License

MIT License - feel free to use this for your portfolio!

---

**Built with ❤️ for your interview. Good luck! 🚀**
