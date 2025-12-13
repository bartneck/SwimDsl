import fs from "node:fs";

import extractFontUrls from "./src/extractFontUrls.ts";
import downloadRelativeUrls from "./src/downloadRelativeUrls.ts";

const cssUrl = "https://swiml.org/swiML.css";

async function main(): Promise<void> {
  const cssContent = await (await fetch(cssUrl)).text();
  const urls = extractFontUrls(cssContent);

  const cssFile = fs.promises.writeFile("public/swiML.css", cssContent);
  const fontFiles = downloadRelativeUrls(urls, "https://swiml.org", "public");

  await Promise.all([cssFile, fontFiles]);
}

await main();
