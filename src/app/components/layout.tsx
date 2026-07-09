import { getAllCategories } from "@/lib/registry";
import CategorySidebarLayout from "@/components/CategorySidebarLayout";

interface ComponentsLayoutProps {
  children: React.ReactNode;
}

export default function ComponentsLayout({
  children,
}: Readonly<ComponentsLayoutProps>) {
  const categories = getAllCategories();

  return (
    <CategorySidebarLayout
      categories={categories}
      getHref={(category) => `/components/${category}`}
    >
      {children}
    </CategorySidebarLayout>
  );
}
