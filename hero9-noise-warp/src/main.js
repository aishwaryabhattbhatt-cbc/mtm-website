import * as THREE from 'three';
import GUI from 'lil-gui';
import { vertexShader } from './shaders/vertex.glsl.js';
import { fragmentShader } from './shaders/fragment.glsl.js';

// Scene setup
const canvas = document.querySelector('canvas') || createCanvas();
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
camera.position.z = 1;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x1a1a1a);

// Create plane geometry and material
const geometry = new THREE.PlaneGeometry(2, 2);
let texture = null;
let material = null;
const clock = new THREE.Clock();

// GUI parameters
const params = {
    intensity: 0.05,
    noiseScale: 2.5,
    speed: 0.8,
    octaves: 4,
    chromaticAberration: 0,
    aspectMode: 'cover', // 'cover' or 'contain'
    edgeClamp: true,
    playing: true
};

function createCanvas() {
    const canvas = document.createElement('canvas');
    document.getElementById('container').appendChild(canvas);
    return canvas;
}

async function loadTexture(source) {
    const loader = new THREE.TextureLoader();
    try {
        const tex = await loader.loadAsync(source);
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        return tex;
    } catch (error) {
        console.error('Failed to load image:', error);
        return null;
    }
}

function updateMaterial() {
    if (texture) {
        material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTex: { value: texture },
                uTime: { value: 0 },
                uIntensity: { value: params.intensity },
                uNoiseScale: { value: params.noiseScale },
                uSpeed: { value: params.speed },
                uOctaves: { value: params.octaves },
                uChromaticAberration: { value: params.chromaticAberration },
                uEdgeClamp: { value: params.edgeClamp ? 1.0 : 0.0 },
                uTexScale: { value: new THREE.Vector2(1, 1) },
                uTexOffset: { value: new THREE.Vector2(0, 0) }
            }
        });

        if (scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        updateAspectRatio();
    }
}

function updateAspectRatio() {
    if (!texture || !material) return;

    const canvas = renderer.domElement;
    const aspectCanvas = canvas.clientWidth / canvas.clientHeight;
    const aspectTexture = texture.image.width / texture.image.height;

    let scale, offset;

    if (params.aspectMode === 'cover') {
        // Image covers canvas, may crop
        if (aspectTexture > aspectCanvas) {
            scale = new THREE.Vector2(aspectTexture / aspectCanvas, 1);
            offset = new THREE.Vector2((scale.x - 1) * 0.5, 0);
        } else {
            scale = new THREE.Vector2(1, aspectCanvas / aspectTexture);
            offset = new THREE.Vector2(0, (scale.y - 1) * 0.5);
        }
    } else {
        // Image contained in canvas, may have letterboxing
        if (aspectTexture > aspectCanvas) {
            scale = new THREE.Vector2(1, aspectCanvas / aspectTexture);
            offset = new THREE.Vector2(0, (1 - scale.y) * 0.5);
        } else {
            scale = new THREE.Vector2(aspectTexture / aspectCanvas, 1);
            offset = new THREE.Vector2((1 - scale.x) * 0.5, 0);
        }
    }

    material.uniforms.uTexScale.value = scale;
    material.uniforms.uTexOffset.value = offset;
}

async function initializeWithDefaultImage() {
    texture = await loadTexture('/sample.jpg');
    if (!texture) {
        // Create a fallback gradient texture
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#ff006e');
        gradient.addColorStop(0.5, '#6c5ce7');
        gradient.addColorStop(1, '#00b4db');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        texture = new THREE.CanvasTexture(canvas);
    }
    updateMaterial();
}

// GUI setup
const gui = new GUI({ container: document.body });
gui.title('Noise Distortion Controls');

gui.add(params, 'intensity', 0, 0.2, 0.01).name('Intensity').onChange(() => {
    if (material) material.uniforms.uIntensity.value = params.intensity;
});

gui.add(params, 'noiseScale', 0.5, 10, 0.1).name('Noise Scale').onChange(() => {
    if (material) material.uniforms.uNoiseScale.value = params.noiseScale;
});

gui.add(params, 'speed', 0, 2, 0.05).name('Speed').onChange(() => {
    if (material) material.uniforms.uSpeed.value = params.speed;
});

gui.add(params, 'octaves', 1, 5, 1).name('Octaves').onChange(() => {
    if (material) material.uniforms.uOctaves.value = params.octaves;
});

gui.add(params, 'chromaticAberration', 0, 0.02, 0.001).name('Chromatic Aberration').onChange(() => {
    if (material) material.uniforms.uChromaticAberration.value = params.chromaticAberration;
});

gui.add(params, 'edgeClamp').name('Edge Clamp').onChange(() => {
    if (material) material.uniforms.uEdgeClamp.value = params.edgeClamp ? 1.0 : 0.0;
});

gui.add(params, 'aspectMode', ['cover', 'contain']).name('Aspect Mode').onChange(updateAspectRatio);

gui.add(params, 'playing').name('Playing');

// Image loading
async function loadImageFromFile(file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
        const img = new Image();
        img.onload = () => {
            texture = new THREE.CanvasTexture(
                (function () {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    return canvas;
                })()
            );
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            updateMaterial();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

document.getElementById('imageInput').addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        loadImageFromFile(e.target.files[0]);
    }
});

// Drag and drop
const dropZone = document.getElementById('dropZone');
['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
    dropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach((eventName) => {
    dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
});

['dragleave', 'drop'].forEach((eventName) => {
    dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
});

dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            loadImageFromFile(file);
        }
    }
}, false);

// Window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    updateAspectRatio();
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    if (params.playing && material) {
        material.uniforms.uTime.value = clock.getElapsedTime();
    }

    renderer.render(scene, camera);
}

// Start
initializeWithDefaultImage().then(() => {
    animate();
});

// Cleanup
window.addEventListener('beforeunload', () => {
    geometry.dispose();
    if (material) material.dispose();
    if (texture) texture.dispose();
    renderer.dispose();
});
