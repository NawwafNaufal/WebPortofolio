import { useState, useEffect } from "react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const GITHUB_USERNAME = "Nawwaf Naufal"; // ← ganti ini
const GITHUB_TOKEN    = "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"; // ← Next.js: process.env.NEXT_PUBLIC_GITHUB_TOKEN

// ─── WARNA KONTRIBUSI ─────────────────────────────────────────────────────────
const CONTRIB_COLORS = ["#161616", "#1a3a00", "#2d6600", "#4d9e00", "#b4ff50"];

// ─── FALLBACK DATA (saat loading / error) ────────────────────────────────────
const EMPTY_DATA  = Array(371).fill(0);
const EMPTY_STATS = { total: 0, streak: 0, best: 0 };

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function toLevel(count, max) {
  if (count === 0 || max === 0) return 0;
  const r = count / max;
  if (r < 0.25) return 1;
  if (r < 0.5)  return 2;
  if (r < 0.75) return 3;
  return 4;
}

function transformCalendar(calendar) {
  const days   = calendar.weeks.flatMap((w) => w.contributionDays);
  const recent = days.slice(-371); // 53 weeks × 7 days
  const counts = recent.map((d) => d.contributionCount);
  const max    = Math.max(...counts);

  const CONTRIB_DATA = counts.map((c) => toLevel(c, max));

  // Streak terpanjang berturut-turut
  let streak = 0, cur = 0;
  for (const c of counts) {
    cur    = c > 0 ? cur + 1 : 0;
    streak = Math.max(streak, cur);
  }

  return {
    CONTRIB_DATA,
    CONTRIB_STATS: {
      total:  calendar.totalContributions,
      streak,
      best:   Math.max(...counts),
    },
  };
}

// ─── FETCH GITHUB GRAPHQL ─────────────────────────────────────────────────────
async function fetchGitHubContributions(username, token) {
  const query = `{
    user(login: "${username}") {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }`;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization:  `bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);

  return json.data.user.contributionsCollection.contributionCalendar;
}

// ─── EASE ─────────────────────────────────────────────────────────────────────
function ease(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ─── KOMPONEN UTAMA ───────────────────────────────────────────────────────────
export default function ContribSection({ p6r = 1, contribOpacity = 1, contribSlideY = 0 }) {
  const [contribData,  setContribData]  = useState(EMPTY_DATA);
  const [contribStats, setContribStats] = useState(EMPTY_STATS);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  useEffect(() => {
    if (!GITHUB_TOKEN) {
      setError("Token tidak ditemukan. Tambahkan VITE_GITHUB_TOKEN di .env");
      setLoading(false);
      return;
    }

    fetchGitHubContributions(GITHUB_USERNAME, GITHUB_TOKEN)
      .then((calendar) => {
        const { CONTRIB_DATA, CONTRIB_STATS } = transformCalendar(calendar);
        setContribData(CONTRIB_DATA);
        setContribStats(CONTRIB_STATS);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      style={{
        height:         "100vh",
        background:     "#181818",
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        padding:        "clamp(1.5rem,6vw,5rem)",
        overflow:       "hidden",
        position:       "relative",
        transform:      `translateY(${(1 - ease(Math.min(1, p6r * 1.8))) * 100}%)`,
        willChange:     "transform",
        zIndex:         5,
      }}
    >
      {/* Glow blobs */}
      <div style={{ position:"absolute", top:"-5%", left:"40%", width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle,rgba(180,255,80,0.04) 0%,transparent 65%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:"-10%", right:"10%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(180,255,80,0.03) 0%,transparent 65%)", pointerEvents:"none" }}/>

      <div
        style={{
          width:     "100%",
          maxWidth:  960,
          opacity:   contribOpacity,
          transform: `translateY(${contribSlideY}px)`,
          willChange:"transform,opacity",
        }}
      >
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"2.5rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <span style={{ fontSize:"0.6rem", textTransform:"uppercase", letterSpacing:"0.3em", color:"#444", fontWeight:600 }}>Contributions</span>
            <div style={{ width:48, height:1, background:"#1e1e1e" }}/>
            <span style={{ fontSize:"0.6rem", textTransform:"uppercase", letterSpacing:"0.3em", color:"#444", fontWeight:600 }}>Last 12 Months</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            {/* Dot: hijau kalau sukses, kuning kalau loading, merah kalau error */}
            <div style={{
              width:9, height:9, borderRadius:"50%",
              background: error ? "#ff5050" : loading ? "#ffcc00" : "#b4ff50",
              boxShadow:  error ? "0 0 8px rgba(255,80,80,0.5)" : loading ? "0 0 8px rgba(255,200,0,0.4)" : "0 0 8px rgba(180,255,80,0.5)",
            }}/>
            <span style={{ fontSize:"0.6rem", color: error ? "#ff5050" : loading ? "#ffcc00" : "#b4ff50", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" }}>
              {error ? "API Error" : loading ? "Loading…" : "GitHub Activity"}
            </span>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div style={{ padding:"10px 14px", background:"rgba(255,80,80,0.07)", border:"1px solid rgba(255,80,80,0.15)", borderRadius:6, marginBottom:"1.5rem" }}>
            <span style={{ fontSize:"0.7rem", color:"#ff5050" }}>{error}</span>
          </div>
        )}

        {/* Bulan label */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(12, 1fr)", marginBottom:6, paddingRight:2 }}>
          {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => (
            <span key={m} style={{ fontSize:"0.5rem", color:"#2a2a2a", textTransform:"uppercase", letterSpacing:"0.12em", fontWeight:600 }}>{m}</span>
          ))}
        </div>

        {/* Grid kontribusi */}
        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(53, 1fr)",
            gridTemplateRows:    "repeat(7, 1fr)",
            gap:                 3,
            width:               "100%",
            opacity:             loading ? 0.3 : 1,
            transition:          "opacity 0.4s ease",
          }}
        >
          {contribData.map((v, i) => {
            const col = Math.floor(i / 7) + 1;
            const row = (i % 7) + 1;
            return (
              <div
                key={i}
                title={`${v} contribution${v !== 1 ? "s" : ""}`}
                style={{
                  aspectRatio: "1/1",
                  borderRadius: 2,
                  background:  CONTRIB_COLORS[v],
                  border:      v === 0 ? "1px solid #1a1a1a" : "none",
                  gridColumn:  col,
                  gridRow:     row,
                  transition:  "transform 0.15s ease",
                  cursor:      "default",
                }}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:6, marginTop:10 }}>
          <span style={{ fontSize:"0.5rem", color:"#2a2a2a", letterSpacing:"0.12em", textTransform:"uppercase" }}>Less</span>
          {CONTRIB_COLORS.map((c, i) => (
            <div key={i} style={{ width:10, height:10, borderRadius:2, background:c, border: i === 0 ? "1px solid #1a1a1a" : "none" }}/>
          ))}
          <span style={{ fontSize:"0.5rem", color:"#2a2a2a", letterSpacing:"0.12em", textTransform:"uppercase" }}>More</span>
        </div>

        <div style={{ height:1, background:"#141414", margin:"2rem 0 1.8rem" }}/>

        {/* Stats + CTA */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
          <div style={{ display:"flex", gap:"3.5rem" }}>
            {[
              { num: contribStats.total,  label:"Total\nContributions", color:"#fff" },
              { num: contribStats.streak, label:"Day\nStreak",          color:"#b4ff50" },
              { num: contribStats.best,   label:"Best\nDay",            color:"#fff" },
            ].map(({ num, label, color }) => (
              <div key={label}>
                <div style={{ fontSize:"clamp(1.8rem,3vw,2.8rem)", fontWeight:900, color, letterSpacing:"-0.04em", lineHeight:1 }}>
                  {loading ? "—" : num}
                </div>
                <div style={{ fontSize:"0.55rem", color:"#333", textTransform:"uppercase", letterSpacing:"0.18em", lineHeight:1.6, marginTop:6, whiteSpace:"pre-line" }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign:"right", display:"flex", flexDirection:"column", alignItems:"flex-end", gap:10 }}>
            <p style={{ margin:0, fontSize:"0.75rem", color:"#333", lineHeight:1.7, maxWidth:200 }}>
              Building in public,<br/>one commit at a time.
            </p>
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#b4ff50", color:"#0a0a0a", fontSize:"0.75rem", fontWeight:700, padding:"10px 20px", borderRadius:99, textDecoration:"none", letterSpacing:"0.04em" }}
            >
              GITHUB PROFILE ↗
            </a>
          </div>
        </div>
      </div>

      {/* Side labels */}
      <div style={{ position:"absolute", right:"clamp(1.5rem,3vw,2.5rem)", top:"50%", transform:"translateY(-50%) rotate(90deg)", fontSize:"0.55rem", color:"#1e1e1e", textTransform:"uppercase", letterSpacing:"0.3em", fontWeight:600, whiteSpace:"nowrap", opacity:contribOpacity }}>
        Open Source · Frontend
      </div>
      <div style={{ position:"absolute", left:"clamp(1.5rem,3vw,2.5rem)", top:"50%", transform:"translateY(-50%) rotate(-90deg)", fontSize:"0.5rem", color:"#1e1e1e", textTransform:"uppercase", letterSpacing:"0.25em", fontWeight:600, whiteSpace:"nowrap", opacity:contribOpacity }}>
        Mon · Wed · Fri
      </div>
    </div>
  );
}