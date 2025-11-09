# SyncGaming 🎮# Getting Started with Create React App



A modern platform for sharing and playing WebGL games online. Built with React, Express.js, and Firebase.This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).



![License](https://img.shields.io/badge/license-MIT-blue.svg)## Available Scripts

![Node](https://img.shields.io/badge/node-18.x-green.svg)

![React](https://img.shields.io/badge/react-19-61dafb.svg)In the project directory, you can run:



---### `npm start`



## ✨ FeaturesRuns the app in the development mode.\

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

- 🎮 **Play WebGL games** directly in your browser

- 📤 **Upload games** with admin dashboardThe page will reload when you make changes.\

- 👥 **User authentication** with FirebaseYou may also see any lint errors in the console.

- 🔐 **Admin management** system with custom claims

- 📱 **Responsive design** with Tailwind CSS### `npm test`

- ✨ **Smooth animations** with Framer Motion

- 🚀 **Hot reload** for developmentLaunches the test runner in the interactive watch mode.\

- 💾 **Free storage** using Firestore Base64 encodingSee the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.



---### `npm run build`



## 🚀 Quick StartBuilds the app for production to the `build` folder.\

It correctly bundles React in production mode and optimizes the build for the best performance.

### Prerequisites

- Node.js 18+The build is minified and the filenames include the hashes.\

- npm or yarnYour app is ready to be deployed!

- Firebase account (free tier works)

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Development

### `npm run eject`

```bash

# Install dependencies**Note: this is a one-way operation. Once you `eject`, you can't go back!**

npm install

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

# Start development servers (frontend + backend with hot reload)

npm run devInstead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.



# Frontend: http://localhost:3000You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

# Backend:  http://localhost:5000

```## Learn More



### Production DeploymentYou can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).



```bashTo learn React, check out the [React documentation](https://reactjs.org/).

# Build the frontend

npm run build### Code Splitting



# Deploy frontend to NetlifyThis section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

# Deploy backend to Railway

```### Analyzing the Bundle Size



See **[Deployment Guide](./docs/DEPLOYMENT_README.md)** for detailed instructions.This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)



---### Making a Progressive Web App



## 📚 DocumentationThis section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)



All documentation is organized in the `docs/` folder:### Advanced Configuration



| Topic | Guide |This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

|-------|-------|

| **Getting Started** | [Quick Start](./docs/DEV_QUICK_START.md) |### Deployment

| **Local Development** | [Dev Setup](./docs/LOCAL_DEVELOPMENT.md) |

| **Game Upload** | [Game Guide](./docs/FREE_GAME_UPLOAD.md) |This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

| **Admin Features** | [Admin Guide](./docs/ADMIN_GUIDE.md) |

| **Deployment** | [Deploy Guide](./docs/DEPLOYMENT_README.md) |### `npm run build` fails to minify

| **Troubleshooting** | [CORS/Firebase Fix](./docs/FIREBASE_CORS_FIX.md) |

| **Full Index** | [All Docs](./docs/INDEX.md) |This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


---

## 🏗️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Framer Motion 12** - Animations
- **Tailwind CSS 3** - Styling
- **React Router 7** - Navigation
- **Firebase SDK 12** - Auth & Database

### Backend
- **Express.js 5** - API server
- **Firebase Admin SDK 13** - Authentication
- **Firestore** - NoSQL database

### Hosting
- **Netlify** - Frontend (free tier)
- **Railway** - Backend (free tier)

### Storage
- **Firestore Base64** - Game files (free, no external storage needed)

---

## 📁 Project Structure

```
sync-gaming/
├── docs/                    # 📚 Documentation
│   ├── INDEX.md            # Doc index & quick links
│   ├── DEV_QUICK_START.md
│   ├── LOCAL_DEVELOPMENT.md
│   ├── ADMIN_GUIDE.md
│   └── ...more guides
│
├── src/                     # 🎨 React Frontend
│   ├── pages/
│   │   ├── SignIn.js
│   │   ├── Auth.js
│   │   ├── AdminDashboard.js
│   │   └── GamePlayer.js
│   ├── components/
│   │   ├── Navbar.js
│   │   └── AdminManagement.js
│   └── App.js
│
├── backend/                 # 🔧 Express Backend
│   ├── server.js           # API endpoints
│   └── .env.development
│
├── games/                   # 🎮 WebGL Games
│   ├── cube-game/          # Example game
│   └── README.md           # Game upload guide
│
├── package.json            # Dependencies
└── README.md              # This file
```

---

## 🎮 Creating Games

1. **Create game folder** in `/games`:
   ```bash
   mkdir games/my-game
   ```

2. **Add `index.html`** and game files

3. **Package it**:
   ```bash
   npm run package-game my-game
   ```

4. **Upload** through Admin Panel

See **[Game Upload Guide](./docs/FREE_GAME_UPLOAD.md)** for details.

---

## 👨‍💼 Admin Setup

### Setting Up Your First Admin

1. **Sign up** on the platform
2. **Get your user ID** from Firebase Console
3. **Run script** to grant admin:
   ```bash
   node set-admin.js
   ```
4. **Refresh** the page - you'll see Admin Panel

See **[Admin Guide](./docs/ADMIN_GUIDE.md)** for full instructions.

---

## 🌐 Live Demo

- **Frontend**: https://hilarious-crostata-bb59b0.netlify.app
- **Backend API**: https://sync-gaming-backend-production.up.railway.app

---

## 📝 Available Scripts

### Development
```bash
npm run dev              # Start frontend + backend with hot reload
npm run start            # Start frontend only
npm run backend          # Start backend only
```

### Build & Deploy
```bash
npm run build            # Build React for production
npm run package-games    # Create ZIP files for all games
npm run package-game     # Create ZIP for specific game
```

---

## 🔒 Environment Variables

### Frontend (`.env.production`)
```
REACT_APP_API_URL=https://sync-gaming-backend-production.up.railway.app/api
```

### Backend (`backend/.env.development`)
```
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

---

## 🚀 Deployment

### Option 1: Free (Netlify + Railway)
- **Frontend**: Netlify (free tier, generous limits)
- **Backend**: Railway (free tier with $5/month credit)

See **[Railway + Netlify Guide](./docs/RAILWAY_NETLIFY_DEPLOY.md)**

### Option 2: Full Setup
See **[Full Deployment Guide](./docs/DEPLOYMENT_README.md)**

---

## 🎯 Key Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev servers with hot reload |
| `npm run build` | Build for production |
| `npm run package-games` | Create ZIPs of all games |
| `npm run package-game my-game` | Create ZIP of specific game |
| `node set-admin.js` | Grant admin privileges |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Push and create a Pull Request

---

## 📖 Learning Resources

- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com)
- [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)

---

## ❓ FAQ

**Q: How much does it cost to run?**
A: Nothing! We use free tiers of Netlify, Railway, Firebase, and Firestore.

**Q: Can I use my own database?**
A: Yes, but Firebase/Firestore is the easiest free option.

**Q: What games can I upload?**
A: Any WebGL game (Babylon.js, Three.js, vanilla WebGL, etc.)

**Q: How large can games be?**
A: Max 50MB per game (practical limit ~1-2MB with Firestore)

**Q: Can I monetize games?**
A: Yes, it's your platform - do what you want!

See **[Full FAQ](./docs/INDEX.md#-faq)** for more.

---

## 📞 Support

- 📚 **Read the docs**: [docs/INDEX.md](./docs/INDEX.md)
- 🐛 **Report bugs**: GitHub Issues
- 💬 **Questions**: Check relevant doc file

---

## 📄 License

MIT © 2025 SyncGaming

---

## 🙌 Acknowledgments

Built with ❤️ for the gaming community.

Special thanks to:
- Firebase for the free-tier platform
- Netlify & Railway for free hosting
- React, Express.js, and the open-source community

---

**Get started now**: `npm run dev` 🚀

For detailed setup: See [Quick Start Guide](./docs/DEV_QUICK_START.md)
