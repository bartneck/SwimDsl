import fs from "node:fs";
import { fileURLToPath } from "node:url";

import downloadRelativeUrls from "./src/downloadRelativeUrls.ts";
import extractFontUrls from "./src/extractFontUrls.ts";

const CSS_URL = "https://swiml.org/swiML.css";

export default async function main(): Promise<void> {
  console.log("Fetching swiML.css");
  const cssContent = await (await fetch(CSS_URL)).text();
  const urls = extractFontUrls(cssContent);

  const cssFile = fs.promises.writeFile("public/swiML.css", cssContent);
  const fontFiles = downloadRelativeUrls(urls, "https://swiml.org", "public");

  console.log("Fetching JetBrains fonts");
  await Promise.all([cssFile, fontFiles]);
  console.log("Downloaded all fonts");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
