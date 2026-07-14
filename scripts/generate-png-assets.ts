import fs from "node:fs";
import path from "node:path";

import { Resvg } from "@resvg/resvg-js";

const ASSETS_DIR = path.join(process.cwd(), "public/assets/signatures");
const SCALE = 2;

function getSvgDimensions(svg: string): { width: number; height: number } {
  const widthMatch = svg.match(/\bwidth="([\d.]+)/);
  const heightMatch = svg.match(/\bheight="([\d.]+)/);
  const viewBoxMatch = svg.match(/viewBox="[\d.]+ [\d.]+ ([\d.]+) ([\d.]+)"/);

  const width = widthMatch ? Number(widthMatch[1]) : Number(viewBoxMatch?.[1] ?? 60);
  const height = heightMatch ? Number(heightMatch[1]) : Number(viewBoxMatch?.[2] ?? 60);

  return { width, height };
}

function normalizeSvgForResvg(svg: string): string {
  // Figma exports use CSS variables like fill="var(--fill-0, #25A3D9)".
  // resvg does not resolve var(), so inline the fallback color before rasterizing.
  return svg.replace(/var\(--[^,)]+,\s*([^)]+)\)/g, (_, fallback: string) => fallback.trim());
}

function convertSvgToPng(svgPath: string): void {
  const rawSvg = fs.readFileSync(svgPath, "utf8");
  const svg = normalizeSvgForResvg(rawSvg);
  const { width, height } = getSvgDimensions(svg);
  const targetWidth = Math.round(width * SCALE);
  const targetHeight = Math.round(height * SCALE);

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: targetWidth,
    },
  });

  const pngData = resvg.render();
  const pngPath = svgPath.replace(/\.svg$/i, ".png");
  fs.writeFileSync(pngPath, pngData.asPng());

  console.log(
    `Wrote ${path.basename(pngPath)} (${targetWidth}x${targetHeight}, source ${width}x${height})`,
  );
}

const svgFiles = fs
  .readdirSync(ASSETS_DIR)
  .filter((file) => file.endsWith(".svg") && !file.includes(" "))
  .sort();

for (const file of svgFiles) {
  convertSvgToPng(path.join(ASSETS_DIR, file));
}
