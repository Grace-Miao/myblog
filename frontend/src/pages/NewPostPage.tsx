import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MarkdownEditor from "@/components/MarkdownEditor";
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
        title, content, excerpt: excerpt || null, is_published: isPublished,
      });
      navigate(`/posts/${res.data.id}`);
    } catch {
      setError("发布失败，请检查是否已登录");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="文章标题"
          required
          className="w-full px-0 py-2 text-2xl font-bold border-0 border-b border-gray-200 focus:outline-none focus:border-gray-900 bg-transparent"
        />
        <input
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="摘要（可选，显示在文章列表）"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />

        <MarkdownEditor value={content} onChange={setContent} minRows={24} />

        <div className="flex items-center justify-between py-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 select-none">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="rounded"
            />
            立即发布
          </label>
          <div className="flex items-center gap-3">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? "发布中…" : isPublished ? "发布文章" : "保存草稿"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
