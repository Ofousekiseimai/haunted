"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
}

export function GlowCard({ children, className = "" }: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--mouse-x", `-100px`);
    card.style.setProperty("--mouse-y", `-100px`);
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`glow-card ${className}`}
      style={
        {
          "--mouse-x": "-100px",
          "--mouse-y": "-100px",
        } as React.CSSProperties
      }
    >
      <span className="bracket bracket-tl" />
      <span className="bracket bracket-tr" />
      <span className="bracket bracket-bl" />
      <span className="bracket bracket-br" />

      <div className="glow-overlay" />

      <div className="relative z-10">{children}</div>

      <style jsx>{`
        .glow-card {
          position: relative;
          background: var(--surface-glass);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--hairline);
          padding: 1.5rem;
          transition: border-color 0.3s ease, transform 0.3s ease;
          overflow: hidden;
        }

        .glow-card:hover {
          border-color: var(--hairline-strong);
          transform: translateY(-2px);
        }

        .glow-overlay {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.3s ease;
          background: radial-gradient(
            300px circle at var(--mouse-x) var(--mouse-y),
            rgba(140, 120, 170, 0.08),
            transparent 60%
          );
          pointer-events: none;
          z-index: 1;
        }

        .glow-card:hover .glow-overlay {
          opacity: 1;
        }

        .bracket {
          position: absolute;
          width: 16px;
          height: 16px;
          border-color: transparent;
          border-style: solid;
          border-width: 0;
          transition: border-color 0.3s ease, width 0.3s ease, height 0.3s ease;
          z-index: 2;
          pointer-events: none;
        }

        .bracket-tl {
          top: -1px;
          left: -1px;
          border-top-width: 1px;
          border-left-width: 1px;
        }
        .bracket-tr {
          top: -1px;
          right: -1px;
          border-top-width: 1px;
          border-right-width: 1px;
        }
        .bracket-bl {
          bottom: -1px;
          left: -1px;
          border-bottom-width: 1px;
          border-left-width: 1px;
        }
        .bracket-br {
          bottom: -1px;
          right: -1px;
          border-bottom-width: 1px;
          border-right-width: 1px;
        }

        .glow-card:hover .bracket {
          border-color: var(--accent);
          width: 24px;
          height: 24px;
        }
      `}</style>
    </div>
  );
}
