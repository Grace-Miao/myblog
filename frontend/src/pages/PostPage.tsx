import { useEffect, useState, type FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
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

    apiClient
      .get<Comment[]>(`/posts/${id}/comments`)
      .then((res) => setComments(res.data));
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

  if (postLoading) return <p>Loading...</p>;
  if (!post) return null;

  return (
    <article style={{ maxWidth: "720px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{post.title}</h1>
      <small style={{ color: "#999" }}>{new Date(post.created_at).toLocaleDateString("zh-CN")}</small>
      <div style={{ marginTop: "2rem", lineHeight: "1.8" }}>
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      <section style={{ marginTop: "4rem", borderTop: "1px solid #eee", paddingTop: "2rem" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>评论 · {comments.length}</h2>

        {comments.length === 0 ? (
          <p style={{ color: "#999" }}>还没有评论，来说第一句吧。</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, marginBottom: "2rem" }}>
            {comments.map((c) => (
              <li key={c.id} style={{ marginBottom: "1.2rem", paddingBottom: "1.2rem", borderBottom: "1px solid #f0f0f0" }}>
                <div style={{ display: "flex", gap: "0.6rem", alignItems: "baseline", marginBottom: "0.3rem" }}>
                  <strong style={{ fontSize: "0.95rem" }}>{c.author_username}</strong>
                  <small style={{ color: "#999" }}>{new Date(c.created_at).toLocaleDateString("zh-CN")}</small>
                </div>
                <p style={{ margin: 0, lineHeight: "1.6" }}>{c.content}</p>
              </li>
            ))}
          </ul>
        )}

        {user ? (
          <form onSubmit={handleComment} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="写下你的评论…"
              rows={3}
              required
              style={{ padding: "0.6rem", fontSize: "1rem", border: "1px solid #ccc", borderRadius: "4px", resize: "vertical" }}
            />
            <button
              type="submit"
              disabled={submitting}
              style={{ alignSelf: "flex-start", padding: "0.5rem 1.2rem", background: "#222", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              {submitting ? "发送中…" : "发表评论"}
            </button>
          </form>
        ) : (
          <p style={{ color: "#666" }}>
            <Link to="/login">登录</Link> 后才能发表评论
          </p>
        )}
      </section>
    </article>
  );
}
