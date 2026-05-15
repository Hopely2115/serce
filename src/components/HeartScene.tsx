import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, PresentationControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

const TextParticle = ({ position, rotation, text }: { position: [number, number, number], rotation: [number, number, number], text: string }) => {
  const textRef = useRef<THREE.Group>(null!);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (textRef.current) {
        // Subtle local floating
        textRef.current.position.y += Math.sin(time + position[0]) * 0.001;
    }
  });

  return (
    <group ref={textRef} position={position} rotation={rotation}>
      <Text
        font="https://fonts.gstatic.com/s/firacode/v10/u4qEypQMoY8idkw1vgdf2Gf6eXAOawnc.woff"
        fontSize={0.08}
        color="#ff4d6d"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.005}
        outlineColor="#ff003c"
      >
        {text}
      </Text>
    </group>
  );
};

const HeartCloud = () => {
  const group = useRef<THREE.Group>(null!);
  const particles = useMemo(() => {
    const temp = [];
    const count = 250; // Optimized count
    const text = "i love you";
    
    for (let i = 0; i < count; i++) {
        const t = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        // Parametric heart formula
        const x = 16 * Math.pow(Math.sin(t), 3) * Math.sin(phi);
        const y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        const z = 16 * Math.pow(Math.sin(t), 3) * Math.cos(phi);
        
        const scale = 0.08;
        temp.push({
            position: [x * scale, y * scale, z * scale] as [number, number, number],
            rotation: [0, t, 0] as [number, number, number],
            text
        });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (group.current) {
        group.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={group}>
      {particles.map((p, i) => (
        <TextParticle key={i} {...p} />
      ))}
    </group>
  );
};

export default function HeartScene({ active }: { active: boolean }) {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ff4d6d" />
        
        <PresentationControls
          global
          snap
          speed={1.5}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 2, Math.PI / 2]}
          azimuth={[-Math.PI, Math.PI]}
        >
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <HeartCloud />
          </Float>
        </PresentationControls>

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
}
