import fs from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getAllNoteCategories,
  getAllNotes,
  getNoteBySlug,
  getNotesByCategory,
} from "./notes";

describe("notes", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns published notes sorted by date descending", () => {
    const notes = getAllNotes();
    expect(notes.length).toBeGreaterThan(0);
    expect(notes[0]?.slug).toBe("zero-trust-basics");
    expect(notes[0]?.title).toContain("Zero Trust");
  });

  it("finds note by slug or returns null", () => {
    const note = getNoteBySlug("zero-trust-basics");
    expect(note?.categories).toContain("network-security");
    expect(note?.content).toContain("perimeter");
    expect(getNoteBySlug("missing-note")).toBeNull();
  });

  it("returns sorted unique categories", () => {
    const categories = getAllNoteCategories();
    expect(categories).toContain("network-security");
    expect(categories).toContain("cloud-security");
    expect(categories).toEqual(
      [...categories].sort((a, b) => a.localeCompare(b))
    );
  });

  it("filters notes by category", () => {
    const notes = getNotesByCategory("network-security");
    expect(notes.some((n) => n.slug === "zero-trust-basics")).toBe(true);
    expect(getNotesByCategory("nonexistent-category")).toHaveLength(0);
  });

  it("skips files with missing required frontmatter", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(fs, "readdirSync").mockReturnValue([
      "bad-note.md",
    ] as unknown as ReturnType<typeof fs.readdirSync>);
    vi.spyOn(fs, "readFileSync").mockReturnValue(
      "---\ntitle: Only Title\n---\n\nBody"
    );

    expect(getAllNotes()).toHaveLength(0);
    expect(warnSpy).toHaveBeenCalled();
  });

  it("skips files when categories is not an array", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(fs, "readdirSync").mockReturnValue([
      "bad-cats.md",
    ] as unknown as ReturnType<typeof fs.readdirSync>);
    vi.spyOn(fs, "readFileSync").mockReturnValue(`---
title: Bad
categories: not-an-array
date: "2026-01-01"
description: desc
---

Body`);

    expect(getAllNotes()).toHaveLength(0);
    expect(warnSpy).toHaveBeenCalled();
  });

  it("returns empty when notes directory is missing", () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(false);
    expect(getAllNotes()).toEqual([]);
  });
});
