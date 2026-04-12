import { useState, useEffect } from "react";
import "./App.css";
import Home from "./pages/Home";
import Posts from "./pages/Posts";
import Admin from "./pages/Admin";
import API from "./services/api";

function App() {
  const getPageFromRoute = () => {
    const path = window.location.pathname;
    if (path === "/admin") return "admin";
    if (path.startsWith("/posts")) return "posts";
    return "home";
  };

  const [activePage, setActivePage] = useState(getPageFromRoute());
  const [maintenance, setMaintenance] = useState(false);

  // Menangani navigasi tombol Back/Forward browser
  useEffect(() => {
    const handlePopState = () => setActivePage(getPageFromRoute());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Fungsi pindah halaman tanpa refresh
  const navigateTo = (e, page, path) => {
    e.preventDefault();
    window.history.pushState({}, "", path);
    setActivePage(page);
  };

  useEffect(() => {
    // Ping API untuk cek koneksi (Ngrok)
    // Pastikan header 'ngrok-skip-browser-warning' ada di services/api.js
    API.get("/posts")
      .then(() => setMaintenance(false))
      .catch((error) => {
        if (!error.response || error.response.status >= 500) {
          setMaintenance(true);
        }
      });
  }, []);

  if (maintenance) {
    return (
      <div style={{ height: "100vh", backgroundColor: "#ffffff", display: "flex", justifyContent: "center", alignItems: "center", color: "#333333", flexDirection: "column", fontFamily: "sans-serif", textAlign: "center", padding: "20px" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Maintenance Mode</h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.8 }}>Server Backend (Ngrok) tidak terhubung atau sedang offline.</p>
        <button onClick={() => window.location.reload()} style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}>Coba Lagi</button>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <a className="brand" href="/" onClick={(e) => navigateTo(e, "home", "/")}>
          CTF Blog
        </a>
        <nav className="app-nav">
          <a className={`nav-link ${activePage === "home" ? "active" : ""}`} 
             href="/" onClick={(e) => navigateTo(e, "home", "/")}>Home</a>
          <a className={`nav-link ${activePage === "posts" ? "active" : ""}`} 
             href="/posts" onClick={(e) => navigateTo(e, "posts", "/posts")}>Posts</a>
          {/* <a className={`nav-link ${activePage === "admin" ? "active" : ""}`} 
             href="/admin" onClick={(e) => navigateTo(e, "admin", "/admin")}>Admin</a> */}
        </nav>
        <div className="brand-note">A minimal capture-the-flag inspired blog dashboard.</div>
      </header>

      <main className="app-content">
        {activePage === "home" && <Home />}
        {activePage === "posts" && <Posts />}
        {activePage === "admin" && <Admin />}
      </main>
    </div>
  );
}

export default App;