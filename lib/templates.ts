import fs from "node:fs";
import path from "node:path";

import {
  getVisibleTemplates,
  type TemplateConfig,
} from "@/templates/config";

export type TemplateWithHtml = TemplateConfig & {
  html: string;
};

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
