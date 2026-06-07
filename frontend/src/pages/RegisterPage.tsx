import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "@/api/client";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiClient.post("/auth/register", { username, email, password });
      await login(username, password);
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? "注册失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "360px", margin: "4rem auto" }}>
      <h1 style={{ marginBottom: "2rem" }}>注册</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="用户名"
          required
          style={{ padding: "0.6rem", fontSize: "1rem", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="邮箱"
          required
          style={{ padding: "0.6rem", fontSize: "1rem", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="密码"
          required
          minLength={6}
          style={{ padding: "0.6rem", fontSize: "1rem", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        {error && <p style={{ color: "red", margin: 0 }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "0.7rem", fontSize: "1rem", background: "#222", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          {loading ? "注册中…" : "注册"}
        </button>
      </form>
      <p style={{ marginTop: "1rem", color: "#666", fontSize: "0.9rem" }}>
        已有账号？<Link to="/login">登录</Link>
      </p>
    </div>
  );
}
