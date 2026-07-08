import type { Element } from "hast";
import type { Pluggable } from "unified";
import type { Components } from "hast-util-to-jsx-runtime";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { getSharedHighlighter } from "@/lib/shiki";
import MarkdownCodeBlock from "@/components/MarkdownCodeBlock";

const rehypePrettyCodeOptions = {
  theme: "github-dark",
  keepBackground: false,
  getHighlighter: getSharedHighlighter,
} as const;

export const markdownRehypePlugins: Pluggable[] = [
  [rehypePrettyCode, rehypePrettyCodeOptions],
];

function getLanguageFromFigure(node: Element): string | undefined {
  const pre = node.children.find(
    (child): child is Element =>
      child.type === "element" && child.tagName === "pre"
  );
  if (!pre) {
    return undefined;
  }

  const raw =
    pre.properties["data-language"] ?? pre.properties.dataLanguage;
  return typeof raw === "string" ? raw : undefined;
}

// Extract text content from hast element
function extractTextContent(node: Element): string {
  let text = "";
  for (const child of node.children) {
    if (child.type === "text") {
      text += child.value;
    } else if (child.type === "element") {
      text += extractTextContent(child);
    }
  }
  return text;
}

export const markdownCodeComponents: Components = {
  figure: ({ node, children, ...props }) => {
    if (node?.tagName !== "figure") {
      return jsx("figure", { ...props, children });
    }

    const language = getLanguageFromFigure(node);

    // Extract raw code for copy button
    const pre = node.children.find(
      (child: Element["children"][number]): child is Element =>
        child.type === "element" && child.tagName === "pre"
    );
    const code = pre?.children.find(
      (child: Element["children"][number]): child is Element =>
        child.type === "element" && child.tagName === "code"
    );
    const rawCode = pre && code ? extractTextContent(code) : "";

    return (
      <MarkdownCodeBlock language={language} rawCode={rawCode}>
        <figure {...props}>{children}</figure>
      </MarkdownCodeBlock>
    );
  },
};

const markdownProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypePrettyCode, rehypePrettyCodeOptions);

export async function compileMarkdownToJsx(content: string) {
  const tree = await markdownProcessor.run(markdownProcessor.parse(content));

  return toJsxRuntime(tree, {
    Fragment,
    jsx,
    jsxs,
    components: markdownCodeComponents,
    development: false,
    passNode: true,
  });
}
