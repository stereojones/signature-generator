"use client";

import { useMemo } from "react";

import { useWizard } from "@/components/WizardContext";
import { SignaturePreviewSample } from "@/components/SignaturePreview";

type StepBrandPickerProps = {
  onNext: () => void;
};

export function StepBrandPicker({ onNext }: StepBrandPickerProps) {
  const { brands, signatures, state, selectBrand, setWantsHeadshot } =
    useWizard();

  const handleContinue = () => {
    if (state.brandId && state.wantsHeadshot !== null) {
      onNext();
    }
  };

  const previewSignature = useMemo(() => {
    if (!state.brandId) return null;
    const wantsHeadshot = state.wantsHeadshot ?? false;
    return (
      signatures.find(
        (signature) =>
          signature.brand.id === state.brandId &&
          signature.wantsHeadshot === wantsHeadshot,
      ) ?? null
    );
  }, [signatures, state.brandId, state.wantsHeadshot]);

  return (
    <div>
      <h2 className="amelia-heading-4">Choose your brand</h2>
      <p className="amelia-body mt-1">
        Select the Amelia brand for your signature, then choose whether to include
        a headshot.
      </p>

      <div className="mt-6 space-y-4">
        {brands.map((brand) => {
          const isSelected = state.brandId === brand.id;
          const brandPreview =
            isSelected && previewSignature ? previewSignature : null;

          return (
            <button
              key={brand.id}
              type="button"
              onClick={() => selectBrand(brand.id)}
              className={`amelia-card block w-full p-6 text-left transition-colors ${
                isSelected
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-surface"
                  : "hover:ring-1 hover:ring-border"
              }`}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="amelia-heading-4">{brand.name}</p>
                  <p className="amelia-helper mt-0.5">{brand.description}</p>
                </div>
                <div className="flex shrink-0 items-center">
                  {isSelected ? (
                    <span className="amelia-badge amelia-badge-selected">
                      Selected
                    </span>
                  ) : (
                    <span className="amelia-badge amelia-badge-neutral">
                      Select
                    </span>
                  )}
                </div>
              </div>
              {brandPreview && (
                <SignaturePreviewSample
                  html={brandPreview.html}
                  brandId={brand.id}
                  wantsHeadshot={state.wantsHeadshot ?? false}
                />
              )}
            </button>
          );
        })}
      </div>

      {state.brandId && (
        <fieldset className="mt-8">
          <legend className="amelia-label">Include a headshot?</legend>
          <p className="amelia-body mt-1">
            With a headshot, you&apos;ll upload and crop your photo. Without one,
            your signature uses the brand logomark.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {(
              [
                { value: true, label: "Yes, use my headshot" },
                { value: false, label: "No, use brand logomark" },
              ] as const
            ).map(({ value, label }) => {
              const isActive = state.wantsHeadshot === value;
              return (
                <button
                  key={String(value)}
                  type="button"
                  onClick={() => setWantsHeadshot(value)}
                  className={`rounded-[4px] border px-4 py-2 text-sm transition-colors ${
                    isActive
                      ? "border-primary bg-info-bg text-primary"
                      : "border-border bg-surface text-text-primary hover:border-primary/50"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {state.wantsHeadshot !== null && previewSignature && (
            <div className="mt-6">
              <p className="amelia-label mb-2">Preview</p>
              <SignaturePreviewSample
                html={previewSignature.html}
                brandId={state.brandId}
                wantsHeadshot={state.wantsHeadshot}
              />
            </div>
          )}
        </fieldset>
      )}

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!state.brandId || state.wantsHeadshot === null}
          className="btn-primary"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
