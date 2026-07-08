"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

const demoLoaders: Record<
  string,
  () => Promise<{ default: ComponentType }>
> = {
  "file-system": () => import("@/registry/file-system/demo"),
};

export const componentDemos = Object.fromEntries(
  Object.entries(demoLoaders).map(([name, loader]) => [
    name,
    dynamic(loader, { ssr: false }),
  ])
) as Record<string, ComponentType>;

export function hasComponentDemo(name: string): boolean {
  return name in demoLoaders;
}
