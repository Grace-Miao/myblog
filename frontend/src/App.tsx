import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Button } from "@/components/ui/button";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";
import LoginPage from "./pages/LoginPage";
import NewPostPage from "./pages/NewPostPage";
import RegisterPage from "./pages/RegisterPage";
import AboutPage from "./pages/AboutPage";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg tracking-tight">miaop.me</Link>
        <nav className="flex items-center gap-4">
          <Link to="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">About</Link>
          {user ? (
            <>
              <Link to="/posts/new">
                <Button size="sm" variant="outline">写文章</Button>
              </Link>
              <span className="text-sm text-gray-500">{user.username}</span>
              <Button size="sm" variant="ghost" onClick={() => { logout(); navigate("/"); }}>退出</Button>
            </>
          ) : (
            <Link to="/login">
              <Button size="sm">登录</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="max-w-3xl mx-auto px-4 py-10">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/posts/:id" element={<PostPage />} />
              <Route path="/posts/new" element={<NewPostPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </main>
          <footer className="border-t border-gray-200 mt-20">
            <div className="max-w-3xl mx-auto px-4 py-6 text-center text-sm text-gray-400">
              © 2025 miaop.me
            </div>
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
