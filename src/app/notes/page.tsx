import Link from "next/link";
import { getAllNoteCategories, getNotesByCategory } from "@/lib/notes";
import type { Note } from "@/lib/notes";

export default function NotesPage() {
  const categories = getAllNoteCategories();

  // Group notes by category
  const notesByCategory: Record<string, Note[]> = {};
  for (const cat of categories) {
    notesByCategory[cat] = getNotesByCategory(cat);
  }

  return (
    <div className="p-6">
      <h1 className="text-display-sm mb-8">Notes</h1>

      {categories.length === 0 ? (
        <p className="text-body-md">No notes yet.</p>
      ) : (
        <div className="space-y-12">
          {categories.map((category) => {
            const notes = notesByCategory[category] ?? [];
            if (notes.length === 0) return null;

            return (
              <section key={category} id={category}>
                <h2 className="text-title-md mb-6 capitalize">
                  {category.replaceAll("-", " ")}
                </h2>
                <div className="space-y-4">
                  {notes.map((note) => (
                    <Link
                      key={note.slug}
                      href={`/notes/${note.slug}`}
                      className="block"
                    >
                      <div className="feature-card hover:border-hairline-strong">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-title-md mb-1">
                              {note.title}
                            </h3>
                            <p className="text-body-md line-clamp-2 mb-3">
                              {note.description}
                            </p>
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="badge-pill">{note.date}</span>
                              {note.tags?.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-caption-uppercase text-muted"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
