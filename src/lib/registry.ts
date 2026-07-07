import fs from "node:fs";
import path from "node:path";

export interface RegistryItem {
  name: string;
  title: string;
  type: string;
  description: string;
  categories: string[];
  files: Array<{ path: string; type: string }>;
  dependencies: string[];
  registryDependencies: string[];
  meta?: {
    designRationale?: string;
    inspirationSource?: {
      platform: string;
      url: string;
      author: string;
      licenseStatus: string;
    };
    tags?: string[];
    version?: string;
  };
}

export interface RegistryData {
  name: string;
  homepage: string;
  items: RegistryItem[];
}

const REGISTRY_PATH = path.join(process.cwd(), "registry.json");

function readRegistry(): RegistryData {
  const content = fs.readFileSync(REGISTRY_PATH, "utf-8");
  return JSON.parse(content) as RegistryData;
}

export function getAllComponents(): RegistryItem[] {
  return readRegistry().items;
}

export function getComponentByName(name: string): RegistryItem | undefined {
  return readRegistry().items.find((item) => item.name === name);
}

export function getComponentsByCategory(category: string): RegistryItem[] {
  return readRegistry().items.filter((item) =>
    item.categories.includes(category)
  );
}

export function getAllCategories(): string[] {
  const items = readRegistry().items;
  const categories = new Set<string>();
  items.forEach((item) => {
    item.categories.forEach((cat) => categories.add(cat));
  });
  return Array.from(categories).sort((a, b) => a.localeCompare(b));
}

export function getComponentDocs(name: string): string | null {
  const docsPath = path.join(process.cwd(), "registry", name, "docs.md");
  if (fs.existsSync(docsPath)) {
    return fs.readFileSync(docsPath, "utf-8");
  }
  return null;
}

export function getComponentSource(name: string): string | null {
  const sourcePath = path.join(process.cwd(), "registry", name, `${name}.tsx`);
  if (fs.existsSync(sourcePath)) {
    return fs.readFileSync(sourcePath, "utf-8");
  }
  return null;
}

export function getPreviewImage(name: string): string | null {
  const gifPath = path.join(process.cwd(), "public", "previews", `${name}.gif`);
  const pngPath = path.join(process.cwd(), "public", "previews", `${name}.png`);

  if (fs.existsSync(gifPath)) {
    return `/previews/${name}.gif`;
  }
  if (fs.existsSync(pngPath)) {
    return `/previews/${name}.png`;
  }
  return null;
}
