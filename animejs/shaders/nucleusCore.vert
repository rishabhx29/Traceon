// docs/animejs/shaders/nucleusCore.vert
// Vertex shader for the central 3D Code Nucleus dodecahedron/mesh

uniform float uTime;
uniform float uRippleProgress;  // 0.0 -> 1.0 (animated via Anime.js on click/blast)
uniform vec3 uEpicenter;       // Local or world coordinates of interaction
uniform float uWaveFrequency;   // e.g. 6.0
uniform float uWaveAmplitude;   // e.g. 0.35

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;
varying float vDisplacement;
varying vec3 vViewPosition;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;

  // Compute distance from interaction epicenter
  float d = distance(position, uEpicenter);

  // Traveling spherical Gaussian wave packet
  float waveFront = uRippleProgress * 15.0;
  float waveDelta = abs(d - waveFront);
  float envelope = exp(-pow(waveDelta / 1.8, 2.0));

  // Sinusoidal displacement along vertex normal
  float disp = sin(d * uWaveFrequency - uTime * 7.0) * uWaveAmplitude * envelope * (1.0 - uRippleProgress);
  vDisplacement = disp;

  vec3 displacedPos = position + normal * disp;

  vec4 worldPos = modelMatrix * vec4(displacedPos, 1.0);
  vWorldPosition = worldPos.xyz;

  vec4 mvPosition = viewMatrix * worldPos;
  vViewPosition = -mvPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;
}
