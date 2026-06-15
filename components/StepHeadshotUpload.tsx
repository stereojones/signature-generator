"use client";

import { useRef, useState } from "react";

import { HeadshotCropper } from "@/components/HeadshotCropper";
import { useWizard } from "@/components/WizardContext";

type StepHeadshotUploadProps = {
  onBack: () => void;
  onNext: () => void;
};

type Phase = "pick" | "crop" | "uploading" | "done";

export function StepHeadshotUpload({ onBack, onNext }: StepHeadshotUploadProps) {
  const { selectedTemplate, setHeadshotUrl, state } = useWizard();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>(state.headshotUrl ? "done" : "pick");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const previewSize = selectedTemplate?.headshotSize?.width ?? 80;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please upload a JPEG, PNG, or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5 MB or smaller.");
      return;
    }

    setError(null);
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setPhase("crop");
  };

  const uploadBlob = async (blob: Blob) => {
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append(
        "file",
        new File([blob], "headshot.png", { type: "image/png" }),
      );

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Upload failed");
      }

      if (!data.url) {
        throw new Error("No URL returned from upload");
      }

      setHeadshotUrl(data.url);
      setPhase("done");
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        const localUrl = URL.createObjectURL(blob);
        setHeadshotUrl(localUrl);
        setPhase("done");
        setError(
          "GCS upload unavailable in local dev — using a temporary preview URL. Deploy to GCP for a hosted headshot link.",
        );
        return;
      }

      setError(err instanceof Error ? err.message : "Upload failed");
      setPhase("crop");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCropComplete = async (blob: Blob) => {
    setPhase("uploading");
    await uploadBlob(blob);
  };

  const handleContinue = () => {
    if (state.headshotUrl) {
      onNext();
    }
  };

  const resetPhoto = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    setHeadshotUrl(null);
    setPhase("pick");
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      <h2 className="amelia-heading-4">Upload headshot</h2>
      <p className="amelia-body mt-1">
        Crop and position your photo. Only the circular avatar will be hosted.
      </p>

      <div className="mt-6">
        {phase === "pick" && (
          <div className="flex flex-col items-center rounded-[4px] border-2 border-dashed border-border bg-surface px-6 py-12">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
              id="headshot-input"
            />
            <label htmlFor="headshot-input" className="btn-primary cursor-pointer">
              Choose photo
            </label>
            <p className="amelia-helper mt-3">JPEG, PNG, or WebP up to 5 MB</p>
          </div>
        )}

        {phase === "crop" && imageSrc && (
          <HeadshotCropper
            imageSrc={imageSrc}
            previewSize={previewSize}
            onCropComplete={handleCropComplete}
            onCancel={resetPhoto}
          />
        )}

        {(phase === "uploading" || isUploading) && (
          <div className="amelia-body flex items-center justify-center py-16">
            Uploading your headshot…
          </div>
        )}

        {phase === "done" && state.headshotUrl && (
          <div className="flex flex-col items-center gap-4 py-6">
            <div
              className="overflow-hidden rounded-full border-2 border-success bg-surface"
              style={{ width: previewSize * 2, height: previewSize * 2 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={state.headshotUrl}
                alt="Uploaded headshot"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="amelia-label text-success">Headshot uploaded successfully</p>
            <button
              type="button"
              onClick={resetPhoto}
              className="text-sm text-primary hover:underline"
            >
              Upload a different photo
            </button>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-error">{error}</p>}
      </div>

      <div className="mt-8 flex justify-between">
        <button type="button" onClick={onBack} className="btn-secondary">
          Back
        </button>
        <button
          type="button"
          onClick={handleContinue}
          disabled={!state.headshotUrl || isUploading}
          className="btn-primary"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
