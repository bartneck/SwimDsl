/**
 * Generate a compiled SEF JSON file from the latest version of the swiML XSL
 * file which is to be deployed at the specified base URL.
 *
 * Usage: node generateSef.ts DEPLOYED_BASE_URL
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

import { computeChecksum, type SefObject } from "./computeChecksum.ts";

const MASTER_XSL_URL =
  "https://raw.githubusercontent.com/bartneck/swiML/refs/heads/main/swiML.xsl";
const SEF_FILE_NAME = "swiML.sef.json";
const STATIC_HTTP_DIR = "public";

/**
 * Updates the SEF JSON string by replacing the static HTTP URI with the deployed base URL.
 *
 * @param sefString - The string content of the generated SEF JSON file
 * @param staticHttpUri - The string in the SEF file to replace
 * @param deployedBaseUrl - The string to replace `staticHttpUri`
 * @returns The updated SEF JSON string
 */
function updateSef(
  sefString: string,
  staticHttpUri: string,
  deployedBaseUrl: string,
): string {
  // Replace references to the XSL file with the hosted instance
  const updatedSefContent = sefString.replace(
    new RegExp(staticHttpUri, "g"),
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
 * Downloads the XSL file from the specified URL.
 *
 * @param url - The URL for the XSL file
 * @param destinationPath - The file path to download the file to.
 */
async function downloadXsl(
  url: string,
  destinationPath: string,
): Promise<void> {
  console.log(`Downloading ${url}...`);
  const response = await fetch(url);
  if (!response.ok) {
    process.exit(`Failed to download ${url}: ${response.statusText}`);
  }
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(destinationPath, Buffer.from(buffer));
  console.log(`Downloaded to ${destinationPath}`);
}

async function main(): Promise<void> {
  const deployedBaseUrl = process.argv[2];

  if (!deployedBaseUrl) {
    console.error("Usage: node generateSef.ts DEPLOYED_BASE_URL");
    process.exit(1);
  }

  const xslFileName = path.basename(MASTER_XSL_URL);
  const xslFilePath = path.join(STATIC_HTTP_DIR, xslFileName);
  const sefFilePath = path.join(STATIC_HTTP_DIR, SEF_FILE_NAME);
  const staticHttpUri = `file://${path.resolve(STATIC_HTTP_DIR)}`;

  // Download the latest version of the swiML XSL transformation schema
  if (!fs.existsSync(xslFilePath)) {
    await downloadXsl(MASTER_XSL_URL, xslFilePath);
  }

  execSync(
    `node node_modules/xslt3/xslt3.js -xsl:"${xslFilePath}" -export:"${sefFilePath}" -t -ns:##html5 -nogo`,
    {
      stdio: "inherit",
    },
  );

  const sefContent = fs.readFileSync(sefFilePath, "utf8");
  const updatedSefContent = updateSef(
    sefContent,
    staticHttpUri,
    deployedBaseUrl,
  );
  fs.writeFileSync(sefFilePath, updatedSefContent);
  console.log(`Overwrote SEF file to ${sefFilePath}`);
}

await main();
