// src/components/canvas/act1/Act1ParticleGeometry.ts

export const ACT1_PARTICLE_COUNT = 24000;

export interface Act1ParticleAttributes {
  positions: Float32Array;        // Act 1: Sacred Timeline diagonal beam
  positionsSpread: Float32Array;  // Act 2: Volumetric 3D Cosmic Nebula
  positionsCrystal: Float32Array; // Act 4: Crystalline AST Polyhedral Nucleus
  knotData: Float32Array;         // Act 3: Packed vec4 (x=progress, y=angle, z=radius, w=role)
  particleProps: Float32Array;    // Packed vec4 (x=speed, y=size, z=angle, w=colorSeed)
  crystalData: Float32Array;      // Act 4: Packed vec4 (x=layerRole, y=splineT, z=satelliteId, w=statusSeed)
  timelineData: Float32Array;     // Act 1: Packed vec3 (x=progress, y=strandIndex, z=radius)
}

function hash1(n: number): number {
  return ((Math.sin(n) * 43758.5453123) % 1.0 + 1.0) % 1.0;
}

function hash4(i: number): [number, number, number, number] {
  const h1 = Math.abs((Math.sin(i * 12.9898 + 1.1) * 43758.5453) % 1.0);
  const h2 = Math.abs((Math.sin(i * 78.2330 + 2.3) * 43758.5453) % 1.0);
  const h3 = Math.abs((Math.sin(i * 43.1230 + 3.7) * 43758.5453) % 1.0);
  const h4 = Math.abs((Math.sin(i * 93.9870 + 4.9) * 43758.5453) % 1.0);
  return [h1, h2, h3, h4];
}

function evalBezier(
  p0: [number, number, number],
  p1: [number, number, number],
  p2: [number, number, number],
  p3: [number, number, number],
  t: number
): [number, number, number] {
  const it = 1.0 - t;
  const b0 = it * it * it;
  const b1 = 3.0 * it * it * t;
  const b2 = 3.0 * it * t * t;
  const b3 = t * t * t;
  return [
    b0 * p0[0] + b1 * p1[0] + b2 * p2[0] + b3 * p3[0],
    b0 * p0[1] + b1 * p1[1] + b2 * p2[1] + b3 * p3[1],
    b0 * p0[2] + b1 * p1[2] + b2 * p2[2] + b3 * p3[2],
  ];
}

// Pre-compute 3D Botanical Tree Skeleton (Exact replica of ChatGPT Yggdrasil reference image)
interface TreeBranch {
  p0: [number, number, number];
  p1: [number, number, number];
  p2: [number, number, number];
  p3: [number, number, number];
  depth: number;
  branchId: number;
}

// 1. PRIMARY ARCHING BOUGHS (Tier 0: 10 Cantilevered Major Limbs)
// Emerges from the flared top of the braided spiral trunk (y = 0.68)
const primarySpecs: [number, number, number][] = [
  // Far lateral sweeping boughs (forming the low hanging side-lobes of the canopy)
  [-2.10, 1.40,  0.20],
  [ 2.10, 1.40, -0.20],
  // Mid lateral arching boughs
  [-1.80, 1.95, -0.25],
  [ 1.80, 1.95,  0.25],
  [-1.40, 2.40,  0.30],
  [ 1.40, 2.40, -0.30],
  // Central crown arching boughs
  [-0.85, 2.75, -0.20],
  [ 0.85, 2.75,  0.20],
  // High crown central spires
  [-0.35, 2.98,  0.15],
  [ 0.35, 2.98, -0.15],
];

const primaryBoughs: TreeBranch[] = [];
for (let idx = 0; idx < primarySpecs.length; idx++) {
  const [tx, ty, tz] = primarySpecs[idx];
  const ang = (idx / Number(primarySpecs.length)) * Math.PI * 2.0;
  // Flared top of trunk (radius ~0.24, height ~0.68)
  const bx = 0.24 * Math.cos(ang);
  const by = 0.68;
  const bz = 0.18 * Math.sin(ang);
  
  const p0: [number, number, number] = [bx, by, bz];
  // Smooth upward & outward continuation of the braided trunk flare
  const p1: [number, number, number] = [bx * 1.5 + tx * 0.22, by + 0.42, bz * 1.5 + tz * 0.22];
  // Cantilevered arch carrying canopy weight
  const p2: [number, number, number] = [tx * 0.68, ty * 0.82 + 0.08, tz * 0.68];
  const p3: [number, number, number] = [tx, ty, tz];
  primaryBoughs.push({ p0, p1, p2, p3, depth: 0, branchId: idx });
}

const allBranches: TreeBranch[] = [...primaryBoughs];

// 2. SECONDARY BRANCHES (Tier 1: 30 spreading limbs, 3 per primary)
for (let pIdx = 0; pIdx < primaryBoughs.length; pIdx++) {
  const { p0, p1, p2, p3 } = primaryBoughs[pIdx];
  for (let sIdx = 0; sIdx < 3; sIdx++) {
    const splitT = 0.38 + sIdx * 0.22; // Split at 0.38, 0.60, 0.82
    const basePt = evalBezier(p0, p1, p2, p3, splitT);
    const hS = hash1(pIdx * 37.0 + sIdx * 53.0 + 11.0);
    const side = (sIdx % 2 === 0) ? -1.0 : 1.0;

    const sTx = basePt[0] + (p3[0] - basePt[0]) * 0.65 + side * (0.28 + hS * 0.18);
    const sTy = basePt[1] + (p3[1] - basePt[1]) * 0.65 + 0.16 + hS * 0.12;
    const sTz = basePt[2] + (p3[2] - basePt[2]) * 0.65 + (hS - 0.5) * 0.35;

    const sp0: [number, number, number] = basePt;
    const sp1: [number, number, number] = [basePt[0] * 0.7 + sTx * 0.3, basePt[1] + 0.16, basePt[2] * 0.7 + sTz * 0.3];
    const sp2: [number, number, number] = [basePt[0] * 0.25 + sTx * 0.75, sTy - 0.04, basePt[2] * 0.25 + sTz * 0.75];
    const sp3: [number, number, number] = [sTx, sTy, sTz];
    allBranches.push({ p0: sp0, p1: sp1, p2: sp2, p3: sp3, depth: 1, branchId: pIdx * 3 + sIdx });
  }
}

// 3. TERTIARY TWIGS (Tier 2: 60 fine capillary twigs)
const numSecondaries = allBranches.length - primaryBoughs.length;
for (let sIdx = primaryBoughs.length; sIdx < primaryBoughs.length + numSecondaries; sIdx++) {
  const { p0: sp0, p1: sp1, p2: sp2, p3: sp3, branchId } = allBranches[sIdx];
  for (let tIdx = 0; tIdx < 2; tIdx++) {
    const splitT = 0.48 + tIdx * 0.28;
    const basePt = evalBezier(sp0, sp1, sp2, sp3, splitT);
    const hT = hash1(sIdx * 31.0 + tIdx * 19.0 + 7.0);
    const side = (tIdx === 0) ? 1.0 : -1.0;

    const tTx = basePt[0] + (sp3[0] - basePt[0]) * 0.60 + side * (0.18 + hT * 0.15);
    const tTy = basePt[1] + (sp3[1] - basePt[1]) * 0.60 + 0.12 + hT * 0.10;
    const tTz = basePt[2] + (sp3[2] - basePt[2]) * 0.60 + (hT - 0.5) * 0.28;

    const tp0: [number, number, number] = basePt;
    const tp1: [number, number, number] = [basePt[0] * 0.6 + tTx * 0.4, basePt[1] + 0.10, basePt[2] * 0.6 + tTz * 0.4];
    const tp2: [number, number, number] = [basePt[0] * 0.2 + tTx * 0.8, tTy - 0.02, basePt[2] * 0.2 + tTz * 0.8];
    const tp3: [number, number, number] = [tTx, tTy, tTz];
    allBranches.push({ p0: tp0, p1: tp1, p2: tp2, p3: tp3, depth: 2, branchId });
  }
}

// Sample 600+ Foliage Anchors across all branches for dense volumetric stardust clouds
interface FoliageAnchor {
  pt: [number, number, number];
  depth: number;
  t: number;
  branchId: number;
  clusterR: number;
}
const foliageAnchors: FoliageAnchor[] = [];
for (let bIdx = 0; bIdx < allBranches.length; bIdx++) {
  const b = allBranches[bIdx];
  const samples = (b.depth === 0) ? 7 : ((b.depth === 1) ? 8 : 6);
  for (let s = 0; s < samples; s++) {
    const t = (s + 0.15) / Number(samples);
    if (t > 0.12) {
      const pt = evalBezier(b.p0, b.p1, b.p2, b.p3, t);
      const hA = hash1(bIdx * 43.0 + s * 17.0);
      const clusterR = 0.28 + hA * 0.24; // Organic puff cluster radius [0.28 to 0.52]
      foliageAnchors.push({ pt, depth: b.depth, t, branchId: b.branchId, clusterR });
    }
  }
}
const numAnchors = foliageAnchors.length;

// 4. DENDRITIC WEB ROOTS (18 primary taproots + 36 bifurcations)
interface RootCurve {
  p0: [number, number, number];
  p1: [number, number, number];
  p2: [number, number, number];
  p3: [number, number, number];
  depth: number;
  rootId: number;
}
const rootCurves: RootCurve[] = [];
const numPrimaryRoots = 18;
for (let r = 0; r < numPrimaryRoots; r++) {
  const ang = (r / Number(numPrimaryRoots)) * Math.PI * 2.0;
  const hR = hash1(r * 41.0 + 23.0);
  const rp0: [number, number, number] = [0.22 * Math.cos(ang), -0.60, 0.16 * Math.sin(ang)];

  const reach = 1.70 + (r % 6) * 0.18 + hR * 0.25; // Reaches out to 2.15!
  const isDeep = (r % 3 === 0);
  const rx = reach * Math.cos(ang + (hR - 0.5) * 0.28);
  const rz = reach * Math.sin(ang + (hR - 0.5) * 0.28) * 0.70;
  const ry = -0.95 - (isDeep ? 0.38 : 0.18) * (0.85 + hR * 0.4);

  const rp1: [number, number, number] = [rp0[0] * 1.6 + rx * 0.18, -0.75, rp0[2] * 1.6 + rz * 0.18];
  const rp2: [number, number, number] = [rx * 0.65, ry * 0.70, rz * 0.65];
  const rp3: [number, number, number] = [rx, ry, rz];
  rootCurves.push({ p0: rp0, p1: rp1, p2: rp2, p3: rp3, depth: 0, rootId: r });

  for (let f = 0; f < 2; f++) {
    const fT = 0.36 + f * 0.28;
    const baseF = evalBezier(rp0, rp1, rp2, rp3, fT);
    const hF = hash1(r * 47.0 + f * 31.0 + 13.0);
    const fAng = ang + (f === 0 ? 0.38 : -0.38) + (hF - 0.5) * 0.24;
    const fReach = reach * (0.68 + hF * 0.26);

    const frx = fReach * Math.cos(fAng);
    const frz = fReach * Math.sin(fAng) * 0.70;
    const fry = ry - 0.12 - hF * 0.18;

    const fp0: [number, number, number] = baseF;
    const fp1: [number, number, number] = [baseF[0] * 0.6 + frx * 0.4, baseF[1] - 0.08, baseF[2] * 0.6 + frz * 0.4];
    const fp2: [number, number, number] = [frx * 0.75, fry * 0.85, frz * 0.75];
    const fp3: [number, number, number] = [frx, fry, frz];
    rootCurves.push({ p0: fp0, p1: fp1, p2: fp2, p3: fp3, depth: 1, rootId: r });
  }
}

export function generateAct1ParticleData(count = ACT1_PARTICLE_COUNT): Act1ParticleAttributes {
  const positions = new Float32Array(count * 3);
  const positionsSpread = new Float32Array(count * 3);
  const positionsCrystal = new Float32Array(count * 3);
  const knotData = new Float32Array(count * 4);
  const particleProps = new Float32Array(count * 4);
  const crystalData = new Float32Array(count * 4);
  const timelineData = new Float32Array(count * 3);

  const NUM_STRANDS = 32;

  // Knot Geometry Parameters (Act 3)
  const KNOT_TUBE = 0.50;
  const TWO_PI = Math.PI * 2;
  const NUM_KNOT_STRANDS = 64;
  const PTS_PER_STRAND = Math.floor(count / NUM_KNOT_STRANDS); // 375 particles per strand

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const i4 = i * 4;
    const strandId = i % NUM_STRANDS;

    // Deterministic pseudo-random generators seeded per particle
    const r1 = Math.sin(i * 12.9898) * 0.5 + 0.5;
    const r2 = Math.cos(i * 78.233) * 0.5 + 0.5;
    const r3 = Math.sin(i * 43.123 + 1.5) * 0.5 + 0.5;

    // Shared particle properties
    const pProgress = (i / count) * 2.0 - 1.0;
    const pRadius = 0.25 + r1 * 0.75;
    const pColorSeed = r2;
    const pSpeed = 0.75 + r3 * 0.5;
    const pSize = 0.8 + r1 * 1.5;
    const pAngle = r1 * Math.PI * 2;

    // Packed aParticleProps (x=speed, y=size, z=angle, w=colorSeed)
    particleProps[i4 + 0] = pSpeed;
    particleProps[i4 + 1] = pSize;
    particleProps[i4 + 2] = pAngle;
    particleProps[i4 + 3] = pColorSeed;

    // Packed aTimelineData (x=progress, y=strandIndex, z=radius)
    timelineData[i3 + 0] = pProgress;
    timelineData[i3 + 1] = strandId;
    timelineData[i3 + 2] = pRadius;

    // ── 1. ACT 1: THE SACRED TIMELINE (Exact Approved Base) ──
    positions[i3 + 0] = pProgress * 11.5;
    positions[i3 + 1] = positions[i3] * 0.52;
    positions[i3 + 2] = 0;

    // ── 2. ACT 2: VOLUMETRIC 3D CODE COSMOS & NEBULA ──
    if (i < count * 0.35) {
      // Layer A: Ambient Starfield
      positionsSpread[i3 + 0] = (r1 - 0.5) * 19.5;
      positionsSpread[i3 + 1] = (r2 - 0.5) * 11.5;
      positionsSpread[i3 + 2] = (r3 - 0.5) * 6.0;
    } else if (i < count * 0.75) {
      // Layer B: 4-Arm Harmonic Galactic Loom
      const numArms = 4;
      const armId = strandId % numArms;
      const armAngleOffset = armId * ((Math.PI * 2) / numArms);
      const spiralProgress = 0.2 + Math.pow(r1, 0.75) * 2.8;
      const spiralTheta = spiralProgress * 1.4 + armAngleOffset;
      const radialDist = 1.2 + spiralProgress * 2.2;
      const jitterX = (r2 - 0.5) * 1.8;
      const jitterY = (r3 - 0.5) * 1.4;
      const jitterZ = (Math.sin(i * 4.31) * 0.5) * 1.6;

      positionsSpread[i3 + 0] = (radialDist * Math.cos(spiralTheta) + jitterX) * 1.25;
      positionsSpread[i3 + 1] = (radialDist * Math.sin(spiralTheta) + jitterY) * 0.78;
      positionsSpread[i3 + 2] = jitterZ;
    } else {
      // Layer C: Core Constellations
      const clusterId = i % 5;
      if (clusterId === 0) {
        const coreDist = Math.pow(r1, 0.6) * 4.2;
        const coreAngle = r2 * Math.PI * 2;
        positionsSpread[i3 + 0] = coreDist * Math.cos(coreAngle) * 1.35;
        positionsSpread[i3 + 1] = coreDist * Math.sin(coreAngle) * 0.80;
        positionsSpread[i3 + 2] = (r3 - 0.5) * 2.5;
      } else {
        const quadX = (clusterId === 1 || clusterId === 3) ? -4.5 : 4.5;
        const quadY = (clusterId === 1 || clusterId === 2) ? 2.6 : -2.6;
        const clusterRadius = Math.pow(r1, 0.5) * 2.2;
        const clusterAngle = r2 * Math.PI * 2;
        positionsSpread[i3 + 0] = quadX + clusterRadius * Math.cos(clusterAngle) * 1.2;
        positionsSpread[i3 + 1] = quadY + clusterRadius * Math.sin(clusterAngle) * 0.75;
        positionsSpread[i3 + 2] = (r3 - 0.5) * 2.2;
      }
    }

    // ── 3. ACT 3: CONTINUOUS LONGITUDINAL STREAMLINES (NO TRANSVERSE RINGS) ──
    const strandKnotId = i % NUM_KNOT_STRANDS;
    const ptInStrand = Math.floor(i / NUM_KNOT_STRANDS);

    // Stagger adjacent strands along the knot loop to eliminate any transverse rings
    const strandStagger = ((strandKnotId * 17) % NUM_KNOT_STRANDS) / (NUM_KNOT_STRANDS * PTS_PER_STRAND);
    const baseProgress = ((ptInStrand / PTS_PER_STRAND) + strandStagger) % 1.0;

    // Longitudinal strand angle around tube circumference
    const baseAngle = (strandKnotId / NUM_KNOT_STRANDS) * TWO_PI + (r2 - 0.5) * 0.05;

    // Radial distribution: 78% surface stream, 14% dense inner core, 8% floating corona
    let rTube = KNOT_TUBE;
    let roleVal = 0.0;
    if (r3 < 0.78) {
      rTube = KNOT_TUBE * (0.94 + 0.10 * r1);
      roleVal = 0.0; // Surface streamline
    } else if (r3 < 0.92) {
      rTube = KNOT_TUBE * (0.20 + 0.65 * Math.sqrt(r1));
      roleVal = 1.0; // Luminous core stream
    } else {
      rTube = KNOT_TUBE * (1.10 + 0.32 * r1);
      roleVal = 2.0; // Floating stardust corona
    }

    // Packed vec4 attribute: x=progress, y=angle, z=radius, w=role
    knotData[i4 + 0] = baseProgress;
    knotData[i4 + 1] = baseAngle;
    knotData[i4 + 2] = rTube;
    knotData[i4 + 3] = roleVal;

    // ── 4. ACT 4: LOKI YGGDRASIL MULTIVERSE WORLD TREE (EXACT REFERENCE REPLICA) ──
    // Local coordinates centered around (0,0,0); right-docking offset (+2.45, -0.35, 0) applied in shader
    let cX = 0;
    let cY = 0;
    let cZ = 0;
    let layerRole = 0.0; // 0=Trunk, 1=Roots, 2=Boughs/Limbs, 3=Foliage/Stardust, 4=Embers
    let splineT = 0.0;   // Upward temporal flow coordinate [0.0 to 1.0]
    let branchId = 0.0;
    let colorType = 0.0; // 0=Gold/Amber/Lime, 1=Emerald/Mint, 2=Cyan/Sky, 3=White

    const [h1, h2, h3, h4] = hash4(i);
    const sStar = hash1(i * 137.0 + 23.0);
    const sGold = hash1(i * 97.0 + 41.0);

    if (i < 3200) {
      // ──── LAYER 0: BRAIDED HELICAL TRUNK (3,200 particles) ────
      // Height: -0.60 to +0.70 (total height = 1.30 units, slender & elegant matching reference)
      layerRole = 0.0;
      const numStrands = 24;
      const sId = i % numStrands;
      const ptInS = Math.floor(i / numStrands);
      const ptsTot = Math.floor(3200 / numStrands);
      const t = ptInS / Number(ptsTot);
      branchId = sId;
      splineT = t * 0.40;

      const ty = -0.60 + t * 1.30;
      // Elegant subtle organic S-curve through the trunk
      const spineX = 0.040 * Math.sin(t * Math.PI * 1.4);
      const spineZ = 0.025 * Math.cos(t * Math.PI * 1.4);

      // Flared base, slender waist (t ~ 0.45), flared crown junction
      const rTrunk = 0.115 + 0.125 * Math.pow(1.0 - t, 2.0) + 0.165 * Math.pow(t, 2.2);
      const strandPhase = (sId / Number(numStrands)) * (Math.PI * 2.0);
      const twistAng = strandPhase + t * Math.PI * 2.8 + 0.20 * Math.sin(t * Math.PI * 2.0);

      // Tight ribbon fiber jitter: strands are distinct luminous threads, not a solid block
      const rAct = rTrunk * (0.80 + 0.20 * h2);

      cX = spineX + rAct * Math.cos(twistAng) + (h1 - 0.5) * 0.015;
      cY = ty + (h2 - 0.5) * 0.012;
      cZ = spineZ + rAct * Math.sin(twistAng) * 0.85 + (h3 - 0.5) * 0.015;

      const isHighlight = (sId % 4 === 0);
      if (isHighlight) {
        colorType = 3.0; // Incandescent pure white starlight conduit
      } else if (sId % 2 === 0) {
        colorType = 0.0; // Chartreuse lime / golden amber strand
      } else {
        colorType = 1.0; // Radiant emerald green strand
      }

    } else if (i < 5600) {
      // ──── LAYER 1: SINUOUS RIVER ROOTS (2,400 particles) ────
      layerRole = 1.0;
      const numRoots = rootCurves.length;
      const rIdx = i - 3200;
      const rId = rIdx % numRoots;
      const ptInR = Math.floor(rIdx / numRoots);
      const ptsTot = Math.floor(2400 / numRoots);
      const t = ptInR / Number(ptsTot);
      branchId = rId;
      splineT = 1.0 - t;

      const rc = rootCurves[rId];
      const pt = evalBezier(rc.p0, rc.p1, rc.p2, rc.p3, t);

      const thick = (rc.depth === 0) ? ((1.0 - t * 0.75) * 0.035 + 0.006) : 0.010;
      const wobX = 0.024 * Math.sin(t * 8.0 + rId * 1.5);
      const wobZ = 0.024 * Math.cos(t * 7.0 + rId * 1.2);

      cX = pt[0] + wobX + (h1 - 0.5) * thick * 2.0;
      cY = pt[1] + (h2 - 0.5) * thick * 1.4;
      cZ = pt[2] + wobZ + (h3 - 0.5) * thick * 2.0;

      if (t > 0.65) {
        colorType = (h1 < 0.60) ? 0.0 : 2.0; // Gold tips or cyan tendrils
      } else if (t > 0.30) {
        colorType = (h1 < 0.70) ? 1.0 : 0.0; // Emerald or lime
      } else {
        colorType = (h2 < 0.65) ? 0.0 : 1.0; // Lime near trunk base or emerald
      }

    } else if (i < 10600) {
      // ──── LAYER 2: ARCHING SKELETAL BOUGHS (5,000 particles) ────
      layerRole = 2.0;
      const bIdx = i - 5600;
      const totalB = allBranches.length;
      const cId = bIdx % totalB;
      const ptInC = Math.floor(bIdx / totalB);
      const ptsTot = Math.floor(5000 / totalB);
      const t = ptInC / Number(ptsTot);
      branchId = cId;
      splineT = 0.35 + t * 0.65;

      const bc = allBranches[cId];
      const pt = evalBezier(bc.p0, bc.p1, bc.p2, bc.p3, t);

      const baseThick = (bc.depth === 0) ? 0.032 : ((bc.depth === 1) ? 0.016 : 0.008);
      const thick = baseThick * (1.0 - t * 0.70) + 0.003;

      const wobX = 0.015 * Math.sin(t * 7.0 + cId);
      const wobY = 0.010 * Math.cos(t * 6.0 + cId);
      const wobZ = 0.012 * Math.sin(t * 8.0 + cId * 1.2);

      cX = pt[0] + wobX + (h1 - 0.5) * thick * 2.0;
      cY = pt[1] + wobY + (h2 - 0.5) * thick * 2.0;
      cZ = pt[2] + wobZ + (h3 - 0.5) * thick * 2.0;

      if (bc.depth === 0) {
        colorType = (t < 0.30) ? 0.0 : 1.0; // Lime near trunk or emerald
      } else if (bc.depth === 1) {
        colorType = (t < 0.55) ? 1.0 : 2.0; // Emerald or cyan
      } else {
        colorType = (h1 < 0.65) ? 2.0 : 1.0; // Electric cyan or emerald
      }

      if (h2 < 0.08) {
        colorType = 0.0; // Gold stardust node along limb spine
      }

    } else if (i < 23200) {
      // ──── LAYER 3: DENSE VOLUMETRIC CANOPY FOLIAGE (12,600 particles) ────
      layerRole = 3.0;

      // 82% in distinct volumetric cloudlet puffs around branch anchors
      // 18% in broad ancient oak dome & outer stardust spray
      if (h4 < 0.82 && numAnchors > 0) {
        const aIdx = Math.floor(h1 * numAnchors) % numAnchors;
        const anchor = foliageAnchors[aIdx];
        branchId = anchor.branchId;

        const clusterR = anchor.clusterR;
        const rDist = Math.pow(h2, 0.52) * clusterR;
        const th = h3 * (Math.PI * 2.0);
        const ph = (h1 - 0.5) * Math.PI;

        cX = anchor.pt[0] + rDist * Math.cos(th) * Math.cos(ph);
        cY = anchor.pt[1] + rDist * Math.sin(ph) * 0.88;
        cZ = anchor.pt[2] + rDist * Math.sin(th) * Math.cos(ph);
      } else {
        branchId = Math.floor(h2 * 16.0);
        // Broad ancient oak dome envelope:
        const rx = (h1 * 2.0 - 1.0) * 2.30;
        const xNorm = Math.abs(rx) / 2.35;
        // Rounded crown dome reaches y = 3.12, curves down to 1.30 on flanks
        const yTop = 3.12 - 1.25 * Math.pow(xNorm, 2.1);
        // Arched under-canopy exposes trunk junction
        const yBot = 0.65 + 0.35 * (1.0 - Math.pow(xNorm, 1.4));
        const effTop = Math.max(yTop, yBot + 0.15);
        cY = yBot + h2 * (effTop - yBot);
        cX = rx + (h3 - 0.5) * 0.10;
        const zMax = 0.95 * Math.sqrt(Math.max(0.0, 1.0 - Math.pow(rx / 2.35, 2.0)));
        cZ = (h4 * 2.0 - 1.0) * zMax * 0.75;
      }

      splineT = cY / 3.12;

      // Color Chromatics strictly matching reference image:
      // High crown: cyan, sky blue, white starlight
      // Lateral outer lobes and tips: golden amber & gold stardust
      // Core canopy: rich emerald green
      const isCrown = (cY > 2.25);
      const isOuterLobe = (Math.abs(cX) > 1.35 && cY < 2.10);

      if (isCrown) {
        if (sStar < 0.18) {
          colorType = 3.0; // Diamond White Star
        } else if (sStar < 0.60) {
          colorType = 2.0; // Electric Cyan
        } else if (sStar < 0.85) {
          colorType = 2.0; // Sky Blue
        } else {
          colorType = 1.0; // Mint / Emerald
        }
      } else if (isOuterLobe && sGold < 0.40) {
        // Prominent golden amber stardust tips on outer lobes
        colorType = 0.0;
      } else if (sGold < 0.14) {
        // Sprinkled gold stardust embers
        colorType = 0.0;
      } else if (sStar < 0.06) {
        colorType = 3.0; // White spark
      } else if (h1 < 0.60) {
        colorType = 1.0; // Rich Emerald Green
      } else {
        colorType = 1.0; // Luminous Mint Green
      }

    } else {
      // ──── LAYER 4: AMBIENT CELESTIAL EMBERS & SPORES (800 particles) ────
      layerRole = 4.0;
      branchId = 0.0;
      splineT = 0.5;

      const th = h1 * (Math.PI * 2.0);
      const dist = 0.4 + h2 * 2.6;
      cX = dist * Math.cos(th);
      cZ = dist * Math.sin(th) * 0.75;
      cY = -0.90 + h3 * 4.3;

      if (h1 < 0.45) {
        colorType = 0.0; // Gold ember
      } else if (h1 < 0.78) {
        colorType = 2.0; // Cyan sparkle
      } else {
        colorType = 3.0; // White star
      }
    }

    // Packed aCrystalData (x=layerRole, y=splineT, z=branchId, w=colorType)
    crystalData[i4 + 0] = layerRole;
    crystalData[i4 + 1] = splineT;
    crystalData[i4 + 2] = branchId;
    crystalData[i4 + 3] = colorType;

    positionsCrystal[i3 + 0] = cX;
    positionsCrystal[i3 + 1] = cY;
    positionsCrystal[i3 + 2] = cZ;
  }

  return {
    positions,
    positionsSpread,
    positionsCrystal,
    knotData,
    particleProps,
    crystalData,
    timelineData,
  };
}
