import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>写文章</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="标题"
              required
              className="w-full px-3 py-2 text-xl font-semibold border-0 border-b border-gray-200 focus:outline-none focus:border-gray-900 bg-transparent"
            />
            <input
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="摘要（可选，显示在文章列表）"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="正文（支持 Markdown）"
              required
              rows={20}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded"
                />
                立即发布
              </label>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" disabled={loading}>
                {loading ? "发布中…" : "发布"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
