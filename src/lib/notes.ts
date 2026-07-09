import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const NOTES_DIR = path.join(process.cwd(), "content/notes");

/**
 * Required frontmatter fields.
 * Files missing any required field are skipped with a console warning.
 */
const REQUIRED_FIELDS = ["title", "categories", "date", "description"] as const;

export interface NoteMeta {
  title: string;
  categories: string[];
  tags?: string[];
  date: string;
  description: string;
  source?: string;
}

export interface Note extends NoteMeta {
  slug: string;
  content: string;
}

function validateFrontmatter(data: Record<string, unknown>): string[] {
  const missing: string[] = [];
  for (const field of REQUIRED_FIELDS) {
    if (data[field] === undefined || data[field] === null) {
      missing.push(field);
    }
  }
  return missing;
}

function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, "");
}

function readAllNoteFiles(): Array<{ slug: string; raw: string }> {
  if (!fs.existsSync(NOTES_DIR)) {
    return [];
  }
  const files = fs.readdirSync(NOTES_DIR);
  return files
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({
      slug: slugFromFilename(f),
      raw: fs.readFileSync(path.join(NOTES_DIR, f), "utf-8"),
    }));
}

function parseNote(raw: { slug: string; raw: string }): Note | null {
  const { slug, raw: content } = raw;
  const { data, content: body } = matter(content);

  const missing = validateFrontmatter(data);
  if (missing.length > 0) {
    console.warn(
      `[notes] Skipping "${slug}" — missing required frontmatter fields: ${missing.join(", ")}`
    );
    return null;
  }

  // Validate categories is an array
  if (!Array.isArray(data.categories)) {
    console.warn(
      `[notes] Skipping "${slug}" — "categories" must be an array`
    );
    return null;
  }

  return {
    slug,
    title: String(data.title),
    categories: data.categories as string[],
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : undefined,
    date: String(data.date),
    description: String(data.description),
    source: data.source ? String(data.source) : undefined,
    content: body.trim(),
  };
}

/**
 * Get all notes, sorted by date descending.
 */
export function getAllNotes(): Note[] {
  return readAllNoteFiles()
    .map(parseNote)
    .filter((n): n is Note => n !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get a single note by slug. Returns null if not found.
 */
export function getNoteBySlug(slug: string): Note | null {
  const raw = readAllNoteFiles().find((n) => n.slug === slug);
  if (!raw) return null;
  return parseNote(raw);
}

/**
 * Get all unique category names, sorted alphabetically.
 */
export function getAllNoteCategories(): string[] {
  const notes = getAllNotes();
  const categories = new Set<string>();
  for (const note of notes) {
    for (const cat of note.categories) {
      categories.add(cat);
    }
  }
  return Array.from(categories).sort((a, b) => a.localeCompare(b));
}

/**
 * Get all notes that belong to a given category.
 */
export function getNotesByCategory(category: string): Note[] {
  return getAllNotes().filter((n) => n.categories.includes(category));
}
