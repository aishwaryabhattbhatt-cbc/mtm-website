/**
 * Hero 9 - WebGL Noise Warp Background Effect
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

class NoiseWarpEffect {
  constructor() {
    console.log('Initializing NoiseWarpEffect...');
    
    this.container = document.getElementById('webgl-background');
    if (!this.container) {
      console.error('Container #webgl-background not found!');
      return;
    }
    console.log('Container found:', this.container);

    this.scene = new THREE.Scene();
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

    // Uniforms
    this.uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uIntensity: { value: 0.35 },
      uScale: { value: 2.0 }
    };

    // Simplified shaders that definitely work
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform vec2 uResolution;
      uniform float uIntensity;
      uniform float uScale;
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
        
        // Perlin-style noise for thin waves - higher frequency
        vec2 pos = uv * uScale * 3.0 + uTime * 0.15;
        
        // Single octave for cleaner wave patterns
        float n = noise(pos);
        
        // Subtle distortion for wavy effect
        vec2 distortion = vec2(
          noise(pos + uTime * 0.2),
          noise(pos + uTime * 0.2 + 100.0)
        );
        distortion = (distortion - 0.5) * 0.15; // Reduced for thinner waves
        
        vec2 distortedUv = uv + distortion;
        
        // Color 1: White
        vec3 color1 = vec3(0.95, 0.96, 0.98);
        
        // Color 2: Gradient of 5 colors
        float pattern = noise(distortedUv * 3.0 + uTime * 0.08);
        
        // 5-color gradient: blue → purple → pink → teal → light blue
        vec3 gradColor1 = vec3(0.15, 0.45, 0.95); // Blue
        vec3 gradColor2 = vec3(0.45, 0.25, 0.85); // Purple
        vec3 gradColor3 = vec3(0.75, 0.35, 0.75); // Pink
        vec3 gradColor4 = vec3(0.051, 0.773, 0.494); // Teal #0DC57E
        vec3 gradColor5 = vec3(0.25, 0.55, 0.95); // Light blue
        
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
        
        // Very thin wave separation - higher frequency, tighter threshold
        float waves = noise(distortedUv * 7.0 + uTime * 0.1);
        waves = smoothstep(0.48, 0.52, waves);
        
        vec3 color = mix(color1, color2, waves);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Create material and mesh
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader
    });

    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
    console.log('Mesh added to scene');

    // Handle resize
    window.addEventListener('resize', () => this.onWindowResize());
    
    // Start animation
    this.animate();
    console.log('Animation started');
  }

  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.renderer.setSize(width, height);
    this.uniforms.uResolution.value.set(width, height);
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    
    this.uniforms.uTime.value += 0.016;
    this.renderer.render(this.scene, this.camera);
  };
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
