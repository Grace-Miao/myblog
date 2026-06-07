import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "@/api/client";
import type { Post } from "@/types";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient
      .get<Post[]>("/posts/")
      .then((res) => setPosts(res.data))
      .catch(() => setError("Failed to load posts"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1 style={{ marginBottom: "2rem" }}>Posts</h1>
      {posts.length === 0 ? (
        <p style={{ color: "#666" }}>No posts yet. Create your first one!</p>
      ) : (
        <ul style={{ listStyle: "none" }}>
          {posts.map((post) => (
            <li key={post.id} style={{ marginBottom: "2rem", borderBottom: "1px solid #eee", paddingBottom: "2rem" }}>
              <Link to={`/posts/${post.id}`}>
                <h2 style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>{post.title}</h2>
              </Link>
              {post.excerpt && <p style={{ color: "#666" }}>{post.excerpt}</p>}
              <small style={{ color: "#999" }}>{new Date(post.created_at).toLocaleDateString("zh-CN")}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
