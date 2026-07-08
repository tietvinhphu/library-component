import Link from "next/link";
import { getAllCategories } from "@/lib/registry";

interface ComponentsLayoutProps {
  children: React.ReactNode;
}

export default function ComponentsLayout({
  children,
}: Readonly<ComponentsLayoutProps>) {
  const categories = getAllCategories();

  return (
    <div className="flex min-h-screen bg-canvas">
      <aside className="w-64 border-r border-hairline bg-canvas p-4">
        <h2 className="text-caption-uppercase mb-4 px-2">Categories</h2>
        <nav className="space-y-1">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/components/${category}`}
              className="nav-link block px-2 py-1.5 rounded-sm capitalize"
            >
              {category.replaceAll("-", " ")}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 bg-canvas">{children}</main>
    </div>
  );
}
