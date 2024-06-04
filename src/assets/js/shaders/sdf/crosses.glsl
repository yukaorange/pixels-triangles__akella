float box(vec2 st, vec2 size) {
  size = vec2(0.5) - size * 0.5;

  vec2 uv = smoothstep(size, size + vec2(0.001), st);

  uv *= smoothstep(size, size + vec2(0.001), vec2(1.0) - st);
  return uv.x * uv.y;
}

float crossSDF(vec2 st, float size) {
  return box(st, vec2(size, size / 4.)) +
    box(st, vec2(size / 4., size));
}