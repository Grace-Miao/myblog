import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";

function Navbar() {
  return (
    <nav style={{ padding: "1rem 2rem", borderBottom: "1px solid #eee", background: "#fff" }}>
      <Link to="/" style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
        My Blog
      </Link>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/:id" element={<PostPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
