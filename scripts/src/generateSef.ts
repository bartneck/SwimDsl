/**
 * Generate a compiled SEF JSON file from the latest version of the swiML XSL
 * file.
 *
 * Usage: node generateSef.ts
 */

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

import computeChecksum, { type SefObject } from "./computeChecksum.ts";

const MASTER_XSL_URL =
  "https://raw.githubusercontent.com/bartneck/swiML/refs/heads/main/swiML.xsl";
const SEF_FILE_NAME = "swiML.sef.json";
const STATIC_HTTP_DIR = "public";

// The swiML XSL resolves relative document() calls (e.g. its i18n
// translation files) against its own base URI. That base URI is baked into
// the compiled SEF at compile time, so it must be rewritten to point at the
// hosted swiML instance rather than the local file path used to compile it -
// otherwise those relative lookups are resolved against SwimDSL's own
// deployment, where the referenced files don't exist.
const SWIML_HOSTED_BASE_URL = "https://bartneck.github.io/swiML";

/**
 * Updates the SEF JSON string by replacing the static HTTP URI with the
 * hosted swiML base URL.
 *
 * @param sefString - The string content of the generated SEF JSON file.
 * @param staticHttpUri - The string in the SEF file to replace.
 *
 * @returns The updated SEF JSON string.
 */
function updateSef(sefString: string, staticHttpUri: string): string {
  // Replace references to the XSL file with the hosted instance
  const updatedSefContent = sefString.replaceAll(
    staticHttpUri,
    SWIML_HOSTED_BASE_URL,
  );

  const sefObject = JSON.parse(updatedSefContent) as SefObject;

  // Compute the checksum
  const checksum = computeChecksum(sefObject);
  console.log("Computed checksum");

  // Update the Σ field in the JSON
  sefObject["\u03A3"] = checksum;

  return JSON.stringify(sefObject);
}

/**
 * Executes a Node.js script with the specified arguments.
 *
 * @param scriptPath - The path to the Node.js script to execute.
 * @param args - The arguments to pass to the script.
 * @throws {Error} If the script fails to execute or exits with a non-zero status.
 */
function executeNodeScript(scriptPath: string, args: string[]): void {
  const result = spawnSync("node", [scriptPath, ...args], {
    stdio: "inherit",
  });

  if (result.error) {
    throw new Error(
      `Failed to execute ${scriptPath}: ${result.error.message}`,
    );
  }

  if (result.status !== 0) {
    throw new Error(`${scriptPath} exited with code ${result.status}`);
  }
}

/**
 * Downloads the XSL file from the specified URL.
 *
 * @param url - The URL for the XSL file.
 * @param destinationPath - The file path to download the file to.
 */
async function downloadXsl(
  url: string,
  destinationPath: string,
): Promise<void> {
  console.log(`Downloading ${url}...`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to download XSL from ${url}: ${response.status} ${response.statusText}`,
    );
  }
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(destinationPath, Buffer.from(buffer));
  console.log(`Downloaded to ${destinationPath}`);
}

/**
 * Generate a SEF JSON file from the latest version of the swiML XSL transformation.
 */
async function generateSef(): Promise<void> {
  const xslFileName = path.basename(MASTER_XSL_URL);
  const xslFilePath = path.join(STATIC_HTTP_DIR, xslFileName);
  const sefFilePath = path.join(STATIC_HTTP_DIR, SEF_FILE_NAME);
  // Saxon bakes the compiled stylesheet's absolute file-system path into the
  // SEF verbatim (with "\" left unconverted on Windows), so match that
  // exactly rather than producing a spec-compliant file:// URI.
  const staticHttpUri = `file://${path.resolve(STATIC_HTTP_DIR).replace(/\\/g, "/")}`;

  // Download the latest version of the swiML XSL transformation schema
  if (!fs.existsSync(xslFilePath)) {
    await downloadXsl(MASTER_XSL_URL, xslFilePath);
  }

  executeNodeScript("node_modules/xslt3/xslt3.js", [
    `-xsl:${xslFilePath}`,
    `-export:${sefFilePath}`,
    "-t",
    "-ns:##html5",
    "-nogo",
  ]);

  const sefContent = fs.readFileSync(sefFilePath, "utf8");
  const updatedSefContent = updateSef(sefContent, staticHttpUri);

  fs.writeFileSync(sefFilePath, updatedSefContent);
}

export default generateSef;
