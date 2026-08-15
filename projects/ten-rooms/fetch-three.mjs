#!/usr/bin/env node
/**
 * Vendor three.js into assets/.
 *
 *   node projects/ten-rooms/fetch-three.mjs
 *
 * Why this exists rather than a committed file: every build of three ships
 * well over the repo's 500 KB non-LFS limit (`scripts/check-large-files.sh`)
 * — the smallest is `three.module.min.js` at 687 KB — so `assets/three.*.js`
 * is gitignored and restored with this script instead.
 *
 * Why not a CDN at runtime: jsdelivr and unpkg are both blocked by the agent
 * proxy here (403), and the determinism contract bans render-time network
 * fetches for required assets anyway. registry.npmjs.org is reachable, so the
 * tarball is the supply route.
 */

import { createWriteStream } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const HERE = dirname(fileURLToPath(import.meta.url));
const VERSION = "0.169.0";
const WANT = "package/build/three.module.js";

const tgz = join(HERE, ".three.tgz");
await mkdir(join(HERE, "assets"), { recursive: true });

const url = `https://registry.npmjs.org/three/-/three-${VERSION}.tgz`;
process.stderr.write(`fetching three@${VERSION}…\n`);
const res = await fetch(url);
if (!res.ok) throw new Error(`registry returned ${res.status} for ${url}`);
await pipeline(Readable.fromWeb(res.body), createWriteStream(tgz));

const out = spawnSync("tar", ["-xzf", tgz, "-C", HERE, WANT], { encoding: "utf8" });
if (out.status !== 0) throw new Error(out.stderr || "tar failed");

spawnSync("mv", [join(HERE, WANT), join(HERE, "assets", "three.module.js")]);
await rm(join(HERE, "package"), { recursive: true, force: true });
await rm(tgz, { force: true });

process.stderr.write(`✓ assets/three.module.js (three@${VERSION})\n`);
