import { Float32BufferAttribute, SphereGeometry } from 'three';

/** Original, bilaterally symmetric cortical geometry. No downloaded model or texture. */
export function createHemisphere(side: -1 | 1, detail = 128): SphereGeometry {
  const geometry = new SphereGeometry(1, detail, Math.round(detail * 0.72));
  const positions = geometry.attributes.position;
  const colors = new Float32Array(positions.count * 3);
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
    const latitude = Math.acos(Math.max(-1, Math.min(1, y)));
    const longitude = Math.atan2(z, x);
    // Domain-warped bands produce rounded gyri separated by narrow branching sulci.
    const warped = latitude * 19 + 2.2 * Math.sin(longitude * 4 + latitude * 3) + 1.1 * Math.sin(longitude * 9 - latitude * 5);
    const gyrus = Math.pow((Math.sin(warped) + 1) / 2, 0.42);
    const crossfold = Math.sin(longitude * 15 + latitude * 7 + Math.sin(latitude * 11));
    const polarFade = Math.pow(Math.max(0, Math.sin(latitude)), 0.3);
    const fold = (0.095 * gyrus + 0.025 * crossfold) * polarFade;
    const sylvian = 0.065 * Math.exp(-Math.pow((y + 0.2 + z * 0.14) / 0.065, 2)) * Math.max(0, x);
    const frontal = 1 - 0.09 * Math.max(0, -z);
    const px = side * Math.max(0.026, 0.47 + x * (0.74 + fold - sylvian) * frontal);
    const py = y * (1.02 + fold) + 0.1 * z - 0.08 * z * z;
    const pz = z * (1.38 + fold) * (1 - 0.035 * y);
    positions.setXYZ(i, px, py, pz);
    const shade = 0.48 + gyrus * 0.33;
    colors.set([shade, shade, shade], i * 3);
  }
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}
export function createCerebellum(detail = 80): SphereGeometry {
  const geometry = new SphereGeometry(1, detail, 56);
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
    const rib = 1 + 0.055 * Math.sin(y * 58 + z * 4);
    positions.setXYZ(i, x * 0.64 * rib, y * 0.36 * rib, z * 0.55 * rib);
  }
  geometry.computeVertexNormals();
  return geometry;
}

export function createNetwork(count = 58) {
  let seed = 1471;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const nodes: [number, number, number][] = Array.from({ length: count }, () => {
    const phi = random() * Math.PI * 2, y = random() * 2 - 1, radial = Math.sqrt(1 - y * y), r = 1.85 + random() * 0.48;
    return [Math.cos(phi) * radial * r, y * r * 0.93, Math.sin(phi) * radial * r];
  });
  const connections: [number, number][] = [];
  nodes.forEach((a, i) => nodes.forEach((b, j) => {
    if (j > i && Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) < 1.1) connections.push([i, j]);
  }));
  return { nodes, connections, positions: new Float32Array(nodes.flat()), lines: new Float32Array(connections.flatMap(([a, b]) => [...nodes[a], ...nodes[b]])) };
}
