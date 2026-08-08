# Lore Documentary Motion System

A generated motion design system for editorial game-lore documentary in the
register of Vox / Johnny Harris / Lemmino: evidence on screen, narration-led
pacing, no gamer chrome.

Four genre systems share **one spatial grammar and one beat schedule**.
Everything that differs — palette, type pairing, easing physics, panel
geometry, drift amplitude — is a token in `build.mjs → GENRES`. The ruleset is
data; each composition is its projection. Change a token, regenerate, re-check.

```bash
node projects/lore-doc-system/build.mjs   # regenerate all four
```

Each genre renders one **24s composition = three 8s chapters**, so all four
genres × all three evidence archetypes exist (12 chapter scenes total).

---

## 1. Colour — strict 60-30-10

`base` is the canvas, `structure` carries headline + panel frame + rails,
`focal` is spent only on the single thing the viewer must look at. Focal never
appears twice in one frame except as the sweep and its target.

| Genre            | 60% Base  | 30% Structure | 10% Focal | Panel     | Muted     |
| ---------------- | --------- | ------------- | --------- | --------- | --------- |
| Dark Fantasy RPG | `#0D131D` | `#F59E0B`     | `#00E5FF` | `#151D2A` | `#94A3B8` |
| Sci-Fi Cyberpunk | `#07090F` | `#FF2E88`     | `#00F0FF` | `#0E1420` | `#8FA3BF` |
| Post-Apocalyptic | `#14100D` | `#D4823F`     | `#7FE3A1` | `#1E1813` | `#A89684` |
| Retro Pixel      | `#12102A` | `#FFC93C`     | `#4DE1FF` | `#1C1940` | `#A9A3D9` |

All four pass **70/70 WCAG AA** text checks under `hyperframes check`.

> Post-apocalyptic structure was lifted from `#C2703A` to `#D4823F` — the
> original measured 4.87:1 on base, too close to the 4.5:1 floor to survive
> the vignette. Muted key text on the focal-tinted anomaly row measured
> 4.31:1 and was promoted to `text`.

## 2. Typography

One editorial voice, one functional voice. The editorial font carries headline
and archival quote; the functional font carries every coordinate, timestamp,
catalog tag and verdict.

| Genre            | Editorial                 | Functional | Headline treatment   |
| ---------------- | ------------------------- | ---------- | -------------------- |
| Dark Fantasy RPG | EB Garamond 400 · 72px    | Inter      | mixed case, `-0.5px` |
| Sci-Fi Cyberpunk | JetBrains Mono 700 · 54px | Inter      | mixed case, `-1.5px` |
| Post-Apocalyptic | Oswald 600 · 68px         | Inter      | UPPERCASE, `+0.5px`  |
| Retro Pixel      | Archivo Black 400 · 52px  | Space Mono | UPPERCASE, `-0.5px`  |

Families are named so the producer auto-resolves them and injects
deterministic `@font-face` rules. **No external font `<link>`** — a raw
`fonts.googleapis.com` request blocks page load and fails the runtime gate.
Only families in the framework's auto-resolved list are usable; Spectral and
Georgia are not (Georgia silently aliases to EB Garamond).

## 3. Kinetic physics — easing matched to mood

| Genre            | Hero         | Secondary      | Sweep          | Pop             | Feel                             |
| ---------------- | ------------ | -------------- | -------------- | --------------- | -------------------------------- |
| Dark Fantasy RPG | `power4.out` | `power3.out`   | `power2.inOut` | `back.out(2.2)` | slow, ceremonial, long settle    |
| Sci-Fi Cyberpunk | `expo.out`   | `power2.inOut` | `power2.inOut` | `back.out(1.7)` | sharp, servo-precise             |
| Post-Apocalyptic | `power3.out` | `power2.out`   | `power1.inOut` | `power3.out`    | weighty, grinding, **no bounce** |
| Retro Pixel      | `steps(6)`   | `steps(4)`     | `steps(8)`     | `steps(3)`      | staccato, quantised, anti-smooth |

Entrance duration and stagger scale with the mood: fantasy `0.85s / 0.11s`,
cyberpunk `0.60s / 0.07s`, salvage `0.78s / 0.10s`, pixel `0.50s / 0.09s`.

Post-apocalyptic deliberately has **no overshoot ease anywhere** — nothing in a
dead world springs back. Retro Pixel is the inverse of the usual advice: its
steps eases exist to _destroy_ smoothness.

## 4. Parallax — three layers, three rates

Depth comes from rate difference, not from blur. All three run the full length
of their scene so no frame is ever static.

| Layer          | Element                             | Motion                                             |
| -------------- | ----------------------------------- | -------------------------------------------------- |
| 1 · Background | `#plate` wash + survey grid         | scale + x-pan, **continuous across all 24s**       |
| 2 · Midground  | `.mid` (narrative + evidence panel) | x-drift, per chapter                               |
| 3 · Foreground | `.foreground` (HUD readout)         | x-drift, **opposite direction**, largest amplitude |

| Genre            | BG scale | BG x  | Mid x | FG x  |
| ---------------- | -------- | ----- | ----- | ----- |
| Dark Fantasy RPG | +9%      | −26px | −11px | +19px |
| Sci-Fi Cyberpunk | +6%      | −34px | −15px | +26px |
| Post-Apocalyptic | +7.5%    | −20px | −9px  | +15px |
| Retro Pixel      | +5%      | −16px | −8px  | +22px |

The background plate is sized `116%` at `-8%` offset so the drift never
exposes an edge; that overflow is marked `data-layout-allow-overflow`.

## 5. Spatial rules

| Genre            | Pad X | Gutter | Panel pad | Panel radius    | Spine |
| ---------------- | ----- | ------ | --------- | --------------- | ----- |
| Dark Fantasy RPG | 128   | 96     | 48        | `0 10px 10px 0` | 4px   |
| Sci-Fi Cyberpunk | 112   | 88     | 44        | `2px`           | 3px   |
| Post-Apocalyptic | 136   | 100    | 46        | `0 4px 4px 0`   | 5px   |
| Retro Pixel      | 120   | 104    | 42        | `0`             | 6px   |

- Two columns, `1fr 1fr`: narrative left, evidence right.
- The evidence panel carries a **structure-coloured spine** on its leading
  edge that scales down from the top — the panel reads as _opening_, not
  sliding.
- Figure SVGs use a `viewBox` matching the panel's computed inner width **1:1**
  so strokes and labels never distort, and nothing crosses the panel's
  `overflow: hidden` edge.

## 6. Eyesweep — show, don't tell

Nothing arrives all at once. Each chapter runs a fixed 8s beat schedule, and
the sweep is deliberately **late** — the eye is walked through the evidence
before the proof phrase is named.

| t (rel.) | Beat                                               |
| -------- | -------------------------------------------------- |
| 0.20     | Chapter eyebrow + focal dot                        |
| 0.45     | Headline, per-line mask reveal (staggered)         |
| 1.15     | Divider wipes from left                            |
| 1.40     | Body copy                                          |
| 2.00     | Evidence panel enters, spine draws                 |
| 2.75     | Evidence elements stagger in                       |
| 3.30     | Rail / bracket / mark draws via `strokeDashoffset` |
| 3.90     | **Focal element resolves** — the anomaly           |
| 4.85     | **Highlight sweep crosses the proof phrase**       |
| 5.45     | Verdict line lands                                 |
| 5.80     | HUD readout                                        |

The sweep is a sized block child scaled from `left center` beneath the text,
never a `background-color` tween — that keeps it on the animatable-property
allowlist and lets the fill and its underline arrive together.

### Evidence archetypes

| Chapter                   | Figure                               | The contradiction                            |
| ------------------------- | ------------------------------------ | -------------------------------------------- |
| 01 Timeline Anomaly       | horizontal chronology rail, 6 nodes  | one node lifted off the rail in focal colour |
| 02 Map / Depth Evidence   | stratigraphic column + depth bracket | a band that should not exist at 9.4 m        |
| 03 Item Description Proof | item record, 4 attribute rows        | the last row contradicts the three above it  |

## 7. Framework contract (non-negotiable)

- **One paused timeline** per composition, registered on
  `window.__timelines["main"]` — the key must equal the root's
  `data-composition-id`. An empty-string key never binds and renders a static
  frame.
- **Scene fill on a full-bleed child**, never on the composition root — the
  producer's frame compositing can drop the root's own background and render
  black even when preview looks correct.
- **GSAP is vendored** to `assets/gsap.min.js`. The determinism contract bans
  render-time network fetches, and a blocked CDN yields `gsap is not defined`.
- Inactive clips are hidden via `visibility`, **not removed from the DOM**, so
  GSAP selectors in later chapters resolve at build time.
- A `from` tween records the target's state **at build time** as its END
  value. Two `from` tweens on one element therefore collapse it: the first
  sets `scaleX: 0.001` on immediateRender, and the second animates _to_
  `0.001`. The stagger group must always exclude the focal element — this is
  why `FIG_BEATS` uses `:not(.fig-node-anomaly)`.
- Every comma-separated selector must be scoped per chapter. Scoping only the
  first lets the rest match sibling chapters.
- Headline lines are split one-per-mask with `white-space: nowrap`; a wrap
  inside a mask breaks the reveal.

## 8. Verification

```bash
cd projects/lore-doc-system/<genre>
npx hyperframes check                      # lint + runtime + layout + motion + contrast
npx hyperframes snapshot --at 6.5,14.5,22.5
npx hyperframes render
```

All four: **0 errors** across lint, runtime, layout and motion; **70/70** text
checks pass WCAG AA.

> Gates are necessary but not sufficient. The missing anomaly node and the
> off-genre item copy both passed every gate and were caught only by looking
> at snapshots. Always eyeball frames.
