# 🎮 Test Game Upload Guide# Testing WebGL Game Upload



A practical walkthrough for uploading and testing a WebGL game on SyncGaming.## Your Test Game is Ready! 🎮



---Location: `d:\Projects\sync-gaming\test-webgl-game.zip` (3.8 KB)



## 📋 Prerequisites### What's in the Test Game



- [ ] Admin account set up- **index.html** - A rotating 3D WebGL cube

- [ ] Admin dashboard accessible at `/admin`- **package.json** - Project metadata

- [ ] WebGL game ready (as a ZIP file)- **README.md** - Documentation

- [ ] All assets included in the ZIP

- [ ] ZIP file is under 1MB (Firestore limit)### How to Upload and Test



---#### Step 1: Go to Your Admin Dashboard

1. Visit: https://hilarious-crostata-bb59b0.netlify.app

## 🚀 Step-by-Step Walkthrough2. Sign in with your admin account

3. Click "Admin Dashboard"

### Step 1: Prepare Your WebGL Game4. Go to the "Games" tab



Create a ZIP file with your game:#### Step 2: Upload the Game

1. Click "Add New Game"

**Required:**2. Fill in the form:

- `index.html` - Main game file (must be in root)   - **Title**: `Simple WebGL Cube`

   - **Description**: `A rotating 3D cube demo. Pure WebGL implementation.`

**Optional:**   - **Thumbnail URL**: You can use any image URL, or leave it for now

- `js/game.js` - Game logic3. Drag and drop or select `test-webgl-game.zip`

- `css/style.css` - Styling4. Click "Upload Game"

- `assets/` - Images, audio, models, etc.

#### Step 3: Test the Game

**Example structure:**1. After upload completes, go to home page

```2. You should see your game in the gallery

my-awesome-game.zip3. Click "Play Now"

├── index.html4. Download the ZIP

├── js/5. Extract it on your computer

│   ├── game.js6. Open `index.html` in a web browser

│   └── utils.js7. You should see a rotating 3D colored cube! 🎲

├── css/

│   └── style.css### If the Game Doesn't Show Up

└── assets/

    ├── images/- Make sure you're logged in as admin

    │   └── logo.png- Check browser console (F12) for errors

    └── sounds/- Make sure Firestore security rules allow reads (see Firebase console)

        └── music.mp3

```### Customizing the Test Game



**File size tips:**To modify the game, edit the files in `test-webgl-game/`:

- Compress images (WebP format)

- Minify JavaScript/CSS1. Change rotation speed:

- Target size: 200-500KB   ```javascript

- Maximum: 1MB (hard limit)   angle += 0.01;  // Change to angle += 0.05 for faster

   ```

---

2. Change colors in the `colors` array:

### Step 2: Go to Admin Dashboard   ```javascript

   // Each triplet is RGB (0-1)

1. Open your deployed SyncGaming app   1, 0, 0,    // Red

2. Sign in with your admin account   0, 1, 0,    // Green

3. Navigate to `/admin` in the URL bar   0, 0, 1     // Blue

4. You should see the Admin Dashboard   ```



**Example URLs:**3. Add more features using WebGL API

- Local: `http://localhost:3000/admin`

- Deployed: `https://your-app.netlify.app/admin`Then re-zip and upload!



---### Production Tips



### Step 3: Upload the Game- Keep ZIP files under 10MB for fast uploads

- Include a README with instructions

1. Click **"Add New Game"** button- Test in multiple browsers

2. Fill in the game details:- Optimize assets (images, audio, etc.)

   - **Title**: `My Awesome Game`

   - **Description**: `A fun WebGL game demo`---

   - **Thumbnail URL**: (optional - can add image URL here)

Ready to upload? Go to your admin dashboard! 🚀

3. **Upload ZIP:**
   - Click the upload area or drag & drop
   - Select your ZIP file
   - Browser shows upload progress

4. **Click "Upload Game"**
   - Wait for completion (usually < 10 seconds)
   - See success message

---

### Step 4: Test on Homepage

1. Go to your app homepage
2. Look for your game in the "Featured Games" section
3. You should see:
   - Game title
   - Game description
   - Thumbnail image (if provided)
   - "Play Now" button

---

### Step 5: Download and Play

1. Click "Play Now" on your game card
2. You'll see a preview page with:
   - Game details
   - Download count
   - "Download Game" button

3. Click **"Download Game"** to get the ZIP
4. Extract the ZIP on your computer
5. Open `index.html` in your web browser
6. Your game should run! 🎲

---

## ✅ Testing Checklist

### Before Upload
- [ ] Game runs locally in browser
- [ ] All asset paths are correct (relative paths)
- [ ] `index.html` is in the ZIP root
- [ ] ZIP file is under 1MB
- [ ] Game works without internet (if offline-capable)

### After Upload
- [ ] Game appears on homepage
- [ ] Game card shows correct title & description
- [ ] Thumbnail displays properly
- [ ] "Play Now" button works
- [ ] Download link works
- [ ] Downloaded game runs when extracted

### Leaderboard Testing (if applicable)
- [ ] Play your game and get a score
- [ ] See "Score saved to leaderboard!" notification
- [ ] Check leaderboard modal for your score
- [ ] Score appears ranked correctly

---

## 🐛 Troubleshooting

### Game doesn't appear on homepage
- ✅ Sign out and sign back in
- ✅ Refresh the page
- ✅ Check browser console (F12 → Console tab)
- ✅ Verify you're logged in as admin

### "File too large" error
- ✅ Check ZIP size: must be under 1MB
- ✅ Compress images (use WebP)
- ✅ Minify JavaScript/CSS
- ✅ Remove debug/source files

### Game won't run when extracted
- ✅ Verify `index.html` is in ZIP root (not in subfolder)
- ✅ Check asset paths are relative (not absolute)
- ✅ Try opening in different browser
- ✅ Check browser console for errors (F12)

### Upload seems slow
- ✅ Check internet connection
- ✅ Try smaller file first (test with 100KB)
- ✅ Try different browser
- ✅ Clear browser cache and retry

### Leaderboard score not saving
- ✅ See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for detailed testing
- ✅ Ensure game sends score via `postMessage`
- ✅ Check backend is running
- ✅ Verify Firebase rules allow writes

---

## 📚 Common Issues & Solutions

### Issue: "All asset paths must be relative"
**Solution**: Don't use absolute paths like `/images/logo.png`  
Use relative paths: `./images/logo.png` or `assets/images/logo.png`

### Issue: "Game runs locally but not after download"
**Solution**: Check that your `index.html` loads assets correctly  
```html
<!-- ✅ CORRECT - relative path -->
<img src="./assets/image.png">

<!-- ❌ WRONG - absolute path -->
<img src="/assets/image.png">
```

### Issue: "Can't find Three.js or other library"
**Solution**: Include all libraries in your ZIP  
```
game.zip
├── index.html
└── lib/
    └── three.min.js  ← Include this!
```

---

## 🎨 Example: Simple WebGL Cube

A minimal example that's guaranteed to work:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Simple WebGL Cube</title>
    <style>
        body { margin: 0; }
        canvas { display: block; }
    </style>
</head>
<body>
    <canvas id="canvas"></canvas>
    <script>
        // WebGL setup
        const canvas = document.getElementById('canvas');
        const gl = canvas.getContext('webgl');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        // Your game code here...
    </script>
</body>
</html>
```

---

## 📊 Next Steps After Upload

### Test Leaderboard
See [TESTING_GUIDE.md](./TESTING_GUIDE.md) to:
- Play your game and submit a score
- View the leaderboard
- Test analytics tracking

### Add More Games
Repeat the upload process for each game

### Deploy to Production
See [DEPLOYMENT_README.md](./DEPLOYMENT_README.md) when ready

---

## 🆘 Need Help?

- **Game upload basics**: See [ADMIN_GUIDE.md](./ADMIN_GUIDE.md)
- **Firestore storage details**: See [FREE_GAME_UPLOAD.md](./FREE_GAME_UPLOAD.md)
- **Test leaderboard**: See [TESTING_GUIDE.md](./TESTING_GUIDE.md)
- **Troubleshooting**: See [FIREBASE_CORS_FIX.md](./FIREBASE_CORS_FIX.md)

---

**Ready?** Create your WebGL game and upload it! 🚀
