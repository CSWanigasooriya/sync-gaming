# SyncGaming Admin Guide

## Uploading WebGL Games

### Access the Admin Dashboard
1. Sign in with your admin account
2. Navigate to `/admin` in your URL bar
3. You'll see the Admin Dashboard

### Upload a Game

1. **Fill in Game Details:**
   - Game Title: Name of your game
   - Game Description: Brief description of the game
   - Thumbnail URL: Image URL for the game thumbnail (recommended: 400x300px)

2. **Upload ZIP File:**
   - Drag and drop your WebGL game ZIP file or click to browse
   - The ZIP file should contain:
     - `index.html` (main game file)
     - All game assets (JavaScript, CSS, textures, models, etc.)
   - Example structure:
     ```
     my-game.zip
     ├── index.html
     ├── js/
     │   ├── game.js
     │   └── THREE.min.js
     ├── css/
     │   └── style.css
     └── assets/
         ├── models/
         ├── textures/
         └── sounds/
     ```

3. **Submit:**
   - Click "Upload Game"
   - Wait for the upload to complete
   - You'll see a success message

### Managing Games

- **View All Games:** Listed on the right side of the dashboard
- **Preview:** Click "Preview" to see the game page
- **Delete:** Click "Delete" to remove a game
- **Download Stats:** See how many times each game has been downloaded

## Game Player

Users can:
1. Click "Play Now" on any game card
2. View game details and download count
3. Download the game ZIP file
4. Extract and play locally in their browser

## Technical Notes

### WebGL Compatibility
- Ensure your game works with modern browsers (Chrome, Firefox, Safari, Edge)
- Test the game thoroughly before uploading
- Optimize assets for web delivery

### File Size Recommendations
- Keep ZIP files under 50MB for optimal performance
- Compress assets where possible
- Use efficient file formats (WebP for images, MP3 for audio)

### Hosting the Extracted Game
For users to play games directly without downloading:
1. You'll need to extract ZIP files on your server
2. Serve the extracted files as static content
3. Use a library like JSZip (JavaScript) to handle extraction on the client side
4. Or use a server-side solution to handle ZIP extraction

### Future Enhancement
To enable direct browser play without downloads:
- Implement server-side ZIP extraction
- Use worker threads for background processing
- Serve extracted files with proper CORS headers
- Cache frequently played games

## Support

For issues or questions, contact the development team.
