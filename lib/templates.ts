import fs from "node:fs";
import path from "node:path";

import {
  brands,
  getBrand,
  type BrandId,
  type SignatureConfig,
  type SignatureSelection,
} from "@/templates/brands";
import {
  getVisibleTemplates,
  SIGNATURE_FIELDS,
  type TemplateConfig,
} from "@/templates/config";

export type TemplateWithHtml = TemplateConfig & {
  html: string;
};

export type SignatureWithHtml = SignatureConfig;

function loadHtmlFile(fileName: string): string {
  const filePath = path.join(process.cwd(), "templates", fileName);
  return fs.readFileSync(filePath, "utf-8");
}

export function loadLogomarkHtml(): string {
  return loadHtmlFile("signature-logomark.html");
}

export function loadHeadshotHtml(): string {
  return loadHtmlFile("signature-headshot.html");
}

export function buildSignatureConfig(
  brandId: BrandId,
  wantsHeadshot: boolean,
): SignatureWithHtml | undefined {
  const brand = getBrand(brandId);
  if (!brand) return undefined;

  return {
    brand,
    wantsHeadshot,
    requiresHeadshot: wantsHeadshot,
    headshotSize: { width: 60, height: 60 },
    fields: SIGNATURE_FIELDS,
    html: wantsHeadshot ? loadHeadshotHtml() : loadLogomarkHtml(),
    name: brand.name,
    description: wantsHeadshot
      ? `${brand.name} with your headshot photo.`
      : `${brand.name} with brand logomark.`,
    status: brand.status,
    id: `${brandId}-${wantsHeadshot ? "headshot" : "logomark"}`,
  };
}

export function getAllSignatureVariants(includeDrafts = false): SignatureWithHtml[] {
  const brandList = includeDrafts
    ? brands
    : brands.filter((brand) => brand.status === "finalized");

  const visibleBrands = brandList.length > 0 ? brandList : brands;

  return visibleBrands.flatMap((brand) => [
    buildSignatureConfig(brand.id, false)!,
    buildSignatureConfig(brand.id, true)!,
  ]);
}

export function getSignatureForSelection(
  selection: SignatureSelection,
): SignatureWithHtml | undefined {
  return buildSignatureConfig(selection.brandId, selection.wantsHeadshot);
}

/** @deprecated Legacy template loader for backwards-compatible previews */
export function loadTemplateHtml(id: string): string {
  const filePath = path.join(process.cwd(), "templates", `${id}.html`);
  return fs.readFileSync(filePath, "utf-8");
}

export function getAllTemplates(includeDrafts = false): TemplateWithHtml[] {
  return getVisibleTemplates(includeDrafts).map((config) => ({
    ...config,
    html: loadTemplateHtml(config.id),
  }));
}

export function getTemplateById(
  id: string,
  includeDrafts = false,
): TemplateWithHtml | undefined {
  const config = getVisibleTemplates(includeDrafts).find((t) => t.id === id);
  if (!config) return undefined;
  return { ...config, html: loadTemplateHtml(config.id) };
}
