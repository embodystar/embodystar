"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = `
  uniform float time;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDirection), 0.0), 2.8);
    float scan = smoothstep(0.035, 0.0, abs(fract(vWorldPosition.y * 0.34 - time * 0.09) - 0.5));
    vec3 color = mix(vec3(0.08, 0.75, 0.82), vec3(0.86, 0.35, 0.9), scan);
    gl_FragColor = vec4(color, fresnel * 0.48 + scan * fresnel * 0.22);
  }
`;

const agentPositions: [number, number, number][] = [
  [1.16, 0.7, 0.42],
  [-0.76, 1.04, 0.6],
  [-1.08, -0.62, 0.68],
  [0.78, -1.05, 0.56],
];

function EmbodiedCore() {
  const assemblyRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const shellMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(240 * 3);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let index = 0; index < 240; index += 1) {
      const y = 1 - (index / 239) * 2;
      const radius = Math.sqrt(1 - y * y);
      const angle = goldenAngle * index;
      const distance = 1.43 + Math.sin(index * 12.37) * 0.025;
      positions[index * 3] = Math.cos(angle) * radius * distance;
      positions[index * 3 + 1] = y * distance;
      positions[index * 3 + 2] = Math.sin(angle) * radius * distance;
    }
    return positions;
  }, []);

  useFrame(({ clock }, delta) => {
    if (shellMaterialRef.current) shellMaterialRef.current.uniforms.time.value = clock.elapsedTime;
    if (assemblyRef.current) {
      assemblyRef.current.rotation.y += delta * 0.12;
      assemblyRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.28) * 0.08;
    }
    if (shellRef.current) shellRef.current.rotation.y -= delta * 0.035;
    if (orbitRef.current) orbitRef.current.rotation.z += delta * 0.08;
  });

  return (
    <group ref={assemblyRef} rotation={[0.08, 0, -0.08]}>
      <mesh>
        <icosahedronGeometry args={[0.52, 1]} />
        <meshPhysicalMaterial
          color="#071e2b"
          emissive="#0b9d9e"
          emissiveIntensity={1.2}
          roughness={0.28}
          metalness={0.72}
          clearcoat={1}
        />
      </mesh>
      <mesh scale={1.012}>
        <icosahedronGeometry args={[0.52, 1]} />
        <meshBasicMaterial color="#8fffee" wireframe transparent opacity={0.85} />
      </mesh>
      <mesh scale={0.42}>
        <octahedronGeometry args={[0.52, 0]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.95} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh ref={shellRef}>
        <sphereGeometry args={[1.34, 96, 64]} />
        <shaderMaterial
          ref={shellMaterialRef}
          uniforms={{ time: { value: 0 } }}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.FrontSide}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.12, 0.008, 6, 160]} />
        <meshBasicMaterial color="#36ead5" transparent opacity={0.48} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh rotation={[0.35, 0.7, 0.55]}>
        <torusGeometry args={[1.25, 0.006, 6, 160]} />
        <meshBasicMaterial color="#d878ee" transparent opacity={0.38} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh rotation={[-0.7, 0.2, -0.4]}>
        <torusGeometry args={[0.92, 0.005, 6, 160]} />
        <meshBasicMaterial color="#75f5e6" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </mesh>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#7df9e7" size={0.018} transparent opacity={0.62} sizeAttenuation depthWrite={false} />
      </points>

      <group ref={orbitRef}>
        {agentPositions.map((position, index) => (
          <group key={index} position={position}>
            <mesh>
              <octahedronGeometry args={[0.055, 0]} />
              <meshBasicMaterial color={index % 2 === 0 ? "#8fffee" : "#ed9aff"} />
            </mesh>
            <pointLight color={index % 2 === 0 ? "#2dd4bf" : "#d946ef"} intensity={0.32} distance={0.55} />
          </group>
        ))}
      </group>
    </group>
  );
}

export function EmbodystarPlanet() {
  return (
    <div
      className="relative h-56 w-56 transition-transform duration-700 group-hover:scale-105"
      role="img"
      aria-label="Embodystar spatial intelligence core"
    >
      <div className="absolute inset-[12%] rounded-full bg-cyan-400/10 blur-2xl" />
      <Canvas
        className="relative"
        camera={{ position: [0, 0, 4.25], fov: 38 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[2, 2, 3]} intensity={3.2} color="#b9fff5" />
        <pointLight position={[-2, -1, 2]} intensity={1.8} color="#d946ef" />
        <EmbodiedCore />
      </Canvas>
      <div className="pointer-events-none absolute inset-[7%] rounded-full bg-[radial-gradient(circle_at_35%_27%,rgba(220,255,252,0.13),transparent_18%),radial-gradient(circle,transparent_54%,rgba(18,203,197,0.07)_72%,transparent_73%)] mix-blend-screen" />
    </div>
  );
}
