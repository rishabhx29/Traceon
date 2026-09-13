// docs/animejs/shaders/splinePulse.frag
// Fragment shader for traveling photon pulses along Catmull-Rom tube cables

uniform vec3 uCableColor;     // Base cable color #1E1E24
uniform vec3 uPulseColor;     // Pulse photon color #F59E0B or #10B981
uniform float uPulseProgress; // 0.0 -> 1.0 (animated via Anime.js)
uniform float uPulseLength;   // e.g. 0.15 (fraction of total cable length)

varying vec2 vUv;
varying vec3 vViewPosition;

void main() {
  // vUv.x represents normalized distance along the cable length from 0 to 1
  float distFromPulse = abs(vUv.x - uPulseProgress);

  // Soft Gaussian pulse falloff
  float pulseStrength = exp(-pow(distFromPulse / (uPulseLength * 0.5), 2.0));

  // Blend between dark steel cable and radiant phosphor pulse
  vec3 finalColor = mix(uCableColor, uPulseColor, pulseStrength);
  float alpha = mix(0.4, 0.95, pulseStrength);

  gl_FragColor = vec4(finalColor, alpha);
}
