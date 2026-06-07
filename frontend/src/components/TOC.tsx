import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w一-龥-]/g, "");
}

export function extractHeadings(markdown: string): Heading[] {
  return markdown
    .split("\n")
    .map((line) => line.match(/^(#{1,3})\s+(.+)/))
    .filter(Boolean)
    .map((m) => ({ level: m![1].length, text: m![2], id: slugify(m![2]) }));
}

export default function TOC({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "0px 0px -60% 0px" }
    );
    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">目录</p>
      <ul className="space-y-1.5">
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: `${(h.level - 1) * 12}px` }}>
            <a
              href={`#${h.id}`}
              className={`block text-sm leading-snug transition-colors hover:text-gray-900 ${
                activeId === h.id ? "text-gray-900 font-medium" : "text-gray-400"
              }`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
