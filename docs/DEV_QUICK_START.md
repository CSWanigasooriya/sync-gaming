# 🎮 SyncGaming - Development Quick Start

## Option 1: One-Command Setup (Easiest!)

```bash
npm run dev
```

This starts **both** frontend and backend with hot reloading! 🚀

## Option 2: Double-Click (Windows Only)

Double-click: `dev.bat`

This opens two windows:
- Backend on `http://localhost:5000`
- Frontend on `http://localhost:3000`

## Option 3: Manual Setup

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm start
```

---

## What Each Command Does

| Command | What it does |
|---------|-------------|
| `npm run dev` | Runs frontend + backend together |
| `npm start` | Runs just frontend (React) |
| `npm run backend` | Runs just backend (Express) |
| `npm run build` | Build for production |

---

## Development URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| Admin Dashboard | http://localhost:3000/admin |

---

## Hot Reloading

✅ **Frontend**: Changes to React files auto-reload in browser
✅ **Backend**: Changes to server.js auto-restart server

Just edit, save, and see changes instantly!

---

## Testing Locally

1. Run: `npm run dev`
2. Go to: http://localhost:3000
3. Sign in
4. Test features
5. Changes reload automatically

---

## Troubleshooting

**Port already in use?**
```bash
# Kill process on port 5000
npx kill-port 5000

# Kill process on port 3000
npx kill-port 3000
```

**Need to rebuild?**
```bash
npm run build
```

**Check logs?**
- Frontend: Browser console (F12)
- Backend: Terminal window

---

## File Structure

```
sync-gaming/
├── dev.bat                 ← Double-click to start
├── dev-server.js          ← Runs both servers
├── LOCAL_DEVELOPMENT.md   ← Full guide
│
├── package.json           ← Frontend config
├── src/                   ← React code
│
└── backend/
    ├── server.js          ← Backend code
    ├── package.json
    └── nodemon.json       ← Hot reload config
```

---

## Full Documentation

See `LOCAL_DEVELOPMENT.md` for complete guide including:
- Debugging tips
- Environment variables
- Firebase setup
- CORS configuration
- Firestore rules for development

---

**Ready to code? Run:** `npm run dev` 🎮
