import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";
import LoginPage from "./pages/LoginPage";
import NewPostPage from "./pages/NewPostPage";
import RegisterPage from "./pages/RegisterPage";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav style={{ padding: "1rem 2rem", borderBottom: "1px solid #eee", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Link to="/" style={{ fontWeight: "bold", fontSize: "1.2rem" }}>My Blog</Link>
      <div>
        {user ? (
          <span style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link to="/posts/new" style={{ color: "#333", fontSize: "0.95rem" }}>+ 写文章</Link>
            <span style={{ color: "#666" }}>{user.username}</span>
            <button onClick={handleLogout} style={{ background: "none", border: "1px solid #ccc", padding: "0.3rem 0.8rem", cursor: "pointer", borderRadius: "4px" }}>
              退出
            </button>
          </span>
        ) : (
          <Link to="/login" style={{ color: "#333" }}>登录</Link>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/posts/:id" element={<PostPage />} />
            <Route path="/login" element={<LoginPage />} />
          <Route path="/posts/new" element={<NewPostPage />} />
          <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}
