import { useEffect, useState } from "react";
import API from "../services/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "../components/CodeBlock";

const getTextContent = (node) => {
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (typeof node === "string") return node;
  if (node?.props?.children) return getTextContent(node.props.children);
  return "";
};

const HintParagraph = ({ children }) => {
  const text = getTextContent(children);
  if (text.trimStart().startsWith("|")) {
    const hintText = text.trimStart().slice(1).trimStart();
    return (
      <div className="hint-block">
        <span>|</span>
        <span>{hintText}</span>
      </div>
    );
  }
  return <p>{children}</p>;
};

function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authKey, setAuthKey] = useState("");
  const [authError, setAuthError] = useState("");
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedPostId, setExpandedPostId] = useState(null);

  const togglePost = (id) => {
    setExpandedPostId(expandedPostId === id ? null : id);
  };

  useEffect(() => {
    checkAuth();
    fetchPosts();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await API.get("/me");
      setAuthenticated(res.data.admin);
    } catch {
      setAuthenticated(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/posts");
      setPosts(res.data);
    } catch {
      setError("Gagal memuat postingan.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");

    try {
      const res = await API.post("/auth", { key: authKey });

      if (res.data?.success) {
        setAuthenticated(true);
        setAuthKey("");
      } else {
        setAuthError("Kunci admin salah.");
      }
    } catch {
      setAuthError("Kunci admin salah.");
    }
  };

  const handleLogout = async () => {
    await API.post("/logout");
    setAuthenticated(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editId) {
        await API.put(`/posts/${editId}`, form);
      } else {
        await API.post("/posts", form);
      }

      setForm({ title: "", content: "" });
      setEditId(null);
      fetchPosts();
    } catch {
      setError("Gagal menyimpan postingan.");
    }
  };

  const handleEdit = (post) => {
    setForm({ title: post.title, content: post.content });
    setEditId(post.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus post ini?")) return;
    try {
      await API.delete(`/posts/${id}`);
      fetchPosts();
    } catch {
      setError("Gagal menghapus postingan.");
    }
  };

  if (checkingAuth) {
    return <div>Checking auth...</div>;
  }

  return (
    <main className="admin-page">
      <div className="section-header">
        <div>
          <p className="section-label">Admin</p>
          <h2>Admin Dashboard</h2>
        </div>
      </div>

      {!authenticated ? (
        <section className="auth-card">
          <h3>Login Admin</h3>
          <form onSubmit={handleLogin} className="form-grid">
            <div className="form-group">
              <label htmlFor="admin-key">Kunci Admin</label>
              <input
                id="admin-key"
                type="password"
                className="input"
                value={authKey}
                onChange={(e) => setAuthKey(e.target.value)}
                placeholder="Masukkan kunci admin"
              />
            </div>
            <button type="submit" className="button button-primary">
              Login
            </button>
            {authError && (
              <p className="error-message" role="alert">
                {authError}
              </p>
            )}
          </form>
        </section>
      ) : (
        <>
          <section className="form-card">
            <div className="section-header">
              <div>
                <p className="section-label">Konten</p>
                <h3>{editId ? "Edit Post" : "Buat Post Baru"}</h3>
              </div>
              <button type="button" className="button button-secondary" onClick={handleLogout}>
                Logout
              </button>
            </div>

            <form onSubmit={handleSubmit} className="form-grid">
              <div className="form-group">
                <label htmlFor="post-title">Judul</label>
                <input
                  id="post-title"
                  className="input"
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Masukkan judul"
                />
              </div>

              <div className="form-group">
                <label htmlFor="post-content">Konten</label>
                <textarea
                  id="post-content"
                  className="textarea"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Masukkan konten markdown"
                />
              </div>

              <button type="submit" className="button button-primary">
                {editId ? "Update" : "Create"}
              </button>
            </form>

            {error && (
              <p className="error-message" role="alert">
                {error}
              </p>
            )}
          </section>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="posts-overview" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {posts.map((post) => (
                <article key={post.id} className="admin-post-card" style={{ padding: "20px" }}>
                  <div 
                    className="post-card-header" 
                    style={{ marginBottom: 0, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                    onClick={() => togglePost(post.id)}
                  >
                    <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "12px", fontSize: "1.15rem" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                        {expandedPostId === post.id ? "▼" : "▶"}
                      </span>
                      {post.title}
                    </h3>
                    <div onClick={(e) => e.stopPropagation()} style={{ display: "flex", gap: "10px", position: "relative", zIndex: 10 }}>
                      <button type="button" className="button button-secondary" style={{ padding: "8px 16px", fontSize: "0.9rem" }} onClick={() => handleEdit(post)}>
                        Edit
                      </button>
                      <button type="button" className="button button-secondary" style={{ padding: "8px 16px", fontSize: "0.9rem", color: "#fb7185" }} onClick={() => handleDelete(post.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  {expandedPostId === post.id && (
                    <div className="post-card-content" style={{ marginTop: "20px", borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ code: CodeBlock, p: HintParagraph }}>
                        {post.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default Admin;