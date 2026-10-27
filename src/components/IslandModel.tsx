import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Bounds } from '@react-three/drei';
import * as THREE from 'three';
import { MODEL_URL } from '../config';

// The pilot-site island, exported from the prototype's three.js scene (no agents, no labels).
function Island() {
  const { scene } = useGLTF(MODEL_URL, false, true);
  const model = useMemo(() => {
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) { m.castShadow = false; m.receiveShadow = false; }
    });
    return scene;
  }, [scene]);
  return <primitive object={model} />;
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
        frameloop={visible && !reduced ? 'always' : 'demand'}
        dpr={[1, 1.75]}
        camera={{ position: [95, 70, 95], fov: 28, near: 1, far: 1200 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <hemisphereLight args={['#f4f6f0', '#1f3a2c', 1.1]} />
        <directionalLight position={[60, 90, 40]} intensity={1.6} />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={0.9}>
            <Island />
          </Bounds>
        </Suspense>
        <OrbitControls
          makeDefault
          enableZoom={false}
          enablePan={false}
          autoRotate={!reduced}
          autoRotateSpeed={0.35}
          minPolarAngle={0.55}
          maxPolarAngle={1.15}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_URL, false, true);
