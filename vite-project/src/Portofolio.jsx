import { useState, useEffect, useRef } from "react";
import dhdh from "../public/image/Hrd1.png"

const NAV_LINKS = ["Blog", "Portfolio", "About", "Projects"];

const GALLERY_ITEMS = [
  { id:1, title:"Dashboard UI",    label:"Redesign Project, 2024", tag:"UI/UX",     accent:"#b4ff50", color:"#111", img:"../public/image/Hrd1.png"   },
  { id:2, title:"E-Commerce App",  label:"Freelance, 2024",        tag:"Frontend",  accent:"#b4ff50", color:"#111", img:"../public/image/Hrd2.png"   },
  { id:3, title:"Design System",   label:"Open Source, 2023",      tag:"Design",    accent:"#f5c842", color:"#111", img:"../public/image/Hrd4.png"      },
  // { id:4, title:"Mobile Banking",  label:"Internship, 2023",       tag:"Mobile",    accent:"#a855f7", color:"#111", img:"../public/image/Hrd4.png"      },
  { id:5, title:"Portfolio v1",    label:"Personal, 2023",         tag:"Dev",       accent:"#22d3ee", color:"#111", img:"../public/image/Hrd5.png"   },
];

const EXPERIENCES = [
  { id:"left",  company:"PT Kreasi",  role:"UI/UX Designer",     year:"2023", desc:"Designed end-to-end user flows and component libraries for internal enterprise tools.",             tagline:"DESIGN" },
  { id:"right", company:"Startup.id", role:"Frontend Developer",  year:"2024", desc:"Built and shipped production-ready React interfaces serving 10,000+ daily users.",                tagline:"DEV"    },
];

const BIO_LINES = [
  { text:"ABOUT ME",            color:"#ffffff", size:"clamp(1.2rem,2.5vw,2rem)",     weight:900, italic:false, blockBg:"#ffffff", spacing:"0.08em" },
  { text:"I am a passionate",   color:"#f5f0e8", size:"clamp(1.5rem,3.5vw,2.8rem)",   weight:800, italic:false, blockBg:"#f5f0e8", spacing:"-0.02em" },
  { text:"Software Engineer",   color:"#ffffff", size:"clamp(1.5rem,3.5vw,2.8rem)",   weight:800, italic:true,  blockBg:"#ffffff", spacing:"-0.01em" },
  { text:"building scalable",   color:"#f5f0e8", size:"clamp(1.2rem,3vw,2.4rem)",     weight:700, italic:false, blockBg:"#f5f0e8", spacing:"-0.02em" },
  { text:"backend architectures",color:"#f5f0e8", size:"clamp(1.2rem,3vw,2.4rem)",     weight:700, italic:false, blockBg:"#f5f0e8", spacing:"-0.02em" },
  { text:"& automated systems", color:"#a0a0a0", size:"clamp(1rem,2vw,1.6rem)",       weight:600, italic:true,  blockBg:"#fff",    spacing:"0.02em"  },
];

const CONTRIB_COLORS = ["#161616","#1f3d10","#2d5e17","#4a9a28","#b4ff50"];

const CONTRIB_DATA = Array.from({ length: 53 * 7 }, (_, i) => {
  const seed = (i * 2654435761) >>> 0;
  const r = ((seed % 1000) / 1000);
  if (r < 0.35) return 0;
  if (r < 0.55) return 1;
  if (r < 0.72) return 2;
  if (r < 0.87) return 3;
  return 4;
});

const CONTRIB_STATS = { total: 847, streak: 23, best: 12 };

const N = GALLERY_ITEMS.length;

function ease(t) {
  return t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2;
}

function lerpColor(a, b, t) {
  const p = (hex) => { const n = parseInt(hex.replace("#",""),16); return [(n>>16)&255,(n>>8)&255,n&255]; };
  const [ar,ag,ab] = p(a), [br,bg,bb] = p(b);
  return `rgb(${Math.round(ar+(br-ar)*t)},${Math.round(ag+(bg-ag)*t)},${Math.round(ab+(bb-ab)*t)})`;
}

export default function Portfolio() {
  const rawRef    = useRef(0);
  const rafRef    = useRef(null);
  const smoothRef = useRef(0);
  const [p, setP] = useState(0);

  const scene3PlayedRef = useRef(false);
  const animP3Ref  = useRef(0);
  const [animP3, setAnimP3] = useState(0);
  const animRafRef = useRef(null);
  const animStartRef = useRef(null);
  const ANIM_DUR = 1600;

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
      if (raw < 1) {
        animRafRef.current = requestAnimationFrame(tick);
      }
    };
    animRafRef.current = requestAnimationFrame(tick);
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
      window.removeEventListener("wheel",      onWheel);
      window.removeEventListener("touchstart", onTS);
      window.removeEventListener("touchmove",  onTM);
    };
  }, []);

  useEffect(() => {
    if (p >= 1.85 && !scene3PlayedRef.current) {
      runScene3Anim();
    }
  }, [p]);

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

      {/* ══ NAVBAR ══════════════════════════════════════════════ */}
      <nav style={{
        position:"absolute", zIndex:100,
        top: navWide ? 0 : 16,
        left: navWide ? 0 : "50%",
        right: navWide ? 0 : "auto",
        transform: navWide ? "none" : "translateX(-50%)",
        width: navWide ? "100%" : "min(700px,90vw)",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"14px clamp(1rem,4vw,2rem)",
        background:"rgba(255,255,255,0.9)", backdropFilter:"blur(16px)",
        borderRadius: navWide ? "0 0 20px 20px" : 20,
        boxShadow: navWide ? "0 2px 24px rgba(0,0,0,0.12)" : "none",
        transition:"all 0.6s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <span style={{ fontWeight:800, fontSize:"1rem", color:"#111", letterSpacing:"-0.02em" }}>Nawwaf Naufal</span>
        <div style={{ display:"flex", gap:24, alignItems:"center" }}>
          {NAV_LINKS.map(l => (
            <a key={l} href="#" style={{ color:"#555", fontSize:"0.85rem", fontWeight:500, textDecoration:"none" }}>{l}</a>
          ))}
        </div>
        <a href="#" style={{ display:"flex", alignItems:"center", gap:6, background:"#111", color:"#fff", fontSize:"0.8rem", fontWeight:600, padding:"9px 18px", borderRadius:99, textDecoration:"none" }}>
          Inquiry/Collab
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
        </a>
      </nav>

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

  {/* Label About Me - naik ke atas */}
  <div style={{ position:"absolute", top:"clamp(20px,3vh,36px)", left:"50%", transform:"translateX(-50%)", display:"flex", alignItems:"center", gap:16, overflow:"hidden" }}>
    {(() => {
      const { blockX, textY } = labelReveal();
      return (
        <>
          <div style={{ display:"flex", alignItems:"center", gap:16, transform:`translateY(${textY}%)`, willChange:"transform" }}>
            <span style={{ fontSize:"0.65rem", textTransform:"uppercase", letterSpacing:"0.3em", color:"#ffffff", fontWeight:700 }}>About Me</span>
            <div style={{ width:48, height:1, background:"#404040" }}/>
            <span style={{ fontSize:"0.65rem", textTransform:"uppercase", letterSpacing:"0.3em", color:"#888", fontWeight:600 }}>Since 2019</span>
          </div>
          <div style={{ position:"absolute", inset:0, background:"#b5e020", transform:`translateX(${blockX}%)`, willChange:"transform", zIndex:3 }}/>
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
      { text:"REDEFINING LIMITS,",           size:"clamp(3.2rem,8.5vw,7.5rem)",  color:"#e8e0cc", blockBg:"#b5e020" },
      { text:"FIGHTING FOR WINS,",           size:"clamp(3.2rem,8.5vw,7.5rem)",  color:"#e8e0cc", blockBg:"#e8e0cc" },
      { text:"BRINGING IT ALL IN ALL WAYS.", size:"clamp(2rem,5.2vw,4.6rem)",    color:"#e8e0cc", blockBg:"#b5e020" },
      { text:"DEFINING A LEGACY",            size:"clamp(3.2rem,8.5vw,7.5rem)",  color:"#e8e0cc", blockBg:"#e8e0cc" },
      { text:"IN FORMULA 1",                 size:"clamp(3.2rem,8.5vw,7.5rem)",  color:"#e8e0cc", blockBg:"#b5e020" },
      { text:"ON AND OFF THE TRACK.",        size:"clamp(2.6rem,7vw,6.2rem)",    color:"#e8e0cc", blockBg:"#e8e0cc" },
    ].map((line, i) => {
      const { blockX, textY } = blockReveal(i);
      return (
        <span key={i} style={{ display:"block", overflow:"hidden", position:"relative", lineHeight:1.1, width:"100%" }}>
          <span style={{
            display:"block",
            width:"100%",
            fontSize: line.size,
            fontWeight:900,
            color: line.color,
            letterSpacing:"-0.01em",
            textTransform:"uppercase",
            fontFamily:"'Barlow Condensed','Impact',sans-serif",
            lineHeight:1.1,
            transform:`translateY(${textY}%)`,
            willChange:"transform",
          }}>{line.text}</span>
          {/* blockBg harus lebih lebar dari container agar tidak ada sisa garis */}
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
       <div style={{ height:"100vh", background:galleryBg, overflow:"hidden", position:"relative", display:"flex", flexDirection:"column", justifyContent:"center" }}>
  {(() => {
    const t = Math.min(1, p4 / Math.max(1, N-1));
    const labelColor  = `rgb(${Math.round(58+120*t)},${Math.round(58+100*t)},${Math.round(58+60*t)})`;
    const lineColor   = `rgba(${Math.round(32+140*t)},${Math.round(32+120*t)},${Math.round(32+100*t)},1)`;
    const dotActive   = t > 0.6 ? "#111" : "#b4ff50";
    const dotInactive = `rgba(${Math.round(34+150*t)},${Math.round(34+130*t)},${Math.round(34+100*t)},1)`;
    const numColor    = `rgb(${Math.round(255-200*t)},${Math.round(255-205*t)},${Math.round(255-210*t)})`;
    const mutedColor  = `rgba(${Math.round(51+100*t)},${Math.round(51+80*t)},${Math.round(51+50*t)},1)`;

   const SCATTER = [
  { top:"8vh",  left:"2vw",  w:"32vw", speed:1.0,  z:3 },
  { top:"46vh", left:"30vw",  w:"32vw", speed:1.0, z:2 },
  { top:"8vh",  left:"37vw", w:"32vw", speed:1.0,  z:4 },
  // { top:"8vh",  left:"72vw", w:"32vw", speed:1.15, z:2 },
  { top:"46vh", left:"65vw", w:"32vw", speed:1.0,  z:2 },
];

    const scrollShift = p4 * 80;

    return (<>
      {/* Label atas */}
      <div style={{ position:"absolute", top:"clamp(80px,10vh,100px)", left:"clamp(2rem,6vw,5rem)", right:"clamp(2rem,6vw,5rem)", display:"flex", alignItems:"center", justifyContent:"space-between", zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <span style={{ fontSize:"0.6rem", textTransform:"uppercase", letterSpacing:"0.3em", color:labelColor, fontWeight:600 }}>Selected Work</span>
          <div style={{ width:48, height:1, background:lineColor }}/>
          <span style={{ fontSize:"0.6rem", textTransform:"uppercase", letterSpacing:"0.3em", color:labelColor, fontWeight:600 }}>2023 — 2024</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {GALLERY_ITEMS.map((_,i) => (
            <div key={i} style={{ width:i===cardIdx?20:6, height:6, borderRadius:3, background:i<=cardIdx?dotActive:dotInactive, transition:"all 0.4s ease" }}/>
          ))}
        </div>
      </div>

      {/* Kartu gambar saja — tanpa tulisan */}
      {GALLERY_ITEMS.slice(0,5).map((item, i) => {
  const s = SCATTER[i];
  const shiftX = scrollShift * s.speed;

  return (
    <div key={item.id} style={{
      position:"absolute",
      top: s.top,
      left: `calc(${s.left} - ${shiftX}vw)`,
      width: s.w,
      overflow:"hidden",
      willChange:"left",
      zIndex: s.z,
    }}>
      {item.img
        ? <img src={item.img} alt={item.title} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top left", display:"block" }}/>
        : <div style={{ width:"100%", height:"100%", background:"#111" }}/>
      }
    </div>
  );
})}

      {/* Quote tengah */}
      <div style={{
        position:"absolute", top:"40%", left:`calc(50% - ${scrollShift * 0.3}vw)`,
        transform:"translate(-50%,-50%)",
        zIndex:5, textAlign:"left", pointerEvents:"none",
        maxWidth:"28vw",
        opacity: Math.max(0, 1 - p4 * 1.2),
      }}>
        <div style={{ marginTop:14, width:40, height:2, background:dotActive, borderRadius:1 }}/>
      </div>

      {/* Counter */}
      <div style={{ position:"absolute", bottom:32, right:"clamp(2rem,5vw,4rem)", display:"flex", alignItems:"baseline", gap:4, zIndex:10 }}>
        <span style={{ fontSize:"clamp(2rem,4vw,3rem)", fontWeight:900, color:numColor, lineHeight:1, letterSpacing:"-0.04em" }}>{String(cardIdx+1).padStart(2,"00")}</span>
        <span style={{ color:mutedColor, fontSize:"1rem", fontWeight:700 }}>/</span>
        <span style={{ color:mutedColor, fontSize:"0.85rem", fontWeight:700 }}>{String(N).padStart(2,"0")}</span>
      </div>
    </>);
  })()}
</div>

        {/* ── SCENE 5 — EXPERIENCE (300–400vh) ────────────────── */}
        <div style={{ height:"100vh", background:"#f5f0e8", overflow:"hidden", position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.18, pointerEvents:"none" }} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
            <path d="M-100 200 Q200 100 500 300 T1100 250 T1600 200" fill="none" stroke="#8a7e6e" strokeWidth="1.2"/>
            <path d="M-100 350 Q300 200 600 400 T1200 350 T1600 300" fill="none" stroke="#8a7e6e" strokeWidth="1.2"/>
            <path d="M-100 500 Q250 350 550 520 T1150 470 T1600 430" fill="none" stroke="#8a7e6e" strokeWidth="1.2"/>
            <path d="M-100 650 Q350 500 650 650 T1300 580 T1600 570" fill="none" stroke="#8a7e6e" strokeWidth="1.2"/>
            <path d="M-100 800 Q400 640 700 780 T1380 720 T1600 710" fill="none" stroke="#8a7e6e" strokeWidth="1.2"/>
          </svg>
          <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", textAlign:"center", zIndex:5, pointerEvents:"none", userSelect:"none", opacity:Math.min(1, p5r*3) }}>
            <div style={{ fontSize:"clamp(0.6rem,1.2vw,1rem)", textTransform:"uppercase", letterSpacing:"0.35em", color:"#9a9080", fontWeight:600, marginBottom:"1.2rem" }}>WORK EXPERIENCE</div>
            <div style={{ display:"flex", gap:"clamp(1.5rem,5vw,5rem)", alignItems:"flex-start", justifyContent:"center" }}>
              <div style={{ textAlign:"center", maxWidth:260 }}>
                <div style={{ fontFamily:"'Georgia',serif", fontSize:"clamp(4rem,8vw,9rem)", fontWeight:900, lineHeight:0.85, letterSpacing:"-0.03em", color:"#111" }}>
                  <span style={{ display:"block" }}>ON</span>
                  <span style={{ display:"block", color:"#b4ff50", fontStyle:"italic", fontFamily:"'Caveat',cursive", fontSize:"0.65em", lineHeight:1, marginTop:"-0.1em" }}>site</span>
                  <span style={{ display:"block", color:"#111" }}>WORK</span>
                </div>
                <p style={{ fontSize:"0.82rem", color:"#7a7060", lineHeight:1.6, margin:"1rem 0 0" }}>Companies & clients I've worked with directly in-person or hybrid.</p>
                <a href="#" style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", marginTop:"1.2rem", width:44, height:44, borderRadius:"50%", background:"#b4ff50", color:"#0a0a0a", textDecoration:"none" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                </a>
              </div>
              <div style={{ width:1, height:"clamp(120px,18vh,180px)", background:"#d0c8b8", alignSelf:"center", flexShrink:0 }}/>
              <div style={{ textAlign:"center", maxWidth:260 }}>
                <div style={{ fontFamily:"'Georgia',serif", fontSize:"clamp(4rem,8vw,9rem)", fontWeight:900, lineHeight:0.85, letterSpacing:"-0.03em", color:"#111" }}>
                  <span style={{ display:"block" }}>OFF</span>
                  <span style={{ display:"block", color:"#b4ff50", fontStyle:"italic", fontFamily:"'Caveat',cursive", fontSize:"0.65em", lineHeight:1, marginTop:"-0.1em" }}>screen</span>
                  <span style={{ display:"block", color:"#111" }}>WORK</span>
                </div>
                <p style={{ fontSize:"0.82rem", color:"#7a7060", lineHeight:1.6, margin:"1rem 0 0" }}>Remote projects, freelance builds, and open-source contributions.</p>
                <a href="#" style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", marginTop:"1.2rem", width:44, height:44, borderRadius:"50%", background:"#111", color:"#fff", textDecoration:"none" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                </a>
              </div>
            </div>
          </div>

          <div style={{ position:"absolute", left:0, top:0, width:"clamp(220px,28vw,400px)", height:"100%", transform:imgSlideLeft, opacity:imgOpacity, willChange:"transform,opacity", overflow:"hidden" }}>
            <div style={{ position:"absolute", inset:0, background:"#1a1a1a", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"clamp(1.5rem,4vw,2.5rem)" }}>
              <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-60%)", width:120, height:120, borderRadius:24, background:"rgba(180,255,80,0.08)", border:"1.5px solid rgba(180,255,80,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ fontWeight:900, fontSize:"1.6rem", color:"#b4ff50", letterSpacing:"-0.04em" }}>PT</div>
              </div>
              <div>
                <span style={{ fontSize:"0.55rem", textTransform:"uppercase", letterSpacing:"0.28em", color:"#444", fontWeight:600 }}>{EXPERIENCES[0].year} · {EXPERIENCES[0].tagline}</span>
                <h3 style={{ margin:"0.4rem 0 0.2rem", fontSize:"1.4rem", fontWeight:900, color:"#fff", letterSpacing:"-0.03em", lineHeight:1.1 }}>{EXPERIENCES[0].company}</h3>
                <p style={{ margin:0, fontSize:"0.75rem", color:"#b4ff50", fontWeight:600, letterSpacing:"0.06em" }}>{EXPERIENCES[0].role}</p>
                <p style={{ margin:"0.8rem 0 0", fontSize:"0.78rem", color:"#555", lineHeight:1.65 }}>{EXPERIENCES[0].desc}</p>
              </div>
              <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3, background:"#b4ff50", opacity:0.5 }}/>
            </div>
          </div>

          <div style={{ position:"absolute", right:0, top:0, width:"clamp(220px,28vw,400px)", height:"100%", transform:imgSlideRight, opacity:imgOpacity, willChange:"transform,opacity", overflow:"hidden" }}>
            <div style={{ position:"absolute", inset:0, background:"#141414", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"clamp(1.5rem,4vw,2.5rem)" }}>
              <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-60%)", width:120, height:120, borderRadius:24, background:"rgba(255,255,255,0.04)", border:"1.5px solid rgba(255,255,255,0.12)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ fontWeight:900, fontSize:"1.1rem", color:"#aaa", letterSpacing:"-0.02em", textAlign:"center", lineHeight:1.2 }}>STARTUP<br/>.ID</div>
              </div>
              <div>
                <span style={{ fontSize:"0.55rem", textTransform:"uppercase", letterSpacing:"0.28em", color:"#444", fontWeight:600 }}>{EXPERIENCES[1].year} · {EXPERIENCES[1].tagline}</span>
                <h3 style={{ margin:"0.4rem 0 0.2rem", fontSize:"1.4rem", fontWeight:900, color:"#fff", letterSpacing:"-0.03em", lineHeight:1.1 }}>{EXPERIENCES[1].company}</h3>
                <p style={{ margin:0, fontSize:"0.75rem", color:"#aaa", fontWeight:600, letterSpacing:"0.06em" }}>{EXPERIENCES[1].role}</p>
                <p style={{ margin:"0.8rem 0 0", fontSize:"0.78rem", color:"#555", lineHeight:1.65 }}>{EXPERIENCES[1].desc}</p>
              </div>
              <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3, background:"#333" }}/>
            </div>
          </div>
        </div>

        {/* ── SCENE 6 — CONTRIBUTIONS (400–500vh) ─────────────── */}
        <div style={{
          height:"100vh", background:"#0c0c0c",
          display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center",
          padding:"clamp(1.5rem,6vw,5rem)",
          overflow:"hidden", position:"relative",
        }}>
          <div style={{ position:"absolute", top:"-5%", left:"40%", width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle,rgba(180,255,80,0.04) 0%,transparent 65%)", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", bottom:"-10%", right:"10%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(180,255,80,0.03) 0%,transparent 65%)", pointerEvents:"none" }}/>

          <div style={{
            width:"100%", maxWidth:960,
            opacity: contribOpacity,
            transform:`translateY(${contribSlideY}px)`,
            willChange:"transform,opacity",
          }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"2.5rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                <span style={{ fontSize:"0.6rem", textTransform:"uppercase", letterSpacing:"0.3em", color:"#444", fontWeight:600 }}>Contributions</span>
                <div style={{ width:48, height:1, background:"#1e1e1e" }}/>
                <span style={{ fontSize:"0.6rem", textTransform:"uppercase", letterSpacing:"0.3em", color:"#444", fontWeight:600 }}>Last 12 Months</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:"#b4ff50", boxShadow:"0 0 8px rgba(180,255,80,0.5)" }}/>
                <span style={{ fontSize:"0.6rem", color:"#b4ff50", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" }}>GitHub Activity</span>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(12, 1fr)", marginBottom:6, paddingRight:2 }}>
              {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(m => (
                <span key={m} style={{ fontSize:"0.5rem", color:"#2a2a2a", textTransform:"uppercase", letterSpacing:"0.12em", fontWeight:600 }}>{m}</span>
              ))}
            </div>

            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(53, 1fr)",
              gridTemplateRows:"repeat(7, 1fr)",
              gap:3,
              width:"100%",
            }}>
              {CONTRIB_DATA.map((v, i) => {
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

            <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:6, marginTop:10 }}>
              <span style={{ fontSize:"0.5rem", color:"#2a2a2a", letterSpacing:"0.12em", textTransform:"uppercase" }}>Less</span>
              {CONTRIB_COLORS.map((c, i) => (
                <div key={i} style={{ width:10, height:10, borderRadius:2, background:c, border: i===0 ? "1px solid #1a1a1a" : "none" }}/>
              ))}
              <span style={{ fontSize:"0.5rem", color:"#2a2a2a", letterSpacing:"0.12em", textTransform:"uppercase" }}>More</span>
            </div>

            <div style={{ height:1, background:"#141414", margin:"2rem 0 1.8rem" }}/>

            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
              <div style={{ display:"flex", gap:"3.5rem" }}>
                {[
                  { num: CONTRIB_STATS.total, label:"Total\nContributions", color:"#fff" },
                  { num: CONTRIB_STATS.streak, label:"Day\nStreak",         color:"#b4ff50" },
                  { num: CONTRIB_STATS.best,   label:"Best\nDay",           color:"#fff" },
                ].map(({ num, label, color }) => (
                  <div key={label}>
                    <div style={{ fontSize:"clamp(1.8rem,3vw,2.8rem)", fontWeight:900, color, letterSpacing:"-0.04em", lineHeight:1 }}>{num}</div>
                    <div style={{ fontSize:"0.55rem", color:"#333", textTransform:"uppercase", letterSpacing:"0.18em", lineHeight:1.6, marginTop:6, whiteSpace:"pre-line" }}>{label}</div>
                  </div>
                ))}
              </div>

              <div style={{ textAlign:"right", display:"flex", flexDirection:"column", alignItems:"flex-end", gap:10 }}>
                <p style={{ margin:0, fontSize:"0.75rem", color:"#333", lineHeight:1.7, maxWidth:200 }}>Building in public,<br/>one commit at a time.</p>
                <a href="#" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#b4ff50", color:"#0a0a0a", fontSize:"0.75rem", fontWeight:700, padding:"10px 20px", borderRadius:99, textDecoration:"none", letterSpacing:"0.04em" }}>
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

      </div>{/* end tall panel */}

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
        {/* Ambient glow */}
        <div style={{ position:"absolute", top:"12%", left:"52%", transform:"translate(-50%,0)", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,#f2dfa8 0%,transparent 65%)", opacity:0.5, pointerEvents:"none" }}/>

        {/* ── Center content ── */}
        <div style={{
          position:"absolute", inset:0,
          display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center",
          textAlign:"center",
          padding:"0 clamp(16px,5vw,72px)",
          transform:`translateY(${p1 * -20}px)`,
          opacity: 1 - p1 * 0.5,
        }}>
          {/* "hi, i'm" */}
          <p style={{
            fontFamily:"'Caveat',cursive",
            fontSize:"clamp(1.8rem,3.2vw,3rem)",
            color:"#b0aaa0",
            fontWeight:400,
            margin:"0 0 0.1rem",
          }}>hi, i'm</p>

          {/* Name — three lines */}
          <div style={{
            fontSize:"clamp(3.6rem,10vw,11rem)",
            fontWeight:900,
            letterSpacing:"-0.04em",
            lineHeight:0.9,
            color:"#111827",
            userSelect:"none",
          }}>Muhammad</div>
          <div style={{
            fontSize:"clamp(3.6rem,10vw,11rem)",
            fontWeight:900,
            letterSpacing:"-0.04em",
            lineHeight:0.9,
            color:"#111827",
            userSelect:"none",
          }}>Nawwaf</div>
          <div style={{
            fontSize:"clamp(3.6rem,10vw,11rem)",
            fontWeight:900,
            letterSpacing:"-0.04em",
            lineHeight:0.9,
            color:"#d4cfc8",
            userSelect:"none",
            marginBottom:"clamp(0.8rem,2.5vh,1.8rem)",
          }}>Naufal</div>

          {/* Tagline */}
          <p style={{
            color:"#888",
            fontSize:"clamp(0.85rem,1.5vw,1.05rem)",
            lineHeight:1.65,
            margin:"0 0 1.6rem",
            maxWidth:400,
          }}>
            Backend Engineer building robust &amp;<br/>scalable digital systems.
          </p>

          {/* Social links */}
          <div style={{ display:"flex", gap:24, justifyContent:"center", opacity: 1 - p1 * 1.5 }}>
            {["Twitter","LinkedIn","GitHub"].map(s => (
              <a key={s} href="#" style={{ fontSize:"0.6rem", color:"#aaa", textTransform:"uppercase", letterSpacing:"0.18em", textDecoration:"none" }}>{s}</a>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
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