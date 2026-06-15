"use client";

import { useWizard } from "@/components/WizardContext";
import { StepHeadshotUpload } from "@/components/StepHeadshotUpload";
import { StepPersonalInfo } from "@/components/StepPersonalInfo";
import { StepResult } from "@/components/StepResult";
import { StepTemplatePicker } from "@/components/StepTemplatePicker";

const STEP_LABELS = [
  { step: 1 as const, label: "Template" },
  { step: 2 as const, label: "Your Info" },
  { step: 3 as const, label: "Headshot" },
  { step: 4 as const, label: "Copy HTML" },
];

export function Wizard() {
  const { state, selectedTemplate, prevStep, nextStep, skipHeadshotStep } =
    useWizard();

  const showHeadshotStep = selectedTemplate?.requiresHeadshot ?? false;
  const navSteps = showHeadshotStep
    ? STEP_LABELS
    : STEP_LABELS.filter((s) => s.step !== 3);

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10 lg:px-16 lg:py-16">
      <header className="mb-10 text-center">
        <h1 className="amelia-page-title">Email Signature Generator</h1>
        <p className="amelia-body mt-2">
          Choose a template, enter your details, and copy your signature HTML.
        </p>
      </header>

      <nav aria-label="Progress" className="mb-10">
        <ol className="flex items-center justify-center gap-2 sm:gap-4">
          {navSteps.map((item, index) => {
            const isActive = state.step === item.step;
            const isComplete = state.step > item.step;
            return (
              <li key={item.step} className="flex items-center gap-2 sm:gap-4">
                {index > 0 && (
                  <span
                    className={`hidden h-px w-6 sm:block sm:w-10 ${
                      isComplete || isActive
                        ? "bg-primary"
                        : "bg-border"
                    }`}
                    aria-hidden
                  />
                )}
                <span className="flex items-center gap-2">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                      isActive
                        ? "bg-primary text-white"
                        : isComplete
                          ? "bg-info-bg text-primary"
                          : "bg-subtle text-text-secondary"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span
                    className={`hidden text-sm sm:inline ${
                      isActive
                        ? "font-medium text-text-primary"
                        : "text-text-secondary"
                    }`}
                  >
                    {item.label}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      </nav>

      {state.step === 1 ? (
        <StepTemplatePicker onNext={nextStep} />
      ) : (
        <div className="amelia-card-padded">
          {state.step === 2 && (
            <StepPersonalInfo
              onBack={prevStep}
              onNext={showHeadshotStep ? nextStep : skipHeadshotStep}
            />
          )}
          {state.step === 3 && showHeadshotStep && (
            <StepHeadshotUpload onBack={prevStep} onNext={nextStep} />
          )}
          {state.step === 4 && <StepResult onBack={prevStep} />}
        </div>
      )}
    </div>
  );
}
