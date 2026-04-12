function Home() {
  return (
    <main className="home-page">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">ctf.blog</span>
          <h1>Discover posts like flags.</h1>
          <p className="hero-description">
            Browse writeups and challenge notes in a clean capture-the-flag style interface.
          </p>
          <div className="hero-meta">
            <span>Modern markdown rendering</span>
            <span>Code block highlighting</span>
            <span>Secure admin access</span>
          </div>
          <div className="hero-actions">
            <a className="button button-primary" href="/posts">
              View posts
            </a>
          </div>
        </div>
      </section>

      {/* Feature Grid untuk mengisi ruang kosong */}
      <section className="features-section" style={{ marginTop: "64px", display: "grid", gap: "24px", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        <div className="feature-card form-card">
          <h3 style={{ margin: "0 0 12px", color: "var(--accent)" }}>Markdown First</h3>
          <p style={{ color: "var(--text)", margin: 0, lineHeight: 1.6, opacity: 0.8 }}>Write everything in standard Markdown, easily layout code snippets, and render beautifully structured pages without effort.</p>
        </div>
        <div className="feature-card form-card">
          <h3 style={{ margin: "0 0 12px", color: "var(--accent)" }}>CTF Oriented</h3>
          <p style={{ color: "var(--text)", margin: 0, lineHeight: 1.6, opacity: 0.8 }}>Organize your challenge notes logically. Designed exactly like how GitBook handles hierarchies for deep technical notes.</p>
        </div>
        <div className="feature-card form-card">
          <h3 style={{ margin: "0 0 12px", color: "var(--accent)" }}>Lightning Fast</h3>
          <p style={{ color: "var(--text)", margin: 0, lineHeight: 1.6, opacity: 0.8 }}>Built on top of React & Vite. Fast hot module replacement for development and instantly loading pages for readers.</p>
        </div>
      </section>

      {/* Footer minimalis khas GitBook */}
      <footer style={{ marginTop: "80px", padding: "40px 0", borderTop: "1px solid var(--border)", textAlign: "center", color: "var(--muted)", fontSize: "0.9rem" }}>
        <p>Built with <span style={{ color: "var(--accent)", fontWeight: "bold" }}>React</span> & Vite ⚡</p>
        <p style={{ marginTop: "12px", opacity: 0.6 }}>© 2026 CTF Blog. Inspired by GitBook Layout.</p>
      </footer>
    </main>
  );
}

export default Home; 