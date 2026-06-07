import { useEffect, useState, type FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import apiClient from "@/api/client";
import { useAuth } from "@/context/AuthContext";
import type { Post, Comment } from "@/types";

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [postLoading, setPostLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiClient
      .get<Post>(`/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch(() => navigate("/", { replace: true }))
      .finally(() => setPostLoading(false));

    apiClient.get<Comment[]>(`/posts/${id}/comments`).then((res) => setComments(res.data));
  }, [id, navigate]);

  async function handleComment(e: FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const res = await apiClient.post<Comment>(`/posts/${id}/comments`, { content: commentText });
      setComments((prev) => [...prev, res.data]);
      setCommentText("");
    } finally {
      setSubmitting(false);
    }
  }

  if (postLoading) return <div className="h-96 bg-gray-100 rounded-xl animate-pulse" />;
  if (!post) return null;

  return (
    <article className="max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight leading-tight mb-3">{post.title}</h1>
        <p className="text-sm text-gray-400">{new Date(post.created_at).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}</p>
      </header>

      <Separator className="mb-8" />

      <div className="prose prose-gray prose-headings:font-semibold prose-a:text-blue-600 max-w-none">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      <Separator className="my-12" />

      <section>
        <h2 className="text-lg font-semibold mb-6">评论 {comments.length > 0 && <span className="text-gray-400 font-normal text-base">· {comments.length}</span>}</h2>

        {comments.length === 0 && (
          <p className="text-gray-400 text-sm mb-6">还没有评论，来说第一句吧。</p>
        )}

        <div className="flex flex-col gap-5 mb-8">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarFallback className="text-xs">{c.author_username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-medium">{c.author_username}</span>
                  <span className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString("zh-CN")}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{c.content}</p>
              </div>
            </div>
          ))}
        </div>

        {user ? (
          <form onSubmit={handleComment} className="flex flex-col gap-3">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="写下你的评论…"
              rows={3}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <Button type="submit" disabled={submitting} size="sm" className="self-start">
              {submitting ? "发送中…" : "发表评论"}
            </Button>
          </form>
        ) : (
          <p className="text-sm text-gray-400">
            <Link to="/login" className="text-gray-900 underline underline-offset-2">登录</Link> 后才能发表评论
          </p>
        )}
      </section>
    </article>
  );
}
