export type SefObject = Record<string, string> & {
  C?: SefObject[];
};

/**
 * Rolling hash used by the checksum algorithm.
 *
 * @param str - The string to compute the hash of.
 * @param seed - Numeric hashing seed.
 *
 * @returns The numeric hash of `str`.
 */
function hashString(str: string, seed: number): number {
  seed <<= 8;
  for (let i = 0; i < str.length; i++) {
    seed = (seed << 1) + str.charCodeAt(i);
  }
  return seed;
}

/**
 * Combine the hashes of two strings
 *
 * @param a - A string to hash.
 * @param b - A string to hash.
 * @param seed - The numeric hashing seed used for both hashes.
 *
 * @returns The bitwise exclusive or of the hashes of `a` and `b`.
 */
function xorHashes(a: string, b: string, seed: number): number {
  return hashString(a, seed) ^ hashString(b, seed);
}

/**
 * Recursive walker that updates the global checksum.
 *
 * @param node - The SEF object to walk through.
 * @param state - An object keeping track of the checksum.
 *     state.checksum – accumulated integer checksum.
 *     state.counter – monotonically increasing seed for the hash functions.
 */
function walk(
  node: SefObject,
  state: { checksum: number; counter: number },
): void {
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
 * @param sefObject - Object to compute the checksum of.
 *
 * @returns The checksum of `sefObject` as a string.
 */
export default function computeChecksum(sefObject: SefObject): string {
  const state = { checksum: 0, counter: 0 };
  walk(sefObject, state);

  // Convert signed 32‑bit integer to unsigned representation and then to hex.
  const unsigned = state.checksum >>> 0; // >>> 0 forces unsigned 32‑bit
  return unsigned.toString(16);
}
