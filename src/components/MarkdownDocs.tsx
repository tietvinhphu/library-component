import { compileMarkdownToJsx } from "@/lib/markdown-code";

interface MarkdownDocsProps {
  content: string;
}

export default async function MarkdownDocs({
  content,
}: Readonly<MarkdownDocsProps>) {
  const body = await compileMarkdownToJsx(content);

  return <div className="prose-catalog">{body}</div>;
}
