import { readFile, writeFile } from "node:fs/promises";
import { glob } from "node:fs";

const files = [
  "mobile/app/_layout.tsx",
  "mobile/app/(tabs)/_layout.tsx",
  "mobile/app/(tabs)/index.tsx",
  "mobile/app/(tabs)/categories.tsx",
  "mobile/app/(tabs)/cart.tsx",
  "mobile/app/(tabs)/profile.tsx",
  "mobile/app/product/[id].tsx",
  "mobile/components/screen-container.tsx",
];
const replacements = new Map([
  ["#EEE9DF", "#F5EFC6"],
  ["#C9C1B1", "#4A2E27"],
  ["#2C3B4D", "#A5BCD6"],
  ["#1B2632", "#231815"],
  ["#FFB162", "#F5EFC6"],
  ["#A35139", "#4D0E12"],
]);
for (const file of files) {
  let source = await readFile(file, "utf8");
  for (const [from, to] of replacements) source = source.replaceAll(from, to);
  await writeFile(file, source);
}
