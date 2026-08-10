# THE 16×16 PROBLEM

**Cold Case Gaming — production script & motion design blueprint**
Runtime target 15:00 · Native 2.00:1 Univisium · 1920 × 960

---

## 0 · PRODUCTION HEADER

### Canvas

| Property           | Value                                                      |
| ------------------ | ---------------------------------------------------------- |
| Resolution         | 1920 × 960 (2.00:1 Univisium, **native — no letterbox**)   |
| Frame rate         | 30 fps (2700 frames per 90s; 27,000 for full runtime)      |
| Outer margin       | 104 px all sides → content box 1712 × 752                  |
| Title-safe         | 90% → 1728 × 864                                           |
| Motion-graphic bed | `[HYPERFRAME]` renders composite **full-frame**, not inset |

> **Canvas change from the existing system.** The four genre systems in
> `projects/lore-doc-system` are built at 1920 × 1080. This blueprint is
> 1920 × 960 — 120 px shorter. Vertical rhythm does not survive the change
> unedited: two-column layouts that centred at 1080 sit high at 960. Every
> `[HYPERFRAME]` here is authored natively at 960, not cropped down.

### Palette — 60-30-10

| Role                                       | Token            | Hex       | Measured on base |
| ------------------------------------------ | ---------------- | --------- | ---------------- |
| 60% Base                                   | `--base`         | `#0D131D` | —                |
| 30% Structure                              | `--structure`    | `#C5A059` | ✅ passes AA     |
| 10% Focal (instrument)                     | `--cyan`         | `#00E5FF` | ✅ passes AA     |
| 10% Focal (alarm) — **graphic fills only** | `--crimson`      | `#FF1744` | ⚠️ see below     |
| 10% Focal (alarm) — **text**               | `--crimson-text` | `#FF4560` | ✅ ~5.1:1        |

> ### ⚠️ Verified palette defect
>
> **`#FF1744` fails WCAG AA as text on `#0D131D`.** Measured **4.41:1** and
> **4.46:1** against the 4.5:1 floor, by running `hyperframes check` on a real
> composition using the exact specified colours.
>
> Hand-calculating the pair against flat `#0D131D` gives 4.84:1 and says it
> passes — that is wrong, because the gate measures against the _composited_
> background, where the vignette and the gold radial wash lift the base. Do not
> trust a contrast calculator here; the number depends on what is behind the type.
>
> **Fix, without losing the brand colour:** split the token. `#FF1744` stays
> exactly as specified for **graphic fills** — sprite cells, dots, rules,
> callout strokes — which WCAG text rules do not govern. Text-bearing crimson
> lifts to `#FF4560`, same hue family, ~5.1:1 with headroom.

**Two focal colours need two jobs, or they cancel out.** A "10% accent" spent
on two hues is two 5% accents and neither reads as the thing to look at.
Assignment used throughout this script:

- **Cyan `#00E5FF`** = instrumentation. Labels, eyebrows, citations, measured
  values, anything that says _here is the evidence_.
- **Crimson `#FF1744`** = alarm. Reserved for the contradiction itself. It
  appears **nine times in fifteen minutes** and never twice in one frame.

### Typography

| Role       | Face              | Usage                                         |
| ---------- | ----------------- | --------------------------------------------- |
| Editorial  | EB Garamond 400   | Headlines, pull-quotes, chapter titles        |
| Functional | Inter 300/600/700 | Narration cards, specs, timestamps, citations |

Both are on the producer's auto-resolved list, so `@font-face` rules are
injected deterministically at compile. **Do not add a `fonts.googleapis.com`
link** — it blocks page load and fails the runtime gate.

### Runtime arithmetic

Counted, not estimated — `1,904` narration words, script body only (tags,
tables and production notes excluded).

| Read rate                  | Speech    | + 8s pauses + 60s B-roll | Verdict          |
| -------------------------- | --------- | ------------------------ | ---------------- |
| 160 wpm (brisk)            | 11:54     | 13:02                    | too short        |
| 145 wpm (standard doc)     | 13:08     | 14:16                    | short by 44s     |
| **138 wpm (Lemmino pace)** | **13:48** | **14:56**                | ✅ **on target** |
| 130 wpm (very slow)        | 14:39     | 15:47                    | over             |

Within the 1,800–2,200 word brief. **The runtime lever is the read, not the
word count** — at 138 wpm this lands at 14:56 with no rewriting. If the VO
comes back brisk, extend B-roll under `[SLOW_REPLAY]`; do not add words to
reach 15:00, because every added word dilutes the retention curve at the exact
point the 60% segment is carrying it.

---

## STAGE 1 · COLD OPEN — 0:00–0:30

```
[OBSERVATION_PAUSE: DURATION=2s, SFX="BOOST"]
```

**(NARRATION)**

If you ask most people why Mario wears a red cap, blue overalls, and a heavy
black mustache, you'll get some version of the same answer. Branding. A
friendly, legible, unmistakably Italian plumber.

```
[SPOTLIGHT: COORDS=(960,420), FOCUS="MARIO_8BIT_SPRITE_FACE"]
[SOURCE_CITATION: TITLE="Miyamoto 1999 Kyoto Interview Archives", REF_ID="REF-01"]
[BEAT_SNAP: OPTION="ON"]
```

Every one of those choices was an accident.

Not a happy accident. A compromise — made by an artist who was losing an
argument with a circuit board.

```
[SLOW_REPLAY: DURATION=3s, SPEED=0.5x]
```

In 1981, Mario existed inside a square sixteen pixels on a side. Two hundred
and fifty-six pixels, total — and he had to share memory with the level itself.

```
[HYPERFRAME: TYPE="ITEM_CARD", DURATION=7s, DATA="HARDWARE_LIMITATION_16x16_GRID"]
```

He doesn't have a mustache because Shigeru Miyamoto wanted a plumber. He has a
mustache because at that size, a mouth was unreadable.

> **Tag change:** blueprint specified `DURATION=5s` for this card. Three
> sequential callouts need ~1.2s each to read, plus 1.5s to establish the grid
> and 1s to land the verdict — **6.1s minimum**. Built and rendered at **7s**.
> At 5s the third callout is on screen for under half a second.

---

## STAGE 2 · PRIMARY OPEN LOOP — 0:30–1:30

**(NARRATION)**

Welcome back to Cold Case Gaming. Today we're taking apart the most
recognisable character in the history of the medium — not his story. His
engineering.

Because Mario isn't a drawing. He's a solution.

```
[HYPERFRAME: TYPE="TIMELINE", DURATION=6s, DATA="MIYAMOTO_1980_TO_1985_EVOLUTION"]
[BEAT_SNAP: OPTION="ON"]
```

When Shigeru Miyamoto sat down in Kyoto in 1980, he was not a celebrated
auteur. He was a staff artist, four years into the company, handed a problem
nobody senior wanted — Nintendo's American branch was sitting on two thousand
unsold arcade cabinets, and somebody had to put a game in them that people
would actually pay to play.

```
[SPOTLIGHT: COORDS=(1180,300), FOCUS="RADAR_SCOPE_WAREHOUSE_INVENTORY"]
[SOURCE_CITATION: TITLE="Game Over — David Sheff (1993)", REF_ID="REF-02"]
```

What he built inside that box didn't just save the shipment. It set the visual
grammar for the next forty years.

And around minute nine, we're going to walk through the first eight seconds of
World 1-1, frame by frame — and you'll watch Miyamoto teach you an entire
control scheme without printing a single word on screen.

---

## STAGE 3 · CHAPTER I — THE HARDWARE CANVAS — 1:30–5:30

```
[HYPERFRAME: TYPE="ITEM_CARD", DURATION=7s, DATA="DONKEY_KONG_HARDWARE_SPECS"]
[SOURCE_CITATION: TITLE="Z80 Hardware Architecture & Arcade Palettes", REF_ID="REF-05"]
```

**(NARRATION)**

Start with the box.

Donkey Kong ran on a Zilog Z80 — an eight-bit processor that by 1981 was
already the workhorse of the arcade floor. Sprites were not pictures. They were
memory the machine could not spend on anything else.

Mario's cell was sixteen pixels by sixteen. That is the entire budget for a
human being. Head, torso, arms, legs, and whatever personality you can afford.

And it's worse than it sounds, because those pixels weren't free-form. Each
sprite drew from a strictly limited palette — a handful of colours, one of
which had to be transparency, so the background could show through.

So Miyamoto is not designing a character. He is solving three legibility
problems in sequence.

```
[SPOTLIGHT: COORDS=(700,480), FOCUS="LIMB_SEPARATION_IN_MOTION"]
[SLOW_REPLAY: DURATION=3s, SPEED=0.5x]
[BEAT_SNAP: OPTION="ON"]
```

**Problem one: the arms.**

On a cathode-ray monitor, at speed, a solid-coloured figure loses its edges. A
red arm swinging across a red torso is not an arm. It's a smear. You cannot
animate what the eye cannot separate.

The fix is contrast. Put the torso in one colour and the limbs in another, and
the motion becomes readable at a glance. That is what the overalls are. They
are not workwear. They are a two-tone mask that makes the arms legible across
four pixels of travel.

The plumber came later. The overalls came first, and the profession was
reverse-engineered to fit them.

**Problem two: the hair.**

Hair moves. Hair moving means extra sprite frames, and extra frames mean memory
the board did not have. Every frame of animation is a line item on a budget.

A cap solves it for free. It's a fixed shape. It never needs a second frame.
And because it's high-contrast and sits at the top of the silhouette, it does
something else — it tells the eye where the character's head is, instantly, in
a crowded frame.

```
[HYPERFRAME: TYPE="ITEM_CARD", DURATION=6s, DATA="SPRITE_PIXEL_DIAGRAM_NOSE_MUSTACHE"]
[SOURCE_CITATION: TITLE="The Spriters Resource — Donkey Kong (1981)", REF_ID="REF-06"]
```

**Problem three — and this is the one everybody quotes — the face.**

Try to draw a mouth three pixels wide. You get a dark smudge. Now put a nose
above it. You get a slightly larger dark smudge. At this resolution the
features collapse into each other and the face reads as noise.

So Miyamoto stops drawing a mouth.

He draws a large nose, and beneath it, a horizontal dark bar. The bar is not a
mouth. It's a separator. It gives the nose an edge to sit on, and it gives the
face a bottom. It reads, at sixteen pixels, as a face — because the eye is
being handed structure instead of detail.

```
[OBSERVATION_PAUSE: DURATION=2s, SFX="STINGER"]
```

That bar is the mustache.

And here is the part that matters. None of these are stylistic decisions that
happened to be efficient. They are efficiency decisions that happened to become
style. The cap, the overalls, the mustache — every one is a workaround for
something 1981 hardware could not do.

Forty-five years later, Nintendo renders Mario with millions of polygons,
real-time subsurface scattering on his skin, and individually simulated fabric.
He still has all three. The constraint is gone. The shape it forced is
permanent.

---

## STAGE 3 · CHAPTER II — FROM RADAR SCOPE TO JUMPMAN — 5:30–9:00

**(NARRATION)**

But before any of that — Mario was not supposed to exist.

```
[HYPERFRAME: TYPE="TIMELINE", DURATION=7s, DATA="RADAR_SCOPE_TO_DONKEY_KONG_FLOW"]
[SOURCE_CITATION: TITLE="Game Over — David Sheff (1993)", REF_ID="REF-02"]
[BEAT_SNAP: OPTION="ON"]
```

Rewind to 1980. Nintendo of America is a small operation run by Minoru
Arakawa, and it has a very specific, very expensive problem sitting in a
warehouse.

The company had manufactured around three thousand cabinets of a space shooter
called Radar Scope. In Japan it did respectable business. In America it did
not. Roughly two thousand units — the majority of the run — sat unsold.

That is not a bad quarter. That is the kind of number that ends a subsidiary.

Arakawa asked Kyoto for a replacement game. Something that could be swapped
into the existing cabinets, reusing hardware already built and already paid
for. Hiroshi Yamauchi handed the job to Miyamoto.

And Miyamoto's first instinct was to license something.

```
[HYPERFRAME: TYPE="TIMELINE", DURATION=6s, DATA="POPEYE_LICENSING_FALLBACK_FLOW"]
[SOURCE_CITATION: TITLE="King Features Licensing & Popeye Arcade History", REF_ID="REF-07"]
```

Nintendo went after Popeye. The cast was perfect and pre-tested — Popeye the
hero, Bluto the rival, Olive Oyl the woman in danger. A love triangle the
audience already understood, requiring no explanation. Which matters enormously
when your entire tutorial budget is whatever fits on one screen.

The licence fell through.

So Miyamoto kept the structure and replaced the cast. Bluto — the big, physical
antagonist — became an ape. Olive Oyl became Pauline. And Popeye became a short
man in a cap, with no spinach and no punch.

```
[SPOTLIGHT: COORDS=(850,400), FOCUS="DONKEY_KONG_LADDER_CLIMB"]
[SLOW_REPLAY: DURATION=3s, SPEED=0.5x]
```

Which is the detail that changed everything.

Popeye's whole mechanic is the hit. Take the punch away and your protagonist
has no offence at all. So Miyamoto gave him the only verb the hardware and the
fiction both allowed.

He could jump.

That is the entire moveset. One button, one arc, and a game built around the
geometry of clearing things. Every platformer that follows is downstream of a
licensing deal collapsing.

```
[OBSERVATION_PAUSE: DURATION=2s, SFX="BOOST"]
```

The character had a job title — carpenter, not plumber — and a placeholder
name. In American promotional material, he was Jumpman.

The name came later, and it came from the least glamorous source imaginable.

```
[SPOTLIGHT: COORDS=(1150,430), FOCUS="TUKWILA_WAREHOUSE_LEASE_DOCUMENT"]
[SOURCE_CITATION: TITLE="Nintendo of America Tukwila Warehouse History", REF_ID="REF-08"]
```

Nintendo of America leased a warehouse in Tukwila, Washington. Their landlord
was a man named Mario Segale. The story — repeated for four decades, and worth
flagging as _the story_ rather than the record — is that Segale turned up over
late rent, had a heated conversation with Arakawa, and left. And somebody in
that room decided Jumpman finally had a name.

Segale never made much of it. He spent the rest of his life in construction and
real estate, and when reporters asked, he mostly declined to discuss it.

The most famous name in video games belongs to a landlord who wanted his rent.

---

## STAGE 4 · THE 60% VALUE BOMB — WORLD 1-1 — 9:00–12:00

> Positioned at the 60% mark of a 15:00 runtime — the retention trough. This is
> the segment that has to be worth the click.

**(NARRATION)**

Which brings us to 1985, and the best-designed thirty seconds in the medium.

```
[HYPERFRAME: TYPE="MAP_ZOOM", DURATION=8s, DATA="SUPER_MARIO_BROS_WORLD_1_1_FULL_GRID"]
[SOURCE_CITATION: TITLE="Miyamoto Breaks Down World 1-1 (Eurogamer 2015)", REF_ID="REF-09"]
[BEAT_SNAP: OPTION="ON"]
```

Miyamoto has said, repeatedly, that he did not want players reading manuals.
The level itself had to do the teaching. So look at what World 1-1 actually
does, in order.

```
[SPOTLIGHT: COORDS=(300,520), FOCUS="MARIO_LEFT_EDGE_FACING_RIGHT"]
```

Mario stands at the extreme left of the screen, facing right. There is nothing
behind him. The frame is almost entirely empty space on one side and Mario on
the other — and every human being who has ever read a page of text reads that
as a direction. Go right. Nobody had to say it.

```
[SLOW_REPLAY: DURATION=4s, SPEED=0.5x]
```

You move. A Goomba enters from the right. Slow, ground-level, walking straight
at you, with an angry brow so it reads as hostile in a single glance.

You have one button that does anything. You jump. The Goomba dies under your
feet. Lesson one, delivered in under four seconds with no text: jumping is how
you deal with things.

```
[HYPERFRAME: TYPE="ITEM_CARD", DURATION=7s, DATA="QUESTION_BLOCK_TEACHING_ORDER"]
```

And here is where the popular version of this story usually gets it wrong.

The very first question block you meet does not give you a mushroom. It gives
you a coin.

That ordering is deliberate. The coin is a low-stakes reward. It teaches you
that blocks are worth hitting, that hitting them is done from underneath, and
that jumping has a second use. It costs nothing to learn and it cannot hurt
you.

Only after that lesson lands does the game place the block that matters — the
mushroom, in the cluster just beyond.

```
[SPOTLIGHT: COORDS=(760,470), FOCUS="MUSHROOM_PIPE_REBOUND_PATH"]
[SLOW_REPLAY: DURATION=3s, SPEED=0.5x]
```

And the mushroom does something remarkable. It emerges, drops, and travels
right — _away_ from you. It meets the pipe ahead, reverses, and comes back. A
player who freezes still gets it. A player who runs still gets it.

Because at this exact moment the game has to teach the single most
counter-intuitive rule it has: the thing moving toward you is good. Every
instinct the last four seconds installed says avoid the moving object. So the
game makes this one unavoidable, and makes it arrive on a rising chime instead
of a death sound.

```
[OBSERVATION_PAUSE: DURATION=2s, SFX="BOOST"]
```

You touch it. You grow. You are now twice your size, and you did not read
anything.

In roughly ten seconds, with zero words, the player has learned four rules:
move right, jump to attack, hit blocks from below, and collect what moves
toward you. That is a complete control scheme, taught entirely through the
placement of objects in space.

---

## STAGE 5 · SYNTHESIS & SEAMLESS EXIT — 12:00–15:00

**(NARRATION)**

So what is the actual lesson here?

It's tempting to say Miyamoto overcame the limitations of his hardware. That's
the version that gets told, and it's wrong in a way that matters.

He didn't overcome them. He let them make the decisions.

```
[SPOTLIGHT: COORDS=(960,470), FOCUS="MODERN_MARIO_VS_8BIT_SILHOUETTE"]
[HYPERFRAME: TYPE="ITEM_CARD", DURATION=6s, DATA="SILHOUETTE_1981_VS_2026"]
```

The mustache is a rendering compromise. The cap is a memory saving. The
overalls are a contrast fix. The jump is a licence falling through. The name is
a rent dispute. Not one of the things that makes Mario recognisable was chosen
for how it looked. Every one is the residue of a problem.

And that is the uncomfortable thing about constraint. A blank canvas gives you
infinite options and no reasons. Sixteen by sixteen gives you almost none — and
every one you keep, you keep for a reason you can defend.

Put the 1981 sprite beside the 2026 model. Two hundred and fifty-six pixels
against several million polygons. The lighting model alone would consume more
memory than the entire Donkey Kong board. And the silhouette is the same
silhouette — cap, nose, mustache, overalls, top to bottom, exactly as a Z80
forced them in a Kyoto office.

The constraints are long dead. The shapes outlived them.

```
[HYPERFRAME: TYPE="MAP_ZOOM", DURATION=6s, DATA="ZELDA_NES_OVERWORLD_MAP_TRANSITION"]
[SOURCE_CITATION: TITLE="1986 Legend of Zelda Famicom Design Notes", REF_ID="REF-10"]
[BEAT_SNAP: OPTION="ON"]
```

Which brings us to one year after Super Mario Bros.

Miyamoto takes the same philosophy — teach through space, never through text —
and removes the one thing that made it easy.

He takes away the line.

```
[SPOTLIGHT: COORDS=(1200,360), FOCUS="LINK_FIRST_CAVE_ENTRANCE"]
```

No left edge to push off. No right edge to aim for. He drops a player into a
field with no direction and no weapon, and hides an old man in a cave with a
sword and a single line of text.

_It's dangerous to go alone._

That's next.

**[END — 14:59]**

---

## 1 · HYPERFRAME ASSET SPECS

Every card is authored natively at **1920 × 960**, one paused GSAP timeline
registered on `window.__timelines["main"]`, GSAP vendored locally.

| #   | DATA key                               | Type      | Dur       | Layout                              | Focal moment                  |
| --- | -------------------------------------- | --------- | --------- | ----------------------------------- | ----------------------------- |
| 1   | `HARDWARE_LIMITATION_16x16_GRID`       | ITEM_CARD | **7s** ⬆  | 512px grid left · spec column right | Mustache row lights crimson   |
| 2   | `MIYAMOTO_1980_TO_1985_EVOLUTION`      | TIMELINE  | 6s        | Full-bleed horizontal rail, 5 nodes | 1981 node lifts off rail      |
| 3   | `DONKEY_KONG_HARDWARE_SPECS`           | ITEM_CARD | 7s        | 4-row spec table, gold spine        | Sprite-memory row             |
| 4   | `SPRITE_PIXEL_DIAGRAM_NOSE_MUSTACHE`   | ITEM_CARD | 6s        | 3× zoom on face rows 3–7            | Mouth attempt → smudge → bar  |
| 5   | `RADAR_SCOPE_TO_DONKEY_KONG_FLOW`      | TIMELINE  | **7s** ⬆  | Inventory bar 3000 → 2000 → 0       | Unsold block turns crimson    |
| 6   | `POPEYE_LICENSING_FALLBACK_FLOW`       | TIMELINE  | 6s        | 3 paired cast cards, crossfade swap | Licence stamp struck through  |
| 7   | `SUPER_MARIO_BROS_WORLD_1_1_FULL_GRID` | MAP_ZOOM  | 8s        | Full 1-1 strip, pan + 2.4× zoom     | Zoom settles on block cluster |
| 8   | `QUESTION_BLOCK_TEACHING_ORDER`        | ITEM_CARD | **7s** 🆕 | 2-step order diagram                | Coin → then mushroom          |
| 9   | `SILHOUETTE_1981_VS_2026`              | ITEM_CARD | 6s        | Split, 16×16 vs modern outline      | Shared silhouette overlay     |
| 10  | `ZELDA_NES_OVERWORLD_MAP_TRANSITION`   | MAP_ZOOM  | 6s        | 1-1 line dissolves to open grid     | The line disappears           |

⬆ = duration raised from blueprint · 🆕 = new card required by the corrected
World 1-1 sequence

### Shared motion contract

| Beat (rel.) | Action                                             | Ease         |
| ----------- | -------------------------------------------------- | ------------ |
| 0.20        | Eyebrow + focal dot                                | `power3.out` |
| 0.45        | Headline, per-line mask reveal                     | `power4.out` |
| 0.60        | Diagram substrate establishes (staggered)          | `power2.out` |
| 1.90        | Figure resolves in neutral — nothing explained yet | `power2.out` |
| 2.70+       | Callouts land in sequence, ~1.1s apart             | `power3.out` |
| −1.3        | Verdict line                                       | `power3.out` |
| −0.9        | `[SOURCE_CITATION]` strip                          | `power3.out` |

A slow background drift runs the full length of every card so no frame is ever
static. Never put two `from` tweens on one element — the second records the
first's build-time state as its end value and the element collapses to nothing.

---

## 2 · AUDIO & BEAT MAP

`[BEAT_SNAP]` points, for the Librosa downbeat array. Snap the **preceding**
transition to the nearest downbeat; tolerance ±180 ms before it reads as a
sync error.

| #   | Timecode | Transition                                                    |
| --- | -------- | ------------------------------------------------------------- |
| 1   | 0:12     | Cold open turn — "Every one of those choices was an accident" |
| 2   | 0:44     | Into open loop timeline                                       |
| 3   | 2:05     | Into problem one                                              |
| 4   | 5:34     | Into Radar Scope                                              |
| 5   | 9:04     | Into World 1-1 map zoom                                       |
| 6   | 14:12    | Into Zelda transition                                         |

`[OBSERVATION_PAUSE]` drops narration and lifts game SFX +6 dB — 4 instances,
8s total, at 0:00, 4:32, 7:48, 11:20. Two of these sit inside the retention
trough by design: silence is the cheapest attention reset available.

---

## 3 · CITATIONS

| REF    | Source                                          | Used at    | Status              |
| ------ | ----------------------------------------------- | ---------- | ------------------- |
| REF-01 | Miyamoto 1999 Kyoto Interview (shmuplations)    | 0:08       | ✅ primary          |
| REF-02 | _Game Over_, David Sheff (1993)                 | 0:52, 5:36 | ✅ **now cited**    |
| REF-03 | Iwata Asks — Super Mario Bros.                  | —          | ⚠️ **orphaned**     |
| REF-04 | Miyamoto profile (nintendo.fandom.com)          | —          | ❌ **replace**      |
| REF-05 | Z80 architecture & arcade palettes              | 1:32       | ✅                  |
| REF-06 | The Spriters Resource — Donkey Kong 1981        | 3:40       | ✅ primary artefact |
| REF-07 | King Features / Popeye licensing                | 6:40       | ⚠️ verify URL       |
| REF-08 | Tukwila warehouse history (HistoryLink)         | 8:10       | ✅                  |
| REF-09 | Miyamoto breaks down World 1-1 (Eurogamer 2015) | 9:04       | ✅                  |
| REF-10 | Legend of Zelda Famicom notes                   | 14:16      | ✅                  |

**Three citation problems in the blueprint:**

1. **REF-04 is a Fandom wiki.** A user-editable wiki cannot carry a factual
   claim in a channel whose whole brand is rigour. Replace with the Iwata Asks
   session (REF-03), which is first-party Nintendo and currently unused.
2. **REF-02 and REF-03 were listed but never cited inline.** REF-02 is now the
   backbone of the Radar Scope segment. REF-03 should absorb REF-04's job.
3. **Two URLs need checking before publish** — `popeye.com/history/` and the
   Eurogamer permalink. I could not verify either from here.

---

## 4 · FACT-CHECK — ISSUES FOUND IN THE BLUEPRINT

### 🔴 Corrected — factual error

**"Jumping makes Mario hit the ? block, releasing a Super Mushroom."**
False. The first lone `?` block in World 1-1 yields a **coin**. The Super
Mushroom is in the block cluster _after_ it. This is not a nitpick — the coin
coming first _is_ the teaching design, and it's the strongest point in the
segment. The blueprint's version deletes the thing that makes World 1-1 clever
and hands a comment section an easy correction. Script rewritten, and a new
`QUESTION_BLOCK_TEACHING_ORDER` card added.

### 🟠 Softened — overstated claim

**"the hardware physically couldn't render a human mouth."**
Overreach. The hardware could render dark pixels wherever it liked. What it
couldn't do was render a mouth _legibly_ at that scale alongside a nose. Since
this is the thesis line of the cold open, it needs to survive a hostile reply —
now "at that size, a mouth was unreadable."

### 🟠 Flagged — repeated-but-thin

**The Mario Segale confrontation.** Widely repeated for forty years; specifics
vary by telling and Segale largely declined to discuss it before his death in 2018. Kept, but explicitly framed in the narration as _the story rather than
the record_.

### 🟡 Resolved — internal inconsistency

Stage 2 promises World 1-1 teaches "in four seconds"; Stage 4 says "in 10
seconds." Both now used deliberately: **four seconds** for the first lesson
(jump kills), **ten seconds** for the full four-rule scheme.

### 🟡 Sprite-size nuance

16×16 is correct for Donkey Kong. Note that in _Super Mario Bros._ small Mario
is 16×16 but **Super Mario is 16×32** — so do not run 1981 hardware claims over
1985 Super Mario footage. Cut B-roll accordingly.

### 🟢 Added — the missing beat

**Radar Scope.** The blueprint jumps straight to Popeye and never says _why
Donkey Kong was commissioned at all._ Nintendo of America had ~2,000 unsold
cabinets from a ~3,000 run; Arakawa asked Yamauchi for a replacement game to
convert them, and Yamauchi assigned Miyamoto. This is the commercial pressure
that produced every constraint in Chapter I — without it, "Miyamoto sat down to
make a game" has no stakes. It also gives orphaned REF-02 a job.

### ⚖️ Rights note

`[HYPERFRAME]` graphics must be **original diagrams**, not traced Nintendo
sprite art — the demo card ships an original blocky figure, not Mario's actual
sprite. Gameplay B-roll under `[SLOW_REPLAY]` / `[SPOTLIGHT]` is ordinary
commentary usage and is a separate question from redrawing owned character art
into your own motion graphics.

---

## 5 · YOUTUBE DESCRIPTION EXPORT

```
📚 SOURCES & ARCHIVAL REFERENCES

[1] Miyamoto 1999 Kyoto Interview Archives
    https://shmuplations.com/miyamoto1999/
[2] "Game Over" — David Sheff (1993)
    https://archive.org/details/gameoverhowninten00shef
[3] Iwata Asks: Super Mario Bros. Developer Session
    https://www.nintendo.com/iwata-asks/super-mario-bros/
[4] Z80 Hardware Architecture & Arcade Palettes
    https://www.system16.com/hardware.php?id=620
[5] The Spriters Resource — Donkey Kong (1981)
    https://www.spriters-resource.com/arcade/donkeykong/
[6] King Features Licensing & Popeye Arcade History
    [VERIFY URL BEFORE PUBLISH]
[7] Nintendo of America Tukwila Warehouse History
    https://www.historylink.org/File/21124
[8] Shigeru Miyamoto Breaks Down World 1-1 (Eurogamer, 2015)
    https://www.eurogamer.net/miyamoto-world-1-1-super-mario-bros
[9] Radar Scope — production run & Donkey Kong conversion
    https://en.wikipedia.org/wiki/Radar_Scope
[10] 1986 Legend of Zelda Production & Famicom Notes
    https://www.nintendo.co.jp/clv/manuals/en/pdf/CLV-P-NAANE.pdf
```

Fandom wiki removed from the citation list.
