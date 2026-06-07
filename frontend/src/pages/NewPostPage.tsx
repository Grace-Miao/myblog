import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/api/client";
import type { Post } from "@/types";

export default function NewPostPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiClient.post<Post>("/posts/", {
        title,
        content,
        excerpt: excerpt || null,
        is_published: isPublished,
      });
      navigate(`/posts/${res.data.id}`);
    } catch {
      setError("发布失败，请检查是否已登录");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "2rem" }}>写文章</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="标题"
          required
          style={{ padding: "0.6rem", fontSize: "1.2rem", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <input
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="摘要（可选）"
          style={{ padding: "0.6rem", fontSize: "1rem", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="正文（支持 Markdown）"
          required
          rows={20}
          style={{ padding: "0.6rem", fontSize: "1rem", border: "1px solid #ccc", borderRadius: "4px", resize: "vertical", fontFamily: "monospace", lineHeight: "1.6" }}
        />
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
          立即发布
        </label>
        {error && <p style={{ color: "red", margin: 0 }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "0.7rem", fontSize: "1rem", background: "#222", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", alignSelf: "flex-start" }}
        >
          {loading ? "发布中…" : "发布"}
        </button>
      </form>
    </div>
  );
}
