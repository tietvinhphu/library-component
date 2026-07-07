import Link from "next/link";
import { getAllCategories } from "@/lib/registry";

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = getAllCategories();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/10 p-4">
        <h2 className="font-semibold mb-4 px-2">Categories</h2>
        <nav className="space-y-1">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/components/${category}`}
              className="block px-2 py-1.5 rounded-md text-sm hover:bg-muted transition-colors capitalize"
            >
              {category.replace(/-/g, " ")}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
