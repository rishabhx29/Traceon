# Lenis Snap & CAD Anchor Alignment Manual

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/lenis/05-lenis-snap-and-cad-anchors.md`  
> **Target:** Section Snapping, Proximity Thresholds, and Architectural Panel Alignment  

---

## 1. Concept: Architectural Snap Alignment

In technical CAD drafting tools, objects snap to a modular grid when brought close to guidelines. Similarly, in Traceon:
- Casual vertical browsing remains fluid and unrestricted.
- However, when scroll velocity falls below a threshold near a major milestone panel (like the **Feature Matrix** or **Architecture Journey**), the viewport gently and precisely snaps into perfect alignment.

---

## 2. Using the `lenis/snap` Module

Lenis includes a dedicated snap module available via `lenis/snap` (or `lenis/dist/lenis-snap.mjs`):

```typescript
import Snap from 'lenis/snap';
import type Lenis from 'lenis';

export function initializeCADSectionSnapping(lenis: Lenis) {
  const snap = new Snap(lenis, {
    type: 'proximity',          // 'proximity' allows free scrolling; 'mandatory' locks to stops
    distance: 140,              // Snap activates when within 140px of a target anchor
    velocityThreshold: 0.4,     // Only snaps when user has nearly stopped scrolling
    duration: 0.6,              // Fast, decisive 600ms snap duration
    easing: (t: number) => 1 - Math.pow(1 - t, 3), // power3.out cubic ease
  });

  // Register all sections with the data-snap-anchor attribute
  document.querySelectorAll('[data-snap-anchor]').forEach((el) => {
    snap.addElement(el as HTMLElement);
  });

  return snap;
}
```

---

## 3. HTML Markup Integration Pattern

To mark a CAD panel or section as an alignment anchor:

```html
<!-- Section 1: Hero -->
<section data-snap-anchor class="min-h-screen">
  <!-- Content -->
</section>

<!-- Section 2: Architecture Journey -->
<section data-snap-anchor class="min-h-screen">
  <!-- Content -->
</section>

<!-- Section 3: Feature Matrix -->
<section data-snap-anchor class="min-h-screen">
  <!-- Content -->
</section>
```

---

## 4. Proximity vs Mandatory Snapping Rules

| Mode | Behavior | Use Case in Traceon |
|:---|:---|:---|
| **Proximity** | User can scroll past if scrolling with momentum; viewport only snaps if stopping nearby. | ✅ **Standard for Landing Page Sections** |
| **Mandatory** | Viewport is strictly forced to rest on an anchor; impossible to stop in-between. | ⚠️ **Use only inside horizontal sliders** |
