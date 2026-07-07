import Link from "next/link";
import { getComponentsByCategory, getPreviewImage } from "@/lib/registry";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: Readonly<CategoryPageProps>) {
  const { category } = await params;
  const components = getComponentsByCategory(category);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {category.replaceAll("-", " ")}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {components.map((component) => {
          const previewImage = getPreviewImage(component.name);
          return (
            <Link
              key={component.name}
              href={`/components/${category}/${component.name}`}
              className="block"
            >
              <div className="border rounded-lg overflow-hidden hover:border-primary transition-colors">
                {/* Thumbnail */}
                <div className="h-[160px] bg-muted/30 flex items-center justify-center">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt={component.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      {component.title}
                    </span>
                  )}
                </div>
                {/* Info */}
                <div className="p-4">
                  <h2 className="font-semibold mb-1">{component.title}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {component.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {components.length === 0 && (
        <p className="text-muted-foreground">No components found.</p>
      )}
    </div>
  );
}
