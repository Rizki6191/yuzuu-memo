import { useState, useEffect } from "react";
import "./App.css";
import Home from "./pages/Home";
import Posts from "./pages/Posts";
import Admin from "./pages/Admin";
import API from "./services/api";

function App() {
  const initialPage =
    typeof window !== "undefined"
      ? window.location.pathname === "/admin"
        ? "admin"
        : window.location.pathname.startsWith("/posts")
        ? "posts"
        : "home"
      : "home";
  const [activePage] = useState(initialPage);
  const [maintenance, setMaintenance] = useState(false);

  useEffect(() => {
    // Initial ping to check API status
    API.get("/posts").catch((error) => {
      if (!error.response || error.response.status >= 500) {
        setMaintenance(true);
      }
    });

    // Global interceptor for all API calls
    const interceptor = API.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!error.response || error.response.status >= 500) {
          setMaintenance(true);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      API.interceptors.response.eject(interceptor);
    };
  }, []);

  if (maintenance) {
    return (
      <div style={{ height: "100vh", backgroundColor: "#ffffff", display: "flex", justifyContent: "center", alignItems: "center", color: "#333333", flexDirection: "column", fontFamily: "sans-serif" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Maintenance Mode</h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.8 }}>Sistem sedang dalam perbaikan atau server tidak dapat dihubungi.</p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <a className="brand" href="/">
          CTF Blog
        </a>
        <nav className="app-nav">
          <a className="nav-link" href="/">Home</a>
          <a className="nav-link" href="/posts">Posts</a>
          {/* <a className="nav-link" href="/admin">Admin</a> */}
        </nav>
        <div className="brand-note">A minimal capture-the-flag inspired blog dashboard.</div>
      </header>

      {activePage === "home" && <Home />}
      {activePage === "posts" && <Posts />}
      {activePage === "admin" && <Admin />}
    </div>
  );
}

export default App;