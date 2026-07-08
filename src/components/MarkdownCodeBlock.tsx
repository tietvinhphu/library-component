"use client";

import CodeTerminal from "./CodeTerminal";
import CodeCopyButton from "./CodeCopyButton";
import type { ReactNode } from "react";

interface MarkdownCodeBlockProps {
  children: ReactNode;
  language?: string;
  rawCode: string;
}

export default function MarkdownCodeBlock({
  children,
  language,
  rawCode,
}: Readonly<MarkdownCodeBlockProps>) {
  return (
    <CodeTerminal language={language} actions={<CodeCopyButton code={rawCode} />}>
      {children}
    </CodeTerminal>
  );
}
