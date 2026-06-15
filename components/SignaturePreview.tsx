"use client";

import { useMemo } from "react";

import { prepareSignatureData, renderSignature } from "@/lib/renderSignature";
import { getSampleDataForTemplate, SAMPLE_DATA } from "@/templates/config";

function useAssetBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return SAMPLE_DATA.baseUrl ?? "";
}

type SignaturePreviewProps = {
  html: string;
  data: Record<string, string>;
  className?: string;
};

export function SignaturePreview({
  html,
  data,
  className = "",
}: SignaturePreviewProps) {
  const baseUrl = useAssetBaseUrl();
  const rendered = useMemo(
    () =>
      renderSignature(html, prepareSignatureData({ ...data, baseUrl })),
    [html, data, baseUrl],
  );

  return (
    <div className={`preview-panel ${className}`}>
      <div dangerouslySetInnerHTML={{ __html: rendered }} />
    </div>
  );
}

export function SignaturePreviewSample({
  html,
  templateId,
  className,
}: {
  html: string;
  templateId?: string;
  className?: string;
}) {
  const baseUrl = useAssetBaseUrl();
  const sampleData = templateId
    ? getSampleDataForTemplate(templateId, baseUrl)
    : SAMPLE_DATA;

  return (
    <SignaturePreview
      html={html}
      data={{ ...sampleData, baseUrl }}
      className={className}
    />
  );
}
