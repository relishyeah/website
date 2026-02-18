#!/usr/bin/env node

import sharp from "sharp";
import { glob } from "glob";
import path from "path";
import fs from "fs";
2;

const INPUT_FOLDER = "src/assets/images"; // Change to where your originals live
const OUTPUT_FOLDER = "public/assets/images"; // Where the low‑quality versions will go
const WIDTH = 50; // width of the LQ versions
const QUALITY = 30; // quality % (lower means smaller)

async function generateLowQuality() {
  if (!fs.existsSync(OUTPUT_FOLDER)) {
    fs.mkdirSync(OUTPUT_FOLDER, { recursive: true });
  }

  const files = glob.sync(`${INPUT_FOLDER}/**/*.{jpg,jpeg,png}`);

  console.log(`Found ${files.length} image(s). Processing…`);

  await Promise.all(
    files.map(async (file) => {
      const relPath = path.relative(INPUT_FOLDER, file);
      const outPath = path.join(OUTPUT_FOLDER, relPath);

      await sharp(file)
        .resize(WIDTH) // scale to a tiny width
        .jpeg({ quality: QUALITY }) // reduce quality
        .toFile(outPath);

      console.log(`Generated LQIP: ${outPath}`);
    }),
  );

  console.log("All done!");
}

generateLowQuality().catch(console.error);
