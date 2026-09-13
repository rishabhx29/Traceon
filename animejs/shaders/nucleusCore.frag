// docs/animejs/shaders/nucleusCore.frag
// Fragment shader for the central 3D Code Nucleus

uniform vec3 uBaseColor;       // #0A0A0C
uniform vec3 uRimColor;        // #F5F5F7 or #F59E0B
uniform vec3 uShockColor;      // #FF3333
uniform float uFresnelPower;   // e.g. 2.8
uniform float uTime;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;
varying float vDisplacement;
varying vec3 vViewPosition;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition);

  // 1. Fresnel Rim Glow
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), uFresnelPower);

  // 2. Subtle Micro-Scanline Grid
  float scanline = sin(vPosition.y * 30.0 + uTime * 2.0) * 0.04;

  // 3. Shockwave Incandescent Thermal State
  float heat = clamp(abs(vDisplacement) * 5.0, 0.0, 1.0);

  // 4. Color Compositing
  vec3 color = mix(uBaseColor + scanline, uRimColor, fresnel * 0.7);
  color = mix(color, uShockColor, heat);

  gl_FragColor = vec4(color, 1.0);
}
