#!/usr/bin/env node
/**
 * Lore Documentary Motion System — composition generator.
 *
 * Emits one HyperFrames project per genre. Each project is a 24s composition
 * running the three documentary chapters (timeline anomaly / map evidence /
 * item proof) as sequential 8s scenes on a single track.
 *
 * The four genres share one spatial grammar and one beat schedule; everything
 * that differs — palette, type pairing, easing physics, panel geometry, drift
 * amplitude — is a token in GENRES below. That is the "design system": the
 * ruleset is data, the composition is its projection.
 *
 *   node projects/lore-doc-system/build.mjs
 */

import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, "..", "..");
const GSAP_SRC = join(REPO, "node_modules/.bun/gsap@3.15.0/node_modules/gsap/dist/gsap.min.js");

const FRAME_W = 1920;
const FRAME_H = 1080;
const CHAPTER_LEN = 8;
const FIG_H = 250;

/* ── Genre token table ───────────────────────────────────────────────────
   Every genre defines the same shape. Contrast of `structure`, `focal`,
   `text` and `muted` against `base`/`panel` is verified by
   `hyperframes check` (WCAG AA) — do not lower these without re-running it.
─────────────────────────────────────────────────────────────────────────── */
const GENRES = [
  {
    id: "dark-fantasy",
    title: "Dark Fantasy RPG",
    palette: {
      base: "#0d131d",
      panel: "#151d2a",
      structure: "#f59e0b",
      focal: "#00e5ff",
      text: "#f8fafc",
      muted: "#94a3b8",
      line: "rgba(148, 163, 184, 0.16)",
      grid: "rgba(148, 163, 184, 0.055)",
      wash1: "rgba(245, 158, 11, 0.13)",
      wash2: "rgba(0, 229, 255, 0.07)",
      vignette: "rgba(5, 8, 13, 0.72)",
      sweepFill: "rgba(0, 229, 255, 0.16)",
    },
    type: {
      display: '"EB Garamond", serif',
      displayWeight: 400,
      displaySize: 72,
      displayTracking: "-0.5px",
      displayTransform: "none",
      meta: '"Inter", system-ui, sans-serif',
      metaWeight: 600,
      metaTracking: "4.5px",
      quoteStyle: "italic",
      quoteSize: 27,
    },
    /* Fantasy: slow, heavy, ceremonial. Long exponential settles. */
    ease: {
      hero: "power4.out",
      secondary: "power3.out",
      sweep: "power2.inOut",
      pop: "back.out(2.2)",
    },
    tempo: { in: 0.85, stagger: 0.11 },
    spatial: { padX: 128, padY: 132, gap: 96, panelPad: 48, radius: "0 10px 10px 0", spine: 4 },
    drift: { scale: 0.09, bgX: -26, midX: -11, fgX: 19 },
  },

  {
    id: "sci-fi-cyberpunk",
    title: "Sci-Fi Cyberpunk",
    palette: {
      base: "#07090f",
      panel: "#0e1420",
      structure: "#ff2e88",
      focal: "#00f0ff",
      text: "#f2f7ff",
      muted: "#8fa3bf",
      line: "rgba(143, 163, 191, 0.18)",
      grid: "rgba(0, 240, 255, 0.05)",
      wash1: "rgba(255, 46, 136, 0.12)",
      wash2: "rgba(0, 240, 255, 0.09)",
      vignette: "rgba(2, 3, 7, 0.78)",
      sweepFill: "rgba(0, 240, 255, 0.18)",
    },
    type: {
      display: '"JetBrains Mono", ui-monospace, monospace',
      displayWeight: 700,
      displaySize: 54,
      displayTracking: "-1.5px",
      displayTransform: "none",
      meta: '"Inter", system-ui, sans-serif',
      metaWeight: 600,
      metaTracking: "5px",
      quoteStyle: "normal",
      quoteSize: 23,
    },
    /* Tech: sharp, mechanical, servo-precise. Short overshoot. */
    ease: {
      hero: "expo.out",
      secondary: "power2.inOut",
      sweep: "power2.inOut",
      pop: "back.out(1.7)",
    },
    tempo: { in: 0.6, stagger: 0.07 },
    spatial: { padX: 112, padY: 124, gap: 88, panelPad: 44, radius: "2px", spine: 3 },
    drift: { scale: 0.06, bgX: -34, midX: -15, fgX: 26 },
  },

  {
    id: "post-apocalyptic",
    title: "Post-Apocalyptic",
    palette: {
      base: "#14100d",
      panel: "#1e1813",
      structure: "#d4823f",
      focal: "#7fe3a1",
      text: "#f6f1ea",
      muted: "#a89684",
      line: "rgba(168, 150, 132, 0.2)",
      grid: "rgba(168, 150, 132, 0.05)",
      wash1: "rgba(212, 130, 63, 0.13)",
      wash2: "rgba(127, 227, 161, 0.06)",
      vignette: "rgba(6, 4, 3, 0.76)",
      sweepFill: "rgba(127, 227, 161, 0.16)",
    },
    type: {
      display: '"Oswald", system-ui, sans-serif',
      displayWeight: 600,
      displaySize: 68,
      displayTracking: "0.5px",
      displayTransform: "uppercase",
      meta: '"Inter", system-ui, sans-serif',
      metaWeight: 600,
      metaTracking: "3.6px",
      quoteStyle: "normal",
      quoteSize: 25,
    },
    /* Salvage: weighty, grinding, no bounce — nothing here springs back. */
    ease: {
      hero: "power3.out",
      secondary: "power2.out",
      sweep: "power1.inOut",
      pop: "power3.out",
    },
    tempo: { in: 0.78, stagger: 0.1 },
    spatial: { padX: 136, padY: 138, gap: 100, panelPad: 46, radius: "0 4px 4px 0", spine: 5 },
    drift: { scale: 0.075, bgX: -20, midX: -9, fgX: 15 },
  },

  {
    id: "retro-pixel",
    title: "Retro Pixel",
    palette: {
      base: "#12102a",
      panel: "#1c1940",
      structure: "#ffc93c",
      focal: "#4de1ff",
      text: "#fdfbff",
      muted: "#a9a3d9",
      line: "rgba(169, 163, 217, 0.22)",
      grid: "rgba(169, 163, 217, 0.06)",
      wash1: "rgba(255, 201, 60, 0.11)",
      wash2: "rgba(77, 225, 255, 0.08)",
      vignette: "rgba(4, 3, 14, 0.7)",
      sweepFill: "rgba(77, 225, 255, 0.2)",
    },
    type: {
      display: '"Archivo Black", system-ui, sans-serif',
      displayWeight: 400,
      displaySize: 52,
      displayTracking: "-0.5px",
      displayTransform: "uppercase",
      meta: '"Space Mono", ui-monospace, monospace',
      metaWeight: 700,
      metaTracking: "2.4px",
      quoteStyle: "normal",
      quoteSize: 22,
    },
    /* CRT: staccato. Stepped eases quantise motion to a coarse frame grid. */
    ease: {
      hero: "steps(6)",
      secondary: "steps(4)",
      sweep: "steps(8)",
      pop: "steps(3)",
    },
    tempo: { in: 0.5, stagger: 0.09 },
    spatial: { padX: 120, padY: 130, gap: 104, panelPad: 42, radius: "0px", spine: 6 },
    drift: { scale: 0.05, bgX: -16, midX: -8, fgX: 22 },
  },
];

/* ── Copy: 3 chapters per genre ──────────────────────────────────────────
   Chapter order is fixed across genres so the three evidence archetypes
   line up: 0 = timeline anomaly, 1 = map evidence, 2 = item proof.
─────────────────────────────────────────────────────────────────────────── */
const COPY = {
  "dark-fantasy": [
    {
      eyebrow: "Visual Evidence · Chapter 01",
      lines: ["The Regnal List", "Skips a Century"],
      body: "Nine kings are named between the Founding and the Ruin. Their reigns, summed from the coronation tablets, cover four hundred years — but the list is sold to us as three hundred.",
      byline: "Survey Archive · Sector 7",
      label: "Coronation Tablets",
      ref: "#031 / REGNAL",
      caption: "Fig. 1 — Reign lengths, Founding → Ruin",
      quotePre: "“And in the ninth year of the ninth king, ",
      quoteHi: "a hundred winters unnumbered",
      quotePost: ", the sky was quiet.”",
      verdict: "One reign is counted twice",
      readout: "TBL 031 · 9 REIGNS · Δ +100Y",
    },
    {
      eyebrow: "Visual Evidence · Chapter 02",
      lines: ["The Hidden Kingdom", "Below the Crater"],
      body: "In-game records place the city's fall in the First Age. The geological section tells a different story — an intact sub-layer, cut and dressed, laid down three centuries after the ruin above it.",
      byline: "Survey Archive · Sector 7",
      label: "Archival Inscription",
      ref: "#104 / CORE-7",
      caption: "Fig. 2 — Core sample, 0–14 m",
      quotePre: "“Built upon the bedrock ",
      quoteHi: "before the sky fell",
      quotePost: ", surviving three successive eras.”",
      verdict: "Stratum predates recorded collapse",
      readout: "CORE 7 · 9.4M · Δ +300Y",
    },
    {
      eyebrow: "Visual Evidence · Chapter 03",
      lines: ["A Blade Forged After", "Its Own Legend"],
      body: "The sword is described as a relic of the First Age. Its own inscription cites a smithing house that the tax rolls do not record until two hundred years later.",
      byline: "Survey Archive · Sector 7",
      label: "Item Inspection",
      ref: "#212 / RELIC",
      caption: "Fig. 3 — Attribution vs. record",
      quotePre: "“Struck by the House of Ardenmoor, ",
      quoteHi: "keepers of the first flame",
      quotePost: ", for a king long buried.”",
      verdict: "Smithing house postdates the relic",
      readout: "ITEM 212 · ARDENMOOR · Δ +200Y",
      itemRows: [
        ["ORIGIN", "FIRST AGE"],
        ["CONDITION", "INTACT"],
        ["ATTRIBUTION", "HOUSE ARDENMOOR"],
        ["IN TAX ROLLS", "200 YEARS LATER"],
      ],
    },
  ],

  "sci-fi-cyberpunk": [
    {
      eyebrow: "Telemetry · Chapter 01",
      lines: ["The Blackout Log", "Runs Backwards"],
      body: "The grid failure is logged as a cascade from substation nine outward. Packet timestamps invert that order — the outer nodes report dark before the source does.",
      byline: "Nightwire Forensics · Node 12",
      label: "Grid Event Log",
      ref: "SEQ-0091 / RAW",
      caption: "Fig. 1 — Node dark-time, ordered",
      quotePre: "SUBSTATION 09 PRIMARY FAULT — ",
      quoteHi: "DOWNSTREAM ECHO CONFIRMED",
      quotePost: " — CASCADE NOMINAL.",
      verdict: "Echo precedes its own source",
      readout: "SEQ 0091 · 6 NODES · Δ −40MS",
    },
    {
      eyebrow: "Telemetry · Chapter 02",
      lines: ["A District That", "Never Broke Ground"],
      body: "Zoning returns list Sector 14 as a completed residential build. Subsurface scan returns raw fill to bedrock — no foundation, no service trench, no utility spine.",
      byline: "Nightwire Forensics · Node 12",
      label: "Subsurface Scan",
      ref: "SCAN-14 / DEPTH",
      caption: "Fig. 2 — Density profile, 0–14 m",
      quotePre: "SECTOR 14 — STATUS: OCCUPIED — ",
      quoteHi: "FOUNDATION LAYER ABSENT",
      quotePost: " — RETURN CLEAN.",
      verdict: "Occupied district has no foundation",
      readout: "SCAN 14 · 9.4M · VOID",
    },
    {
      eyebrow: "Telemetry · Chapter 03",
      lines: ["Firmware Older", "Than Its Chassis"],
      body: "The unit ships with a build stamped two years before its own hardware revision entered fabrication. The signing key belongs to a vendor dissolved before either date.",
      byline: "Nightwire Forensics · Node 12",
      label: "Unit Inspection",
      ref: "UNIT-77 / FW",
      caption: "Fig. 3 — Build stamp vs. fab date",
      quotePre: "BUILD 4.1.7 — SIGNED — ",
      quoteHi: "VENDOR CERT REVOKED 2 YRS PRIOR",
      quotePost: " — TRUST CHAIN OK.",
      verdict: "Signed by a vendor that did not exist",
      readout: "UNIT 77 · FW 4.1.7 · Δ −2Y",
      itemRows: [
        ["HW REVISION", "B-CLASS"],
        ["BUILD", "4.1.7"],
        ["SIGNING KEY", "CHAIN VALID"],
        ["VENDOR STATUS", "DISSOLVED, 2 YRS PRIOR"],
      ],
    },
  ],

  "post-apocalyptic": [
    {
      eyebrow: "Salvage Log · Chapter 01",
      lines: ["The Evacuation Order", "Predates the Blast"],
      body: "The shelter manifest is signed and dated the morning of the event. The order authorising it carries a stamp from eleven days earlier, when the sky was still clear.",
      byline: "Ashfield Recovery · Team 4",
      label: "Shelter Manifest",
      ref: "LOG-08 / EVAC",
      caption: "Fig. 1 — Order dates, week of event",
      quotePre: "“All households to the lower gallery ",
      quoteHi: "by the eleventh, without exception",
      quotePost: " — by order of the Warden.”",
      verdict: "Order signed before the event",
      readout: "LOG 08 · 6 ENTRIES · Δ −11D",
    },
    {
      eyebrow: "Salvage Log · Chapter 02",
      lines: ["Green Water In", "A Dead Basin"],
      body: "Every survey since the fall records the basin as sterile to bedrock. The current column shows a living band at nine metres, fed by something the maps do not admit exists.",
      byline: "Ashfield Recovery · Team 4",
      label: "Water Column",
      ref: "BSN-03 / DEPTH",
      caption: "Fig. 2 — Column sample, 0–14 m",
      quotePre: "“The basin holds nothing that grows, ",
      quoteHi: "and has held nothing since the fall",
      quotePost: " — Survey, third season.”",
      verdict: "Living band in a sterile column",
      readout: "BSN 03 · 9.4M · LIVE",
    },
    {
      eyebrow: "Salvage Log · Chapter 03",
      lines: ["Ration Tins Stamped", "After The Fall"],
      body: "The cache is presented as pre-event surplus. Three tins carry a cannery code that the plant only began stamping after it was supposedly destroyed.",
      byline: "Ashfield Recovery · Team 4",
      label: "Cache Inventory",
      ref: "CCH-19 / TINS",
      caption: "Fig. 3 — Stamp code vs. plant record",
      quotePre: "“Surplus, sealed before the sirens, ",
      quoteHi: "cannery four, spring of the last year",
      quotePost: " — quartermaster's hand.”",
      verdict: "Cannery code postdates its own plant",
      readout: "CCH 19 · CAN-4 · Δ +14M",
      itemRows: [
        ["LOT", "PRE-EVENT SURPLUS"],
        ["SEAL", "UNBROKEN"],
        ["CANNERY", "PLANT FOUR"],
        ["STAMP CODE", "14 MONTHS AFTER FALL"],
      ],
    },
  ],

  "retro-pixel": [
    {
      eyebrow: "Frame Data · Chapter 01",
      lines: ["World 4 Was Patched", "Out Of Order"],
      body: "The level table ships in sequence one through eight. Checksum order in the cartridge dump puts world four last, written after the ending screen it is supposed to precede.",
      byline: "Cart Dump Archive · Rev B",
      label: "Level Table",
      ref: "ROM-04 / ORDER",
      caption: "Fig. 1 — Write order, worlds 1–6",
      quotePre: "LEVEL TABLE OK — ",
      quoteHi: "W4 BLOCK WRITTEN LAST",
      quotePost: " — SEQUENCE NOMINAL.",
      verdict: "World 4 written after the ending",
      readout: "ROM 04 · 6 BLOCKS · ORDER ERR",
    },
    {
      eyebrow: "Frame Data · Chapter 02",
      lines: ["A Warp Zone With", "No Exit Tile"],
      body: "The pipe in world two is mapped as a warp. The tile grid behind it terminates in solid collision at nine rows down — there is no destination on the other side.",
      byline: "Cart Dump Archive · Rev B",
      label: "Tile Grid",
      ref: "MAP-02 / TILES",
      caption: "Fig. 2 — Tile rows, 0–14",
      quotePre: "WARP FLAG SET — ",
      quoteHi: "DEST TILE = SOLID",
      quotePost: " — LINK VALID.",
      verdict: "Warp resolves into collision",
      readout: "MAP 02 · ROW 9 · SOLID",
    },
    {
      eyebrow: "Frame Data · Chapter 03",
      lines: ["The Sword Sprite", "Predates The Sword"],
      body: "The blade is introduced in the third act. Its sprite occupies a tile slot allocated in the earliest build, two revisions before the weapon appears in any script file.",
      byline: "Cart Dump Archive · Rev B",
      label: "Sprite Slot",
      ref: "SPR-11 / SLOT",
      caption: "Fig. 3 — Slot alloc vs. script ref",
      quotePre: "SPRITE 11 — ACT 3 ASSET — ",
      quoteHi: "SLOT ALLOCATED IN REV A",
      quotePost: " — NO SCRIPT REF.",
      verdict: "Sprite allocated before it existed",
      readout: "SPR 11 · REV A · Δ −2 REV",
      itemRows: [
        ["ASSET", "SWORD SPRITE"],
        ["INTRODUCED", "ACT THREE"],
        ["TILE SLOT", "0x11"],
        ["SLOT ALLOCATED", "REV A, 2 BUILDS EARLY"],
      ],
    },
  ],
};

/* ── Evidence figures ────────────────────────────────────────────────────
   One builder per chapter archetype. Each returns SVG whose viewBox matches
   the panel's inner width 1:1, so strokes and labels render undistorted and
   nothing crosses the panel's overflow edge.
─────────────────────────────────────────────────────────────────────────── */

/** Chapter 0 — horizontal chronology rail, one node out of sequence. */
function figureTimeline(g, w, p) {
  const railY = 150;
  const x0 = 26;
  const x1 = w - 26;
  const n = 6;
  const anomaly = 3;
  const step = (x1 - x0) / (n - 1);
  const railLen = Math.round(x1 - x0);

  let nodes = "";
  for (let i = 0; i < n; i++) {
    const cx = Math.round(x0 + step * i);
    const isA = i === anomaly;
    const cy = isA ? railY - 46 : railY;
    const r = isA ? 11 : 7;
    const fill = isA ? p.focal : p.structure;
    if (isA) {
      nodes += `\n              <path id="${g}-drop" class="fig-drop" d="M ${cx} ${railY} L ${cx} ${cy + r}" stroke="${p.focal}" stroke-width="2" fill="none" />`;
    }
    nodes += `\n              <circle class="fig-node${isA ? " fig-node-anomaly" : ""}" cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" />`;
    nodes += `\n              <text class="fig-tick" x="${cx}" y="${railY + 40}" text-anchor="middle">${String(i + 1).padStart(2, "0")}</text>`;
  }

  return `<svg viewBox="0 0 ${w} ${FIG_H}" aria-hidden="true">
              <path id="${g}-rail" class="fig-rail" d="M ${x0} ${railY} L ${x1} ${railY}" stroke="${p.structure}" stroke-width="2" fill="none" style="stroke-dasharray: ${railLen}" />${nodes}
              <text id="${g}-figlabel" class="fig-label" x="${Math.round(x0 + step * anomaly)}" y="${railY - 70}" text-anchor="middle">OUT OF SEQUENCE</text>
            </svg>`;
}

/** Chapter 1 — depth column with an anomalous band and a depth bracket. */
function figureMap(g, w, p) {
  const gutter = 110;
  const bw = w - gutter;
  const bands = [
    [8, 32],
    [46, 28],
    [80, 36],
    [122, 26],
  ];
  let out = "";
  for (const [y, h] of bands) {
    out += `\n              <rect class="fig-band" x="${gutter}" y="${y}" width="${bw}" height="${h}" fill="${p.panel}" stroke="${p.line}" stroke-width="1" />`;
  }
  return `<svg viewBox="0 0 ${w} ${FIG_H}" aria-hidden="true">${out}
              <rect id="${g}-anomaly" class="fig-anomaly" x="${gutter}" y="${156}" width="${bw}" height="44" fill="${p.sweepFill}" stroke="${p.focal}" stroke-width="2" />
              <rect class="fig-band" x="${gutter}" y="${206}" width="${bw}" height="40" fill="${p.panel}" stroke="${p.line}" stroke-width="1" />
              <path id="${g}-bracket" class="fig-bracket" d="M 96 156 L 86 156 L 86 200 L 96 200" stroke="${p.structure}" stroke-width="2" fill="none" style="stroke-dasharray: 64" />
              <text id="${g}-figlabel" class="fig-depth" x="72" y="183" text-anchor="end">9.4 m</text>
            </svg>`;
}

/** Chapter 2 — item record, one attribute contradicting the rest. */
function figureItem(g, w, p, rows) {
  const boxW = 132;
  const rowX = boxW + 34;
  const rowW = w - rowX;
  const anomaly = rows.length - 1;
  let out = `\n              <rect id="${g}-itembox" class="fig-itembox" x="0" y="26" width="${boxW}" height="${boxW}" fill="${p.panel}" stroke="${p.structure}" stroke-width="2" />
              <path id="${g}-itemmark" class="fig-itemmark" d="M ${boxW * 0.3} ${26 + boxW * 0.66} L ${boxW * 0.5} ${26 + boxW * 0.3} L ${boxW * 0.7} ${26 + boxW * 0.66}" stroke="${p.structure}" stroke-width="3" fill="none" style="stroke-dasharray: 96" />`;
  rows.forEach(([k, v], i) => {
    const y = 26 + i * 42;
    const isA = i === anomaly;
    const c = isA ? p.focal : p.muted;
    out += `\n              <rect class="fig-row${isA ? " fig-row-anomaly" : ""}" x="${rowX}" y="${y}" width="${rowW}" height="32" fill="${isA ? p.sweepFill : "transparent"}" stroke="${isA ? p.focal : p.line}" stroke-width="${isA ? 2 : 1}" />
              <text class="fig-key" x="${rowX + 14}" y="${y + 21}" fill="${isA ? p.text : p.muted}">${k}</text>
              <text class="fig-val" x="${rowX + rowW - 14}" y="${y + 21}" text-anchor="end" fill="${c}">${v}</text>`;
  });
  const ay = 26 + anomaly * 42;
  return `<svg viewBox="0 0 ${w} ${FIG_H}" aria-hidden="true">${out}
              <text id="${g}-figlabel" class="fig-label" x="${rowX}" y="${ay + 56}">CONTRADICTS RECORD</text>
            </svg>`;
}

const FIGURES = [figureTimeline, figureMap, figureItem];
/* Per-archetype selector groups the timeline staggers over.
   The `stagger` group MUST exclude the `focal` element. Both beats use
   `from` tweens, and `from` records the target's state at build time as its
   END value — so if the focal element were also in the stagger group, the
   stagger's immediateRender would have already collapsed it to scaleX 0.001
   and the focal tween would animate *to* 0.001, leaving it invisible. */
const FIG_BEATS = [
  {
    stagger: ".fig-node:not(.fig-node-anomaly), .fig-tick",
    draw: "-rail",
    focal: ".fig-node-anomaly",
    extra: "-drop",
  },
  { stagger: ".fig-band", draw: "-bracket", focal: ".fig-anomaly", extra: null },
  {
    stagger: ".fig-row:not(.fig-row-anomaly), .fig-key, .fig-val",
    draw: "-itemmark",
    focal: ".fig-row-anomaly",
    extra: null,
  },
];

/* ── Composition emitter ─────────────────────────────────────────────── */

function buildHTML(genre) {
  const { palette: p, type: t, ease, spatial: s, drift, tempo } = genre;
  const total = CHAPTER_LEN * 3;
  const colW = (FRAME_W - s.padX * 2 - s.gap) / 2;
  const innerW = Math.round(colW - s.panelPad * 2);
  const chapters = COPY[genre.id];

  const scenes = chapters
    .map((c, i) => {
      const g = `c${i + 1}`;
      const fig = FIGURES[i](g, innerW, p, c.itemRows);
      const lines = c.lines
        .map(
          (l) =>
            `<span class="line-mask"><span class="line-inner ${g}-line" data-layout-allow-overflow>${l}</span></span>`,
        )
        .join("\n            ");

      return `
      <section id="${g}" class="clip scene" data-start="${i * CHAPTER_LEN}" data-duration="${CHAPTER_LEN}" data-track-index="1">
        <div id="${g}-mid" class="mid">
          <div class="narrative">
            <div id="${g}-eyebrow" class="eyebrow">
              <span id="${g}-dot" class="eyebrow-dot"></span>
              <span>${c.eyebrow}</span>
            </div>
            <h1 class="headline">
            ${lines}
            </h1>
            <span id="${g}-divider" class="divider"></span>
            <p id="${g}-body" class="body-text">${c.body}</p>
            <div id="${g}-byline" class="byline">
              <span class="byline-rule"></span>
              <span>${c.byline}</span>
            </div>
          </div>

          <div id="${g}-panel" class="evidence">
            <span id="${g}-spine" class="spine"></span>
            <div id="${g}-head" class="evidence-head">
              <span class="evidence-label">${c.label}</span>
              <span class="evidence-ref">${c.ref}</span>
            </div>
            <div class="section-figure">
              ${fig}
              <span id="${g}-caption" class="figure-caption">${c.caption}</span>
            </div>
            <div class="quote">${c.quotePre}<span class="highlight"><span id="${g}-sweep" class="highlight-sweep"></span><span class="highlight-text">${c.quoteHi}</span></span>${c.quotePost}</div>
            <div id="${g}-verdict" class="evidence-foot">
              <span class="foot-dot"></span>
              <span>${c.verdict}</span>
            </div>
          </div>
        </div>

        <div id="${g}-fg" class="foreground">
          <span class="readout">${c.readout}</span>
        </div>
      </section>`;
    })
    .join("\n");

  const figBeatsJSON = JSON.stringify(FIG_BEATS);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${FRAME_W}, height=${FRAME_H}" />
    <title>${genre.title} — Lore Documentary</title>
    <!-- GSAP is vendored, not CDN-loaded: the determinism contract bans
         render-time network fetches for required assets. -->
    <script src="assets/gsap.min.js"></script>
    <!-- No external font <link>: the producer resolves the families named
         below and injects deterministic @font-face rules at compile time. -->
    <style>
      /* ═══════════════════════════════════════════════════════════════
         ${genre.title} — generated by build.mjs, do not hand-edit.
         60% base ${p.base} · 30% structure ${p.structure} · 10% focal ${p.focal}
      ═══════════════════════════════════════════════════════════════ */
      :root {
        --base: ${p.base};
        --panel: ${p.panel};
        --structure: ${p.structure};
        --focal: ${p.focal};
        --text: ${p.text};
        --muted: ${p.muted};
        --line: ${p.line};
      }

      * { box-sizing: border-box; margin: 0; padding: 0; }

      html, body {
        width: ${FRAME_W}px;
        height: ${FRAME_H}px;
        overflow: hidden;
        background-color: var(--base);
      }

      #root {
        position: relative;
        width: ${FRAME_W}px;
        height: ${FRAME_H}px;
        overflow: hidden;
        font-family: ${t.display};
        color: var(--text);
      }

      /* ── Layer 1 / background: base plate + continuous camera drift ── */
      .backdrop { position: absolute; inset: 0; background-color: var(--base); overflow: hidden; }

      .plate {
        position: absolute;
        left: -8%; top: -8%; width: 116%; height: 116%;
        transform-origin: 40% 52%;
        background-image:
          radial-gradient(circle at 30% 46%, ${p.wash1} 0%, transparent 58%),
          radial-gradient(circle at 76% 70%, ${p.wash2} 0%, transparent 52%);
      }

      .grid-plate {
        position: absolute; inset: 0;
        background-image:
          linear-gradient(${p.grid} 1px, transparent 1px),
          linear-gradient(90deg, ${p.grid} 1px, transparent 1px);
        background-size: 120px 120px;
      }

      .vignette {
        position: absolute; inset: 0;
        background: radial-gradient(ellipse 78% 68% at 50% 50%, transparent 42%, ${p.vignette} 100%);
      }

      /* ── Layer 2 / midground: the scene itself ───────────────────── */
      .scene { position: absolute; inset: 0; }

      .mid {
        position: absolute; inset: 0;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: ${s.gap}px;
        align-content: center;
        padding: ${s.padY}px ${s.padX}px ${s.padY + 18}px;
      }

      .narrative { display: flex; flex-direction: column; justify-content: center; }

      .eyebrow {
        display: flex; align-items: center; gap: 14px;
        font-family: ${t.meta};
        font-size: 16px; font-weight: ${t.metaWeight};
        letter-spacing: ${t.metaTracking};
        text-transform: uppercase;
        color: var(--focal);
        margin-bottom: 28px;
      }

      .eyebrow-dot {
        display: block; width: 9px; height: 9px; border-radius: 50%;
        background-color: var(--focal); flex: none;
      }

      .headline {
        font-family: ${t.display};
        font-weight: ${t.displayWeight};
        font-size: ${t.displaySize}px;
        line-height: 1.12;
        letter-spacing: ${t.displayTracking};
        text-transform: ${t.displayTransform};
        color: var(--structure);
        /* Lines are split deliberately, one per mask — a wrap inside a mask
           would break the per-line reveal. */
        white-space: nowrap;
      }

      .line-mask { display: block; overflow: hidden; }
      .line-inner { display: block; }

      .divider {
        display: block; width: 100%; height: 2px;
        margin: 32px 0 28px;
        transform-origin: left center;
        background: linear-gradient(90deg, var(--structure) 0%, transparent 100%);
      }

      .body-text {
        font-family: ${t.meta};
        font-size: 21px; font-weight: 400; line-height: 1.62;
        color: var(--muted);
        max-width: 42ch;
      }

      .byline {
        display: flex; align-items: center; gap: 18px;
        margin-top: 40px;
        font-family: ${t.meta};
        font-size: 13px; font-weight: 500;
        letter-spacing: 2.2px; text-transform: uppercase;
        color: var(--muted);
      }

      .byline-rule {
        display: block; width: 46px; height: 1px; flex: none;
        background-color: var(--structure);
      }

      /* ── Evidence panel ──────────────────────────────────────────── */
      .evidence {
        position: relative; align-self: center;
        background-color: var(--panel);
        border-radius: ${s.radius};
        padding: ${s.panelPad}px;
        box-shadow: 0 34px 68px -20px rgba(0, 0, 0, 0.72);
        overflow: hidden;
      }

      .spine {
        position: absolute; left: 0; top: 0;
        width: ${s.spine}px; height: 100%;
        transform-origin: center top;
        background-color: var(--structure);
      }

      .evidence-head {
        display: flex; align-items: baseline; justify-content: space-between; gap: 24px;
        padding-bottom: 18px; margin-bottom: 24px;
        border-bottom: 1px solid var(--line);
      }

      .evidence-label {
        font-family: ${t.meta};
        font-size: 12px; font-weight: 600; letter-spacing: 2.6px;
        text-transform: uppercase; color: var(--muted);
      }

      .evidence-ref {
        font-family: ${t.meta};
        font-size: 12px; font-weight: 500; letter-spacing: 1.6px;
        color: var(--structure);
      }

      .section-figure { position: relative; width: 100%; height: ${FIG_H}px; margin-bottom: 46px; }
      .section-figure svg { display: block; width: 100%; height: 100%; }

      .fig-band, .fig-anomaly, .fig-row { transform-box: fill-box; transform-origin: left center; }
      .fig-node, .fig-itembox { transform-box: fill-box; transform-origin: center center; }

      .fig-tick, .fig-key, .fig-val, .fig-depth, .fig-label {
        font-family: ${t.meta};
        font-size: 12px; font-weight: 600; letter-spacing: 1px;
      }
      .fig-tick { fill: var(--muted); }
      .fig-depth { font-size: 14px; fill: var(--structure); }
      .fig-label { font-size: 11px; letter-spacing: 2.4px; fill: var(--focal); }

      .figure-caption {
        position: absolute; left: 0; bottom: -28px;
        font-family: ${t.meta};
        font-size: 11px; font-weight: 500; letter-spacing: 1.5px;
        text-transform: uppercase; color: var(--muted);
      }

      /* ── Kinetic highlight sweep ─────────────────────────────────── */
      .quote {
        font-family: ${t.display};
        font-size: ${t.quoteSize}px;
        font-style: ${t.quoteStyle};
        font-weight: 400;
        line-height: 1.52;
        color: var(--text);
      }

      .highlight {
        position: relative; display: inline-block;
        font-style: normal; font-weight: 700;
        color: var(--focal);
        padding: 0 5px;
      }

      .highlight-sweep {
        position: absolute; inset: 0; display: block;
        transform-origin: left center;
        background-color: ${p.sweepFill};
        border-bottom: 2px solid var(--focal);
      }

      .highlight-text { position: relative; }

      .evidence-foot {
        display: flex; align-items: center; gap: 12px;
        margin-top: 28px; padding-top: 20px;
        border-top: 1px solid var(--line);
        font-family: ${t.meta};
        font-size: 12px; font-weight: 600; letter-spacing: 2.4px;
        text-transform: uppercase; color: var(--focal);
      }

      .foot-dot {
        display: block; width: 7px; height: 7px; border-radius: 50%;
        background-color: var(--focal); flex: none;
      }

      /* ── Layer 3 / foreground: HUD, drifts fastest ───────────────── */
      .foreground { position: absolute; inset: 0; }

      .readout {
        position: absolute; left: ${s.padX}px; bottom: 58px;
        font-family: ${t.meta};
        font-size: 12px; font-weight: 600; letter-spacing: 2.6px;
        color: var(--muted);
      }

      .hud-frame { position: absolute; inset: 0; }

      .corner {
        position: absolute; width: 34px; height: 34px;
        border: 2px solid var(--structure);
      }
      .corner-tl { left: 54px;  top: 50px;    border-right: none; border-bottom: none; }
      .corner-tr { right: 54px; top: 50px;    border-left: none;  border-bottom: none; }
      .corner-bl { left: 54px;  bottom: 50px; border-right: none; border-top: none; }
      .corner-br { right: 54px; bottom: 50px; border-left: none;  border-top: none; }

      .legend {
        position: absolute; right: ${s.padX}px; bottom: 58px;
        display: flex; gap: 28px;
        font-family: ${t.meta};
        font-size: 11px; font-weight: 500; letter-spacing: 1.4px;
        color: var(--muted);
      }
      .swatch { display: flex; align-items: center; gap: 9px; }
      .swatch-chip { display: block; width: 12px; height: 12px; flex: none; }
    </style>
  </head>
  <body>
    <div
      id="root"
      data-composition-id="main"
      data-start="0"
      data-duration="${total}"
      data-width="${FRAME_W}"
      data-height="${FRAME_H}"
    >
      <div id="backdrop" class="clip backdrop" data-start="0" data-duration="${total}" data-track-index="0">
        <!-- Deliberately oversized: the camera drift must never expose an edge -->
        <div id="plate" class="plate" data-layout-allow-overflow>
          <div class="grid-plate"></div>
        </div>
        <div class="vignette"></div>
      </div>
${scenes}

      <div id="hud" class="clip" data-start="0" data-duration="${total}" data-track-index="2">
        <div id="hud-frame" class="hud-frame">
          <span class="corner corner-tl"></span>
          <span class="corner corner-tr"></span>
          <span class="corner corner-bl"></span>
          <span class="corner corner-br"></span>
        </div>
        <div id="legend" class="legend">
          <span class="swatch"><span class="swatch-chip" style="background-color: var(--base); border: 1px solid var(--muted)"></span><span>60% BASE</span></span>
          <span class="swatch"><span class="swatch-chip" style="background-color: var(--structure)"></span><span>30% STRUCTURE</span></span>
          <span class="swatch"><span class="swatch-chip" style="background-color: var(--focal)"></span><span>10% FOCAL</span></span>
        </div>
      </div>
    </div>

    <script>
      window.__timelines = window.__timelines || {};

      /* Easing physics for this genre — see RULESET.md */
      const EASE = ${JSON.stringify(ease, null, 8).replace(/\n/g, "\n      ")};
      const IN = ${tempo.in};
      const STAGGER = ${tempo.stagger};
      const FIG = ${figBeatsJSON};
      const CHAPTERS = [
${chapters.map((_, i) => `        { id: "c${i + 1}", start: ${i * CHAPTER_LEN}, fig: FIG[${i}] }`).join(",\n")}
      ];

      const tl = gsap.timeline({ paused: true });

      /* ── Layer 1: one continuous camera drift across all ${total}s ─────── */
      tl.fromTo(
        "#plate",
        { scale: 1, x: 0 },
        { scale: ${1 + drift.scale}, x: ${drift.bgX}, duration: ${total}, ease: "none" },
        0,
      );

      /* ── Per-chapter beats ──────────────────────────────────────── */
      CHAPTERS.forEach(({ id, start, fig }) => {
        /* Scope EVERY selector in a comma list to this chapter — scoping
           only the first would let later ones match sibling chapters. */
        const q = (sel) =>
          sel
            .split(",")
            .map((s) => "#" + id + " " + s.trim())
            .join(", ");

        /* Layers 2 and 3 drift at different rates against layer 1 —
           that difference is the parallax. */
        tl.fromTo(q(".mid"), { x: 0 }, { x: ${drift.midX}, duration: ${CHAPTER_LEN}, ease: "none" }, start);
        tl.fromTo(q(".foreground"), { x: 0 }, { x: ${drift.fgX}, duration: ${CHAPTER_LEN}, ease: "none" }, start);

        /* Narrative column */
        tl.from("#" + id + "-eyebrow", { y: 18, opacity: 0, duration: IN * 0.65, ease: EASE.secondary }, start + 0.2);
        tl.from("#" + id + "-dot", { scale: 0, duration: IN * 0.55, ease: EASE.pop }, start + 0.34);
        tl.from("." + id + "-line", { yPercent: 112, duration: IN, ease: EASE.hero, stagger: STAGGER }, start + 0.45);
        tl.from("#" + id + "-divider", { scaleX: 0, duration: IN * 0.8, ease: EASE.sweep }, start + 1.15);
        tl.from("#" + id + "-body", { y: 22, opacity: 0, duration: IN * 0.8, ease: EASE.secondary }, start + 1.4);
        tl.from("#" + id + "-byline", { x: -16, opacity: 0, duration: IN * 0.7, ease: EASE.secondary }, start + 1.7);

        /* Evidence panel */
        tl.from("#" + id + "-panel", { x: 54, opacity: 0, duration: IN, ease: EASE.hero }, start + 2.0);
        tl.from("#" + id + "-spine", { scaleY: 0, duration: IN * 0.7, ease: EASE.secondary }, start + 2.25);
        tl.from("#" + id + "-head", { y: 14, opacity: 0, duration: IN * 0.65, ease: EASE.secondary }, start + 2.45);

        /* Evidence draws in, then the focal element resolves */
        tl.from(q(fig.stagger), { opacity: 0, scaleX: 0.001, duration: IN * 0.55, ease: EASE.secondary, stagger: STAGGER * 0.8 }, start + 2.75);
        tl.from("#" + id + fig.draw, { strokeDashoffset: (i, el) => el.getTotalLength?.() ?? 100, duration: IN * 0.7, ease: EASE.secondary }, start + 3.3);
        if (fig.extra) {
          tl.from("#" + id + fig.extra, { scaleY: 0, transformOrigin: "center bottom", duration: IN * 0.5, ease: EASE.secondary }, start + 3.75);
        }
        tl.from(q(fig.focal), { opacity: 0, scale: 0.4, transformOrigin: "left center", duration: IN * 0.7, ease: EASE.pop }, start + 3.9);
        tl.from("#" + id + "-figlabel", { opacity: 0, y: 8, duration: IN * 0.5, ease: EASE.secondary }, start + 4.2);
        tl.from("#" + id + "-caption", { opacity: 0, duration: IN * 0.5, ease: EASE.secondary }, start + 4.3);

        /* The eyesweep: lands on the proof phrase, last thing before the verdict */
        tl.from("#" + id + "-sweep", { scaleX: 0, duration: IN * 0.75, ease: EASE.sweep }, start + 4.85);
        tl.from("#" + id + "-verdict", { y: 14, opacity: 0, duration: IN * 0.7, ease: EASE.secondary }, start + 5.45);
        tl.from("#" + id + "-fg .readout", { opacity: 0, duration: IN * 0.7, ease: EASE.secondary }, start + 5.8);
      });

      /* ── Layer 3 frame settles once, over the whole piece ────────── */
      tl.from("#hud-frame .corner", { opacity: 0, scale: 0.7, duration: 0.7, ease: EASE.pop, stagger: 0.07 }, 0.3);
      tl.from("#legend", { opacity: 0, duration: 0.8, ease: EASE.secondary }, 0.9);

      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`;
}

/* ── Emit ────────────────────────────────────────────────────────────── */
for (const genre of GENRES) {
  const dir = join(HERE, genre.id);
  mkdirSync(join(dir, "assets"), { recursive: true });
  writeFileSync(join(dir, "index.html"), buildHTML(genre));
  writeFileSync(
    join(dir, ".gitignore"),
    "# Verification output — regenerate with `npx hyperframes snapshot .`\nsnapshots/\n",
  );
  copyFileSync(GSAP_SRC, join(dir, "assets", "gsap.min.js"));
  console.log(`✓ ${genre.id}`);
}
