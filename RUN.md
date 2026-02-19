# 🎬 Hero 9 WebGL Noise Distortion - RUN INSTRUCTIONS

## 🎯 TL;DR - Get It Running in 2 Minutes

### macOS/Linux Users
```bash
cd /Users/aishwaryabhattbhatt/Desktop/CBC/Website-v3
bash start-hero9.sh
```

### Windows Users
```cmd
cd C:\Users\...\Desktop\CBC\Website-v3
start-hero9.bat
```

### Manual Setup (All Platforms)
```bash
cd /Users/aishwaryabhattbhatt/Desktop/CBC/Website-v3/hero9-noise-warp
npm install
npm run dev
```

**Result**: Browser opens at `http://localhost:5174/` with the interactive noise distortion effect! 🎨

---

## 📝 Step-by-Step Setup

### Step 1: Open Terminal/Command Prompt

**macOS/Linux**: 
- Open Terminal (Cmd + Space → type "Terminal")

**Windows**:
- Open Command Prompt (Win + R → type "cmd" → Enter)
- Or open PowerShell

### Step 2: Navigate to Project Directory

```bash
cd /Users/aishwaryabhattbhatt/Desktop/CBC/Website-v3/hero9-noise-warp
```

Or just:
```bash
cd hero9-noise-warp
```

(if already in CBC/Website-v3 directory)

### Step 3: Install Dependencies

```bash
npm install
```

**What happens:**
- Downloads and installs three.js, lil-gui, and vite
- Creates `node_modules/` directory
- Takes ~1-2 minutes (first time only)

### Step 4: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
➜  Local:   http://localhost:5174/
➜  press h to show help
```

### Step 5: Browser Opens Automatically

If not, open manually:
- Go to: `http://localhost:5174/`
- See the interactive noise distortion effect!

---

## 🎮 Using the Application

Once the browser opens at `http://localhost:5174/`:

### 1. See the GUI Panel (Top-Right)
A control panel with these sliders:
- **Intensity**: Warp strength (drag to adjust)
- **Noise Scale**: Pattern size
- **Speed**: Animation speed
- **Octaves**: Detail layers
- **Chromatic Aberration**: RGB separation (optional)
- **Edge Clamp**: Toggle edge handling
- **Aspect Mode**: Cover/Contain dropdown
- **Playing**: Play/pause toggle

### 2. Load an Image

**Option A: Click File Button**
- Button: "📁 Load Image" (bottom-left)
- Click → Browse files
- Select any JPG, PNG, GIF, or WebP
- Image appears and gets distorted!

**Option B: Drag & Drop**
- Drag any image onto the canvas
- Drop to load
- See blue highlight while dragging
- Image loads instantly

**Starting Image**: Gradient fallback (if none provided)

### 3. Adjust the Effect

Use the GUI sliders to:
- **Increase Intensity** → More warping
- **Adjust Noise Scale** → Bigger/smaller patterns
- **Change Speed** → Faster/slower animation
- **Modify Octaves** → Richer/simpler detail
- **Toggle Edge Clamp** → Different edge modes
- **Switch Aspect Mode** → Cover vs contain

**Changes happen in real-time!** ✨

### 4. Play/Pause

- Toggle **"Playing"** checkbox to pause animation
- Adjust parameters while paused
- Resume animation

---

## 🛑 Stopping the Server

In the terminal, press: **Ctrl + C**

Output:
```
^C
➜  Server stopped
```

---

## 🔧 For Development

### File Structure
```
hero9-noise-warp/
├── index.html          ← HTML (drag zone, file input)
├── src/
│   ├── main.js         ← Scene, GUI, events (EDIT HERE for changes)
│   └── shaders/
│       ├── vertex.glsl.js      ← Vertex shader
│       └── fragment.glsl.js    ← Fragment shader (Simplex noise + FBM)
├── package.json        ← Dependencies
└── vite.config.js      ← Build config
```

### Making Changes

**Edit Parameters** (defaults):
1. Open: `src/main.js`
2. Find: `const params = { ... }` (around line 20)
3. Change values:
   ```javascript
   intensity: 0.05,     // Try 0.1 for more warp
   noiseScale: 2.5,     // Try 5 for bigger patterns
   speed: 0.8,          // Try 1.5 for faster
   octaves: 4,          // Try 5 for richer detail
   ```
4. Save file
5. Browser refreshes automatically!

**Edit Shader Effects**:
1. Open: `src/shaders/fragment.glsl.js`
2. Modify noise calculation, offset, or colors
3. Save
4. Browser updates in real-time

### Hot Module Replacement (HMR)

Vite watches files automatically:
- Edit JavaScript → refresh in browser
- Edit shaders → refresh in browser
- Edit HTML → refresh in browser
- **No manual refresh needed!** 🔄

---

## 📦 Build for Production

When ready to deploy:

```bash
npm run build
```

**Output**: 
- Creates `dist/` folder
- Optimized, minified files
- Ready to upload to any host

**Deploy Options:**
1. GitHub Pages
2. Vercel
3. Netlify  
4. AWS S3
5. Any static hosting

Just upload the `dist/` folder contents!

---

## 🐛 Troubleshooting

### Problem: "npm: command not found"
**Solution**: Install Node.js from https://nodejs.org/ (v16+)

### Problem: Port 5174 already in use
**Solution**: 
```bash
# Option A: Kill the process
lsof -i :5174
kill -9 <PID>

# Option B: Use different port
# Edit vite.config.js, change port: 5174 to port: 5175
```

### Problem: Image not loading
**Solution**:
- Check file format (JPG, PNG, GIF, WebP)
- Ensure file isn't corrupted
- Try a different image

### Problem: Low FPS / Stuttering
**Solution**:
- Reduce octaves slider (fewer layers)
- Lower intensity slider
- Close other browser tabs

### Problem: GUI panel not visible
**Solution**:
- Check browser console (F12 → Console)
- Look for error messages
- Try Ctrl+Shift+K (Firefox) or Cmd+Option+J (Chrome)

### Problem: Shader errors
**Solution**:
- Check browser console for details
- Ensure WebGL is supported
- Try different browser (Chrome, Firefox, Safari)

---

## ✅ Verification

After starting `npm run dev`:

- [ ] Browser opens at localhost:5174
- [ ] See fullscreen canvas with distortion animation
- [ ] GUI panel visible (top-right)
- [ ] Sliders work (realtime updates)
- [ ] "📁 Load Image" button clickable
- [ ] Drag & drop zone works
- [ ] Play/pause toggle works
- [ ] No console errors
- [ ] Smooth 60 FPS animation
- [ ] Resize window → aspect ratio corrects

If all checked: **You're ready to go!** 🚀

---

## 💡 Pro Tips

### Tip 1: Start with Defaults
- Default settings look great!
- Tweak octaves (3-5) for different feels
- Intensity 0.05-0.1 usually best

### Tip 2: Use High-Contrast Images
- Works best with images that have good contrast
- Abstract textures look awesome
- Gradients work well too

### Tip 3: Mix Parameters
- Low speed + high intensity = dramatic effect
- High speed + low intensity = subtle undulation
- High octaves = richer, more complex patterns

### Tip 4: Test Different Images
- Landscape: smooth, flowing distortion
- Portrait: interesting focal point changes
- Abstract: hypnotic, trippy effect
- Logos: creative brand interaction

### Tip 5: Use Edge Clamp
- Clamp: Clean edges (recommended for production)
- Wrap: Repeating pattern (cool for abstract)

---

## 🎓 Learning the Code

### Quick Overview (5 min read)

**What's happening:**
1. Vite builds a Three.js WebGL scene
2. Fullscreen plane with custom shader material
3. Shader uses Simplex noise + FBM for distortion
4. GUI controls adjust shader uniforms in real-time
5. Images load via file input or drag & drop

### Key Files to Study

1. **src/main.js** - Scene setup and GUI
2. **src/shaders/fragment.glsl.js** - The distortion effect
3. **index.html** - UI and drag zone

### Learn More

- [Three.js Docs](https://threejs.org/docs)
- [GLSL References](https://learnopengl.com)
- [Simplex Noise](https://en.wikipedia.org/wiki/Simplex_noise)
- [WebGL Basics](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)

---

## 📞 Getting Help

### Documentation Files

- **QUICKSTART.md** - This file (overview)
- **README.md** (in hero9-noise-warp/) - User guide
- **HERO9-SETUP.md** - Setup & integration
- **HERO9-IMPLEMENTATION-SUMMARY.md** - Technical details
- **FILE-MANIFEST.md** - File structure

### Browser Developer Tools

Press **F12** (or Cmd+Option+J on Mac) to open:
- **Console**: See errors and logs
- **Performance**: Monitor FPS and performance
- **Network**: Check resource loading

---

## 🎉 You're All Set!

**Ready to create beautiful noise distortion effects?**

```bash
# One final time:
npm run dev
```

Enjoy! 🌊✨

---

## 📝 Command Reference

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server (with HMR) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `Ctrl + C` | Stop dev server |

---

**Last Updated**: February 19, 2026  
**Status**: ✅ Ready to Run  
**Estimated Setup Time**: 2 minutes
