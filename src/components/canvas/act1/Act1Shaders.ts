// src/components/canvas/act1/Act1Shaders.ts
// Multi-Act GLSL shaders: Act 1 Sacred Timeline -> Act 2 Nebula -> Act 3 Trefoil Knot -> Act 4 AST Crystal

export const act1VertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uBaseSize;
  uniform float uProgress;      // 0.0 = Act 1, ~0.35 = Act 2, ~0.65 = Act 3, 1.0 = Act 4
  uniform vec3 uMouseWorld;
  uniform float uMouseStrength;
  uniform sampler2D uTouch;     // VengeanceUI offscreen touch trail texture

  attribute vec3 aPosSpread;    // Act 2: Pre-computed volumetric 3D nebula position
  attribute vec3 aPosCrystal;   // Act 4: Crystalline AST local position
  attribute vec4 aKnotData;     // Act 3: Packed vec4 (x=progress, y=angle, z=radius, w=role)
  attribute vec4 aParticleProps;// Packed vec4 (x=speed, y=size, z=angle, w=colorSeed)
  attribute vec4 aCrystalData;  // Act 4: Packed vec4 (x=layerRole, y=splineT, z=satelliteId, w=statusSeed)
  attribute vec3 aTimelineData; // Act 1: Packed vec3 (x=progress, y=strandIndex, z=radius)

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Unpack composite attributes
    float aSpeed = aParticleProps.x;
    float aSize = aParticleProps.y;
    float aAngle = aParticleProps.z;
    float aColorSeed = aParticleProps.w;

    float aProgress = aTimelineData.x;
    float aStrandIndex = aTimelineData.y;
    float aRadius = aTimelineData.z;

    // ─── 1. ACT 1 SACRED TIMELINE COORDINATES ────────────────────────────────
    float flowTime = uTime * 0.12 * aSpeed;
    float t = aProgress + fract(flowTime);
    if (t > 1.0) t -= 2.0;

    float x = t * 12.0;
    float yCenter = x * 0.52;

    // Holographic node pinch around x = -3.5 and x = +3.5
    float distP1 = abs(x + 3.5);
    float distP2 = abs(x - 3.5);
    float pinch1 = clamp(distP1 / 2.5, 0.0, 1.0);
    float pinch2 = clamp(distP2 / 2.5, 0.0, 1.0);
    float pinchFactor = min(pinch1, pinch2);

    // Signature woven diamond / nebula envelope (swells between nodes, pinches at rings)
    float envelope = 0.05 + pow(pinchFactor, 1.4) * 1.15;
    float strandAngle = (aStrandIndex / 32.0) * 6.283185 + x * 0.35;
    float braidOsc = sin(uTime * 0.6 + aStrandIndex * 0.25 + x * 0.2) * 0.06;
    float r = envelope * aRadius;

    vec3 posTimeline = vec3(
      x,
      yCenter + sin(strandAngle + braidOsc) * r,
      cos(strandAngle + braidOsc) * r * 0.6
    );

    // ─── 2. ACT 2 VOLUMETRIC 3D NEBULA COORDINATES ───────────────────────────
    vec3 posNebula = aPosSpread;

    // Slow, celestial galactic roll (around camera Z axis) preserving full screen coverage
    float rollAngle = uTime * 0.020;
    float cosR = cos(rollAngle);
    float sinR = sin(rollAngle);
    vec2 rolledXY = vec2(
      posNebula.x * cosR - posNebula.y * sinR,
      posNebula.x * sinR + posNebula.y * cosR
    );
    posNebula.x = rolledXY.x;
    posNebula.y = rolledXY.y;

    // Subtle 3D gyroscopic precession (max ~6 degrees tilt) for volumetric parallax
    float pitchAngle = sin(uTime * 0.03) * 0.10;
    float cosP = cos(pitchAngle);
    float sinP = sin(pitchAngle);
    float newY = posNebula.y * cosP - posNebula.z * sinP;
    float newZ = posNebula.y * sinP + posNebula.z * cosP;
    posNebula.y = newY;
    posNebula.z = newZ;

    // Gentle organic breathing across the cosmos
    posNebula += vec3(
      sin(uTime * 0.35 + aStrandIndex * 0.25) * 0.12,
      cos(uTime * 0.30 + aProgress * 2.0) * 0.12,
      sin(uTime * 0.40 + aRadius * 3.0) * 0.15
    );

    // ─── 3. ACT 3: CONTINUOUS FLOWING TREFOIL KNOT STREAMLINES ───────────────
    float aKnotProgress = aKnotData.x;
    float aKnotAngle    = aKnotData.y;
    float aKnotRadius   = aKnotData.z;
    float aAct3Role     = aKnotData.w;

    // Continuous longitudinal flow: particles stream endlessly along the 3D knot
    float flowSpeed = 0.042 * aSpeed;
    float flowProgress = fract(aKnotProgress + uTime * flowSpeed);
    float u = flowProgress * 12.566370614359172; // 4.0 * PI

    // Longitudinal strand angle around tube with subtle organic weave
    float v = aKnotAngle + sin(uTime * 1.5 + flowProgress * 18.84) * 0.05;
    float rTube = aKnotRadius;

    // Evaluate 3D Torus Knot curve at dynamic flowing parameter u
    float cu = cos(u);
    float su = sin(u);
    float qu = 1.5 * u;
    float cs = cos(qu);
    float ss = sin(qu);

    float R = 2.65;
    vec3 P1 = vec3(
      R * (2.0 + cs) * 0.5 * cu,
      R * (2.0 + cs) * su * 0.5,
      R * ss * 0.5
    );

    // Analytical tangent vector T = dP1/du
    vec3 T = vec3(
      0.5 * R * (-2.0 * su - 1.5 * ss * cu - cs * su),
      0.5 * R * ( 2.0 * cu - 1.5 * ss * su + cs * cu),
      0.5 * R * ( 1.5 * cs)
    );
    vec3 T_hat = normalize(T);

    // Continuous orthonormal basis
    vec3 B = normalize(cross(T_hat, P1));
    vec3 N_ort = cross(B, T_hat);

    // Tube surface position and surface unit normal
    float cosV = cos(v);
    float sinV = sin(v);
    vec3 surfNorm = -cosV * N_ort + sinV * B;
    vec3 surfPt   = P1 + surfNorm * rTube;

    // Rotate -PI/2 around Z to align lobes with reference image (down, up-right, up-left)
    vec3 localKnot = vec3(surfPt.y, -surfPt.x, surfPt.z);
    vec3 localNorm = vec3(surfNorm.y, -surfNorm.x, surfNorm.z);

    // Centered on the left half of the viewport: x = -2.65
    vec3 knotCenter = vec3(-2.65, 0.0, 0.0);
    float pitchK = 0.22 + sin(uTime * 0.25) * 0.03;
    float yawK   = 0.08 + cos(uTime * 0.20) * 0.03;
    float rollK  = sin(uTime * 0.15) * 0.02;

    // Euler rotation (Z -> Y -> X) applied synchronously to position and normal
    float cosRK = cos(rollK);
    float sinRK = sin(rollK);
    vec3 kRotZ = vec3(
      localKnot.x * cosRK - localKnot.y * sinRK,
      localKnot.x * sinRK + localKnot.y * cosRK,
      localKnot.z
    );
    vec3 nRotZ = vec3(
      localNorm.x * cosRK - localNorm.y * sinRK,
      localNorm.x * sinRK + localNorm.y * cosRK,
      localNorm.z
    );

    float cosYK = cos(yawK);
    float sinYK = sin(yawK);
    vec3 kRotY = vec3(
      kRotZ.x * cosYK + kRotZ.z * sinYK,
      kRotZ.y,
      -kRotZ.x * sinYK + kRotZ.z * cosYK
    );
    vec3 nRotY = vec3(
      nRotZ.x * cosYK + nRotZ.z * sinYK,
      nRotZ.y,
      -nRotZ.x * sinYK + nRotZ.z * cosYK
    );

    float cosPK = cos(pitchK);
    float sinPK = sin(pitchK);
    vec3 kRotX = vec3(
      kRotY.x,
      kRotY.y * cosPK - kRotY.z * sinPK,
      kRotY.y * sinPK + kRotY.z * cosPK
    );
    vec3 nRotX = vec3(
      nRotY.x,
      nRotY.y * cosPK - nRotY.z * sinPK,
      nRotY.y * sinPK + nRotY.z * cosPK
    );

    vec3 finalPosKnot = kRotX + knotCenter;
    vec3 finalNormKnot = normalize(nRotX);

    // ─── 4. ACT 4: LOKI YGGDRASIL MULTIVERSE WORLD TREE COORDINATES ───────────
    float aTreeRole  = aCrystalData.x; // 0=Trunk, 1=Roots, 2=Boughs, 3=Canopy Foliage, 4=Embers
    float aFlowT     = aCrystalData.y; // Upward temporal flow coordinate [0.0 to 1.0]
    float aBranchId  = aCrystalData.z; // Branch / Root / Strand ID
    float aColorType = aCrystalData.w; // 0=Gold/Amber, 1=Emerald, 2=Cyan/Sky, 3=White

    // Scale up the entire botanical world tree to make it towering, grand, and majestic
    float treeScale = 1.82;
    vec3 localTree = aPosCrystal * treeScale;

    // Natural gentle cosmic breeze / breathing sway through the tree:
    // Roots stay anchored firmly below y = -1.10; trunk has subtle harmonic sway; canopy branches sway organically
    float swayHeightFactor = clamp((localTree.y + 1.10) / 6.60, 0.0, 1.0);
    float treeSwayX = sin(uTime * 0.45 + localTree.y * 0.35) * (0.065 * swayHeightFactor);
    float treeSwayZ = cos(uTime * 0.35 + aBranchId * 0.4) * (0.075 * swayHeightFactor);
    localTree.x += treeSwayX;
    localTree.z += treeSwayZ;

    // Slow, majestic celestial yaw tilt (looking into the living multiverse tree)
    float yawT = sin(uTime * 0.08) * 0.08;
    float cosYT = cos(yawT);
    float sinYT = sin(yawT);
    vec3 tRotY = vec3(
      localTree.x * cosYT + localTree.z * sinYT,
      localTree.y,
      -localTree.x * sinYT + localTree.z * cosYT
    );

    // Ambient embers gently drift upward continuously across the towering vertical span
    if (aTreeRole > 3.5) {
      float emberRise = fract((localTree.y + 2.8) / 8.6 + uTime * 0.06) * 8.8 - 4.0;
      tRotY.y = emberRise;
      tRotY.x += sin(uTime * 0.8 + aFlowT * 6.28) * 0.35;
      tRotY.z += cos(uTime * 0.7 + aBranchId) * 0.35;
    }

    // Right-docked center: X = +2.95, Y = -1.05, Z = 0.0
    vec3 treeCenter = vec3(2.95, -1.05, 0.0);
    vec3 finalPosTree = tRotY + treeCenter;

    // ─── COLOR PALETTE CHROMATICS ────────────────────────────────────────────
    vec3 cEmerald  = vec3(0.063, 0.82, 0.54);   // #10b981 vivid emerald green
    vec3 cMint     = vec3(0.204, 0.827, 0.60);  // #34d399 luminous mint
    vec3 cCyan     = vec3(0.024, 0.714, 0.831); // #06b6d4 electric cyan (Adenine)
    vec3 cRose     = vec3(0.957, 0.247, 0.369); // #f43f5e vivid rose (Thymine)
    vec3 cLime     = vec3(0.518, 0.800, 0.086); // #84cc16 luminous lime (Guanine)
    vec3 cAmber    = vec3(0.961, 0.620, 0.043); // #f59e0b rich amber (Cytosine)
    vec3 cGold     = vec3(0.984, 0.749, 0.141); // #fbbf24 electric gold
    vec3 cWhite    = vec3(0.98, 1.00, 0.99);    // pure incandescent white
    vec3 cDarkRoot = vec3(0.02, 0.35, 0.22);    // deep forest moss root emerald
    vec3 cSky      = vec3(0.22, 0.74, 0.97);    // #38bdf8 bright celestial sky blue

    // ─── 5. ACT 5: ICONIC WATSON-CRICK DNA DOUBLE HELIX (ENDLESS STREAMING RIVER) ───
    // 22% Rail A (Sugar-phosphate backbone A - Emerald / Mint)
    // 22% Rail B (Sugar-phosphate backbone B - Gold / Amber)
    // 12% Rail Nodes (Spherical sugar-phosphate anchor joints at every ladder rung)
    // 40% Base-Pair Nucleotide Capsules (Ladder rungs with distinct paired bases)
    // 4%  Genetic Codon Sparks (Floating ambient ions)
    float dnaRoleHash = fract(aProgress * 97.31 + aStrandIndex * 0.17 + aColorSeed * 3.19);

    vec3 finalPosDNA;
    vec3 act5Col;
    float dnaAlpha;
    float dnaSizeScale;

    // Endless Upward Stream: Height span [-4.40, +4.40] (total 8.80 units)
    // Shifted left to x = -3.45 to eliminate empty left margin and balance HUD card on right
    float helixRadius = 1.62;
    float helixTurns = 2.30;
    float pitch = (helixTurns * 6.2831853) / 8.80;
    float rotDNA = uTime * 0.32;
    float grooveOffset = 2.40; // Authentic B-DNA major/minor groove separation
    vec3 baseDnaCenter = vec3(-3.45, 0.0, 0.0);

    // Synchronized upward vertical speed (0.55 units/sec)
    // For continuous ribbon rails:
    float progRail = fract(aProgress + uTime * 0.0625);
    float yRail = mix(-4.40, 4.40, progRail);
    float edgeFadeRail = smoothstep(4.40, 3.50, abs(yRail));

    // For 24 rungs and anchor beads:
    float numRungs = 24.0;
    float rungSpacing = 8.80 / 24.0; // ~0.36667
    float kRaw = floor(aProgress * 24.0);
    float yRung = mod(kRaw * rungSpacing + uTime * 0.55, 8.80) - 4.40;
    float rungIdx = floor((yRung + 4.40) / rungSpacing);
    float edgeFadeRung = smoothstep(4.40, 3.50, abs(yRung));

    // Gentle organic serpentine flex
    float flexRailX = sin(uTime * 0.40 + yRail * 0.50) * 0.08;
    float flexRailZ = cos(uTime * 0.35 + yRail * 0.45) * 0.06;
    vec3 dnaCenterRail = vec3(-3.45 + flexRailX, 0.0, flexRailZ);

    float flexRungX = sin(uTime * 0.40 + yRung * 0.50) * 0.08;
    float flexRungZ = cos(uTime * 0.35 + yRung * 0.45) * 0.06;
    vec3 dnaCenterRung = vec3(-3.45 + flexRungX, 0.0, flexRungZ);

    if (dnaRoleHash < 0.22) {
      // ──── RAIL A (Sugar-Phosphate Backbone Ribbon: Emerald) ────
      float thetaRailA = yRail * pitch + rotDNA;
      float cableAngA = aAngle + uTime * 0.2;
      float cableRA = sqrt(clamp(aRadius, 0.1, 1.2)) * 0.16;
      float radA = helixRadius + cableRA * cos(cableAngA);

      finalPosDNA = vec3(
        dnaCenterRail.x + radA * cos(thetaRailA),
        dnaCenterRail.y + yRail + cableRA * sin(cableAngA),
        dnaCenterRail.z + radA * sin(thetaRailA)
      );

      float waveA = fract(uTime * 0.35 - yRail * 0.22);
      float pulseA = exp(-pow((waveA - 0.5) * 8.0, 2.0));
      act5Col = mix(cEmerald, cMint, aColorSeed * 0.6);
      act5Col = mix(act5Col, cWhite, pulseA * 0.6);
      dnaAlpha = 0.95 * edgeFadeRail;
      dnaSizeScale = 1.15 * smoothstep(4.40, 3.80, abs(yRail));

    } else if (dnaRoleHash < 0.44) {
      // ──── RAIL B (Sugar-Phosphate Backbone Ribbon: Gold) ────
      float thetaRailB = yRail * pitch + rotDNA + grooveOffset;
      float cableAngB = aAngle - uTime * 0.2;
      float cableRB = sqrt(clamp(aRadius, 0.1, 1.2)) * 0.16;
      float radB = helixRadius + cableRB * cos(cableAngB);

      finalPosDNA = vec3(
        dnaCenterRail.x + radB * cos(thetaRailB),
        dnaCenterRail.y + yRail + cableRB * sin(cableAngB),
        dnaCenterRail.z + radB * sin(thetaRailB)
      );

      float waveB = fract(uTime * 0.35 + yRail * 0.22);
      float pulseB = exp(-pow((waveB - 0.5) * 8.0, 2.0));
      act5Col = mix(cAmber, cGold, aColorSeed * 0.6);
      act5Col = mix(act5Col, cWhite, pulseB * 0.6);
      dnaAlpha = 0.95 * edgeFadeRail;
      dnaSizeScale = 1.15 * smoothstep(4.40, 3.80, abs(yRail));

    } else if (dnaRoleHash < 0.56) {
      // ──── RAIL NODES (Sugar-Phosphate Spherical Anchor Beads at Every Rung) ────
      float thetaNodeA = yRung * pitch + rotDNA;
      float thetaNodeB = thetaNodeA + grooveOffset;

      vec3 pNodeA = vec3(dnaCenterRung.x + helixRadius * cos(thetaNodeA), dnaCenterRung.y + yRung, dnaCenterRung.z + helixRadius * sin(thetaNodeA));
      vec3 pNodeB = vec3(dnaCenterRung.x + helixRadius * cos(thetaNodeB), dnaCenterRung.y + yRung, dnaCenterRung.z + helixRadius * sin(thetaNodeB));

      float side = (aColorSeed < 0.5) ? 0.0 : 1.0;
      vec3 nodeCenter = (side < 0.5) ? pNodeA : pNodeB;

      // Spherical cluster around node center
      float spAngle1 = aAngle;
      float spAngle2 = aStrandIndex * 0.35 + aSpeed * 2.0;
      float spR = 0.18 * sqrt(clamp(aRadius, 0.2, 1.0));
      finalPosDNA = nodeCenter + vec3(
        spR * sin(spAngle1) * cos(spAngle2),
        spR * cos(spAngle1),
        spR * sin(spAngle1) * sin(spAngle2)
      );

      vec3 nodeBase = (side < 0.5) ? cEmerald : cGold;
      act5Col = mix(cWhite, nodeBase, 0.45);
      dnaAlpha = 1.0 * edgeFadeRung;
      dnaSizeScale = 1.45 * smoothstep(4.40, 3.80, abs(yRung));

    } else if (dnaRoleHash < 0.96) {
      // ──── BASE-PAIR NUCLEOTIDE CAPSULES (The Horizontal Ladder Steps) ────
      float thetaBaseA = yRung * pitch + rotDNA;
      float thetaBaseB = thetaBaseA + grooveOffset;

      vec3 pBaseA = vec3(dnaCenterRung.x + helixRadius * cos(thetaBaseA), dnaCenterRung.y + yRung, dnaCenterRung.z + helixRadius * sin(thetaBaseA));
      vec3 pBaseB = vec3(dnaCenterRung.x + helixRadius * cos(thetaBaseB), dnaCenterRung.y + yRung, dnaCenterRung.z + helixRadius * sin(thetaBaseB));

      // Watson-Crick base pair assignment for this rung (A-T or G-C)
      float pairType = mod(rungIdx, 4.0);
      vec3 colBase1;
      vec3 colBase2;
      if (pairType < 0.5) {
        colBase1 = cCyan; // Adenine
        colBase2 = cRose; // Thymine
      } else if (pairType < 1.5) {
        colBase1 = cLime; // Guanine
        colBase2 = cAmber; // Cytosine
      } else if (pairType < 2.5) {
        colBase1 = cRose; // Thymine
        colBase2 = cCyan; // Adenine
      } else {
        colBase1 = cAmber; // Cytosine
        colBase2 = cLime; // Guanine
      }

      // Capsule sub-partition along the rung
      float subPart = fract(aColorSeed * 11.37 + aSpeed * 3.1);
      float s;
      float capThick;
      vec3 rungCol;
      float rungSize;

      if (subPart < 0.45) {
        // Base 1 Capsule (Left nucleotide)
        s = 0.08 + (subPart / 0.45) * 0.36;
        capThick = 0.12 * sin((s - 0.08) / 0.36 * 3.14159) + 0.04;
        rungCol = colBase1;
        rungSize = 1.30;
      } else if (subPart < 0.55) {
        // Central Hydrogen Bond Junction
        s = 0.44 + ((subPart - 0.45) / 0.10) * 0.12;
        capThick = 0.04;
        rungCol = cWhite;
        rungSize = 1.60;
      } else {
        // Base 2 Capsule (Right nucleotide)
        s = 0.56 + ((subPart - 0.55) / 0.45) * 0.36;
        capThick = 0.12 * sin((s - 0.56) / 0.36 * 3.14159) + 0.04;
        rungCol = colBase2;
        rungSize = 1.30;
      }

      vec3 rungDir = pBaseB - pBaseA;
      vec3 rungUnit = normalize(rungDir);
      vec3 upVec = vec3(0.0, 1.0, 0.0);
      vec3 normRung = normalize(cross(rungUnit, upVec));
      vec3 binormRung = cross(rungUnit, normRung);

      float radOffset = sqrt(clamp(aRadius, 0.1, 1.0)) * capThick;
      vec3 pt = pBaseA + rungDir * s + (normRung * cos(aAngle) + binormRung * sin(aAngle)) * radOffset;

      finalPosDNA = pt;

      // Sequencing energy pulse along rungs
      float seqPulse = exp(-pow((fract(uTime * 0.32 - yRung * 0.20) - 0.5) * 8.0, 2.0));
      act5Col = mix(rungCol, cWhite, seqPulse * 0.55);
      dnaAlpha = 0.95 * edgeFadeRung;
      dnaSizeScale = rungSize * smoothstep(4.40, 3.80, abs(yRung));

    } else {
      // ──── GENETIC CODON SPARKS / AMBIENT CLOUD ────
      float thetaSpark = aAngle + uTime * 0.15;
      float rSpark = helixRadius * (1.12 + aRadius * 0.45);
      float ySpark = mix(-4.40, 4.40, fract(aProgress + uTime * 0.08));

      finalPosDNA = vec3(
        baseDnaCenter.x + rSpark * cos(thetaSpark),
        baseDnaCenter.y + ySpark,
        baseDnaCenter.z + rSpark * sin(thetaSpark)
      );

      float sparkTwinkle = sin(uTime * 4.0 + aColorSeed * 12.56) * 0.35 + 0.65;
      act5Col = (aColorSeed > 0.5) ? cWhite : cCyan;
      act5Col *= sparkTwinkle;
      float sparkEdge = smoothstep(4.40, 3.50, abs(ySpark));
      dnaAlpha = 0.70 * sparkTwinkle * sparkEdge;
      dnaSizeScale = 0.85 * smoothstep(4.40, 3.80, abs(ySpark));
    }

    // ─── 3D MOLECULAR PERSPECTIVE TILT (Roll & Pitch) ────────────────────────
    // Tilted slightly (14 deg roll, 16 deg pitch) for authentic 3D macromolecular perspective
    float cosZ = 0.990268; // cos(0.14)
    float sinZ = 0.139543; // sin(0.14)
    float cosX = 0.987227; // cos(0.16)
    float sinX = 0.159318; // sin(0.16)

    vec3 localPosDNA = finalPosDNA - baseDnaCenter;
    float x_r = localPosDNA.x * cosZ - localPosDNA.y * sinZ;
    float y_r = localPosDNA.x * sinZ + localPosDNA.y * cosZ;
    float y_p = y_r * cosX - localPosDNA.z * sinX;
    float z_p = y_r * sinX + localPosDNA.z * cosX;
    finalPosDNA = vec3(x_r, y_p, z_p) + baseDnaCenter;

    // ═════════════════════════════════════════════════════════════════════════
    // ─── 6. ACT 6: EXPANSIVE DEEP-SPACE SCATTERED BACKGROUND COSMOS ─────────
    // ═════════════════════════════════════════════════════════════════════════
    // Serene, expansive 3D starfield & cosmic nebula filling the background (matching Act 2)
    // Allows the central glassmorphic command console & typography to float cleanly
    vec3 finalPosCore;
    vec3 act6Col;
    float coreAlpha;
    float coreSizeScale;

    // Spread coordinates spanning x in [-11.5, +11.5], y in [-6.8, +6.8], z in [-4.0, +2.5]
    vec3 localScatter = aPosSpread * 1.25;

    // Slow, serene galactic rotation (around camera Y and Z axes)
    float rotCosmosY = uTime * 0.024;
    float cosYCosmos = cos(rotCosmosY);
    float sinYCosmos = sin(rotCosmosY);
    vec3 rotScatter = vec3(
      localScatter.x * cosYCosmos + localScatter.z * sinYCosmos,
      localScatter.y,
      -localScatter.x * sinYCosmos + localScatter.z * cosYCosmos
    );

    // Subtle 3D gyroscopic precession (slow pitch angle ~5 degrees)
    float pitchCosmos = sin(uTime * 0.030) * 0.09;
    float cosPCosmos = cos(pitchCosmos);
    float sinPCosmos = sin(pitchCosmos);
    float pitchY = rotScatter.y * cosPCosmos - rotScatter.z * sinPCosmos;
    float pitchZ = rotScatter.y * sinPCosmos + rotScatter.z * cosPCosmos;
    rotScatter.y = pitchY;
    rotScatter.z = pitchZ;

    // Gentle multi-harmonic cosmic breathing and parallax drift
    float driftTimeCosmos = uTime * 0.14;
    rotScatter += vec3(
      sin(driftTimeCosmos * 1.2 + aProgress * 3.14159 + aStrandIndex * 0.20) * 0.35,
      cos(driftTimeCosmos * 1.0 + aRadius * 2.8 + aStrandIndex * 0.15) * 0.25,
      sin(driftTimeCosmos * 1.4 + aAngle) * 0.40
    );

    finalPosCore = rotScatter;

    // ── CHROMATICS & STAR TWINKLE ───────────────────────────────────────────
    // Natural twinkling frequency per star
    float starTwinkleCosmos = sin(uTime * 2.8 + aColorSeed * 15.7 + aStrandIndex * 0.7) * 0.28 + 0.72;

    if (aColorSeed > 0.82) {
      // Diamond white starlight stars (prominent navigation points)
      act6Col = mix(cWhite, cCyan, 0.15);
      coreAlpha = 0.95 * starTwinkleCosmos;
      coreSizeScale = 1.65;
    } else if (aColorSeed > 0.58) {
      // Luminous electric cyan and sky blue stellar filaments
      act6Col = mix(cCyan, cSky, sin(uTime * 0.4 + aRadius * 3.5) * 0.5 + 0.5);
      coreAlpha = 0.82 * starTwinkleCosmos;
      coreSizeScale = 1.15;
    } else if (aColorSeed > 0.35) {
      // Warm golden amber stardust embers
      act6Col = mix(cAmber, cGold, aProgress);
      coreAlpha = 0.78 * starTwinkleCosmos;
      coreSizeScale = 1.05;
    } else {
      // Vivid emerald & mint interstellar nebulous glow
      act6Col = mix(cEmerald, cMint, aColorSeed / 0.35);
      coreAlpha = 0.72 * starTwinkleCosmos;
      coreSizeScale = 0.85;
    }

    // ─── 7. FIVE-STAGE CONTINUOUS MORPHING (ACT 1 ➔ ACT 2 ➔ ACT 3 ➔ ACT 4 ➔ ACT 5 ➔ ACT 6) ───
    // Stage 1: Timeline ➔ Nebula [uProgress ~0.08 to ~0.24]
    float particleDelay1 = (aRadius * 0.06) + (sin(aStrandIndex * 1.2 + aColorSeed * 3.14159) * 0.03);
    float pStart1 = clamp(0.08 + particleDelay1, 0.05, 0.14);
    float pEnd1   = clamp(pStart1 + 0.14, 0.20, 0.28);
    float rawT1   = clamp((uProgress - pStart1) / (pEnd1 - pStart1), 0.0, 1.0);
    float pT1     = rawT1 * rawT1 * rawT1 * (rawT1 * (rawT1 * 6.0 - 15.0) + 10.0);

    float arcPeak1 = sin(pT1 * 3.14159265);
    vec3 gentleLoft1 = vec3(
      sin(pT1 * 1.8 + aStrandIndex * 0.2) * (arcPeak1 * 0.12),
      cos(pT1 * 1.6 + aProgress * 1.5) * (arcPeak1 * 0.10),
      sin(aColorSeed * 3.14 + pT1) * (arcPeak1 * 0.14)
    );
    vec3 pos12 = mix(posTimeline, posNebula, pT1) + gentleLoft1;

    // Stage 2: Nebula ➔ 3D Trefoil Knot [uProgress ~0.26 to ~0.42]
    float particleDelay2 = (aColorSeed * 0.06) + (cos(aStrandIndex * 1.4) * 0.03);
    float pStart2 = clamp(0.26 + particleDelay2, 0.23, 0.32);
    float pEnd2   = clamp(pStart2 + 0.14, 0.38, 0.46);
    float rawT2   = clamp((uProgress - pStart2) / (pEnd2 - pStart2), 0.0, 1.0);
    float pT2     = rawT2 * rawT2 * rawT2 * (rawT2 * (rawT2 * 6.0 - 15.0) + 10.0);

    float posT2 = min(pT2, 0.89);
    float arcPeak2 = sin(posT2 * 3.14159265);
    vec3 gentleLoft2 = vec3(
      sin(posT2 * 2.4 + aStrandIndex * 0.3 + uTime * 0.12) * (arcPeak2 * 0.28),
      cos(posT2 * 2.0 + aProgress * 2.2 + uTime * 0.10) * (arcPeak2 * 0.22),
      sin(aColorSeed * 4.0 + posT2 * 3.0 + uTime * 0.15) * (arcPeak2 * 0.32)
    );
    vec3 pos123 = mix(pos12, finalPosKnot, posT2) + gentleLoft2;

    // Stage 3: Trefoil Knot ➔ Loki Yggdrasil World Tree [uProgress ~0.45 to ~0.61]
    float particleDelay3 = (aColorSeed * 0.06) + (sin(aStrandIndex * 1.3) * 0.03);
    float pStart3 = clamp(0.45 + particleDelay3, 0.42, 0.51);
    float pEnd3   = clamp(pStart3 + 0.14, 0.57, 0.65);
    float rawT3   = clamp((uProgress - pStart3) / (pEnd3 - pStart3), 0.0, 1.0);
    float pT3     = rawT3 * rawT3 * rawT3 * (rawT3 * (rawT3 * 6.0 - 15.0) + 10.0);

    float arcPeak3 = sin(pT3 * 3.14159265);
    vec3 gentleLoft3 = vec3(
      sin(pT3 * 2.2 + aStrandIndex * 0.3 + uTime * 0.10) * (arcPeak3 * 0.35),
      cos(pT3 * 1.8 + aProgress * 2.0 + uTime * 0.08) * (arcPeak3 * 0.25),
      sin(aColorSeed * 3.5 + pT3 * 2.5 + uTime * 0.12) * (arcPeak3 * 0.35)
    );
    vec3 pos1234 = mix(pos123, finalPosTree, pT3) + gentleLoft3;

    // Stage 4: Loki Yggdrasil World Tree ➔ 3D Double Helix DNA [uProgress ~0.64 to ~0.80]
    float particleDelay4 = (aRadius * 0.06) + (cos(aColorSeed * 4.0) * 0.03);
    float pStart4 = clamp(0.64 + particleDelay4, 0.61, 0.70);
    float pEnd4   = clamp(pStart4 + 0.14, 0.76, 0.84);
    float rawT4   = clamp((uProgress - pStart4) / (pEnd4 - pStart4), 0.0, 1.0);
    float pT4     = rawT4 * rawT4 * rawT4 * (rawT4 * (rawT4 * 6.0 - 15.0) + 10.0);

    float arcPeak4 = sin(pT4 * 3.14159265);
    vec3 gentleLoft4 = vec3(
      sin(pT4 * 2.5 + aStrandIndex * 0.3 + uTime * 0.12) * (arcPeak4 * 0.32),
      cos(pT4 * 2.1 + aProgress * 2.2 + uTime * 0.10) * (arcPeak4 * 0.24),
      sin(aColorSeed * 3.8 + pT4 * 2.8 + uTime * 0.14) * (arcPeak4 * 0.32)
    );
    vec3 pos12345 = mix(pos1234, finalPosDNA, pT4) + gentleLoft4;

    // Stage 5: 3D Double Helix DNA ➔ Chronos Singularity Reactor Core [uProgress ~0.82 to ~0.97]
    float particleDelay5 = (aColorSeed * 0.06) + (sin(aStrandIndex * 1.5) * 0.03);
    float pStart5 = clamp(0.82 + particleDelay5, 0.79, 0.87);
    float pEnd5   = clamp(pStart5 + 0.13, 0.92, 0.98);
    float rawT5   = clamp((uProgress - pStart5) / (pEnd5 - pStart5), 0.0, 1.0);
    float pT5     = rawT5 * rawT5 * rawT5 * (rawT5 * (rawT5 * 6.0 - 15.0) + 10.0);

    float arcPeak5 = sin(pT5 * 3.14159265);
    vec3 gentleLoft5 = vec3(
      sin(pT5 * 2.8 + aStrandIndex * 0.35 + uTime * 0.15) * (arcPeak5 * 0.35),
      cos(pT5 * 2.4 + aProgress * 2.0 + uTime * 0.12) * (arcPeak5 * 0.25),
      sin(aColorSeed * 4.2 + pT5 * 3.0 + uTime * 0.16) * (arcPeak5 * 0.35)
    );
    vec3 pos = mix(pos12345, finalPosCore, pT5) + gentleLoft5;

    // High-energy pulses (Acts 1 & 2)
    float pulsePhase = fract(uTime * 0.35 - t * 1.2 + aStrandIndex * 0.08);
    float photonPulse = exp(-pow((pulsePhase - 0.5) * 7.0, 2.0)) * (1.0 - pT1 * 0.7);

    // ─── 7. VENGEANCE-UI INTERACTIVE TOUCH TRAIL & FLUID SCATTER ─────────────
    vec4 baseClip = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vec2 screenUv = (baseClip.xy / baseClip.w) * 0.5 + 0.5;

    float touch = 0.0;
    if (screenUv.x >= 0.0 && screenUv.x <= 1.0 && screenUv.y >= 0.0 && screenUv.y <= 1.0) {
      touch = texture2D(uTouch, screenUv).r;
    }

    float scatterDist = touch * 0.75 * (0.75 + aSpeed * 0.25);
    float scatterZ = touch * 0.50 * sin(aAngle * 3.0);

    pos.x += cos(aAngle) * scatterDist;
    pos.y += sin(aAngle) * scatterDist;
    pos.z += scatterZ;

    // ─── 8. BASE COLOR SEED ──────────────────────────────────────────────────
    vec3 col = cEmerald;
    if (aColorSeed > 0.82) {
      col = cWhite;
    } else if (aColorSeed > 0.60) {
      col = cAmber;
    } else if (aColorSeed > 0.45) {
      col = cCyan;
    }

    // Act 1 pinch node core heat
    float heat = (1.0 - pinchFactor) * (1.0 - pT1);
    col = mix(col, cWhite, heat * 0.55);

    // Act 2 warm golden embers in nebula
    vec3 nebulaCol = mix(cEmerald, cAmber, 0.35 + aColorSeed * 0.4);
    if (aColorSeed > 0.82) {
      nebulaCol = mix(nebulaCol, cCyan, 0.50);
    }
    col = mix(col, nebulaCol, pT1 * 0.65);

    // ── ACT 3: CYBERNETIC CHROMATIC FLOW & DEPTH LIGHTING ───────────────────
    vec3 act3Col;
    float fFlow = 0.0;
    if (flowProgress < 0.25) {
      fFlow = smoothstep(0.0, 1.0, flowProgress / 0.25);
      act3Col = mix(cEmerald, cMint, fFlow);
    } else if (flowProgress < 0.50) {
      fFlow = smoothstep(0.0, 1.0, (flowProgress - 0.25) / 0.25);
      act3Col = mix(cMint, cCyan, fFlow);
    } else if (flowProgress < 0.75) {
      fFlow = smoothstep(0.0, 1.0, (flowProgress - 0.50) / 0.25);
      act3Col = mix(cCyan, cGold, fFlow);
    } else {
      fFlow = smoothstep(0.0, 1.0, (flowProgress - 0.75) / 0.25);
      act3Col = mix(cAmber, cEmerald, fFlow);
    }

    // View space normal for cylindrical tube surface lighting
    vec3 viewNormal = normalize((modelViewMatrix * vec4(finalNormKnot, 0.0)).xyz);
    float NdotV = clamp(viewNormal.z, -1.0, 1.0);

    float specular = pow(max(0.0, NdotV), 3.0);
    act3Col = mix(act3Col, cWhite, specular * 0.42);

    if (aAct3Role > 0.5 && aAct3Role < 1.5) {
      act3Col = mix(act3Col, cWhite, 0.45);
    }

    float knotPhoton = fract(uTime * 0.35 - flowProgress * 2.0);
    float pulseKnot = exp(-pow((knotPhoton - 0.5) * 8.0, 2.0));
    act3Col = mix(act3Col, cWhite, pulseKnot * 0.75);

    col = mix(col, act3Col, pT2);
    col = mix(col, cWhite, photonPulse * 0.55 * (1.0 - pT2));

    // ── ACT 4: LOKI MULTIVERSE YGGDRASIL CHROMATICS ──────────────────────────
    // Continuous upward flowing temporal waves of energy through roots -> trunk -> boughs -> foliage
    float upwardWave = fract(uTime * 0.28 - aFlowT * 1.8 + aBranchId * 0.06);
    float energyPulse = exp(-pow((upwardWave - 0.5) * 8.0, 2.0));

    vec3 act4Col = cEmerald;

    // Palette mapping based on aColorType (from botanical procedural generator):
    // 0.0: Rich Golden Amber / Gold (#f59e0b, #fbbf24) - outer flank lobes & root tips
    // 1.0: Radiant Emerald / Lime (#10b981, #059669) - trunk vines, boughs & core canopy
    // 2.0: Electric Cyan / Sky Blue (#06b6d4, #38bdf8) - crown canopy & upper branch tips
    // 3.0: Incandescent Pure White Spark (#ffffff) - core conduit & stardust stars
    if (aColorType < 0.5) {
      act4Col = mix(cAmber, cGold, aColorSeed);
      act4Col = mix(act4Col, cLime, 0.22 * sin(uTime * 2.0 + aBranchId));
    } else if (aColorType < 1.5) {
      act4Col = mix(cDarkRoot, cEmerald, clamp(aFlowT * 1.25, 0.0, 1.0));
      act4Col = mix(act4Col, cMint, 0.35 * aColorSeed);
    } else if (aColorType < 2.5) {
      act4Col = mix(cCyan, cSky, aColorSeed);
      act4Col = mix(act4Col, cMint, 0.20);
    } else {
      act4Col = mix(cWhite, cGold, 0.15 * sin(uTime * 3.0 + aFlowT));
    }

    // Layer-specific lighting, shimmers, and upward pulse excitation
    if (aTreeRole < 0.5) {
      // ──── TRUNK (Layer 0) ────
      act4Col = mix(act4Col, cWhite, energyPulse * 0.35);
      float strandShimmer = sin(uTime * 3.0 + aBranchId * 0.8) * 0.2 + 0.8;
      act4Col *= strandShimmer;

    } else if (aTreeRole < 1.5) {
      // ──── ROOTS (Layer 1) ────
      act4Col = mix(act4Col, cLime, energyPulse * 0.35);
      act4Col = mix(cDarkRoot * 0.75, act4Col, aFlowT * 0.8 + 0.2);

    } else if (aTreeRole < 2.5) {
      // ──── BOUGHS & SPREADING LIMBS (Layer 2) ────
      act4Col = mix(act4Col, cWhite, energyPulse * 0.40);

    } else if (aTreeRole < 3.5) {
      // ──── LUSH CANOPY FOLIAGE & STARDUST DOME (Layer 3) ────
      float leafTwinkle = sin(uTime * 3.2 + aBranchId * 1.5 + aColorSeed * 6.28) * 0.28 + 0.72;
      act4Col *= leafTwinkle;
      if (aColorType < 0.5) {
        act4Col = mix(act4Col, cGold, 0.30 * sin(uTime * 2.5 + aFlowT * 3.0));
      } else if (aColorType > 1.5 && aColorType < 2.5) {
        act4Col = mix(act4Col, cWhite, 0.25 * sin(uTime * 3.0 + aBranchId));
      }
      act4Col = mix(act4Col, cWhite, energyPulse * 0.45);

    } else {
      // ──── AMBIENT EMBERS (Layer 4) ────
      float emberTwinkle = sin(uTime * 4.0 + aFlowT * 6.28) * 0.35 + 0.65;
      act4Col *= emberTwinkle;
    }

    // Blend smoothly into Act 4 color, Act 5 DNA color, and Act 6 Singularity color
    col = mix(col, act4Col, pT3);
    col = mix(col, act5Col, pT4);
    col = mix(col, act6Col, pT5);

    // VengeanceUI Starlight excitation & diamond luminescence
    if (touch > 0.01) {
      col = mix(col, cWhite, touch * 0.55);
      vec3 touchColor = mix(vec3(0.0, 0.95, 0.8), vec3(1.0, 0.90, 0.4), aColorSeed);
      col += touchColor * (touch * 0.25);
    }

    vColor = col;

    // ─── 8. ALPHA HANDLING & 3D DEPTH OCCLUSION ─────────────────────────────
    float edgeFade = smoothstep(1.0, 0.84, abs(t));
    float alpha12 = mix(edgeFade * (0.75 + heat * 0.25), 0.90, pT1);

    // Screen projection & camera depth
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float depthDist = -mvPosition.z;
    float depthZ = clamp((13.2 - depthDist) / 3.4, 0.0, 1.0);

    // Act 3: Front-vs-back normal attenuation & camera depth separation
    float frontBackAlpha = mix(0.42, 0.98, clamp(NdotV * 0.5 + 0.5, 0.0, 1.0));
    float depthAlpha = mix(0.35, 1.0, depthZ);
    float knotAlpha = frontBackAlpha * depthAlpha;

    if (aAct3Role > 1.5) {
      float twinkle = sin(uTime * 4.0 + aColorSeed * 6.28) * 0.25 + 0.75;
      knotAlpha *= 0.65 * twinkle;
    }

    float alpha123 = mix(alpha12, knotAlpha, pT2);

    // Act 4: Living Multiverse World Tree alpha & crystalline twinkle
    float treeDepthZ = clamp((14.0 - (-mvPosition.z)) / 4.0, 0.0, 1.0);
    float treeAlpha = mix(0.72, 1.0, treeDepthZ);

    // Individual twinkling for stardust foliage & embers
    if (aTreeRole > 2.5) {
      float stardustTwinkle = sin(uTime * 3.5 + aColorSeed * 12.56 + aBranchId) * 0.18 + 0.82;
      treeAlpha *= stardustTwinkle;
    }
    float alpha1234 = mix(alpha123, treeAlpha, pT3);
    float alpha12345 = mix(alpha1234, dnaAlpha, pT4);
    vAlpha = mix(alpha12345, coreAlpha, pT5) + touch * 0.22;

    // ─── 9. SCREEN PROJECTION & SIZE ATTENUATION ─────────────────────────────
    float actBaseSize = mix(uBaseSize, uBaseSize * 1.35, pT1);
    actBaseSize = mix(actBaseSize, uBaseSize * 1.30, pT2);

    float roleSize = 1.0;
    if (aAct3Role < 0.5) {
      roleSize = 1.05;
    } else if (aAct3Role < 1.5) {
      roleSize = 1.25;
    } else {
      roleSize = 0.75;
    }

    float depthSize = mix(0.72, 1.30, depthZ);

    float sizeMultiplierAct3 = actBaseSize * aSize * uPixelRatio * mix(1.0, roleSize * depthSize, pT2)
      + touch * 2.5 * uPixelRatio
      + photonPulse * 5.0 * uPixelRatio * (1.0 - pT2)
      + pulseKnot * 3.5 * uPixelRatio * pT2;

    // Act 4 Point sizing (scaled up to match majestic world tree volume):
    float treePointScale = 1.0;
    if (aTreeRole < 0.5) {
      // Trunk core cables: prominent braided conduits
      treePointScale = (aColorType > 2.5) ? 1.85 : 1.55;
    } else if (aTreeRole < 1.5) {
      // Roots: sinuous taproots
      treePointScale = (aColorType < 0.5) ? 1.35 : 1.55;
    } else if (aTreeRole < 2.5) {
      // Bough conduits: glowing skeleton
      treePointScale = 1.65;
    } else if (aTreeRole < 3.5) {
      // Canopy foliage: fine crystalline stardust with bright diamond stars
      treePointScale = (aColorType > 2.5) ? 2.20 : 1.35;
    } else {
      // Floating embers
      treePointScale = 1.40;
    }

    float act4BaseSize = uBaseSize * 1.55 * treePointScale * uPixelRatio;
    float sizeMultiplierAct4 = mix(sizeMultiplierAct3, act4BaseSize, pT3);
    float act5BaseSize = uBaseSize * 1.15 * dnaSizeScale * uPixelRatio;
    float sizeMultiplierAct5 = mix(sizeMultiplierAct4, act5BaseSize, pT4);
    float act6BaseSize = uBaseSize * 1.05 * coreSizeScale * uPixelRatio;
    float finalSizeMultiplier = mix(sizeMultiplierAct5, act6BaseSize, pT5);
    float depth = max(-mvPosition.z, 0.5);
    gl_PointSize = clamp(finalSizeMultiplier / depth, 1.5, 40.0);
  }
`;

export const act1FragmentShader = /* glsl */ `
  precision mediump float;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    if (vAlpha <= 0.001) {
      discard;
    }

    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);

    if (dist > 0.5) {
      discard;
    }

    // Dual-lobe Gaussian profile: soft luminous halo + brilliant incandescent core
    float halo = exp(-dist * dist * 14.0);
    float core = exp(-dist * dist * 60.0);

    vec3 hotColor = vColor + vec3(0.28) * core;
    float alpha = halo * vAlpha;

    gl_FragColor = vec4(hotColor, alpha);
  }
`;
