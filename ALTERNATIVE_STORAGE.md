# 🚀 Game Upload without Firebase Storage

Firebase Storage is no longer free, so we're using **Cloudinary** instead!

## Why Cloudinary?

- ✅ **Truly Free**: 25GB storage/month
- ✅ **Easy Integration**: Just 2 lines of code
- ✅ **No Credit Card Required**
- ✅ **Widget Upload**: Drag & drop interface
- ✅ **CDN**: Automatic optimization

---

## Setup (5 minutes)

### Step 1: Create Free Cloudinary Account

1. Go to: https://cloudinary.com/users/register/free
2. Sign up (no credit card needed!)
3. Verify email
4. Go to Dashboard

### Step 2: Get Your Cloud Name

1. In Cloudinary Dashboard, find **Cloud Name** at the top
2. Copy it (looks like: `abcd1234`)

### Step 3: Add to Your App

Create `src/.env.local`:

```
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
```

### Step 4: Install Cloudinary Widget

```bash
npm install next-cloudinary
```

---

## Updated Upload Code

Replace the AdminDashboard game upload with:

```javascript
import { CldUploadWidget } from 'next-cloudinary';

const handleUploadGame = async (zipUrl) => {
  try {
    setUploading(true);
    
    // Add game to Firestore with Cloudinary URL
    await addDoc(collection(db, 'games'), {
      title: gameTitle,
      description: gameDescription,
      thumbnail: gameThumbnail,
      zipUrl: zipUrl,  // URL from Cloudinary
      createdAt: new Date(),
      createdBy: user.email,
      downloads: 0
    });

    alert('Game uploaded successfully!');
    await fetchGames();
  } catch (err) {
    setError('Upload failed: ' + err.message);
  } finally {
    setUploading(false);
  }
};

// In JSX:
<CldUploadWidget
  uploadPreset="your_upload_preset"  // Create this in Cloudinary
  onSuccess={(result) => {
    setZipFile({
      url: result.info.secure_url,
      name: result.info.original_filename
    });
  }}
>
  {({ open }) => (
    <button onClick={() => open()}>
      Upload ZIP File
    </button>
  )}
</CldUploadWidget>
```

---

## Create Upload Preset

1. In Cloudinary Dashboard
2. Go to **Settings** (gear icon)
3. **Upload** tab
4. Scroll to **Upload presets**
5. Click **Add upload preset**
6. Name: `sync_gaming_games`
7. Unsigned: **Yes** (for frontend uploads)
8. Allowed formats: `zip, zip`
9. Save

Your preset name: `sync_gaming_games`

---

## Pricing

| Service | Free Tier | Perfect for |
|---------|-----------|------------|
| Cloudinary | 25GB/month | Most projects |
| Backblaze B2 | 10GB free | Smaller projects |
| AWS S3 | 12mo free | Larger projects |
| Firebase Storage | Paid only | Use Firestore instead |

---

## Alternative: Backblaze B2

If you prefer Backblaze:

1. Go to: https://www.backblaze.com/b2/cloud-storage.html
2. Sign up (free)
3. Create bucket (free)
4. Get credentials
5. Use B2 SDK for uploads

Backblaze is slightly more complex but very reliable.

---

## Checklist

- [ ] Created Cloudinary account
- [ ] Copied Cloud Name
- [ ] Added to `.env.local`
- [ ] Installed `next-cloudinary`
- [ ] Created upload preset
- [ ] Updated AdminDashboard code
- [ ] Tested upload

---

## Cost Comparison

| What | Firebase Storage | Cloudinary | Backblaze |
|-----|-----------------|-----------|-----------|
| Free Tier | ❌ Removed | ✅ 25GB/mo | ✅ 10GB |
| Credit Card | ❌ Required | ✅ Not needed | ✅ Not needed |
| Upload Speed | Fast | Very Fast | Fast |
| CDN | Yes | Yes | No |
| Setup Time | 5 min | 5 min | 10 min |

---

**Cloudinary is recommended!** Sign up now: https://cloudinary.com/users/register/free
