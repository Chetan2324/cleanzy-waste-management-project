import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleField = () => {
  const mesh = useRef();
  
  // Configuration: 2000 Particles
  const particleCount = 2000;
  const areaWidth = 40; 

  // Generate random 3D positions
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * areaWidth;
      const y = (Math.random() - 0.5) * areaWidth;
      const z = (Math.random() - 0.5) * areaWidth;
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, []);

  // Animation Loop (Runs 60fps)
  useFrame((state, delta) => {
    if (!mesh.current) return;

    // 1. Continuous Rotation
    mesh.current.rotation.x += delta * 0.05;
    mesh.current.rotation.y += delta * 0.03;

    // 2. Mouse Interaction (Parallax)
    const { mouse } = state;
    // Smoothly interpolate position based on mouse
    mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, mouse.x * 1.5, 0.1);
    mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, mouse.y * 1.5, 0.1);
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08} 
        color="#22c55e" /* Neon Green */
        transparent
        opacity={0.6}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const Background3D = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -1, /* Behind everything */
      background: '#050505', /* Deep Black Base */
      pointerEvents: 'none' /* Allow clicking buttons through it */
    }}>
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
        {/* Fog creates depth by fading distant particles */}
        <fog attach="fog" args={['#050505', 8, 25]} />
        <ParticleField />
      </Canvas>
    </div>
  );
};

export default Background3D;