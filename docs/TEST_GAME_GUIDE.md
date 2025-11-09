# Testing WebGL Game Upload

## Your Test Game is Ready! 🎮

Location: `d:\Projects\sync-gaming\test-webgl-game.zip` (3.8 KB)

### What's in the Test Game

- **index.html** - A rotating 3D WebGL cube
- **package.json** - Project metadata
- **README.md** - Documentation

### How to Upload and Test

#### Step 1: Go to Your Admin Dashboard
1. Visit: https://hilarious-crostata-bb59b0.netlify.app
2. Sign in with your admin account
3. Click "Admin Dashboard"
4. Go to the "Games" tab

#### Step 2: Upload the Game
1. Click "Add New Game"
2. Fill in the form:
   - **Title**: `Simple WebGL Cube`
   - **Description**: `A rotating 3D cube demo. Pure WebGL implementation.`
   - **Thumbnail URL**: You can use any image URL, or leave it for now
3. Drag and drop or select `test-webgl-game.zip`
4. Click "Upload Game"

#### Step 3: Test the Game
1. After upload completes, go to home page
2. You should see your game in the gallery
3. Click "Play Now"
4. Download the ZIP
5. Extract it on your computer
6. Open `index.html` in a web browser
7. You should see a rotating 3D colored cube! 🎲

### If the Game Doesn't Show Up

- Make sure you're logged in as admin
- Check browser console (F12) for errors
- Make sure Firestore security rules allow reads (see Firebase console)

### Customizing the Test Game

To modify the game, edit the files in `test-webgl-game/`:

1. Change rotation speed:
   ```javascript
   angle += 0.01;  // Change to angle += 0.05 for faster
   ```

2. Change colors in the `colors` array:
   ```javascript
   // Each triplet is RGB (0-1)
   1, 0, 0,    // Red
   0, 1, 0,    // Green
   0, 0, 1     // Blue
   ```

3. Add more features using WebGL API

Then re-zip and upload!

### Production Tips

- Keep ZIP files under 10MB for fast uploads
- Include a README with instructions
- Test in multiple browsers
- Optimize assets (images, audio, etc.)

---

Ready to upload? Go to your admin dashboard! 🚀
