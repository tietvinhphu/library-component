"use client";

import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";

interface ComponentData {
  name: string;
  title: string;
  description: string;
  dependencies: string[];
  docs: string | null;
  source: string | null;
  previewImage: string | null;
}

interface ComponentDetailClientProps {
  name: string;
}

export default function ComponentDetailClient({
  name,
}: Readonly<ComponentDetailClientProps>) {
  const [data, setData] = useState<ComponentData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/component/${name}`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, [name]);

  if (!data) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  const installCommand = `npx shadcn@latest add https://your-domain.com/r/${name}.json`;

  const handleCopy = () => {
    navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Preview Image */}
      <div className="border rounded-lg overflow-hidden bg-muted/30">
        {data.previewImage ? (
          <img
            src={data.previewImage}
            alt={`${name} preview`}
            className="w-full max-h-[400px] object-contain"
          />
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Chưa có preview
          </div>
        )}
      </div>

      {/* Title & Description */}
      <div>
        <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
        <p className="text-muted-foreground">{data.description}</p>
      </div>

      {/* Install Command */}
      <div className="flex items-center gap-2">
        <code className="flex-1 bg-muted px-4 py-2 rounded-md font-mono text-sm overflow-x-auto">
          {installCommand}
        </code>
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:opacity-90"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Dependencies */}
      {data.dependencies && data.dependencies.length > 0 && (
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Dependencies:</span>{" "}
          {data.dependencies.join(", ")}
        </div>
      )}

      {/* Docs */}
      {data.docs && (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown>{data.docs}</ReactMarkdown>
        </div>
      )}

      {/* Source Code */}
      {data.source && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Source Code</h2>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{data.source}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
