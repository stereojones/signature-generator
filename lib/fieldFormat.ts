const INSTAGRAM_HANDLE = /^[a-zA-Z0-9._]{1,30}$/;

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatPhoneNumber(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  let digits = digitsOnly(trimmed);
  if (digits.length === 11 && digits.startsWith("1")) {
    digits = digits.slice(1);
  }

  if (digits.length !== 10) {
    return trimmed;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function isValidPhoneNumber(value: string): boolean {
  const digits = digitsOnly(value);
  if (digits.length === 10) return true;
  return digits.length === 11 && digits.startsWith("1");
}

function withWebsiteProtocol(value: string): string {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export function normalizeWebsiteDisplay(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  try {
    const url = new URL(withWebsiteProtocol(trimmed));
    const host = url.hostname.replace(/^www\./i, "");
    const path = url.pathname === "/" ? "" : url.pathname;
    const display = `${host}${path}${url.search}${url.hash}`.replace(/\/$/, "");
    return display || host;
  } catch {
    return trimmed
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .replace(/\/$/, "");
  }
}

export function normalizeWebsiteHref(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  try {
    const url = new URL(withWebsiteProtocol(trimmed));
    url.hostname = url.hostname.replace(/^www\./i, "");
    return url.toString().replace(/\/$/, "");
  } catch {
    const display = normalizeWebsiteDisplay(trimmed);
    return display ? `https://${display}` : "";
  }
}

export function isValidWebsite(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;

  try {
    const url = new URL(withWebsiteProtocol(trimmed));
    const host = url.hostname.replace(/^www\./i, "");
    return host.includes(".") && !host.startsWith(".") && !host.endsWith(".");
  } catch {
    return false;
  }
}

export function normalizeInstagramDisplay(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  return trimmed
    .replace(/^@/, "")
    .replace(/^https?:\/\/(www\.)?instagram\.com\/?/i, "")
    .replace(/\/$/, "");
}

export function normalizeInstagramHref(value: string): string {
  const handle = normalizeInstagramDisplay(value);
  if (!handle) return "";
  return `https://instagram.com/${handle}`;
}

export function isValidInstagramHandle(value: string): boolean {
  const handle = normalizeInstagramDisplay(value);
  if (!handle) return false;
  return INSTAGRAM_HANDLE.test(handle);
}

export function formatFieldForSignature(
  key: string,
  value: string,
): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (key === "officePhone" || key === "cellPhone") {
    return formatPhoneNumber(trimmed);
  }

  if (key === "website") {
    return normalizeWebsiteDisplay(trimmed);
  }

  if (key === "instagram") {
    return normalizeInstagramDisplay(trimmed);
  }

  return trimmed;
}

export function formatFieldForValidation(key: string, value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (key === "officePhone" || key === "cellPhone") {
    return formatPhoneNumber(trimmed);
  }

  if (key === "website") {
    return normalizeWebsiteDisplay(trimmed);
  }

  if (key === "instagram") {
    return normalizeInstagramDisplay(trimmed);
  }

  return trimmed;
}
