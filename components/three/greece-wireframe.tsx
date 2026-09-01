"use client";

import { Suspense, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { allRegions, fogPoints } from "./greece-outline";

function GreeceOutline() {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { size } = useThree();

  const scale = Math.min(size.width, size.height) < 600 ? 0.85 : 1.15;

  useFrame((state) => {
    if (!groupRef.current) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const pointer = state.pointer;
    mouse.current.x = THREE.MathUtils.lerp(
      mouse.current.x,
      pointer.x * 0.03,
      0.04
    );
    mouse.current.y = THREE.MathUtils.lerp(
      mouse.current.y,
      pointer.y * 0.03,
      0.04
    );

    if (!prefersReduced) {
      groupRef.current.rotation.y = mouse.current.x;
      groupRef.current.rotation.x = mouse.current.y;
    }
  });

  const geometries = useMemo(() => {
    return allRegions.map((region) => {
      const points = region.map(([x, y]) => new THREE.Vector3(x, y, 0));
      return new THREE.BufferGeometry().setFromPoints(points);
    });
  }, []);

  useEffect(() => {
    return () => {
      geometries.forEach((g) => g.dispose());
    };
  }, [geometries]);

  return (
    <group ref={groupRef} scale={scale} position={[0, -0.2, 0]}>
      {geometries.map((geometry, i) => (
        <group key={i}>
          <lineLoop geometry={geometry}>
            <lineBasicMaterial
              color="#6a5a8a"
              transparent
              opacity={0.7}
            />
          </lineLoop>
          <lineLoop geometry={geometry} scale={[1.01, 1.01, 1]}>
            <lineBasicMaterial
              color="#8a7aaa"
              transparent
              opacity={0.08}
            />
          </lineLoop>
        </group>
      ))}
    </group>
  );
}

function FogPoints() {
  const ref = useRef<THREE.Group>(null);

  const fogData = useMemo(
    () =>
      fogPoints.map(([x, y], i) => ({
        position: [x, y, 0] as [number, number, number],
        offset: i * 0.7,
        speed: 0.4 + Math.random() * 0.3,
      })),
    []
  );

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;

    ref.current.children.forEach((child, i) => {
      const data = fogData[i];
      if (!data) return;
      const pulse = Math.sin(time * data.speed + data.offset) * 0.5 + 0.5;
      const mesh = child as THREE.Mesh;
      if (mesh.material && "opacity" in mesh.material) {
        (mesh.material as THREE.MeshBasicMaterial).opacity = pulse * 0.25;
      }
      mesh.scale.setScalar(0.8 + pulse * 0.5);
    });
  });

  return (
    <group ref={ref}>
      {fogData.map((data, i) => (
        <mesh key={i} position={data.position}>
          <circleGeometry args={[0.12, 16]} />
          <meshBasicMaterial
            color="#9a3030"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

function ParticleDust() {
  const count = 500;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return pos;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReduced) {
      ref.current.rotation.y += delta * 0.006;
      ref.current.rotation.x += delta * 0.002;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        transparent
        color="#5a5068"
        size={0.012}
        sizeAttenuation
        depthWrite={false}
        opacity={0.3}
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <fog attach="fog" args={["#08070d", 4, 14]} />
      <ambientLight intensity={0.05} />
      <GreeceOutline />
      <FogPoints />
      <ParticleDust />
    </>
  );
}

function Fallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="h-48 w-48 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(100,90,140,0.06) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

export default function GreeceWireframe() {
  return (
    <div className="absolute inset-0 z-0">
      <Suspense fallback={<Fallback />}>
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 5], fov: 45 }}
          style={{ background: "transparent" }}
          gl={{ alpha: true, antialias: true }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
