# 🚀 Social Media App - Complete Setup Guide

## Quick Start (5 minutes)

### Step 1: Clone/Download Project
```bash
# Navigate to your projects folder
cd your-projects-folder

# Clone the repo (or just copy the files)
git clone <your-repo-url>
cd social-media-app
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup Appwrite
**Go to [Appwrite Cloud](https://cloud.appwrite.io) or self-host**

1. Create a free account
2. Create a new project (note the **Project ID**)
3. Copy your **API Endpoint** (usually `https://cloud.appwrite.io/v1`)

### Step 4: Create Environment File
Create `.env.local` in your project root:
```
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here
VITE_APPWRITE_API_KEY=your_api_key_here (optional for client-side)
```

### Step 5: Setup Appwrite Collections
Go to **Appwrite Console → Database → Create Database**

**Create Database Named: `social_db`**

#### Collection 1: `users`
| Attribute | Type | Size | Required |
|-----------|------|------|----------|
| userId | String | 36 | ✓ |
| email | Email | - | ✓ |
| name | String | 255 | ✓ |
| bio | String | 500 | ✗ |
| profileImage | String | 2048 | ✗ |
| createdAt | DateTime | - | ✓ |

**Indexes:**
- userId (Unique, ASC)
- email (Unique, ASC)

#### Collection 2: `posts`
| Attribute | Type | Size | Required |
|-----------|------|------|----------|
| postId | String | 36 | ✓ |
| userId | String | 36 | ✓ |
| content | String | 2000 | ✓ |
| imageUrl | String | 2048 | ✗ |
| likes | Integer | - | ✓ (default: 0) |
| createdAt | DateTime | - | ✓ |
| updatedAt | DateTime | - | ✓ |

**Indexes:**
- postId (Unique, ASC)
- userId (ASC)
- createdAt (DESC)

#### Collection 3: `comments`
| Attribute | Type | Size | Required |
|-----------|------|------|----------|
| commentId | String | 36 | ✓ |
| postId | String | 36 | ✓ |
| userId | String | 36 | ✓ |
| content | String | 500 | ✓ |
| createdAt | DateTime | - | ✓ |

**Indexes:**
- commentId (Unique, ASC)
- postId (ASC)
- createdAt (DESC)

#### Collection 4: `likes`
| Attribute | Type | Size | Required |
|-----------|------|------|----------|
| likeId | String | 36 | ✓ |
| postId | String | 36 | ✓ |
| userId | String | 36 | ✓ |
| createdAt | DateTime | - | ✓ |

**Indexes:**
- likeId (Unique, ASC)
- postId (ASC)
- userId (ASC)

### Step 6: Create Storage Bucket
1. Go to **Storage** → **Create Bucket**
2. Name it: `post_images`
3. Set permissions to allow uploads (see below)

### Step 7: Setup Permissions
In Appwrite Console:

**For `posts` collection:**
- Database role: Anyone can read
- User-specific: Only owner can update/delete

**For `post_images` bucket:**
- Anyone can read files
- Authenticated users can upload

(The code handles this automatically via Appwrite SDK)

### Step 8: Run Development Server
```bash
npm run dev
```
Visit `http://localhost:5173`

### Step 9: Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts, set environment variables in Vercel dashboard
```

---

## Project Structure
```
social-media-app/
├── src/
│   ├── components/
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
│   │   ├── Common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── Toast.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Profile.jsx
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── services/
│   │   ├── auth.js
│   │   ├── database.js
│   │   └── storage.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── usePosts.js
│   │   └── useProfile.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.local (CREATE THIS)
├── package.json
└── vite.config.js
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | React 18 + Vite |
| **Styling** | Tailwind CSS |
| **UI Components** | Shadcn UI |
| **API Client** | Appwrite SDK |
| **State Management** | React Query + Context API |
| **Routing** | React Router v6 |
| **Backend** | Appwrite (BaaS) |

---

## Features Implemented

✅ User Authentication (Email/Password)
✅ Create, Read, Update, Delete Posts
✅ Image Upload for Posts
✅ Like/Unlike Posts
✅ Comment on Posts
✅ User Profiles (View & Edit)
✅ Dark/Light Mode
✅ Responsive Design (Mobile-First)
✅ Toast Notifications
✅ Loading States & Error Handling
✅ Infinite Feed (Pagination)
✅ Optimistic UI Updates

---

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code (if eslint is setup)
npm run lint
```

---

## Interview Tips

When asked about your code:

1. **Architecture**: "I used Appwrite as a Backend-as-a-Service to handle auth, database, and file storage. This lets me focus on the frontend without managing servers."

2. **State Management**: "React Query handles server state (posts, comments), while Context API manages client state (auth, dark mode). This separation keeps things clean."

3. **Security**: "Users can only modify their own posts/comments. Appwrite's permission system enforces this at the database level, not just the UI."

4. **Scalability**: "The architecture is ready to scale. If we hit limits with Appwrite, we could migrate to a custom backend using the same API interfaces."

5. **Performance**: "I use React Query's caching and optimistic updates. Likes/comments feel instant to the user while syncing in the background."

---

## Troubleshooting

### "Failed to connect to Appwrite"
- Check your `.env.local` file has correct credentials
- Verify Appwrite project is running/active
- Check CORS settings in Appwrite Console

### "Unauthorized" errors when creating posts
- Ensure your user is logged in (check browser console)
- Verify Appwrite permissions are set correctly
- Check that `userId` matches authenticated user ID

### Images not uploading
- Ensure `post_images` bucket exists in Storage
- Check file size limits (usually 10MB)
- Verify bucket permissions allow uploads

### Port 5173 already in use
```bash
npm run dev -- --port 3000
```

---

## Next Steps After Interview

1. Add real-time updates with WebSockets
2. Implement user follows/followers
3. Add hashtags and search
4. Implement notifications
5. Add direct messaging
6. Deploy to production with custom domain

Good luck! 🎯
