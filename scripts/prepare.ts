import fetchFonts from "./fetchFonts.ts";
import generateSef from "./src/generateSef.ts";

async function main(): Promise<void> {
  const deployedBaseUrl =
    process.env["CI"] === "true"
      ? "https://bartneck.github.io/SwimDsl"
      : "http://localhost:5173";

  const sef = generateSef(deployedBaseUrl).then(() => {
    console.log(`Wrote SEF file`);
  });

  const fonts = fetchFonts();

  await Promise.all([sef, fonts]);
}

await main();
