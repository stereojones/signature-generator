import {
  formatFieldForValidation,
  isValidInstagramHandle,
  isValidPhoneNumber,
  isValidWebsite,
} from "@/lib/fieldFormat";
import {
  CONTACT_FIELD_KEYS,
  MAX_CONTACT_FIELDS,
} from "@/templates/config";

const ALLOWED_MIME_TYPES = new Set(["image/png", "image/jpeg"]);
const MAX_UPLOAD_BYTES = 512 * 1024;

export type UploadValidationResult =
  | { ok: true }
  | { ok: false; error: string };

export function validateUploadBuffer(
  buffer: Buffer,
  contentType: string,
): UploadValidationResult {
  if (!ALLOWED_MIME_TYPES.has(contentType)) {
    return { ok: false, error: "Only PNG and JPEG images are allowed" };
  }

  if (buffer.byteLength > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "Image must be 512 KB or smaller" };
  }

  if (buffer.byteLength === 0) {
    return { ok: false, error: "Empty file" };
  }

  return { ok: true };
}

export function validateFormField(
  value: string,
  required: boolean,
  type?: string,
  key?: string,
): string | null {
  const trimmed = value.trim();
  if (required && !trimmed) {
    return "This field is required";
  }
  if (!trimmed) return null;

  const fieldKey = key ?? "";

  if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return "Enter a valid email address";
  }

  if (type === "tel" || fieldKey === "officePhone" || fieldKey === "cellPhone") {
    if (!isValidPhoneNumber(trimmed)) {
      return "Enter a 10-digit US phone number";
    }
    return null;
  }

  if (type === "url" || fieldKey === "website") {
    if (!isValidWebsite(trimmed)) {
      return "Enter a valid website (e.g. askamelia.com)";
    }
    return null;
  }

  if (type === "instagram" || fieldKey === "instagram") {
    if (!isValidInstagramHandle(trimmed)) {
      return "Enter a valid Instagram handle (e.g. amelia.aesthetics)";
    }
    return null;
  }

  return null;
}

export function normalizeFormFieldValue(key: string, value: string): string {
  return formatFieldForValidation(key, value);
}

export function countFilledContactFields(
  formData: Record<string, string>,
): number {
  return CONTACT_FIELD_KEYS.filter((key) => formData[key]?.trim()).length;
}

export function validateContactFieldLimit(
  formData: Record<string, string>,
): string | null {
  const count = countFilledContactFields(formData);
  if (count > MAX_CONTACT_FIELDS) {
    const extra = count - MAX_CONTACT_FIELDS;
    return `Signatures support up to ${MAX_CONTACT_FIELDS} contact fields. Remove ${extra} filled field${extra === 1 ? "" : "s"} to continue.`;
  }
  return null;
}
