import { createHighlighter, type Highlighter } from "shiki";

const SUPPORTED_LANGS = [
  "tsx",
  "ts",
  "typescript",
  "bash",
  "shell",
  "json",
  "javascript",
  "jsx",
] as const;

const THEME = "github-dark" as const;

let highlighterPromise: Promise<Highlighter> | null = null;

export async function getSharedHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [THEME],
      langs: [...SUPPORTED_LANGS],
    });
  }
  return highlighterPromise;
}

export async function highlightCode(
  code: string,
  language: string
): Promise<string> {
  const highlighter = await getSharedHighlighter();
  const loaded = highlighter.getLoadedLanguages();
  const lang = loaded.includes(language) ? language : "tsx";

  return highlighter.codeToHtml(code, {
    lang,
    theme: THEME,
  });
}

export { THEME };
