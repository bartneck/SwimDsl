#!/usr/bin/env node
/**
 * sef-checksum.js
 *
 * Compute (and optionally verify) the checksum of a Saxon‑JS SEF file.
 *
 * Usage:
 *   ./computeChecksum.ts path/to/file.sef.json   # prints the computed checksum
 *   ./computeChecksum.ts -v path/to/file.sef.json   # also reports match/mismatch
 *
 * The algorithm is a faithful recreation of the one shipped with Saxon‑JS 2
 * (see the de‑obfuscated function `verifyChecksum` in the previous answer).
 */

"use strict";
import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// Helper: simple rolling hash used by the checksum algorithm.
// ---------------------------------------------------------------------------
function hashString(str: string, seed: number) {
  seed <<= 8; // shift left 8 bits first
  for (let i = 0; i < str.length; i++) {
    seed = (seed << 1) + str.charCodeAt(i);
  }
  return seed;
}

// ---------------------------------------------------------------------------
// Helper: XOR two hashes that share the same seed.
// ---------------------------------------------------------------------------
function xorHashes(a: string, b: string, seed: number) {
  return hashString(a, seed) ^ hashString(b, seed);
}

// ---------------------------------------------------------------------------
// Recursive walker that updates the global checksum.
// ---------------------------------------------------------------------------
function walk(node, state) {
  // state.checksum  – accumulated integer checksum
  // state.counter   – monotonically increasing seed for the hash functions

  // Mix the node's own identifier (node.N) together with the fixed namespace.
  state.checksum ^= xorHashes(
    node.N,
    "http://ns.saxonica.com/xslt/export",
    state.counter++,
  );

  // Walk over every own enumerable property except the ones we deliberately skip.
  for (const prop in node) {
    if (!Object.prototype.hasOwnProperty.call(node, prop)) continue;

    // Skip meta‑properties that are not part of the checksum calculation.
    if (
      prop === "N" ||
      prop === "C" ||
      prop === "ELAB" ||
      prop === "PUSH" ||
      prop === "parentNode" ||
      (node.N === "catch" && prop === "test") ||
      prop === String.fromCharCode(931) // the Σ checksum field itself
    ) {
      continue;
    }

    // Hash the property name (as a string) and its value.
    state.checksum ^= xorHashes(prop, "", state.counter);
    state.checksum ^= hashString(String(node[prop]), state.counter);
  }

  // Recurse into child nodes, if any.
  if (Array.isArray(node.C)) {
    node.C.forEach((child) => walk(child, state));
  }

  // Final mixing step for this node.
  state.checksum ^= 1;
}

// ---------------------------------------------------------------------------
// Main driver – reads the file, runs the algorithm, prints results.
// ---------------------------------------------------------------------------
function computeChecksum(sefObject) {
  const state = { checksum: 0, counter: 0 };
  walk(sefObject, state);

  // Convert signed 32‑bit integer to unsigned representation and then to hex.
  const unsigned = state.checksum >>> 0; // >>> 0 forces unsigned 32‑bit
  return unsigned.toString(16);
}

// ---------------------------------------------------------------------------
// CLI handling
// ---------------------------------------------------------------------------
function printHelpAndExit() {
  console.error(`Usage:
  ${path.basename(process.argv[1])} [-v] <path-to-sef-json>

Options:
  -v    Verify the checksum stored inside the SEF (property Σ) and report match/mismatch.
`);
  process.exit(1);
}

(async () => {
  const args = process.argv.slice(2);
  if (args.length === 0) printHelpAndExit();

  let verify = false;
  let filePath;

  // Simple flag parsing (only -v supported)
  if (args[0] === "-v") {
    verify = true;
    filePath = args[1];
  } else {
    filePath = args[0];
  }

  if (!filePath) {
    console.error("Error: No SEF file supplied.");
    printHelpAndExit();
  }

  // Load the SEF file – Saxon‑JS SEFs are plain JSON.
  let raw;
  try {
    raw = await fs.promises.readFile(filePath, "utf8");
  } catch (e) {
    console.error(`Failed to read "${filePath}": ${e.message}`);
    process.exit(2);
  }

  let sefObj;
  try {
    sefObj = JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to parse JSON from "${filePath}": ${e.message}`);
    process.exit(3);
  }

  // Compute the checksum.
  const computedHex = computeChecksum(sefObj);
  console.log(computedHex);

  if (verify) {
    const stored = sefObj[String.fromCharCode(931)] || "unspecified";
    if (stored === "unspecified") {
      console.warn("⚠️  No checksum (Σ) stored inside the SEF.");
    } else if (stored.toLowerCase() === computedHex.toLowerCase()) {
      console.log("✅  Stored checksum matches the computed value.");
    } else {
      console.error(
        `❌  MISMATCH – stored: ${stored}, computed: ${computedHex}`,
      );
      process.exit(4);
    }
  }
})();
