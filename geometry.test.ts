import { describe, expect, it } from 'vitest';
import { createCerebellum, createHemisphere, createNetwork } from '../three/geometry';
describe('original 3D assets', () => {
  it('creates finite cortical geometry with folds and a symmetric midline fissure', () => {
    const left = createHemisphere(-1, 64), right = createHemisphere(1, 64);
    const a=left.attributes.position,b=right.attributes.position;
    expect(a.count).toBeGreaterThan(2000);
    for(let i=0;i<a.count;i++) { expect(Number.isFinite(a.getX(i)+a.getY(i)+a.getZ(i))).toBe(true); expect(a.getX(i)).toBeLessThan(0); expect(b.getX(i)).toBeGreaterThan(0); expect(a.getX(i)).toBeCloseTo(-b.getX(i)); }
    expect(left.attributes.normal.count).toBe(a.count); expect(left.attributes.color.count).toBe(a.count);
    // Variable monochrome vertex shading encodes gyri/sulci, not a plain sphere.
    const shades=Array.from(left.attributes.color.array).filter((_,i)=>i%3===0);
    expect(Math.max(...shades)-Math.min(...shades)).toBeGreaterThan(.25);
    left.dispose();right.dispose();
  });
  it('creates a ribbed cerebellum and connected orbital network within a mobile budget', () => {
    const cerebellum=createCerebellum(56); expect(cerebellum.attributes.position.count).toBeLessThan(4000); cerebellum.dispose();
    const network=createNetwork(36); expect(network.nodes).toHaveLength(36); expect(network.connections.length).toBeGreaterThan(10); expect(network.lines.length).toBe(network.connections.length*6); expect(createNetwork(36)).toEqual(network);
  });
});
