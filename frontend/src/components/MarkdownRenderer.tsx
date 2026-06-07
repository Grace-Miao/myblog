import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import CodeBlock from "./CodeBlock";

interface Props {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = "" }: Props) {
  return (
    <div className={`prose prose-gray prose-headings:font-semibold prose-a:text-blue-600 max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeSlug, rehypeHighlight, rehypeKatex]}
        components={{ pre: ({ children }) => <CodeBlock>{children}</CodeBlock> }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
