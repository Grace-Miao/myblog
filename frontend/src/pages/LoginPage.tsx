import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      navigate("/");
    } catch {
      setError("用户名或密码错误");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "360px", margin: "4rem auto" }}>
      <h1 style={{ marginBottom: "2rem" }}>登录</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="用户名"
          required
          style={{ padding: "0.6rem", fontSize: "1rem", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="密码"
          required
          style={{ padding: "0.6rem", fontSize: "1rem", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        {error && <p style={{ color: "red", margin: 0 }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "0.7rem", fontSize: "1rem", background: "#222", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          {loading ? "登录中…" : "登录"}
        </button>
      </form>
    </div>
  );
}
