/**
 * Master Blueprint & Complete Working Implementation Template:
 * Interactive 3D AST Code Nucleus Component
 * 
 * Location: docs/animejs/11-interactive-3d-tree-complete-blueprint.tsx
 * Tech: React 19, React Three Fiber, Three.js, Anime.js v4, Drei
 */

'use client';

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { animate, createTimeline, createSpring, engine } from 'animejs';
import 'animejs/adapters/three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

// ─── 1. TYPES & DATA CONTRACTS ───────────────────────────────────────────────

export interface ASTSatelliteData {
  id: string;
  name: string;
  filePath: string;
  complexity: number;
  dependents: number;
  colorHex: string;
  initialOffset: THREE.Vector3;
}

// ─── 2. ENGINE SYNCHRONIZATION HOOK ──────────────────────────────────────────

function AnimeEngineSync() {
  useEffect(() => {
    engine.useDefaultMainLoop = false;
    return () => {
      engine.useDefaultMainLoop = true;
    };
  }, []);

  useFrame(() => {
    engine.update();
  });

  return null;
}

// ─── 3. CATMULL-ROM TENSION SPLINE CABLE ─────────────────────────────────────

interface TensionSplineProps {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color?: string;
  isBlasted?: boolean;
}

function TensionSpline({ start, end, color = '#1E1E24', isBlasted = false }: TensionSplineProps) {
  const lineRef = useRef<THREE.Line>(null);

  const { geometry } = useMemo(() => {
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const normal = mid.clone().normalize();
    mid.add(normal.multiplyScalar(1.2)); // Centrifugal outward slack

    const curve = new THREE.CatmullRomCurve3([start, mid, end]);
    curve.curveType = 'centripetal';
    const points = curve.getPoints(30);
    const geom = new THREE.BufferGeometry().setFromPoints(points);

    return { geometry: geom };
  }, [start, end]);

  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({
      color: isBlasted ? '#FF3333' : color,
      transparent: true,
      opacity: isBlasted ? 0.9 : 0.45,
      linewidth: 1,
    }))} ref={lineRef} />
  );
}

// ─── 4. SATELLITE AST NODE MESH ──────────────────────────────────────────────

interface SatelliteNodeProps {
  data: ASTSatelliteData;
  position: THREE.Vector3;
  isBlasted: boolean;
  onSelect: (node: ASTSatelliteData, pos: THREE.Vector3) => void;
}

function SatelliteNode({ data, position, isBlasted, onSelect }: SatelliteNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!meshRef.current) return;
    if (hovered) {
      animate(meshRef.current, {
        scale: 1.35,
        duration: 300,
        ease: createSpring({ stiffness: 240, damping: 14 }),
      });
    } else {
      animate(meshRef.current, {
        scale: 1.0,
        duration: 400,
        ease: createSpring({ stiffness: 180, damping: 16 }),
      });
    }
  }, [hovered]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        if (typeof document !== 'undefined') document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        if (typeof document !== 'undefined') document.body.style.cursor = 'default';
      }}
      onClick={(e) => { e.stopPropagation(); onSelect(data, position); }}
    >
      <icosahedronGeometry args={[0.5, 1]} />
      <meshStandardMaterial
        color={isBlasted ? '#FF3333' : (hovered ? '#F59E0B' : data.colorHex)}
        emissive={isBlasted ? '#FF3333' : (hovered ? '#F59E0B' : '#000000')}
        emissiveIntensity={isBlasted ? 0.8 : (hovered ? 0.5 : 0.0)}
        wireframe={false}
      />
    </mesh>
  );
}

// ─── 5. CENTRAL REPOSITORY DODECAHEDRON CORE ─────────────────────────────────

function RepositoryCore({ isBlasted }: { isBlasted: boolean }) {
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.2;
      coreRef.current.rotation.x += delta * 0.1;
    }
  });

  return (
    <group>
      {/* Outer Wireframe Cage */}
      <mesh ref={coreRef}>
        <dodecahedronGeometry args={[2.2, 0]} />
        <meshStandardMaterial
          color={isBlasted ? '#FF3333' : '#F59E0B'}
          wireframe
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Inner Dense Core */}
      <mesh>
        <dodecahedronGeometry args={[1.8, 0]} />
        <meshStandardMaterial
          color="#0A0A0C"
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
}

// ─── 6. MASTER SCENE CHOREOGRAPHER ───────────────────────────────────────────

const MOCK_NODES: ASTSatelliteData[] = [
  { id: '1', name: 'ast.ts', filePath: 'src/core/ast.ts', complexity: 18, dependents: 42, colorHex: '#F59E0B', initialOffset: new THREE.Vector3(4.5, 2.5, 3.0) },
  { id: '2', name: 'graph.ts', filePath: 'src/core/graph.ts', complexity: 12, dependents: 28, colorHex: '#10B981', initialOffset: new THREE.Vector3(-4.0, 3.2, 2.0) },
  { id: '3', name: 'blast.ts', filePath: 'src/core/blast.ts', complexity: 24, dependents: 65, colorHex: '#EF4444', initialOffset: new THREE.Vector3(3.5, -3.5, 2.5) },
  { id: '4', name: 'genome.ts', filePath: 'src/core/genome.ts', complexity: 8, dependents: 14, colorHex: '#10B981', initialOffset: new THREE.Vector3(-3.8, -2.8, 3.5) },
  { id: '5', name: 'parser.ts', filePath: 'src/parser/ts.ts', complexity: 15, dependents: 34, colorHex: '#F59E0B', initialOffset: new THREE.Vector3(5.0, 0.0, -3.0) },
  { id: '6', name: 'tokens.ts', filePath: 'src/parser/tokens.ts', complexity: 6, dependents: 19, colorHex: '#10B981', initialOffset: new THREE.Vector3(-4.8, 1.5, -3.2) },
  { id: '7', name: 'cache.ts', filePath: 'src/utils/cache.ts', complexity: 4, dependents: 11, colorHex: '#D1D1D6', initialOffset: new THREE.Vector3(2.0, 4.5, -3.5) },
  { id: '8', name: 'types.ts', filePath: 'src/types/ast.ts', complexity: 2, dependents: 89, colorHex: '#D1D1D6', initialOffset: new THREE.Vector3(-2.2, -4.5, -3.2) },
];

function ASTScene() {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [selectedNode, setSelectedNode] = useState<{ data: ASTSatelliteData; pos: THREE.Vector3 } | null>(null);
  const [blasted, setBlasted] = useState(false);

  // Smooth camera dolly to clicked node
  const handleSelectNode = useCallback((data: ASTSatelliteData, pos: THREE.Vector3) => {
    setSelectedNode({ data, pos });
    if (!controlsRef.current) return;

    controlsRef.current.enabled = false;
    const targetCamPos = pos.clone().add(pos.clone().normalize().multiplyScalar(5.5));

    const camProxy = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
      tx: controlsRef.current.target.x,
      ty: controlsRef.current.target.y,
      tz: controlsRef.current.target.z,
    };

    animate(camProxy, {
      x: targetCamPos.x,
      y: targetCamPos.y,
      z: targetCamPos.z,
      tx: pos.x,
      ty: pos.y,
      tz: pos.z,
      duration: 1000,
      ease: createSpring({ stiffness: 140, damping: 18 }),
      onUpdate: () => {
        camera.position.set(camProxy.x, camProxy.y, camProxy.z);
        controlsRef.current?.target.set(camProxy.tx, camProxy.ty, camProxy.tz);
        controlsRef.current?.update();
      },
      onComplete: () => {
        if (controlsRef.current) controlsRef.current.enabled = true;
      },
    });
  }, [camera]);

  // Trigger blast radius shockwave
  const triggerBlast = useCallback(() => {
    setBlasted(true);
    setTimeout(() => setBlasted(false), 2400);
  }, []);

  return (
    <>
      <AnimeEngineSync />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.2} />
      <pointLight position={[-10, -10, -10]} intensity={0.6} color="#F59E0B" />

      {/* Central Dodecahedron */}
      <RepositoryCore isBlasted={blasted} />

      {/* Satellites & Spline Cables */}
      {MOCK_NODES.map((node) => (
        <React.Fragment key={node.id}>
          <TensionSpline
            start={new THREE.Vector3(0, 0, 0)}
            end={node.initialOffset}
            isBlasted={blasted}
          />
          <SatelliteNode
            data={node}
            position={node.initialOffset}
            isBlasted={blasted}
            onSelect={handleSelectNode}
          />
        </React.Fragment>
      ))}

      {/* Billboard HUD when node is focused */}
      {selectedNode && (
        <Html position={[selectedNode.pos.x, selectedNode.pos.y + 1.2, selectedNode.pos.z]} center distanceFactor={14}>
          <div className="bg-[#0A0A0C]/95 border border-[#1E1E24] p-3 shadow-2xl backdrop-blur-md rounded-none w-56 font-mono select-none">
            <div className="flex items-center justify-between border-b border-[#1E1E24] pb-1 mb-2">
              <span className="text-[10px] text-[#F59E0B] font-bold uppercase">AST INSPECTOR</span>
              <button onClick={() => setSelectedNode(null)} className="text-[#7A7A85] hover:text-white text-xs">✕</button>
            </div>
            <div className="text-xs text-white font-bold truncate mb-2">{selectedNode.data.name}</div>
            <div className="grid grid-cols-2 gap-1 text-[9px] text-[#D1D1D6] mb-3">
              <div>COMPLEXITY: <span className="text-white font-bold">{selectedNode.data.complexity}</span></div>
              <div>DEPS: <span className="text-white font-bold">{selectedNode.data.dependents}</span></div>
            </div>
            <button
              onClick={triggerBlast}
              className="w-full py-1 text-[9px] uppercase tracking-wider bg-[#1E1E24] hover:bg-[#EF4444] text-white border border-[#2A2A32] transition-colors"
            >
              Simulate Blast Radius
            </button>
          </div>
        </Html>
      )}

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        minDistance={4}
        maxDistance={35}
        autoRotate={!selectedNode}
        autoRotateSpeed={0.5}
      />
    </>
  );
}

// ─── 7. EXPORTED ROOT CANVAS WRAPPER ─────────────────────────────────────────

export function Interactive3DTreeCanvas() {
  return (
    <div className="relative w-full h-[600px] bg-[#050506] overflow-hidden select-none" data-lenis-prevent>
      <Canvas
        camera={{ position: [0, 6, 16], fov: 45 }}
        dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)]}
        frameloop="demand"
      >
        <ASTScene />
      </Canvas>
    </div>
  );
}

export default Interactive3DTreeCanvas;
