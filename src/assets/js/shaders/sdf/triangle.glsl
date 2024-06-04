
float triSDF(vec2 st) {
  st = (st * 2.0 - 1.0) * 2.0;

  return max(abs(st.x) * 0.866025 + st.y * 0.5, -st.y * 0.5);
}