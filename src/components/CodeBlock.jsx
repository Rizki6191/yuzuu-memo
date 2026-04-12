import { useEffect, useState } from "react";
import { createHighlighter } from "shiki";

let highlighterPromise;

function getShiki() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark"],
      langs: [
        "javascript", "typescript", "python", "bash", "json",
        "html", "css", "sql", "cpp", "c", "java",
      ],
    });
  }
  return highlighterPromise;
}

const aliases = {
  js: "javascript", jsx: "javascript",
  ts: "typescript",
  py: "python",
  sh: "bash", shell: "bash", zsh: "bash",
  html: "html", css: "css", json: "json", sql: "sql",
};

function CodeBlock({ inline, className, children }) {
  const [html, setHtml] = useState("");
  const [copied, setCopied] = useState(false);

  const match = /language-(\w+)/.exec(className || "");
  const rawLang = match?.[1]?.toLowerCase() || "";
  const language = aliases[rawLang] || rawLang || "plaintext";
  const code = String(children).trim();

  useEffect(() => {
    if (inline) return;

    let mounted = true;
    getShiki().then((highlighter) => {
      try {
        const result = highlighter.codeToHtml(code, {
          lang: language,
          theme: "github-dark",
        });
        if (mounted) setHtml(result);
      } catch {
        const fallback = highlighter.codeToHtml(code, {
          lang: "plaintext",
          theme: "github-dark",
        });
        if (mounted) setHtml(fallback);
      }
    });

    return () => { mounted = false; };
  }, [code, language, inline]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Inline code
  if (inline) {
    return (
      <code className="inline-code">
        {children}
      </code>
    );
  }

  // Block code - Diperbaiki untuk mobile (no horizontal scroll on body)
  return (
    <div className="code-block-container">
      {/* Header */}
      <div className="code-header">
        <span className="code-language">{language}</span>
        <button
          onClick={handleCopy}
          className="copy-button"
          type="button"
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      {/* Code Content */}
      {html ? (
        <div
          className="shiki-wrapper"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="loading-pre">Loading...</pre>
      )}
    </div>
  );
}

export default CodeBlock;