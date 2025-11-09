# SyncGaming 🎮# SyncGaming 🎮# Getting Started with Create React App



A modern platform for sharing and playing WebGL games online. Built with React, Express.js, and Firebase.



![License](https://img.shields.io/badge/license-MIT-blue.svg)A modern platform for sharing and playing WebGL games online. Built with React, Express.js, and Firebase.This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

![Node](https://img.shields.io/badge/node-18.x-green.svg)

![React](https://img.shields.io/badge/react-19-61dafb.svg)



---![License](https://img.shields.io/badge/license-MIT-blue.svg)## Available Scripts



## ✨ Features![Node](https://img.shields.io/badge/node-18.x-green.svg)



- 🎮 **Play WebGL games** directly in your browser![React](https://img.shields.io/badge/react-19-61dafb.svg)In the project directory, you can run:

- 📤 **Upload games** with admin dashboard

- 👥 **User authentication** with Firebase

- 🔐 **Admin management** system with custom claims

- 📱 **Responsive design** with Tailwind CSS---### `npm start`

- ✨ **Smooth animations** with Framer Motion

- 🚀 **Hot reload** for development

- 💾 **Free storage** using Firestore Base64 encoding

## ✨ FeaturesRuns the app in the development mode.\

---

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 🚀 Quick Start

- 🎮 **Play WebGL games** directly in your browser

### Prerequisites

- Node.js 18+- 📤 **Upload games** with admin dashboardThe page will reload when you make changes.\

- npm or yarn

- Firebase account (free tier works)- 👥 **User authentication** with FirebaseYou may also see any lint errors in the console.



### Development- 🔐 **Admin management** system with custom claims



```bash- 📱 **Responsive design** with Tailwind CSS### `npm test`

# Install dependencies

npm install- ✨ **Smooth animations** with Framer Motion



# Start development servers (frontend + backend with hot reload)- 🚀 **Hot reload** for developmentLaunches the test runner in the interactive watch mode.\

npm run dev

- 💾 **Free storage** using Firestore Base64 encodingSee the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

# Frontend: http://localhost:3000

# Backend:  http://localhost:5000

```

---### `npm run build`

### Production Deployment



```bash

# Build the frontend## 🚀 Quick StartBuilds the app for production to the `build` folder.\

npm run build

It correctly bundles React in production mode and optimizes the build for the best performance.

# Deploy frontend to Netlify

# Deploy backend to Railway### Prerequisites

```

- Node.js 18+The build is minified and the filenames include the hashes.\

See **[Deployment Guide](./docs/DEPLOYMENT_README.md)** for detailed instructions.

- npm or yarnYour app is ready to be deployed!

---

- Firebase account (free tier works)

## 📚 Documentation

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

All documentation is organized in the `docs/` folder:

### Development

| Topic | Guide |

|-------|-------|### `npm run eject`

| **Getting Started** | [Quick Start](./docs/DEV_QUICK_START.md) |

| **Local Development** | [Dev Setup](./docs/LOCAL_DEVELOPMENT.md) |```bash

| **Game Upload** | [Game Guide](./docs/FREE_GAME_UPLOAD.md) |

| **Admin Features** | [Admin Guide](./docs/ADMIN_GUIDE.md) |# Install dependencies**Note: this is a one-way operation. Once you `eject`, you can't go back!**

| **Deployment** | [Deploy Guide](./docs/DEPLOYMENT_README.md) |

| **Troubleshooting** | [CORS/Firebase Fix](./docs/FIREBASE_CORS_FIX.md) |npm install

| **Full Index** | [All Docs](./docs/INDEX.md) |

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

---

# Start development servers (frontend + backend with hot reload)

## 🏗️ Tech Stack

npm run devInstead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

### Frontend

- **React 19** - UI framework

- **Framer Motion 12** - Animations

- **Tailwind CSS 3** - Styling# Frontend: http://localhost:3000You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

- **React Router 7** - Navigation

- **Firebase SDK 12** - Auth & Database# Backend:  http://localhost:5000



### Backend```## Learn More

- **Express.js 5** - API server

- **Firebase Admin SDK 13** - Authentication

- **Firestore** - NoSQL database

### Production DeploymentYou can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

### Hosting

- **Netlify** - Frontend (free tier)

- **Railway** - Backend (free tier)

```bashTo learn React, check out the [React documentation](https://reactjs.org/).

### Storage

- **Firestore Base64** - Game files (free, no external storage needed)# Build the frontend



---npm run build### Code Splitting



## 📁 Project Structure



```# Deploy frontend to NetlifyThis section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

sync-gaming/

├── docs/                    # 📚 Documentation# Deploy backend to Railway

│   ├── INDEX.md            # Doc index & quick links

│   ├── DEV_QUICK_START.md```### Analyzing the Bundle Size

│   ├── LOCAL_DEVELOPMENT.md

│   ├── ADMIN_GUIDE.md

│   └── ...more guides

│See **[Deployment Guide](./docs/DEPLOYMENT_README.md)** for detailed instructions.This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

├── src/                     # 🎨 React Frontend

│   ├── pages/

│   │   ├── SignIn.js

│   │   ├── Auth.js---### Making a Progressive Web App

│   │   ├── AdminDashboard.js

│   │   └── GamePlayer.js

│   ├── components/

│   │   ├── Navbar.js## 📚 DocumentationThis section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

│   │   └── AdminManagement.js

│   └── App.js

│

├── backend/                 # 🔧 Express BackendAll documentation is organized in the `docs/` folder:### Advanced Configuration

│   ├── server.js           # API endpoints

│   └── .env.development

│

├── games/                   # 🎮 WebGL Games| Topic | Guide |This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

│   ├── cube-game/          # Example game

│   └── README.md           # Game upload guide|-------|-------|

│

├── package.json            # Dependencies| **Getting Started** | [Quick Start](./docs/DEV_QUICK_START.md) |### Deployment

└── README.md              # This file

```| **Local Development** | [Dev Setup](./docs/LOCAL_DEVELOPMENT.md) |



---| **Game Upload** | [Game Guide](./docs/FREE_GAME_UPLOAD.md) |This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)



## 🎮 Creating Games| **Admin Features** | [Admin Guide](./docs/ADMIN_GUIDE.md) |



1. **Create game folder** in `/games`:| **Deployment** | [Deploy Guide](./docs/DEPLOYMENT_README.md) |### `npm run build` fails to minify

   ```bash

   mkdir games/my-game| **Troubleshooting** | [CORS/Firebase Fix](./docs/FIREBASE_CORS_FIX.md) |

   ```

| **Full Index** | [All Docs](./docs/INDEX.md) |This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

2. **Add `index.html`** and game files



3. **Package it**:---

   ```bash

   npm run package-game my-game## 🏗️ Tech Stack

   ```

### Frontend

4. **Upload** through Admin Panel- **React 19** - UI framework

- **Framer Motion 12** - Animations

See **[Game Upload Guide](./docs/FREE_GAME_UPLOAD.md)** for details.- **Tailwind CSS 3** - Styling

- **React Router 7** - Navigation

---- **Firebase SDK 12** - Auth & Database



## 👨‍💼 Admin Setup### Backend

- **Express.js 5** - API server

### Setting Up Your First Admin- **Firebase Admin SDK 13** - Authentication

- **Firestore** - NoSQL database

1. **Sign up** on the platform

2. **Get your user ID** from Firebase Console### Hosting

3. **Run script** to grant admin:- **Netlify** - Frontend (free tier)

   ```bash- **Railway** - Backend (free tier)

   node set-admin.js

   ```### Storage

4. **Refresh** the page - you'll see Admin Panel- **Firestore Base64** - Game files (free, no external storage needed)



See **[Admin Guide](./docs/ADMIN_GUIDE.md)** for full instructions.---



---## 📁 Project Structure



## 🌐 Live Demo```

sync-gaming/

- **Frontend**: https://hilarious-crostata-bb59b0.netlify.app├── docs/                    # 📚 Documentation

- **Backend API**: https://sync-gaming-backend-production.up.railway.app│   ├── INDEX.md            # Doc index & quick links

│   ├── DEV_QUICK_START.md

---│   ├── LOCAL_DEVELOPMENT.md

│   ├── ADMIN_GUIDE.md

## 📝 Available Scripts│   └── ...more guides

│

### Development├── src/                     # 🎨 React Frontend

```bash│   ├── pages/

npm run dev              # Start frontend + backend with hot reload│   │   ├── SignIn.js

npm run start            # Start frontend only│   │   ├── Auth.js

npm run backend          # Start backend only│   │   ├── AdminDashboard.js

```│   │   └── GamePlayer.js

│   ├── components/

### Build & Deploy│   │   ├── Navbar.js

```bash│   │   └── AdminManagement.js

npm run build            # Build React for production│   └── App.js

npm run package-games    # Create ZIP files for all games│

npm run package-game     # Create ZIP for specific game├── backend/                 # 🔧 Express Backend

```│   ├── server.js           # API endpoints

│   └── .env.development

---│

├── games/                   # 🎮 WebGL Games

## 🔒 Environment Variables│   ├── cube-game/          # Example game

│   └── README.md           # Game upload guide

### Frontend (`.env.production`)│

```├── package.json            # Dependencies

REACT_APP_API_URL=https://sync-gaming-backend-production.up.railway.app/api└── README.md              # This file

``````



### Backend (`backend/.env.development`)---

```

NODE_ENV=development## 🎮 Creating Games

PORT=5000

CORS_ORIGIN=http://localhost:30001. **Create game folder** in `/games`:

```   ```bash

   mkdir games/my-game

---   ```



## 🚀 Deployment2. **Add `index.html`** and game files



### Option 1: Free (Netlify + Railway)3. **Package it**:

- **Frontend**: Netlify (free tier, generous limits)   ```bash

- **Backend**: Railway (free tier with $5/month credit)   npm run package-game my-game

   ```

See **[Railway + Netlify Guide](./docs/RAILWAY_NETLIFY_DEPLOY.md)**

4. **Upload** through Admin Panel

### Option 2: Full Setup

See **[Full Deployment Guide](./docs/DEPLOYMENT_README.md)**See **[Game Upload Guide](./docs/FREE_GAME_UPLOAD.md)** for details.



------



## 🎯 Key Commands## 👨‍💼 Admin Setup



| Command | Purpose |### Setting Up Your First Admin

|---------|---------|

| `npm run dev` | Start dev servers with hot reload |1. **Sign up** on the platform

| `npm run build` | Build for production |2. **Get your user ID** from Firebase Console

| `npm run package-games` | Create ZIPs of all games |3. **Run script** to grant admin:

| `npm run package-game my-game` | Create ZIP of specific game |   ```bash

| `node set-admin.js` | Grant admin privileges |   node set-admin.js

   ```

---4. **Refresh** the page - you'll see Admin Panel



## 🤝 ContributingSee **[Admin Guide](./docs/ADMIN_GUIDE.md)** for full instructions.



1. Fork the repository---

2. Create a feature branch

3. Make your changes## 🌐 Live Demo

4. Push and create a Pull Request

- **Frontend**: https://hilarious-crostata-bb59b0.netlify.app

---- **Backend API**: https://sync-gaming-backend-production.up.railway.app



## 📖 Learning Resources---



- [React Documentation](https://react.dev)## 📝 Available Scripts

- [Firebase Documentation](https://firebase.google.com/docs)

- [Framer Motion](https://www.framer.com/motion/)### Development

- [Tailwind CSS](https://tailwindcss.com)```bash

- [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)npm run dev              # Start frontend + backend with hot reload

npm run start            # Start frontend only

---npm run backend          # Start backend only

```

## ❓ FAQ

### Build & Deploy

**Q: How much does it cost to run?**```bash

A: Nothing! We use free tiers of Netlify, Railway, Firebase, and Firestore.npm run build            # Build React for production

npm run package-games    # Create ZIP files for all games

**Q: Can I use my own database?**npm run package-game     # Create ZIP for specific game

A: Yes, but Firebase/Firestore is the easiest free option.```



**Q: What games can I upload?**---

A: Any WebGL game (Babylon.js, Three.js, vanilla WebGL, etc.)

## 🔒 Environment Variables

**Q: How large can games be?**

A: Max 50MB per game (practical limit ~1-2MB with Firestore)### Frontend (`.env.production`)

```

**Q: Can I monetize games?**REACT_APP_API_URL=https://sync-gaming-backend-production.up.railway.app/api

A: Yes, it's your platform - do what you want!```



See **[Full FAQ](./docs/INDEX.md#-faq)** for more.### Backend (`backend/.env.development`)

```

---NODE_ENV=development

PORT=5000

## 📞 SupportCORS_ORIGIN=http://localhost:3000

```

- 📚 **Read the docs**: [docs/INDEX.md](./docs/INDEX.md)

- 🐛 **Report bugs**: GitHub Issues---

- 💬 **Questions**: Check relevant doc file

## 🚀 Deployment

---

### Option 1: Free (Netlify + Railway)

## 📄 License- **Frontend**: Netlify (free tier, generous limits)

- **Backend**: Railway (free tier with $5/month credit)

MIT © 2025 SyncGaming

See **[Railway + Netlify Guide](./docs/RAILWAY_NETLIFY_DEPLOY.md)**

---

### Option 2: Full Setup

## 🙌 AcknowledgmentsSee **[Full Deployment Guide](./docs/DEPLOYMENT_README.md)**



Built with ❤️ for the gaming community.---



Special thanks to:## 🎯 Key Commands

- Firebase for the free-tier platform

- Netlify & Railway for free hosting| Command | Purpose |

- React, Express.js, and the open-source community|---------|---------|

| `npm run dev` | Start dev servers with hot reload |

---| `npm run build` | Build for production |

| `npm run package-games` | Create ZIPs of all games |

**Get started now**: `npm run dev` 🚀| `npm run package-game my-game` | Create ZIP of specific game |

| `node set-admin.js` | Grant admin privileges |

For detailed setup: See [Quick Start Guide](./docs/DEV_QUICK_START.md)

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
