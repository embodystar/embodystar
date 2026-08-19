"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Box, Sphere, Grid, Environment } from "@react-three/drei";
import * as THREE from "three";

function Agent({ startPosition, targetPosition, color }: { startPosition: [number, number, number], targetPosition: [number, number, number], color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const velocity = useRef(new THREE.Vector3());
  const position = useRef(new THREE.Vector3(...startPosition));
  const target = useMemo(() => new THREE.Vector3(...targetPosition), [targetPosition]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const maxSpeed = 4;
    const steerForce = 0.5;

    // Direction to target
    const desired = target.clone().sub(position.current);
    const dist = desired.length();
    
    if (dist > 0.5) {
      desired.normalize().multiplyScalar(maxSpeed);
      const steer = desired.sub(velocity.current).clampLength(0, steerForce);
      velocity.current.add(steer);
    } else {
      // Reached target, pick a new random target (simplified)
      position.current.set(...startPosition);
      velocity.current.set(0, 0, 0);
    }

    position.current.add(velocity.current.clone().multiplyScalar(delta));
    meshRef.current.position.copy(position.current);
    
    // Rotate to face direction
    if (velocity.current.lengthSq() > 0.01) {
      const lookAtPt = position.current.clone().add(velocity.current);
      meshRef.current.lookAt(lookAtPt);
    }
  });

  return (
    <mesh ref={meshRef} position={startPosition}>
      <coneGeometry args={[0.3, 1, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      <pointLight color={color} intensity={2} distance={2} />
    </mesh>
  );
}

function Obstacle({ position, scale }: { position: [number, number, number], scale: number }) {
  return (
    <Box position={position} args={[scale, scale * 2, scale]} castShadow receiveShadow>
      <meshStandardMaterial color="#292524" roughness={0.8} />
    </Box>
  );
}

export function ThreeSandbox() {
  const targetPos: [number, number, number] = [8, 0, 0];
  
  return (
    <div className="w-full h-[400px] bg-[#0c0a09] rounded-xl border border-neutral-900/70 overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur border border-neutral-800 px-3 py-1.5 rounded-md text-[10px] font-mono text-cyan-400">
        3D SPATIAL KINEMATICS ENGINE
      </div>
      <Canvas shadows camera={{ position: [-5, 8, 8], fov: 45 }}>
        <color attach="background" args={["#0c0a09"]} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        
        {/* Environment */}
        <Grid infiniteGrid fadeDistance={20} sectionColor="#06b6d4" cellColor="#080707" sectionThickness={1} />
        
        {/* Target */}
        <Sphere position={targetPos} args={[0.4, 16, 16]}>
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1} />
          <pointLight color="#22c55e" intensity={4} distance={5} />
        </Sphere>
        
        {/* Obstacles */}
        <Obstacle position={[3, 1, 2]} scale={1.5} />
        <Obstacle position={[2, 1, -2]} scale={1} />
        <Obstacle position={[5, 1, -1]} scale={2} />
        
        {/* Agents */}
        <Agent startPosition={[-8, 0.5, 2]} targetPosition={targetPos} color="#06b6d4" />
        <Agent startPosition={[-8, 0.5, -2]} targetPosition={targetPos} color="#a855f7" />
        <Agent startPosition={[-6, 0.5, 0]} targetPosition={targetPos} color="#3b82f6" />
        
        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2 - 0.1} />
        <Environment preset="night" />
      </Canvas>
    </div>
  );
}