import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import type { MutableRefObject } from 'react';
import { AdditiveBlending, BufferAttribute, BufferGeometry, Group, Mesh } from 'three';
import { createCerebellum, createHemisphere, createNetwork } from './geometry';

export interface Interaction { yaw: number; pitch: number; dragging: boolean; lastInput: number; mouseX: number; mouseY: number }
function Brain({ interaction, reduced, mobile }: { interaction: MutableRefObject<Interaction>; reduced: boolean; mobile: boolean }) {
  const brain = useRef<Group>(null);
  const orbit = useRef<Group>(null);
  const pulses = useRef<(Mesh | null)[]>([]);
  const geometries = useMemo(() => [createHemisphere(-1, mobile ? 88 : 144), createHemisphere(1, mobile ? 88 : 144), createCerebellum(mobile ? 56 : 80)], [mobile]);
  const network = useMemo(() => createNetwork(mobile ? 36 : 58), [mobile]);
  const points = useMemo(() => new BufferGeometry().setAttribute('position', new BufferAttribute(network.positions, 3)), [network]);
  const lines = useMemo(() => new BufferGeometry().setAttribute('position', new BufferAttribute(network.lines, 3)), [network]);
  useEffect(() => () => { geometries.forEach(g => g.dispose()); points.dispose(); lines.dispose(); }, [geometries, points, lines]);
  useFrame(({ clock }, delta) => {
    if (!brain.current || !orbit.current) return;
    const state = interaction.current, t = clock.elapsedTime, dt = Math.min(delta, 0.05);
    if (!reduced && !state.dragging && performance.now() - state.lastInput > 1800) state.yaw += dt * 0.075;
    brain.current.rotation.y += (state.yaw + state.mouseX * 0.09 - brain.current.rotation.y) * (reduced ? 1 : 0.07);
    brain.current.rotation.x += (state.pitch + state.mouseY * 0.06 - brain.current.rotation.x) * (reduced ? 1 : 0.07);
    brain.current.position.y = reduced ? 0 : Math.sin(t * 0.65) * 0.065;
    if (!reduced) orbit.current.rotation.y = t * 0.025;
    pulses.current.forEach((pulse, i) => {
      if (!pulse || !network.connections.length) return;
      const [a, b] = network.connections[(i * 11) % network.connections.length];
      const progress = reduced ? 0.5 : (t * 0.18 + i / 5) % 1;
      pulse.position.set(...network.nodes[a]).lerp({ x: network.nodes[b][0], y: network.nodes[b][1], z: network.nodes[b][2] }, progress);
      pulse.scale.setScalar(0.6 + Math.sin(progress * Math.PI) * 0.65);
    });
  });
  return <>
    <ambientLight intensity={1.1} />
    <hemisphereLight args={['#ffffff', '#222222', 1.3]} />
    <directionalLight position={[-3, 5, 4]} intensity={3.5} color="#ffffff" />
    <directionalLight position={[4, 0, -3]} intensity={2.4} color="#cccccc" />
    <group ref={brain} rotation={[0.18, -0.5, -0.08]}>
      {[0, 1].map(i => <mesh geometry={geometries[i]} key={i}><meshStandardMaterial vertexColors metalness={0.28} roughness={0.43} /></mesh>)}
      <mesh geometry={geometries[2]} position={[0, -0.91, 0.58]}><meshStandardMaterial color="#888888" metalness={0.2} roughness={0.55} /></mesh>
      <mesh position={[0, -1.23, 0.28]} rotation={[-0.28, 0, 0]}><cylinderGeometry args={[0.13, 0.17, 0.62, 18]} /><meshStandardMaterial color="#777777" roughness={0.5} /></mesh>
    </group>
    <group ref={orbit}>
      <points geometry={points}><pointsMaterial color="#ffffff" size={0.026} sizeAttenuation transparent opacity={0.75} depthWrite={false} /></points>
      <lineSegments geometry={lines}><lineBasicMaterial color="#999999" transparent opacity={0.16} depthWrite={false} /></lineSegments>
      {Array.from({ length: mobile ? 3 : 5 }, (_, i) => <mesh key={i} ref={m => { pulses.current[i] = m; }}><sphereGeometry args={[0.02, 8, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.85} blending={AdditiveBlending} /></mesh>)}
    </group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.72, 0]}><circleGeometry args={[1.6, 48]} /><meshBasicMaterial color="#111111" transparent opacity={0.28} /></mesh>
  </>;
}
function Invalidate({ value }: { value: number }) { const invalidate = useThree(s => s.invalidate); useEffect(() => invalidate(), [value, invalidate]); return null; }
export default function BrainScene({ interaction, reduced, active, revision, onFailure }: { interaction: MutableRefObject<Interaction>; reduced: boolean; active: boolean; revision: number; onFailure: () => void }) {
  const mobile = window.matchMedia('(max-width: 700px)').matches;
  return <Canvas className="brain-canvas" camera={{ position: [0, 0.05, 8.6], fov: 34 }} dpr={[1, mobile ? 1.25 : 1.65]} frameloop={active && !reduced ? 'always' : 'demand'} gl={{ alpha: true, antialias: !mobile, powerPreference: 'low-power' }} onCreated={({ gl }) => {
    gl.domElement.setAttribute('aria-hidden', 'true');
    gl.domElement.addEventListener('webglcontextlost', onFailure, { once: true });
  }}>
    <Brain interaction={interaction} reduced={reduced} mobile={mobile} />
    <Invalidate key={revision} value={revision} />
  </Canvas>;
}
