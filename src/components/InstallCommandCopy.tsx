"use client";

import { useState } from "react";

interface InstallCommandCopyProps {
  command: string;
}

export default function InstallCommandCopy({
  command,
}: Readonly<InstallCommandCopyProps>) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <code className="install-command flex-1 overflow-x-auto">{command}</code>
      <button type="button" onClick={handleCopy} className="button-secondary">
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
