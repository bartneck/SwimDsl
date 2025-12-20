import fetchFonts from "./fetchFonts.ts";
import generateSef from "./src/generateSef.ts";

async function main(): Promise<void> {
  const scriptPath = process.argv[1];

  const deployedBaseUrl = scriptPath.startsWith("/home/runner")
    ? "https://bartneck.github.io/SwimDsl"
    : "http://localhost:5173";

  const sef = generateSef(deployedBaseUrl).then(() => {
    console.log(`Wrote SEF file`);
  });

  const fonts = fetchFonts();

  await Promise.all([sef, fonts]);
}

await main();
