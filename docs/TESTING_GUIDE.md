# Quick Start Testing Guide

## 🎮 Testing the Leaderboard & Analytics System

This guide will help you test all the new features: leaderboards, analytics, and sponsored games.

## Prerequisites

- [ ] Backend is running (`npm run dev` in `/backend`)
- [ ] Frontend is running (`npm start` in root)
- [ ] You're logged in as an authenticated user
- [ ] You're set as an admin (for admin analytics testing)
- [ ] Snake game has been uploaded and deployed
- [ ] Environment variables are set correctly

## 🎯 Testing Steps

### Step 1: Play the Snake Game

1. Go to the homepage and find the snake game in "Featured Games"
2. Click "Play Now"
3. Play the snake game and try to get a high score
4. Let the game end (when snake hits a wall or itself)
5. You should see "✅ Score saved to leaderboard!" notification at the top

**What's Happening**:
- Snake game sends score via `postMessage`
- GamePlayer component listens for the message
- Your score is submitted to backend
- Backend stores score in Firestore leaderboard collection

### Step 2: View the Leaderboard

1. After the score is saved, you should still be on the game page
2. Click the "🏆 Leaderboard" button below the game
3. A modal should open showing the top 10 scores
4. You should see your score in the list with:
   - Your rank
   - Your name
   - Your score
   - How long you played
   - When you played

**Expected Results**:
- Modal displays smoothly with animations
- Your name appears in the leaderboard
- Scores are ranked from highest to lowest
- Medal emojis show: 🥇 for rank 1, 🥈 for rank 2, 🥉 for rank 3

### Step 3: Test Leaderboard Refresh

1. Still in the leaderboard modal
2. Click the "🔄 Refresh" button
3. The leaderboard should reload and show updated scores
4. Try this multiple times to ensure it works consistently

### Step 4: Check Your User Analytics

1. Close the leaderboard modal
2. Navigate to your user profile (if available)
3. You should see your analytics:
   - Total games played: 1 (from snake)
   - Total playtime: [seconds you played]
   - Total score: [your snake score]
   - Best score in snake game: [your score]

**How to Access** (if you don't have a profile page):
- Play the snake game multiple times
- Go to admin dashboard (if you're admin)
- Check under "📊 Analytics" → "👥 Top Users"
- You should appear in the top users list

### Step 5: Test Sponsored Badge

1. Go back to the homepage
2. In "Featured Games" section, look for a game with a sponsored badge
3. You should see a badge like "✨ GOLD" or "✨ SILVER" in the top-right corner of the game card

**If you don't see a sponsored badge**:
- Go to admin dashboard
- Upload a new game with these fields:
  ```json
  {
    "title": "Sponsored Game Example",
    "description": "This is a sponsored game",
    "sponsored": true,
    "sponsorTier": "gold"
  }
  ```
- Go back to homepage
- You should now see the badge

### Step 6: Test Admin Analytics (Admin Only)

**Prerequisites**: You must be an admin user

1. Go to Admin Dashboard (`/admin`)
2. Click the "📊 Analytics" tab
3. You should see two sub-tabs: "👥 Top Users" and "🎮 Game Stats"

#### 6a. Top Users Tab
- Click "👥 Top Users" if not already selected
- You should see a list of users ranked by total playtime
- Each user shows:
  - Rank badge
  - Username
  - Email
  - Total games played
  - Total playtime (formatted as hours/minutes)
  - Total score

**Test Pagination**:
- Click "Next →" button
- Should show next 20 users
- Click "← Previous" to go back

#### 6b. Game Stats Tab
- Click "🎮 Game Stats"
- This shows stats for a specific game
- You should see:
  - Total plays for the game
  - Number of unique players
  - Average score
  - High score
  - Top players in that game

### Step 7: Multiple Play Sessions

1. Play the snake game again with a different score
2. Go to the leaderboard again
3. Your name should appear twice (or be updated if it's a new high score)
4. Check user analytics - "Total games played" should increment
5. Check admin analytics - playtime should increase

## 📋 Testing Checklist

### Core Features
- [ ] Snake game plays successfully
- [ ] Score is saved when game ends
- [ ] Green notification appears when score saves
- [ ] Leaderboard modal opens when clicking "🏆 Leaderboard"
- [ ] Leaderboard shows scores sorted by highest first
- [ ] Your name appears on leaderboard
- [ ] Medal emojis show correct ranks
- [ ] Leaderboard refresh button works
- [ ] Sponsored badge appears on sponsored games
- [ ] Sponsored badge shows correct tier (gold/silver/bronze)

### Admin Features (Admin Users Only)
- [ ] Analytics tab appears in admin dashboard
- [ ] Top Users tab shows users ranked by playtime
- [ ] Pagination works (Previous/Next buttons)
- [ ] Game Stats tab displays information
- [ ] User analytics increment after playing

### Error Handling
- [ ] No console errors when playing
- [ ] Network errors show error message
- [ ] Auth failures show appropriate message
- [ ] Retry button works on error

### Performance
- [ ] Leaderboard loads within 2 seconds
- [ ] Analytics load within 2 seconds
- [ ] No lag when opening/closing modal
- [ ] Animations are smooth

## 🐛 Common Issues & Solutions

### Issue: "Score saved" notification doesn't appear
**Solution**:
- Check browser console for errors (F12)
- Verify backend is running
- Verify `REACT_APP_API_URL` environment variable
- Check network tab to see if POST request succeeded

### Issue: Leaderboard shows "No scores yet"
**Solution**:
- Verify the score was actually submitted
- Check Firestore console to see if leaderboard collection exists
- Try playing again and checking if score appears

### Issue: Admin can't see analytics
**Solution**:
- Verify user is set as admin in Firebase console
- Custom claims might take a few minutes to apply
- Try logging out and logging back in
- Check that `/api/analytics/all-users` endpoint returns data

### Issue: Sponsored badge doesn't show
**Solution**:
- Verify game has `sponsored: true` in Firestore
- Verify game has `sponsorTier` set to one of: gold, silver, bronze
- Clear browser cache and reload
- Check developer console for JavaScript errors

### Issue: Leaderboard modal is stuck loading
**Solution**:
- Check backend console for errors
- Verify gameId is correct
- Try refreshing the page
- Check network request in browser DevTools

## 📊 Data to Verify in Firestore

### Leaderboard Collection
Go to Firestore console and verify:
1. Navigate to `leaderboard/{gameId}/scores`
2. You should see documents for each score submitted
3. Each document should have:
   - `userId` - Your Firebase UID
   - `userName` - Your display name
   - `userEmail` - Your email
   - `score` - The score value
   - `duration` - Seconds played
   - `timestamp` - When score was submitted

### User Analytics Collection
1. Navigate to `userAnalytics/{userId}`
2. You should see a document with:
   - `totalGamesPlayed` - Should increment
   - `totalPlayTime` - Should increase
   - `totalScore` - Sum of all scores
   - `gamesPlayed` - Object with per-game stats
   - `playHistory` - Array of recent plays

### Game Analytics Collection (Admin Only)
1. Navigate to `gameAnalytics/{gameId}`
2. You should see stats for the game:
   - `totalPlays` - Total plays of this game
   - `totalPlayers` - Unique players
   - `averageScore` - Mean score
   - `highScore` - Best score
   - `topPlayers` - Array of best players

## ✅ Success Criteria

You'll know everything is working when:

1. ✅ Playing snake game submits score and shows notification
2. ✅ Leaderboard modal displays scores correctly
3. ✅ Your scores appear ranked on the leaderboard
4. ✅ Sponsored badge shows on sponsored games
5. ✅ Admin can view top users ranked by playtime
6. ✅ Multiple plays accumulate in user analytics
7. ✅ No errors in browser console
8. ✅ All animations are smooth
9. ✅ Firestore data is correctly structured

## 🚀 Next Steps

Once testing is complete:

1. **Deploy Firestore Rules**
   - Follow the guide in `SECURITY_RULES_DEPLOYMENT.md`

2. **Deploy to Production**
   - Commit changes to GitHub
   - Deploy frontend to Netlify
   - Deploy backend to Railway
   - Verify everything works in production

3. **Monitor**
   - Watch for errors in console
   - Check Firestore usage
   - Monitor API response times
   - Collect user feedback

## 📞 Support

If you encounter issues:

1. Check browser console (F12) for JavaScript errors
2. Check backend console for server errors
3. Verify Firestore rules are correct
4. Check network requests in DevTools
5. Refer to IMPLEMENTATION_COMPLETE.md for architecture details

---

**Happy Testing!** 🎮✨
