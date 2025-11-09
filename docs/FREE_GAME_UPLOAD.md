# Free Game Upload - Firestore Only (No External Storage)

## Best Solution for Free: Store in Firestore

Since Firebase removed free Storage, let's use **Firestore** to store game files directly!

### Pros
- ✅ **100% Free** (within Firestore limits)
- ✅ **No external dependencies**
- ✅ **Already set up** (you have Firestore)
- ✅ **Works globally** with CDN

### Cons
- ⚠️ Firestore document size limit: 1MB
- ⚠️ Best for small WebGL games (usually < 500KB)

---

## How It Works

1. Admin uploads ZIP file
2. Browser compresses to Base64
3. Stores in Firestore document
4. User downloads directly from Firestore

---

## Implementation

### Step 1: Update AdminDashboard.js

Replace the upload function:

```javascript
import { addDoc, collection } from 'firebase/firestore';

const handleUploadGame = async (e) => {
  e.preventDefault();
  
  if (!gameTitle || !gameDescription || !zipFile) {
    setError('Please fill in all fields');
    return;
  }

  // Check file size (max 1MB for Firestore)
  if (zipFile.size > 1000000) {
    setError('File too large. Max size: 1MB. Your file: ' + 
      (zipFile.size / 1000000).toFixed(2) + 'MB');
    return;
  }

  try {
    setUploading(true);

    // Read file as Base64
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64String = event.target.result.split(',')[1];

      // Save to Firestore
      await addDoc(collection(db, 'games'), {
        title: gameTitle,
        description: gameDescription,
        thumbnail: gameThumbnail || 'https://via.placeholder.com/300x200?text=Game',
        fileData: base64String,  // Base64 encoded file
        fileName: zipFile.name,
        fileSize: zipFile.size,
        createdAt: new Date(),
        createdBy: user.email,
        downloads: 0
      });

      // Reset form
      setGameTitle('');
      setGameDescription('');
      setGameThumbnail('');
      setZipFile(null);

      await fetchGames();
      alert('Game uploaded successfully!');
    };

    reader.readAsDataURL(zipFile);
  } catch (err) {
    setError('Upload failed: ' + err.message);
  } finally {
    setUploading(false);
  }
};
```

### Step 2: Update GamePlayer.js

Replace the download function:

```javascript
const downloadGame = async () => {
  try {
    const docRef = doc(db, 'games', gameId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const gameData = docSnap.data();
      
      // Decode Base64 back to binary
      const byteCharacters = atob(gameData.fileData);
      const byteArray = new Uint8Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i);
      }

      // Create blob and download
      const blob = new Blob([byteArray], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = gameData.fileName || 'game.zip';
      link.click();
      window.URL.revokeObjectURL(url);
    }
  } catch (err) {
    console.error('Download failed:', err);
    setError('Download failed: ' + err.message);
  }
};
```

### Step 3: Update Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /games/{gameId} {
      // Anyone can read game metadata
      allow read: if true;
      
      // Only admins can upload games
      allow create, update: if request.auth.uid != null && 
        request.auth.token.admin == true && 
        request.resource.size < 1500000;  // Max 1.5MB
      
      // Only admins can delete
      allow delete: if request.auth.uid != null && 
        request.auth.token.admin == true;
    }
  }
}
```

---

## Firestore Pricing (Free Tier)

- ✅ **1GB storage** (usually enough for 10-20 games)
- ✅ **50k reads/day**
- ✅ **20k writes/day**
- ✅ **No credit card needed**

---

## Limits to Know

| Item | Limit |
|------|-------|
| Document size | 1MB max |
| Game file size | ~800KB recommended |
| Free storage | 1GB total |
| Max games | 10-20 small games |
| Cost after | $0.06 per GB after free tier |

---

## Test It

1. Go to Admin Dashboard
2. Upload test WebGL game (should be < 500KB)
3. See it appear in games list
4. Click "Play Now"
5. Download the game
6. Extract and run locally

---

## When to Use Each Method

| Use Firestore | Use Cloudinary |
|--------------|-----------------|
| Small games | Large games |
| < 500KB | > 500KB |
| Prototyping | Production |
| Free account | Free account |
| Simple setup | More complex |

---

## Troubleshooting

**"Document size too large"**
- File is > 1MB
- Compress your WebGL assets
- Remove unused files from ZIP

**"Upload fails silently"**
- Check Firestore rules
- Check storage quota: Firestore > Data > Storage

**"Download doesn't start"**
- Check browser console for errors
- Verify Base64 is stored in Firestore
- Try different browser

---

## Next Steps

1. Update `AdminDashboard.js` with above code
2. Update `GamePlayer.js` with download code
3. Update Firestore security rules
4. Test upload/download
5. Deploy!

---

**This approach is truly free and works great for indie game projects!** 🎮
