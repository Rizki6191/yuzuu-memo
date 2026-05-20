import React from 'react';

function Home() {
  // Data Achievement Kompetisi
  const achievements = [
    {
      rank: "#178",
      title: "0xV01D CTF 2026",
      provider: "0xV01D from Jordan",
      participation: "Team (1 Players)",
      status: "Participant",
      color: "#1ce859" // Blue
    },
    {
      rank: "#379",
      title: "TJCTF 2026",
      provider: "Thomas Jefferson High School for Science and Technology",
      participation: "Team (1 Players)",
      status: "Participant",
      color: "#e81c1c" // Blue
    },
    {
      rank: "#5",
      title: "LKS JT2 CySec 2026",
      provider: "Kemendikbudristek",
      participation: "Team (2 Players)",
      status: "Qualifier Stage",
      color: "#1caee8" // Blue
    },
    {
      rank: "#3082",
      title: "picoCTF 2026",
      provider: "picoCTF",
      participation: "Team (2 Players)",
      status: "Participant",
      color: "#4CAF50" // Green
    },
    {
      rank: "#35",
      title: "FGTE 2026",
      provider: "FGTE by Aria",
      participation: "Team (2 Players)",
      status: "Participant",
      color: "#FFD700" // Gold
    },
    {
      rank: "#57",
      title: "CBC S3 2026",
      provider: "Cyber Breaker Community",
      participation: "Team (2 Players)",
      status: "Regional Stage",
      color: "#FF5722" // Orange
    },
    {
      rank: "-",
      title: "Cyber Jawara 2025",
      provider: "ID-SIRTII / BSSN",
      participation: "Team (2 Players)",
      status: "Qualifier Stage",
      color: "#fe2c07" // Blue
    },
    {
      rank: "-",
      title: "Cyber Wave 1.0",
      provider: "Cyber Wave Community",
      participation: "Team (2 Players)",
      status: "Qualifier Stage",
      color: "#00E5FF" // Blue
    }
  ];

  return (
    <main className="home-page" style={{ padding: "0 20px" }}>
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">ctf.blog</span>
          <h1>Rizki Syahrul Ramadhan</h1>
          <p className="hero-description">
            Software Engineering Student @ SMKN 10 Jakarta. <br />
            Cybersecurity Enthusiast | CTF Player | Fullstack Developer
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="/posts">
              View My Writeups
            </a>
          </div>
        </div>
      </section>

      {/* Achievement Section Minimalis */}
      <section style={{ marginTop: "48px" }}>
        <h2 style={{
          marginBottom: "32px",
          fontSize: "1.3rem",
          color: "var(--text)",
          textTransform: "uppercase",
          letterSpacing: "2px",
          opacity: 0.8
        }}>
          Competition
        </h2>

        <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          {achievements.map((item, index) => (
            <div key={index} className="feature-card form-card" style={{
              position: "relative",
              padding: "24px",
              display: "flex",
              alignItems: "center",
              gap: "20px",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              background: "rgba(255, 255, 255, 0.02)"
            }}>
              {/* Rank Big Number */}
              <div style={{
                fontSize: "1.6rem",
                fontWeight: "900",
                color: item.color,
                minWidth: "85px",
                borderRight: "1px solid var(--border)",
                lineHeight: 1,
                textAlign: "center",
                paddingRight: "15px"
              }}>
                {item.rank}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: "0.65rem",
                  fontWeight: "800",
                  color: item.color,
                  textTransform: "uppercase",
                  marginBottom: "4px",
                  letterSpacing: "0.5px"
                }}>
                  {item.status} 
                  
                </div>
                <div style={{
                  fontSize: "0.65rem",
                  fontWeight: "800",
                  color: item.color,
                  textTransform: "uppercase",
                  marginBottom: "4px",
                  letterSpacing: "0.5px"
                }}>
                  
                  {item.participation}
                </div>
                <h3 style={{ margin: 0, fontSize: "1.05rem", color: "var(--text)", fontWeight: "600" }}>
                  {item.title}
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "0.8rem", opacity: 0.5 }}>
                  Hosted by {item.provider}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ marginTop: "100px", padding: "40px 0", borderTop: "1px solid var(--border)", textAlign: "center" }}>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
          Built by <strong>Rizki Ramadhan</strong> — 2026 Edition
        </p>
        <p style={{ marginTop: "8px", fontSize: "0.8rem", opacity: 0.5 }}>
          SMKN 10 Jakarta • Software Engineering XI RPL
        </p>
      </footer>
    </main>
  );
}

export default Home;