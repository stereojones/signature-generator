"use client";

import { useMemo, useState } from "react";

import { GmailInstructions } from "@/components/GmailInstructions";
import { OutlookInstructions } from "@/components/OutlookInstructions";
import { SignaturePreview } from "@/components/SignaturePreview";
import { useWizard } from "@/components/WizardContext";
import {
  buildSignatureRenderData,
  renderSignature,
} from "@/lib/renderSignature";
import {
  copySignatureForOutlook,
  copySignatureHtml,
} from "@/lib/signatureClipboard";

type StepResultProps = {
  onBack: () => void;
};

type CopyFeedback = "html" | "signature" | null;

export function StepResult({ onBack }: StepResultProps) {
  const { selectedSignature, selectedBrand, state, reset } = useWizard();
  const [copied, setCopied] = useState<CopyFeedback>(null);
  const [showHtml, setShowHtml] = useState(false);
  const [showOutlookInstructions, setShowOutlookInstructions] = useState(false);
  const [showGmailInstructions, setShowGmailInstructions] = useState(false);

  const signatureData = useMemo(() => {
    if (!state.brandId) return {};
    return buildSignatureRenderData(state.formData, {
      brandId: state.brandId,
      headshotUrl: state.headshotUrl,
      baseUrl: window.location.origin,
    });
  }, [state.brandId, state.formData, state.headshotUrl]);

  const renderedHtml = useMemo(() => {
    if (!selectedSignature) return "";
    return renderSignature(selectedSignature.html, signatureData);
  }, [selectedSignature, signatureData]);

  const showCopyFeedback = (type: CopyFeedback) => {
    setCopied(type);
    setTimeout(() => setCopied(null), 2500);
  };

  const handleCopyHtml = async () => {
    const success = await copySignatureHtml(renderedHtml);
    if (success) showCopyFeedback("html");
  };

  const handleCopySignature = async () => {
    const success = await copySignatureForOutlook(renderedHtml);
    if (success) showCopyFeedback("signature");
  };

  if (!selectedSignature || !selectedBrand) {
    return <p className="amelia-body">No brand selected.</p>;
  }

  return (
    <div>
      <h2 className="amelia-heading-4">Your signature</h2>
      <p className="amelia-body mt-1">
        Copy your signature using the option that matches your email client.
      </p>

      <div className="mt-6">
        <p className="amelia-label mb-2">Preview</p>
        <SignaturePreview
          html={selectedSignature.html}
          data={signatureData}
          copyable
        />
      </div>

      <div className="mt-6 space-y-4">
        <div className="rounded-[4px] border border-border bg-surface p-4">
          <p className="amelia-label">Outlook and Gmail</p>
          <p className="amelia-body mt-1">
            Copy the formatted signature below, then paste into your email
            client&apos;s signature editor.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCopySignature}
              className="btn-primary"
            >
              {copied === "signature" ? "Copied!" : "Copy Signature"}
            </button>
            <button
              type="button"
              onClick={() => setShowOutlookInstructions((v) => !v)}
              className="btn-secondary"
            >
              {showOutlookInstructions
                ? "Hide Outlook instructions"
                : "View instructions for Microsoft Outlook"}
            </button>
            <button
              type="button"
              onClick={() => setShowGmailInstructions((v) => !v)}
              className="btn-secondary"
            >
              {showGmailInstructions
                ? "Hide Gmail instructions"
                : "View instructions for Gmail"}
            </button>
          </div>
          <OutlookInstructions open={showOutlookInstructions} />
          <GmailInstructions open={showGmailInstructions} />
        </div>

        <div className="rounded-[4px] border border-border bg-surface p-4">
          <p className="amelia-label">Front and other clients</p>
          <p className="amelia-body mt-1">
            Front and similar clients can use the HTML source directly.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCopyHtml}
              className="btn-primary"
            >
              {copied === "html" ? "Copied!" : "Copy HTML to clipboard"}
            </button>
            <button
              type="button"
              onClick={() => setShowHtml((v) => !v)}
              className="btn-secondary"
            >
              {showHtml ? "Hide HTML" : "View HTML source"}
            </button>
          </div>

          {showHtml && (
            <textarea
              readOnly
              value={renderedHtml}
              rows={12}
              className="input-field mt-4 font-mono text-xs"
              onFocus={(e) => e.target.select()}
            />
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button type="button" onClick={onBack} className="btn-secondary">
          Back
        </button>
        <button type="button" onClick={reset} className="btn-secondary">
          Start over
        </button>
      </div>
    </div>
  );
}
