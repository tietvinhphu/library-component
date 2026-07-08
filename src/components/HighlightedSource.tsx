import { highlightCode } from "@/lib/shiki";
import ClientCollapsibleCode from "./ClientCollapsibleCode";

interface HighlightedSourceProps {
  code: string;
  language?: string;
  collapsible?: boolean;
}

export default async function HighlightedSource({
  code,
  language = "tsx",
  collapsible = true,
}: Readonly<HighlightedSourceProps>) {
  const html = await highlightCode(code, language);

  return (
    <ClientCollapsibleCode
      html={html}
      rawCode={code}
      language={language}
      collapsible={collapsible}
    />
  );
}
