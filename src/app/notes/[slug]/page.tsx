import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllNotes, getNoteBySlug } from "@/lib/notes";
import MarkdownDocs from "@/components/MarkdownDocs";
import TableOfContents from "@/components/TableOfContents";

interface NotePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const notes = getAllNotes();
  return notes.map((note) => ({
    slug: note.slug,
  }));
}

export default async function NotePage({ params }: Readonly<NotePageProps>) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);

  if (!note) {
    notFound();
  }

  return (
    <div className="component-detail-layout">
      <div className="component-detail-main">
        {/* Back link */}
        <Link
          href="/notes"
          className="inline-flex items-center gap-1 text-body-md text-muted mb-6 hover:text-ink transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Notes
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-display-sm mb-3">{note.title}</h1>
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <span className="badge-pill">{note.date}</span>
            {note.categories.map((cat) => (
              <span
                key={cat}
                className="badge-pill capitalize"
              >
                {cat.replaceAll("-", " ")}
              </span>
            ))}
          </div>
          {note.tags && note.tags.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-caption-uppercase text-muted"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          {note.source && (
            <div className="mt-3">
              <a
                href={note.source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-body-md text-muted hover:text-ink transition-colors underline underline-offset-2"
              >
                Source: {note.source}
              </a>
            </div>
          )}
          <p className="text-body-md mt-4">{note.description}</p>
        </div>

        {/* Body */}
        <MarkdownDocs content={note.content} />
      </div>

      {/* TOC */}
      <aside className="component-detail-toc">
        <TableOfContents content={note.content} />
      </aside>
    </div>
  );
}
