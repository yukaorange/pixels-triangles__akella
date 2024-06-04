float stroke(float x, float s, float w) {
  float d = step(s, x + w * 0.5) - step(s, x - w * 0.5);

  return clamp(d, 0., 1.0);
}

float fill(float x, float size) {
  return 1.0 - step(size, x);
}
