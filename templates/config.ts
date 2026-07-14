export const OUTFIT_FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600&display=swap');`;

import { limitSampleContactFields } from "@/lib/sampleData";

export const OUTFIT_FONT_FAMILY = "'Outfit', Arial, Helvetica, sans-serif";

export const OUTFIT_STYLE_BLOCK = `<style type="text/css">${OUTFIT_FONT_IMPORT}</style>`;

export const SIGNATURE_DISCLAIMER =
  "This message may contain proprietary information, trade secrets, or protected health information (PHI). It is intended only for the named recipient(s). Any unauthorized review, use, disclosure, or distribution is prohibited. If you are not the intended recipient, stop reading, delete this message immediately, and notify the sender.";

export type FieldType = "text" | "email" | "tel" | "url" | "instagram";

export type TemplateField = {
  key: string;
  label: string;
  required?: boolean;
  type?: FieldType;
  placeholder?: string;
};

export type TemplateStatus = "draft" | "in-review" | "finalized";

export type TemplateConfig = {
  id: string;
  name: string;
  description: string;
  status: TemplateStatus;
  requiresHeadshot: boolean;
  headshotSize?: { width: number; height: number };
  fields: TemplateField[];
};

export const CONTACT_FIELD_KEYS = [
  "officePhone",
  "cellPhone",
  "email",
  "website",
  "instagram",
] as const;

export type ContactFieldKey = (typeof CONTACT_FIELD_KEYS)[number];

export const MAX_CONTACT_FIELDS = 3;
export const MIN_CONTACT_FIELDS = 2;

export const CONTACT_FIELDS_NOTICE =
  "Signatures display 2–3 contact fields. Choose any combination of office phone, cell phone, email, website, and Instagram handle.";

export const LOCATION_MAX_LENGTH = 80;

const PROFILE_FIELDS: TemplateField[] = [
  { key: "fullName", label: "Full Name", required: true, placeholder: "Michelle Roughton, MD" },
  { key: "title", label: "Job Title", required: true, placeholder: "Board Certified Plastic Surgeon" },
  { key: "location", label: "Location", required: true, placeholder: "Start typing to see locations" },
];

const CONTACT_FIELDS: TemplateField[] = [
  { key: "officePhone", label: "Office Phone", type: "tel", placeholder: "(636) 329-4036" },
  { key: "cellPhone", label: "Cell Phone", type: "tel", placeholder: "(314) 687-8249" },
  { key: "email", label: "Email Address", type: "email", placeholder: "name@askamelia.com" },
  { key: "website", label: "Website", type: "url", placeholder: "askamelia.com" },
  { key: "instagram", label: "Instagram Handle", type: "instagram", placeholder: "amelia.aesthetics" },
];

export const SIGNATURE_FIELDS: TemplateField[] = [
  ...PROFILE_FIELDS,
  ...CONTACT_FIELDS,
];

export const templates: TemplateConfig[] = [
  {
    id: "template-1",
    name: "Amelia Aesthetics",
    description: "Blue brand logomark with name, title, location, and contact details.",
    status: "in-review",
    requiresHeadshot: false,
    fields: SIGNATURE_FIELDS,
  },
  {
    id: "template-2",
    name: "Headshot",
    description: "Circular headshot photo with name, title, location, and contact details.",
    status: "in-review",
    requiresHeadshot: true,
    headshotSize: { width: 60, height: 60 },
    fields: SIGNATURE_FIELDS,
  },
  {
    id: "template-3",
    name: "Amelia Medspa",
    description: "Teal brand logomark for Medspa locations.",
    status: "in-review",
    requiresHeadshot: false,
    fields: SIGNATURE_FIELDS,
  },
  {
    id: "template-4",
    name: "Amelia Health",
    description: "Sage green brand logomark for Amelia Health.",
    status: "in-review",
    requiresHeadshot: false,
    fields: SIGNATURE_FIELDS,
  },
  {
    id: "template-5",
    name: "Amelia HQ",
    description: "Black brand logomark with contact details.",
    status: "in-review",
    requiresHeadshot: false,
    fields: SIGNATURE_FIELDS,
  },
];

export const SAMPLE_HEADSHOT_PATH = "/assets/signatures/sample-headshot.png";

export const SAMPLE_DATA: Record<string, string> = {
  fullName: "Michelle Roughton, MD",
  title: "Board Certified Plastic Surgeon",
  location: "Amelia Aesthetics Raleigh",
  officePhone: "(636) 329-4036",
  cellPhone: "",
  email: "mroughton@askamelia.com",
  emailHref: "mailto:mroughton@askamelia.com",
  website: "askamelia.com",
  websiteHref: "https://askamelia.com",
  headshotUrl: "",
  baseUrl: "http://localhost:3000",
};

export const TEMPLATE_SAMPLE_OVERRIDES: Record<string, Record<string, string>> = {
  "template-5": {
    fullName: "Juliana Zimmerman",
    title: "Content Editor",
    location: "Amelia HQ",
    email: "juliana@ameliahq.com",
    emailHref: "mailto:juliana@ameliahq.com",
    instagram: "amelia.aesthetics",
    instagramHref: "https://instagram.com/amelia.aesthetics",
    website: "ameliahq.com",
    websiteHref: "https://ameliahq.com",
    officePhone: "",
    cellPhone: "",
  },
};

export function getSampleDataForTemplate(
  templateId: string,
  baseUrl = "",
): Record<string, string> {
  const data = limitSampleContactFields({
    ...SAMPLE_DATA,
    ...(TEMPLATE_SAMPLE_OVERRIDES[templateId] ?? {}),
  });

  const template = templates.find((t) => t.id === templateId);
  if (template?.requiresHeadshot && baseUrl) {
    data.headshotUrl = `${baseUrl}${SAMPLE_HEADSHOT_PATH}`;
  }

  return data;
}

export function getVisibleTemplates(includeDrafts: boolean): TemplateConfig[] {
  if (includeDrafts) {
    return templates;
  }
  const finalized = templates.filter((t) => t.status === "finalized");
  if (finalized.length === 0) {
    return templates;
  }
  return finalized;
}
