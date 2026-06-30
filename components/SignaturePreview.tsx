"use client";

import { useMemo } from "react";

import {
  buildSignatureRenderData,
  renderSignature,
} from "@/lib/renderSignature";
import { getSampleDataForSignature, type BrandId } from "@/templates/brands";
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
  /** White background for copy-friendly preview (e.g. Outlook). */
  copyable?: boolean;
};

export function SignaturePreview({
  html,
  data,
  className = "",
  copyable = false,
}: SignaturePreviewProps) {
  const rendered = useMemo(
    () => renderSignature(html, data),
    [html, data],
  );

  return (
    <div
      className={`preview-panel ${copyable ? "preview-panel-copyable" : ""} ${className}`}
    >
      <div dangerouslySetInnerHTML={{ __html: rendered }} />
    </div>
  );
}

export function SignaturePreviewSample({
  html,
  brandId,
  wantsHeadshot = false,
  templateId,
  className,
}: {
  html: string;
  brandId?: BrandId;
  wantsHeadshot?: boolean;
  templateId?: string;
  className?: string;
}) {
  const baseUrl = useAssetBaseUrl();

  const data = useMemo(() => {
    if (brandId) {
      const sample = getSampleDataForSignature(brandId, wantsHeadshot, baseUrl);
      return buildSignatureRenderData(sample, {
        brandId,
        headshotUrl: sample.headshotUrl,
        baseUrl,
      });
    }

    if (templateId) {
      return getSampleDataForTemplate(templateId, baseUrl);
    }

    return { ...SAMPLE_DATA, baseUrl };
  }, [brandId, wantsHeadshot, templateId, baseUrl]);

  return (
    <SignaturePreview html={html} data={data} className={className} />
  );
}
