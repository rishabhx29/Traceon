/**
 * Production Code Recipes & Utilities for Anime.js v4 + Three.js 3D AST Visualization
 * 
 * Target: Traceon 3D Volumetric Code Nucleus & Interactive AST Topology
 * Location: docs/animejs/06-production-code-recipes.ts
 */

import * as THREE from 'three';
import { animate, createTimeline, stagger, createSpring, engine } from 'animejs';
import { getInstances, commitChanges } from 'animejs/adapters/three';

// ─── 1. ANIME.JS ENGINE <-> THREE.JS / R3F SYNC HOOK ─────────────────────────

/**
 * Initializes and synchronizes the Anime.js engine with Three.js / React Three Fiber.
 * Disables the default internal RAF loop to guarantee single-clock frame pacing.
 */
export function initAnimeThreeSync(): () => void {
  // Disable autonomous loop
  engine.useDefaultMainLoop = false;

  return () => {
    // Restore default loop on tear-down
    engine.useDefaultMainLoop = true;
  };
}

/**
 * Must be called inside Three.js setAnimationLoop or R3F useFrame()
 */
export function tickAnimeEngine(): void {
  engine.update();
}

// ─── 2. 3D AST FIBONACCI SPHERICAL DISTRIBUTION ──────────────────────────────

export interface ASTNodeConfig {
  id: string;
  name: string;
  filePath: string;
  depth: number;
  complexity: number;
  dependents: number;
  position?: THREE.Vector3;
}

/**
 * Distributes AST nodes evenly over a 3D spherical shell using the Golden Spiral.
 */
export function computeFibonacciASTCoordinates(
  nodes: ASTNodeConfig[],
  baseRadius = 14
): Map<string, THREE.Vector3> {
  const count = nodes.length;
  const result = new Map<string, THREE.Vector3>();
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  const goldenAngle = 2 * Math.PI * (1 - 1 / goldenRatio);

  nodes.forEach((node, i) => {
    // Hierarchical radius adjustment based on AST depth
    const radius = baseRadius + (node.depth || 1) * 3.5;
    const y = 1 - (i / Math.max(1, count - 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;

    const x = Math.cos(theta) * radiusAtY * radius;
    const z = Math.sin(theta) * radiusAtY * radius;
    const posY = y * radius;

    result.set(node.id, new THREE.Vector3(x, posY, z));
  });

  return result;
}

// ─── 3. CATMULL-ROM TENSION SPLINE GENERATOR ─────────────────────────────────

export interface SplineCableResult {
  curve: THREE.CatmullRomCurve3;
  geometry: THREE.BufferGeometry;
  material: THREE.LineBasicMaterial;
  line: THREE.Line;
}

/**
 * Builds a curved 3D Catmull-Rom dependency tension cable between two AST nodes.
 */
export function buildTensionCable(
  start: THREE.Vector3,
  end: THREE.Vector3,
  colorHex = 0x1E1E24,
  slack = 1.4
): SplineCableResult {
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const normal = mid.clone().normalize();
  mid.add(normal.multiplyScalar(slack));

  const curve = new THREE.CatmullRomCurve3([start, mid, end]);
  curve.curveType = 'centripetal';

  const points = curve.getPoints(40);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity: 0.6,
    linewidth: 1,
  });

  const line = new THREE.Line(geometry, material);

  return { curve, geometry, material, line };
}

// ─── 4. BLAST RADIUS SHOCKWAVE ORCHESTRATOR ──────────────────────────────────

export interface BlastRadiusNodeItem {
  id: string;
  mesh: THREE.Object3D;
  layerDepth: number; // BFS layer distance from epicenter (0, 1, 2, 3)
}

/**
 * Orchestrates a radial shockwave across connected AST nodes with physical spring rebound.
 */
export function triggerBlastRadiusShockwave(
  epicenterMesh: THREE.Object3D,
  affectedNodes: BlastRadiusNodeItem[],
  shaderMaterial?: THREE.ShaderMaterial
) {
  const tl = createTimeline({
    defaults: { ease: 'out(3)' },
  });

  // 1. Epicenter shock compression & snap
  tl.add(epicenterMesh, {
    scale: [1, 1.45, 0.92, 1.08, 1],
    duration: 650,
    ease: createSpring({ stiffness: 300, damping: 15 }),
  });

  // 2. Animate ripple uniform on central surface shader
  if (shaderMaterial && shaderMaterial.uniforms.uRippleProgress) {
    tl.add(
      shaderMaterial.uniforms.uRippleProgress,
      {
        value: [0, 1],
        duration: 1100,
        ease: 'out(3)',
      },
      '-=550'
    );
  }

  // 3. Layer-by-layer wavefront expansion
  const maxLayer = Math.max(...affectedNodes.map((n) => n.layerDepth), 1);

  for (let l = 1; l <= maxLayer; l++) {
    const layerMeshes = affectedNodes
      .filter((n) => n.layerDepth === l)
      .map((n) => n.mesh);

    if (layerMeshes.length === 0) continue;

    tl.add(
      layerMeshes,
      {
        scale: [1, 1.3, 0.95, 1],
        duration: 800,
        delay: stagger(35),
        ease: createSpring({ stiffness: 220, damping: 14 }),
      },
      `-=${750 - l * 120}`
    );
  }

  return tl;
}

// ─── 5. HIGH-DENSITY INSTANCED MESH ANIMATOR ─────────────────────────────────

/**
 * Staggered volumetric blooming animation for large AST constellations (>500 nodes).
 */
export function animateInstancedASTBloom(
  instancedMesh: THREE.InstancedMesh,
  targetCoordinates: THREE.Vector3[]
) {
  const instances = getInstances(instancedMesh);

  // Initialize all instances at origin collapsed
  instances.forEach((inst) => {
    if (!inst) return;
    inst.x = 0;
    inst.y = 0;
    inst.z = 0;
    inst.scale = 0.001;
  });
  commitChanges(instancedMesh);

  // Staggered radial explosion
  instances.forEach((inst, index) => {
    if (!inst) return;
    const target = targetCoordinates[index] || new THREE.Vector3(0, 0, 0);

    animate(inst, {
      x: target.x,
      y: target.y,
      z: target.z,
      scale: 1.0,
      duration: 1200,
      delay: stagger(12, { from: 'center' }),
      ease: createSpring({ stiffness: 180, damping: 16 }),
      onUpdate: () => {
        commitChanges(instancedMesh);
      },
    });
  });
}

// ─── 6. GYROSCOPIC CURSOR PARALLAX CONTROLLER ────────────────────────────────

export class GyroscopicParallaxController {
  private targetRotX = 0;
  private targetRotY = 0;

  constructor(
    public group: THREE.Group,
    public maxTiltDegrees = 10,
    public lerpFactor = 0.06
  ) {}

  updatePointer(pointerNDC: THREE.Vector2) {
    const maxRad = (this.maxTiltDegrees * Math.PI) / 180;
    this.targetRotX = -pointerNDC.y * maxRad;
    this.targetRotY = pointerNDC.x * maxRad;
  }

  tick() {
    this.group.rotation.x += (this.targetRotX - this.group.rotation.x) * this.lerpFactor;
    this.group.rotation.y += (this.targetRotY - this.group.rotation.y) * this.lerpFactor;
  }
}
