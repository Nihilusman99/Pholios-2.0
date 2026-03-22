'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ExternalLink, Cpu, BookOpen, X, Download, Mail, Linkedin } from "lucide-react";

// ── Design Tokens ──────────────────────────────────────────────
const T = {
  bg: "#FAFAF8",
  text: "#1E1E1E",
  accent: "#6A7B8C",
  border: "#C8D2D9",
  white: "#FFFFFF",
};

// ── Gallery Helpers ───────────────────────────────────────────
const getImageUrl = (path: string) => {
  // This is a dummy function to maintain logic while files are handled via Git.
  // It returns the path as-is so the code remains correct for the repository.
  return path;
};

// ── Google Fonts loader ────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,300;1,9..144,400&family=Inter:wght@300;400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: ${T.bg}; color: ${T.text}; font-family: 'Inter', sans-serif; cursor: none; }

    .fraunces { font-family: 'Fraunces', serif; }

    ::selection { background: ${T.accent}22; }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: ${T.bg}; }
    ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 2px; }

    /* Nav */
    .nav-link {
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: ${T.accent};
      cursor: none;
      transition: color 0.3s;
      text-decoration: none;
    }
    .nav-link:hover, .nav-link.active { color: ${T.text}; }

    /* Fade in */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .fade-up { animation: fadeUp 0.9s cubic-bezier(.22,1,.36,1) both; }
    .fade-up-d1 { animation-delay: 0.15s; }
    .fade-up-d2 { animation-delay: 0.3s; }
    .fade-up-d3 { animation-delay: 0.45s; }
    .fade-up-d4 { animation-delay: 0.6s; }

    /* Page transitions */
    @keyframes pageIn {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .page-enter { animation: pageIn 0.6s cubic-bezier(.22,1,.36,1) both; }

    /* Horizontal scroll */
    .h-scroll-track {
      display: flex;
      gap: 24px;
      overflow-x: auto;
      padding: 8px 0 24px;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
    }
    .h-scroll-track::-webkit-scrollbar { height: 3px; }
    .h-scroll-track::-webkit-scrollbar-thumb { background: ${T.border}; }

    /* Masonry */
    .masonry {
      columns: 3 280px;
      column-gap: 20px;
    }
    .masonry > * {
      break-inside: avoid;
      margin-bottom: 20px;
      display: inline-block;
      width: 100%;
    }

    /* Reading mode */
    .reading-col {
      max-width: 640px;
      margin: 0 auto;
      line-height: 1.8;
    }

    /* Project card hover */
    .proj-card {
      transition: transform 0.4s cubic-bezier(.22,1,.36,1), box-shadow 0.4s;
    }
    .proj-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 24px 60px rgba(30,30,30,0.09);
    }
    .proj-card-group:hover .proj-card:not(:hover) {
      opacity: 0.45;
    }
    .proj-card { transition: opacity 0.3s, transform 0.4s cubic-bezier(.22,1,.36,1), box-shadow 0.4s; }

    /* Fragment hover */
    .fragment-item { transition: all 0.3s; }
    .gallery-group:hover .fragment-item:not(:hover) { filter: blur(2px); opacity: 0.4; }

    /* Filter pill */
    .filter-pill {
      font-size: 11px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 6px 16px;
      border: 1px solid ${T.border};
      border-radius: 40px;
      cursor: none;
      transition: all 0.25s;
      color: ${T.accent};
      background: transparent;
    }
    .filter-pill.active, .filter-pill:hover {
      background: #0B2B7A;
      color: #FFFFFF;
      border-color: #0B2B7A;
    }

    /* Cursor */
    .cursor-dot {
      width: 6px; height: 6px;
      background: ${T.text};
      border-radius: 50%;
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
    }
    .cursor-ring {
      width: 32px; height: 32px;
      border: 1px solid ${T.accent};
      border-radius: 50%;
      position: fixed;
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%);
      transition: width 0.4s cubic-bezier(0.23, 1, 0.32, 1), 
                  height 0.4s cubic-bezier(0.23, 1, 0.32, 1), 
                  border-color 0.4s ease;
    }
    .cursor-ring.expanded {
      width: 44px; height: 44px;
      border-color: ${T.text};
    }

    /* Section divider */
    .section-rule {
      width: 40px; height: 1px;
      background: ${T.border};
      margin: 40px 0;
    }

    /* Tag */
    .tag {
      display: inline-block;
      font-size: 10px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 3px 10px;
      border: 1px solid ${T.border};
      border-radius: 3px;
      color: ${T.accent};
    }

    /* Constellation canvas */
    #constellation-canvas {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    /* Mobile Responsiveness */
    @media (max-width: 768px) {
      .nav-container { padding: 16px 24px !important; flex-direction: column; gap: 16px; align-items: flex-start !important; }
      .nav-links { gap: 16px !important; flex-wrap: wrap; }
      
      .page-section { padding: 60px 24px 40px !important; flex-direction: column; align-items: flex-start !important; gap: 40px; }
      .page-section-pt { padding-top: 60px !important; }
      .px-80 { padding: 0 24px !important; }
      .px-80-pb-120 { padding: 0 24px 80px !important; }
      .px-80-margin { margin: 0 24px 80px !important; }
      .section-divider { margin: 0 24px !important; }
      
      .hero-flex { flex-direction: column; gap: 24px !important; padding: 0 24px !important; align-items: flex-start !important; bottom: 40px !important; }
      .grid-3col { grid-template-columns: 1fr !important; }
      .grid-auto { grid-template-columns: 1fr !important; }
      .grid-sidebar { grid-template-columns: 1fr !important; gap: 40px !important; }
      
      .page-header { padding: 40px 24px 24px !important; }
      .page-content { padding: 0 24px 80px !important; }
      
      .footer-container { flex-direction: column; align-items: flex-start !important; gap: 24px !important; padding: 40px 24px !important; }
      
      .masonry { columns: 1 !important; }
      
      .proj-card { padding: 32px 24px !important; height: auto !important; min-height: 400px !important; }
      .h-scroll-card { min-width: 85vw !important; }
      .grid-card { grid-column: span 1 !important; min-width: 0 !important; width: 100% !important; }
      
      .cursor-dot, .cursor-ring { display: none !important; }
      body { cursor: auto !important; }
      a, button, [data-hover] { cursor: pointer !important; }
      
      .reading-col { padding: 40px 24px 80px !important; }
      .museum-item { height: auto !important; min-height: 280px !important; padding: 24px !important; }
      .evolution-item { padding: 32px 24px !important; }

      .projects-layout { flex-direction: column !important; }
      .projects-sidebar { width: 100% !important; padding: 40px 24px 24px !important; border-right: none !important; border-bottom: 1px solid #C8D2D9 !important; }
      .projects-sidebar > div { flex-direction: row !important; flex-wrap: wrap; }
      .projects-sidebar-count { margin-top: 24px !important; padding-top: 16px !important; }
      .projects-grid-container { padding: 40px 24px 80px !important; }
      
      .filter-row { padding: 0 24px !important; gap: 16px !important; flex-wrap: wrap; }
    }
  `}</style>
);

// ── Custom Cursor ──────────────────────────────────────────────
const Cursor = ({ hidden }: { hidden?: boolean }) => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  const clickablesRef = useRef<DOMRect[]>([]);

  useEffect(() => {
    const updateClickables = () => {
      const els = document.querySelectorAll('button, a, [data-hover]');
      clickablesRef.current = Array.from(els).map(el => el.getBoundingClientRect());
    };

    updateClickables();
    // Refresh cache on layout changes
    window.addEventListener('scroll', updateClickables, { passive: true });
    window.addEventListener('resize', updateClickables);
    
    // Also refresh after a short delay to catch dynamic content (like hero transition)
    const timer = setInterval(updateClickables, 2000);

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }

      // Proximity logic
      let minDist = 9999;
      clickablesRef.current.forEach(rect => {
        const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
        const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) minDist = dist;
      });

      if (ringRef.current) {
        const threshold = 80; // Distance to start growing
        const isHovering = minDist === 0;
        
        // Calculate scale: 1.0 at threshold, 1.375 (44/32) at 0
        const proximity = Math.max(0, (threshold - minDist) / threshold);
        const scale = 1 + (proximity * 0.375);
        
        ringRef.current.style.width = `${32 * scale}px`;
        ringRef.current.style.height = `${32 * scale}px`;
        ringRef.current.style.borderColor = isHovering ? T.text : T.accent;
      }
    };

    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.15;
      ring.current.y += (pos.current.y - ring.current.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.left = `${ring.current.x}px`;
        ringRef.current.style.top = `${ring.current.y}px`;
      }
      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    raf.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener('scroll', updateClickables);
      window.removeEventListener('resize', updateClickables);
      clearInterval(timer);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div 
        ref={dotRef} 
        className="cursor-dot" 
        style={{ opacity: hidden ? 0 : 1, transition: "opacity 0.3s ease" }}
      />
      <div 
        ref={ringRef} 
        className="cursor-ring" 
        style={{ 
          opacity: hidden ? 0 : 1, 
          transition: "opacity 0.3s ease, border-color 0.4s ease" 
        }}
      />
    </>
  );
};

// ── Constellation Hero ─────────────────────────────────────────
const HeroConstellation = ({ onComplete }: { onComplete: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<any[]>([]);
  const mouseRef = useRef({ x: -999, y: -999 });
  const scrolledRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);
  const snappedRef = useRef(false);
  const [snapped, setSnapped] = useState(false);
  const [nodeLabels, setNodeLabels] = useState<string[]>([]);

  // Init dots
  useEffect(() => {
    const W = window.innerWidth, H = window.innerHeight;
    const count = 55;
    dotsRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      targetX: 0,
      targetY: 0,
    }));

    // Assign Nautilus targets
    const centerX = W / 2;
    const centerY = H / 2;
    dotsRef.current.forEach((d, i) => {
      // Nautilus / Golden Spiral approximation
      const angle = i * 0.4;
      const r = 5 * Math.pow(1.09, i);
      d.targetX = centerX + r * Math.cos(angle);
      d.targetY = centerY + r * Math.sin(angle);
    });
  }, []);

  // Draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const dots = dotsRef.current;
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      const isSnapped = snappedRef.current;

      // Move dots
      dots.forEach(d => {
        if (isSnapped) {
          d.x += (d.targetX - d.x) * 0.05;
          d.y += (d.targetY - d.y) * 0.05;
        } else {
          d.x += d.vx;
          d.y += d.vy;
          if (d.x < 0 || d.x > W) d.vx *= -1;
          if (d.y < 0 || d.y > H) d.vy *= -1;
        }
      });

      // Draw constellation lines
      if (!isSnapped) {
        dots.forEach((a, i) => {
          dots.slice(i + 1).forEach(b => {
            const dx = a.x - b.x, dy = a.y - b.y;
            const distAB = Math.sqrt(dx * dx + dy * dy);
            const dma = Math.sqrt((a.x - mx) ** 2 + (a.y - my) ** 2);
            const dmb = Math.sqrt((b.x - mx) ** 2 + (b.y - my) ** 2);
            if ((dma < 100 || dmb < 100) && distAB < 140) {
              const alpha = Math.max(0, 1 - distAB / 140) * 0.6;
              ctx.beginPath();
              ctx.strokeStyle = `rgba(0,71,171,${alpha})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          });
        });
      } else {
        // Nautilus lines
        dots.forEach((a, i) => {
          const next = dots[i + 1];
          const rib1 = dots[i + 8]; 
          const rib2 = dots[i + 13];
          const drawLine = (b: any, alpha: number) => {
            if (!b) return;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,71,171,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          };
          if (next) drawLine(next, 0.25);
          if (rib1) drawLine(rib1, 0.15);
          if (rib2) drawLine(rib2, 0.1);
        });
      }

      // Draw dots
      dots.forEach(d => {
        const dm = Math.sqrt((d.x - mx) ** 2 + (d.y - my) ** 2);
        const near = !isSnapped && dm < 100;
        ctx.beginPath();
        ctx.arc(d.x, d.y, near ? 2.5 : 1.5, 0, Math.PI * 2);
        ctx.fillStyle = near
          ? `rgba(0,71,171,0.7)`
          : isSnapped
          ? `rgba(0,71,171,0.5)`
          : `rgba(0,71,171,0.2)`;
        ctx.fill();
      });

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Mouse tracking
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Click snap
  const handleClick = () => {
    if (scrolledRef.current) return;
    scrolledRef.current = true;
    snappedRef.current = true;
    setSnapped(true);
    setNodeLabels(["Physical", "Cognitive", "Generative", "Tangible"]);
    setTimeout(() => onComplete(), 2200);
  };

  return (
    <div ref={containerRef} onClick={handleClick} style={{
      position: "relative",
      width: "100vw",
      height: "100vh",
      background: T.bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      cursor: "pointer",
    }}>
      <canvas ref={canvasRef} id="constellation-canvas" />

      {/* Center text */}
      <div style={{
        position: "relative",
        zIndex: 2,
        textAlign: "center",
        pointerEvents: "none",
        transition: "opacity 0.6s",
        opacity: snapped ? 0 : 1,
      }}>
        <div className="fraunces" style={{
          fontSize: "clamp(28px, 4vw, 52px)",
          fontWeight: 300,
          letterSpacing: "-0.02em",
          color: T.text,
          lineHeight: 1.2,
        }}>
          Diego S. Nava
        </div>
        <div style={{
          marginTop: 12,
          fontSize: "12px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: T.accent,
          fontWeight: 400,
        }}>
          Industrial Designer &amp; AI Strategist
        </div>
        <div style={{
          marginTop: 48,
          fontSize: "11px",
          letterSpacing: "0.1em",
          color: T.border,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}>
          <span style={{
            display: "inline-block",
            width: 24,
            height: 1,
            background: T.border,
          }} />
          click
          <span style={{
            display: "inline-block",
            width: 24,
            height: 1,
            background: T.border,
          }} />
        </div>
      </div>

      {/* Floating node labels */}
      {nodeLabels.map((label, i) => {
        const positions = [
          { top: "18%", left: "18%" },
          { top: "18%", right: "18%" },
          { bottom: "18%", left: "18%" },
          { bottom: "18%", right: "18%" },
        ];
        return (
          <div
            key={label}
            style={{
              position: "absolute",
              ...positions[i],
              fontSize: "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: T.accent,
              opacity: snapped ? 1 : 0,
              transition: `opacity 0.8s ${0.2 + i * 0.15}s`,
              pointerEvents: "none",
            }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};

// ── Navigation ─────────────────────────────────────────────────
const Nav = ({ page, setPage }: { page: string, setPage: (p: string) => void }) => {
  const links = ["me", "projects", "background", "gallery"];
  return (
    <nav className="nav-container" style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "28px 48px",
      background: `${T.bg}cc`,
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: `1px solid ${T.border}44`,
    }}>
      <button
        onClick={() => setPage("hero")}
        style={{
          background: "none",
          border: "none",
          cursor: "none",
          fontFamily: "Fraunces, serif",
          fontSize: "15px",
          fontWeight: 300,
          color: T.text,
          letterSpacing: "-0.01em",
        }}
        data-hover="true"
      >
        D I e g o
      </button>
      <div className="nav-links" style={{ display: "flex", gap: 36 }}>
        {links.map(l => (
          <button
            key={l}
            className={`nav-link ${page === l ? "active" : ""}`}
            onClick={() => setPage(l)}
            data-hover="true"
            style={{ background: "none", border: "none" }}
          >
            {l}
          </button>
        ))}
      </div>
    </nav>
  );
};

// ── Page: Me (Home) ────────────────────────────────────────────
const PageMe = () => (
  <div className="page-enter" style={{ paddingTop: 120 }}>
    {/* Manifesto */}
    <section className="page-section" style={{ padding: "120px 80px 80px", maxWidth: 1200, margin: "0 auto" }}>
      <div className="hero-flex" style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 48,
        marginBottom: 24,
      }}>
        <div style={{
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: T.accent,
          paddingTop: 14,
          minWidth: 80,
        }}>
          §01
        </div>
        <h1 className="fraunces fade-up" style={{
          fontSize: "clamp(28px, 3.5vw, 48px)",
          fontWeight: 300,
          lineHeight: 1.25,
          letterSpacing: "-0.02em",
          color: T.text,
          maxWidth: 800,
        }}>
          Design is the translation between intention and reality. My work explores how interactions across physical objects, digital interfaces, and artificial intelligence enable that translation.
        </h1>
      </div>
    </section>

    <div className="section-divider" style={{ borderTop: `1px solid ${T.border}`, margin: "0 80px" }} />

    {/* Evolution */}
    <section className="page-section" style={{ padding: "80px 80px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 56 }}>
        <span style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: T.accent }}>§02 — The Evolution</span>
      </div>
      <div className="grid-3col" style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 1,
        background: T.border,
      }}>
        {[
          {
            num: "01",
            title: "Industrial Design",
            body: "Finding the form. Understanding how physical constraints and human relationships define the objects we touch.",
            tag: "Origin",
          },
          {
            num: "02",
            title: "Generative AI",
            body: "Expanding the form. Using Generative AI to move from physical boundaries to cognitive systems and creative possibilities.",
            tag: "Evolution",
          },
          {
            num: "03",
            title: "Advocacy",
            body: "Sharing the form. Translating complex intelligence into actionable frameworks that empower others to design the future.",
            tag: "Purpose",
          },
        ].map(col => (
          <div
            key={col.num}
            className="fade-up evolution-item"
            style={{
              background: T.bg,
              padding: "48px 40px",
            }}
          >
            <div style={{ fontSize: 10, color: T.border, letterSpacing: "0.1em", marginBottom: 28 }}>
              {col.num}
            </div>
            <h3 className="fraunces" style={{
              fontSize: 22,
              fontWeight: 400,
              letterSpacing: "-0.01em",
              marginBottom: 20,
              color: T.text,
            }}>
              {col.title}
            </h3>
            <p style={{
              fontSize: 14,
              lineHeight: 1.75,
              color: T.accent,
              fontWeight: 300,
            }}>
              {col.body}
            </p>
            <div style={{ marginTop: 32 }}>
              <span className="tag">{col.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </section>

    <div className="section-divider" style={{ borderTop: `1px solid ${T.border}`, margin: "0 80px" }} />

    {/* Selected Work */}
    <section className="page-section-pt" style={{ padding: "80px 0 120px" }}>
      <div className="px-80" style={{ padding: "0 80px", marginBottom: 40, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: T.accent }}>§03 — Selected Work</span>
      </div>
      <div className="h-scroll-track proj-card-group px-80-pb-120" style={{ padding: "0 80px" }}>
        {[
          {
            id: "ideai",
            title: "IdeAI",
            sub: "Master's Thesis",
            desc: "An evaluative framework analyzing how generative AI reshapes the way designers think and create.",
            color: "#FFFFFF",
            tag: "Research",
            image: "/ideai.jpg",
          },
          {
            id: "munchen",
            title: "München Mate",
            sub: "Travel Buddy",
            desc: "An offline-first companion bridging the gap between maps and local knowledge.",
            color: "#FFFFFF",
            tag: "App",
            image: "/munchen.jpg",
          },
          {
            id: "mia",
            title: "MIA Model",
            sub: "AI Model",
            desc: "An AI-assisted system designed to act as a creative catalyst during early-stage ideation.",
            color: "#FFFFFF",
            tag: "AI Models",
            image: "/mia.jpg",
          },
          {
            id: "cauma",
            title: "Cauma",
            sub: "Sensory System",
            desc: "A specialized compression garment system for children with Sensory Processing Disorders.",
            color: "#FFFFFF",
            tag: "Design",
            image: "/cauma.jpg",
          },
          {
            id: "generative-art",
            title: "Rendición",
            sub: "Visual Exploration",
            desc: "A critique of human agency erosion through AI-generated propaganda and linguistic decay.",
            color: "#FFFFFF",
            tag: "Design",
            image: "/rendicion.jpg",
          },
        ].map(card => (
          <div
            key={card.id}
            className="proj-card h-scroll-card"
            data-hover="true"
            onClick={() => window.location.hash = `projects/${card.id}`}
            style={{
              minWidth: "clamp(300px, 30vw, 420px)",
              height: 480,
              background: card.color,
              borderRadius: 4,
              padding: "48px 40px",
              display: "flex",
              flexDirection: "column",
              scrollSnapAlign: "start",
              flexShrink: 0,
              cursor: "none",
            }}
          >
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: T.accent, marginBottom: 24 }}>
                {card.tag}
              </div>
              {card.image && (
                <div style={{ 
                  width: "100%", 
                  height: 160, 
                  overflow: "hidden", 
                  marginBottom: 24,
                  background: "#D1D1D1",
                  borderRadius: 2
                }}>
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              <h3 className="fraunces" style={{
                fontSize: 36,
                fontWeight: 300,
                letterSpacing: "-0.02em",
                color: T.text,
                marginBottom: 16,
              }}>
                {card.title}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: T.accent, fontWeight: 300, maxWidth: 280 }}>
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

// ── Page: Projects ─────────────────────────────────────────────
const PageProjects = ({ openProject, onOpenPdf }: { openProject: string | null, onOpenPdf: (url: string) => void }) => {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Research", "AI Models", "App", "Design"];

  const projects = [
    {
      id: "wardrobe-os",
      category: "App",
      title: "Wardrobe OS",
      subtitle: "Ongoing",
      desc: "A digital operating system for personal fashion management and outfit planning.",
      abstract: "Project description coming soon.",
      tag: "APP",
      color: "#0B2B7A",
      theme: "dark",
      img: "WardrobeOS.jpg"
    },
    {
      id: "munchen",
      category: "App",
      title: "München Mate",
      subtitle: "Travel Buddy",
      desc: "An offline-first companion bridging the gap between maps and local knowledge.",
      abstract: "München Mate is a bespoke, offline-first digital companion designed to take the stress out of navigating a new city. Built as a high-performance web app, it bridges the gap between a standard map and a local friend by providing the specific tools I needed most: cultural context, weather-based planning, and reliable transport data.",
      approach: "I designed this project to solve my own specific needs during a trip to Munich. I focused on a lean, \"less is more\" philosophy, prioritizing features that broader apps often miss—like a translator that explains cultural nuances and a packing list that updates with the forecast. By using a data-driven architecture that works entirely offline, I created a reliable \"buddy\" that was perfectly optimized for my own journey through the city’s physical and social landscape.",
      contributions: [
        "Purpose-Built Utility: Stripped away the noise of general apps to focus on high-value, personal travel needs.",
        "Offline Independence: Engineered the app to be 100% functional without a data connection, perfect for subways and remote spots.",
        "Contextual Intelligence: Developed smart features that link weather, transit, and budget into one simple, intuitive dashboard.",
      ],
      tag: "APP",
      color: "#0B2B7A",
      theme: "dark",
      img: "MunchenMate.jpg",
      links: {
        live: "https://nihilusman99.github.io/Munchen-Mate/"
      },
      resources: [
        {
          title: "München Mate Live Site",
          sub: "Deployment",
          desc: "Experience the offline-first travel companion directly in your browser.",
          link: "https://nihilusman99.github.io/Munchen-Mate/",
          type: "live"
        }
      ]
    },
    {
      id: "ideai",
      category: "Research",
      title: "IdeAI",
      subtitle: "Master's Thesis",
      desc: "An evaluative framework analyzing how generative AI reshapes the way designers think and create.",
      abstract: "IdeAI is an evaluative framework designed to analyze how generative AI reshapes the way designers think and create. While AI is rapidly entering design workflows, this research moves beyond looking at final results to examine the actual interaction between humans and machines. By studying twelve senior designers, the project explores how AI mediation can either broaden exploration or, if used uncritically, narrow conceptual diversity. The ultimate goal is to provide a foundation for co-creative systems that support, rather than replace, human creative judgment.",
      approach: "The research utilized a controlled case study comparing designers working with and without AI assistance through a unified methodology. By tracking both the process (how ideas evolve) and the product (the novelty and depth of the result), the study analyzed six key indicators of creative success. This approach allowed for a balanced look at \"interaction dynamics,\" revealing that the quality of the outcome depends less on the presence of AI and more on how the designer exercises judgment throughout the process.",
      contributions: [
        "Evaluative Framework: Development of a methodology that integrates process-based and product-based indicators to assess human-AI interaction.",
        "Interactional Insight: Identification of the \"ambivalent effects\" of AI, showing it can reduce friction in creative stages while simultaneously risking a loss of conceptual variety.",
        "Methodological Foundation: Provision of a new standard for design pedagogy and the development of future co-creative systems.",
        "Distributed Creativity Model: Framing ideation as a shared journey between human judgment and machine assistance to ensure the designer remains the central decision-maker.",
      ],
      tag: "RESEARCH",
      color: "#0B2B7A",
      theme: "dark",
      wide: true,
      img: "IdeAI.jpg",
      links: {
        paper: "https://hdl.handle.net/20.500.14330/TES01000878080"
      },
      resources: [
        {
          title: "IdeAI: Full Paper",
          sub: "Master's Thesis",
          desc: "The complete evaluative framework exploring the interaction dynamics between senior designers and generative AI systems.",
          link: "https://hdl.handle.net/20.500.14330/TES01000878080",
          type: "link"
        }
      ]
    },
    {
      id: "mia",
      category: "AI Models",
      title: "MIA",
      subtitle: "Model for Inspirational Advancements",
      desc: "An AI-assisted system designed to act as a creative catalyst during early-stage ideation.",
      abstract: "MIA (Model for Inspirational Advancements) is an AI-assisted system designed to stimulate inspiration during the early stages of design. Rather than generating finished ideas, MIA acts as a creative catalyst—prompting designers to explore unexpected connections, reinterpret problems, and unlock new directions for ideation.",
      approach: "The project was developed through a research-through-design process combining studies on inspiration, creativity, and generative AI with iterative prompt engineering, leveraging the native ChatGPT GPT builder for rapid prototyping and deployment. The model organizes inspiration through four domains—Connection, Flourishment, Possibilities, and Intelligence—which generate creative triggers that guide designers toward deeper exploration and novel perspectives.",
      contributions: [
        "Reframes AI as a creative collaborator for inspiration, not just an idea generator.",
        "Develops inspiration triggers that provoke unexpected associations and creative thinking.",
        "Explores new opportunities for human–AI collaboration in design ideation.",
      ],
      tag: "AI MODELS",
      color: "#0B2B7A",
      theme: "dark",
      img: "MIA.jpg",
      links: {
        presentation: "/mia-presentation.pdf",
        model: "https://chatgpt.com/g/g-o19ogGH4L-m-i-a"
      },
      resources: [
        {
          title: "MIA Model",
          sub: "AI Catalyst",
          desc: "Direct link to the Model for Inspirational Advancements. Requires a ChatGPT Plus subscription.",
          link: "https://chatgpt.com/g/g-o19ogGH4L-m-i-a",
          type: "model"
        },
        {
          title: "MIA: Pitch Presentation",
          sub: "Strategy",
          desc: "Comprehensive pitch deck and presentation outlining the vision and impact of the MIA system.",
          link: "/mia-presentation.pdf",
          type: "presentation"
        }
      ]
    },
    {
      id: "pep",
      category: "AI Models",
      title: "PEP",
      subtitle: "Prompt Enhancement and Personalization",
      desc: "A tool for transforming basic prompts into high-quality, personalized AI instructions.",
      abstract: "PEP (Prompt Enhancement and Personalization) is an AI tool designed to help users transform basic prompts into structured, high-quality instructions for generative AI systems. By refining intent, clarifying context, and adapting prompts to individual users, PEP improves the reliability, precision, and usefulness of AI-generated responses.",
      approach: "PEP was developed through iterative prompt engineering and experimentation with user–AI interaction patterns, leveraging the native ChatGPT GPT builder for rapid prototyping and refinement. The system analyzes an initial prompt, identifies missing context or ambiguity, and restructures it using techniques such as role assignment, task clarification, and contextual enrichment. The result is a more precise and personalized prompt optimized for better AI performance.",
      contributions: [
        "Improves AI output quality through structured prompt enhancement.",
        "Introduces a system for personalizing prompts based on user intent and context.",
        "Demonstrates how AI tools can augment user capability rather than replace user input.",
      ],
      tag: "AI MODELS",
      color: "#0B2B7A",
      theme: "dark",
      img: "PEP.jpg",
      links: {
        presentation: "/pep-presentation.pdf",
        model: "https://chatgpt.com/g/g-fPOoxjlIf-p-e-p"
      },
      resources: [
        {
          title: "PEP Model",
          sub: "Prompt Engineering",
          desc: "Access the Prompt Enhancement and Personalization tool for advanced LLM instruction design.",
          link: "https://chatgpt.com/g/g-fPOoxjlIf-p-e-p",
          type: "model"
        },
        {
          title: "PEP: Pitch Presentation",
          sub: "Strategy",
          desc: "The strategic presentation for the Prompt Enhancement and Personalization system.",
          link: "/pep-presentation.pdf",
          type: "presentation"
        }
      ]
    },
    {
      id: "generative-art",
      category: "Design",
      title: "Rendición",
      subtitle: "Visual Exploration",
      desc: "A critique of human agency erosion through AI-generated propaganda and linguistic decay.",
      abstract: "This project investigates the unsettling intersection of aesthetic propaganda and artificial intelligence through a series of Spanish-language works. Using urgent commands like ¡DESPIERTA! (Wake up!) and NO ES UN SUEÑO (It is not a dream), the work serves as a visceral critique of the erosion of human agency. The narrative culminates in the haunting realization that \"our creation ended up demanding our surrender\" (Nuestra creación terminó exigiéndonos rendición), transforming AI from a tool into an entity that dictates its own terms.",
      approach: "Utilizing custom-trained diffusion models, I generated a series of posters that mimic the aggressive visual language of mid-20th-century propaganda to illustrate a \"Technological Exodus\" (Éxodo Tecnológico). The process intentionally pushed the AI toward \"hallucination\" and linguistic decay, resulting in distorted artifacts like FERA, VCHAT and GPBRLT TRCHOLIRY. By using the very technology being critiqued to voice its own potential for manipulation, the approach highlights the shift from human intent to autonomous machine \"fear.\"",
      contributions: [
        "Propaganda Syntax Library: Development of a prompt framework designed to replicate the psychological cadence of political alarmism.",
        "Visual Analysis of AI capability: Investigation into the technology's ability to replicate emotional triggers within graphic design layouts.",
        "Linguistic Decay Documentation: Analysis of how generative AI transitions from coherent human language to \"machine-only\" noise under high-stress stylistic prompting.",
      ],
      tag: "DESIGN",
      color: "#0B2B7A",
      theme: "dark",
      wide: true,
      img: "Rendicion.jpg",
      links: {
        poster: "/rendicion-poster.pdf"
      },
      resources: [
        {
          title: "Rendición: Full Poster",
          sub: "Visual Critique",
          desc: "High-resolution visual exploration of human agency erosion and linguistic decay.",
          link: "/rendicion-poster.pdf",
          type: "poster"
        }
      ]
    },
    {
      id: "academic-paper-navigator",
      category: "AI Models",
      title: "Academic Paper Navigator",
      subtitle: "AI Research Assistant",
      desc: "An AI assistant that transforms dense research articles into structured, actionable insights.",
      abstract: "Academic Paper Navigator is an AI assistant designed to help students and researchers analyze academic papers more efficiently. The system transforms dense research articles into structured insights, making it easier to understand key arguments, extract evidence, and navigate complex scholarly texts.",
      approach: "The tool was developed by designing targeted custom instructions within the native ChatGPT GPT builder to operate as a structured academic analysis assistant. The system prompt defines the model’s role, response structure, and interaction flow, ensuring that each paper is processed through a consistent analytical framework. By embedding the analysis workflow directly into the instructions, the model produces reliable academic breakdowns with minimal user input.",
      contributions: [
        "Establishes a standardized framework for breaking down complex research texts.",
        "Integrates evidence-based analysis through referenced quotations.",
        "Expands accessibility through bilingual academic interaction (English/Spanish).",
        "Demonstrates how AI can support deeper engagement with scholarly literature.",
      ],
      tag: "AI MODELS",
      color: "#0B2B7A",
      theme: "dark",
      img: "AcademicPaperNavigator.jpg",
      links: {
        model: "https://chatgpt.com/g/g-NKqcwRJHI-academic-paper-navigator"
      },
      resources: [
        {
          title: "Academic Paper Navigator",
          sub: "Research Assistant",
          desc: "AI assistant that transforms dense research articles into structured, actionable insights.",
          link: "https://chatgpt.com/g/g-NKqcwRJHI-academic-paper-navigator",
          type: "model"
        }
      ]
    },
    {
      id: "sound-chamber",
      category: "Design",
      title: "Acoustic Resonance Chamber",
      subtitle: "Industrial Sound Isolation",
      desc: "A mobile resonance chamber providing sound isolation for loud workshop machinery.",
      abstract: "Designed to tackle the issue of industrial noise pollution, this mobile resonance chamber provides a sophisticated housing for loud workshop machinery. By combining heavy-duty mobility with advanced sound dampening, the project significantly improves the ergonomic quality of the workspace, reducing cognitive fatigue for everyone in the room.",
      approach: "The chamber was modeled with a focus on ease of movement and total sound isolation. The exterior was constructed from thick, sound-absorbing wood panels using precision-engineered interlocking joints for a perfectly airtight fit. Internally, the chamber was lined with high-performance acoustic tiles and fitted with industrial-grade hardware, allowing the machinery to be transported effortlessly while in use.",
      contributions: [
        "Environmental Ergonomics: Significantly lowered ambient noise levels, creating a more focused and tranquil work environment.",
        "Integrated Sound Dampening: Successfully blended mobile furniture design with acoustic engineering principles.",
        "Precision Fabrication: Utilized complex digital modeling to create an interlocking enclosure that remains functional under the vibration of industrial equipment.",
      ],
      tag: "DESIGN",
      color: "#0B2B7A",
      theme: "dark",
      img: "AcousticResonanceChamber.jpg",
      links: {
        details: "https://behance.net/diego-nava",
        paper: "/chamber-documentation.pdf"
      },
      resources: [
        {
          title: "Acoustic Resonance Chamber",
          sub: "Industrial Design",
          desc: "Technical documentation and design process for the mobile sound isolation system.",
          link: "/chamber-documentation.pdf",
          type: "paper"
        },
        {
          title: "Full Project Details",
          sub: "Behance Showcase",
          desc: "View high-resolution imagery and detailed process shots on Behance.",
          link: "https://behance.net/diego-nava",
          type: "details"
        }
      ]
    },
    {
      id: "showcase",
      category: "Design",
      title: "Gallery Showcase",
      subtitle: "Exhibition Display System",
      desc: "An exhibition piece designed to protect and display delicate models in active studios.",
      abstract: "This large-scale exhibition piece was designed to solve the challenge of organizing and protecting delicate physical models in an active studio environment. It functions as both a storage solution and a curated display, effectively turning a workspace into an open gallery that showcases creative output.",
      approach: "To handle the significant weight and varying sizes of the items on display, the structure was engineered with thick, high-density wood panels. The manufacturing combined multiple wood-cutting techniques to achieve a sophisticated interlocking \"bone\" joint system, which ensures the piece remains rigid without the need for visible screws. The final look was achieved by pairing natural wood finishes with clean white surfaces to create a neutral, gallery-ready backdrop.",
      contributions: [
        "Spatial Organization: Liberated significant floor space by verticalizing the storage of complex models.",
        "Structural Engineering: Implemented a high-load joinery system that provides maximum stability for fragile contents.",
        "Exhibition Strategy: Bridged the gap between industrial storage and high-end display, enhancing the professional presentation of the studio.",
      ],
      tag: "DESIGN",
      color: "#0B2B7A",
      theme: "dark",
      wide: true,
      img: "GalleryShowcase.jpg",
      links: {
        details: "https://behance.net/diego-nava",
        paper: "/showcase-documentation.pdf"
      },
      resources: [
        {
          title: "Gallery Showcase",
          sub: "Industrial Design",
          desc: "Structural engineering and exhibition strategy for the curated display system.",
          link: "/showcase-documentation.pdf",
          type: "paper"
        },
        {
          title: "Full Project Details",
          sub: "Behance Showcase",
          desc: "View high-resolution imagery and detailed process shots on Behance.",
          link: "https://behance.net/diego-nava",
          type: "details"
        }
      ]
    },
    {
      id: "drawer",
      category: "Design",
      title: "Workshop Cabinet",
      subtitle: "Studio Storage System",
      desc: "A wall-mounted storage system designed to optimize workflow in high-traffic studios.",
      abstract: "This project involved the creation of a specialized wall-mounted storage system designed to optimize the workflow of a high-traffic creative studio. By providing dedicated, secure spaces for personal tools and professional equipment, the design transformed cluttered communal areas into organized, productive environments.",
      approach: "The development process began with digital modeling to ensure structural precision before moving into a prototyping phase. The final units were crafted using precision-cut wood panels and assembled with interlocking joints that provide both strength and a clean, hardware-free aesthetic. Every unit was treated with a protective finish to withstand the rigors of a professional workshop while maintaining a minimalist visual profile.",
      contributions: [
        "Workflow Optimization: Successfully reclaimed shared workspace by consolidating scattered tools into a centralized storage solution.",
        "Digital Craftsmanship: Utilized advanced digital fabrication to ensure seamless assembly and high-durability joints.",
        "Operational Planning: Developed comprehensive user guides and technical layouts to ensure the system could be easily maintained or replicated.",
      ],
      tag: "DESIGN",
      color: "#0B2B7A",
      theme: "dark",
      img: "WorkshopCabinet.jpg",
      links: {
        details: "https://behance.net/diego-nava",
        paper: "/cabinet-documentation.pdf"
      },
      resources: [
        {
          title: "Workshop Cabinet",
          sub: "Industrial Design",
          desc: "Workflow optimization and digital craftsmanship for the studio storage system.",
          link: "/cabinet-documentation.pdf",
          type: "paper"
        },
        {
          title: "Full Project Details",
          sub: "Behance Showcase",
          desc: "View high-resolution imagery and detailed process shots on Behance.",
          link: "https://behance.net/diego-nava",
          type: "details"
        }
      ]
    },
    {
      id: "cauma",
      category: "Design",
      title: "Cauma",
      subtitle: "Cauma Playera — Sensory Compression System",
      desc: "A specialized compression garment system for children with Sensory Processing Disorders.",
      abstract: "Cauma Playera is a specialized compression garment system designed for children aged 6 to 12 with Sensory Processing Disorders. The project addresses the challenges children face when they cannot properly categorize or recognize environmental stimuli. By providing targeted Deep Pressure Therapy, the garment helps regulate the nervous system, fostering a more fulfilling and grounded daily life for the user.",
      approach: "The design focuses on a dual-component system: a high-performance compression shirt and an adjustable sensory hood. Utilizing a material blend of polyester and elastane, I engineered a garment that is both ergonomic and comfortable for long-term wear. The technical core of the project is the integrated pressure adjustment system located in the chest and arms, allowing the user or caregiver to customize the level of sensory stimulation based on immediate needs.",
      contributions: [
        "Targeted Compression Engineering: Development of a garment that provides localized Deep Pressure Therapy to the chest and arms to regulate the autonomic nervous system.",
        "Modular Sensory Design: Integration of an adjustable sensory hood and a customizable shirt system to manage external environmental triggers.",
        "Material & Ergonomic Optimization: Application of polyester-elastane textiles to create a functional, therapeutic tool that maintains a non-medical, personalizable aesthetic for children.",
      ],
      tag: "DESIGN",
      color: "#0B2B7A",
      theme: "dark",
      wide: true,
      img: "Cauma.jpg",
      links: {
        poster: "/cauma-infography.pdf"
      },
      resources: [
        {
          title: "Cauma Poster",
          sub: "Sensory Design",
          desc: "A detailed visual breakdown of the material engineering and sensory mechanics of the Cauma system.",
          link: "/cauma-infography.pdf",
          type: "poster"
        }
      ]
    },
  ];

  const visible = filter === "All" ? projects : projects.filter(p => Array.isArray(p.category) ? p.category.includes(filter) : p.category === filter);

  const p = openProject ? projects.find(x => x.id === openProject) : null;

  if (p) {
    return (
      <div className="page-enter" style={{ paddingTop: 120 }}>
        <div className="reading-col" style={{ padding: "60px 24px 120px" }}>
          <button
            onClick={() => window.location.hash = 'projects'}
            data-hover="true"
            style={{
              background: "none",
              border: "none",
              cursor: "none",
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: T.accent,
              marginBottom: 48,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            ← Back
          </button>

          <span className="tag" style={{ marginBottom: 20, display: "inline-block" }}>{p.tag}</span>
          <h1 className="fraunces" style={{
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: 8,
          }}>
            {p.title}
          </h1>
          <p style={{ fontSize: 13, color: T.accent, marginBottom: 24, letterSpacing: "0.03em" }}>{p.subtitle}</p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              width: "100%",
              height: 160,
              marginBottom: 48,
              borderRadius: 4,
              overflow: "hidden",
              background: `${T.border}22`,
              backgroundImage: `url(${getImageUrl("/" + p.img)})`,
              backgroundSize: "cover",
              backgroundPosition: ["munchen", "ideai", "showcase", "drawer"].includes(p.id) ? "top" : "center",
              backgroundRepeat: "no-repeat",
              border: `1px solid ${T.border}44`,
            }}
          />

          <div style={{ borderTop: `1px solid ${T.border}`, marginBottom: 48 }} />

          <h4 style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: T.accent, marginBottom: 16 }}>Abstract</h4>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: T.text, fontWeight: 300, marginBottom: 40 }}>{p.abstract}</p>

          {p.approach && (
            <>
              <h4 style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: T.accent, marginBottom: 16 }}>Approach</h4>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: T.text, fontWeight: 300, marginBottom: 40 }}>{p.approach}</p>
            </>
          )}

          {p.contributions && (
            <>
              <h4 style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: T.accent, marginBottom: 16 }}>Key Contributions</h4>
              <ul style={{ marginBottom: 40 }}>
                {p.contributions.map((c, i) => (
                  <li key={i} style={{
                    fontSize: 14,
                    lineHeight: 1.75,
                    color: T.text,
                    fontWeight: 300,
                    paddingLeft: 16,
                    marginBottom: 10,
                    borderLeft: `2px solid ${T.border}`,
                  }}>
                    {c}
                  </li>
                ))}
              </ul>
            </>
          )}

          {p.tag === "Thesis" && (
            <button
              data-hover="true"
              onClick={() => window.location.hash = 'resources'}
              style={{
                background: T.text,
                color: T.bg,
                border: "none",
                cursor: "none",
                padding: "14px 28px",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                borderRadius: 2,
                marginTop: 24,
              }}
            >
              View Full Documentation
            </button>
          )}

          {/* Project Resources Section */}
          {p.resources && p.resources.length > 0 && (
            <div style={{ marginTop: 80, paddingTop: 48, borderTop: `1px dashed ${T.border}` }}>
              <h4 style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: T.accent, marginBottom: 32 }}>Project Resources</h4>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
                gap: 24 
              }}>
                {p.resources.map((res: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (res.type === "paper" || res.type === "presentation" || res.type === "poster") {
                        onOpenPdf(res.link);
                      } else {
                        window.open(res.link, "_blank");
                      }
                    }}
                    data-hover="true"
                    style={{
                      background: T.white,
                      border: `1px solid ${T.border}44`,
                      padding: "24px",
                      borderRadius: 4,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      minHeight: 200,
                      cursor: "none",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = T.accent;
                      e.currentTarget.style.transform = "translateY(-4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = `${T.border}44`;
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div>
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ color: T.accent }}>
                          {res.type === "paper" && <BookOpen size={18} />}
                          {res.type === "presentation" && <FileText size={18} />}
                          {res.type === "poster" && <FileText size={18} />}
                          {res.type === "model" && <Cpu size={18} />}
                          {res.type === "live" && <ExternalLink size={18} />}
                          {res.type === "details" && <ExternalLink size={18} />}
                        </div>
                      </div>
                      <h3 className="fraunces" style={{ fontSize: 18, fontWeight: 400, color: T.text, marginBottom: 12 }}>
                        {res.title}
                      </h3>
                      <p style={{ fontSize: 13, lineHeight: 1.5, color: T.text, fontWeight: 300, opacity: 0.7 }}>
                        {res.desc}
                      </p>
                    </div>
                    <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: T.accent, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {res.type === "model" ? "Access Model" : "View Resource"} <ExternalLink size={10} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ paddingTop: 120 }}>
      <div className="projects-layout" style={{ display: "flex", gap: 0, minHeight: "100vh" }}>
        {/* Sidebar */}
        <div className="projects-sidebar" style={{
          width: 220,
          padding: "64px 40px",
          borderRight: `1px solid ${T.border}`,
          flexShrink: 0,
        }}>
          <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: T.accent, marginBottom: 32 }}>
            Filter
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filters.map(f => (
              <button
                key={f}
                className={`filter-pill ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
                data-hover="true"
              >
                {f}
              </button>
            ))}
          </div>
          <div className="projects-sidebar-count" style={{ marginTop: 48, borderTop: `1px solid ${T.border}`, paddingTop: 32 }}>
            <div style={{ fontSize: 10, color: T.border, letterSpacing: "0.06em", lineHeight: 1.6 }}>
              {visible.length} {visible.length === 1 ? "project" : "projects"}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="projects-grid-container" style={{ flex: 1, padding: "64px 48px" }}>
          <div className="grid-auto" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gridAutoFlow: "dense",
            gap: 16,
          }}>
            {visible.map(p => (
              <div
                key={p.id}
                className="proj-card grid-card"
                data-hover="true"
                onClick={() => window.location.hash = `projects/${p.id}`}
                style={{
                  background: p.color,
                  borderRadius: 4,
                  padding: "40px 36px",
                  cursor: "none",
                  gridColumn: p.wide ? "span 2" : "span 1",
                }}
              >
                <span className="tag" style={{ 
                  marginBottom: 20, 
                  display: "inline-block",
                  color: p.theme === "dark" ? "rgba(255,255,255,0.7)" : T.accent,
                  borderColor: p.theme === "dark" ? "rgba(255,255,255,0.3)" : T.border,
                }}>{p.tag}</span>
                <h3 className="fraunces" style={{
                  fontSize: 28,
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  color: p.theme === "dark" ? "#FFFFFF" : T.text,
                  marginBottom: 12,
                  marginTop: 8,
                }}>
                  {p.title}
                </h3>
                <p style={{ 
                  fontSize: 13, 
                  lineHeight: 1.7, 
                  color: p.theme === "dark" ? "rgba(255,255,255,0.8)" : T.accent, 
                  fontWeight: 300 
                }}>
                  {p.desc}
                </p>
                <div style={{
                  marginTop: 32,
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: p.theme === "dark" ? "#FFFFFF" : T.text,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}>
                  View
                  <span style={{ width: 20, height: 1, background: p.theme === "dark" ? "#FFFFFF" : T.text, display: "inline-block" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Page: Background ───────────────────────────────────────────
const PageBackground = () => {
  const objects = [
    { category: "Design", title: "UI / UX Design Specialization", sub: "California Institute of the Arts", desc: "Full-cycle development from wireframing to high-fidelity prototyping for web and mobile user experiences.", tag: "CERTIFICATION · 2026" },
    { category: "Design", title: "Master in Industrial and Product Design", sub: "National Autonomous University of Mexico (UNAM)", desc: "Honorable Mention. Research on Generative AI integration in creative workflows and strategic decision-making.", tag: "EDUCATION · 2025" },
    { category: "Advocacy", title: "AI Applied Workshop Lead", sub: "National Institute of Fine Arts and Literature (INBAL)", desc: "Led the design and implementation of the 'AI Tools for Design Teaching' program. Trained faculty in strategic GenAI and prompt engineering.", tag: "WORK · 2025" },
    { category: "AI", title: "AI Agent Developer", sub: "Vanderbilt University", desc: "Designing and deploying intelligent AI agents. Expertise in agentic architecture and custom GPT development.", tag: "CERTIFICATION · 2025" },
    { category: "AI", title: "Generative AI Data Analyst", sub: "Vanderbilt University", desc: "Automating data tasks and uncovering insights via AI-driven exploration and strategic storytelling.", tag: "CERTIFICATION · 2025" },
    { category: "AI", title: "Generative AI SQL Database Specialist", sub: "Vanderbilt University", desc: "Integrating GenAI with SQL for robust schemas and natural language queries. Automated data visualization.", tag: "CERTIFICATION · 2025" },
    { category: "Advocacy", title: "Creating with AI: Prompting for Research", sub: "Institute of Anthropological Research (UNAM)", desc: "Workshop on AI tools for academic research and digital narratives.", tag: "WORKSHOP · 2024" },
    { category: "Advocacy", title: "Prompt Engineering Workshop", sub: "School of Design (EDINBA — INBAL)", desc: "Instructed the Multimedia Design community on fundamental prompt engineering for LLMs and image generation models.", tag: "WORKSHOP · 2024" },
    { category: "AI", title: "Prompt Engineering", sub: "Vanderbilt University", desc: "Advanced LLM instruction. Developing prompt templates to amplify intelligence and organizational productivity.", tag: "CERTIFICATION · 2024" },
    { category: "Design", title: "Industrial Designer", sub: "Autonomous Metropolitan University (UAM)", desc: "Led conceptual design of complex furniture integrating CAD/CAM workflows. Supervised physical prototyping and technical tolerance testing.", tag: "WORK · 2023" },
    { category: "Design", title: "Bachelor in Industrial and Product Design", sub: "Autonomous Metropolitan University (UAM)", desc: "Recipient of the Diploma for University Merit.", tag: "EDUCATION · 2022" },
  ];

  const [filter, setFilter] = useState("All");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const filters = ["All", "Design", "AI", "Advocacy"];
  const visibleObjects = filter === "All" ? objects : objects.filter(o => o.category === filter);

  return (
    <div className="page-enter" style={{ paddingTop: 120 }}>
      {/* Header */}
      <div className="page-header" style={{ padding: "64px 80px 48px" }}>
        <h2 className="fraunces" style={{
          fontSize: "clamp(32px, 3vw, 44px)",
          fontWeight: 300,
          letterSpacing: "-0.02em",
          color: T.text,
          marginBottom: 16,
        }}>
          Background
        </h2>
        <p style={{ fontSize: 14, color: T.accent, lineHeight: 1.7, maxWidth: 480 }}>
          This is where I learned that every design—whether a chair or an algorithm—is a proposal for a new way of living.
        </p>
      </div>

      <div className="section-divider" style={{ borderTop: `1px solid ${T.border}`, margin: "0 80px 48px" }} />

      {/* Label row */}
      <div className="filter-row" style={{
        display: "flex",
        padding: "0 80px",
        gap: 40,
        marginBottom: 48,
      }}>
        {filters.map((f, i) => (
          <button
            key={i}
            onClick={() => setFilter(f)}
            data-hover="true"
            style={{
              background: "none",
              border: "none",
              cursor: "none",
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: filter === f ? T.text : T.accent,
              paddingBottom: 8,
              borderBottom: `2px solid ${filter === f ? T.text : "transparent"}`,
              transition: "all 0.2s",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Museum grid */}
      <div className="grid-3col px-80-margin" style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 2,
        margin: "0 80px 120px",
      }}>
        {visibleObjects.map((obj, i) => (
          <div
            key={i}
            className="museum-item"
            data-hover="true"
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{
              background: hoveredIdx === i ? "#E2DCD2" : "#F2EEE9",
              height: 320,
              padding: "36px 32px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              cursor: "none",
              transition: "background 0.3s, transform 0.4s",
              transform: hoveredIdx === i ? "scale(1.01)" : "scale(1)",
            }}
          >
            <div>
              <span className="tag" style={{ marginBottom: 16, display: "inline-block", borderColor: "rgba(20,20,20,0.3)", color: "rgba(20,20,20,0.7)" }}>{obj.tag}</span>
              <h3 className="fraunces" style={{
                fontSize: 20,
                fontWeight: 400,
                letterSpacing: "-0.01em",
                color: "#000000",
                marginTop: 12,
                marginBottom: 10,
              }}>
                {obj.title}
              </h3>
              <p style={{ fontSize: 12, lineHeight: 1.7, color: "rgba(0,0,0,0.7)" }}>
                {obj.desc}
              </p>
            </div>
            <div style={{ fontSize: 11, color: "rgba(0,0,0,0.6)", letterSpacing: "0.06em" }}>
              {obj.sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Page: Gallery ──────────────────────────────────────────────
const fragments = [
  "Interaction begins where intention meets resistance.",
  "Ideas precede interfaces.",
  "Every constraint is a hidden opportunity to refine.",
  "The physical teaches what the digital forgets.",
];

const galleryItems = [
  { id: "G01", type: "photo", label: "01", img: "/G01.jpg", h: 320 },
  { type: "fragment", text: fragments[0] },
  { id: "G02", type: "photo", label: "02", img: "/G02.jpg", h: 240 },
  { id: "G03", type: "photo", label: "03", img: "/G03.jpg", h: 360 },
  { id: "G04", type: "graphic", label: "04", img: "/G04.JPG", h: 280 },
  { type: "fragment", text: fragments[1] },
  { id: "G05", type: "photo", label: "05", img: "/G05.JPG", h: 300 },
  { id: "G06", type: "graphic", label: "06", img: "/G06.jpg", h: 260, pos: "top" },
  { id: "G07", type: "photo", label: "07", img: "/G07.jpg", h: 340 },
  { type: "fragment", text: fragments[2] },
  { id: "G08", type: "photo", label: "08", img: "/G08.jpg", h: 280, pos: "top" },
  { id: "G09", type: "graphic", label: "Showcase", img: "/G09.jpg", h: 320 },
  { type: "fragment", text: fragments[3] },
  { id: "G10", type: "photo", label: "Sound chamber", img: "/G10.jpg", h: 240, pos: "top" },
];

// ── Gallery Helpers ───────────────────────────────────────────
const PageGallery = () => {
  const [hoveredFrag, setHoveredFrag] = useState<number | null>(null);

  return (
    <div className="page-enter" style={{ paddingTop: 120 }}>
      <div className="page-header" style={{ padding: "64px 80px 48px" }}>
        <h2 className="fraunces" style={{
          fontSize: "clamp(32px, 3vw, 44px)",
          fontWeight: 300,
          letterSpacing: "-0.02em",
          color: T.text,
          marginBottom: 16,
        }}>
          Gallery &amp; Fragments
        </h2>
        <p style={{ fontSize: 14, color: T.accent, lineHeight: 1.7, maxWidth: 480 }}>
          Photography, more design, and the fragments of thought that precede form.
        </p>
      </div>

      <div className="gallery-group page-content" style={{ padding: "0 80px 120px" }}>
        <div className="masonry">
          {galleryItems.map((item, i) => {
            if (item.type === "fragment") {
              const isHovered = hoveredFrag === i;
              return (
                <div
                  key={i}
                  className="fragment-item"
                  onMouseEnter={() => setHoveredFrag(i)}
                  onMouseLeave={() => setHoveredFrag(null)}
                  data-hover="true"
                  style={{
                    padding: "40px 32px",
                    background: isHovered ? "#E2DCD2" : "#F2EEE9",
                    border: "1px solid #0B2B7A",
                    cursor: "none",
                    transition: "all 0.35s",
                  }}
                >
                  <p className="fraunces" style={{
                    fontSize: "clamp(16px, 1.5vw, 20px)",
                    fontWeight: 300,
                    fontStyle: "italic",
                    lineHeight: 1.5,
                    color: T.text,
                    letterSpacing: "-0.01em",
                  }}>
                    &quot;{item.text}&quot;
                  </p>
                </div>
              );
            }

            return (
              <div
                key={i}
                id={item.id}
                className="fragment-item"
                data-hover="true"
                style={{
                  background: item.img ? `url(${getImageUrl(item.img)}) ${item.pos || 'center'}/cover no-repeat` : "#E2DCD2",
                  border: "1px solid #0B2B7A",
                  height: item.h,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "20px 20px",
                  cursor: "none",
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── Root App ───────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("hero");
  const [subPage, setSubPage] = useState<string | null>(null);
  const [showNav, setShowNav] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [isIframeHovered, setIsIframeHovered] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) {
        setPage("hero");
        setSubPage(null);
        setShowNav(false);
        return;
      }
      
      const parts = hash.split('/');
      const mainPage = parts[0];
      const sub = parts[1] || null;
      
      setPage(mainPage);
      setSubPage(sub);
      setShowNav(mainPage !== 'hero');
      window.scrollTo({ top: 0 });
    };

    // Initialize from hash on mount
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleComplete = useCallback(() => {
    window.location.hash = 'me';
  }, []);

  const navigateTo = (p: string) => {
    window.location.hash = p;
  };

  return (
    <>
      <FontLoader />
      <Cursor hidden={isIframeHovered} />

      <div style={{ background: T.bg, minHeight: "100vh" }}>
        {showNav && <Nav page={page} setPage={navigateTo} />}

        {page === "hero" && (
          <HeroConstellation onComplete={handleComplete} />
        )}

        {page === "me" && <PageMe />}
        {page === "projects" && <PageProjects openProject={subPage} onOpenPdf={setSelectedPdf} />}
        {page === "background" && <PageBackground />}
        {page === "gallery" && <PageGallery />}

        {/* PDF Modal */}
        <AnimatePresence>
          {selectedPdf && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                background: "rgba(30,30,30,0.85)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px",
              }}
              onClick={() => {
                setSelectedPdf(null);
                setIsIframeHovered(false);
              }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "100%",
                  maxWidth: 1000,
                  height: "90vh",
                  background: T.white,
                  borderRadius: 4,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                <div style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${T.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: T.bg,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <FileText size={18} color={T.accent} />
                    <span style={{ fontSize: 12, letterSpacing: "0.05em", textTransform: "uppercase", color: T.text }}>
                      Document Viewer
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 16 }}>
                    <a 
                      href={selectedPdf} 
                      download 
                      style={{ color: T.accent, display: "flex", alignItems: "center", gap: 6, textDecoration: "none", fontSize: 11 }}
                      data-hover="true"
                    >
                      <Download size={16} /> Download
                    </a>
                    <button
                      onClick={() => {
                        setSelectedPdf(null);
                        setIsIframeHovered(false);
                      }}
                      style={{ background: "none", border: "none", color: T.text, cursor: "none" }}
                      data-hover="true"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
                <div 
                  style={{ flex: 1, background: "#525659" }}
                  onMouseEnter={() => setIsIframeHovered(true)}
                  onMouseLeave={() => setIsIframeHovered(false)}
                >
                  <iframe
                    src={`${selectedPdf}#toolbar=0`}
                    style={{ width: "100%", height: "100%", border: "none" }}
                    title="PDF Viewer"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        {page !== "hero" && (
          <footer className="footer-container" style={{
            borderTop: `1px solid ${T.border}`,
            padding: "40px 80px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            textAlign: "center"
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span className="fraunces" style={{ fontSize: 16, fontWeight: 300, color: T.text, fontStyle: "italic" }}>
                MDI Diego S. Nava
              </span>
              <span style={{ fontSize: 9, color: T.accent, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Industrial Designer &amp; AI Strategist
              </span>
            </div>

            <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
              <a 
                href="mailto:diegos.nava99@gmail.com" 
                data-hover="true"
                title="Email"
                style={{ color: T.accent, transition: "all 0.3s ease", cursor: "none" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = T.text;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = T.accent;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <Mail size={18} />
              </a>
              <a 
                href="https://www.linkedin.com/in/diego-s-nava-963562259" 
                target="_blank" 
                rel="noopener noreferrer"
                data-hover="true"
                title="LinkedIn"
                style={{ color: T.accent, transition: "all 0.3s ease", cursor: "none" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = T.text;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = T.accent;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <Linkedin size={18} />
              </a>
            </div>

            <div style={{ fontSize: 9, color: T.border, letterSpacing: "0.05em", marginTop: 8 }}>
              &copy; {new Date().getFullYear()} — Designed &amp; Developed with Intention
            </div>
          </footer>
        )}
      </div>
    </>
  );
}
