import type { Area, Point } from "react-easy-crop";

export type CropPixels = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const OUTPUT_SIZE = 256;

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);
    if (!url.startsWith("blob:")) {
      image.crossOrigin = "anonymous";
    }
    image.src = url;
  });
}

export async function getCroppedCircularBlob(
  imageSrc: string,
  pixelCrop: CropPixels,
  outputSize = OUTPUT_SIZE,
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.clearRect(0, 0, outputSize, outputSize);
  ctx.save();
  ctx.beginPath();
  ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputSize,
    outputSize,
  );
  ctx.restore();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to create image blob"));
      },
      "image/png",
      0.92,
    );
  });
}

export function areaToPixels(
  imageWidth: number,
  imageHeight: number,
  crop: Area,
): CropPixels {
  return {
    x: Math.round((crop.x / 100) * imageWidth),
    y: Math.round((crop.y / 100) * imageHeight),
    width: Math.round((crop.width / 100) * imageWidth),
    height: Math.round((crop.height / 100) * imageHeight),
  };
}

export type { Area, Point };
