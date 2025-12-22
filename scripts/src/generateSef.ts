/**
 * Generate a compiled SEF JSON file from the latest version of the swiML XSL
 * file which is to be deployed at the specified base URL.
 *
 * Usage: node generateSef.ts DEPLOYED_BASE_URL
 */

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

import computeChecksum, { type SefObject } from "./computeChecksum.ts";

const MASTER_XSL_URL =
  "https://raw.githubusercontent.com/bartneck/swiML/refs/heads/main/swiML.xsl";
const SEF_FILE_NAME = "swiML.sef.json";
const STATIC_HTTP_DIR = "public";

/**
 * Updates the SEF JSON string by replacing the static HTTP URI with the
 * deployed base URL.
 *
 * @param sefString - The string content of the generated SEF JSON file.
 * @param staticHttpUri - The string in the SEF file to replace.
 * @param deployedBaseUrl - The string to replace `staticHttpUri`.
 *
 * @returns The updated SEF JSON string.
 */
function updateSef(
  sefString: string,
  staticHttpUri: string,
  deployedBaseUrl: string,
): string {
  // Replace references to the XSL file with the hosted instance
  const updatedSefContent = sefString.replaceAll(
    staticHttpUri,
    deployedBaseUrl,
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
 *
 * @param deployedBaseUrl - The base URL at which the app will be deployed.
 */
async function generateSef(deployedBaseUrl: string): Promise<void> {
  const xslFileName = path.basename(MASTER_XSL_URL);
  const xslFilePath = path.join(STATIC_HTTP_DIR, xslFileName);
  const sefFilePath = path.join(STATIC_HTTP_DIR, SEF_FILE_NAME);
  const staticHttpUri = `file://${path.resolve(STATIC_HTTP_DIR)}`;

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
  const updatedSefContent = updateSef(
    sefContent,
    staticHttpUri,
    deployedBaseUrl,
  );

  fs.writeFileSync(sefFilePath, updatedSefContent);
}

export default generateSef;
