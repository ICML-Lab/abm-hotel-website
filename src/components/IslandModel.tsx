import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { MODEL_URL } from '../config';

// The pilot-site island, exported from the prototype's three.js scene with its textures, lights,
// water shader and cable paths. Dynamic simulation content (guests, zone status rings) is left out;
// the cable car keeps running.

type Light = {
  type: 'HemisphereLight' | 'DirectionalLight';
  color: string;
  groundColor?: string;
  intensity: number;
  position: [number, number, number];
  target?: [number, number, number];
  shadow?: { left: number; right: number; top: number; bottom: number; near: number; far: number; bias: number; normalBias: number; radius: number };
};
type Extras = {
  lights: Light[];
  cables: [number, number, number][][];
  water: { vertexShader: string; fragmentShader: string; uniforms: Record<string, unknown> } | null;
  gondolaCount: number;
};

// The prototype ran three r147 with legacy light units; three r170 lights are physical (×π).
const LEGACY_TO_PHYSICAL = Math.PI;
const CABINS_PER_LINE = 12;
const CABLE_SPEED = 0.018; // share of the line travelled per second

function sampleAt(path: THREE.Vector3[], u: number, out: THREE.Vector3) {
  const f = THREE.MathUtils.clamp(u, 0, 1) * (path.length - 1);
  const i = Math.min(path.length - 2, Math.floor(f));
  return out.lerpVectors(path[i], path[i + 1], f - i);
}

function Island({ animate }: { animate: boolean }) {
  const { scene } = useGLTF(MODEL_URL, false, true);
  const cabinsRef = useRef<THREE.InstancedMesh>(null);

  const setup = useMemo(() => {
    const root = scene.getObjectByName('HonTrePilot') ?? scene;
    const ex = root.userData as Extras;
    let waterMat: THREE.ShaderMaterial | null = null;
    let gondola: THREE.Mesh | null = null;

    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      if (m.name === 'gondola') { gondola = m; m.visible = false; return; }
      if (m.name === 'water' && ex.water) {
        const g = m.geometry;
        const depth = g.getAttribute('_adepth');
        if (depth) g.setAttribute('aDepth', depth);
        const uniforms: Record<string, THREE.IUniform> = {};
        for (const [k, v] of Object.entries(ex.water.uniforms)) uniforms[k] = { value: Array.isArray(v) ? new THREE.Vector3(...(v as [number, number, number])) : v };
        waterMat = new THREE.ShaderMaterial({
          uniforms,
          transparent: true,
          vertexShader: ex.water.vertexShader,
          fragmentShader: ex.water.fragmentShader.replace('#include <encodings_fragment>', '#include <colorspace_fragment>'),
        });
        m.material = waterMat;
        m.renderOrder = 1;
        return;
      }
      const mats = (Array.isArray(m.material) ? m.material : [m.material]) as THREE.Material[];
      const unlit = mats.some((x) => (x as THREE.MeshBasicMaterial).isMeshBasicMaterial);
      mats.forEach((x) => { if (x.name.startsWith('nodepth:')) { x.depthWrite = false; m.renderOrder = 2; } });
      m.castShadow = !unlit && !mats.some((x) => x.transparent);
      m.receiveShadow = !unlit;
    });

    // The two long cables carry the cabins; samples are evenly spaced along each cable.
    const lines = ex.cables
      .map((c) => c.map((p) => new THREE.Vector3(...p)))
      .sort((a, b) => b[0].distanceTo(b[b.length - 1]) - a[0].distanceTo(a[a.length - 1]))
      .slice(0, 2);

    return { ex, waterMat: waterMat as THREE.ShaderMaterial | null, gondola: gondola as THREE.Mesh | null, lines };
  }, [scene]);

  const tmp = useMemo(() => ({ p: new THREE.Vector3(), q: new THREE.Vector3(), o: new THREE.Object3D(), phase: 0 }), []);

  const placeCabins = (phase: number) => {
    const mesh = cabinsRef.current;
    if (!mesh || setup.lines.length < 2) return;
    let k = 0;
    for (let i = 0; i < CABINS_PER_LINE; i++) {
      setup.lines.forEach((line, j) => {
        let u = (phase + i / CABINS_PER_LINE) % 1;
        if (j) u = 1 - u;
        sampleAt(line, u, tmp.p);
        sampleAt(line, Math.min(1, u + 0.002), tmp.q).sub(tmp.p);
        tmp.o.position.copy(tmp.p);
        tmp.o.rotation.set(0, Math.atan2(tmp.q.x, tmp.q.z), 0);
        tmp.o.updateMatrix();
        mesh.setMatrixAt(k++, tmp.o.matrix);
      });
    }
    mesh.instanceMatrix.needsUpdate = true;
  };

  useEffect(() => { placeCabins(0); }); // static placement for the first frame and reduced motion

  useFrame((state, dt) => {
    if (setup.waterMat) setup.waterMat.uniforms.uTime.value = state.clock.elapsedTime * 0.5;
    if (!animate) return;
    tmp.phase = (tmp.phase + Math.min(dt, 0.1) * CABLE_SPEED) % 1;
    placeCabins(tmp.phase);
  });

  return (
    <>
      {setup.ex.lights.map((l, i) => {
        if (l.type === 'HemisphereLight') return <hemisphereLight key={i} args={[l.color, l.groundColor, l.intensity * LEGACY_TO_PHYSICAL]} />;
        if (l.intensity <= 0) return null;
        return (
          <directionalLight
            key={i}
            color={l.color}
            intensity={l.intensity * LEGACY_TO_PHYSICAL}
            position={l.position}
            castShadow={!!l.shadow}
            shadow-mapSize={[2048, 2048]}
            shadow-bias={l.shadow?.bias ?? 0}
            shadow-normalBias={l.shadow?.normalBias ?? 0}
            shadow-radius={l.shadow?.radius ?? 1}
          >
            {l.shadow && <orthographicCamera attach="shadow-camera" args={[l.shadow.left, l.shadow.right, l.shadow.top, l.shadow.bottom, l.shadow.near, l.shadow.far]} />}
          </directionalLight>
        );
      })}
      <primitive object={scene} />
      {setup.gondola && (
        <instancedMesh ref={cabinsRef} args={[setup.gondola.geometry, setup.gondola.material, CABINS_PER_LINE * 2]} castShadow frustumCulled={false} />
      )}
    </>
  );
}

export default function IslandModel({ label }: { label: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  // Render continuously only while the model is on screen.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '120px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="model-canvas" role="img" aria-label={label}>
      <Canvas
        shadows="soft"
        frameloop={visible && !reduced ? 'always' : 'demand'}
        dpr={[1, 1.75]}
        camera={{ position: [150, 118, 188], fov: 28, near: 1, far: 1600 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1 }}
      >
        <Suspense fallback={null}>
          <Island animate={!reduced} />
        </Suspense>
        <OrbitControls makeDefault target={[0, -4, 0]} enableZoom={false} enablePan={false} autoRotate={!reduced} autoRotateSpeed={0.3} minPolarAngle={0.55} maxPolarAngle={1.15} />
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_URL, false, true);
