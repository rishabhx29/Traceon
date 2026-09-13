# Kinetic Typography, Scramble Ciphers & Variable Proximity

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/gsap/10-kinetic-typography-and-scramble-text.md`  
> **Target:** Technical Monospace Ciphers, Telemetry Decoding, and Variable Typography  

---

## 1. Concept: Industrial Decryption Typography

In avionics and mission-critical diagnostics, incoming telemetry feeds do not simply fade in like a generic marketing landing page. Data arrives as raw encrypted packets that **resolve progressively into alphanumeric characters**.

In Traceon, this effect is applied to:
- Commit hashes in `CommitScrubber.tsx` (`0x7a4...`).
- Cyclomatic complexity metrics in `CustomNode.tsx` and `NodeDetailSidecar.tsx`.
- Milestone titles in `ArchitectureJourney.tsx`.

---

## 2. Pure TypeScript Scramble Cipher Engine (No Paid Plugins)

```typescript
export interface ScrambleOptions {
  targetText: string;
  durationMs?: number;
  cipherChars?: string;
  onUpdate: (currentText: string) => void;
  onComplete?: () => void;
}

const DEFAULT_CIPHER = '0123456789ABCDEF_#<>[]/*';

/**
 * Scrambles and progressively resolves text into the final string.
 */
export function scrambleText({
  targetText,
  durationMs = 800,
  cipherChars = DEFAULT_CIPHER,
  onUpdate,
  onComplete,
}: ScrambleOptions): () => void {
  const length = targetText.length;
  const startTime = performance.now();
  let animId: number;

  function tick(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(1.0, elapsed / durationMs);

    // Number of characters already resolved to final text
    const resolvedCount = Math.floor(progress * length);

    let output = '';
    for (let i = 0; i < length; i++) {
      if (i < resolvedCount) {
        // Solved character
        output += targetText[i];
      } else if (targetText[i] === ' ') {
        output += ' ';
      } else {
        // Random cipher glyph
        const randomGlyph = cipherChars[Math.floor(Math.random() * cipherChars.length)];
        output += randomGlyph;
      }
    }

    onUpdate(output);

    if (progress < 1.0) {
      animId = requestAnimationFrame(tick);
    } else {
      onUpdate(targetText);
      onComplete?.();
    }
  }

  animId = requestAnimationFrame(tick);

  // Return cancel function
  return () => cancelAnimationFrame(animId);
}
```

---

## 3. React Hook Integration: `useScrambleText`

```tsx
'use client';

import { useState, useEffect } from 'react';
import { scrambleText } from './scrambleText';

export function useScrambleText(targetText: string, trigger = true) {
  const [displayText, setDisplayText] = useState(targetText);

  useEffect(() => {
    if (!trigger) return;

    const cancel = scrambleText({
      targetText,
      durationMs: 700,
      onUpdate: (txt) => setDisplayText(txt),
    });

    return cancel;
  }, [targetText, trigger]);

  return displayText;
}
```
