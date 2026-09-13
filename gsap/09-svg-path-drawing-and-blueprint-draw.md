# SVG Path Drawing & Architectural Blueprint Reveals

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/gsap/09-svg-path-drawing-and-blueprint-draw.md`  
> **Target:** Hardware-Accelerated SVG Path Drawing, Radar Charts, and Hairline CAD Grids  

---

## 1. Pure SVG Path Drawing Mechanics (No Paid Plugins Required)

While GSAP offers a commercial `DrawSVGPlugin`, pure SVG path drawing is 100% native in modern browsers using `stroke-dasharray` and `stroke-dashoffset`.

### The Physics of Stroke Dash Manipulation:
1. An SVG `<path>` has a total arc length $L = \text{path.getTotalLength()}$.
2. If we set `strokeDasharray: L` and `strokeDashoffset: L`, the dash is pushed completely out of view, rendering the path invisible.
3. As `strokeDashoffset` transitions from $L \to 0$, the path progressively "draws" onto the screen like an ink pen on a drafting table.

---

## 2. The Modern `pathLength="1"` Zero-JS Shortcut

In SVG 2.0 (supported in Chrome, Firefox, Safari, Edge), setting `pathLength="1"` on an SVG element normalizes the path length to `1.0`. 

This eliminates the need to measure `getTotalLength()` in JavaScript:

```html
<path
  d="M 10 10 L 200 10 L 200 200 Z"
  pathLength="1"
  stroke="#10B981"
  stroke-width="1"
  fill="none"
  class="cad-radar-path"
/>
```

```typescript
import gsap from 'gsap';

// Instant path draw-on without measuring length!
gsap.fromTo(
  '.cad-radar-path',
  { strokeDasharray: 1, strokeDashoffset: 1 },
  {
    strokeDashoffset: 0,
    duration: 1.4,
    ease: 'power2.inOut',
  }
);
```

---

## 3. Application in Traceon: `CURISMRadar.tsx` & `CADDivider.tsx`

1. **CURISM Hexagonal Radar Blossom**:
   - The 6 structural axes draw outward from the center coordinate $(150, 150)$ simultaneously using `stagger: 0.05`.
   - The outer perimeter polygon draws clockwise with `strokeDashoffset: 1 -> 0`.
   - Once the boundary completes, the translucent green fill (`#10B981/15`) fades in.
2. **CAD Hairline Dividers**:
   - Dividers draw horizontally from left to right using `scaleX: 0 -> 1` or SVG stroke offset, followed by the appearance of the coordinate tick marks.
