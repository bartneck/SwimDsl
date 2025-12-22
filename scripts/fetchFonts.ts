import fs from "node:fs";
import { fileURLToPath } from "node:url";

import downloadRelativeUrls from "./src/downloadRelativeUrls.ts";
import extractFontUrls from "./src/extractFontUrls.ts";

const CSS_URL = "https://swiml.org/swiML.css";

export default async function main(): Promise<void> {
  console.log("Fetching swiML.css");

  const response = await fetch(CSS_URL);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch CSS from ${CSS_URL}: ${response.status} ${response.statusText}`,
    );
  }

  const cssContent = await response.text();
  const urls = extractFontUrls(cssContent);

  const cssFile = fs.promises.writeFile("public/swiML.css", cssContent);
  const fontFiles = downloadRelativeUrls(urls, "https://swiml.org", "public");

  console.log("Fetching fonts referenced in swiML.css");
  await Promise.all([cssFile, fontFiles]);
  console.log("Downloaded all fonts");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
