import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "@/api/client";
import type { Post } from "@/types";

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<Post>(`/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch(() => navigate("/", { replace: true }))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <p>Loading...</p>;
  if (!post) return null;

  return (
    <article>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{post.title}</h1>
      <small style={{ color: "#999" }}>{new Date(post.created_at).toLocaleDateString("zh-CN")}</small>
      <div style={{ marginTop: "2rem", lineHeight: "1.8", whiteSpace: "pre-wrap" }}>{post.content}</div>
    </article>
  );
}
