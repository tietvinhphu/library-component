import type { ReactNode } from "react";

interface CodeTerminalProps {
  language?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export default function CodeTerminal({
  language,
  children,
  actions,
}: Readonly<CodeTerminalProps>) {
  return (
    <div className="code-terminal">
      <div className="code-terminal-titlebar">
        <div className="code-terminal-dots" aria-hidden="true">
          <span className="code-terminal-dot code-terminal-dot--red" />
          <span className="code-terminal-dot code-terminal-dot--yellow" />
          <span className="code-terminal-dot code-terminal-dot--green" />
        </div>
        <div className="code-terminal-titlebar-right">
          {language ? (
            <span className="code-terminal-language">{language}</span>
          ) : null}
          {actions}
        </div>
      </div>
      <div className="code-terminal-body">{children}</div>
    </div>
  );
}
