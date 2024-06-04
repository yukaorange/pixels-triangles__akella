precision mediump float;

uniform float uAlpha;
uniform float uTime;

// uniform sampler2D uTexture;

float PI = 3.1415926535897932384626433832795;

varying vec2 vUv;
varying vec3 vColors;
varying float vRotation;
varying float vAlpha;
varying float vSdfSeries;

#include "./utils/rotate.glsl"
#include "./sdf/sdfUtil.glsl"
#include "./sdf/triangle.glsl"
#include "./sdf/circle.glsl"
#include "./sdf/rect.glsl"
#include "./sdf/crosses.glsl"

void main() {
  float time = uTime;

  vec2 uv = vUv;

  vec2 uv1 = gl_PointCoord;

  uv1 = rotate(uv1 - vec2(0.5), vRotation * uTime) + vec2(0.5);

  vec3 color = vec3(0.0);

  color = vec3(vColors);

  float sdf;

  if(vSdfSeries == 1.0) {
    sdf = fill(triSDF(uv1), 0.75);
  } else if(vSdfSeries == 2.0) {
    sdf = stroke(circleSDF(uv1), 0.75, 0.1);
  } else if(vSdfSeries == 3.0) {
    sdf = rectSDF(uv1, vec2(1.0));
    sdf = stroke(sdf, 0.5, 0.1);
  } else {
    sdf = crossSDF(uv1, 0.8);
  }

  float alpha = uAlpha * sdf * vAlpha;

  gl_FragColor = vec4(color, alpha);
}
