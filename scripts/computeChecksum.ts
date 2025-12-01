#!/usr/bin/env node
/**
 * Compute the checksum of a Saxon‑JS SEF file and print it to stdout.
 *
 * Usage: ./computeChecksum.ts path/to/file.sef.json
 */

import fs from "fs";
import path from "path";

type SefObject = Record<string, string> & {
  C?: SefObject[];
};

/**
 * Rolling hash used by the checksum algorithm.
 *
 * @param str The string to compute the hash of.
 * @param seed Numeric hashing seed.
 */
function hashString(str: string, seed: number) {
  seed <<= 8;
  for (let i = 0; i < str.length; i++) {
    seed = (seed << 1) + str.charCodeAt(i);
  }
  return seed;
}

/**
 * Combine the hashes of two strings
 *
 * @param a A string to hash.
 * @param b A string to hash.
 * @param seed The numeric hashing seed used for both hashes.
 */
function xorHashes(a: string, b: string, seed: number) {
  return hashString(a, seed) ^ hashString(b, seed);
}

/**
 * Recursive walker that updates the global checksum.
 *
 * @param node The SEF object to walk through.
 * @param state An object keeping track of the checksum.
 *     state.checksum  – accumulated integer checksum
 *     state.counter   – monotonically increasing seed for the hash functions
 */
function walk(node: SefObject, state: { checksum: number; counter: number }) {
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
    state.checksum ^= hashString(node[prop], state.counter);
  }

  // Recurse into child nodes, if any.
  if (Array.isArray(node.C)) {
    node.C.forEach((child) => {
      walk(child, state);
    });
  }

  // Final mixing step for this node.
  state.checksum ^= 1;
}

/**
 * Compute the checksum value of the given SEF object.
 *
 * @param sefObject Object to compute the checksum of.
 * @returns The checksum of `sefObject` as a string.
 */
function computeChecksum(sefObject: SefObject): string {
  const state = { checksum: 0, counter: 0 };
  walk(sefObject, state);

  // Convert signed 32‑bit integer to unsigned representation and then to hex.
  const unsigned = state.checksum >>> 0; // >>> 0 forces unsigned 32‑bit
  return unsigned.toString(16);
}

/**
 * Parse the SEF JSON file pathe from command line arguments.
 *
 * @returns The path to the SEF JSON file specified by the user.
 */
function parseFilePathFromArguments(): string {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error(
      `Usage: ${path.basename(process.argv[1])} <path-to-sef-json>`,
    );
    process.exit(1);
  }

  const filePath = args[0];
  if (!filePath) {
    console.error("Error: No SEF file supplied.");
    console.error(
      `Usage: ${path.basename(process.argv[1])} <path-to-sef-json>`,
    );
    process.exit(1);
  }

  return filePath;
}

/**
 * Read the SEF JSON file provided in the command line arguments, runs the
 * checksum algorithm, and print it to stdout.
 */
async function main() {
  const filePath = parseFilePathFromArguments();

  // Load the SEF file – Saxon‑JS SEFs are plain JSON.
  let raw;
  try {
    raw = await fs.promises.readFile(filePath, "utf8");
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(`Failed to read "${filePath}": ${message}`);
    process.exit(2);
  }

  let sefObj;
  try {
    sefObj = JSON.parse(raw) as SefObject;
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(`Failed to parse JSON from "${filePath}": ${message}`);
    process.exit(3);
  }

  // Compute the checksum.
  const computedHex = computeChecksum(sefObj);
  console.log(computedHex);
}

await main();
