import {
  CONTACT_FIELD_KEYS,
  MAX_CONTACT_FIELDS,
} from "@/templates/config";

const CONTACT_HREF_KEYS: Partial<Record<string, string>> = {
  email: "emailHref",
  website: "websiteHref",
  instagram: "instagramHref",
};

export function limitSampleContactFields(
  data: Record<string, string>,
  maxFields = MAX_CONTACT_FIELDS,
): Record<string, string> {
  const result = { ...data };
  const filled = CONTACT_FIELD_KEYS.filter((key) => (result[key] ?? "").trim());

  if (filled.length <= maxFields) {
    return result;
  }

  for (const key of filled.slice(maxFields)) {
    result[key] = "";
    const hrefKey = CONTACT_HREF_KEYS[key];
    if (hrefKey) {
      result[hrefKey] = "";
    }
  }

  return result;
}
