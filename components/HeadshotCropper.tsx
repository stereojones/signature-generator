"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

import { getCroppedCircularBlob, type CropPixels } from "@/lib/cropImage";

type HeadshotCropperProps = {
  imageSrc: string;
  previewSize: number;
  onCropComplete: (blob: Blob, previewUrl: string) => void;
  onCancel: () => void;
};

function toCropPixels(area: Area): CropPixels {
  return {
    x: Math.round(area.x),
    y: Math.round(area.y),
    width: Math.round(area.width),
    height: Math.round(area.height),
  };
}

export function HeadshotCropper({
  imageSrc,
  previewSize,
  onCropComplete,
  onCancel,
}: HeadshotCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropPixels | null>(
    null,
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previewRequestRef = useRef(0);

  const onCropAreaChange = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(toCropPixels(croppedAreaPixels));
  }, []);

  const generatePreview = useCallback(
    async (pixels: CropPixels) => {
      const requestId = ++previewRequestRef.current;
      setIsGeneratingPreview(true);
      setError(null);

      try {
        const blob = await getCroppedCircularBlob(imageSrc, pixels);
        if (requestId !== previewRequestRef.current) return;

        const url = URL.createObjectURL(blob);
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      } catch {
        if (requestId === previewRequestRef.current) {
          setError("Failed to generate preview");
        }
      } finally {
        if (requestId === previewRequestRef.current) {
          setIsGeneratingPreview(false);
        }
      }
    },
    [imageSrc],
  );

  useEffect(() => {
    if (!croppedAreaPixels) return;

    const timeoutId = window.setTimeout(() => {
      void generatePreview(croppedAreaPixels);
    }, 150);

    return () => window.clearTimeout(timeoutId);
  }, [croppedAreaPixels, generatePreview]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    setError(null);
    try {
      const blob = await getCroppedCircularBlob(imageSrc, croppedAreaPixels);
      const url = URL.createObjectURL(blob);
      onCropComplete(blob, url);
    } catch {
      setError("Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative h-64 w-full overflow-hidden rounded-[4px] bg-[#333] sm:h-80">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropAreaChange={onCropAreaChange}
        />
      </div>

      <div>
        <label htmlFor="zoom" className="amelia-label">
          Zoom
        </label>
        <input
          id="zoom"
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="mt-1 w-full accent-primary"
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="amelia-label mb-2">Preview</p>
          <div
            className="overflow-hidden rounded-full border-2 border-border bg-surface"
            style={{ width: previewSize, height: previewSize }}
          >
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Crop preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="amelia-helper flex h-full items-center justify-center px-2 text-center">
                {isGeneratingPreview ? "Generating…" : "Adjust crop to preview"}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              if (croppedAreaPixels) void generatePreview(croppedAreaPixels);
            }}
            disabled={!croppedAreaPixels || isGeneratingPreview}
            className="mt-2 text-sm text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGeneratingPreview ? "Updating…" : "Update preview"}
          </button>
        </div>
        <p className="amelia-body sm:flex-1">
          Drag to reposition your photo inside the circle. Use the zoom slider to
          adjust framing. The circular image shown here is what will appear in
          your signature.
        </p>
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      <div className="flex justify-between">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Choose different photo
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isProcessing || !croppedAreaPixels || !previewUrl}
          className="btn-primary"
        >
          {isProcessing ? "Processing…" : "Confirm crop"}
        </button>
      </div>
    </div>
  );
}
