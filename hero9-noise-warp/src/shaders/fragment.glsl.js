export const fragmentShader = `
precision highp float;

uniform sampler2D uTex;
uniform float uTime;
uniform float uIntensity;
uniform float uNoiseScale;
uniform float uSpeed;
uniform float uOctaves;
uniform float uChromaticAberration;
uniform float uEdgeClamp;
uniform vec2 uTexScale;
uniform vec2 uTexOffset;

varying vec2 vUv;

// ========== SIMPLEX NOISE ==========
// 2D simplex noise by Ashima Arts
vec3 permute(vec3 x) {
  return mod((x * 34.0 + 1.0) * x, 289.0);
}

vec2 fade(vec2 t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,
                       0.366025403784439,
                      -0.577350269189626,
                       0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 x12 = x0.yx + C.xx;
  x12.x -= step(x12.x, x12.y);

  vec3 p = permute(permute(i.y + vec3(0.0, C.z, C.w)) + i.x + vec3(0.0, C.x, C.w));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;

  return 130.0 * dot(m, g);
}

// ========== FBM ==========
float fbm(vec2 p, int octaves) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  float maxValue = 0.0;

  for (int i = 0; i < 5; i++) {
    if (i >= octaves) break;
    value += amplitude * snoise(p * frequency);
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2.0;
  }

  return value / maxValue;
}

// ========== ASPECT RATIO CORRECTION ==========
vec2 aspectUV(vec2 uv) {
  return uv * uTexScale + uTexOffset;
}

// ========== MAIN ==========
void main() {
  float t = uTime * uSpeed;
  
  vec2 baseUv = aspectUV(vUv);

  // Organic undulation via FBM
  int octCount = int(clamp(uOctaves, 1.0, 5.0));
  vec2 p = vUv * uNoiseScale;
  
  float n1 = fbm(p + vec2(t, -t), octCount);
  float n2 = fbm(p + vec2(-t * 0.7, t * 0.9) + vec2(17.0, 23.0), octCount);

  vec2 offset = vec2(n1, n2) * uIntensity;

  // Subtle ripples for "liveliness"
  float freq = 6.0;
  offset += 0.35 * uIntensity * vec2(
    sin((vUv.y + t) * freq),
    cos((vUv.x - t) * freq)
  ) / max(uNoiseScale, 0.001);

  vec2 warpedUv = baseUv + offset;

  // Edge handling: clamp to avoid sampling outside texture
  if (uEdgeClamp > 0.5) {
    warpedUv = clamp(warpedUv, 0.001, 0.999);
  } else {
    // Wrap mode
    warpedUv = fract(warpedUv);
  }

  // Sample color with optional chromatic aberration
  vec4 color = texture2D(uTex, warpedUv);

  if (uChromaticAberration > 0.0) {
    float ca = uChromaticAberration;
    float r = texture2D(uTex, warpedUv + vec2(ca, 0.0)).r;
    float g = color.g;
    float b = texture2D(uTex, warpedUv + vec2(-ca, 0.0)).b;
    color = vec4(r, g, b, color.a);
  }

  gl_FragColor = color;
}
`;
