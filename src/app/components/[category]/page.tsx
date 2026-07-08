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
      <h1 className="text-display-sm mb-8 capitalize">
        {category.replaceAll("-", " ")}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {components.map((component) => {
          const previewImage = getPreviewImage(component.name);
          return (
            <Link
              key={component.name}
              href={`/components/${category}/${component.name}`}
              className="block"
            >
              <div className="feature-card overflow-hidden p-0">
                <div className="h-[160px] bg-canvas-soft flex items-center justify-center border-b border-hairline">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt={component.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-body-md">{component.title}</span>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-title-md mb-2">{component.title}</h2>
                  <p className="text-body-md line-clamp-2">
                    {component.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {components.length === 0 && (
        <p className="text-body-md">No components found.</p>
      )}
    </div>
  );
}
