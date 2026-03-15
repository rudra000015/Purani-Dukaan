'use client';

import { useEffect, useRef } from 'react';

export default function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues with Three.js
    let animId: number;
    (async () => {
      const THREE = await import('three');
      const canvas = canvasRef.current;
      if (!canvas) return;

      const scene = new THREE.Scene();
      const cam = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
      const ren = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      ren.setSize(innerWidth, innerHeight);
      ren.setPixelRatio(Math.min(devicePixelRatio, 2));

      const g = new THREE.Group();
      const geos = [
        new THREE.BoxGeometry(0.8, 0.8, 0.8),
        new THREE.OctahedronGeometry(0.6),
        new THREE.TetrahedronGeometry(0.6),
      ];
      for (let i = 0; i < 35; i++) {
        const m = new THREE.Mesh(
          geos[i % 3],
          new THREE.MeshBasicMaterial({
            color: i % 2 ? 0x059669 : 0x8d5524,
            wireframe: true, transparent: true, opacity: 0.12,
          })
        );
        m.position.set(
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 20
        );
        m.rotation.set(Math.random(), Math.random(), Math.random());
        g.add(m);
      }
      scene.add(g);
      cam.position.z = 15;

      const animate = () => {
        animId = requestAnimationFrame(animate);
        g.rotation.y += 0.001;
        g.rotation.x += 0.0005;
        g.children.forEach(c => {
          (c as THREE.Mesh).rotation.x += 0.004;
          (c as THREE.Mesh).rotation.y += 0.003;
        });
        ren.render(scene, cam);
      };
      animate();
    })();

    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  );
}