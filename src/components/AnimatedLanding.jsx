import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import "./AnimatedLanding.css";

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin, MorphSVGPlugin);

// Star shape path (5-pointed star centred at 100,100 with outer r=80, inner r=35)
const STAR_PATH =
  "M100,20 L111,68 L162,68 L120,98 L135,146 L100,118 L65,146 L80,98 L38,68 L89,68 Z";

export default function AnimatedLanding() {
  const containerRef = useRef(null);

  // ── Animations + contextSafe for event-handler tweens ──────────────────
  const { contextSafe } = useGSAP(
    () => {
      // ── 1. Hero: draw the SVG logo path from 0% → 100% ──────────────────
      // Selector is scoped to containerRef so it only matches inside this component.
      gsap.from(".hero-logo-path", {
        drawSVG: "0%",
        duration: 2,
        ease: "power2.inOut",
      });

      // ── 2. Features: stagger-reveal cards with ScrollTrigger ─────────────
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".feature-cards",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        })
        .from(".feature-card", {
          autoAlpha: 0,
          y: 50,
          duration: 0.7,
          stagger: 0.2,
          ease: "power2.out",
        });
    },
    { scope: containerRef }
  );

  // ── 3. Shape morph: circle → star on hover ──────────────────────────────
  // contextSafe wraps event-handler callbacks so tweens created inside them
  // are tracked by the GSAP context and reverted on unmount.
  // Class selectors are used (scoped to containerRef) to avoid ref.current
  // access outside of effects/handlers.
  const handleMouseEnter = contextSafe(() => {
    gsap.to(".morph-circle", {
      duration: 0.6,
      morphSVG: ".morph-star",
      ease: "power2.inOut",
    });
  });

  const handleMouseLeave = contextSafe(() => {
    gsap.to(".morph-circle", {
      duration: 0.6,
      morphSVG: ".morph-circle",
      ease: "power2.inOut",
    });
  });

  return (
    <div className="landing" ref={containerRef}>
      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-content">
          <svg
            className="hero-logo"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Animated logo"
          >
            {/*
              A decorative "W" letterform made of a single continuous stroke so
              DrawSVG can animate it being drawn end-to-end.
            */}
            <path
              className="hero-logo-path"
              d="M20,40 L50,160 L100,80 L150,160 L180,40"
              stroke="#6C63FF"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <h1 className="hero-title">Welcome to the Future</h1>
          <p className="hero-subtitle">
            Scroll down to see what we can do for you.
          </p>
        </div>
      </section>

      {/* ── Features Section ─────────────────────────────────────────── */}
      <section className="features">
        <h2 className="section-title">Our Features</h2>
        <div className="feature-cards">
          {[
            {
              icon: "⚡",
              title: "Blazing Fast",
              desc: "Optimised for performance so your users never wait.",
            },
            {
              icon: "🎨",
              title: "Beautifully Designed",
              desc: "Pixel-perfect interfaces crafted by world-class designers.",
            },
            {
              icon: "🔒",
              title: "Secure by Default",
              desc: "Industry-leading security baked in from day one.",
            },
          ].map(({ icon, title, desc }) => (
            <div className="feature-card" key={title}>
              <span className="card-icon">{icon}</span>
              <h3 className="card-title">{title}</h3>
              <p className="card-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Shape Morph Demo ─────────────────────────────────────────── */}
      <section className="morph-demo">
        <h2 className="section-title">Shape Morph Demo</h2>
        <p className="morph-hint">Hover over the shape below</p>

        <svg
          className="morph-svg"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Interactive morphing shape"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Hidden target star path — used only as a MorphSVG target */}
          <path
            className="morph-star"
            d={STAR_PATH}
            fill="none"
            stroke="none"
            style={{ visibility: "hidden" }}
          />

          {/* Visible shape that morphs */}
          <circle
            className="morph-circle"
            cx="100"
            cy="100"
            r="70"
            fill="#6C63FF"
            fillOpacity="0.85"
          />
        </svg>
      </section>
    </div>
  );
}
