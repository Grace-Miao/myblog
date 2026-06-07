import { useRef, useState } from "react";
import MarkdownRenderer from "./MarkdownRenderer";

type Mode = "write" | "split" | "preview";

interface Props {
  value: string;
  onChange: (val: string) => void;
  minRows?: number;
}

interface ToolbarBtn {
  label: string;
  title: string;
  action: () => void;
}

export default function MarkdownEditor({ value, onChange, minRows = 20 }: Props) {
  const [mode, setMode] = useState<Mode>("split");
  const ref = useRef<HTMLTextAreaElement>(null);

  function applyWrap(before: string, after: string) {
    const ta = ref.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e, value: v } = ta;
    const selected = v.slice(s, e);
    const next = v.slice(0, s) + before + selected + after + v.slice(e);
    onChange(next);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(s + before.length, e + before.length);
    }, 0);
  }

  function applyLinePrefix(prefix: string) {
    const ta = ref.current;
    if (!ta) return;
    const { selectionStart: s, value: v } = ta;
    const lineStart = v.lastIndexOf("\n", s - 1) + 1;
    const next = v.slice(0, lineStart) + prefix + v.slice(lineStart);
    onChange(next);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(s + prefix.length, s + prefix.length);
    }, 0);
  }

  function insertBlock(text: string) {
    const ta = ref.current;
    if (!ta) return;
    const { selectionStart: s, value: v } = ta;
    const prefix = s > 0 && v[s - 1] !== "\n" ? "\n" : "";
    const next = v.slice(0, s) + prefix + text + v.slice(s);
    onChange(next);
    setTimeout(() => ta.focus(), 0);
  }

  const buttons: ToolbarBtn[] = [
    { label: "H2", title: "二级标题", action: () => applyLinePrefix("## ") },
    { label: "H3", title: "三级标题", action: () => applyLinePrefix("### ") },
    { label: "B", title: "加粗", action: () => applyWrap("**", "**") },
    { label: "I", title: "斜体", action: () => applyWrap("*", "*") },
    { label: "`", title: "行内代码", action: () => applyWrap("`", "`") },
    { label: "```", title: "代码块", action: () => insertBlock("```\n\n```") },
    { label: "∑", title: "行内公式", action: () => applyWrap("$", "$") },
    { label: "∑∑", title: "公式块", action: () => insertBlock("$$\n\n$$") },
    { label: "链接", title: "链接", action: () => applyWrap("[", "](url)") },
    { label: "- 列表", title: "无序列表", action: () => applyLinePrefix("- ") },
    { label: "1. 列表", title: "有序列表", action: () => applyLinePrefix("1. ") },
  ];

  const showWrite = mode === "write" || mode === "split";
  const showPreview = mode === "preview" || mode === "split";

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* 工具栏 */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-gray-200 bg-gray-50 flex-wrap">
        {buttons.map((btn) => (
          <button
            key={btn.label}
            type="button"
            title={btn.title}
            onClick={btn.action}
            className="px-2 py-1 text-xs font-mono rounded hover:bg-gray-200 text-gray-600 transition-colors"
          >
            {btn.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1">
          {(["write", "split", "preview"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                mode === m ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-200"
              }`}
            >
              {{ write: "编辑", split: "分屏", preview: "预览" }[m]}
            </button>
          ))}
        </div>
      </div>

      {/* 编辑区 */}
      <div className={`grid ${mode === "split" ? "grid-cols-2 divide-x divide-gray-200" : "grid-cols-1"}`}>
        {showWrite && (
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="支持 Markdown、代码块、LaTeX 公式（$E=mc^2$）…"
            rows={minRows}
            className="w-full p-4 text-sm font-mono leading-relaxed resize-none focus:outline-none bg-white"
          />
        )}
        {showPreview && (
          <div className="p-4 overflow-y-auto min-h-[200px] bg-white">
            {value ? (
              <MarkdownRenderer content={value} />
            ) : (
              <p className="text-gray-300 text-sm">预览区域</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
