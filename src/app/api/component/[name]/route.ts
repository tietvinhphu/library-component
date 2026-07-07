import { NextResponse } from "next/server";
import { getComponentByName, getComponentDocs, getComponentSource, getPreviewImage } from "@/lib/registry";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const component = getComponentByName(name);

  if (!component) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    name: component.name,
    title: component.title,
    description: component.description,
    dependencies: component.dependencies,
    docs: getComponentDocs(name),
    source: getComponentSource(name),
    previewImage: getPreviewImage(name),
  });
}
