const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char] ?? char);
}

export function sanitizeUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  try {
    const url = new URL(trimmed);
    if (
      url.protocol === "http:" ||
      url.protocol === "https:" ||
      url.protocol === "mailto:"
    ) {
      return trimmed;
    }
    return "";
  } catch {
    return "";
  }
}

function getFieldValue(data: Record<string, string>, key: string): string {
  return (data[key] ?? "").trim();
}

export function prepareSignatureData(
  data: Record<string, string>,
): Record<string, string> {
  const result = { ...data };

  const officePhone = getFieldValue(data, "officePhone");
  if (officePhone) {
    result.officePhone = formatPhoneNumber(officePhone);
  }

  const cellPhone = getFieldValue(data, "cellPhone");
  if (cellPhone) {
    result.cellPhone = formatPhoneNumber(cellPhone);
  }

  const website = getFieldValue(data, "website");
  if (website) {
    result.website = normalizeWebsiteDisplay(website);
    result.websiteHref = normalizeWebsiteHref(website);
  }

  const instagram = getFieldValue(data, "instagram");
  if (instagram) {
    result.instagram = normalizeInstagramDisplay(instagram);
    result.instagramHref = normalizeInstagramHref(instagram);
  }

  return result;
}

function processConditionals(
  html: string,
  data: Record<string, string>,
): string {
  let result = html;

  const conditionalRegex = /\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g;
  result = result.replace(conditionalRegex, (_, key: string, content: string) => {
    const value = getFieldValue(data, key);
    return value ? content : "";
  });

  const inverseRegex = /\{\{\^(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g;
  result = result.replace(inverseRegex, (_, key: string, content: string) => {
    const value = getFieldValue(data, key);
    return value ? "" : content;
  });

  return result;
}

import { OUTFIT_STYLE_BLOCK } from "@/templates/config";
import {
  formatPhoneNumber,
  normalizeInstagramDisplay,
  normalizeInstagramHref,
  normalizeWebsiteDisplay,
  normalizeWebsiteHref,
} from "@/lib/fieldFormat";

function replacePlaceholders(
  html: string,
  data: Record<string, string>,
): string {
  return html.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = getFieldValue(data, key);
    if (
      key === "headshotUrl" ||
      key === "websiteHref" ||
      key === "instagramHref" ||
      key === "baseUrl"
    ) {
      return escapeHtml(sanitizeUrl(value) || value);
    }
    return escapeHtml(value);
  });
}

export function renderSignature(
  templateHtml: string,
  data: Record<string, string>,
): string {
  const prepared = prepareSignatureData(data);
  const withConditionals = processConditionals(templateHtml, prepared);
  const html = replacePlaceholders(withConditionals, prepared).trim();
  return `${OUTFIT_STYLE_BLOCK}${html}`;
}
