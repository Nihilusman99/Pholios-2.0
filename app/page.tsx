'use client';

import { useState, useEffect, useRef, useCallback } from "react";

// ── Design Tokens ──────────────────────────────────────────────
const T = {
  bg: "#FAFAF8",
  text: "#1E1E1E",
  accent: "#6A7B8C",
  border: "#C8D2D9",
  white: "#FFFFFF",
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
      transition: transform 0.1s;
    }
    .cursor-ring {
      width: 32px; height: 32px;
      border: 1px solid ${T.accent};
      border-radius: 50%;
      position: fixed;
      pointer-events: none;
      z-index: 9998;
      transition: width 0.25s, height 0.25s, border-color 0.25s, transform 0.08s;
    }
    .cursor-ring.expanded {
      width: 52px; height: 52px;
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
const Cursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX - 3}px`;
        dotRef.current.style.top = `${e.clientY - 3}px`;
      }
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const hovering = el && (el.closest("button, a, [data-hover]"));
      if (ringRef.current) ringRef.current.classList.toggle("expanded", !!hovering);
    };

    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${ring.current.x - 16}px`;
        ringRef.current.style.top = `${ring.current.y - 16}px`;
      }
      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    raf.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
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

    // Assign grid targets
    const cols = 8, rows = 7;
    const gw = W * 0.6, gh = H * 0.5;
    const sx = (W - gw) / 2, sy = (H - gh) / 2;
    dotsRef.current.forEach((d, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      d.targetX = sx + (col / (cols - 1)) * gw;
      d.targetY = sy + (row / (rows - 1)) * gh;
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
          d.x += (d.targetX - d.x) * 0.04;
          d.y += (d.targetY - d.y) * 0.04;
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
        // Grid lines
        const cols = 8;
        dots.forEach((a, i) => {
          const right = dots[i + 1];
          const below = dots[i + cols];
          const drawLine = (b: any) => {
            if (!b) return;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,71,171,0.25)`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          };
          if (right && (i + 1) % cols !== 0) drawLine(right);
          drawLine(below);
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
    setTimeout(() => onComplete(), 1400);
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
          { top: "28%", left: "20%" },
          { top: "35%", right: "22%" },
          { bottom: "30%", left: "24%" },
          { bottom: "26%", right: "20%" },
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
            desc: "Measuring GenAI's impact on the creative ideation process through a structured design methodology.",
            color: "#FFFFFF",
            tag: "Research",
          },
          {
            id: "mia",
            title: "MIA Model",
            sub: "AI Model",
            desc: "Model for Inspirational Advancement — a fine-tuned generative system for creative professionals.",
            color: "#FFFFFF",
            tag: "AI · Systems",
          },
          {
            id: "munchen",
            title: "München Mate",
            sub: "APP",
            desc: "A context-aware companion designed to navigate the physical and cultural layers of a city through intelligent, localized interaction.",
            color: "#FFFFFF",
            tag: "PRODUCT · TRAVEL",
          },
          {
            id: "cauma",
            title: "Cauma",
            sub: "Research and Development",
            desc: "A sensory compression garment exploring the boundary between physical objects and emotional regulation through deep-pressure interaction.",
            color: "#FFFFFF",
            tag: "INDUSTRIAL DESIGN · TANGIBLE",
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
              justifyContent: "space-between",
              scrollSnapAlign: "start",
              flexShrink: 0,
              cursor: "none",
            }}
          >
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: T.accent, marginBottom: 32 }}>
                {card.tag}
              </div>
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
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: T.text,
            }}>
              <span>{card.sub}</span>
              <span style={{ width: 24, height: 1, background: T.text, display: "inline-block" }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

// ── Page: Projects ─────────────────────────────────────────────
const PageProjects = ({ openProject }: { openProject: string | null }) => {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Research", "AI Models", "App", "Design"];

  const projects = [
    {
      id: "ideai",
      category: "Research",
      title: "IdeAI",
      subtitle: "Master's Thesis — Vanderbilt University, 2024",
      abstract: "This thesis investigates the intersection of generative artificial intelligence and the human creative ideation process. Using a mixed-methods research framework, IdeAI proposes a structured protocol to measure how AI tools—specifically large language models and image generation systems—expand, constrain, or redirect creative divergence in industrial design workflows.",
      approach: "Participants were assigned design briefs of equivalent complexity. One cohort worked without AI assistance; a second used unstructured AI prompting; a third used the IdeAI protocol—a scaffolded, phase-locked ideation method. Outputs were evaluated on novelty, feasibility, and breadth of concept exploration.",
      contributions: [
        "A validated protocol for integrating GenAI into early-stage design ideation",
        "A scoring rubric for measuring creative divergence quantitatively",
        "Evidence that structured AI use increases conceptual breadth by 34% versus unassisted ideation",
        "A framework adopted in the INBAL educators' 30-hour AI curriculum",
      ],
      tag: "Research",
      color: "#0B2B7A",
      theme: "dark",
      wide: true,
    },
    {
      id: "cauma",
      category: ["Research", "Design"],
      title: "Cauma",
      subtitle: "Research and Development",
      abstract: "A sensory compression garment exploring the boundary between physical objects and emotional regulation through deep-pressure interaction.",
      tag: "INDUSTRIAL DESIGN · TANGIBLE",
      color: "#0B2B7A",
      theme: "dark",
      wide: true,
    },
    {
      id: "mia",
      category: "AI Models",
      title: "MIA",
      subtitle: "Model for Inspirational Advancement",
      abstract: "A fine-tuned generative model designed to support creative professionals during early-stage ideation. MIA ingests project briefs and user aesthetic profiles to generate divergent concept seeds—not finished designs, but provocations.",
      approach: "Built on a fine-tuned base LLM with a custom prompt pipeline. Input: structured brief + style vector. Output: 5-7 concept seeds with rationale.",
      contributions: [
        "Custom fine-tuning dataset of 1,200+ design briefs",
        "Style vector encoding from 16 aesthetic axes",
        "Deployed to 3 design studios in pilot",
      ],
      architecture: [
        { layer: "Input", desc: "Brief Parser + Style Vector" },
        { layer: "Core", desc: "Fine-tuned LLM (7B)" },
        { layer: "Output", desc: "Concept Seeds + Rationale" },
      ],
      tag: "AI Model",
      color: "#0B2B7A",
      theme: "dark",
    },
    {
      id: "pep",
      category: "AI Models",
      title: "PEP",
      subtitle: "Prompt Enhancement and Personalization",
      abstract: "PEP is a meta-prompt system that transforms vague user intentions into precisely structured, context-aware prompts for downstream generative models. It acts as an intelligent translator between human intention and machine language.",
      approach: "Analyzes input intent signals, injects domain context, and applies a personalization layer trained on user history.",
      contributions: [
        "Personalization engine with adaptive user model",
        "Domain-specific prompt templates for design, writing, and strategy",
        "Reduces prompt iteration cycles by ~60%",
      ],
      architecture: [
        { layer: "Input", desc: "Raw user intent" },
        { layer: "Analysis", desc: "Intent parsing + domain classifier" },
        { layer: "Personalization", desc: "User history embedding" },
        { layer: "Output", desc: "Structured prompt" },
      ],
      tag: "AI Model",
      color: "#0B2B7A",
      theme: "dark",
    },
    {
      id: "munchen",
      category: "App",
      title: "München Mate",
      subtitle: "APP",
      abstract: "A context-aware companion designed to navigate the physical and cultural layers of a city through intelligent, localized interaction.",
      wireframeSteps: ["Onboarding → Language + interests", "District map", "Category filters", "Deep card view"],
      tag: "PRODUCT · TRAVEL",
      color: "#0B2B7A",
      theme: "dark",
    },
    {
      id: "wardrobe-os",
      category: "App",
      title: "Wardrobe OS",
      subtitle: "Coming Soon",
      abstract: "Project description coming soon.",
      tag: "APP · LIFESTYLE",
      color: "#0B2B7A",
      theme: "dark",
    },
    {
      id: "academic-paper-navigator",
      category: "AI Models",
      title: "Academic Paper Navigator",
      subtitle: "Coming Soon",
      abstract: "Project description coming soon.",
      tag: "RESEARCH · TOOL",
      color: "#0B2B7A",
      theme: "dark",
    },
    {
      id: "drawer",
      category: "Design",
      title: "Drawer",
      subtitle: "Coming Soon",
      abstract: "Project description coming soon.",
      tag: "INDUSTRIAL DESIGN",
      color: "#0B2B7A",
      theme: "dark",
    },
    {
      id: "showcase",
      category: "Design",
      title: "Showcase",
      subtitle: "Coming Soon",
      abstract: "Project description coming soon.",
      tag: "DESIGN · EXHIBITION",
      color: "#0B2B7A",
      theme: "dark",
      wide: true,
    },
    {
      id: "sound-chamber",
      category: "Design",
      title: "Sound Chamber",
      subtitle: "Coming Soon",
      abstract: "Project description coming soon.",
      tag: "INDUSTRIAL DESIGN · AUDIO",
      color: "#0B2B7A",
      theme: "dark",
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
          <p style={{ fontSize: 13, color: T.accent, marginBottom: 48, letterSpacing: "0.03em" }}>{p.subtitle}</p>

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

          {p.architecture && (
            <>
              <h4 style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: T.accent, marginBottom: 20 }}>System Architecture</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 40 }}>
                {p.architecture.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                    <div style={{
                      background: i % 2 === 0 ? T.text : T.accent,
                      color: T.bg,
                      padding: "14px 20px",
                      fontSize: 10,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      minWidth: 120,
                    }}>
                      {a.layer}
                    </div>
                    <div style={{
                      flex: 1,
                      background: "#F0EFEC",
                      padding: "14px 20px",
                      fontSize: 13,
                      color: T.accent,
                    }}>
                      {a.desc}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {p.wireframeSteps && (
            <>
              <h4 style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: T.accent, marginBottom: 20 }}>User Flow</h4>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40 }}>
                {p.wireframeSteps.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      background: "#F0EFEC",
                      padding: "12px 16px",
                      fontSize: 12,
                      color: T.text,
                      borderRadius: 2,
                    }}>
                      {s}
                    </div>
                    {i < p.wireframeSteps.length - 1 && (
                      <span style={{ color: T.border, fontSize: 12 }}>→</span>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {p.tag === "Thesis" && (
            <button
              data-hover="true"
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
              }}
            >
              Download PDF
            </button>
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
                  {p.abstract.slice(0, 120)}…
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
    { category: "Design", title: "Tactile Interface Study", sub: "Bachelor's Thesis Object", desc: "Ergonomic grip study translated into a handheld device prototype. 14 iterations across 3 materials.", tag: "Physical · 2022" },
    { category: "Design", title: "Modular Light Form", sub: "Designed Object", desc: "Parametrically derived lamp structure. Each joint toleranced for tool-free assembly.", tag: "Product · 2021" },
    { category: "Design", title: "Seating System", sub: "Bachelor's Thesis", desc: "A stackable chair designed around occupancy efficiency and tactile surface quality.", tag: "Furniture · 2022" },
    { category: "Design", title: "Parametric Handle", sub: "CAD/CAM Study", desc: "Algorithmic generation of ergonomic handle geometries. Grasshopper + Rhino pipeline.", tag: "CAD · 2021" },
    { category: "Design", title: "Wayfinding System", sub: "Designed Object", desc: "Signage family for a public institution. Type + form + material specification.", tag: "System · 2023" },
    { category: "AI", title: "Generative Form Exploration", sub: "AI Assisted CAD", desc: "Using diffusion models to rapidly iterate on complex surface topologies before manual CAD modeling.", tag: "Research · 2023" },
    { category: "AI", title: "Material Stress Predictor", sub: "ML Model", desc: "Trained a lightweight neural network to predict failure points in 3D printed geometries.", tag: "Engineering · 2024" },
    { category: "AI", title: "Automated Ergonomic Testing", sub: "Simulation", desc: "Computer vision pipeline to analyze human posture and interaction with physical prototypes.", tag: "Computer Vision · 2023" },
    { category: "AI", title: "Prompt Engineering for ID", sub: "Methodology", desc: "Developed a structured prompting framework specifically for industrial design ideation.", tag: "Framework · 2024" },
    { category: "AI", title: "Semantic Space Mapping", sub: "Data Visualization", desc: "Clustering and visualizing thousands of design concepts using text embeddings.", tag: "Data · 2023" },
    { category: "Qualifications", title: "Master of Science", sub: "Vanderbilt University", desc: "Master's degree focusing on the intersection of generative artificial intelligence and design.", tag: "Education · 2024" },
    { category: "Qualifications", title: "Bachelor of Industrial Design", sub: "University", desc: "Comprehensive study of physical product design, manufacturing, and ergonomics.", tag: "Education · 2022" },
    { category: "Qualifications", title: "Advanced CAD Certification", sub: "Professional", desc: "Certified in advanced surface modeling and parametric design methodologies.", tag: "Certification · 2021" },
    { category: "Qualifications", title: "Machine Learning Specialization", sub: "Professional", desc: "Deep learning, neural networks, and practical ML deployment methodologies.", tag: "Certification · 2023" },
    { category: "Qualifications", title: "Enclosure System", sub: "Technical Drawing Suite", desc: "Technical drawing suite for a modular enclosure. Full dimensioned orthographic projection.", tag: "Technical Drawing" },
  ];

  const [filter, setFilter] = useState("All");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const filters = ["All", "Design", "AI", "Qualifications"];
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
  { id: "G01", type: "photo", label: "01", img: "https://github.com/user-attachments/assets/f65653b8-6d83-4267-9ed7-f21dc101d88a", h: 320 },
  { type: "fragment", text: fragments[0] },
  { id: "G02", type: "photo", label: "02", img: "https://github.com/user-attachments/assets/6ce8c55c-c3fa-4f5d-8d6b-b46effe1ff63", h: 240 },
  { id: "G03", type: "photo", label: "03", img: "https://github.com/user-attachments/assets/6c2ddc80-b1bf-4255-a12d-c8fc923c8f40", h: 360 },
  { id: "G04", type: "graphic", label: "04", img: "https://github.com/user-attachments/assets/fa57973a-dbd0-42e0-bc6b-f09419494165", h: 280 },
  { type: "fragment", text: fragments[1] },
  { id: "G05", type: "photo", label: "05", img: "https://github.com/user-attachments/assets/4a8ed4ef-dbdd-4b7c-8d16-8e039a86bdb6", h: 300 },
  { id: "G06", type: "graphic", label: "06", img: "https://github.com/user-attachments/assets/39a44046-58da-49ca-8bd3-8f463c34b89b", h: 260 },
  { id: "G07", type: "photo", label: "07", img: "https://github.com/user-attachments/assets/d22baee2-2636-464b-9aba-dc19db9b42f2", h: 340 },
  { type: "fragment", text: fragments[2] },
  { id: "G08", type: "photo", label: "08", img: "https://github.com/user-attachments/assets/be571216-2471-44b2-b3f9-b8cbfe12d8d3", h: 280 },
  { id: "G09", type: "graphic", label: "Showcase", img: "/G09.jpg", h: 320 },
  { type: "fragment", text: fragments[3] },
  { id: "G10", type: "photo", label: "Sound chamber", img: "/G10.jpg", h: 240 },
];

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
                  background: item.img ? `url(${item.img}) center/cover no-repeat` : "#E2DCD2",
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
      <Cursor />

      <div style={{ background: T.bg, minHeight: "100vh" }}>
        {showNav && <Nav page={page} setPage={navigateTo} />}

        {page === "hero" && (
          <HeroConstellation onComplete={handleComplete} />
        )}

        {page === "me" && <PageMe />}
        {page === "projects" && <PageProjects openProject={subPage} />}
        {page === "background" && <PageBackground />}
        {page === "gallery" && <PageGallery />}

        {/* Footer */}
        {page !== "hero" && (
          <footer className="footer-container" style={{
            borderTop: `1px solid ${T.border}`,
            padding: "48px 80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <span className="fraunces" style={{ fontSize: 14, fontWeight: 300, color: T.accent, fontStyle: "italic" }}>
              MDI Diego S. Nava
            </span>
            <span style={{ fontSize: 11, color: T.border, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Industrial Designer &amp; AI Strategist
            </span>
          </footer>
        )}
      </div>
    </>
  );
}
