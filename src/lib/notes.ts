import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

const NOTES_DIR = path.join(process.cwd(), "content/notes");
const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

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

function parseFrontmatter(raw: string): {
  data: Record<string, unknown>;
  content: string;
} {
  const match = FRONTMATTER_PATTERN.exec(raw);
  if (!match) {
    return { data: {}, content: raw };
  }

  const parsed = yaml.load(match[1], { schema: yaml.JSON_SCHEMA });
  const data =
    parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};

  return { data, content: match[2] };
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function parseNote(raw: { slug: string; raw: string }): Note | null {
  const { slug, raw: content } = raw;
  const { data, content: body } = parseFrontmatter(content);

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
    source: asOptionalString(data.source),
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
