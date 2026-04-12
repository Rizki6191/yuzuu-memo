import { useEffect, useState } from "react";
import { createHighlighter } from "shiki";

let highlighterPromise;

function getShiki() {
    if (!highlighterPromise) {
        highlighterPromise = createHighlighter({
            themes: ["github-dark"],
            langs: [
                "javascript",
                "typescript",
                "python",
                "bash",
                "json",
                "html",
                "css",
                "sql",
                "cpp",
                "c",
                "java",
            ],
        });
    }
    return highlighterPromise;
}

const aliases = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    py: "python",
    sh: "bash",
    shell: "bash",
    zsh: "bash",
    html: "html",
    css: "css",
    json: "json",
    sql: "sql",
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
                    theme: "github-dark", // wajib di v1+
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

        return () => {
            mounted = false;
        };
    }, [code, language, inline]);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    // Inline
    if (inline) {
        return (
            <code
                style={{
                    background: "#f2f2f2",
                    padding: "2px 6px",
                    borderRadius: 4,
                    fontSize: "0.9em",
                }}
            >
                {children}
            </code>
        );
    }

    return (
        <div
            style={{
                margin: "20px 0",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid #30363d",
                boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                background: "#0d1117",
            }}
        >
            {/* Header */}
            <div
                style={{
                    background: "#161b22",
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #30363d",
                }}
            >
                <span
                    style={{
                        fontSize: "12px",
                        color: "#7d8590",
                        fontWeight: "500",
                        textTransform: "lowercase",
                    }}
                >
                    {language}
                </span>

                <button
                    onClick={handleCopy}
                    style={{
                        fontSize: "12px",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        border: "1px solid #30363d",
                        background: "#0d1117",
                        color: "#c9d1d9",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = "#21262d";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = "#0d1117";
                    }}
                >
                    {copied ? "✓ Copied" : "Copy"}
                </button>
            </div>

            {/* Code */}
            {html ? (
                <div
                    className="shiki-container"
                    dangerouslySetInnerHTML={{ __html: html }}
                    style={{
                        fontSize: "14px",
                        lineHeight: "1.6",
                        padding: "14px",
                        overflowX: "auto",
                    }}
                />
            ) : (
                <pre
                    style={{
                        padding: "14px",
                        color: "#c9d1d9",
                    }}
                >
                    Loading...
                </pre>
            )}
        </div>
    );
}

export default CodeBlock;