# 🚀 Local Development Setup

## Quick Start (Recommended)

Run both frontend and backend with hot reloading in one command:

```bash
npm run dev
```

This starts:
- ✅ **Frontend** on `http://localhost:3000` (React with hot reload)
- ✅ **Backend** on `http://localhost:5000` (Node.js with nodemon)
- ✅ **Firestore** integrated for testing
- ✅ **Hot reload** for both frontend and backend

---

## Manual Setup (If Needed)

### Terminal 1: Start Backend

```bash
cd backend
npm install
node server.js
```

Or with auto-reload (requires nodemon):
```bash
npm install -g nodemon
cd backend
nodemon server.js
```

Backend runs on: `http://localhost:5000`

### Terminal 2: Start Frontend

```bash
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

---

## Environment Variables

### Frontend (.env.development)
Already configured in React. If you need to customize:

```bash
# Create src/.env.development
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend (.env.development)
Located in `backend/.env.development`:

```bash
NODE_ENV=development
PORT=5000
FIREBASE_DATABASE_URL=https://gen-lang-client-0350765152.firebaseio.com
CORS_ORIGIN=http://localhost:3000
```

---

## Features for Development

### Hot Reloading

- **Frontend**: React automatically reloads when you save changes
- **Backend**: With nodemon, server restarts on file changes
- **No manual refresh needed** - just edit and see changes!

### Development Console

When running `npm run dev`, you'll see:

```
==================================================
Frontend: http://localhost:3000
Backend:  http://localhost:5000
==================================================

📦 Starting backend server...
[Backend logs here]

📱 Starting frontend server...
[Frontend logs here]
```

### Testing Admin Features Locally

1. Run `npm run dev`
2. Go to `http://localhost:3000`
3. Sign in with any account
4. Use the test admin UID to promote users:
   - `b0CoHW34W2WKGyZ0HyjTjtw6mJG3`
5. Access `/admin` dashboard
6. Upload and test games locally

---

## Common Commands

```bash
# Start both servers
npm run dev

# Start only backend
npm run backend

# Start only frontend  
npm start

# Build frontend for production
npm run build

# Run tests
npm test
```

---

## Debugging

### Backend Debugging

Add this to `backend/server.js`:
```javascript
console.log('Debug info:', variable);
```

Run with:
```bash
NODE_DEBUG=* npm run backend
```

### Frontend Debugging

Use React DevTools:
1. Install: https://react-devtools-tutorial.vercel.app/
2. Open DevTools: F12
3. Go to "React" tab

### API Debugging

Test backend endpoints with curl:
```bash
# Get current user
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/auth/me

# List admins
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/admin/list-admins
```

---

## Troubleshooting

### "Port already in use"

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Firebase errors in development

Make sure you have `serviceAccountKey.json` in `backend/` folder:
```bash
backend/
  ├── server.js
  ├── serviceAccountKey.json  ← Required!
  └── .env.development
```

### Firestore "Missing or insufficient permissions"

This is a security rule issue. Either:

1. **Permissive (for testing)**:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /{document=**} {
       allow read, write: if true;
     }
   }
   ```

2. **Secure (production)**:
   See `FIREBASE_CORS_FIX.md`

### CORS errors

Make sure `REACT_APP_API_URL=http://localhost:5000/api` in your frontend.

---

## Project Structure

```
sync-gaming/
├── dev-server.js          ← Runs both servers
├── package.json           ← Has dev scripts
│
├── src/                   ← Frontend (React)
│   ├── App.js
│   ├── pages/
│   ├── components/
│   └── .env.development
│
└── backend/               ← Backend (Express)
    ├── server.js
    ├── package.json
    ├── serviceAccountKey.json
    └── .env.development
```

---

## Next Steps

1. **Run**: `npm run dev`
2. **Code**: Make changes to frontend or backend
3. **Test**: Changes auto-reload
4. **Deploy**: Push to GitHub (auto-deploys via Netlify + Railway)

---

## Tips for Development

- Use `console.log()` in frontend → appears in browser console
- Use `console.log()` in backend → appears in terminal
- Keep two terminals open while developing
- Test sign-in/sign-out flows frequently
- Test admin features on test account
- Check Firestore in Firebase Console for real-time data

---

**Happy coding! 🎮**
