import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  getComponentByName,
  getComponentDocs,
  getComponentSource,
} from "@/lib/registry";
import ComponentDemo from "./ComponentDemo";
import InstallCommandCopy from "./InstallCommandCopy";

interface ComponentDetailProps {
  name: string;
}

export default function ComponentDetail({ name }: Readonly<ComponentDetailProps>) {
  const component = getComponentByName(name);

  if (!component) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Component not found
      </div>
    );
  }

  const docs = getComponentDocs(name);
  const source = getComponentSource(name);
  const installCommand = `npx shadcn@latest add https://your-domain.com/r/${name}.json`;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <ComponentDemo name={name} />

      <div className="space-y-2">
        <h1 className="text-display-sm">{component.title}</h1>
        <p className="text-body-md">{component.description}</p>
      </div>

      <InstallCommandCopy command={installCommand} />

      {component.dependencies.length > 0 && (
        <div className="text-body-md">
          <span className="text-ink font-medium">Dependencies:</span>{" "}
          <code className="font-mono text-[13px] text-ink">
            {component.dependencies.join(", ")}
          </code>
        </div>
      )}

      {docs && (
        <div className="prose-catalog">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{docs}</ReactMarkdown>
        </div>
      )}

      {source && (
        <div className="space-y-3">
          <h2 className="text-title-md">Source Code</h2>
          <pre className="code-block">
            <code>{source}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
