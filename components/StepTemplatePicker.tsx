"use client";

import { useWizard } from "@/components/WizardContext";
import { SignaturePreviewSample } from "@/components/SignaturePreview";

type StepTemplatePickerProps = {
  onNext: () => void;
};

export function StepTemplatePicker({ onNext }: StepTemplatePickerProps) {
  const { templates, state, selectTemplate } = useWizard();

  const handleContinue = () => {
    if (state.templateId) {
      onNext();
    }
  };

  return (
    <div>
      <h2 className="amelia-heading-4">Choose a template</h2>
      <p className="amelia-body mt-1">
        Select the signature format that fits your role.
      </p>

      <div className="mt-6 space-y-4">
        {templates.map((template) => {
          const isSelected = state.templateId === template.id;
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => selectTemplate(template.id)}
              className={`amelia-card block w-full p-6 text-left transition-colors ${
                isSelected
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-surface"
                  : "hover:ring-1 hover:ring-border"
              }`}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="amelia-heading-4">{template.name}</p>
                  <p className="amelia-helper mt-0.5">{template.description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {template.status !== "finalized" && (
                    <span className="amelia-badge amelia-badge-neutral">
                      {template.status}
                    </span>
                  )}
                  {isSelected && (
                    <span className="amelia-badge amelia-badge-selected">
                      Selected
                    </span>
                  )}
                </div>
              </div>
              <SignaturePreviewSample
                html={template.html}
                templateId={template.id}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!state.templateId}
          className="btn-primary"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
