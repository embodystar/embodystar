"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

const earthTextureUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 512">
  <defs>
    <linearGradient id="ocean" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#0ea5e9"/>
      <stop offset="0.48" stop-color="#075985"/>
      <stop offset="1" stop-color="#031b4e"/>
    </linearGradient>
    <filter id="soften"><feGaussianBlur stdDeviation="2.2"/></filter>
  </defs>
  <rect width="1024" height="512" fill="url(#ocean)"/>
  <g fill="#2fb36d" stroke="#b7f7a1" stroke-opacity="0.18" stroke-width="3" filter="url(#soften)">
    <path d="M136 132c34-44 90-62 144-46 34 10 52 32 78 50 28 20 66 22 86 50 18 26 8 58-24 70-30 12-56-6-82 10-24 14-26 46-54 56-32 12-60-12-72-40-12-30-42-36-70-48-42-18-42-68-6-102z"/>
    <path d="M300 274c36 10 66 42 72 82 6 38-16 82-48 112-22-32-42-66-50-106-6-32 4-66 26-88z"/>
    <path d="M498 148c28-30 82-32 112-4 26 24 24 60 2 86-24 28-72 26-100 6-34-24-42-60-14-88z"/>
    <path d="M570 236c46-26 106-16 142 22 34 36 32 92 12 138-48 14-104-8-132-50-24-36-48-84-22-110z"/>
    <path d="M666 118c72-42 172-30 238 26 34 28 44 64 18 92-24 26-68 20-102 38-34 18-44 62-86 64-46 2-74-38-94-74-28-52-22-116 26-146z"/>
    <path d="M820 352c36-12 82 2 108 32 20 24 16 58-10 74-34 22-88 10-110-24-18-28-16-64 12-82z"/>
    <path d="M0 462c172-28 344-30 516-22 174 8 342 24 508 2v70H0z"/>
  </g>
  <g fill="#9be56e" opacity="0.28" filter="url(#soften)">
    <path d="M170 104c42-18 94-14 126 16-46-6-92 8-128 38-22 18-42 20-58 4 10-26 28-44 60-58z"/>
    <path d="M690 132c52-22 120-12 174 24-48-2-98 8-144 28-30 12-60 6-76-14 8-16 22-28 46-38z"/>
  </g>
</svg>`)}`;

const cloudTextureUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 512">
  <defs><filter id="cloud"><feGaussianBlur stdDeviation="5"/></filter></defs>
  <rect width="1024" height="512" fill="transparent"/>
  <g fill="none" stroke="#ffffff" stroke-opacity="0.62" stroke-width="18" filter="url(#cloud)">
    <path d="M42 156c80-34 164-36 252-8 72 22 146 22 224-12"/>
    <path d="M520 118c92-28 178-22 258 18 58 28 118 34 190 10"/>
    <path d="M102 326c90-24 172-14 246 30 62 36 132 40 210 12"/>
    <path d="M604 314c100-34 194-32 284 10"/>
  </g>
</svg>`)}`;

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const earthTexture = useLoader(THREE.TextureLoader, earthTextureUrl);
  const cloudTexture = useLoader(THREE.TextureLoader, cloudTextureUrl);

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.24;
      earthRef.current.rotation.x = -0.18;
      earthRef.current.rotation.z = 0.05;
    }

    if (cloudRef.current) {
      cloudRef.current.rotation.y += delta * 0.31;
      cloudRef.current.rotation.x = -0.18;
      cloudRef.current.rotation.z = 0.05;
    }
  });

  return (
    <group>
      <mesh ref={earthRef} castShadow receiveShadow>
        <sphereGeometry args={[1.34, 96, 96]} />
        <meshStandardMaterial map={earthTexture} roughness={0.72} metalness={0.02} />
      </mesh>

      <mesh ref={cloudRef} scale={1.365}>
        <sphereGeometry args={[1.34, 96, 96]} />
        <meshStandardMaterial map={cloudTexture} transparent opacity={0.48} depthWrite={false} />
      </mesh>

      <mesh scale={1.48}>
        <sphereGeometry args={[1.34, 64, 64]} />
        <meshBasicMaterial color="#38bdf8" side={THREE.BackSide} transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

export function EmbodystarPlanet() {
  return (
    <div
      className="relative h-56 w-56 rounded-full overflow-hidden border border-cyan-300/45 bg-[#020617] shadow-[0_0_54px_rgba(14,165,233,0.42),inset_0_0_36px_rgba(14,165,233,0.14)] transition-transform duration-700 group-hover:scale-105"
      role="img"
      aria-label="Rotating Earth-like 3D globe"
    >
      <Canvas
        camera={{ position: [0, 0, 4.25], fov: 38 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.64} />
        <directionalLight position={[3.5, 2.4, 4]} intensity={3.2} color="#f8fdff" />
        <pointLight position={[-2.2, -1.4, 2]} intensity={1.35} color="#38bdf8" />
        <Suspense fallback={null}>
          <Earth />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_22%,rgba(255,255,255,0.32),transparent_24%),linear-gradient(115deg,transparent_0_38%,rgba(255,255,255,0.13)_47%,transparent_57%)] mix-blend-screen" />
      <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_-34px_-24px_48px_rgba(0,0,0,0.58),inset_16px_12px_28px_rgba(125,211,252,0.2)]" />
    </div>
  );
}
