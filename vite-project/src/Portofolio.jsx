import { useState, useEffect, useRef } from "react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const GITHUB_USERNAME = "NawwafNaufal"; // ← ganti ini
const GITHUB_TOKEN    = "REMOVED"; // ← Next.js pakai: process.env.NEXT_PUBLIC_GITHUB_TOKEN

const NAV_LINKS = ["Blog", "Portfolio", "About", "Projects"];

const GALLERY_ITEMS = [
  { id:1, title:"Dashboard UI",    label:"Redesign Project, 2024", tag:"UI/UX",     accent:"#b4ff50", color:"#111", img:"../public/image/Hrd1.png"},
  { id:2, title:"E-Commerce App",  label:"Freelance, 2024",        tag:"Frontend",  accent:"#b4ff50", color:"#111", img:"../public/image/Hrd2.png"},
  { id:3, title:"Design System",   label:"Open Source, 2023",      tag:"Design",    accent:"#f5c842", color:"#111", img:"../public/image/Hrd4.png"},
  { id:4, title:"Portfolio v1",    label:"Personal, 2023",         tag:"Dev",       accent:"#22d3ee", color:"#111", img:"../public/image/Hrd5.png"},
  { id:5, title:"Portfolio v2",    label:"Personal, 2023",         tag:"Dev",       accent:"#22d3ee", color:"#111", img:"../public/image/Monitoring1.png"},
  { id:6, title:"Portfolio v3",    label:"Personal, 2023",         tag:"Dev",       accent:"#22d3ee", color:"#111", img:"../public/image/Monitoring2.png"},
  { id:7, title:"Portfolio v4",    label:"Personal, 2023",         tag:"Dev",       accent:"#22d3ee", color:"#111", img:"../public/image/Monitoring3.png"},
  { id:8, title:"Portfolio v5",    label:"Personal, 2023",         tag:"Dev",       accent:"#22d3ee", color:"#111", img:"../public/image/Chat1.png"},
  { id:9, title:"Portfolio v6",    label:"Personal, 2023",         tag:"Dev",       accent:"#22d3ee", color:"#111", img:"../public/image/Chat2.png"},
  { id:10, title:"Portfolio v7",    label:"Personal, 2023",         tag:"Dev",       accent:"#22d3ee", color:"#111", img:"../public/image/Chat3.png"},
  { id:6, title:"Portfolio v3",    label:"Personal, 2023",         tag:"Dev",       accent:"#22d3ee", color:"#111", img:"../public/image/VidioMeet1.png"},
  { id:7, title:"Portfolio v4",    label:"Personal, 2023",         tag:"Dev",       accent:"#22d3ee", color:"#111", img:"../public/image/VidioMeet2.png"},
  { id:8, title:"Portfolio v5",    label:"Personal, 2023",         tag:"Dev",       accent:"#22d3ee", color:"#111", img:"../public/image/VidioMeet3.png"},
  { id:9, title:"Portfolio v6",    label:"Personal, 2023",         tag:"Dev",       accent:"#22d3ee", color:"#111", img:"../public/image/VidioMeet4.png"},
  { id:10, title:"Portfolio v7",    label:"Personal, 2023",         tag:"Dev",       accent:"#22d3ee", color:"#111", img:"../public/image/VidioMeet5.png"},
];

const EXPERIENCES = [
  { id:"left",  company:"PT Kreasi",  role:"UI/UX Designer",     year:"2023", desc:"Designed HR & monitoring web interfaces, developed internal web systems, and configured office network infrastructure.", tagline:"DESIGN" },
  { id:"right", company:"Startup.id", role:"Frontend Developer",  year:"2024", desc:"Built a mining operations dashboard deployed across multiple field sites,enabling real-time data monitoring at scale.",tagline:"DEV"    },
];

const BIO_LINES = [
  { text:"ABOUT ME",            color:"#ffffff", size:"clamp(1.2rem,2.5vw,2rem)",     weight:900, italic:false, blockBg:"#b8ad9e", spacing:"0.08em" },
  { text:"I am a passionate",   color:"#f5f0e8", size:"clamp(1.5rem,3.5vw,2.8rem)",   weight:800, italic:false, blockBg:"#b8ad9e", spacing:"-0.02em" },
  { text:"Software Engineer",   color:"#ffffff", size:"clamp(1.5rem,3.5vw,2.8rem)",   weight:800, italic:true,  blockBg:"#b8ad9e", spacing:"-0.01em" },
  { text:"building scalable",   color:"#f5f0e8", size:"clamp(1.2rem,3vw,2.4rem)",     weight:700, italic:false, blockBg:"#b8ad9e", spacing:"-0.02em" },
  { text:"backend architectures",color:"#f5f0e8", size:"clamp(1.2rem,3vw,2.4rem)",    weight:700, italic:false, blockBg:"#b8ad9e", spacing:"-0.02em" },
  { text:"& automated systems", color:"#a0a0a0", size:"clamp(1rem,2vw,1.6rem)",       weight:600, italic:true,  blockBg:"#b8ad9e",    spacing:"0.02em"  },
];

const CONTRIB_COLORS = ["#161616","#1f3d10","#2d5e17","#4a9a28","#b4ff50"];

// ─── FALLBACK DATA (saat loading / error) ────────────────────────────────────
const EMPTY_CONTRIB_DATA  = Array(371).fill(0);
const EMPTY_CONTRIB_STATS = { total: 0, streak: 0, best: 0 };

const N = GALLERY_ITEMS.length;

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function ease(t) {
  return t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2;
}

function lerpColor(a, b, t) {
  const p = (hex) => { const n = parseInt(hex.replace("#",""),16); return [(n>>16)&255,(n>>8)&255,n&255]; };
  const [ar,ag,ab] = p(a), [br,bg,bb] = p(b);
  return `rgb(${Math.round(ar+(br-ar)*t)},${Math.round(ag+(bg-ag)*t)},${Math.round(ab+(bb-ab)*t)})`;
}

// ─── GITHUB API ───────────────────────────────────────────────────────────────
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
  const recent = days.slice(-371);
  const counts = recent.map((d) => d.contributionCount);
  const max    = Math.max(...counts);

  const CONTRIB_DATA = counts.map((c) => toLevel(c, max));

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

// ─── KOMPONEN UTAMA ───────────────────────────────────────────────────────────
export default function Portfolio() {
  const rawRef    = useRef(0);
  const rafRef    = useRef(null);
  const smoothRef = useRef(0);
  const [p, setP] = useState(0);

  // ── Scene 3 animation refs ──────────────────────────────────
  const scene3PlayedRef = useRef(false);
  const animP3Ref  = useRef(0);
  const [animP3, setAnimP3] = useState(0);
  const animRafRef = useRef(null);
  const animStartRef = useRef(null);
  const ANIM_DUR = 1600;

  // ── Scene 5 animation refs ───────────────────────────────────
  const scene5PlayedRef  = useRef(false);
  const animP5Ref        = useRef(0);
  const [animP5, setAnimP5] = useState(0);
  const animRafRef5      = useRef(null);
  const animStartRef5    = useRef(null);
  const ANIM_DUR5        = 2200;

  // ── GitHub contributions state ───────────────────────────────
  const [contribData,  setContribData]  = useState(EMPTY_CONTRIB_DATA);
  const [contribStats, setContribStats] = useState(EMPTY_CONTRIB_STATS);
  const [githubLoading, setGithubLoading] = useState(true);
  const [githubError,   setGithubError]   = useState(null);

  const TOTAL = 3 + (N - 1) + 2;

  // Scene 3 trigger
  const runScene3Anim = () => {
    if (scene3PlayedRef.current) return;
    scene3PlayedRef.current = true;
    animStartRef.current = performance.now();
    const tick = (now) => {
      const elapsed = now - animStartRef.current;
      const raw = Math.min(1, elapsed / ANIM_DUR);
      animP3Ref.current = raw;
      setAnimP3(raw);
      if (raw < 1) animRafRef.current = requestAnimationFrame(tick);
    };
    animRafRef.current = requestAnimationFrame(tick);
  };

  // Scene 5 trigger
  const runScene5Anim = () => {
    if (scene5PlayedRef.current) return;
    scene5PlayedRef.current = true;
    animStartRef5.current = performance.now();
    const tick = (now) => {
      const elapsed = now - animStartRef5.current;
      const raw = Math.min(1, elapsed / ANIM_DUR5);
      animP5Ref.current = raw;
      setAnimP5(raw);
      if (raw < 1) animRafRef5.current = requestAnimationFrame(tick);
    };
    animRafRef5.current = requestAnimationFrame(tick);
  };

  // ── Scroll handler ───────────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      const diff = rawRef.current - smoothRef.current;
      if (Math.abs(diff) > 0.0003) {
        smoothRef.current += diff * 0.12;
        setP(smoothRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const onWheel = e => {
      e.preventDefault();
      const d = Math.max(-80, Math.min(80, e.deltaY)) / 900;
      rawRef.current = Math.max(0, Math.min(TOTAL, rawRef.current + d));
    };
    let ty = 0;
    const onTS = e => { ty = e.touches[0].clientY; };
    const onTM = e => {
      e.preventDefault();
      const d = (ty - e.touches[0].clientY) / 400;
      rawRef.current = Math.max(0, Math.min(TOTAL, rawRef.current + d));
      ty = e.touches[0].clientY;
    };

    window.addEventListener("wheel",      onWheel, { passive: false });
    window.addEventListener("touchstart", onTS,    { passive: true  });
    window.addEventListener("touchmove",  onTM,    { passive: false });
    return () => {
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(animRafRef.current);
      cancelAnimationFrame(animRafRef5.current);
      window.removeEventListener("wheel",      onWheel);
      window.removeEventListener("touchstart", onTS);
      window.removeEventListener("touchmove",  onTM);
    };
  }, []);

  // ── Scene trigger ────────────────────────────────────────────
  useEffect(() => {
    if (p >= 1.85 && !scene3PlayedRef.current) {
      runScene3Anim();
    }
    const scene5Start = 3 + (N - 1);
    if (p >= scene5Start + 0.08 && !scene5PlayedRef.current) {
      runScene5Anim();
    }
  }, [p]);

  // ── GitHub fetch ─────────────────────────────────────────────
  useEffect(() => {
    if (!GITHUB_TOKEN) {
      setGithubError("Token tidak ditemukan. Tambahkan VITE_GITHUB_TOKEN di .env");
      setGithubLoading(false);
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
        setGithubError(err.message);
      })
      .finally(() => setGithubLoading(false));
  }, []);

  // ── Computed values ──────────────────────────────────────────
  const p1  = ease(Math.min(1, Math.max(0, p)));
  const p2  = ease(Math.min(1, Math.max(0, p - 1)));
  const p3e = ease(Math.min(1, Math.max(0, p - 2)));
  const p4  =      Math.min(N-1, Math.max(0, p - 3));
  const p5  = ease(Math.min(1, Math.max(0, p - 3 - (N-1))));
  const p5r =      Math.min(1, Math.max(0, p - 3 - (N-1)));
  const p6  = ease(Math.min(1, Math.max(0, p - 3 - (N-1) - 1)));
  const p6r =      Math.min(1, Math.max(0, p - 3 - (N-1) - 1));

  const heroScale  = 1 - p1 * 0.62;
  const heroRadius = p1 * 20;
  const bgScrollVh = p2 * 100 + p3e * 100 + p5 * 100 + p6 * 100;
  const bgOpacity  = p1 < 0.15 ? 0 : Math.min(1, (p1 - 0.15) / 0.3);
  const navWide    = p1 > 0.05;
  const cardIdx    = Math.round(p4);
  const galleryBg  = lerpColor("#0f0f0f", "#f5f0e8", p4 / Math.max(1, N-1));

  const imgSlideLeft  = `translateX(${(1 - ease(Math.min(1, p5r*1.4))) * -110}%)`;
  const imgSlideRight = `translateX(${(1 - ease(Math.min(1, p5r*1.4))) *  110}%)`;
  const imgOpacity    = Math.min(1, p5r * 2.5);

  function blockReveal(lineIndex) {
    const ap = animP3;
    const STAGGER = 0.11;
    const raw     = Math.max(0, ap - lineIndex * STAGGER);
    const total   = BIO_LINES.length;
    const clamped = Math.min(1, raw * (total * 1.2));
    const phase1  = Math.min(1, clamped * 2.08);
    const phase2  = Math.min(1, Math.max(0, clamped * 2.08 - 1.15));
    const e1 = ease(phase1), e2 = ease(phase2);
    const blockX = phase2 > 0 ? e2 * 100 : -100 + e1 * 100;
    const textY  = phase2 > 0 ? 105 - e2 * 105 : 105;
    return { blockX, textY };
  }

  function blockRevealExp(lineIndex) {
    const ap = animP5;
    const STAGGER = 0.2;
    const raw = Math.max(0, ap - lineIndex * STAGGER);
    const clamped = Math.min(1, raw * 2);
    const phase1 = Math.min(1, clamped * 2.08);
    const phase2 = Math.min(1, Math.max(0, clamped * 2.08 - 1.15));
    const e1 = ease(phase1), e2 = ease(phase2);
    const blockX = phase2 > 0 ? e2 * 100 : -100 + e1 * 100;
    const textY  = phase2 > 0 ? 105 - e2 * 105 : 105;
    return { blockX, textY };
  }

  function labelReveal() {
    const ap = animP3;
    const clamped = Math.min(1, ap * (BIO_LINES.length * 1.2) * 1.1);
    const phase1  = Math.min(1, clamped * 2.08);
    const phase2  = Math.min(1, Math.max(0, clamped * 2.08 - 1.15));
    const e1 = ease(phase1), e2 = ease(phase2);
    return {
      blockX: phase2 > 0 ? e2 * 100 : -100 + e1 * 100,
      textY:  phase2 > 0 ? 105 - e2 * 105 : 105,
    };
  }

  const bottomBarOpacity = Math.min(1, Math.max(0, (animP3 - 0.78) / 0.18));
  const contribOpacity   = Math.min(1, p6r * 3);
  const contribSlideY    = (1 - Math.min(1, p6r * 3)) * 28;

  return (
    <div style={{ position:"fixed", inset:0, overflow:"hidden", background:"#0c0c0c", fontFamily:"'Inter',sans-serif" }}>

      {/* ══ TALL BACKGROUND PANEL — 500vh ═══════════════════════ */}
      <div style={{
        position:"absolute", left:0, right:0, top:0,
        height:"500vh", zIndex:1,
        transform:`translateY(-${bgScrollVh}vh)`,
        willChange:"transform",
        opacity: bgOpacity,
      }}>

        {/* ── SCENE 2 — BIO (0–100vh) ─────────────────────────── */}
        <div style={{
          height:"100vh", background:"#0f0f0f",
          display:"flex", alignItems:"center", justifyContent:"center",
          padding:"0 clamp(1.5rem,8vw,7rem)",
          overflow:"hidden", position:"relative",
        }}>
          <div style={{ position:"absolute", top:"-10%", right:"5%", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,rgba(255,220,80,0.12) 0%,transparent 65%)", pointerEvents:"none" }}/>
          <div style={{ maxWidth:960, width:"100%", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"5rem", alignItems:"center", position:"relative", zIndex:2 }}>
            <div>
              <p style={{ fontSize:"0.65rem", textTransform:"uppercase", letterSpacing:"0.28em", color:"#555", fontWeight:600, margin:"0 0 1rem" }}>About Me</p>
              <h2 style={{ margin:0, fontSize:"clamp(2.4rem,4.5vw,3.8rem)", fontWeight:900, color:"#fff", lineHeight:1.1, letterSpacing:"-0.03em" }}>
                Turning ideas<br/>into <span style={{ color:"#444" }}>reality.</span>
              </h2>
              <div style={{ marginTop:"2.5rem", display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:40, height:1, background:"#333" }}/>
                <span style={{ fontSize:"0.7rem", color:"#555", letterSpacing:"0.15em", textTransform:"uppercase" }}>Indonesia · 2024</span>
              </div>
            </div>
            <div>
              <p style={{ color:"#888", lineHeight:1.85, fontSize:"1rem", margin:0 }}>Hi! I'm <strong style={{ color:"#fff", fontWeight:700 }}>Nawwaf Naufal</strong> — a passionate backend engineer based in Indonesia.</p>
              <p style={{ color:"#666", lineHeight:1.85, fontSize:"0.95rem", marginTop:"1.2rem" }}>Currently open for freelance collaborations, internships, and exciting new projects.</p>
              <div style={{ marginTop:"2rem", display:"flex", gap:12, flexWrap:"wrap" }}>
                <a href="#" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#fff", color:"#111", fontSize:"0.85rem", fontWeight:600, padding:"12px 22px", borderRadius:99, textDecoration:"none" }}>View My Work ↗</a>
                <a href="#" style={{ display:"inline-flex", alignItems:"center", border:"1.5px solid #333", color:"#aaa", fontSize:"0.85rem", fontWeight:600, padding:"12px 22px", borderRadius:99, textDecoration:"none" }}>Download CV</a>
              </div>
            </div>
          </div>
        </div>

        {/* ── SCENE 3 — BIODATA BLOCK REVEAL (100–200vh) ──────── */}
        <div style={{
          height:"100vh", background:"#0f0f0f",
          display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center",
          padding:"clamp(1.5rem,6vw,5rem)",
          overflow:"hidden", position:"relative",
        }}>
          <div style={{ position:"absolute", top:"-5%", left:"55%", width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle,rgba(180,255,80,0.06) 0%,transparent 65%)", pointerEvents:"none" }}/>

          <div style={{ position:"absolute", top:"clamp(20px,3vh,36px)", left:"50%", transform:"translateX(-50%)", display:"flex", alignItems:"center", gap:16, overflow:"hidden" }}>
            {(() => {
              const { blockX, textY } = labelReveal();
              return (
                <>
                  <div style={{ display:"flex", alignItems:"center", gap:16, transform:`translateY(${textY}%)`, willChange:"transform" }}>
                    <span style={{ fontSize:"0.65rem", textTransform:"uppercase", letterSpacing:"0.3em", color:"#ffffff", fontWeight:700 }}>About Me</span>
                    <div style={{ width:48, height:1, background:"#404040" }}/>
                    <span style={{ fontSize:"0.65rem", textTransform:"uppercase", letterSpacing:"0.3em", color:"#888", fontWeight:600 }}>Teknik Informatika</span>
                  </div>
                </>
              );
            })()}
          </div>

          <div style={{
  position:"relative", zIndex:2,
  width:"100%",
  display:"flex", flexDirection:"column",
  alignItems:"center",
  gap:0,
  textAlign:"center",
}}>
  {[
    { text:"BUILD DIGITAL EXPERIENCES,", size:"clamp(3rem,7vw,5rem)", color:"#ffffff", blockBg:"#b8ad9e" },
{ text:"AND <span style='font-family:\"Bricolage Grotesque\",sans-serif;font-weight:600;color:#b8ad9e;'>Scalable</span> SYSTEMS,", size:"clamp(3rem,7vw,5rem)", color:"#ffffff", blockBg:"#b8ad9e" },
{ text:"PASSIONATE ABOUT <span style='font-family:\"Bricolage Grotesque\",sans-serif;font-weight:600;letter-spacing:0.05em;color:#b8ad9e;'>Backend</span> ENGINEERING.", size:"clamp(3rem,7vw,5rem)", color:"#ffffff", blockBg:"#b8ad9e" },
{ text:"DISTRIBUTED SYSTEMS", size:"clamp(3rem,8.5vw,5rem)", color:"#ffffff", blockBg:"#b8ad9e" },
{ text:"AND CREATING <span style='font-family:\"Bricolage Grotesque\",sans-serif;font-weight:600;color:#b8ad9e;'>Impactful</span> PRODUCTS", size:"clamp(2rem,8.5vw,5rem)", color:"#ffffff", blockBg:"#b8ad9e" },
{ text:"ALWAYS LEARNING.", size:"clamp(3rem,7vw,5rem)", color:"#ffffff", blockBg:"#b8ad9e" },
{ text:"ALWAYS <span style='font-family:\"Bricolage Grotesque\",sans-serif;font-weight:600;color:#b8ad9e;'>Building.</span>", size:"clamp(3rem,7vw,5rem)", color:"#ffffff", blockBg:"#b8ad9e" },
  ].map((line, i) => {
    const { blockX, textY } = blockReveal(i);
    return (
      <span key={i} style={{ display:"block", overflow:"hidden", position:"relative", lineHeight:1.1, width:"100%" }}>
        <span
          dangerouslySetInnerHTML={{ __html: line.text }}
          style={{
            display:"block",
            width:"100%",
            fontSize: line.size,
            fontWeight:300,
            color: line.color,
            letterSpacing:"-0.01em",
            textTransform:"uppercase",
            fontFamily:"'Bebas Neue', sans-serif",
            lineHeight:1.1,
            transform:`translateY(${textY}%)`,
            willChange:"transform",
          }}
        />
        <span style={{
          position:"absolute", top:0, bottom:0,
          left:"-5%", right:"-5%",
          background:line.blockBg,
          transform:`translateX(${blockX}%)`,
          willChange:"transform", zIndex:3
        }}/>
      </span>
    );
  })}
</div>

<div style={{ marginTop:"2rem", width:1, height:44, background:"linear-gradient(to bottom,#333,transparent)", opacity:bottomBarOpacity }}/>
        </div>

        {/* ── SCENE 4 — GALLERY (200–300vh) ───────────────────── */}
    
       {(() => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div style={{
      height: isMobile ? "auto" : "100vh",
      minHeight: "100vh",
      background: galleryBg,
      overflow: isMobile ? "visible" : "hidden",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: isMobile ? "flex-start" : "center"
    }}>
      {(() => {
        const t = Math.min(1, p4 / Math.max(1, N-1));
        const labelColor = `rgb(${Math.round(58+120*t)},${Math.round(58+100*t)},${Math.round(58+60*t)})`;
        const lineColor  = `rgba(${Math.round(32+140*t)},${Math.round(32+120*t)},${Math.round(32+100*t)},1)`;

        const SCATTER = [
          { top:"18vh", left:"2vw",   w:"35vw", speed:1.0, z:3, rotate:1  },
          { top:"56vh", left:"34vw",  w:"35vw", speed:1.0, z:2, rotate:1  },
          { top:"18vh", left:"39vw",  w:"35vw", speed:1.0, z:4, rotate:1  },
          { top:"56vh", left:"71vw",  w:"35vw", speed:1.0, z:2, rotate:-1 },
          { top:"18vh", left:"120vw", w:"35vw", speed:1.0, z:2, rotate:-1 },
          { top:"56vh", left:"140vw", w:"35vw", speed:1.0, z:2, rotate:-1 },
          { top:"56vh", left:"176vw", w:"35vw", speed:1.0, z:2, rotate:0  },
          { top:"18vh", left:"230vw", w:"35vw", speed:1.0, z:2, rotate:-1 },
          { top:"36vh", left:"268vw", w:"35vw", speed:1.0, z:2, rotate:-1 },
          { top:"56vh", left:"306vw", w:"35vw", speed:1.0, z:2, rotate:-1 },
          { top:"18vh", left:"360vw", w:"35vw", speed:1.0, z:2, rotate:-1 },
          { top:"36vh", left:"390vw", w:"35vw", speed:1.0, z:2, rotate:0  },
          { top:"56vh", left:"423vw", w:"35vw", speed:1.0, z:2, rotate:-1 },
          { top:"18vh", left:"463vw", w:"35vw", speed:1.0, z:2, rotate:-1 },
          { top:"49vh", left:"496vw", w:"35vw", speed:1.0, z:2, rotate:-1 },
        ];

        const PROJECTS = [
          {
            title: "Program HRD",
            year: "Built in 2024",
            desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            stack: ["React JS", "Express", "MySQL", "Bootstrap"],
            imageIndexes: [0, 1, 2, 3],
            infoLeft: "2vw", infoTop: "57vh",
            yearLeft: "80vw", yearTop: "53vh",
          },
          {
            title: "Sistem Monitoring Inventori",
            year: "Built in 2024",
            desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            stack: ["React JS", "Express", "MySQL", "Bootstrap"],
            imageIndexes: [4, 5, 6],
            infoLeft: "160vw", infoTop: "29vh",
            yearLeft: null, yearTop: null,
          },
          {
            title: "Sistem Monitoring Inventori 2",
            year: null,
            desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            stack: ["React JS", "Express", "MySQL", "Bootstrap"],
            imageIndexes: [7, 8, 9],
            infoLeft: "231vw", infoTop: "56vh",
            yearLeft: null, yearTop: null,
          },
          {
            title: "Rest API VidioMeet",
            year: null,
            desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            stack: ["Node JS", "Express", "MySQL", "Postman"],
            imageIndexes: [10, 11, 12, 13, 14],
            infoLeft: "430vw", infoTop: "32vh",
            yearLeft: null, yearTop: null,
          },
        ];

        const PROJECT_INFO_BY_INDEX = {};
        PROJECTS.forEach(proj => {
          proj.imageIndexes.forEach((imgIdx, posInGroup) => {
            PROJECT_INFO_BY_INDEX[imgIdx] = {
              ...proj,
              isFirst: posInGroup === 0,
            };
          });
        });

        const scrollShift = p4 * 31;

        const StackBadges = ({ stack }) => (
          <div style={{ display:"flex", gap:6, marginTop:10, flexWrap:"wrap" }}>
            {stack.map(tech => (
              <span key={tech} style={{
                fontSize: "clamp(0.4rem, 0.6vw, 0.6rem)",
                padding: "3px 8px",
                border: "0.5px solid rgba(255,255,255,0.3)",
                color: "rgba(255,255,255,0.7)",
                borderRadius: 4,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}>
                {tech}
              </span>
            ))}
          </div>
        );

        // ══════════════════════════════════════════
        // MOBILE LAYOUT
        // ══════════════════════════════════════════
        if (isMobile) {
          return (
            <div style={{ padding: "80px 20px 60px", boxSizing: "border-box" }}>

              {/* Header */}
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:40 }}>
                <span style={{ fontSize:"0.55rem", textTransform:"uppercase", letterSpacing:"0.3em", color:labelColor, fontWeight:600 }}>Selected Work</span>
                <div style={{ flex:1, height:1, background:lineColor }}/>
                <span style={{ fontSize:"0.55rem", textTransform:"uppercase", letterSpacing:"0.3em", color:labelColor, fontWeight:600 }}>2023 — 2024</span>
              </div>

              {/* Card per proyek */}
              {PROJECTS.map((proj, projIdx) => (
                <div key={projIdx} style={{ marginBottom: 56 }}>

                  {/* Grid gambar 2 kolom */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: proj.imageIndexes.length === 1 ? "1fr" : "1fr 1fr",
                    gap: 8,
                    marginBottom: 16,
                  }}>
                    {proj.imageIndexes.map(imgIdx => {
                      const item = GALLERY_ITEMS[imgIdx];
                      if (!item) return null;
                      return (
                        <div key={imgIdx} style={{
                          width: "100%",
                          aspectRatio: "16/10",
                          overflow: "hidden",
                          borderRadius: 6,
                          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                        }}>
                          {item.img
                            ? <img src={item.img} alt={item.title} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top left", display:"block" }}/>
                            : <div style={{ width:"100%", height:"100%", background:"#1a1a1a" }}/>
                          }
                        </div>
                      );
                    })}
                  </div>

                  {/* Judul */}
                  <p style={{
                    margin: "0 0 4px",
                    fontSize: "clamp(1rem, 5vw, 1.3rem)",
                    color: "#ffffff",
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                  }}>
                    {proj.title}
                  </p>

                  {/* Tahun */}
                  {proj.year && (
                    <p style={{ margin:"0 0 8px", fontSize:"0.6rem", color:"rgba(255,255,255,0.4)", letterSpacing:"0.1em" }}>
                      {proj.year}
                    </p>
                  )}

                  {/* Deskripsi */}
                  <p style={{
                    margin: 0,
                    fontSize: "clamp(0.7rem, 3.5vw, 0.85rem)",
                    color: "rgba(255,255,255,0.65)",
                    lineHeight: 1.8,
                    letterSpacing: "0.02em",
                  }}>
                    {proj.desc}
                  </p>

                  <StackBadges stack={proj.stack} />

                  {/* Divider */}
                  {projIdx < PROJECTS.length - 1 && (
                    <div style={{ marginTop:32, height:1, background:"rgba(255,255,255,0.08)" }}/>
                  )}
                </div>
              ))}
            </div>
          );
        }

        // ══════════════════════════════════════════
        // DESKTOP LAYOUT
        // ══════════════════════════════════════════
        const InfoCard = ({ info, shiftX }) => (
          <div style={{
            position: "absolute",
            top: info.infoTop,
            left: `calc(${info.infoLeft} - ${shiftX}vw)`,
            width: "clamp(160px, 28vw, 320px)",
            zIndex: 999,
          }}>
            <p style={{
              margin: "0 0 8px",
              fontSize: "clamp(0.65rem, 1vw, 0.85rem)",
              color: "#ffffff",
              fontFamily: "'Bebas Neue', sans-serif",
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}>
              {info.title}
            </p>
            <p style={{
              margin: 0,
              fontSize: "clamp(0.55rem, 0.8vw, 0.7rem)",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.75,
              letterSpacing: "0.02em",
            }}>
              {info.desc}
            </p>
            <StackBadges stack={info.stack} />
          </div>
        );

        return (<>
          {/* Header desktop */}
          <div style={{ position:"absolute", top:"clamp(60px,8vh,80px)", left:"clamp(1.5rem,6vw,5rem)", right:"clamp(1.5rem,6vw,5rem)", display:"flex", alignItems:"center", justifyContent:"space-between", zIndex:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:"clamp(8px,1vw,16px)" }}>
              <span style={{ fontSize:"clamp(0.5rem,0.6vw,0.6rem)", textTransform:"uppercase", letterSpacing:"0.3em", color:labelColor, fontWeight:600 }}>Selected Work</span>
              <div style={{ width:"clamp(24px,3vw,48px)", height:1, background:lineColor }}/>
              <span style={{ fontSize:"clamp(0.5rem,0.6vw,0.6rem)", textTransform:"uppercase", letterSpacing:"0.3em", color:labelColor, fontWeight:600 }}>2023 — 2024</span>
            </div>
          </div>

          {GALLERY_ITEMS.slice(0,15).map((item, i) => {
            const s = SCATTER[i];
            const shiftX = scrollShift * s.speed;
            const infoData = PROJECT_INFO_BY_INDEX[i];

            return (
              <div key={item.id}>
                {/* Gambar */}
                <div style={{
                  position: "absolute",
                  top: s.top,
                  left: `calc(${s.left} - ${shiftX}vw)`,
                  width: s.w,
                  height: "35vh",
                  overflow: "hidden",
                  willChange: "left",
                  zIndex: s.z,
                  transform: `rotate(${s.rotate}deg)`,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                }}>
                  {item.img
                    ? <img src={item.img} alt={item.title} style={{ width:"100%", height:"100%", objectFit:"contain", objectPosition:"top left", display:"block" }}/>
                    : <div style={{ width:"100%", height:"100%", background:"#111" }}/>
                  }
                </div>

                {/* Info card — hanya gambar pertama per proyek */}
                {infoData?.isFirst && <InfoCard info={infoData} shiftX={shiftX} />}

                {/* Year label */}
                {infoData?.isFirst && infoData?.year && (
                  <p style={{
                    position: "absolute",
                    top: infoData.yearTop,
                    left: `calc(${infoData.yearLeft} - ${shiftX}vw)`,
                    fontSize: "clamp(0.5rem, 0.65vw, 0.65rem)",
                    color: "rgba(255,255,255,0.45)",
                    letterSpacing: "0.08em",
                    margin: 0,
                    zIndex: 999,
                  }}>
                    {infoData.year}
                  </p>
                )}
              </div>
            );
          })}
        </>);
      })()}
    </div>
  );
})()}

        {/* ── SCENE 5 — EXPERIENCE (300–400vh) ────────────────── */}
        <div style={{ height:"100vh", background:"#f5f0e8", overflow:"hidden", position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.18, pointerEvents:"none" }} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
            <path d="M-100 200 Q200 100 500 300 T1100 250 T1600 200" fill="none" stroke="#8a7e6e" strokeWidth="1.2"/>
            <path d="M-100 350 Q300 200 600 400 T1200 350 T1600 300" fill="none" stroke="#8a7e6e" strokeWidth="1.2"/>
            <path d="M-100 500 Q250 350 550 520 T1150 470 T1600 430" fill="none" stroke="#8a7e6e" strokeWidth="1.2"/>
            <path d="M-100 650 Q350 500 650 650 T1300 580 T1600 570" fill="none" stroke="#8a7e6e" strokeWidth="1.2"/>
            <path d="M-100 800 Q400 640 700 780 T1380 720 T1600 710" fill="none" stroke="#8a7e6e" strokeWidth="1.2"/>
          </svg>
          <div style={{
            position: "absolute",
            top: "25%",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 14,
            zIndex: 10,
          }}>
            <div style={{ width: 40, height: 1, background: "#c0b8a8" }} />
            <span style={{
              fontSize: "0.85rem",
              textTransform: "uppercase",
              letterSpacing: "0.25em",
              color: "#9a9080",
              fontWeight: 700,
            }}>Experience</span>
            <div style={{ width: 40, height: 1, background: "#c0b8a8" }} />
          </div>

          <div style={{ display:"flex", gap:"4rem", alignItems:"flex-start", justifyContent:"center" }}>
            {/* Kiri */}
            <div style={{ textAlign:"right", width:300, overflow:"visible" ,transform:imgSlideLeft}}>
              {[
  ["OFF",    "'Instrument Serif', serif",  400, "5rem"],
  ["INTERN", "'Bebas Neue', sans-serif",            400, "6rem"],
].map(([text, font, weight, size], i) => {
  const { blockX, textY } = blockRevealExp(i);
  return (
    <span key={i} style={{ display:"block", overflow:"hidden", position:"relative", lineHeight:1.1 }}>
      <span style={{ 
        display: "block", 
        fontFamily: font,        
        fontSize: size,          
        fontWeight: weight,      
        letterSpacing: "-0.03em", 
        color: "#111", 
        lineHeight: 1, 
        transform: `translateY(${textY}%)`, 
        willChange: "transform" 
      }}>
        {text}
      </span>
      <span style={{ 
        position:"absolute", top:0, bottom:0, left:"-5%", right:"-5%", 
        background:"#d0c8b8", 
        transform:`translateX(${blockX}%)`, 
        willChange:"transform", 
        zIndex:3 
      }}/>
    </span>
  );
})}
              {(() => {
                const { textY } = blockRevealExp(2);
                return (
                  <>
                    <span style={{ display:"block", fontSize:"0.75rem", color:"#9a9080", letterSpacing:"0.1em", marginTop:"0.5rem", transform:`translateY(${textY}%)`, willChange:"transform" }}>AUG 2024 — OCT 2024</span>
                    <span style={{ display:"block", fontSize:"0.85rem", color:"#111", fontWeight:600, letterSpacing:"0.05em", marginTop:"0.3rem", transform:`translateY(${textY}%)`, willChange:"transform" }}>Full Stack Developer</span>
                    <p style={{ fontSize:"0.82rem", color:"#7a7060", lineHeight:1.6, margin:"1rem 0 0", textAlign:"right", transform:`translateY(${textY}%)`, willChange:"transform" }}>{EXPERIENCES[0].desc}</p>
                  </>
                );
              })()}
            </div>

            {/* Kanan */}
            <div style={{ textAlign:"left", width:300 ,transform:imgSlideRight}}>
              {[
  ["ON",     "'Instrument Serif', serif", 400, "5rem"],
  ["INTERN", "'Bebas Neue', sans-serif",  400, "6rem"],
].map(([text, font, weight, size], i) => {
  const { blockX, textY } = blockRevealExp(i);
  return (
    <span key={i} style={{ display:"block", overflow:"hidden", position:"relative", lineHeight:1.1 }}>
      <span style={{ 
        display: "block", 
        fontFamily: font,
        fontSize: size, 
        fontWeight: weight, 
        letterSpacing: "-0.03em", 
        color: "#111", 
        lineHeight: 1, 
        transform: `translateY(${textY}%)`, 
        willChange: "transform" 
      }}>
        {text}
      </span>
      <span style={{ 
        position:"absolute", top:0, bottom:0, left:"-5%", right:"-5%", 
        background:"#b4ff50", 
        transform:`translateX(${blockX}%)`, 
        willChange:"transform", 
        zIndex:3 
      }}/>
    </span>
  );
})}
              {(() => {
                const { textY } = blockRevealExp(2);
                return (
                  <>
                    <span style={{ display:"block", fontSize:"0.75rem", color:"#9a9080", letterSpacing:"0.1em", marginTop:"0.5rem", transform:`translateY(${textY}%)`, willChange:"transform" }}>DEC 2025 — NOW</span>
                    <span style={{ display:"block", fontSize:"0.85rem", color:"#111", fontWeight:600, letterSpacing:"0.05em", marginTop:"0.3rem", transform:`translateY(${textY}%)`, willChange:"transform" }}>Operational Area Programmer</span>
                    <p style={{ fontSize:"0.82rem", color:"#7a7060", lineHeight:1.6, margin:"1rem 0 0", textAlign:"left", transform:`translateY(${textY}%)`, willChange:"transform" }}>{EXPERIENCES[1].desc}</p>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Panel kiri - logo */}
          <div style={{ position:"absolute", left:"-3vw", top:0, bottom:0, transform:imgSlideLeft, opacity:imgOpacity, willChange:"transform,opacity", zIndex:10, display:"flex", flexDirection:"column", justifyContent:"center", padding:"clamp(1.5rem,4vw,2.5rem)" }}>
            <img src="/starfood.svg" alt="Starfood International" style={{ width:"450px", height:"auto" }} />
          </div>

          {/* Panel kanan - logo */}
          <div style={{ position:"absolute", right:0, top:0, bottom:0, transform:imgSlideRight, opacity:imgOpacity, willChange:"transform,opacity", zIndex:10, display:"flex", flexDirection:"column", justifyContent:"center", padding:"clamp(1.5rem,4vw,2.5rem)" }}>
            <img src="/UTSG.png" alt="Startup" style={{ width:"350px", height:"auto", marginLeft:"2vw" }} />
          </div>
        </div>

        {/* ── SCENE 6 — CONTRIBUTIONS (400–500vh) ─────────────── */}
        {/* (kosong — scene 6 dirender sebagai panel terpisah di bawah) */}

      </div>{/* end tall panel */}

      {/* ══ SCENE 6 — CONTRIBUTIONS PANEL ══════════════════════ */}
      <div style={{
        height:"100vh", background:"#181818",
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        padding:"clamp(1.5rem,6vw,5rem)",
        overflow:"hidden", position:"relative",
        transform: `translateY(${(1 - ease(Math.min(1, p6r * 1.8))) * 100}%)`,
        willChange: "transform",
        zIndex: 5,
      }}>
        <div style={{ position:"absolute", top:"-5%", left:"40%", width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle,rgba(180,255,80,0.04) 0%,transparent 65%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:"-10%", right:"10%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(180,255,80,0.03) 0%,transparent 65%)", pointerEvents:"none" }}/>

        <div style={{
          width:"100%", maxWidth:960,
          opacity: contribOpacity,
          transform:`translateY(${contribSlideY}px)`,
          willChange:"transform,opacity",
        }}>
          {/* Header */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"2.5rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              <span style={{ fontSize:"0.6rem", textTransform:"uppercase", letterSpacing:"0.3em", color:"#444", fontWeight:600 }}>Contributions</span>
              <div style={{ width:48, height:1, background:"#1e1e1e" }}/>
              <span style={{ fontSize:"0.6rem", textTransform:"uppercase", letterSpacing:"0.3em", color:"#444", fontWeight:600 }}>Last 12 Months</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              {/* Status dot: kuning=loading, merah=error, hijau=sukses */}
              <div style={{
                width:6, height:6, borderRadius:"50%",
                background: githubError ? "#ff5050" : githubLoading ? "#ffcc00" : "#b4ff50",
                boxShadow:  githubError ? "0 0 8px rgba(255,80,80,0.5)" : githubLoading ? "0 0 8px rgba(255,200,0,0.4)" : "0 0 8px rgba(180,255,80,0.5)",
              }}/>
              <span style={{ fontSize:"0.6rem", color: githubError ? "#ff5050" : githubLoading ? "#ffcc00" : "#b4ff50", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" }}>
                {githubError ? "API Error" : githubLoading ? "Loading…" : "GitHub Activity"}
              </span>
            </div>
          </div>

          {/* Error banner */}
          {githubError && (
            <div style={{ padding:"10px 14px", background:"rgba(255,80,80,0.07)", border:"1px solid rgba(255,80,80,0.15)", borderRadius:6, marginBottom:"1.5rem" }}>
              <span style={{ fontSize:"0.7rem", color:"#ff5050" }}>{githubError}</span>
            </div>
          )}

          {/* Bulan label */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(12, 1fr)", marginBottom:6, paddingRight:2 }}>
            {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(m => (
              <span key={m} style={{ fontSize:"0.5rem", color:"#2a2a2a", textTransform:"uppercase", letterSpacing:"0.12em", fontWeight:600 }}>{m}</span>
            ))}
          </div>

          {/* Grid kontribusi */}
          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(53, 1fr)",
            gridTemplateRows:"repeat(7, 1fr)",
            gap:3,
            width:"100%",
            opacity: githubLoading ? 0.3 : 1,
            transition:"opacity 0.4s ease",
          }}>
            {contribData.map((v, i) => {
              const col = Math.floor(i / 7) + 1;
              const row = (i % 7) + 1;
              return (
                <div
                  key={i}
                  title={`${v} contribution${v !== 1 ? "s" : ""}`}
                  style={{
                    aspectRatio:"1/1",
                    borderRadius:2,
                    background: CONTRIB_COLORS[v],
                    border: v === 0 ? "1px solid #1a1a1a" : "none",
                    gridColumn: col,
                    gridRow: row,
                    transition:"transform 0.15s ease",
                    cursor:"default",
                  }}
                />
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:6, marginTop:10 }}>
            <span style={{ fontSize:"0.5rem", color:"#2a2a2a", letterSpacing:"0.12em", textTransform:"uppercase" }}>Less</span>
            {CONTRIB_COLORS.map((c, i) => (
              <div key={i} style={{ width:10, height:10, borderRadius:2, background:c, border: i===0 ? "1px solid #1a1a1a" : "none" }}/>
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
                    {githubLoading ? "—" : num}
                  </div>
                  <div style={{ fontSize:"0.55rem", color:"#333", textTransform:"uppercase", letterSpacing:"0.18em", lineHeight:1.6, marginTop:6, whiteSpace:"pre-line" }}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{ textAlign:"right", display:"flex", flexDirection:"column", alignItems:"flex-end", gap:10 }}>
              <p style={{ margin:0, fontSize:"0.75rem", color:"#333", lineHeight:1.7, maxWidth:200 }}>Building in public,<br/>one commit at a time.</p>
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

        <div style={{ position:"absolute", right:"clamp(1.5rem,3vw,2.5rem)", top:"50%", transform:"translateY(-50%) rotate(90deg)", fontSize:"0.55rem", color:"#1e1e1e", textTransform:"uppercase", letterSpacing:"0.3em", fontWeight:600, whiteSpace:"nowrap", opacity:contribOpacity }}>
          Open Source · Frontend
        </div>
        <div style={{ position:"absolute", left:"clamp(1.5rem,3vw,2.5rem)", top:"50%", transform:"translateY(-50%) rotate(-90deg)", fontSize:"0.5rem", color:"#1e1e1e", textTransform:"uppercase", letterSpacing:"0.25em", fontWeight:600, whiteSpace:"nowrap", opacity:contribOpacity }}>
          Mon · Wed · Fri
        </div>
      </div>

      {/* ══ HERO SCENE 1 ════════════════════════════════════════ */}
      <div style={{
        position:"absolute",
        top:`${-bgScrollVh}vh`,
        left:0, right:0, height:"100vh", zIndex:2,
        transform:`scale(${heroScale})`,
        borderRadius:`${heroRadius}px`,
        transformOrigin:"center center",
        overflow:"hidden",
        willChange:"transform,border-radius,top",
        background:"#f5f0e8",
        pointerEvents: p1 > 0.97 ? "none" : "auto",
      }}>
        <div style={{ position:"absolute", top:"12%", left:"52%", transform:"translate(-50%,0)", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,#f2dfa8 0%,transparent 65%)", opacity:0.5, pointerEvents:"none" }}/>

        <div style={{
          position:"absolute", inset:0,
          display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center",
          textAlign:"center",
          padding:"0 clamp(16px,5vw,72px)",
          transform:`translateY(${p1 * -20}px)`,
          opacity: 1 - p1 * 0.5,
        }}>
          <p style={{ fontFamily:"'Caveat',cursive", fontSize:"clamp(1.8rem,3.2vw,3rem)", color:"#b0aaa0", fontWeight:400, margin:"0 0 0.1rem" }}>hi, i'm</p>
          <div style={{ fontSize:"clamp(3.6rem,10vw,11rem)", fontWeight:900, letterSpacing:"-0.04em", lineHeight:0.9, color:"#111827", userSelect:"none" }}>Muhammad</div>
          <div style={{ fontSize:"clamp(3.6rem,10vw,11rem)", fontWeight:900, letterSpacing:"-0.04em", lineHeight:0.9, color:"#111827", userSelect:"none" }}>Nawwaf</div>
          <div style={{ fontSize:"clamp(3.6rem,10vw,11rem)", fontWeight:900, letterSpacing:"-0.04em", lineHeight:0.9, color:"#d4cfc8", userSelect:"none", marginBottom:"clamp(0.8rem,2.5vh,1.8rem)" }}>Naufal</div>
          <p style={{ color:"#888", fontSize:"clamp(0.85rem,1.5vw,1.05rem)", lineHeight:1.65, margin:"0 0 1.6rem", maxWidth:400 }}>
            Backend Engineer building robust &amp;<br/>scalable digital systems.
          </p>
          <div style={{ display:"flex", gap:24, justifyContent:"center", opacity: 1 - p1 * 1.5 }}>
            {["Twitter","LinkedIn","GitHub"].map(s => (
              <a key={s} href="#" style={{ fontSize:"0.6rem", color:"#aaa", textTransform:"uppercase", letterSpacing:"0.18em", textDecoration:"none" }}>{s}</a>
            ))}
          </div>
        </div>

        <div style={{ position:"absolute", bottom:14, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:6, opacity:p1<0.04?1:0, transition:"opacity 0.4s", pointerEvents:"none" }}>
          <span style={{ fontSize:"0.58rem", color:"#999", textTransform:"uppercase", letterSpacing:"0.22em" }}>scroll</span>
          <div style={{ width:1, height:30, background:"linear-gradient(to bottom,#aaa,transparent)" }}/>
        </div>
      </div>

      {/* ══ MARQUEE ═════════════════════════════════════════════ */}
      {p1 > 0.15 && (
        <div style={{
          position:"absolute", zIndex:3,
          width:`${(100*heroScale).toFixed(2)}vw`,
          left:"50%", transform:"translateX(-50%)",
          top:`calc(${-bgScrollVh}vh + 50% + ${(50*heroScale).toFixed(2)}vh + 10px)`,
          opacity: Math.min(1,(p1-0.15)/0.35) * (1-p2*3),
          pointerEvents:"none",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:12, paddingLeft:4 }}>
            <span style={{ fontSize:"1rem", fontWeight:800, letterSpacing:"0.18em", textTransform:"uppercase", color:"#fff" }}>Skills</span>
            <div style={{ flex:1, height:"1px", background:"#333" }}/>
          </div>
          <div style={{ overflow:"hidden", borderTop:"1px solid #222", borderBottom:"1px solid #222", padding:"14px 0" }}>
            <div style={{ display:"flex", width:"max-content", animation:"marquee-left 30s linear infinite" }}>
              {["Babel","Tailwind","CSS3","React","Express","Git","HTML5","JavaScript","Jest","MongoDB","Mongoose","MySQL","Node.js","Postman","Prisma","Swagger","TypeScript","Redis","Socket.io","Docker",
                "Babel","Tailwind","CSS3","React","Express","Git","HTML5","JavaScript","Jest","MongoDB","Mongoose","MySQL","Node.js","Postman","Prisma","Swagger","TypeScript","Redis","Socket.io","Docker",
              ].map((s,i) => (
                <span key={i} style={{ fontSize:"1.1rem", fontWeight:700, color:i%5===2?"#fff":"#aaa", letterSpacing:"0.14em", textTransform:"uppercase", padding:"0 3rem", borderRight:"1px solid #2a2a2a", whiteSpace:"nowrap", flexShrink:0 }}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══ PROGRESS BAR ════════════════════════════════════════ */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, zIndex:200, background:"rgba(255,255,255,0.08)" }}>
        <div style={{ height:"100%", width:`${(p/TOTAL)*100}%`, background:"rgba(255,255,255,0.35)" }}/>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,700;1,900&display=swap');
        *{box-sizing:border-box;-webkit-font-smoothing:antialiased;}
        html,body{margin:0;padding:0;overflow:hidden;}
        a:hover{opacity:0.75;}
        @keyframes marquee-left{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
      `}</style>
    </div>
  );
}