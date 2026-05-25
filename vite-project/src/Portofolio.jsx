import { useState, useEffect, useRef } from "react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || "NawwafNaufal";
const GITHUB_TOKEN    = import.meta.env.VITE_GITHUB_TOKEN || "REMOVED";

const NAV_LINKS = ["Blog", "Portfolio", "About", "Projects"];

const GALLERY_ITEMS = [
  { id:1,  title:"Dashboard UI",    label:"Redesign Project, 2024", tag:"UI/UX",    accent:"#b4ff50", color:"#111", img:"image/Hrd1.png"},
  { id:2,  title:"E-Commerce App",  label:"Freelance, 2024",        tag:"Frontend", accent:"#b4ff50", color:"#111", img:"/image/Hrd2.png"},
  { id:3,  title:"Design System",   label:"Open Source, 2023",      tag:"Design",   accent:"#f5c842", color:"#111", img:"/image/Hrd4.png"},
  { id:4,  title:"Portfolio v1",    label:"Personal, 2023",         tag:"Dev",      accent:"#22d3ee", color:"#111", img:"/image/Hrd5.png"},
  { id:5,  title:"Portfolio v2",    label:"Personal, 2023",         tag:"Dev",      accent:"#22d3ee", color:"#111", img:"/image/Monitoring1.png"},
  { id:6,  title:"Portfolio v3",    label:"Personal, 2023",         tag:"Dev",      accent:"#22d3ee", color:"#111", img:"/image/Monitoring2.png"},
  { id:7,  title:"Portfolio v4",    label:"Personal, 2023",         tag:"Dev",      accent:"#22d3ee", color:"#111", img:"/image/Monitoring3.png"},
  { id:8,  title:"Portfolio v5",    label:"Personal, 2023",         tag:"Dev",      accent:"#22d3ee", color:"#111", img:"/image/Chat1.png"},
  { id:9,  title:"Portfolio v6",    label:"Personal, 2023",         tag:"Dev",      accent:"#22d3ee", color:"#111", img:"/image/Chat2.png"},
  { id:10, title:"Portfolio v7",    label:"Personal, 2023",         tag:"Dev",      accent:"#22d3ee", color:"#111", img:"/image/Chat3.png"},
  { id:6,  title:"Portfolio v3",    label:"Personal, 2023",         tag:"Dev",      accent:"#22d3ee", color:"#111", img:"/image/VidioMeet1.png"},
  { id:7,  title:"Portfolio v4",    label:"Personal, 2023",         tag:"Dev",      accent:"#22d3ee", color:"#111", img:"/image/VidioMeet2.png"},
  { id:8,  title:"Portfolio v5",    label:"Personal, 2023",         tag:"Dev",      accent:"#22d3ee", color:"#111", img:"/image/VidioMeet3.png"},
  { id:9,  title:"Portfolio v6",    label:"Personal, 2023",         tag:"Dev",      accent:"#22d3ee", color:"#111", img:"/image/VidioMeet4.png"},
  { id:10, title:"Portfolio v7",    label:"Personal, 2023",         tag:"Dev",      accent:"#22d3ee", color:"#111", img:"/image/VidioMeet5.png"},
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
  { text:"backend architectures",color:"#f5f0e8",size:"clamp(1.2rem,3vw,2.4rem)",     weight:700, italic:false, blockBg:"#b8ad9e", spacing:"-0.02em" },
  { text:"& automated systems", color:"#a0a0a0", size:"clamp(1rem,2vw,1.6rem)",       weight:600, italic:true,  blockBg:"#b8ad9e", spacing:"0.02em"  },
];

const CONTRIB_COLORS = ["#161616","#1f3d10","#2d5e17","#4a9a28","#b4ff50"];

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
    CONTRIB_STATS: { total: calendar.totalContributions, streak, best: Math.max(...counts) },
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
    headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data.user.contributionsCollection.contributionCalendar;
}

// ─── MOBILE SCENE 3 (block reveal, dipicu IntersectionObserver) ───────────────
function MobileScene3() {
  const ref = useRef(null);
  const [ap, setAp] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const played = useRef(false);
  const DUR = 1600;

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !played.current) {
        played.current = true;
        startRef.current = performance.now();
        const tick = (now) => {
          const raw = Math.min(1, (now - startRef.current) / DUR);
          setAp(raw);
          if (raw < 1) rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => { obs.disconnect(); cancelAnimationFrame(rafRef.current); };
  }, []);

  const LINES = [
    { html: "BUILD DIGITAL EXPERIENCES," },
    { html: "AND <span style='font-family:\"Bricolage Grotesque\",sans-serif;font-weight:600;color:#b8ad9e;'>Scalable</span> SYSTEMS," },
    { html: "PASSIONATE ABOUT <span style='font-family:\"Bricolage Grotesque\",sans-serif;font-weight:600;letter-spacing:0.05em;color:#b8ad9e;'>Backend</span> ENGINEERING." },
    { html: "DISTRIBUTED SYSTEMS" },
    { html: "AND CREATING <span style='font-family:\"Bricolage Grotesque\",sans-serif;font-weight:600;color:#b8ad9e;'>Impactful</span> PRODUCTS" },
    { html: "ALWAYS LEARNING." },
    { html: "ALWAYS <span style='font-family:\"Bricolage Grotesque\",sans-serif;font-weight:600;color:#b8ad9e;'>Building.</span>" },
  ];

  function blockReveal(i) {
    const STAGGER = 0.11;
    const raw = Math.max(0, ap - i * STAGGER);
    const clamped = Math.min(1, raw * (LINES.length * 1.2));
    const p1 = Math.min(1, clamped * 2.08);
    const p2 = Math.min(1, Math.max(0, clamped * 2.08 - 1.15));
    const e = t => t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2;
    return {
      blockX: p2 > 0 ? e(p2)*100 : -100 + e(p1)*100,
      textY:  p2 > 0 ? 105 - e(p2)*105 : 105,
    };
  }

  return (
    <div ref={ref} style={{
      minHeight: "55vh", background:"#0f0f0f",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      padding:"80px 24px 60px", overflow:"hidden", position:"relative"
    }}>
      <div style={{ position:"absolute", top:"20px", left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", overflow:"hidden" }}>
        {(() => {
          const clamped = Math.min(1, ap * (LINES.length * 1.2) * 1.1);
          const phase1  = Math.min(1, clamped * 2.08);
          const phase2  = Math.min(1, Math.max(0, clamped * 2.08 - 1.15));
          const e = t => t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2;
          const textY = phase2 > 0 ? 105 - e(phase2) * 105 : 105;
          return (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, transform:`translateY(${textY}%)`, willChange:"transform", textAlign:"center" }}>
              <span style={{ fontSize:"0.58rem", textTransform:"uppercase", letterSpacing:"0.25em", color:"#ffffff", fontWeight:700, lineHeight:1.2 }}>About Me</span>
              <span style={{ fontSize:"0.55rem", textTransform:"uppercase", letterSpacing:"0.25em", color:"#888", fontWeight:600, lineHeight:1.2 }}>Teknik Informatika</span>
            </div>
          );
        })()}
      </div>

      {LINES.map((line, i) => {
        const { blockX, textY } = blockReveal(i);
        return (
          <span key={i} style={{
            display:"block", overflow:"hidden",
            position:"relative", lineHeight:1.1,
            width:"100%", textAlign:"center"
          }}>
            <span
              dangerouslySetInnerHTML={{ __html: line.html }}
              style={{
                display:"block", width:"100%",
                fontSize:"clamp(1.6rem,7vw,3.5rem)",
                fontWeight:300, color:"#ffffff",
                letterSpacing:"-0.01em", textTransform:"uppercase",
                fontFamily:"'Bebas Neue', sans-serif", lineHeight:1.1,
                transform:`translateY(${textY}%)`, willChange:"transform"
              }}
            />
            <span style={{
              position:"absolute", top:0, bottom:0,
              left:"-5%", right:"-5%", background:"#b8ad9e",
              transform:`translateX(${blockX}%)`,
              willChange:"transform", zIndex:3
            }}/>
          </span>
        );
      })}
    </div>
  );
}

// ─── MOBILE SCENE 5 (fully scroll-driven animations) ──────
function MobileScene5({ scrollY }) {
  const ref = useRef(null);

  // Calculate entry progress (ap) based on scroll position
  const getApProgress = () => {
    if (!ref.current || typeof window === "undefined") return 0;
    const rect = ref.current.getBoundingClientRect();
    const vh = window.innerHeight;
    const elementTop = rect.top + window.scrollY;
    // Slide-in starts when the section starts entering the viewport from the bottom
    const start = elementTop - vh;
    // Slide-in finishes when the section is scrolled nicely into view (e.g. top of section at 35% of vh)
    const end = elementTop - vh * 0.35;
    if (window.scrollY < start) return 0;
    if (window.scrollY > end) return 1;
    return (window.scrollY - start) / (end - start);
  };

  const ap = getApProgress();

  function blockReveal(lineIndex, fromRight = false) {
    const STAGGER = 0.15;
    const raw = Math.max(0, ap - lineIndex * STAGGER);
    const clamped = Math.min(1, raw * 2.2);
    const phase1 = Math.min(1, clamped * 2.08);
    const phase2 = Math.min(1, Math.max(0, clamped * 2.08 - 1.15));
    const e = t => t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2;
    return {
      blockX: fromRight
        ? (phase2 > 0 ? -e(phase2)*100 : 100 - e(phase1)*100)
        : (phase2 > 0 ? e(phase2)*100 : -100 + e(phase1)*100),
      textY:  phase2 > 0 ? 105 - e(phase2)*105 : 105,
    };
  }

  const e = ease;
  const slideXLeft  = `${(1 - e(ap)) * -110}%`;
  const slideXRight = `${(1 - e(ap)) * 110}%`;
  const opacityVal  = ap;

  // Calculate scroll-driven horizontal parallax offset
  const getParallaxOffset = () => {
    if (!ref.current || typeof window === "undefined") return 0;
    const rect = ref.current.getBoundingClientRect();
    const vh = window.innerHeight;
    const elementTop = rect.top + window.scrollY;
    const start = elementTop - vh;
    const end = elementTop + rect.height;
    const current = window.scrollY;
    if (current < start) return 25;
    if (current > end) return -25;
    const progress = (current - start) / (end - start);
    return (0.5 - progress) * 50; // shift from +25px to -25px
  };
  const parallaxOffset = getParallaxOffset();

  return (
    <div ref={ref} style={{ background:"#f5f0e8", padding:"80px 24px", position:"relative", overflow:"hidden" }}>
      {/* SVG wave background */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity: opacityVal * 0.15, pointerEvents:"none" }} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <path d="M-100 200 Q200 100 500 300 T1100 250 T1600 200" fill="none" stroke="#8a7e6e" strokeWidth="1.2"/>
        <path d="M-100 350 Q300 200 600 400 T1200 350 T1600 300" fill="none" stroke="#8a7e6e" strokeWidth="1.2"/>
        <path d="M-100 500 Q250 350 550 520 T1150 470 T1600 430" fill="none" stroke="#8a7e6e" strokeWidth="1.2"/>
        <path d="M-100 650 Q350 500 650 650 T1300 580 T1600 570" fill="none" stroke="#8a7e6e" strokeWidth="1.2"/>
        <path d="M-100 800 Q400 640 700 780 T1380 720 T1600 710" fill="none" stroke="#8a7e6e" strokeWidth="1.2"/>
      </svg>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:14, marginBottom:56, position:"relative", zIndex:2, opacity: opacityVal, transform: `translateY(${(1-e(ap))*20}px)` }}>
        <div style={{ width:30, height:1, background:"#c0b8a8" }}/>
        <span style={{ fontSize:"0.85rem", textTransform:"uppercase", letterSpacing:"0.25em", color:"#9a9080", fontWeight:700 }}>Experience</span>
        <div style={{ width:30, height:1, background:"#c0b8a8" }}/>
      </div>

      {/* Blocks container */}
      <div style={{
        position:"relative",
        zIndex:2,
        display:"flex",
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"flex-start",
        gap:"1.2rem",
        width:"100%"
      }}>
        {/* Block 1 */}
        <div style={{
          flex: 1,
          display:"flex",
          flexDirection:"column",
          alignItems:"flex-end",
          textAlign:"right",
          opacity: opacityVal,
          transform: `translateX(${slideXLeft}) translateX(${parallaxOffset}px)`
        }}>
          <div style={{ lineHeight:1.1, marginBottom: 8 }}>
            {(() => {
              const { blockX, textY } = blockReveal(0);
              return (
                <span style={{ display:"block", overflow:"hidden", position:"relative", lineHeight:1.1 }}>
                  <span style={{ display:"block", fontFamily:"'Instrument Serif', serif", fontStyle:"italic", fontSize:"clamp(3.0rem, 12vw, 4.2rem)", fontWeight:400, color:"#111", lineHeight:1, transform:`translateY(${textY}%)`, willChange:"transform" }}>OFF</span>
                  <span style={{ position:"absolute", top:0, bottom:0, left:"-5%", right:"-5%", background:"#d0c8b8", transform:`translateX(${blockX}%)`, willChange:"transform", zIndex:3 }}/>
                </span>
              );
            })()}
            {(() => {
              const { blockX, textY } = blockReveal(1);
              return (
                <span style={{ display:"block", overflow:"hidden", position:"relative", lineHeight:1.1 }}>
                  <span style={{ display:"block", fontFamily:"'Bebas Neue', sans-serif", fontSize:"clamp(3.6rem, 15vw, 5.2rem)", fontWeight:400, color:"#111", lineHeight:0.9, letterSpacing:"-0.02em", transform:`translateY(${textY}%)`, willChange:"transform" }}>INTERN</span>
                  <span style={{ position:"absolute", top:0, bottom:0, left:"-5%", right:"-5%", background:"#b8ad9e", transform:`translateX(${blockX}%)`, willChange:"transform", zIndex:3 }}/>
                </span>
              );
            })()}
          </div>
          <span style={{ display:"block", fontSize:"0.55rem", color:"#9a9080", letterSpacing:"0.05em", fontWeight:600 }}>AUG 2024 — OCT 2024</span>
          <span style={{ display:"block", fontSize:"0.65rem", color:"#111", fontWeight:700, letterSpacing:"0.02em", marginTop:"0.2rem" }}>Full Stack Developer</span>
          <p style={{ fontSize:"0.62rem", color:"#7a7060", lineHeight:1.5, margin:"0.6rem 0 0", width:"100%" }}>{EXPERIENCES[0].desc}</p>
          <div style={{ marginTop: "24px", display: "flex", alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
            <img src="/starfood.svg" alt="Starfood International" style={{ maxWidth:"180px", width:"100%", height:"auto", opacity: 0.85 }}/>
          </div>
        </div>

        {/* Vertical divider line */}
        <div style={{ width: 1, alignSelf: "stretch", background: "rgba(138,126,110,0.15)" }}/>

        {/* Block 2 */}
        <div style={{
          flex: 1,
          display:"flex",
          flexDirection:"column",
          alignItems:"flex-start",
          textAlign:"left",
          opacity: opacityVal,
          transform: `translateX(${slideXRight}) translateX(${-parallaxOffset}px)`
        }}>
          <div style={{ lineHeight:1.1, marginBottom: 8 }}>
            {(() => {
              const { blockX, textY } = blockReveal(0, true);
              return (
                <span style={{ display:"block", overflow:"hidden", position:"relative", lineHeight:1.1 }}>
                  <span style={{ display:"block", fontFamily:"'Instrument Serif', serif", fontStyle:"italic", fontSize:"clamp(3.0rem, 12vw, 4.2rem)", fontWeight:400, color:"#111", lineHeight:1, transform:`translateY(${textY}%)`, willChange:"transform" }}>ON</span>
                  <span style={{ position:"absolute", top:0, bottom:0, left:"-5%", right:"-5%", background:"#d0c8b8", transform:`translateX(${blockX}%)`, willChange:"transform", zIndex:3 }}/>
                </span>
              );
            })()}
            {(() => {
              const { blockX, textY } = blockReveal(1, true);
              return (
                <span style={{ display:"block", overflow:"hidden", position:"relative", lineHeight:1.1 }}>
                  <span style={{ display:"block", fontFamily:"'Bebas Neue', sans-serif", fontSize:"clamp(3.6rem, 15vw, 5.2rem)", fontWeight:400, color:"#111", lineHeight:0.9, letterSpacing:"-0.02em", transform:`translateY(${textY}%)`, willChange:"transform" }}>INTERN</span>
                  <span style={{ position:"absolute", top:0, bottom:0, left:"-5%", right:"-5%", background:"#b8ad9e", transform:`translateX(${blockX}%)`, willChange:"transform", zIndex:3 }}/>
                </span>
              );
            })()}
          </div>
          <span style={{ display:"block", fontSize:"0.55rem", color:"#9a9080", letterSpacing:"0.05em", fontWeight:600 }}>DEC 2025 — NOW</span>
          <span style={{ display:"block", fontSize:"0.65rem", color:"#111", fontWeight:700, letterSpacing:"0.02em", marginTop:"0.2rem" }}>Operational Area Programmer</span>
          <p style={{ fontSize:"0.62rem", color:"#7a7060", lineHeight:1.5, margin:"0.6rem 0 0", width:"100%" }}>{EXPERIENCES[1].desc}</p>
          <div style={{ marginTop: "24px", display: "flex", alignItems: "center", justifyContent: "flex-start", width: "100%" }}>
            <img src="/UTSG.png" alt="Startup" style={{ maxWidth:"150px", width:"100%", height:"auto", opacity: 0.85 }}/>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── KOMPONEN UTAMA ───────────────────────────────────────────────────────────
export default function Portfolio() {
  const rawRef    = useRef(0);
  const rafRef    = useRef(null);
  const smoothRef = useRef(0);
  const [p, setP] = useState(0);
  const [scrollYMobile, setScrollYMobile] = useState(0);
  const [galleryMobileProgress, setGalleryMobileProgress] = useState(0);
  const galleryMobileRef = useRef(null);

  const scene3PlayedRef = useRef(false);
  const animP3Ref  = useRef(0);
  const [animP3, setAnimP3] = useState(0);
  const animRafRef = useRef(null);
  const animStartRef = useRef(null);
  const ANIM_DUR = 1600;

  const scene5PlayedRef  = useRef(false);
  const animP5Ref        = useRef(0);
  const [animP5, setAnimP5] = useState(0);
  const animRafRef5      = useRef(null);
  const animStartRef5    = useRef(null);
  const ANIM_DUR5        = 2200;

  const [contribData,  setContribData]  = useState(EMPTY_CONTRIB_DATA);
  const [contribStats, setContribStats] = useState(EMPTY_CONTRIB_STATS);
  const [githubLoading, setGithubLoading] = useState(true);
  const [githubError,   setGithubError]   = useState(null);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const TOTAL = 3 + (N - 1) + 2;

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
      if (window.innerWidth < 768) return;
      e.preventDefault();
      const d = Math.max(-80, Math.min(80, e.deltaY)) / 900;
      rawRef.current = Math.max(0, Math.min(TOTAL, rawRef.current + d));
    };

    let ty = 0;
    const onTS = e => { ty = e.touches[0].clientY; };

    const onTM = e => {
      if (window.innerWidth < 768) return;
      const d = (ty - e.touches[0].clientY) / 400;
      rawRef.current = Math.max(0, Math.min(TOTAL, rawRef.current + d));
      ty = e.touches[0].clientY;
    };

    const onScroll = () => {
      if (window.innerWidth < 768) {
        const vh = window.innerHeight;
        const currentScroll = window.scrollY;
        setScrollYMobile(currentScroll);
        // Map scrollY from 0 to 1.2 * vh (60vh zoom out + 60vh scroll out) to rawRef.current from 0 to 2
        rawRef.current = Math.min(2, Math.max(0, (currentScroll / (1.2 * vh)) * 2));

        if (galleryMobileRef.current) {
          const rect = galleryMobileRef.current.getBoundingClientRect();
          const denom = rect.height - vh;
          const progress = denom > 0 ? Math.min(1, Math.max(0, -rect.top / denom)) : 0;
          setGalleryMobileProgress(progress);
        }
      }
    };

    // Initialize in case the page is already scrolled on mount
    onScroll();

    window.addEventListener("wheel",      onWheel, { passive: false });
    window.addEventListener("touchstart", onTS,    { passive: true  });
    window.addEventListener("touchmove",  onTM,    { passive: true  });
    window.addEventListener("scroll",     onScroll, { passive: true  });

    return () => {
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(animRafRef.current);
      cancelAnimationFrame(animRafRef5.current);
      window.removeEventListener("wheel",      onWheel);
      window.removeEventListener("touchstart", onTS);
      window.removeEventListener("touchmove",  onTM);
      window.removeEventListener("scroll",     onScroll);
    };
  }, []);

  useEffect(() => {
    if (p >= 1.85 && !scene3PlayedRef.current) runScene3Anim();
    const scene5Start = 3 + (N - 1);
    if (p >= scene5Start + 0.08 && !scene5PlayedRef.current) runScene5Anim();
  }, [p]);

  useEffect(() => {
    if (!GITHUB_TOKEN) {
      setGithubError("Token tidak ditemukan.");
      setGithubLoading(false);
      return;
    }
    fetchGitHubContributions(GITHUB_USERNAME, GITHUB_TOKEN)
      .then((calendar) => {
        const { CONTRIB_DATA, CONTRIB_STATS } = transformCalendar(calendar);
        setContribData(CONTRIB_DATA);
        setContribStats(CONTRIB_STATS);
      })
      .catch((err) => { console.error(err); setGithubError(err.message); })
      .finally(() => setGithubLoading(false));
  }, []);

  const switchThreshold = typeof window !== "undefined" ? 0.5 * window.innerHeight : 0;
  const scene2HeightMobile = typeof window !== "undefined" ? 0.75 * window.innerHeight : 0;
  const isFixedMobile = isMobile && scrollYMobile < switchThreshold;
  const p1  = ease(Math.min(1, Math.max(0, p)));
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const p1AtSwitch = ease(Math.min(1, Math.max(0, (switchThreshold / (1.2 * vh)) * 2)));
const cardCenterAbsolute = switchThreshold + (0.5 - p1AtSwitch * 0.25) * vh;
  const marqueeFixedTop = `calc(${(50 - p1 * 25)}% + ${(100 - p1 * 78) / 2}vh + 15px)`;
  const marqueeAbsoluteTop = cardCenterAbsolute + 0.11 * vh + 15;
  const unmountThreshold = 1.8 * vh;
  const p2  = ease(Math.min(1, Math.max(0, p - 1)));
  const p3e = ease(Math.min(1, Math.max(0, p - 2)));
  const p4  =      Math.min(N-1, Math.max(0, p - 3));
  const p5  = ease(Math.min(1, Math.max(0, p - 3 - (N-1))));
  const p5r =      Math.min(1, Math.max(0, p - 3 - (N-1)));
  const p6  = ease(Math.min(1, Math.max(0, p - 3 - (N-1) - 1)));
  const p6r =      Math.min(1, Math.max(0, p - 3 - (N-1) - 1));

  const heroScale  = 1 - p1 * 0.62;
  const heroRadius = p1 * 2;
  const bgScrollVh = p2 * 100 + p3e * 100 + p5 * 100 + p6 * 100;
  const bgOpacity  = p1 < 0.15 ? 0 : Math.min(1, (p1 - 0.15) / 0.3);
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

  function blockRevealExp(lineIndex, fromRight = false) {
    const ap = animP5;
    const STAGGER = 0.2;
    const raw = Math.max(0, ap - lineIndex * STAGGER);
    const clamped = Math.min(1, raw * 2);
    const phase1 = Math.min(1, clamped * 2.08);
    const phase2 = Math.min(1, Math.max(0, clamped * 2.08 - 1.15));
    const e1 = ease(phase1), e2 = ease(phase2);
    const blockX = fromRight
      ? (phase2 > 0 ? -e2 * 100 : 100 - e1 * 100)
      : (phase2 > 0 ? e2 * 100 : -100 + e1 * 100);
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

  const PROJECTS = [
    {
      title: "Program HRD",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      stack: ["React JS", "Express", "MySQL", "Bootstrap"],
      imageIndexes: [0, 1, 2, 3],
      infoLeft: "2vw", infoTop: "57vh",
      yearLeft: "80vw", yearTop: "53vh",
    },
    {
      title: "Sistem Monitoring Inventori",
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

  const SCATTER = [
    { top:"18vh", left:"2vw",   w:"35vw", speed:1.0, z:3, rotate:1  },
    { top:"56vh", left:"34vw",  w:"35vw", speed:1.0, z:2, rotate:1  },
    { top:"18vh", left:"39vw",  w:"35vw", speed:1.0, z:4, rotate:1  },
    { top:"56vh", left:"71vw",  w:"35vw", speed:1.0, z:2, rotate:-1 },
    { top:"18vh", left:"120vw", w:"35vw", speed:1.0, z:2, rotate:-1 },
    { top:"56vh", left:"140vw", w:"35vw", speed:1.0, z:2, rotate:-1 },
    { top:"56vh", left:"176vw", w:"35vw", speed:1.0, z:2, rotate:0  },
    { top:"18vh", left:"230vw", w:"35vw", speed:1.0, z:2, rotate:-1 },
    { top:"54vh", left:"258vw", w:"35vw", speed:1.0, z:2, rotate:-1 },
    { top:"23vh", left:"294vw", w:"35vw", speed:1.0, z:2, rotate:-1 },
    { top:"18vh", left:"360vw", w:"35vw", speed:1.0, z:2, rotate:-1 },
    { top:"36vh", left:"390vw", w:"35vw", speed:1.0, z:2, rotate:0  },
    { top:"56vh", left:"423vw", w:"35vw", speed:1.0, z:2, rotate:-1 },
    { top:"18vh", left:"463vw", w:"35vw", speed:1.0, z:2, rotate:-1 },
    { top:"49vh", left:"496vw", w:"35vw", speed:1.0, z:2, rotate:-1 },
  ];

  const PROJECT_INFO_BY_INDEX = {};
  PROJECTS.forEach(proj => {
    proj.imageIndexes.forEach((imgIdx, posInGroup) => {
      PROJECT_INFO_BY_INDEX[imgIdx] = { ...proj, isFirst: posInGroup === 0 };
    });
  });

  const scrollShift = p4 * 31;
  const t = Math.min(1, p4 / Math.max(1, N-1));
  const labelColor = `rgb(${Math.round(58+120*t)},${Math.round(58+100*t)},${Math.round(58+60*t)})`;
  const lineColor  = `rgba(${Math.round(32+140*t)},${Math.round(32+120*t)},${Math.round(32+100*t)},1)`;

  // Mobile Scene 4 Dynamic Colors
  const mobileProgress = galleryMobileProgress;
  const mobileBgColor = lerpColor("#0f0f0f", "#f5f0e8", mobileProgress);
  const mobileTextColor = lerpColor("#ffffff", "#0f0f0f", mobileProgress);
  const mobileDescColor = lerpColor("#a6a6a6", "#333333", mobileProgress);
  const mobileYearColor = lerpColor("#888888", "#666666", mobileProgress);
  const mobileDividerColor = lerpColor("#1e1e1e", "#e0dacb", mobileProgress);
  const mobileBadgeBorderColor = lerpColor("#4d4d4d", "#b8ad9e", mobileProgress);
  const mobileBadgeTextColor = lerpColor("#b3b3b3", "#555555", mobileProgress);
  const mobileHeaderColor = lerpColor("#888888", "#9a9080", mobileProgress);
  const mobileHeaderLine = lerpColor("#333333", "#c0b8a8", mobileProgress);

  const StackBadges = ({ stack }) => (
    <div style={{ display:"flex", gap:6, marginTop:10, flexWrap:"wrap" }}>
      {stack.map(tech => (
        <span key={tech} style={{
          fontSize: "clamp(0.4rem, 0.6vw, 0.6rem)",
          padding: "3px 8px",
          border: isMobile ? `0.5px solid ${mobileBadgeBorderColor}` : "0.5px solid rgba(255,255,255,0.3)",
          color: isMobile ? mobileBadgeTextColor : "rgba(255,255,255,0.7)",
          borderRadius: 4,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}>{tech}</span>
      ))}
    </div>
  );

  return (
    <div style={{
      position: isMobile ? "relative" : "fixed",
      inset: isMobile ? undefined : 0,
      overflow: isMobile ? "auto" : "hidden",
      background:"#0c0c0c",
      fontFamily:"'Inter',sans-serif",
      minHeight: isMobile ? "100vh" : undefined,
    }}>

      {/* ══ MOBILE LAYOUT ════════════════════════════════════════ */}
      {isMobile && (
        <div style={{ background:"#0c0c0c", position: "relative" }}>

          {/* Hero & Marquee MOBILE (Only rendered during transition from Scene 1 to Scene 2) */}
          {scrollYMobile < unmountThreshold && (
            <>
              {/* Hero Scene 1 Mobile */}
              <div style={{
                position: scrollYMobile < switchThreshold ? "fixed" : "absolute",
                top: scrollYMobile < switchThreshold ? `${50 - p1 * 25}%` : cardCenterAbsolute,
                left: "50%",
                width: scrollYMobile < switchThreshold ? `${100 - p1 * 35}vw` : "65vw",
                height: scrollYMobile < switchThreshold ? `${100 - p1 * 78}vh` : "22vh",
                zIndex: 10,
                pointerEvents: p1 > 0.97 ? "none" : "auto",
                transform: "translate(-50%, -50%)",
                borderRadius: `${heroRadius}px`,
                transformOrigin: "center center",
                overflow: "hidden",
                willChange: "width, height, border-radius",
                background: "#f5f0e8",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: p1 > 0.1 ? `0 ${p1 * 8}px ${p1 * 24}px rgba(0,0,0,0.4)` : "none",
              }}>
                <div style={{ position:"absolute", top:"12%", left:"52%", transform:"translate(-50%,0)", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,#f2dfa8 0%,transparent 65%)", opacity:0.5, pointerEvents:"none" }}/>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "0 24px",
                  transform: `translateY(${-40 + p1 * 45}px) scale(${1 - p1 * 0.52})`,
                  opacity: 1 - p1 * 0.5,
                  transformOrigin: "center center"
                }}>
                  <p style={{
                    fontFamily:"'Instrument Serif', serif",
                    fontStyle:"italic",
                    fontSize:"clamp(1.8rem,7vw,2.4rem)",
                    color:"#b0aaa0",
                    fontWeight:400,
                    margin:"0 0 0.1rem",
                    opacity: 1 - p1 * 1.2,
                    transition: "opacity 0.2s"
                  }}>hi, i'm</p>
                  <div style={{ fontSize:"clamp(3rem,16vw,6rem)", fontWeight:900, letterSpacing:"-0.04em", lineHeight:0.9, color:"#111827" }}>Muhammad</div>
                  <div style={{ fontSize:"clamp(3rem,16vw,6rem)", fontWeight:900, letterSpacing:"-0.04em", lineHeight:0.9, color:"#111827" }}>Nawwaf</div>
                  <div style={{ fontSize:"clamp(3rem,16vw,6rem)", fontWeight:900, letterSpacing:"-0.04em", lineHeight:0.9, color:"#d4cfc8", marginBottom: p1 > 0.5 ? 0 : "clamp(0.8rem,2.5vh,1.8rem)" }}>Naufal</div>
                  <p style={{
                    color:"#888",
                    fontSize:"clamp(0.85rem,3.5vw,1.05rem)",
                    lineHeight:1.65,
                    margin:"0 0 1.6rem",
                    maxWidth:320,
                    opacity: 1 - p1 * 1.2,
                    transition: "opacity 0.2s"
                  }}>
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

              {/* Marquee MOBILE */}
              {p1 > 0.15 && (
                <div style={{
                  position: scrollYMobile < switchThreshold ? "fixed" : "absolute",
                  zIndex: 11,
                  width: scrollYMobile < switchThreshold ? `${100 - p1 * 35}vw` : "65vw",
                  left: "50%",
                  transform: "translateX(-50%)",
                  top: scrollYMobile < switchThreshold ? marqueeFixedTop : marqueeAbsoluteTop,
                  opacity: Math.min(1, (p1 - 0.15) / 0.35),
                  pointerEvents: "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, paddingLeft: 4 }}>
                    <span style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff" }}>Skills</span>
                    <div style={{ flex: 1, height: "1px", background: "#333" }}/>
                  </div>
                  <div style={{ overflow: "hidden", borderTop: "1px solid #222", borderBottom: "1px solid #222", padding: "8px 0" }}>
                    <div style={{ display: "flex", width: "max-content", animation: "marquee-left 30s linear infinite" }}>
                      {["Babel","Tailwind","CSS3","React","Express","Git","HTML5","JavaScript","Jest","MongoDB","Mongoose","MySQL","Node.js","Postman","Prisma","Swagger","TypeScript","Redis","Socket.io","Docker",
                        "Babel","Tailwind","CSS3","React","Express","Git","HTML5","JavaScript","Jest","MongoDB","Mongoose","MySQL","Node.js","Postman","Prisma","Swagger","TypeScript","Redis","Socket.io","Docker",
                      ].map((s,i) => (
                        <span key={i} style={{ fontSize: "0.7rem", fontWeight: 700, color: i % 5 === 2 ? "#fff" : "#aaa", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0 1rem", borderRight: "1px solid #2a2a2a", whiteSpace: "nowrap", flexShrink: 0 }}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Spacer for Hero (Scene 1) to allow scaling scroll room */}
          <div style={{ height: "100vh" }} />

          {/* Scene 2 — About (In normal document flow, so no empty gap after it!) */}
         {/* Scene 2 — Marquee Text Mobile */}
<div style={{
  background: "#0f0f0f",
  padding: "60px 0",
  overflow: "hidden",
  position: "relative",
}}>
  {/* Row 1 — bergerak ke kiri */}
  <div style={{
    overflow: "hidden",
    padding: "0",
  }}>
    <div style={{
      transform: `translateX(${- (scrollYMobile * 0.35)}px)`,
      willChange: "transform",
    }}>
      <div style={{
        display: "flex",
        width: "max-content",
        animation: "marquee-left 18s linear infinite",
      }}>
        {[...Array(4)].flatMap(() =>
          ["BACKEND ENGINEER", "·", "BUILDING SCALABLE", "·", "DIGITAL SYSTEMS", "·", "DISTRIBUTED ARCHITECTURE", "·"].map((text, i) => (
            <span key={i} style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2.8rem, 13vw, 5rem)",
              fontWeight: 400,
              color: text === "·" ? "#b8ad9e" : "#ffffff",
              letterSpacing: text === "·" ? "0" : "-0.01em",
              padding: "0 1.2rem",
              whiteSpace: "nowrap",
              lineHeight: 1,
            }}>{text}</span>
          ))
        )}
      </div>
    </div>
  </div>

  {/* Row 2 — bergerak ke kanan */}
  <div style={{
    overflow: "hidden",
    padding: "0",
    marginTop: "1.2vw",
  }}>
    <div style={{
      transform: `translateX(${-600 + (scrollYMobile * 0.35)}px)`,
      willChange: "transform",
    }}>
      <div style={{
        display: "flex",
        width: "max-content",
        animation: "marquee-right 18s linear infinite",
      }}>
        {[...Array(4)].flatMap(() =>
          ["OPEN TO WORK", "·", "BACKEND & FULLSTACK", "·", "NODE.JS · EXPRESS", "·", "ALWAYS BUILDING", "·"].map((text, i) => (
            <span key={i} style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2.8rem, 13vw, 5rem)",
              fontWeight: 400,
              color: text === "·" ? "#b8ad9e" : "#555555",
              letterSpacing: "-0.01em",
              padding: "0 1.2rem",
              whiteSpace: "nowrap",
              lineHeight: 1,
            }}>{text}</span>
          ))
        )}
      </div>
    </div>
  </div>
</div>

          {/* Scene 3 — Bio block (sama persis dengan desktop, pakai IntersectionObserver) */}
          <MobileScene3 />

          {/* Scene 4 — Gallery MOBILE */}
          <div ref={galleryMobileRef} style={{ background: mobileBgColor, padding:"80px 20px 60px", boxSizing:"border-box", transition: "background-color 0.1s ease" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:40 }}>
              <span style={{ fontSize:"0.75rem", textTransform:"uppercase", letterSpacing:"0.3em", color: mobileHeaderColor, fontWeight:600 }}>Selected Work</span>
              <div style={{ flex:1, height:1, background: mobileHeaderLine }}/>
              <span style={{ fontSize:"0.75rem", textTransform:"uppercase", letterSpacing:"0.3em", color: mobileHeaderColor, fontWeight:600 }}>2023 — 2024</span>
            </div>

            {PROJECTS.map((proj, projIdx) => (
              <div key={projIdx} style={{ marginBottom: 56 }}>
                <div style={{ marginBottom: 16 }}>
                  {(() => {
                    const firstImgIdx = proj.imageIndexes[0];
                    const item = GALLERY_ITEMS[firstImgIdx];
                    if (!item) return null;
                    return (
                      <div style={{ width: "100%" }}>
                        {item.img ? (
                          <img
                            src={item.img}
                            alt={item.title}
                            style={{
                              width: "100%",
                              height: "auto",
                              display: "block",
                              borderRadius: 6,
                              boxShadow: "0 4px 16px rgba(0,0,0,0.3)"
                            }}
                          />
                        ) : (
                          <div style={{ width: "100%", aspectRatio: "16/10", background: "#1a1a1a", borderRadius: 6 }} />
                        )}
                      </div>
                    );
                  })()}
                </div>
                <p style={{ margin:"0 0 4px", fontSize:"clamp(1rem,5vw,1.3rem)", color: mobileTextColor, fontFamily:"'Bebas Neue', sans-serif", fontWeight:700, letterSpacing:"0.05em" }}>
                  {proj.title}
                </p>
                {proj.year && (
                  <p style={{ margin:"0 0 8px", fontSize:"0.6rem", color: mobileYearColor, letterSpacing:"0.1em" }}>{proj.year}</p>
                )}
                <p style={{ margin:0, fontSize:"clamp(0.7rem,3.5vw,0.85rem)", color: mobileDescColor, lineHeight:1.8, letterSpacing:"0.02em" }}>
                  {proj.desc}
                </p>
                <StackBadges stack={proj.stack} />
                {projIdx < PROJECTS.length - 1 && (
                  <div style={{ marginTop:32, height:1, background: mobileDividerColor }}/>
                )}
              </div>
            ))}
          </div>

          {/* Scene 5 — Experience mobile */}
          <MobileScene5 scrollY={scrollYMobile} />

          {/* Scene 6 — Contributions mobile */}
          <div style={{ background:"#0f0f0f", padding:"80px 20px 60px", boxSizing:"border-box" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"2rem" }}>
              <span style={{ fontSize:"0.6rem", textTransform:"uppercase", letterSpacing:"0.3em", color:"#444", fontWeight:600 }}>Contributions</span>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background: githubError ? "#ff5050" : githubLoading ? "#ffcc00" : "#b4ff50" }}/>
                <span style={{ fontSize:"0.6rem", color: githubError ? "#ff5050" : githubLoading ? "#ffcc00" : "#b4ff50", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" }}>
                  {githubError ? "API Error" : githubLoading ? "Loading…" : "GitHub Activity"}
                </span>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(53, 1fr)", gridTemplateRows:"repeat(7, 1fr)", gap:2, width:"100%", opacity: githubLoading ? 0.3 : 1 }}>
              {contribData.map((v, i) => {
                const col = Math.floor(i / 7) + 1;
                const row = (i % 7) + 1;
                return (
                  <div key={i} style={{ aspectRatio:"1/1", borderRadius:1, background: CONTRIB_COLORS[v], border: v===0 ? "1px solid #1a1a1a" : "none", gridColumn:col, gridRow:row }} />
                );
              })}
            </div>
            <div style={{ marginTop:"2rem", display:"flex", gap:"2rem", flexWrap:"wrap" }}>
              {[
                { num: contribStats.total,  label:"Total Contributions", color:"#fff" },
                { num: contribStats.streak, label:"Day Streak",          color:"#b4ff50" },
                { num: contribStats.best,   label:"Best Day",            color:"#fff" },
              ].map(({ num, label, color }) => (
                <div key={label}>
                  <div style={{ fontSize:"clamp(1.6rem,8vw,2.4rem)", fontWeight:900, color, letterSpacing:"-0.04em", lineHeight:1 }}>
                    {githubLoading ? "—" : num}
                  </div>
                  <div style={{ fontSize:"0.55rem", color:"#333", textTransform:"uppercase", letterSpacing:"0.18em", lineHeight:1.6, marginTop:6 }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:"1.5rem" }}>
              <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer"
                style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#b4ff50", color:"#0a0a0a", fontSize:"0.75rem", fontWeight:700, padding:"10px 20px", borderRadius:99, textDecoration:"none", letterSpacing:"0.04em" }}>
                GITHUB PROFILE ↗
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ══ DESKTOP LAYOUT ══════════════════════════════════════ */}
      {!isMobile && (
        <>
          {/* ── TALL BACKGROUND PANEL ── */}
          <div style={{
            position:"absolute", left:0, right:0, top:0,
            height:"500vh", zIndex:1,
            transform:`translateY(-${bgScrollVh}vh)`,
            willChange:"transform",
            opacity: bgOpacity,
          }}>

            {/* Scene 2 — Bio */}
            <div style={{
              height:"100vh",
              background:"#0f0f0f",
              display:"flex",
              flexDirection:"column",
              alignItems:"center",
              justifyContent:"center",
              gap:"5vh",
              padding:"0 clamp(1.5rem,8vw,7rem)",
              overflow:"hidden",
              position:"relative"
            }}>
              <div style={{ position:"absolute", top:"-10%", right:"5%", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,rgba(255,220,80,0.12) 0%,transparent 65%)", pointerEvents:"none" }}/>
              


              {/* Scene 2 — Marquee Text Desktop */}
              <div style={{
                width: "100vw",
                overflow: "hidden",
                position: "relative",
                marginTop: "2vh",
              }}>
                {/* Row 1 — bergerak ke kiri */}
                <div style={{ overflow: "hidden", padding: "0" }}>
                  <div style={{
                    transform: `translateX(${- (p * 180)}px)`,
                    willChange: "transform",
                  }}>
                    <div style={{
                      display: "flex",
                      width: "max-content",
                      animation: "marquee-left 18s linear infinite",
                    }}>
                      {[...Array(4)].flatMap(() =>
                        ["BACKEND ENGINEER", "·", "BUILDING SCALABLE", "·", "DIGITAL SYSTEMS", "·", "DISTRIBUTED ARCHITECTURE", "·"].map((text, i) => (
                          <span key={i} style={{
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: "clamp(2rem, 5vw, 4.2rem)",
                            fontWeight: 400,
                            color: text === "·" ? "#b8ad9e" : "#ffffff",
                            letterSpacing: text === "·" ? "0" : "-0.01em",
                            padding: "0 1.5rem",
                            whiteSpace: "nowrap",
                            lineHeight: 1,
                          }}>{text}</span>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Row 2 — bergerak ke kanan */}
                <div style={{ overflow: "hidden", padding: "0", marginTop: "1vh" }}>
                  <div style={{
                    transform: `translateX(${-800 + (p * 180)}px)`,
                    willChange: "transform",
                  }}>
                    <div style={{
                      display: "flex",
                      width: "max-content",
                      animation: "marquee-right 18s linear infinite",
                    }}>
                      {[...Array(4)].flatMap(() =>
                        ["OPEN TO WORK", "·", "BACKEND & FULLSTACK", "·", "NODE.JS · EXPRESS", "·", "ALWAYS BUILDING", "·"].map((text, i) => (
                          <span key={i} style={{
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: "clamp(2rem, 5vw, 4.2rem)",
                            fontWeight: 400,
                            color: text === "·" ? "#b8ad9e" : "#555555",
                            letterSpacing: "-0.01em",
                            padding: "0 1.5rem",
                            whiteSpace: "nowrap",
                            lineHeight: 1,
                          }}>{text}</span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scene 3 — Block reveal */}
            <div style={{ height:"100vh", background:"#0f0f0f", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"clamp(1.5rem,6vw,5rem)", overflow:"hidden", position:"relative" }}>
              <div style={{ position:"absolute", top:"-5%", left:"55%", width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle,rgba(180,255,80,0.06) 0%,transparent 65%)", pointerEvents:"none" }}/>
              <div style={{ position:"absolute", top:"clamp(20px,3vh,36px)", left:"50%", transform:"translateX(-50%)", display:"flex", alignItems:"center", gap:16, overflow:"hidden" }}>
                {(() => {
                  const { textY } = labelReveal();
                  return (
                    <div style={{ display:"flex", alignItems:"center", gap:16, transform:`translateY(${textY}%)`, willChange:"transform" }}>
                      <span style={{ fontSize:"0.65rem", textTransform:"uppercase", letterSpacing:"0.3em", color:"#ffffff", fontWeight:700 }}>About Me</span>
                      <div style={{ width:48, height:1, background:"#404040" }}/>
                      <span style={{ fontSize:"0.65rem", textTransform:"uppercase", letterSpacing:"0.3em", color:"#888", fontWeight:600 }}>Teknik Informatika</span>
                    </div>
                  );
                })()}
              </div>
              <div style={{ position:"relative", zIndex:2, width:"100%", display:"flex", flexDirection:"column", alignItems:"center", gap:0, textAlign:"center" }}>
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
                      <span dangerouslySetInnerHTML={{ __html: line.text }} style={{ display:"block", width:"100%", fontSize:line.size, fontWeight:300, color:line.color, letterSpacing:"-0.01em", textTransform:"uppercase", fontFamily:"'Bebas Neue', sans-serif", lineHeight:1.1, transform:`translateY(${textY}%)`, willChange:"transform" }}/>
                      <span style={{ position:"absolute", top:0, bottom:0, left:"-5%", right:"-5%", background:line.blockBg, transform:`translateX(${blockX}%)`, willChange:"transform", zIndex:3 }}/>
                    </span>
                  );
                })}
              </div>
              <div style={{ marginTop:"2rem", width:1, height:44, background:"linear-gradient(to bottom,#333,transparent)", opacity:bottomBarOpacity }}/>
            </div>

            {/* Scene 4 — Gallery DESKTOP */}
            <div style={{ height:"100vh", minHeight:"100vh", background:galleryBg, overflow:"hidden", position:"relative", display:"flex", flexDirection:"column", justifyContent:"center" }}>
              <div style={{ position:"absolute", top:"clamp(60px,8vh,80px)", left:"clamp(1.5rem,6vw,5rem)", right:"clamp(1.5rem,6vw,5rem)", display:"flex", alignItems:"center", justifyContent:"space-between", zIndex:10 }}>
                <div style={{ display:"flex", alignItems:"center", gap:"clamp(10px,1.2vw,20px)" }}>
                  <span style={{ fontSize:"clamp(0.75rem,0.9vw,1.1rem)", textTransform:"uppercase", letterSpacing:"0.3em", color:labelColor, fontWeight:600 }}>Project Portfolio</span>
                  <div style={{ width:"clamp(30px,4vw,60px)", height:1, background:lineColor }}/>
                  <span style={{ fontSize:"clamp(0.75rem,0.9vw,1.1rem)", textTransform:"uppercase", letterSpacing:"0.3em", color:labelColor, fontWeight:600 }}>2023 — 2024</span>
                </div>
              </div>

              {GALLERY_ITEMS.slice(0,15).map((item, i) => {
                const s = SCATTER[i];
                const shiftX = scrollShift * s.speed;
                const infoData = PROJECT_INFO_BY_INDEX[i];
                return (
                  <div key={item.id + "-" + i}>
                    <div style={{ position:"absolute", top:s.top, left:`calc(${s.left} - ${shiftX}vw)`, width:s.w, height:"35vh", overflow:"hidden", willChange:"left", zIndex:s.z, transform:`rotate(${s.rotate}deg)`, boxShadow:"0 8px 32px rgba(0,0,0,0.15)" }}>
                      {item.img
                        ? <img src={item.img} alt={item.title} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top center", display:"block" }}/>
                        : <div style={{ width:"100%", height:"100%", background:"#111" }}/>
                      }
                    </div>
                    {infoData?.isFirst && (
                      <div style={{ position:"absolute", top:infoData.infoTop, left:`calc(${infoData.infoLeft} - ${shiftX}vw)`, width:"clamp(160px, 28vw, 320px)", zIndex:999 }}>
                        <p style={{ margin:"0 0 8px", fontSize:"clamp(0.65rem,1vw,0.85rem)", color:"#ffffff", fontFamily:"'Bebas Neue', sans-serif", fontWeight:700, letterSpacing:"0.05em" }}>{infoData.title}</p>
                        <p style={{ margin:0, fontSize:"clamp(0.55rem,0.8vw,0.7rem)", color:"rgba(255,255,255,0.65)", lineHeight:1.75, letterSpacing:"0.02em" }}>{infoData.desc}</p>
                        <StackBadges stack={infoData.stack} />
                      </div>
                    )}
                    {infoData?.isFirst && infoData?.year && (
                      <p style={{ position:"absolute", top:infoData.yearTop, left:`calc(${infoData.yearLeft} - ${shiftX}vw)`, fontSize:"clamp(0.5rem,0.65vw,0.65rem)", color:"rgba(255,255,255,0.45)", letterSpacing:"0.08em", margin:0, zIndex:999 }}>
                        {infoData.year}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Scene 5 — Experience DESKTOP */}
            <div style={{ height:"100vh", background:"#f5f0e8", overflow:"hidden", position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.18, pointerEvents:"none" }} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
                <path d="M-100 200 Q200 100 500 300 T1100 250 T1600 200" fill="none" stroke="#8a7e6e" strokeWidth="1.2"/>
                <path d="M-100 350 Q300 200 600 400 T1200 350 T1600 300" fill="none" stroke="#8a7e6e" strokeWidth="1.2"/>
                <path d="M-100 500 Q250 350 550 520 T1150 470 T1600 430" fill="none" stroke="#8a7e6e" strokeWidth="1.2"/>
                <path d="M-100 650 Q350 500 650 650 T1300 580 T1600 570" fill="none" stroke="#8a7e6e" strokeWidth="1.2"/>
                <path d="M-100 800 Q400 640 700 780 T1380 720 T1600 710" fill="none" stroke="#8a7e6e" strokeWidth="1.2"/>
              </svg>
              <div style={{ position:"absolute", top:"25%", left:"50%", transform:"translateX(-50%)", display:"flex", alignItems:"center", gap:14, zIndex:10 }}>
                <div style={{ width:40, height:1, background:"#c0b8a8" }}/>
                <span style={{ fontSize:"0.85rem", textTransform:"uppercase", letterSpacing:"0.25em", color:"#9a9080", fontWeight:700 }}>Experience</span>
                <div style={{ width:40, height:1, background:"#c0b8a8" }}/>
              </div>
              <div style={{ display:"flex", gap:"4rem", alignItems:"flex-start", justifyContent:"center" }}>
                <div style={{ textAlign:"right", width:300, overflow:"visible", transform:imgSlideLeft }}>
                  {[["OFF","'Instrument Serif', serif",400,"5rem"],["INTERN","'Bebas Neue', sans-serif",400,"6rem"]].map(([text,font,weight,size],i) => {
                    const { blockX, textY } = blockRevealExp(i);
                    return (
                      <span key={i} style={{ display:"block", overflow:"hidden", position:"relative", lineHeight:1.1 }}>
                        <span style={{ display:"block", fontFamily:font, fontSize:size, fontWeight:weight, letterSpacing:"-0.03em", color:"#111", lineHeight:1, transform:`translateY(${textY}%)`, willChange:"transform" }}>{text}</span>
                        <span style={{ position:"absolute", top:0, bottom:0, left:"-5%", right:"-5%", background:"#d0c8b8", transform:`translateX(${blockX}%)`, willChange:"transform", zIndex:3 }}/>
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
                <div style={{ textAlign:"left", width:300, transform:imgSlideRight }}>
                  {[["ON","'Instrument Serif', serif",400,"5rem"],["INTERN","'Bebas Neue', sans-serif",400,"6rem"]].map(([text,font,weight,size],i) => {
                    const { blockX, textY } = blockRevealExp(i, true);
                    return (
                      <span key={i} style={{ display:"block", overflow:"hidden", position:"relative", lineHeight:1.1 }}>
                        <span style={{ display:"block", fontFamily:font, fontSize:size, fontWeight:weight, letterSpacing:"-0.03em", color:"#111", lineHeight:1, transform:`translateY(${textY}%)`, willChange:"transform" }}>{text}</span>
                        <span style={{ position:"absolute", top:0, bottom:0, left:"-5%", right:"-5%", background:"#d0c8b8", transform:`translateX(${blockX}%)`, willChange:"transform", zIndex:3 }}/>
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
              <div style={{ position:"absolute", left:"-3vw", top:0, bottom:0, transform:imgSlideLeft, opacity:imgOpacity, willChange:"transform,opacity", zIndex:10, display:"flex", flexDirection:"column", justifyContent:"center", padding:"clamp(1.5rem,4vw,2.5rem)" }}>
                <img src="/starfood.svg" alt="Starfood International" style={{ width:"450px", height:"auto" }}/>
              </div>
              <div style={{ position:"absolute", right:0, top:0, bottom:0, transform:imgSlideRight, opacity:imgOpacity, willChange:"transform,opacity", zIndex:10, display:"flex", flexDirection:"column", justifyContent:"center", padding:"clamp(1.5rem,4vw,2.5rem)" }}>
                <img src="/UTSG.png" alt="Startup" style={{ width:"350px", height:"auto", marginLeft:"2vw" }}/>
              </div>
            </div>

          </div>{/* end tall panel desktop */}

          {/* Scene 6 — Contributions DESKTOP */}
          <div style={{ height:"100vh", background:"#0f0f0f", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"clamp(1.5rem,6vw,5rem)", overflow:"hidden", position:"relative", transform:`translateY(${(1-ease(Math.min(1,p6r*1.8)))*100}%)`, willChange:"transform", zIndex:5 }}>
            <div style={{ position:"absolute", top:"-5%", left:"40%", width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle,rgba(180,255,80,0.04) 0%,transparent 65%)", pointerEvents:"none" }}/>
            <div style={{ width:"100%", maxWidth:960, opacity:contribOpacity, transform:`translateY(${contribSlideY}px)`, willChange:"transform,opacity" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"2.5rem" }}>
                <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                  <span style={{ fontSize:"0.6rem", textTransform:"uppercase", letterSpacing:"0.3em", color:"#444", fontWeight:600 }}>Contributions</span>
                  <div style={{ width:48, height:1, background:"#1e1e1e" }}/>
                  <span style={{ fontSize:"0.6rem", textTransform:"uppercase", letterSpacing:"0.3em", color:"#444", fontWeight:600 }}>Last 12 Months</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background: githubError?"#ff5050":githubLoading?"#ffcc00":"#b4ff50", boxShadow: githubError?"0 0 8px rgba(255,80,80,0.5)":githubLoading?"0 0 8px rgba(255,200,0,0.4)":"0 0 8px rgba(180,255,80,0.5)" }}/>
                  <span style={{ fontSize:"0.6rem", color:githubError?"#ff5050":githubLoading?"#ffcc00":"#b4ff50", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" }}>
                    {githubError?"API Error":githubLoading?"Loading…":"GitHub Activity"}
                  </span>
                </div>
              </div>
              {githubError && (
                <div style={{ padding:"10px 14px", background:"rgba(255,80,80,0.07)", border:"1px solid rgba(255,80,80,0.15)", borderRadius:6, marginBottom:"1.5rem" }}>
                  <span style={{ fontSize:"0.7rem", color:"#ff5050" }}>{githubError}</span>
                </div>
              )}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(12, 1fr)", marginBottom:6, paddingRight:2 }}>
                {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(m => (
                  <span key={m} style={{ fontSize:"0.5rem", color:"#2a2a2a", textTransform:"uppercase", letterSpacing:"0.12em", fontWeight:600 }}>{m}</span>
                ))}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(53, 1fr)", gridTemplateRows:"repeat(7, 1fr)", gap:3, width:"100%", opacity:githubLoading?0.3:1, transition:"opacity 0.4s ease" }}>
                {contribData.map((v, i) => {
                  const col = Math.floor(i / 7) + 1;
                  const row = (i % 7) + 1;
                  return (
                    <div key={i} title={`${v} contribution${v!==1?"s":""}`} style={{ aspectRatio:"1/1", borderRadius:2, background:CONTRIB_COLORS[v], border:v===0?"1px solid #1a1a1a":"none", gridColumn:col, gridRow:row, cursor:"default" }}/>
                  );
                })}
              </div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:6, marginTop:10 }}>
                <span style={{ fontSize:"0.5rem", color:"#2a2a2a", letterSpacing:"0.12em", textTransform:"uppercase" }}>Less</span>
                {CONTRIB_COLORS.map((c,i) => (
                  <div key={i} style={{ width:10, height:10, borderRadius:2, background:c, border:i===0?"1px solid #1a1a1a":"none" }}/>
                ))}
                <span style={{ fontSize:"0.5rem", color:"#2a2a2a", letterSpacing:"0.12em", textTransform:"uppercase" }}>More</span>
              </div>
              <div style={{ height:1, background:"#141414", margin:"2rem 0 1.8rem" }}/>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
                <div style={{ display:"flex", gap:"3.5rem" }}>
                  {[
                    { num:contribStats.total,  label:"Total\nContributions", color:"#fff" },
                    { num:contribStats.streak, label:"Day\nStreak",          color:"#b4ff50" },
                    { num:contribStats.best,   label:"Best\nDay",            color:"#fff" },
                  ].map(({ num, label, color }) => (
                    <div key={label}>
                      <div style={{ fontSize:"clamp(1.8rem,3vw,2.8rem)", fontWeight:900, color, letterSpacing:"-0.04em", lineHeight:1 }}>{githubLoading?"—":num}</div>
                      <div style={{ fontSize:"0.55rem", color:"#333", textTransform:"uppercase", letterSpacing:"0.18em", lineHeight:1.6, marginTop:6, whiteSpace:"pre-line" }}>{label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ textAlign:"right", display:"flex", flexDirection:"column", alignItems:"flex-end", gap:10 }}>
                  <p style={{ margin:0, fontSize:"0.75rem", color:"#333", lineHeight:1.7, maxWidth:200 }}>Building in public,<br/>one commit at a time.</p>
                  <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#b4ff50", color:"#0a0a0a", fontSize:"0.75rem", fontWeight:700, padding:"10px 20px", borderRadius:99, textDecoration:"none", letterSpacing:"0.04em" }}>
                    GITHUB PROFILE ↗
                  </a>
                </div>
              </div>
            </div>
            <div style={{ position:"absolute", right:"clamp(1.5rem,3vw,2.5rem)", top:"50%", transform:"translateY(-50%) rotate(90deg)", fontSize:"0.55rem", color:"#1e1e1e", textTransform:"uppercase", letterSpacing:"0.3em", fontWeight:600, whiteSpace:"nowrap", opacity:contribOpacity }}>
              Open Source · Frontend
            </div>
          </div>

          {/* Hero Scene 1 DESKTOP */}
          <div style={{ position:"absolute", top:`${-bgScrollVh}vh`, left:0, right:0, height:"100vh", zIndex:2, transform:`scale(${heroScale})`, borderRadius:`${heroRadius}px`, transformOrigin:"center center", overflow:"hidden", willChange:"transform,border-radius,top", background:"#f5f0e8", pointerEvents:p1>0.97?"none":"auto" }}>
            <div style={{ position:"absolute", top:"12%", left:"52%", transform:"translate(-50%,0)", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,#f2dfa8 0%,transparent 65%)", opacity:0.5, pointerEvents:"none" }}/>
            <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"0 clamp(16px,5vw,72px)", transform:`translateY(${-60 + p1 * 40}px)`, opacity:1-p1*0.5 }}>
              <p style={{ fontFamily:"'Instrument Serif', serif", fontStyle:"italic", fontSize:"clamp(2.2rem,3.8vw,3.6rem)", color:"#b0aaa0", fontWeight:400, margin:"0 0 0.1rem" }}>hi, i'm</p>
              <div style={{ fontSize:"clamp(3.6rem,10vw,11rem)", fontWeight:900, letterSpacing:"-0.04em", lineHeight:0.9, color:"#111827", userSelect:"none" }}>Muhammad</div>
              <div style={{ fontSize:"clamp(3.6rem,10vw,11rem)", fontWeight:900, letterSpacing:"-0.04em", lineHeight:0.9, color:"#111827", userSelect:"none" }}>Nawwaf</div>
              <div style={{ fontSize:"clamp(3.6rem,10vw,11rem)", fontWeight:900, letterSpacing:"-0.04em", lineHeight:0.9, color:"#d4cfc8", userSelect:"none", marginBottom:"clamp(0.8rem,2.5vh,1.8rem)" }}>Naufal</div>
              <p style={{ color:"#888", fontSize:"clamp(0.85rem,1.5vw,1.05rem)", lineHeight:1.65, margin:"0 0 1.6rem", maxWidth:400 }}>Backend Engineer building robust &amp;<br/>scalable digital systems.</p>
              <div style={{ display:"flex", gap:24, justifyContent:"center", opacity:1-p1*1.5 }}>
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

          {/* Marquee DESKTOP */}
          {p1 > 0.15 && (
            <div style={{ position:"absolute", zIndex:3, width:`${(100*heroScale).toFixed(2)}vw`, left:"50%", transform:"translateX(-50%)", top:`calc(${-bgScrollVh}vh + 50% + ${(50*heroScale).toFixed(2)}vh + 10px)`, opacity:Math.min(1,(p1-0.15)/0.35), pointerEvents:"none" }}>
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

          {/* Progress bar DESKTOP */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, zIndex:200, background:"rgba(255,255,255,0.08)" }}>
            <div style={{ height:"100%", width:`${(p/TOTAL)*100}%`, background:"rgba(255,255,255,0.35)" }}/>
          </div>
        </>
      )}


      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,700;1,900&family=Instrument+Serif:ital,wght@0,400;1,400&display=swap');
        *{box-sizing:border-box;-webkit-font-smoothing:antialiased;}
        html,body{margin:0;padding:0;}
        a:hover{opacity:0.75;}
        @keyframes marquee-left{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes marquee-right {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0%); }
}
      `}</style>
    </div>
  );
}