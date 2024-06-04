precision mediump float;

attribute vec3 colors;
attribute float alpha;
attribute float rotation;
attribute float size;
attribute float sdfSeries;

uniform float uTime;
uniform float uPointSize;

varying vec2 vUv;
varying vec3 vColors;
varying float vRotation;
varying float vAlpha;
varying float vSize;
varying float vSdfSeries;

void main() {
  vUv = uv;

  vRotation = rotation;
  vAlpha = alpha;
  vSize = size;
  vColors = colors;
  vSdfSeries = sdfSeries;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  gl_PointSize = uPointSize * size * 60. * (1.0 / -mvPosition.z);

  gl_Position = projectionMatrix * mvPosition;
}
