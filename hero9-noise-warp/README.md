# WebGL Noise Distortion Effect

A high-performance WebGL-based noise distortion effect that warps images with organic, animated liquid/heat-haze distortions using Simplex noise and Fractional Brownian Motion (FBM).

## Features

- **Organic Distortion**: Uses 2D Simplex noise + FBM for smooth, natural-looking warping
- **Full-Screen Rendering**: Optimized with OrthographicCamera and fullscreen quad
- **Real-Time GUI Controls**:
  - **Intensity**: Warp strength (0–0.2)
  - **Noise Scale**: Pattern size (0.5–10)
  - **Speed**: Animation speed (0–2)
  - **Octaves**: Turbulence layers (1–5)
  - **Chromatic Aberration**: RGB channel separation (0–0.02, optional)
  - **Edge Clamp**: Toggle between clamp and wrap modes
  - **Aspect Mode**: Cover or contain image scaling
  - **Playing**: Play/pause animation
- **Image Loading**: 
  - File input button
  - Drag & drop support
- **Performance Optimized**:
  - Pixel ratio capped at 2x
  - Efficient FBM implementation
  - Lightweight shader overhead
- **Responsive**: Handles canvas resize dynamically with correct aspect ratio

## Tech Stack

- **Vite**: Fast build tool and dev server
- **Three.js**: WebGL abstraction layer
- **lil-gui**: Lightweight GUI library
- **Simplex Noise**: 2D noise generation in GLSL

## Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation & Running

```bash
cd hero9-noise-warp
npm install
npm run dev
```

The development server will open at `http://localhost:5174`.

### Building for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

## Usage

1. **Adjust Parameters**: Use the GUI panel (top-right) to tweak effects
2. **Load Image**: Click "📁 Load Image" button or drag & drop an image onto the canvas
3. **Play/Pause**: Toggle animation with the "Playing" checkbox

## Project Structure

```
hero9-noise-warp/
├── index.html                 # Entry point
├── vite.config.js            # Vite configuration
├── package.json              # Dependencies
├── public/
│   └── sample.jpg           # (optional) Sample image
└── src/
    ├── main.js              # Three.js scene, GUI setup, input handling
    └── shaders/
        ├── vertex.glsl.js   # Vertex shader (passes UV)
        └── fragment.glsl.js # Fragment shader (noise + distortion)
```

## Shader Implementation

### Fragment Shader Highlights

- **Simplex Noise**: High-quality 2D noise (Ashima Arts implementation)
- **FBM (Fractional Brownian Motion)**: Multi-octave noise for richer detail
- **Dynamic Offset Calculation**: 
  - Primary distortion: `fbm(p + time_vec)`
  - Secondary ripples: Sine/cosine waves for extra "liveliness"
- **Aspect Ratio Correction**: `uTexScale` and `uTexOffset` prevent image stretching
- **Edge Handling**: Clamp mode prevents sampling artifacts at edges

### Uniform Parameters

| Uniform | Type | Range | Purpose |
|---------|------|-------|---------|
| `uTex` | sampler2D | — | Input texture |
| `uTime` | float | — | Elapsed time (animation driver) |
| `uIntensity` | float | 0–0.2 | Warp strength |
| `uNoiseScale` | float | 0.5–10 | Noise pattern size |
| `uSpeed` | float | 0–2 | Animation speed multiplier |
| `uOctaves` | float | 1–5 | FBM layers |
| `uChromaticAberration` | float | 0–0.02 | RGB channel offset |
| `uEdgeClamp` | float | 0/1 | Clamp vs wrap mode |
| `uTexScale` | vec2 | — | Aspect ratio scale |
| `uTexOffset` | vec2 | — | Aspect ratio offset |

## Performance Notes

- **Target**: 60 FPS on typical laptops
- **Pixel Ratio**: Capped at 2x for performance
- **Noise Complexity**: FBM with up to 5 octaves (adjustable)
- **No Post-Processing Overhead**: Single-pass fragment shader

## Customization

### Adjust Default Parameters

Edit `params` in `src/main.js`:

```javascript
const params = {
    intensity: 0.05,        // Increase for more warp
    noiseScale: 2.5,        // Larger = bigger patterns
    speed: 0.8,             // Faster animation
    octaves: 4,             // More = richer detail (slower)
    chromaticAberration: 0, // RGB separation effect
    edgeClamp: true,        // Clamp edges (avoid repeating)
    aspectMode: 'cover'     // 'cover' or 'contain'
};
```

### Change Default Image

Replace the placeholder in `initializeWithDefaultImage()`:

```javascript
texture = await loadTexture('./path/to/your/image.jpg');
```

Or place an image in `public/sample.jpg`.

## Browser Compatibility

- Requires WebGL 1.0 support
- Tested on:
  - Chrome/Edge 90+
  - Firefox 88+
  - Safari 14+
  - Mobile browsers (iOS Safari 14+, Chrome Android)

## License

MIT

## Author

Generated for MTM Website - Hero 9 Background Effect
