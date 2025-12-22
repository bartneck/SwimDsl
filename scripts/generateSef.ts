import path from "node:path";

import generateSef from "./src/generateSef.ts";

export default async function main(): Promise<void> {
  const deployedBaseUrl = process.argv[2];

  if (!deployedBaseUrl) {
    console.error(
      `Usage: node ${path.basename(process.argv[1])} DEPLOYED_BASE_URL`,
    );
    process.exit(1);
  }

  await generateSef(deployedBaseUrl);

  console.log(`Wrote SEF file`);
}

await main();
