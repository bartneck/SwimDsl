import generateSef from "./src/generateSef.ts";

export default async function main(): Promise<void> {
  await generateSef();

  console.log(`Wrote SEF file`);
}

await main();
