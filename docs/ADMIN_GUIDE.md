# 👨‍💼 SyncGaming Admin Guide# SyncGaming Admin Guide



## 🎮 Uploading WebGL Games## Uploading WebGL Games



### Access the Admin Dashboard### Access the Admin Dashboard

1. Sign in with your admin account1. Sign in with your admin account

2. Navigate to `/admin` in your URL bar2. Navigate to `/admin` in your URL bar

3. You'll see the Admin Dashboard3. You'll see the Admin Dashboard



### How Games Are Stored (Current Implementation)### Upload a Game



Games are stored in **Firestore** using **Base64 encoding**:1. **Fill in Game Details:**

- ✅ 100% free - no Firebase Storage costs   - Game Title: Name of your game

- ✅ No external dependencies   - Game Description: Brief description of the game

- ⚠️ Firestore document size limit: **1MB**   - Thumbnail URL: Image URL for the game thumbnail (recommended: 400x300px)

- ⚠️ Best for small WebGL games (typically < 500KB)

2. **Upload ZIP File:**

**See [FREE_GAME_UPLOAD.md](./FREE_GAME_UPLOAD.md) for complete technical implementation details.**   - Drag and drop your WebGL game ZIP file or click to browse

   - The ZIP file should contain:

---     - `index.html` (main game file)

     - All game assets (JavaScript, CSS, textures, models, etc.)

## Upload a Game   - Example structure:

     ```

### Step 1: Fill in Game Details     my-game.zip

- **Game Title**: Name of your game     ├── index.html

- **Game Description**: Brief description (players will see this)     ├── js/

- **Thumbnail URL**: Image URL for the game thumbnail (recommended: 400x300px)     │   ├── game.js

     │   └── THREE.min.js

### Step 2: Prepare Your ZIP File     ├── css/

The ZIP should contain:     │   └── style.css

- `index.html` (main game file)     └── assets/

- All game assets (JavaScript, CSS, textures, models, etc.)         ├── models/

         ├── textures/

**Example structure:**         └── sounds/

```     ```

my-game.zip

├── index.html3. **Submit:**

├── js/   - Click "Upload Game"

│   ├── game.js   - Wait for the upload to complete

│   └── THREE.min.js   - You'll see a success message

├── css/

│   └── style.css### Managing Games

└── assets/

    ├── models/- **View All Games:** Listed on the right side of the dashboard

    ├── textures/- **Preview:** Click "Preview" to see the game page

    └── sounds/- **Delete:** Click "Delete" to remove a game

```- **Download Stats:** See how many times each game has been downloaded



### Step 3: File Size Optimization## Game Player



**Firestore Limits:**Users can:

- **Maximum**: 1MB per game1. Click "Play Now" on any game card

- **Recommended**: Under 500KB for fast uploads2. View game details and download count

3. Download the game ZIP file

**How to reduce size:**4. Extract and play locally in their browser

- Minimize JavaScript code

- Compress images (use WebP format)## Technical Notes

- Use audio compression (MP3/OGG)

- Remove unused assets### WebGL Compatibility

- Minify CSS/HTML- Ensure your game works with modern browsers (Chrome, Firefox, Safari, Edge)

- Test the game thoroughly before uploading

### Step 4: Upload- Optimize assets for web delivery



1. Drag and drop your ZIP file or click to browse### File Size Recommendations

2. Click "Upload Game"- Keep ZIP files under 50MB for optimal performance

3. Browser converts ZIP to Base64- Compress assets where possible

4. Firestore stores the data (usually < 10 seconds)- Use efficient file formats (WebP for images, MP3 for audio)

5. You'll see success confirmation

### Hosting the Extracted Game

---For users to play games directly without downloading:

1. You'll need to extract ZIP files on your server

## 📊 Managing Games2. Serve the extracted files as static content

3. Use a library like JSZip (JavaScript) to handle extraction on the client side

### View All Games4. Or use a server-side solution to handle ZIP extraction

- Listed on the right side of the dashboard

- Shows title, description, upload date### Future Enhancement

To enable direct browser play without downloads:

### Preview Game- Implement server-side ZIP extraction

- Click "Preview" to see how players will see it- Use worker threads for background processing

- Serve extracted files with proper CORS headers

### Delete Game- Cache frequently played games

- Click "Delete" to remove a game

- Removes game and all its data from Firestore## Support



### View Download StatsFor issues or questions, contact the development team.

- See how many times each game has been downloaded

---

## 🎮 How Players Use Uploaded Games

Players can:
1. Click "Play Now" on any game card
2. View game details and download count
3. Download the game ZIP file
4. Extract and play locally in their browser

---

## ⚙️ Technical Notes

### WebGL Compatibility
- Ensure your game works with modern browsers (Chrome, Firefox, Safari, Edge)
- Test thoroughly before uploading
- Use responsive design for different screen sizes

### File Format Standards
- **Use efficient formats**: WebP for images, MP3/OGG for audio
- **Compress assets**: Use tools like TinyPNG, ImageOptim
- **Minify code**: Reduce JavaScript/CSS file sizes
- **Remove unused files**: Don't include source maps or debug files

### Performance Tips
- Use 2D canvas instead of WebGL if possible (smaller, faster)
- Lazy-load assets when possible
- Cache game data locally for return players
- Test file size before upload

---

## 🔄 Leaderboard & Analytics

Games automatically support:
- **Leaderboards**: Players' scores are tracked and ranked
- **Analytics**: Track total games played, playtime, scores per user
- **Sponsored badges**: Games can be marked as sponsored

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) to test these features.

---

## 🆘 Troubleshooting

### "File too large" error
- Maximum is 1MB
- Compress images and audio
- Remove unnecessary assets
- See file size before upload

### Game doesn't show up after upload
- Check you're logged in as admin
- Verify Firestore security rules allow reads
- Check browser console (F12) for errors

### Upload is slow or fails
- Check your internet connection
- Try a smaller test file first
- Clear browser cache and retry

### Game won't play after download
- Ensure `index.html` is in the ZIP root
- Check that all asset paths are correct
- Test the ZIP locally before uploading

---

## 📚 Related Documentation

- **[FREE_GAME_UPLOAD.md](./FREE_GAME_UPLOAD.md)** - How Base64 encoding works
- **[TEST_GAME_GUIDE.md](./TEST_GAME_GUIDE.md)** - Example game upload walkthrough
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Test leaderboard & analytics
- **[IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md)** - Full architecture

---

**Ready to upload a game?** Start with [FREE_GAME_UPLOAD.md](./FREE_GAME_UPLOAD.md) for implementation details! 🚀
