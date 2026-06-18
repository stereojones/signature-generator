import type { TemplateField, TemplateStatus } from "@/templates/config";
import {
  SAMPLE_DATA,
  SAMPLE_HEADSHOT_PATH,
} from "@/templates/config";

export type BrandId = "aesthetics" | "medspa" | "health" | "hq";

export type BrandConfig = {
  id: BrandId;
  name: string;
  description: string;
  assetPrefix: BrandId;
  status: TemplateStatus;
  locationSuggestions: string[];
  defaultLocation: string;
  sampleDataOverrides?: Record<string, string>;
};

export const brands: BrandConfig[] = [
  {
    id: "aesthetics",
    name: "Amelia Aesthetics",
    description: "Blue brand logomark and contact styling.",
    assetPrefix: "aesthetics",
    status: "in-review",
    defaultLocation: "Amelia Aesthetics Raleigh",
    locationSuggestions: [
      "Amelia Aesthetics Raleigh",
      "Amelia Aesthetics St. Louis",
      "Amelia Aesthetics San Antonio",
      "Amelia Aesthetics Evansville",
      "Amelia Aesthetics South Florida",
      "Amelia Aesthetics Tampa Bay",
      "Amelia Aesthetics Wilmington",
    ],
  },
  {
    id: "medspa",
    name: "Amelia Medspa",
    description: "Teal brand logomark and contact styling.",
    assetPrefix: "medspa",
    status: "in-review",
    defaultLocation: "Amelia Medspa Raleigh",
    locationSuggestions: [
      "Amelia Medspa Raleigh",
      "Amelia Medspa St. Charles",
      "Amelia Medspa Evansville",
      "Amelia Medspa South Florida",
    ],
  },
  {
    id: "health",
    name: "Amelia Health",
    description: "Sage green brand logomark and contact styling.",
    assetPrefix: "health",
    status: "in-review",
    defaultLocation: "Amelia Health",
    locationSuggestions: ["Amelia Health"],
  },
  {
    id: "hq",
    name: "Amelia HQ",
    description: "Black brand logomark and contact styling.",
    assetPrefix: "hq",
    status: "in-review",
    defaultLocation: "Amelia HQ",
    locationSuggestions: ["Amelia HQ"],
    sampleDataOverrides: {
      fullName: "Juliana Zimmerman",
      title: "Content Editor",
      instagram: "amelia.aesthetics",
      website: "ameliahq.com",
      officePhone: "",
      cellPhone: "",
    },
  },
];

export type SignatureSelection = {
  brandId: BrandId;
  wantsHeadshot: boolean;
};

export type SignatureConfig = {
  brand: BrandConfig;
  wantsHeadshot: boolean;
  requiresHeadshot: boolean;
  headshotSize: { width: number; height: number };
  fields: TemplateField[];
  html: string;
  name: string;
  description: string;
  status: TemplateStatus;
  id: string;
};

export function getInitialLocationValue(brand: BrandConfig): string {
  return brand.locationSuggestions.length === 1 ? brand.defaultLocation : "";
}

export function getBrand(id: BrandId): BrandConfig | undefined {
  return brands.find((brand) => brand.id === id);
}

export function getBrandAssetPrefix(brandId: BrandId): string {
  return getBrand(brandId)?.assetPrefix ?? brandId;
}

export function getVisibleBrands(includeDrafts: boolean): BrandConfig[] {
  if (includeDrafts) {
    return brands;
  }
  const finalized = brands.filter((brand) => brand.status === "finalized");
  return finalized.length > 0 ? finalized : brands;
}

export function getSampleDataForSignature(
  brandId: BrandId,
  wantsHeadshot: boolean,
  baseUrl = "",
): Record<string, string> {
  const brand = getBrand(brandId);
  const data: Record<string, string> = {
    ...SAMPLE_DATA,
    location: brand?.defaultLocation ?? SAMPLE_DATA.location,
    ...(brand?.sampleDataOverrides ?? {}),
    baseUrl,
    brandAssetPrefix: getBrandAssetPrefix(brandId),
    contactColumnValign: "top",
  };

  if (wantsHeadshot && baseUrl) {
    data.headshotUrl = `${baseUrl}${SAMPLE_HEADSHOT_PATH}`;
  }

  return data;
}
