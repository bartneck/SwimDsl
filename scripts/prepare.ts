import generateSef from "./src/generateSef.ts";

async function main(): Promise<void> {
  const deployedBaseUrl =
    process.env["CI"] === "true"
      ? "https://bartneck.github.io/SwimDsl"
      : "http://localhost:5173";

  await generateSef(deployedBaseUrl);
  console.log("Wrote SEF file");
}

await main();
