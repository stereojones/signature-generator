"use client";

import { useMemo, useState } from "react";

import { useWizard } from "@/components/WizardContext";
import {
  countFilledContactFields,
  normalizeFormFieldValue,
  validateContactFieldLimit,
  validateFormField,
} from "@/lib/validation";
import {
  CONTACT_FIELD_KEYS,
  CONTACT_FIELDS_NOTICE,
  MAX_CONTACT_FIELDS,
  type FieldType,
  type TemplateField,
} from "@/templates/config";

type StepPersonalInfoProps = {
  onBack: () => void;
  onNext: () => void;
};

function getHtmlInputType(type?: FieldType): "text" | "email" | "tel" {
  if (type === "email") return "email";
  if (type === "tel") return "tel";
  return "text";
}

function isContactField(field: TemplateField): boolean {
  return CONTACT_FIELD_KEYS.includes(
    field.key as (typeof CONTACT_FIELD_KEYS)[number],
  );
}

export function StepPersonalInfo({ onBack, onNext }: StepPersonalInfoProps) {
  const { selectedTemplate, state, updateField } = useWizard();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [contactLimitError, setContactLimitError] = useState<string | null>(
    null,
  );

  const fields = useMemo(
    () => selectedTemplate?.fields ?? [],
    [selectedTemplate],
  );

  const profileFields = useMemo(
    () => fields.filter((field) => !isContactField(field)),
    [fields],
  );

  const contactFields = useMemo(
    () => fields.filter((field) => isContactField(field)),
    [fields],
  );

  const filledContactCount = useMemo(
    () => countFilledContactFields(state.formData),
    [state.formData],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedFormData = { ...state.formData };
    for (const field of fields) {
      const raw = normalizedFormData[field.key] ?? "";
      normalizedFormData[field.key] = normalizeFormFieldValue(field.key, raw);
    }

    const nextErrors: Record<string, string> = {};
    for (const field of fields) {
      const normalized = normalizedFormData[field.key] ?? "";
      const error = validateFormField(
        normalized,
        field.required ?? false,
        field.type,
        field.key,
      );
      if (error) nextErrors[field.key] = error;
    }

    for (const field of fields) {
      const normalized = normalizedFormData[field.key] ?? "";
      if (normalized !== (state.formData[field.key] ?? "")) {
        updateField(field.key, normalized);
      }
    }

    const limitError = validateContactFieldLimit(normalizedFormData);
    setContactLimitError(limitError);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0 && !limitError) {
      onNext();
    }
  };

  const handleBlur = (key: string, value: string) => {
    const normalized = normalizeFormFieldValue(key, value);
    if (normalized !== value) {
      updateField(key, normalized);
    }
  };

  const fieldHint = (type?: FieldType, key?: string) => {
    if (type === "tel" || key === "officePhone" || key === "cellPhone") {
      return "Formats as (123) 456-7890";
    }
    if (type === "url" || key === "website") {
      return "Display uses domain.com — https:// is added automatically";
    }
    if (type === "instagram" || key === "instagram") {
      return "Handle only — @ and instagram.com are removed automatically";
    }
    return null;
  };

  const renderField = (field: TemplateField) => (
    <div key={field.key}>
      <label htmlFor={field.key} className="amelia-label">
        {field.label}
        {field.required && <span className="text-error"> *</span>}
      </label>
      <input
        id={field.key}
        type={getHtmlInputType(field.type)}
        inputMode={field.type === "url" ? "url" : undefined}
        value={state.formData[field.key] ?? ""}
        onChange={(e) => updateField(field.key, e.target.value)}
        onBlur={(e) => handleBlur(field.key, e.target.value)}
        placeholder={field.placeholder}
        className={`input-field ${
          errors[field.key] ? "input-field-error" : ""
        }`}
      />
      {fieldHint(field.type, field.key) && !errors[field.key] && (
        <p className="amelia-helper mt-1">{fieldHint(field.type, field.key)}</p>
      )}
      {errors[field.key] && (
        <p className="mt-1 text-xs text-error">{errors[field.key]}</p>
      )}
    </div>
  );

  if (!selectedTemplate) {
    return <p className="amelia-body">Please select a template first.</p>;
  }

  return (
    <div>
      <h2 className="amelia-heading-4">Your information</h2>
      <p className="amelia-body mt-1">
        Enter the details for your {selectedTemplate.name} signature.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="space-y-4">{profileFields.map(renderField)}</div>

        <div className="space-y-4 border-t border-border pt-6">
          <div>
            <h3 className="amelia-label">Contact details</h3>
            <p className="amelia-body mt-1">{CONTACT_FIELDS_NOTICE}</p>
            <p
              className={`amelia-helper mt-2 ${
                filledContactCount > MAX_CONTACT_FIELDS
                  ? "text-error"
                  : ""
              }`}
            >
              {filledContactCount} of {MAX_CONTACT_FIELDS} contact fields used
            </p>
          </div>

          {contactFields.map(renderField)}

          {contactLimitError && (
            <p className="text-sm text-error">{contactLimitError}</p>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <button type="button" onClick={onBack} className="btn-secondary">
            Back
          </button>
          <button type="submit" className="btn-primary">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
