import { getAllNoteCategories } from "@/lib/notes";
import CategorySidebarLayout from "@/components/CategorySidebarLayout";

interface NotesLayoutProps {
  children: React.ReactNode;
}

export default function NotesLayout({ children }: Readonly<NotesLayoutProps>) {
  const categories = getAllNoteCategories();

  return (
    <CategorySidebarLayout
      categories={categories}
      getHref={(category) => `/notes#${category}`}
    >
      {children}
    </CategorySidebarLayout>
  );
}
