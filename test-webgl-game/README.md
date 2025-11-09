# Simple WebGL Cube Game

A simple 3D rotating cube built with pure WebGL (no external libraries).

## Features

- ✅ Pure WebGL implementation (no Three.js or Babylon.js needed)
- ✅ Rotating 3D cube with colors
- ✅ Responsive to window resizing
- ✅ Works in all modern browsers

## How to Run Locally

```bash
# Option 1: Using Python
python -m http.server 8000

# Option 2: Using Node.js http-server
npx http-server -p 8000

# Then open: http://localhost:8000
```

## Files

- `index.html` - Complete WebGL game (all-in-one file)
- `package.json` - Project metadata

## How to Deploy as ZIP

1. Create a ZIP file of this entire folder
2. Upload through the admin dashboard
3. Users can play it directly in their browser!

## Browser Support

- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera

## Customization

You can modify:
- Colors in the `colors` array (RGB values 0-1)
- Rotation speed in `render()` function (change `angle += 0.01`)
- Cube size by scaling vertices
- Camera position in matrix calculations

## License

MIT - Feel free to use and modify!
