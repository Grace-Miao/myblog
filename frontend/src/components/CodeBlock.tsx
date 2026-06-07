import { useState, type ReactNode } from "react";

export default function CodeBlock({ children }: { children: ReactNode }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const text = extractText(children);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="relative group my-4">
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity
          px-2 py-1 text-xs rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
      >
        {copied ? "已复制 ✓" : "复制"}
      </button>
      <pre className="overflow-x-auto rounded-lg !bg-gray-50 border border-gray-200 !p-4 text-sm">
        {children}
      </pre>
    </div>
  );
}

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node) return "";
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && "props" in (node as any)) {
    return extractText((node as any).props.children);
  }
  return "";
}
