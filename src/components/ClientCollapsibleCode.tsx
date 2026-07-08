"use client";

import { useState } from "react";
import CodeTerminal from "./CodeTerminal";
import CodeCopyButton from "./CodeCopyButton";

interface ClientCollapsibleCodeProps {
  html: string;
  rawCode: string;
  language?: string;
  collapsible?: boolean;
}

export default function ClientCollapsibleCode({
  html,
  rawCode,
  language,
  collapsible = true,
}: Readonly<ClientCollapsibleCodeProps>) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (collapsible) {
    return (
      <div className={`code-terminal-wrapper ${isExpanded ? "expanded" : "collapsed"}`}>
        {/* Code content area */}
        <div className="code-terminal-content">
          <CodeTerminal language={language}>
            <div
              className="code-terminal-highlight"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </CodeTerminal>
        </div>

        {/* Collapsed state: centered "View Code" pill overlay */}
        {!isExpanded && (
          <div className="code-terminal-collapsed-overlay">
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="code-terminal-view-btn"
              aria-label="View full code"
            >
              View Code
            </button>
          </div>
        )}

        {/* Expanded state: Footer with Collapse and Copy */}
        {isExpanded && (
          <div className="code-terminal-footer">
            <div className="code-terminal-footer-left">
              <CodeCopyButton code={rawCode} />
            </div>
            <div className="code-terminal-footer-right">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="code-terminal-collapse-btn"
                aria-expanded="true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 15l-6-6-6 6" />
                </svg>
                Collapse
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="code-terminal-wrapper expanded">
      <CodeTerminal language={language}>
        <div
          className="code-terminal-highlight"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </CodeTerminal>
      <div className="code-terminal-top-bar">
        <CodeCopyButton code={rawCode} />
      </div>
    </div>
  );
}
