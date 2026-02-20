/**
 * Hero 9 - WebGL Noise Warp Background Effect
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

class NoiseWarpEffect {
  constructor() {
    console.log('Initializing NoiseWarpEffect...');
    
    // ===== CONFIGURATION - Change these values for faster testing =====
    this.config = {
      // Scale & Frequency
      baseScale: 2.0,           // Base scale multiplier
      scaleMultiplier: 3.0,     // Additional scale for noise position
      waveFrequency: 4.0,       // Higher = thinner waves (try 4-10) - REDUCED for fewer waves
      patternFrequency: 3.0,    // Color gradient frequency
      
      // Distortion & Amplitude
      distortionAmount: 0.15,   // Wave distortion intensity (0.0 - 1.0)
      
      // Animation Speeds
      positionSpeed: 0.15,      // Base position animation speed
      distortionSpeed: 0.2,     // Distortion animation speed
      patternSpeed: 0.08,       // Color pattern animation speed
      waveSpeed: 0.1,           // Wave movement speed
      
      // Threshold (Wave Sharpness)
      thresholdLow: 0.40,       // Lower threshold (0.0 - 0.5) - closer = sharper - WIDER for smoother
      thresholdHigh: 0.60,      // Upper threshold (0.5 - 1.0) - closer = sharper - WIDER for smoother
      
      // Colors (RGB 0-1 range)
      colorWhite: { r: 0.95, g: 0.96, b: 0.98 },
      colorBlue: { r: 0.15, g: 0.45, b: 0.95 },
      colorPurple: { r: 0.45, g: 0.25, b: 0.85 },
      colorPink: { r: 0.75, g: 0.35, b: 0.75 },
      colorTeal: { r: 0.051, g: 0.773, b: 0.494 },
      colorLightBlue: { r: 0.25, g: 0.55, b: 0.95 },

      // Glyph Dither Controls
      cellPx: 10.0,            // 6–18 px recommended
      contrast: 1.4,
      gamma: 1.0,
      softness: 0.08,
      minR: 0.05,
      maxR: 0.48,
      invert: false,
      bayer: false,
      bayerStrength: 0.04,

      // Hero Text Blob
      blobBlur: 10,
      blobInset: -110,
      blobRotate: -4,
      blobSkew: -6,
      blobOpacity: 1.0,
      blobRadiusA: 55,
      blobRadiusB: 45,
      blobRadiusC: 60,
      blobRadiusD: 40,
      blobAnimate: false,
      blobAnimationSpeed: 1.0,
      blobNoiseStrength: 0.18,
      blobNoiseScale: 2.2,
      blobNoiseSpeed: 0.05
    };

    // Auto-load saved settings if present
    try {
      const saved = localStorage.getItem('hero9Settings');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.gradientColors) {
          this.config.colorWhite = data.gradientColors.colorWhite || this.config.colorWhite;
          this.config.colorBlue = data.gradientColors.colorBlue || this.config.colorBlue;
          this.config.colorPurple = data.gradientColors.colorPurple || this.config.colorPurple;
          this.config.colorPink = data.gradientColors.colorPink || this.config.colorPink;
          this.config.colorTeal = data.gradientColors.colorTeal || this.config.colorTeal;
          this.config.colorLightBlue = data.gradientColors.colorLightBlue || this.config.colorLightBlue;
        }
        if (data.noiseAnimation) {
          this.config.baseScale = data.noiseAnimation.baseScale ?? this.config.baseScale;
          this.config.scaleMultiplier = data.noiseAnimation.scaleMultiplier ?? this.config.scaleMultiplier;
          this.config.waveFrequency = data.noiseAnimation.waveFrequency ?? this.config.waveFrequency;
          this.config.patternFrequency = data.noiseAnimation.patternFrequency ?? this.config.patternFrequency;
          this.config.distortionAmount = data.noiseAnimation.distortionAmount ?? this.config.distortionAmount;
          this.config.positionSpeed = data.noiseAnimation.positionSpeed ?? this.config.positionSpeed;
          this.config.distortionSpeed = data.noiseAnimation.distortionSpeed ?? this.config.distortionSpeed;
          this.config.patternSpeed = data.noiseAnimation.patternSpeed ?? this.config.patternSpeed;
          this.config.waveSpeed = data.noiseAnimation.waveSpeed ?? this.config.waveSpeed;
          this.config.thresholdLow = data.noiseAnimation.thresholdLow ?? this.config.thresholdLow;
          this.config.thresholdHigh = data.noiseAnimation.thresholdHigh ?? this.config.thresholdHigh;
        }
        if (data.glyphDither) {
          this.config.cellPx = data.glyphDither.cellPx ?? this.config.cellPx;
          this.config.contrast = data.glyphDither.contrast ?? this.config.contrast;
          this.config.gamma = data.glyphDither.gamma ?? this.config.gamma;
          this.config.softness = data.glyphDither.softness ?? this.config.softness;
          this.config.minR = data.glyphDither.minR ?? this.config.minR;
          this.config.maxR = data.glyphDither.maxR ?? this.config.maxR;
          this.config.invert = data.glyphDither.invert ?? this.config.invert;
          this.config.bayer = data.glyphDither.bayer ?? this.config.bayer;
          this.config.bayerStrength = data.glyphDither.bayerStrength ?? this.config.bayerStrength;
        }
        if (data.heroTextBlob) {
          this.config.blobBlur = data.heroTextBlob.blobBlur ?? this.config.blobBlur;
          this.config.blobInset = data.heroTextBlob.blobInset ?? this.config.blobInset;
          this.config.blobRotate = data.heroTextBlob.blobRotate ?? this.config.blobRotate;
          this.config.blobSkew = data.heroTextBlob.blobSkew ?? this.config.blobSkew;
          this.config.blobOpacity = data.heroTextBlob.blobOpacity ?? this.config.blobOpacity;
          this.config.blobRadiusA = data.heroTextBlob.blobRadiusA ?? this.config.blobRadiusA;
          this.config.blobRadiusB = data.heroTextBlob.blobRadiusB ?? this.config.blobRadiusB;
          this.config.blobRadiusC = data.heroTextBlob.blobRadiusC ?? this.config.blobRadiusC;
          this.config.blobRadiusD = data.heroTextBlob.blobRadiusD ?? this.config.blobRadiusD;
          this.config.blobAnimate = data.heroTextBlob.blobAnimate ?? this.config.blobAnimate;
          this.config.blobAnimationSpeed = data.heroTextBlob.blobAnimationSpeed ?? this.config.blobAnimationSpeed;
          this.config.blobNoiseStrength = data.heroTextBlob.blobNoiseStrength ?? this.config.blobNoiseStrength;
          this.config.blobNoiseScale = data.heroTextBlob.blobNoiseScale ?? this.config.blobNoiseScale;
          this.config.blobNoiseSpeed = data.heroTextBlob.blobNoiseSpeed ?? this.config.blobNoiseSpeed;
        }
      }
    } catch (error) {
      console.warn('Failed to load saved Hero 9 settings:', error);
    }
    // ==================================================================
    
    this.container = document.getElementById('webgl-background');
    if (!this.container) {
      console.error('Container #webgl-background not found!');
      return;
    }
    console.log('Container found:', this.container);

    this.sceneA = new THREE.Scene();
    this.sceneC = new THREE.Scene();
    this.sceneB = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    this.camera.position.z = 1;
    
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    });
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);
    console.log('Renderer created and appended to container');

    const dpr = Math.min(window.devicePixelRatio, 2);
    this.renderTarget = new THREE.WebGLRenderTarget(
      Math.floor(window.innerWidth * dpr),
      Math.floor(window.innerHeight * dpr),
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
      }
    );

    this.renderTargetComposite = new THREE.WebGLRenderTarget(
      Math.floor(window.innerWidth * dpr),
      Math.floor(window.innerHeight * dpr),
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
      }
    );

    // Uniforms - Pass A (Noise Gradient)
    this.uniformsA = {
      uTime: { value: 0 },
      uScale: { value: this.config.baseScale },
      uScaleMultiplier: { value: this.config.scaleMultiplier },
      uWaveFrequency: { value: this.config.waveFrequency },
      uPatternFrequency: { value: this.config.patternFrequency },
      uDistortionAmount: { value: this.config.distortionAmount },
      uPositionSpeed: { value: this.config.positionSpeed },
      uDistortionSpeed: { value: this.config.distortionSpeed },
      uPatternSpeed: { value: this.config.patternSpeed },
      uWaveSpeed: { value: this.config.waveSpeed },
      uThresholdLow: { value: this.config.thresholdLow },
      uThresholdHigh: { value: this.config.thresholdHigh },
      uColorWhite: { value: new THREE.Vector3(this.config.colorWhite.r, this.config.colorWhite.g, this.config.colorWhite.b) },
      uColorBlue: { value: new THREE.Vector3(this.config.colorBlue.r, this.config.colorBlue.g, this.config.colorBlue.b) },
      uColorPurple: { value: new THREE.Vector3(this.config.colorPurple.r, this.config.colorPurple.g, this.config.colorPurple.b) },
      uColorPink: { value: new THREE.Vector3(this.config.colorPink.r, this.config.colorPink.g, this.config.colorPink.b) },
      uColorTeal: { value: new THREE.Vector3(this.config.colorTeal.r, this.config.colorTeal.g, this.config.colorTeal.b) },
      uColorLightBlue: { value: new THREE.Vector3(this.config.colorLightBlue.r, this.config.colorLightBlue.g, this.config.colorLightBlue.b) }
    };

    // Uniforms - Pass B (Glyph Dither)
    this.uniformsC = {
      uSource: { value: this.renderTarget.texture },
      uResolution: { value: new THREE.Vector2(window.innerWidth * dpr, window.innerHeight * dpr) },
      uBlobRect: { value: new THREE.Vector4(0, 0, 1, 1) },
      uBlobBlurPx: { value: this.config.blobBlur },
      uBlobRotate: { value: this.config.blobRotate },
      uBlobSkew: { value: this.config.blobSkew },
      uBlobOpacity: { value: this.config.blobOpacity },
      uRadiusA: { value: this.config.blobRadiusA / 100 },
      uRadiusB: { value: this.config.blobRadiusB / 100 },
      uRadiusC: { value: this.config.blobRadiusC / 100 },
      uRadiusD: { value: this.config.blobRadiusD / 100 },
      uTime: { value: 0 },
      uNoiseStrength: { value: this.config.blobNoiseStrength },
      uNoiseScale: { value: this.config.blobNoiseScale },
      uNoiseSpeed: { value: this.config.blobNoiseSpeed }
    };

    this.uniformsB = {
      uSource: { value: this.renderTargetComposite.texture },
      uResolution: { value: new THREE.Vector2(window.innerWidth * dpr, window.innerHeight * dpr) },
      uCellPx: { value: this.config.cellPx },
      uContrast: { value: this.config.contrast },
      uGamma: { value: this.config.gamma },
      uSoftness: { value: this.config.softness },
      uMinR: { value: this.config.minR },
      uMaxR: { value: this.config.maxR },
      uInvert: { value: this.config.invert ? 1.0 : 0.0 },
      uBayer: { value: this.config.bayer ? 1.0 : 0.0 },
      uBayerStrength: { value: this.config.bayerStrength }
    };

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShaderA = `
      uniform float uTime;
      uniform float uScale;
      uniform float uScaleMultiplier;
      uniform float uWaveFrequency;
      uniform float uPatternFrequency;
      uniform float uDistortionAmount;
      uniform float uPositionSpeed;
      uniform float uDistortionSpeed;
      uniform float uPatternSpeed;
      uniform float uWaveSpeed;
      uniform float uThresholdLow;
      uniform float uThresholdHigh;
      uniform vec3 uColorWhite;
      uniform vec3 uColorBlue;
      uniform vec3 uColorPurple;
      uniform vec3 uColorPink;
      uniform vec3 uColorTeal;
      uniform vec3 uColorLightBlue;
      varying vec2 vUv;

      // Simple noise function
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        
        vec2 u = f * f * (3.0 - 2.0 * f);
        
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        vec2 uv = vUv;
        
        // Perlin-style noise for thin waves
        vec2 pos = uv * uScale * uScaleMultiplier + uTime * uPositionSpeed;
        
        // Single octave for cleaner wave patterns
        float n = noise(pos);
        
        // Subtle distortion for wavy effect
        vec2 distortion = vec2(
          noise(pos + uTime * uDistortionSpeed),
          noise(pos + uTime * uDistortionSpeed + 100.0)
        );
        distortion = (distortion - 0.5) * uDistortionAmount;
        
        vec2 distortedUv = uv + distortion;
        
        // Color 1: White
        vec3 color1 = uColorWhite;
        
        // Color 2: Gradient of 5 colors
        float pattern = noise(distortedUv * uPatternFrequency + uTime * uPatternSpeed);
        
        // 5-color gradient
        vec3 gradColor1 = uColorBlue;
        vec3 gradColor2 = uColorPurple;
        vec3 gradColor3 = uColorPink;
        vec3 gradColor4 = uColorTeal;
        vec3 gradColor5 = uColorLightBlue;
        
        // Create smooth gradient through all 5 colors
        vec3 color2;
        if (pattern < 0.25) {
          color2 = mix(gradColor1, gradColor2, pattern * 4.0);
        } else if (pattern < 0.5) {
          color2 = mix(gradColor2, gradColor3, (pattern - 0.25) * 4.0);
        } else if (pattern < 0.75) {
          color2 = mix(gradColor3, gradColor4, (pattern - 0.5) * 4.0);
        } else {
          color2 = mix(gradColor4, gradColor5, (pattern - 0.75) * 4.0);
        }
        
        // Very thin wave separation
        float waves = noise(distortedUv * uWaveFrequency + uTime * uWaveSpeed);
        waves = smoothstep(uThresholdLow, uThresholdHigh, waves);
        
        vec3 color = mix(color1, color2, waves);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const fragmentShaderC = `
      precision highp float;
      uniform sampler2D uSource;
      uniform vec2 uResolution;
      uniform vec4 uBlobRect; // x, y, w, h in pixels
      uniform float uBlobBlurPx;
      uniform float uBlobRotate;
      uniform float uBlobSkew;
      uniform float uBlobOpacity;
      uniform float uRadiusA;
      uniform float uRadiusB;
      uniform float uRadiusC;
      uniform float uRadiusD;
      uniform float uTime;
      uniform float uNoiseStrength;
      uniform float uNoiseScale;
      uniform float uNoiseSpeed;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 3; i++) {
          v += a * noise(p);
          p *= 2.0;
          a *= 0.5;
        }
        return v;
      }

      float calcRadius(float t) {
        if (t < 0.25) {
          return mix(uRadiusA, uRadiusB, t / 0.25);
        } else if (t < 0.5) {
          return mix(uRadiusB, uRadiusC, (t - 0.25) / 0.25);
        } else if (t < 0.75) {
          return mix(uRadiusC, uRadiusD, (t - 0.5) / 0.25);
        }
        return mix(uRadiusD, uRadiusA, (t - 0.75) / 0.25);
      }

      void main() {
        vec3 srcColor = texture2D(uSource, gl_FragCoord.xy / uResolution).rgb;

        vec2 rectPos = uBlobRect.xy;
        vec2 rectSize = uBlobRect.zw;
        vec2 center = rectPos + rectSize * 0.5;
        vec2 pos = gl_FragCoord.xy - center;

        float rot = radians(uBlobRotate);
        float cosR = cos(-rot);
        float sinR = sin(-rot);
        mat2 rotMat = mat2(cosR, -sinR, sinR, cosR);
        pos = rotMat * pos;

        float skew = tan(radians(uBlobSkew));
        pos.x -= skew * pos.y;

        vec2 halfSize = rectSize * 0.5;
        vec2 p = pos / halfSize;
        float r = length(p);

        float angle = atan(p.y, p.x);
        float t = (angle + 3.14159265) / (6.2831853);
        float radius = calcRadius(t);
        float n = fbm(p * uNoiseScale + uTime * uNoiseSpeed);
        radius += (n - 0.5) * uNoiseStrength;

        float blurNorm = clamp((uBlobBlurPx / min(rectSize.x, rectSize.y)) * 2.0, 0.02, 0.35);
        float inner = max(0.0, radius - blurNorm);
        float mask = smoothstep(radius, inner, r);
        mask = mask * uBlobOpacity;

        vec3 finalColor = mix(srcColor, vec3(1.0), mask);
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const fragmentShaderB = `
      precision highp float;
      uniform sampler2D uSource;
      uniform vec2 uResolution;
      uniform float uCellPx;
      uniform float uContrast;
      uniform float uGamma;
      uniform float uSoftness;
      uniform float uMinR;
      uniform float uMaxR;
      uniform float uInvert;
      uniform float uBayer;
      uniform float uBayerStrength;

      float bayer4x4(vec2 p) {
        vec2 f = mod(p, 4.0);
        float index = f.x + f.y * 4.0;
        float m[16];
        m[0] = 0.0;  m[1] = 8.0;  m[2] = 2.0;  m[3] = 10.0;
        m[4] = 12.0; m[5] = 4.0;  m[6] = 14.0; m[7] = 6.0;
        m[8] = 3.0;  m[9] = 11.0; m[10] = 1.0; m[11] = 9.0;
        m[12] = 15.0; m[13] = 7.0; m[14] = 13.0; m[15] = 5.0;
        float v = m[int(index)] / 16.0;
        return v;
      }

      void main() {
        vec2 frag = gl_FragCoord.xy;
        vec2 cell = floor(frag / uCellPx);
        vec2 local = fract(frag / uCellPx);

        vec2 uvCenter = ((cell + 0.5) * uCellPx) / uResolution;
        vec3 srcColor = texture2D(uSource, uvCenter).rgb;

        float lum = dot(srcColor, vec3(0.2126, 0.7152, 0.0722));
        lum = clamp((lum - 0.5) * uContrast + 0.5, 0.0, 1.0);
        lum = pow(lum, uGamma);

        if (uBayer > 0.5) {
          float b = bayer4x4(frag);
          lum = clamp(lum + (b - 0.5) * uBayerStrength, 0.0, 1.0);
        }

        float v = (uInvert > 0.5) ? lum : (1.0 - lum);
        float radius = mix(uMinR, uMaxR, v);

        float dist = length(local - 0.5);
        float dotMask = smoothstep(radius, radius - uSoftness, dist);

        vec3 dotColor = srcColor;
        vec3 bgColor = vec3(1.0);
        vec3 finalColor = mix(bgColor, dotColor, dotMask);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    // Create material and mesh
    const geometry = new THREE.PlaneGeometry(2, 2);
    const materialA = new THREE.ShaderMaterial({
      uniforms: this.uniformsA,
      vertexShader,
      fragmentShader: fragmentShaderA
    });
    const materialC = new THREE.ShaderMaterial({
      uniforms: this.uniformsC,
      vertexShader,
      fragmentShader: fragmentShaderC
    });
    const materialB = new THREE.ShaderMaterial({
      uniforms: this.uniformsB,
      vertexShader,
      fragmentShader: fragmentShaderB
    });

    const meshA = new THREE.Mesh(geometry, materialA);
    const meshC = new THREE.Mesh(geometry, materialC);
    const meshB = new THREE.Mesh(geometry, materialB);
    this.sceneA.add(meshA);
    this.sceneC.add(meshC);
    this.sceneB.add(meshB);
    console.log('Meshes added to scenes');

    // Handle resize
    window.addEventListener('resize', () => this.onWindowResize());
    
    // Start animation
    this.applyBlobStyles();
    this.updateBlobRect();
    this.createControls();

    this.animate();
    console.log('Animation started');
  }

  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio, 2);
    
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(dpr);
    this.renderTarget.setSize(Math.floor(width * dpr), Math.floor(height * dpr));
    this.renderTargetComposite.setSize(Math.floor(width * dpr), Math.floor(height * dpr));
    this.uniformsC.uResolution.value.set(width * dpr, height * dpr);
    this.uniformsB.uResolution.value.set(width * dpr, height * dpr);
    this.updateBlobRect();
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    
    this.uniformsA.uTime.value += 0.016;
    this.uniformsC.uTime.value += 0.016;
    this.animateBlob();
    this.updateBlobRect();
    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.render(this.sceneA, this.camera);
    this.renderer.setRenderTarget(this.renderTargetComposite);
    this.renderer.render(this.sceneC, this.camera);
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.sceneB, this.camera);
  };

  applyBlobStyles() {
    const heroContent = document.querySelector('.hero-9 .hero-content');
    if (!heroContent) {
      return;
    }
    const radius = `${this.config.blobRadiusA}% ${this.config.blobRadiusB}% ${this.config.blobRadiusC}% ${this.config.blobRadiusD}% / ${this.config.blobRadiusB}% ${this.config.blobRadiusC}% ${this.config.blobRadiusD}% ${this.config.blobRadiusA}%`;
    heroContent.style.setProperty('--blob-blur', `${this.config.blobBlur}px`);
    heroContent.style.setProperty('--blob-rotate', `${this.config.blobRotate}deg`);
    heroContent.style.setProperty('--blob-skew', `${this.config.blobSkew}deg`);
    heroContent.style.setProperty('--blob-inset', `${this.config.blobInset}px`);
    heroContent.style.setProperty('--blob-opacity', `${this.config.blobOpacity}`);
    heroContent.style.setProperty('--blob-radius', radius);

    this.uniformsC.uBlobBlurPx.value = this.config.blobBlur;
    this.uniformsC.uBlobRotate.value = this.config.blobRotate;
    this.uniformsC.uBlobSkew.value = this.config.blobSkew;
    this.uniformsC.uBlobOpacity.value = this.config.blobOpacity;
    this.uniformsC.uRadiusA.value = this.config.blobRadiusA / 100;
    this.uniformsC.uRadiusB.value = this.config.blobRadiusB / 100;
    this.uniformsC.uRadiusC.value = this.config.blobRadiusC / 100;
    this.uniformsC.uRadiusD.value = this.config.blobRadiusD / 100;
    this.uniformsC.uNoiseStrength.value = this.config.blobNoiseStrength;
    this.uniformsC.uNoiseScale.value = this.config.blobNoiseScale;
    this.uniformsC.uNoiseSpeed.value = this.config.blobNoiseSpeed;
  }

  updateBlobRect() {
    const heroContent = document.querySelector('.hero-9 .hero-content');
    if (!heroContent) {
      return;
    }
    const rect = heroContent.getBoundingClientRect();
    const inset = this.config.blobInset;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const left = (rect.left + inset) * dpr;
    const top = (rect.top + inset) * dpr;
    const width = (rect.width - inset * 2) * dpr;
    const height = (rect.height - inset * 2) * dpr;
    this.uniformsC.uBlobRect.value.set(left, top, Math.max(1, width), Math.max(1, height));
  }

  animateBlob() {
    if (!this.config.blobAnimate) {
      return;
    }
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotion.matches) {
      return;
    }
    if (!this.blobStartTime) {
      this.blobStartTime = performance.now();
    }
    const t = (performance.now() - this.blobStartTime) * 0.001 * this.config.blobAnimationSpeed;
    const rot = this.config.blobRotate + Math.sin(t) * 2.0;
    const radiusDelta = Math.sin(t * 0.9) * 5.0;
    this.uniformsC.uBlobRotate.value = rot;
    this.uniformsC.uRadiusA.value = (this.config.blobRadiusA + radiusDelta) / 100;
    this.uniformsC.uRadiusB.value = (this.config.blobRadiusB - radiusDelta) / 100;
    this.uniformsC.uRadiusC.value = (this.config.blobRadiusC + radiusDelta) / 100;
    this.uniformsC.uRadiusD.value = (this.config.blobRadiusD - radiusDelta) / 100;
  }

  createControls() {
    const panel = document.createElement('div');
    panel.style.position = 'absolute';
    panel.style.top = '100px';
    panel.style.right = '20px';
    panel.style.zIndex = '30';
    panel.style.background = 'rgba(255,255,255,0.9)';
    panel.style.padding = '12px 14px';
    panel.style.borderRadius = '10px';
    panel.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
    panel.style.fontFamily = 'Roboto, sans-serif';
    panel.style.fontSize = '12px';
    panel.style.color = '#111';
    panel.style.display = 'grid';
    panel.style.gap = '8px';
    panel.style.maxWidth = '240px';
    panel.style.maxHeight = '70vh';
    panel.style.overflow = 'auto';

    const title = document.createElement('div');
    title.textContent = 'Hero 9 Controls';
    title.style.fontWeight = '700';
    title.style.marginBottom = '4px';

    const section = (label) => {
      const el = document.createElement('div');
      el.textContent = label;
      el.style.fontWeight = '600';
      el.style.marginTop = '6px';
      el.style.paddingTop = '6px';
      el.style.borderTop = '1px solid rgba(0,0,0,0.08)';
      return el;
    };

    const makeLabel = (text) => {
      const label = document.createElement('label');
      label.style.display = 'grid';
      label.style.gap = '4px';
      label.textContent = text;
      return label;
    };

    const makeRange = (min, max, step, value, onInput) => {
      const input = document.createElement('input');
      input.type = 'range';
      input.min = min;
      input.max = max;
      input.step = step;
      input.value = value;
      input.addEventListener('input', () => onInput(parseFloat(input.value)));
      return input;
    };

    const makeCheckbox = (checked, onChange) => {
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = checked;
      input.addEventListener('change', () => onChange(input.checked));
      return input;
    };

    const makeColor = (value, onChange) => {
      const input = document.createElement('input');
      input.type = 'color';
      input.value = value;
      input.addEventListener('input', () => onChange(input.value));
      return input;
    };

    const toHex = (c) => {
      const v = Math.max(0, Math.min(255, Math.round(c * 255)));
      return v.toString(16).padStart(2, '0');
    };

    const rgbToHex = (color) => `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;

    const hexToRgb = (hex) => {
      const h = hex.replace('#', '').trim();
      const r = parseInt(h.slice(0, 2), 16) / 255;
      const g = parseInt(h.slice(2, 4), 16) / 255;
      const b = parseInt(h.slice(4, 6), 16) / 255;
      return { r, g, b };
    };

    const getCurrentSettings = () => {
      const c = (v) => ({ r: v.x, g: v.y, b: v.z });
      return {
        gradientColors: {
          colorWhite: c(this.uniformsA.uColorWhite.value),
          colorBlue: c(this.uniformsA.uColorBlue.value),
          colorPurple: c(this.uniformsA.uColorPurple.value),
          colorPink: c(this.uniformsA.uColorPink.value),
          colorTeal: c(this.uniformsA.uColorTeal.value),
          colorLightBlue: c(this.uniformsA.uColorLightBlue.value)
        },
        noiseAnimation: {
          baseScale: this.uniformsA.uScale.value,
          scaleMultiplier: this.uniformsA.uScaleMultiplier.value,
          waveFrequency: this.uniformsA.uWaveFrequency.value,
          patternFrequency: this.uniformsA.uPatternFrequency.value,
          distortionAmount: this.uniformsA.uDistortionAmount.value,
          positionSpeed: this.uniformsA.uPositionSpeed.value,
          distortionSpeed: this.uniformsA.uDistortionSpeed.value,
          patternSpeed: this.uniformsA.uPatternSpeed.value,
          waveSpeed: this.uniformsA.uWaveSpeed.value,
          thresholdLow: this.uniformsA.uThresholdLow.value,
          thresholdHigh: this.uniformsA.uThresholdHigh.value
        },
        glyphDither: {
          cellPx: this.uniformsB.uCellPx.value,
          contrast: this.uniformsB.uContrast.value,
          gamma: this.uniformsB.uGamma.value,
          softness: this.uniformsB.uSoftness.value,
          minR: this.uniformsB.uMinR.value,
          maxR: this.uniformsB.uMaxR.value,
          invert: this.uniformsB.uInvert.value > 0.5,
          bayer: this.uniformsB.uBayer.value > 0.5,
          bayerStrength: this.uniformsB.uBayerStrength.value
        },
        heroTextBlob: {
          blobBlur: this.config.blobBlur,
          blobInset: this.config.blobInset,
          blobRotate: this.config.blobRotate,
          blobSkew: this.config.blobSkew,
          blobOpacity: this.config.blobOpacity,
          blobRadiusA: this.config.blobRadiusA,
          blobRadiusB: this.config.blobRadiusB,
          blobRadiusC: this.config.blobRadiusC,
          blobRadiusD: this.config.blobRadiusD,
          blobAnimate: this.config.blobAnimate,
          blobAnimationSpeed: this.config.blobAnimationSpeed,
          blobNoiseStrength: this.config.blobNoiseStrength,
          blobNoiseScale: this.config.blobNoiseScale,
          blobNoiseSpeed: this.config.blobNoiseSpeed
        }
      };
    };

    const downloadSettings = () => {
      const data = getCurrentSettings();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'hero9-settings.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    const saveSettings = () => {
      const data = getCurrentSettings();
      localStorage.setItem('hero9Settings', JSON.stringify(data));
    };

    const cellLabel = makeLabel('Cell Size (px)');
    cellLabel.appendChild(makeRange(6, 18, 1, this.config.cellPx, (v) => {
      this.uniformsB.uCellPx.value = v;
    }));

    const contrastLabel = makeLabel('Contrast');
    contrastLabel.appendChild(makeRange(0.5, 2.5, 0.05, this.config.contrast, (v) => {
      this.uniformsB.uContrast.value = v;
    }));

    const gammaLabel = makeLabel('Gamma');
    gammaLabel.appendChild(makeRange(0.5, 2.2, 0.05, this.config.gamma, (v) => {
      this.uniformsB.uGamma.value = v;
    }));

    const softLabel = makeLabel('Dot Softness');
    softLabel.appendChild(makeRange(0.01, 0.2, 0.01, this.config.softness, (v) => {
      this.uniformsB.uSoftness.value = v;
    }));

    const invertLabel = makeLabel('Invert');
    invertLabel.appendChild(makeCheckbox(this.config.invert, (v) => {
      this.uniformsB.uInvert.value = v ? 1.0 : 0.0;
    }));

    const bayerLabel = makeLabel('Bayer Dither');
    bayerLabel.appendChild(makeCheckbox(this.config.bayer, (v) => {
      this.uniformsB.uBayer.value = v ? 1.0 : 0.0;
    }));

    panel.appendChild(title);
    panel.appendChild(section('Glyph Dither'));
    panel.appendChild(cellLabel);
    panel.appendChild(contrastLabel);
    panel.appendChild(gammaLabel);
    panel.appendChild(softLabel);
    panel.appendChild(invertLabel);
    panel.appendChild(bayerLabel);

    panel.appendChild(section('Gradient Colors'));

    const whiteLabel = makeLabel('White');
    whiteLabel.appendChild(makeColor(rgbToHex(this.config.colorWhite), (hex) => {
      const c = hexToRgb(hex);
      this.uniformsA.uColorWhite.value.set(c.r, c.g, c.b);
    }));

    const blueLabel = makeLabel('Blue');
    blueLabel.appendChild(makeColor(rgbToHex(this.config.colorBlue), (hex) => {
      const c = hexToRgb(hex);
      this.uniformsA.uColorBlue.value.set(c.r, c.g, c.b);
    }));

    const purpleLabel = makeLabel('Purple');
    purpleLabel.appendChild(makeColor(rgbToHex(this.config.colorPurple), (hex) => {
      const c = hexToRgb(hex);
      this.uniformsA.uColorPurple.value.set(c.r, c.g, c.b);
    }));

    const pinkLabel = makeLabel('Pink');
    pinkLabel.appendChild(makeColor(rgbToHex(this.config.colorPink), (hex) => {
      const c = hexToRgb(hex);
      this.uniformsA.uColorPink.value.set(c.r, c.g, c.b);
    }));

    const tealLabel = makeLabel('Teal');
    tealLabel.appendChild(makeColor(rgbToHex(this.config.colorTeal), (hex) => {
      const c = hexToRgb(hex);
      this.uniformsA.uColorTeal.value.set(c.r, c.g, c.b);
    }));

    const lightBlueLabel = makeLabel('Light Blue');
    lightBlueLabel.appendChild(makeColor(rgbToHex(this.config.colorLightBlue), (hex) => {
      const c = hexToRgb(hex);
      this.uniformsA.uColorLightBlue.value.set(c.r, c.g, c.b);
    }));

    panel.appendChild(whiteLabel);
    panel.appendChild(blueLabel);
    panel.appendChild(purpleLabel);
    panel.appendChild(pinkLabel);
    panel.appendChild(tealLabel);
    panel.appendChild(lightBlueLabel);

    panel.appendChild(section('Noise Animation'));

    const scaleLabel = makeLabel('Base Scale');
    scaleLabel.appendChild(makeRange(0.5, 5.0, 0.1, this.config.baseScale, (v) => {
      this.uniformsA.uScale.value = v;
    }));

    const scaleMultLabel = makeLabel('Scale Multiplier');
    scaleMultLabel.appendChild(makeRange(0.5, 6.0, 0.1, this.config.scaleMultiplier, (v) => {
      this.uniformsA.uScaleMultiplier.value = v;
    }));

    const waveFreqLabel = makeLabel('Wave Frequency');
    waveFreqLabel.appendChild(makeRange(1.0, 10.0, 0.1, this.config.waveFrequency, (v) => {
      this.uniformsA.uWaveFrequency.value = v;
    }));

    const patternFreqLabel = makeLabel('Pattern Frequency');
    patternFreqLabel.appendChild(makeRange(0.5, 8.0, 0.1, this.config.patternFrequency, (v) => {
      this.uniformsA.uPatternFrequency.value = v;
    }));

    const distortionLabel = makeLabel('Distortion Amount');
    distortionLabel.appendChild(makeRange(0.0, 0.6, 0.01, this.config.distortionAmount, (v) => {
      this.uniformsA.uDistortionAmount.value = v;
    }));

    const posSpeedLabel = makeLabel('Position Speed');
    posSpeedLabel.appendChild(makeRange(0.0, 1.0, 0.01, this.config.positionSpeed, (v) => {
      this.uniformsA.uPositionSpeed.value = v;
    }));

    const distSpeedLabel = makeLabel('Distortion Speed');
    distSpeedLabel.appendChild(makeRange(0.0, 1.0, 0.01, this.config.distortionSpeed, (v) => {
      this.uniformsA.uDistortionSpeed.value = v;
    }));

    const patternSpeedLabel = makeLabel('Pattern Speed');
    patternSpeedLabel.appendChild(makeRange(0.0, 1.0, 0.01, this.config.patternSpeed, (v) => {
      this.uniformsA.uPatternSpeed.value = v;
    }));

    const waveSpeedLabel = makeLabel('Wave Speed');
    waveSpeedLabel.appendChild(makeRange(0.0, 1.0, 0.01, this.config.waveSpeed, (v) => {
      this.uniformsA.uWaveSpeed.value = v;
    }));

    const thresholdLowLabel = makeLabel('Threshold Low');
    thresholdLowLabel.appendChild(makeRange(0.0, 0.6, 0.01, this.config.thresholdLow, (v) => {
      this.uniformsA.uThresholdLow.value = v;
    }));

    const thresholdHighLabel = makeLabel('Threshold High');
    thresholdHighLabel.appendChild(makeRange(0.4, 1.0, 0.01, this.config.thresholdHigh, (v) => {
      this.uniformsA.uThresholdHigh.value = v;
    }));

    panel.appendChild(scaleLabel);
    panel.appendChild(scaleMultLabel);
    panel.appendChild(waveFreqLabel);
    panel.appendChild(patternFreqLabel);
    panel.appendChild(distortionLabel);
    panel.appendChild(posSpeedLabel);
    panel.appendChild(distSpeedLabel);
    panel.appendChild(patternSpeedLabel);
    panel.appendChild(waveSpeedLabel);
    panel.appendChild(thresholdLowLabel);
    panel.appendChild(thresholdHighLabel);

    panel.appendChild(section('Hero Text Mask Blob'));

    const blobBlurLabel = makeLabel('Blob Blur');
    blobBlurLabel.appendChild(makeRange(0, 60, 1, this.config.blobBlur, (v) => {
      this.config.blobBlur = v;
      this.applyBlobStyles();
    }));

    const blobInsetLabel = makeLabel('Blob Inset');
    blobInsetLabel.appendChild(makeRange(-240, -20, 1, this.config.blobInset, (v) => {
      this.config.blobInset = v;
      this.applyBlobStyles();
    }));

    const blobRotateLabel = makeLabel('Blob Rotate');
    blobRotateLabel.appendChild(makeRange(-30, 30, 0.5, this.config.blobRotate, (v) => {
      this.config.blobRotate = v;
      this.applyBlobStyles();
    }));

    const blobSkewLabel = makeLabel('Blob Skew');
    blobSkewLabel.appendChild(makeRange(-30, 30, 0.5, this.config.blobSkew, (v) => {
      this.config.blobSkew = v;
      this.applyBlobStyles();
    }));

    const blobOpacityLabel = makeLabel('Blob Opacity');
    blobOpacityLabel.appendChild(makeRange(0.5, 1.0, 0.01, this.config.blobOpacity, (v) => {
      this.config.blobOpacity = v;
      this.applyBlobStyles();
    }));

    const blobRadiusALabel = makeLabel('Radius A');
    blobRadiusALabel.appendChild(makeRange(10, 90, 1, this.config.blobRadiusA, (v) => {
      this.config.blobRadiusA = v;
      this.applyBlobStyles();
    }));

    const blobRadiusBLabel = makeLabel('Radius B');
    blobRadiusBLabel.appendChild(makeRange(10, 90, 1, this.config.blobRadiusB, (v) => {
      this.config.blobRadiusB = v;
      this.applyBlobStyles();
    }));

    const blobRadiusCLabel = makeLabel('Radius C');
    blobRadiusCLabel.appendChild(makeRange(10, 90, 1, this.config.blobRadiusC, (v) => {
      this.config.blobRadiusC = v;
      this.applyBlobStyles();
    }));

    const blobRadiusDLabel = makeLabel('Radius D');
    blobRadiusDLabel.appendChild(makeRange(10, 90, 1, this.config.blobRadiusD, (v) => {
      this.config.blobRadiusD = v;
      this.applyBlobStyles();
    }));

    const blobAnimateLabel = makeLabel('Animate');
    blobAnimateLabel.appendChild(makeCheckbox(this.config.blobAnimate, (v) => {
      this.config.blobAnimate = v;
      this.applyBlobStyles();
    }));

    const blobSpeedLabel = makeLabel('Animation Speed');
    blobSpeedLabel.appendChild(makeRange(0.2, 3.0, 0.1, this.config.blobAnimationSpeed, (v) => {
      this.config.blobAnimationSpeed = v;
    }));

    const blobNoiseStrengthLabel = makeLabel('Noise Strength');
    blobNoiseStrengthLabel.appendChild(makeRange(0.0, 0.6, 0.01, this.config.blobNoiseStrength, (v) => {
      this.config.blobNoiseStrength = v;
      this.applyBlobStyles();
    }));

    const blobNoiseScaleLabel = makeLabel('Noise Scale');
    blobNoiseScaleLabel.appendChild(makeRange(0.5, 6.0, 0.1, this.config.blobNoiseScale, (v) => {
      this.config.blobNoiseScale = v;
      this.applyBlobStyles();
    }));

    const blobNoiseSpeedLabel = makeLabel('Noise Speed');
    blobNoiseSpeedLabel.appendChild(makeRange(0.0, 0.5, 0.01, this.config.blobNoiseSpeed, (v) => {
      this.config.blobNoiseSpeed = v;
      this.applyBlobStyles();
    }));

    panel.appendChild(blobBlurLabel);
    panel.appendChild(blobInsetLabel);
    panel.appendChild(blobRotateLabel);
    panel.appendChild(blobSkewLabel);
    panel.appendChild(blobOpacityLabel);
    panel.appendChild(blobRadiusALabel);
    panel.appendChild(blobRadiusBLabel);
    panel.appendChild(blobRadiusCLabel);
    panel.appendChild(blobRadiusDLabel);
    panel.appendChild(blobAnimateLabel);
    panel.appendChild(blobSpeedLabel);
    panel.appendChild(blobNoiseStrengthLabel);
    panel.appendChild(blobNoiseScaleLabel);
    panel.appendChild(blobNoiseSpeedLabel);

    panel.appendChild(section('Save / Download'));

    const buttonRow = document.createElement('div');
    buttonRow.style.display = 'flex';
    buttonRow.style.gap = '8px';

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.textContent = 'Save';
    saveBtn.style.padding = '6px 10px';
    saveBtn.style.borderRadius = '6px';
    saveBtn.style.border = '1px solid #ddd';
    saveBtn.style.background = '#fff';
    saveBtn.style.cursor = 'pointer';
    saveBtn.addEventListener('click', saveSettings);

    const downloadBtn = document.createElement('button');
    downloadBtn.type = 'button';
    downloadBtn.textContent = 'Download';
    downloadBtn.style.padding = '6px 10px';
    downloadBtn.style.borderRadius = '6px';
    downloadBtn.style.border = '1px solid #ddd';
    downloadBtn.style.background = '#fff';
    downloadBtn.style.cursor = 'pointer';
    downloadBtn.addEventListener('click', downloadSettings);

    buttonRow.appendChild(saveBtn);
    buttonRow.appendChild(downloadBtn);
    panel.appendChild(buttonRow);

    document.body.appendChild(panel);
  }
}

// Initialize
console.log('Script loaded, waiting for DOM...');

function init() {
  console.log('DOM ready, creating effect...');
  try {
    new NoiseWarpEffect();
  } catch (error) {
    console.error('Error creating NoiseWarpEffect:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
