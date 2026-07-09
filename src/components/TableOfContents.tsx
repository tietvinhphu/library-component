"use client";

import { useEffect, useMemo, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseHeadingLine(line: string): { level: number; text: string } | null {
  if (!line.startsWith("#")) {
    return null;
  }

  let level = 0;
  while (level < line.length && line[level] === "#") {
    level += 1;
  }

  if (level === 0 || level > 3 || line[level] !== " ") {
    return null;
  }

  const text = line.slice(level + 1).trim();
  if (!text) {
    return null;
  }

  return { level, text };
}

function parseHeadings(markdown: string): TocItem[] {
  const lines = markdown.split("\n");
  const headings: TocItem[] = [];

  for (const line of lines) {
    const heading = parseHeadingLine(line);
    if (heading) {
      headings.push({
        id: slugify(heading.text),
        text: heading.text,
        level: heading.level,
      });
    }
  }

  return headings;
}

export default function TableOfContents({
  content,
}: Readonly<TableOfContentsProps>) {
  const headings = useMemo(() => parseHeadings(content), [content]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      {
        rootMargin: "-80px 0px -80% 0px",
        threshold: 0,
      }
    );

    const headingElements = document.querySelectorAll(
      ".prose-catalog h1, .prose-catalog h2, .prose-catalog h3"
    );
    headingElements.forEach((el) => {
      const text = el.textContent ?? "";
      const id = slugify(text);
      el.id = id;
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="toc-nav" aria-label="Table of contents">
      <h3 className="toc-title">On This Page</h3>
      <ul className="toc-list">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`toc-item toc-level-${heading.level} ${
              activeId === heading.id ? "toc-item-active" : ""
            }`}
          >
            <a
              href={`#${heading.id}`}
              className="toc-link"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(heading.id);
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                  setActiveId(heading.id);
                }
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
