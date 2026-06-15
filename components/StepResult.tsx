"use client";

import { useMemo, useState } from "react";

import { SignaturePreview } from "@/components/SignaturePreview";
import { useWizard } from "@/components/WizardContext";
import { prepareSignatureData, renderSignature } from "@/lib/renderSignature";

type StepResultProps = {
  onBack: () => void;
};

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  }
}

export function StepResult({ onBack }: StepResultProps) {
  const { selectedTemplate, state, reset } = useWizard();
  const [copied, setCopied] = useState(false);
  const [showHtml, setShowHtml] = useState(false);

  const signatureData = useMemo(() => {
    const data: Record<string, string> = {
      ...state.formData,
      baseUrl: window.location.origin,
    };
    if (state.headshotUrl) {
      data.headshotUrl = state.headshotUrl;
    }
    return prepareSignatureData(data);
  }, [state.formData, state.headshotUrl]);

  const renderedHtml = useMemo(() => {
    if (!selectedTemplate) return "";
    return renderSignature(selectedTemplate.html, signatureData);
  }, [selectedTemplate, signatureData]);

  const handleCopy = async () => {
    const success = await copyToClipboard(renderedHtml);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!selectedTemplate) {
    return <p className="amelia-body">No template selected.</p>;
  }

  return (
    <div>
      <h2 className="amelia-heading-4">Your signature</h2>
      <p className="amelia-body mt-1">
        Copy the HTML below and paste it into your email client&apos;s signature
        settings.
      </p>

      <div className="mt-6">
        <p className="amelia-label mb-2">Preview</p>
        <SignaturePreview
          html={selectedTemplate.html}
          data={signatureData}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={handleCopy} className="btn-primary">
          {copied ? "Copied!" : "Copy HTML to clipboard"}
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
