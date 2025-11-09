# SyncGaming Documentation

Welcome to the SyncGaming documentation! Here you'll find guides for everything from development to deployment.

## 📚 Quick Navigation

### 🚀 Getting Started
- **[Quick Start Guide](./DEV_QUICK_START.md)** - Fast track to running the project locally
- **[Local Development](./LOCAL_DEVELOPMENT.md)** - Complete dev environment setup with hot reload

### 🎮 Game Development
- **[Game Upload Guide](./FREE_GAME_UPLOAD.md)** - How to create and upload WebGL games
- **[Test Game Guide](./TEST_GAME_GUIDE.md)** - Example game setup and testing
- **[Alternative Storage](./ALTERNATIVE_STORAGE.md)** - Cloud storage alternatives (Cloudinary, etc.)

### 👨‍💼 Administration
- **[Admin Guide](./ADMIN_GUIDE.md)** - Admin dashboard and user management
- **[User Management](./ADMIN_GUIDE.md)** - Setting up admin users and custom claims

### 🌐 Deployment
- **[Deployment Overview](./DEPLOYMENT_README.md)** - Full deployment guide
- **[Railway + Netlify Setup](./RAILWAY_NETLIFY_DEPLOY.md)** - Free deployment on Railway & Netlify
- **[Quick Deploy](./QUICK_START_DEPLOY.md)** - Fast deployment checklist
- **[Deploy Checklist](./DEPLOY_CHECKLIST.md)** - Pre-deployment verification

### 🔧 Troubleshooting
- **[CORS & Firebase Fix](./FIREBASE_CORS_FIX.md)** - Solving CORS and CSP issues
- **[Firebase Storage Alternative](./FREE_GAME_UPLOAD.md)** - Free file storage solutions

---

## 📋 Table of Contents by Topic

### Development
```
docs/
├── DEV_QUICK_START.md           # Start here for local dev
├── LOCAL_DEVELOPMENT.md         # Detailed dev setup
└── TEST_GAME_GUIDE.md          # Testing example games
```

### Games & Uploads
```
docs/
├── FREE_GAME_UPLOAD.md         # Game upload & storage
└── ALTERNATIVE_STORAGE.md      # Cloud storage options
```

### Administration
```
docs/
└── ADMIN_GUIDE.md              # Admin features & setup
```

### Deployment
```
docs/
├── DEPLOYMENT_README.md        # Full deployment guide
├── RAILWAY_NETLIFY_DEPLOY.md  # Railway + Netlify setup
├── QUICK_START_DEPLOY.md      # Quick deployment
└── DEPLOY_CHECKLIST.md        # Pre-deploy checklist
```

### Troubleshooting
```
docs/
└── FIREBASE_CORS_FIX.md        # CORS & CSP issues
```

---

## 🎯 Common Tasks

### I want to...

**...start developing locally**
→ Read: [Quick Start Guide](./DEV_QUICK_START.md)

**...create and upload a game**
→ Read: [Game Upload Guide](./FREE_GAME_UPLOAD.md)

**...set up an admin user**
→ Read: [Admin Guide](./ADMIN_GUIDE.md)

**...deploy the app to production**
→ Read: [Deployment Overview](./DEPLOYMENT_README.md)

**...fix CORS or CSP errors**
→ Read: [CORS & Firebase Fix](./FIREBASE_CORS_FIX.md)

**...use Cloudinary instead of Firestore**
→ Read: [Alternative Storage](./ALTERNATIVE_STORAGE.md)

---

## 🏗️ Project Structure

```
sync-gaming/
├── docs/                    # Documentation (you are here)
├── games/                   # WebGL games directory
├── src/                     # React frontend code
├── backend/                 # Express.js backend
├── public/                  # Static files
├── README.md               # Main README
└── package.json            # Dependencies
```

---

## 🔑 Key Technologies

- **Frontend**: React 19, Framer Motion, Tailwind CSS
- **Backend**: Express.js, Firebase Admin SDK
- **Database**: Firestore
- **Auth**: Firebase Authentication
- **Hosting**: Netlify (frontend), Railway (backend)
- **Storage**: Firestore Base64 (free alternative to Firebase Storage)

---

## 📖 Reading Order for New Developers

1. **Main [README.md](../README.md)** - Project overview
2. **[Quick Start Guide](./DEV_QUICK_START.md)** - Get it running locally
3. **[Local Development](./LOCAL_DEVELOPMENT.md)** - Deep dive into dev setup
4. **[Game Upload Guide](./FREE_GAME_UPLOAD.md)** - Learn the features
5. **[Deployment Overview](./DEPLOYMENT_README.md)** - When ready to deploy

---

## ❓ FAQ

**Q: How do I run the project locally?**
A: `npm run dev` - This starts both frontend and backend with hot reload

**Q: How do I create a game?**
A: See [Game Upload Guide](./FREE_GAME_UPLOAD.md)

**Q: How do I set up admin users?**
A: See [Admin Guide](./ADMIN_GUIDE.md)

**Q: What's the free tier deployment?**
A: Netlify (frontend) + Railway (backend) - See [Deployment Overview](./DEPLOYMENT_README.md)

**Q: How do I upload games without Firebase Storage costs?**
A: We use Firestore Base64 encoding - See [Game Upload Guide](./FREE_GAME_UPLOAD.md)

---

## 📞 Support

- Check the relevant documentation file
- Search the docs for your issue
- Review [CORS & Firebase Fix](./FIREBASE_CORS_FIX.md) for common errors
- Open an issue on GitHub

---

**Last Updated**: November 2025
