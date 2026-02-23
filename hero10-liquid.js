/**
 * Hero 10 - WebGL Liquid Gradient + Halftone Dither
 */

import * as THREE from 'three';

class LiquidGradientEffect {
  constructor() {
    console.log('Initializing LiquidGradientEffect...');
    
    // ===== CONFIGURATION =====
    this.config = this.loadSettings() || {
      // Liquid Gradient Parameters
      warpAmp: 1.0,
      sharpness: 10.0,
      speed: 0.3,
      fbmOctaves: 1,
      noiseScale: 0.5,
      waveAmp: 0.10,
      waveFreq: 10.0,
      waveRotation: 0.0,
      white2Influence: 15.0,
      
      // Center movement amplitudes
      white1RadiusX: 0.60,
      white1RadiusY: 0.45,
      blueRadiusX: 0.55,
      blueRadiusY: 0.50,
      tealRadiusX: 0.50,
      tealRadiusY: 0.55,
      purpleRadiusX: 0.58,
      purpleRadiusY: 0.48,
      pinkRadiusX: 0.52,
      pinkRadiusY: 0.52,
      white2RadiusX: 0.25,
      white2RadiusY: 0.25,
      white3RadiusX: 0.15,
      white3RadiusY: 0.50,
      
      // Color influence controls
      white1Influence: 1.0,
      blueInfluence: 1.0,
      tealInfluence: 1.0,
      purpleInfluence: 1.0,
      pinkInfluence: 1.0,
      
      // Colors (RGB 0-1 range)
      colorWhite: { r: 1.0, g: 1.0, b: 1.0 },
      colorBlue: { r: 0.196, g: 0.392, b: 1.0 },
      colorTeal: { r: 0.196, g: 0.863, b: 0.784 },
      colorPurple: { r: 0.588, g: 0.314, b: 1.0 },
      colorPink: { r: 1.0, g: 0.392, b: 0.706 },
      
      // Glyph Dither Controls
      cellPx: 18.0,
      contrast: 5.0,
      gamma: 0.0,
      softness: 0.01,
      minR: 0.05,
      maxR: 0.48,
      dotSpacing: 0.0,
      lumThreshold: 0.0,
      invertDots: true,
      invert: false,
      bayer: false,
      bayerStrength: 0.04,
      
      // Layer Toggles
      showGlyphDither: true
    };

    // Center data (baseSpeed and baseOffset for animation)
    this.centers = [
      { baseSpeed: [0.45, 0.38], baseOffset: [0, 0] },      // White 1
      { baseSpeed: [0.32, 0.41], baseOffset: [1.6, 2.2] },  // Blue
      { baseSpeed: [0.37, 0.30], baseOffset: [3.1, 0.9] },  // Teal
      { baseSpeed: [0.40, 0.36], baseOffset: [4.4, 3.7] },  // Purple
      { baseSpeed: [0.35, 0.43], baseOffset: [5.5, 1.3] },  // Pink
      { baseSpeed: [0.38, 0.36], baseOffset: [2.1, 1.5] },  // White 2
      { baseSpeed: [0.25, 0.40], baseOffset: [4.2, 3.5] }   // White 3
    ];

    this.layerToggles = {
      liquidGradient: true,
      glyphDither: this.config.showGlyphDither
    };

    this.container = document.getElementById('webgl-background');
    if (!this.container) {
      console.error('Container #webgl-background not found!');
      return;
    }

    this.sceneLiquid = new THREE.Scene();
    this.sceneDither = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    this.camera.position.z = 1;
    
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    });
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    const dpr = Math.min(window.devicePixelRatio, 2);
    this.renderTargetLiquid = new THREE.WebGLRenderTarget(
      Math.floor(window.innerWidth * dpr),
      Math.floor(window.innerHeight * dpr),
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
      }
    );

    // Uniforms for liquid gradient shader
    this.uniformsLiquid = {
      uRes: { value: new THREE.Vector2(window.innerWidth * dpr, window.innerHeight * dpr) },
      uTime: { value: 0.0 },
      c0: { value: new THREE.Vector3(this.config.colorWhite.r, this.config.colorWhite.g, this.config.colorWhite.b) },
      c1: { value: new THREE.Vector3(this.config.colorBlue.r, this.config.colorBlue.g, this.config.colorBlue.b) },
      c2: { value: new THREE.Vector3(this.config.colorTeal.r, this.config.colorTeal.g, this.config.colorTeal.b) },
      c3: { value: new THREE.Vector3(this.config.colorPurple.r, this.config.colorPurple.g, this.config.colorPurple.b) },
      c4: { value: new THREE.Vector3(this.config.colorPink.r, this.config.colorPink.g, this.config.colorPink.b) },
      warpAmp: { value: this.config.warpAmp },
      sharp: { value: this.config.sharpness },
      noiseScale: { value: this.config.noiseScale },
      fbmOctaves: { value: this.config.fbmOctaves },
      waveAmp: { value: this.config.waveAmp },
      waveFreq: { value: this.config.waveFreq },
      waveRotation: { value: this.config.waveRotation },
      white2Influence: { value: this.config.white2Influence },
      white1Influence: { value: this.config.white1Influence },
      blueInfluence: { value: this.config.blueInfluence },
      tealInfluence: { value: this.config.tealInfluence },
      purpleInfluence: { value: this.config.purpleInfluence },
      pinkInfluence: { value: this.config.pinkInfluence },
      m0: { value: new THREE.Vector2(0, 0) },
      m1: { value: new THREE.Vector2(0, 0) },
      m2: { value: new THREE.Vector2(0, 0) },
      m3: { value: new THREE.Vector2(0, 0) },
      m4: { value: new THREE.Vector2(0, 0) },
      m5: { value: new THREE.Vector2(0, 0) },
      m6: { value: new THREE.Vector2(0, 0) }
    };

    // Uniforms for dither shader
    this.uniformsDither = {
      uSource: { value: this.renderTargetLiquid.texture },
      uResolution: { value: new THREE.Vector2(window.innerWidth * dpr, window.innerHeight * dpr) },
      uCellPx: { value: this.config.cellPx },
      uContrast: { value: this.config.contrast },
      uGamma: { value: this.config.gamma },
      uSoftness: { value: this.config.softness },
      uMinR: { value: this.config.minR },
      uMaxR: { value: this.config.maxR },
      uDotSpacing: { value: this.config.dotSpacing },
      uLumThreshold: { value: this.config.lumThreshold },
      uInvertDots: { value: this.config.invertDots ? 1.0 : 0.0 },
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

    // Liquid gradient fragment shader (from p5.js code)
    const fragmentShaderLiquid = `
      precision highp float;

      varying vec2 vUv;
      uniform vec2 uRes;
      uniform float uTime;

      uniform vec3 c0;
      uniform vec3 c1;
      uniform vec3 c2;
      uniform vec3 c3;
      uniform vec3 c4;

      uniform float warpAmp;
      uniform float sharp;
      uniform float noiseScale;
      uniform int fbmOctaves;
      uniform float waveAmp;
      uniform float waveFreq;
      uniform float waveRotation;
      uniform float white2Influence;
      uniform float white1Influence;
      uniform float blueInfluence;
      uniform float tealInfluence;
      uniform float purpleInfluence;
      uniform float pinkInfluence;

      uniform vec2 m0;
      uniform vec2 m1;
      uniform vec2 m2;
      uniform vec2 m3;
      uniform vec2 m4;
      uniform vec2 m5;
      uniform vec2 m6;

      float hash21(vec2 p){
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 34.345);
        return fract(p.x * p.y);
      }

      float noise(vec2 p){
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash21(i);
        float b = hash21(i + vec2(1.0, 0.0));
        float c = hash21(i + vec2(0.0, 1.0));
        float d = hash21(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a)*u.y*(1.0 - u.x) + (d - b)*u.x*u.y;
      }

      float fbm(vec2 p){
        float v = 0.0;
        float a = 0.5;
        for(int i=0;i<10;i++){
          if(i >= fbmOctaves) break;
          v += a * noise(p);
          p *= 2.02;
          a *= 0.5;
        }
        return v;
      }

      float influence(vec2 p, vec2 center, float sharp){
        float d = length(p - center);
        return exp(-sharp * d * d);
      }

      void main() {
        vec2 uv = vUv;
        vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0);

        float t = uTime;

        float cosR = cos(waveRotation);
        float sinR = sin(waveRotation);
        vec2 pRotated = vec2(
          p.x * cosR - p.y * sinR,
          p.x * sinR + p.y * cosR
        );
        
        vec2 wave = vec2(
          sin(pRotated.y * waveFreq + t * 0.5) * waveAmp,
          sin(pRotated.x * waveFreq + t * 0.4) * waveAmp
        );
        p += wave;

        float n1 = fbm(p * noiseScale + vec2(0.0, t * 0.18));
        float n2 = fbm(p * noiseScale + vec2(10.0, -t * 0.15));
        vec2 warp = vec2(n1, n2) - 0.5;

        vec2 q = p + warp * warpAmp;

        float w0 = influence(q, m0, sharp);
        float w1 = influence(q, m1, sharp);
        float w2 = influence(q, m2, sharp);
        float w3 = influence(q, m3, sharp);
        float w4 = influence(q, m4, sharp);
        float w5 = influence(q, m5, sharp);
        float w6 = influence(q, m6, sharp);

        w0 *= white1Influence * 4.0;
        w1 *= blueInfluence;
        w2 *= tealInfluence;
        w3 *= purpleInfluence;
        w4 *= pinkInfluence;
        w5 *= white2Influence;
        w6 *= 8.0;

        float s = w0 + w1 + w2 + w3 + w4 + w5 + w6 + 1e-6;
        w0 /= s; w1 /= s; w2 /= s; w3 /= s; w4 /= s; w5 /= s; w6 /= s;

        vec3 col = c0*(w0 + w5 + w6) + c1*w1 + c2*w2 + c3*w3 + c4*w4;
        
        float totalInfluence = w0 + w1 + w2 + w3 + w4 + w5 + w6;
        col = mix(vec3(1.0), col, totalInfluence * 1.5);
        col = clamp(col, 0.0, 1.0);

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    // Halftone dither shader (same as hero9)
    const fragmentShaderDither = `
      precision highp float;
      uniform sampler2D uSource;
      uniform vec2 uResolution;
      uniform float uCellPx;
      uniform float uContrast;
      uniform float uGamma;
      uniform float uSoftness;
      uniform float uMinR;
      uniform float uMaxR;
      uniform float uDotSpacing;
      uniform float uLumThreshold;
      uniform float uInvertDots;
      uniform float uInvert;
      uniform float uBayer;
      uniform float uBayerStrength;

      float bayerMatrix4x4(vec2 p) {
        ivec2 ip = ivec2(floor(p));
        int x = ip.x & 3;
        int y = ip.y & 3;
        int index = x + y * 4;
        float values[16];
        values[0]=0.0;values[1]=8.0;values[2]=2.0;values[3]=10.0;
        values[4]=12.0;values[5]=4.0;values[6]=14.0;values[7]=6.0;
        values[8]=3.0;values[9]=11.0;values[10]=1.0;values[11]=9.0;
        values[12]=15.0;values[13]=7.0;values[14]=13.0;values[15]=5.0;
        return values[index]/16.0;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution;
        vec3 col = texture2D(uSource, uv).rgb;
        
        // Calculate cell position
        vec2 cellCoord = gl_FragCoord.xy / uCellPx;
        vec2 cellCenter = floor(cellCoord) + 0.5;
        vec2 offset = cellCoord - cellCenter;
        float dist = length(offset);
        
        // Sample gradient at cell center to determine dot size
        vec2 cellCenterUV = cellCenter * uCellPx / uResolution;
        vec3 cellColor = texture2D(uSource, cellCenterUV).rgb;
        
        // Calculate RAW luminance for sizing (before any processing)
        float rawLum = dot(cellColor, vec3(0.299, 0.587, 0.114));
        
        // Control dot size based on RAW luminance
        // When inverted: darker/colored = bigger dots, white = smaller dots
        float lumForSize = uInvertDots > 0.5 ? (1.0 - rawLum) : rawLum;
        
        // Map lumForSize (0 to 1) directly to radius range
        float radius = mix(uMinR, uMaxR, lumForSize);
        // Apply dot spacing by reducing effective radius
        radius = max(0.0, radius - uDotSpacing);
        
        // Now calculate luminance for visual output (with all processing)
        float lum = dot(col, vec3(0.299, 0.587, 0.114));
        
        // Apply luminance threshold
        lum = max(0.0, lum - uLumThreshold) / max(0.001, 1.0 - uLumThreshold);
        
        if (uBayer > 0.5) {
          float threshold = bayerMatrix4x4(gl_FragCoord.xy);
          lum = mix(lum, lum + (threshold - 0.5) * uBayerStrength, uBayer);
        }

        lum = pow(lum, uGamma);
        lum = (lum - 0.5) * uContrast + 0.5;
        lum = clamp(lum, 0.0, 1.0);
        float alpha = smoothstep(radius + uSoftness, radius - uSoftness, dist);
        
        if (uInvert > 0.5) alpha = 1.0 - alpha;
        
        // Output colored dots: use alpha as mask, preserve gradient color
        vec3 finalColor = col * alpha + vec3(1.0) * (1.0 - alpha);
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    // Create materials
    const matLiquid = new THREE.ShaderMaterial({
      uniforms: this.uniformsLiquid,
      vertexShader: vertexShader,
      fragmentShader: fragmentShaderLiquid
    });

    const matDither = new THREE.ShaderMaterial({
      uniforms: this.uniformsDither,
      vertexShader: vertexShader,
      fragmentShader: fragmentShaderDither
    });

    const quad = new THREE.PlaneGeometry(2, 2);
    this.sceneLiquid.add(new THREE.Mesh(quad, matLiquid));
    this.sceneDither.add(new THREE.Mesh(quad, matDither));

    this.createControls();
    window.addEventListener('resize', () => this.onWindowResize());
    this.animate();
  }

  onWindowResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h);
    const dpr = Math.min(window.devicePixelRatio, 2);
    this.renderTargetLiquid.setSize(Math.floor(w * dpr), Math.floor(h * dpr));
    this.uniformsLiquid.uRes.value.set(w * dpr, h * dpr);
    this.uniformsDither.uResolution.value.set(w * dpr, h * dpr);
  }

  updateCenterPositions() {
    const t = this.uniformsLiquid.uTime.value * this.config.speed;
    
    for (let i = 0; i < this.centers.length; i++) {
      const c = this.centers[i];
      let x, y;
      
      if (i === 0) {
        x = this.config.white1RadiusX * Math.cos(t * c.baseSpeed[0]);
        y = this.config.white1RadiusY * Math.sin(t * c.baseSpeed[1]);
      } else if (i === 1) {
        x = this.config.blueRadiusX * Math.cos(t * c.baseSpeed[0] + c.baseOffset[0]);
        y = this.config.blueRadiusY * Math.sin(t * c.baseSpeed[1] + c.baseOffset[1]);
      } else if (i === 2) {
        x = this.config.tealRadiusX * Math.cos(t * c.baseSpeed[0] + c.baseOffset[0]);
        y = this.config.tealRadiusY * Math.sin(t * c.baseSpeed[1] + c.baseOffset[1]);
      } else if (i === 3) {
        x = this.config.purpleRadiusX * Math.cos(t * c.baseSpeed[0] + c.baseOffset[0]);
        y = this.config.purpleRadiusY * Math.sin(t * c.baseSpeed[1] + c.baseOffset[1]);
      } else if (i === 4) {
        x = this.config.pinkRadiusX * Math.cos(t * c.baseSpeed[0] + c.baseOffset[0]);
        y = this.config.pinkRadiusY * Math.sin(t * c.baseSpeed[1] + c.baseOffset[1]);
      } else if (i === 5) {
        x = -0.5 + this.config.white2RadiusX * Math.cos(t * c.baseSpeed[0] + c.baseOffset[0]);
        y = this.config.white2RadiusY * Math.sin(t * c.baseSpeed[1] + c.baseOffset[1]);
      } else if (i === 6) {
        x = -0.85 + this.config.white3RadiusX * Math.cos(t * c.baseSpeed[0] + c.baseOffset[0]);
        y = this.config.white3RadiusY * Math.sin(t * c.baseSpeed[1] + c.baseOffset[1]);
      }
      
      this.uniformsLiquid['m' + i].value.set(x, y);
    }
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    
    this.uniformsLiquid.uTime.value += 0.016;
    this.updateCenterPositions();

    // Liquid Gradient Pass
    if (this.layerToggles.liquidGradient) {
      this.renderer.setRenderTarget(this.renderTargetLiquid);
      this.renderer.render(this.sceneLiquid, this.camera);
    }

    // Dither Pass (final output)
    if (this.layerToggles.glyphDither) {
      this.renderer.setRenderTarget(null);
      this.renderer.render(this.sceneDither, this.camera);
    } else if (this.layerToggles.liquidGradient) {
      this.renderer.setRenderTarget(null);
      this.renderer.render(this.sceneLiquid, this.camera);
    }
  };

  createControls() {
    const panel = document.createElement('div');
    panel.style.cssText = `
      position: fixed; top: 120px; right: 20px; z-index: 10000;
      background: rgba(255,255,255,0.95); padding: 16px; border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: system-ui, sans-serif;
      font-size: 13px; max-width: 280px; max-height: calc(100vh - 140px); overflow-y: auto;
    `;

    // Helper functions for UI
    const makeAccordion = (title, openByDefault = false) => {
      const container = document.createElement('div');
      container.style.marginBottom = '8px';
      
      const header = document.createElement('div');
      header.style.cssText = 'cursor: pointer; padding: 8px; background: #f0f0f0; border-radius: 4px; font-weight: 600; user-select: none;';
      header.textContent = title;
      
      const content = document.createElement('div');
      content.style.cssText = `padding: 8px 4px; display: ${openByDefault ? 'block' : 'none'};`;
      
      header.onclick = () => {
        const isOpen = content.style.display === 'block';
        content.style.display = isOpen ? 'none' : 'block';
      };
      
      container.appendChild(header);
      container.appendChild(content);
      
      return { container, content };
    };

    const makeLabel = (text) => {
      const label = document.createElement('label');
      label.style.display = 'grid';
      label.style.gap = '4px';
      label.textContent = text;
      return label;
    };

    const makeRange = (min, max, step, value, onInput) => {
      const wrapper = document.createElement('div');
      wrapper.style.display = 'flex';
      wrapper.style.gap = '8px';
      wrapper.style.alignItems = 'center';
      
      const input = document.createElement('input');
      input.type = 'range';
      input.min = min;
      input.max = max;
      input.step = step;
      input.value = value;
      input.style.flex = '1';
      
      const valueSpan = document.createElement('span');
      valueSpan.textContent = value;
      valueSpan.style.minWidth = '45px';
      valueSpan.style.fontSize = '11px';
      valueSpan.style.color = '#666';
      valueSpan.style.textAlign = 'right';
      
      input.addEventListener('input', () => {
        const val = parseFloat(input.value);
        valueSpan.textContent = val;
        onInput(val);
      });
      
      wrapper.appendChild(input);
      wrapper.appendChild(valueSpan);
      return wrapper;
    };

    const makeColor = (value, onChange) => {
      const input = document.createElement('input');
      input.type = 'color';
      input.value = value;
      input.addEventListener('input', () => onChange(input.value));
      return input;
    };

    const hexToRgb = (hex) => {
      const h = hex.replace('#', '').trim();
      const r = parseInt(h.slice(0, 2), 16) / 255;
      const g = parseInt(h.slice(2, 4), 16) / 255;
      const b = parseInt(h.slice(4, 6), 16) / 255;
      return { r, g, b };
    };

    const rgbToHex = (color) => {
      const toHex = (c) => {
        const v = Math.max(0, Math.min(255, Math.round(c * 255)));
        return v.toString(16).padStart(2, '0');
      };
      return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
    };

    // Liquid Gradient section
    const liquidSection = makeAccordion('Liquid Gradient', true);

    const warpLabel = makeLabel('Warp Amount');
    warpLabel.appendChild(makeRange(0, 2, 0.1, this.config.warpAmp, (v) => {
      this.uniformsLiquid.warpAmp.value = v;
    }));

    const sharpLabel = makeLabel('Edge Sharpness');
    sharpLabel.appendChild(makeRange(1, 20, 0.5, this.config.sharpness, (v) => {
      this.uniformsLiquid.sharp.value = v;
    }));

    const speedLabel = makeLabel('Speed');
    speedLabel.appendChild(makeRange(0, 3, 0.1, this.config.speed, (v) => {
      this.config.speed = v;
    }));

    liquidSection.content.appendChild(warpLabel);
    liquidSection.content.appendChild(sharpLabel);
    liquidSection.content.appendChild(speedLabel);
    panel.appendChild(liquidSection.container);

    // Colors section
    const colorsSection = makeAccordion('Colors', false);

    const whiteLabel = makeLabel('White');
    whiteLabel.appendChild(makeColor(rgbToHex(this.config.colorWhite), (hex) => {
      const c = hexToRgb(hex);
      this.uniformsLiquid.c0.value.set(c.r, c.g, c.b);
    }));

    const blueLabel = makeLabel('Blue');
    blueLabel.appendChild(makeColor(rgbToHex(this.config.colorBlue), (hex) => {
      const c = hexToRgb(hex);
      this.uniformsLiquid.c1.value.set(c.r, c.g, c.b);
    }));

    const tealLabel = makeLabel('Teal');
    tealLabel.appendChild(makeColor(rgbToHex(this.config.colorTeal), (hex) => {
      const c = hexToRgb(hex);
      this.uniformsLiquid.c2.value.set(c.r, c.g, c.b);
    }));

    const purpleLabel = makeLabel('Purple');
    purpleLabel.appendChild(makeColor(rgbToHex(this.config.colorPurple), (hex) => {
      const c = hexToRgb(hex);
      this.uniformsLiquid.c3.value.set(c.r, c.g, c.b);
    }));

    const pinkLabel = makeLabel('Pink');
    pinkLabel.appendChild(makeColor(rgbToHex(this.config.colorPink), (hex) => {
      const c = hexToRgb(hex);
      this.uniformsLiquid.c4.value.set(c.r, c.g, c.b);
    }));

    colorsSection.content.appendChild(whiteLabel);
    colorsSection.content.appendChild(blueLabel);
    colorsSection.content.appendChild(tealLabel);
    colorsSection.content.appendChild(purpleLabel);
    colorsSection.content.appendChild(pinkLabel);
    panel.appendChild(colorsSection.container);

    // Glyph Dither section
    const glyphSection = makeAccordion('Glyph Dither', false);

    const cellLabel = makeLabel('Cell Size (px)');
    cellLabel.appendChild(makeRange(6.0, 24.0, 1.0, this.config.cellPx, (v) => {
      this.uniformsDither.uCellPx.value = v;
    }));

    const contrastLabel = makeLabel('Contrast');
    contrastLabel.appendChild(makeRange(0.0, 10.0, 0.1, this.config.contrast, (v) => {
      this.uniformsDither.uContrast.value = v;
    }));

    const gammaLabel = makeLabel('Gamma');
    gammaLabel.appendChild(makeRange(-2.0, 3.0, 0.1, this.config.gamma, (v) => {
      this.uniformsDither.uGamma.value = v;
    }));

    const softnessLabel = makeLabel('Softness');
    softnessLabel.appendChild(makeRange(0.0, 0.1, 0.01, this.config.softness, (v) => {
      this.uniformsDither.uSoftness.value = v;
    }));

    const minRLabel = makeLabel('Min Radius');
    minRLabel.appendChild(makeRange(0.0, 0.5, 0.01, this.config.minR, (v) => {
      this.uniformsDither.uMinR.value = v;
    }));

    const maxRLabel = makeLabel('Max Radius');
    maxRLabel.appendChild(makeRange(0.0, 0.5, 0.01, this.config.maxR, (v) => {
      this.uniformsDither.uMaxR.value = v;
    }));

    const dotSpacingLabel = makeLabel('Dot Spacing');
    dotSpacingLabel.appendChild(makeRange(0.0, 0.3, 0.01, this.config.dotSpacing, (v) => {
      this.uniformsDither.uDotSpacing.value = v;
    }));

    const makeCheckbox = (checked, onChange) => {
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = checked;
      input.addEventListener('change', () => onChange(input.checked));
      return input;
    };

    const ditherToggleLabel = makeLabel('Show Layer');
    ditherToggleLabel.appendChild(makeCheckbox(this.config.showGlyphDither, (v) => {
      this.config.showGlyphDither = v;
      this.layerToggles.glyphDither = v;
    }));

    const invertLabel = makeLabel('Invert');
    invertLabel.appendChild(makeCheckbox(this.config.invert, (v) => {
      this.config.invert = v;
      this.uniformsDither.uInvert.value = v ? 1.0 : 0.0;
    }));

    glyphSection.content.appendChild(ditherToggleLabel);
    glyphSection.content.appendChild(cellLabel);
    glyphSection.content.appendChild(contrastLabel);
    glyphSection.content.appendChild(gammaLabel);
    glyphSection.content.appendChild(softnessLabel);
    glyphSection.content.appendChild(minRLabel);
    glyphSection.content.appendChild(maxRLabel);
    glyphSection.content.appendChild(dotSpacingLabel);
    glyphSection.content.appendChild(invertLabel);
    panel.appendChild(glyphSection.container);

    // Sync uniforms with loaded config values
    this.syncUniformsWithConfig();

    // Add Save/Download buttons section
    const buttonsDiv = document.createElement('div');
    buttonsDiv.style.cssText = 'padding: 15px; display: flex; gap: 10px; flex-direction: column;';
    
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Settings';
    saveButton.style.cssText = 'padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;';
    saveButton.onmouseover = () => saveButton.style.background = '#45a049';
    saveButton.onmouseout = () => saveButton.style.background = '#4CAF50';
    saveButton.onclick = () => this.saveSettings();
    
    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download Settings JSON';
    downloadButton.style.cssText = 'padding: 10px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;';
    downloadButton.onmouseover = () => downloadButton.style.background = '#0b7dda';
    downloadButton.onmouseout = () => downloadButton.style.background = '#2196F3';
    downloadButton.onclick = () => this.downloadSettings();
    
    buttonsDiv.appendChild(saveButton);
    buttonsDiv.appendChild(downloadButton);
    panel.appendChild(buttonsDiv);

    document.body.appendChild(panel);
  }

  saveSettings() {
    try {
      const settings = JSON.stringify(this.config, null, 2);
      localStorage.setItem('hero10-liquid-settings', settings);
      console.log('Settings saved to localStorage');
      
      // Visual feedback
      const button = event.target;
      const originalText = button.textContent;
      button.textContent = 'Saved!';
      setTimeout(() => {
        button.textContent = originalText;
      }, 1500);
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    }
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem('hero10-liquid-settings');
      if (saved) {
        const settings = JSON.parse(saved);
        console.log('Settings loaded from localStorage');
        return settings;
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
    return null;
  }

  downloadSettings() {
    try {
      const settings = JSON.stringify(this.config, null, 2);
      const blob = new Blob([settings], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hero10-liquid-settings-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log('Settings downloaded');
      
      // Visual feedback
      const button = event.target;
      const originalText = button.textContent;
      button.textContent = 'Downloaded!';
      setTimeout(() => {
        button.textContent = originalText;
      }, 1500);
    } catch (error) {
      console.error('Failed to download settings:', error);
      alert('Failed to download settings');
    }
  }

  syncUniformsWithConfig() {
    // Sync all uniforms with config values (used after loading settings)
    this.uniformsLiquid.warpAmp.value = this.config.warpAmp;
    this.uniformsLiquid.sharp.value = this.config.sharpness;
    this.uniformsLiquid.noiseScale.value = this.config.noiseScale;
    this.uniformsLiquid.fbmOctaves.value = this.config.fbmOctaves;
    this.uniformsLiquid.waveAmp.value = this.config.waveAmp;
    this.uniformsLiquid.waveFreq.value = this.config.waveFreq;
    this.uniformsLiquid.waveRotation.value = this.config.waveRotation;
    this.uniformsLiquid.white2Influence.value = this.config.white2Influence;
    this.uniformsLiquid.white1Influence.value = this.config.white1Influence;
    this.uniformsLiquid.blueInfluence.value = this.config.blueInfluence;
    this.uniformsLiquid.tealInfluence.value = this.config.tealInfluence;
    this.uniformsLiquid.purpleInfluence.value = this.config.purpleInfluence;
    this.uniformsLiquid.pinkInfluence.value = this.config.pinkInfluence;
    this.uniformsLiquid.c0.value.set(this.config.colorWhite.r, this.config.colorWhite.g, this.config.colorWhite.b);
    this.uniformsLiquid.c1.value.set(this.config.colorBlue.r, this.config.colorBlue.g, this.config.colorBlue.b);
    this.uniformsLiquid.c2.value.set(this.config.colorTeal.r, this.config.colorTeal.g, this.config.colorTeal.b);
    this.uniformsLiquid.c3.value.set(this.config.colorPurple.r, this.config.colorPurple.g, this.config.colorPurple.b);
    this.uniformsLiquid.c4.value.set(this.config.colorPink.r, this.config.colorPink.g, this.config.colorPink.b);
    
    this.uniformsDither.uCellPx.value = this.config.cellPx;
    this.uniformsDither.uContrast.value = this.config.contrast;
    this.uniformsDither.uGamma.value = this.config.gamma;
    this.uniformsDither.uSoftness.value = this.config.softness;
    this.uniformsDither.uMinR.value = this.config.minR;
    this.uniformsDither.uMaxR.value = this.config.maxR;
    this.uniformsDither.uDotSpacing.value = this.config.dotSpacing;
    this.uniformsDither.uLumThreshold.value = this.config.lumThreshold;
    this.uniformsDither.uInvertDots.value = this.config.invertDots ? 1.0 : 0.0;
    this.uniformsDither.uInvert.value = this.config.invert ? 1.0 : 0.0;
    this.uniformsDither.uBayer.value = this.config.bayer ? 1.0 : 0.0;
    this.uniformsDither.uBayerStrength.value = this.config.bayerStrength;
    
    // Restore layer toggle
    this.layerToggles.glyphDither = this.config.showGlyphDither;
  }
}

// Initialize
function init() {
  try {
    new LiquidGradientEffect();
  } catch (error) {
    console.error('Failed to initialize:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
