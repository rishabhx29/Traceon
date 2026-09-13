// src/components/canvas/act1/Act1Canvas.tsx
'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { generateAct1ParticleData, ACT1_PARTICLE_COUNT } from './Act1ParticleGeometry';
import { act1VertexShader, act1FragmentShader } from './Act1Shaders';

interface Act1CanvasProps {
  scrollProgress?: number; // 0.0 (Act 1 Timeline) to 1.0 (Act 2 Nebula)
}

// ─── 1. MORPHING PARTICLE LOOM (ACT 1 ➔ ACT 2) ────────────────────────────────

// Module-level pointer tracker ensuring hover effects ONLY activate on real user interaction
const pointerTracker = {
  active: false,
  x: 999,
  y: 999,
};

if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (e: PointerEvent) => {
      pointerTracker.active = true;
      pointerTracker.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerTracker.y = -(e.clientY / window.innerHeight) * 2 + 1;
    },
    { passive: true }
  );

  const onLeave = () => {
    pointerTracker.active = false;
    pointerTracker.x = 999;
    pointerTracker.y = 999;
  };

  window.addEventListener('pointerleave', onLeave);
  document.addEventListener('mouseleave', onLeave);
}

/**
 * VengeanceUI TouchTexture:
 * Off-screen canvas that records cursor movement trails and encodes them as
 * a smooth radial-gradient texture sampled by the particle shader.
 */
class TouchTexture {
  size = 64;
  maxAge = 64;
  radius = 0.12;
  trail: { x: number; y: number; age: number; force: number }[] = [];
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  texture: THREE.CanvasTexture;

  constructor(radius = 0.12) {
    this.radius = radius;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvas.height = this.size;
    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.size, this.size);
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
  }

  private easeOutSine(t: number, b: number, c: number, d: number) {
    return c * Math.sin((t / d) * (Math.PI / 2)) + b;
  }

  addTouch(x: number, y: number) {
    let force = 0;
    const last = this.trail[this.trail.length - 1];
    if (last) {
      const dx = last.x - x;
      const dy = last.y - y;
      force = Math.min((dx * dx + dy * dy) * 6000, 0.85);
    }
    force = Math.max(force, 0.35);
    this.trail.push({ x, y, age: 0, force });
  }

  update() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.size, this.size);

    for (let i = this.trail.length - 1; i >= 0; i--) {
      this.trail[i].age++;
      if (this.trail[i].age > this.maxAge) this.trail.splice(i, 1);
    }
    for (const point of this.trail) this.drawTouch(point);

    this.texture.needsUpdate = true;
  }

  private drawTouch(point: { x: number; y: number; age: number; force: number }) {
    const pos = { x: point.x * this.size, y: point.y * this.size };
    let intensity: number;
    if (point.age < this.maxAge * 0.3) {
      intensity = this.easeOutSine(point.age / (this.maxAge * 0.3), 0, 1, 1);
    } else {
      intensity = this.easeOutSine(1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7), 0, 1, 1);
    }
    intensity *= point.force;

    const radius = this.size * this.radius * intensity;
    if (radius <= 0) return;
    const grd = this.ctx.createRadialGradient(pos.x, pos.y, radius * 0.25, pos.x, pos.y, radius);
    grd.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
    grd.addColorStop(0.5, 'rgba(255, 255, 255, 0.35)');
    grd.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
    this.ctx.beginPath();
    this.ctx.fillStyle = grd;
    this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  dispose() {
    this.texture.dispose();
  }
}

function Act1ParticleBeam({ scrollProgress = 0 }: { scrollProgress: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { camera } = useThree();
  const data = useMemo(() => generateAct1ParticleData(ACT1_PARTICLE_COUNT), []);

  const touchTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return new TouchTexture(0.12);
  }, []);

  const defaultTouchTex = useMemo(() => new THREE.Texture(), []);

  const material = useMemo(() => {
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1;
    return new THREE.ShaderMaterial({
      vertexShader: act1VertexShader,
      fragmentShader: act1FragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uPixelRatio: { value: dpr },
        uBaseSize: { value: 18.0 },
        uProgress: { value: 0.0 },
        uMouseWorld: { value: new THREE.Vector3(999, 999, 0) },
        uMouseStrength: { value: 0.0 },
        uTouch: { value: touchTexture ? touchTexture.texture : defaultTouchTex },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [touchTexture, defaultTouchTex]);

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(data.positions, 3));
    geom.setAttribute('aPosSpread', new THREE.BufferAttribute(data.positionsSpread, 3));
    geom.setAttribute('aPosCrystal', new THREE.BufferAttribute(data.positionsCrystal, 3));
    geom.setAttribute('aKnotData', new THREE.BufferAttribute(data.knotData, 4));
    geom.setAttribute('aParticleProps', new THREE.BufferAttribute(data.particleProps, 4));
    geom.setAttribute('aCrystalData', new THREE.BufferAttribute(data.crystalData, 4));
    geom.setAttribute('aTimelineData', new THREE.BufferAttribute(data.timelineData, 3));
    return geom;
  }, [data]);

  useEffect(() => {
    if (!touchTexture) return;
    const onMove = (e: PointerEvent) => {
      touchTexture.addTouch(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      touchTexture.dispose();
    };
  }, [touchTexture]);

  const planeZ0 = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const intersectionPoint = useMemo(() => new THREE.Vector3(), []);
  const pointerVec = useMemo(() => new THREE.Vector2(), []);

  // The render loop mutates uniforms/camera every frame by design — R3F pattern.
  // The compiler-react linter can't see through useFrame, so mutations go through
  // an untracked ref (material is stable — created once in useMemo with [] deps).
  const materialRef = useRef(material);

  useFrame((state) => {
    const mat = materialRef.current;
    if (!mat) return;

    if (touchTexture) {
      touchTexture.update();
    }

    const uniforms = mat.uniforms as Record<string, { value: number | THREE.Vector3 }>;
    uniforms.uTime.value = state.clock.getElapsedTime();
    uniforms.uProgress.value = THREE.MathUtils.lerp(
      uniforms.uProgress.value as number,
      scrollProgress,
      0.075
    );

    // Mouse raycasting: ONLY active when user is actually interacting with pointer
    let targetStrength = 0.0;
    if (pointerTracker.active) {
      pointerVec.set(pointerTracker.x, pointerTracker.y);
      raycaster.setFromCamera(pointerVec, camera);
      const hit = raycaster.ray.intersectPlane(planeZ0, intersectionPoint);

      if (hit) {
        (uniforms.uMouseWorld.value as THREE.Vector3).lerp(intersectionPoint, 0.22);
        targetStrength = 1.0;
      }
    }

    uniforms.uMouseStrength.value = THREE.MathUtils.lerp(
      uniforms.uMouseStrength.value as number,
      targetStrength,
      0.12
    );

    // Subtle parallax tilt (only when pointer is active)
    const cam = state.camera as THREE.Camera & { position: THREE.Vector3 };
    const targetX = pointerTracker.active ? pointerTracker.x * 0.25 : 0;
    const targetY = pointerTracker.active ? pointerTracker.y * 0.2 : 0;
    cam.position.x = THREE.MathUtils.lerp(cam.position.x, targetX, 0.03);
    cam.position.y = THREE.MathUtils.lerp(cam.position.y, targetY, 0.03);
    cam.lookAt(0, 0, 0);
  });

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

// ─── 2. HOLOGRAPHIC TARGET NODES (FADE OUT IN ACT 2) ──────────────────────────

function HolographicNode({
  position,
  scrollProgress = 0,
  baseColor = '#10b981',
}: {
  position: [number, number, number];
  scrollProgress?: number;
  baseColor?: string;
}) {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const groupRef = useRef<THREE.Group>(null);

  const { camera } = useThree();
  const nodePos = useMemo(() => new THREE.Vector3(...position), [position]);

  useFrame((state, delta) => {
    // Smooth cubic dissolve across [0.10 .. 0.22]
    const rawFade = Math.max(0, Math.min(1.0, (0.22 - scrollProgress) / 0.12));
    const fade = rawFade * rawFade * (3.0 - 2.0 * rawFade);
    if (groupRef.current) {
      groupRef.current.visible = fade > 0.01;
    }

    const screenPos = nodePos.clone().project(camera);
    const distToCursor = pointerTracker.active
      ? Math.hypot(screenPos.x - pointerTracker.x, screenPos.y - pointerTracker.y)
      : 999;
    const isNearby = distToCursor < 0.25;
    const speedMultiplier = isNearby ? 1.4 : 1.0;

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.4 * speedMultiplier;
      const targetScale = isNearby ? 1.1 : 1.0;
      outerRingRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), 0.08);
      if (outerRingRef.current.material instanceof THREE.Material) {
        outerRingRef.current.material.opacity = 0.5 * fade;
      }
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z -= delta * 0.5 * speedMultiplier;
      if (innerRingRef.current.material instanceof THREE.Material) {
        innerRingRef.current.material.opacity = 0.8 * fade;
      }
    }
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.8;
    }
    if (lightRef.current) {
      lightRef.current.intensity = (isNearby ? 1.8 : 1.2) * fade;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={outerRingRef} rotation={[0.4, 0.6, -0.4]}>
        <ringGeometry args={[0.48, 0.50, 48]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      <mesh ref={innerRingRef} rotation={[0.4, 0.6, -0.4]}>
        <ringGeometry args={[0.36, 0.39, 48]} />
        <meshBasicMaterial color={baseColor} transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>

      <mesh ref={coreRef}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      <pointLight ref={lightRef} color={baseColor} intensity={1.2} distance={4} />
    </group>
  );
}

// ─── 3. 3D HAIRLINE CAD AXES (FADE OUT IN ACT 2) ──────────────────────────────

function CadCoordinateAxes({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const lines = useMemo(() => {
    const points: THREE.Vector3[] = [
      new THREE.Vector3(-4.6, -1.82, 0), new THREE.Vector3(-2.4, -1.82, 0),
      new THREE.Vector3(-3.5, -2.9, 0),  new THREE.Vector3(-3.5, -0.7, 0),
      new THREE.Vector3(-3.5, -1.82, -1.2), new THREE.Vector3(-3.5, -1.82, 1.2),

      new THREE.Vector3(2.4, 1.82, 0), new THREE.Vector3(4.6, 1.82, 0),
      new THREE.Vector3(3.5, 0.7, 0),  new THREE.Vector3(3.5, 2.9, 0),
      new THREE.Vector3(3.5, 1.82, -1.2), new THREE.Vector3(3.5, 1.82, 1.2),
    ];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  useFrame(() => {
    // Smooth cubic dissolve across [0.10 .. 0.22]
    const rawFade = Math.max(0, Math.min(1.0, (0.22 - scrollProgress) / 0.12));
    const fade = rawFade * rawFade * (3.0 - 2.0 * rawFade);
    if (groupRef.current) {
      groupRef.current.visible = fade > 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color="#3f3f46" transparent opacity={0.25} />
      </lineSegments>
    </group>
  );
}

// ─── 4. FLOATING AMBIENT EMBER PARTICLES ───────────────────────────────────────

// Deterministic hash-based PRNG (keeps useMemo pure per react-hooks rules;
// visuals are indistinguishable from Math.random here)
function emberRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function FloatingEmbers({ count = 200 }: { count?: number }) {
  const embersRef = useRef<THREE.Points>(null);

  // Both arrays are built once with a deterministic PRNG (pure useMemo), then
  // velocities are copied into a ref the frame loop can mutate freely.
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (emberRandom(i * 3 + 1) - 0.5) * 26;
      pos[i * 3 + 1] = (emberRandom(i * 3 + 2) - 0.5) * 16;
      pos[i * 3 + 2] = (emberRandom(i * 3 + 3) - 0.5) * 8;
      vel[i * 3] = (emberRandom(i * 7 + 4) - 0.5) * 0.0025;
      vel[i * 3 + 1] = (emberRandom(i * 7 + 5) - 0.5) * 0.0025 + 0.001;
      vel[i * 3 + 2] = (emberRandom(i * 7 + 6) - 0.5) * 0.0025;
    }
    return [pos, vel] as const;
  }, [count]);

  const velocitiesRef = useRef(velocities);

  useFrame(() => {
    if (!embersRef.current) return;
    const velocities = velocitiesRef.current;
    if (!velocities) return;
    const posAttr = embersRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i * 3];
      arr[i * 3 + 1] += velocities[i * 3 + 1];
      arr[i * 3 + 2] += velocities[i * 3 + 2];

      if (Math.abs(arr[i * 3]) > 13) velocities[i * 3] *= -1;
      if (Math.abs(arr[i * 3 + 1]) > 8) arr[i * 3 + 1] = -8;
      if (Math.abs(arr[i * 3 + 2]) > 4) velocities[i * 3 + 2] *= -1;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={embersRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#f59e0b"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

// ─── 5. MAIN CANVAS COMPONENT ─────────────────────────────────────────────────

export function Act1Canvas({ scrollProgress = 0 }: Act1CanvasProps) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden select-none">
      <Canvas
        camera={{ position: [0, 0, 11.5], fov: 46 }}
        dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 2, 2)]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.25} />
        <Act1ParticleBeam scrollProgress={scrollProgress} />
        <HolographicNode position={[-3.5, -1.82, 0]} scrollProgress={scrollProgress} baseColor="#10b981" />
        <HolographicNode position={[3.5, 1.82, 0]} scrollProgress={scrollProgress} baseColor="#10b981" />
        <CadCoordinateAxes scrollProgress={scrollProgress} />
        <FloatingEmbers count={200} />
      </Canvas>
    </div>
  );
}

export default Act1Canvas;

