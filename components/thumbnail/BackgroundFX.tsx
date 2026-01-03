"use client"

import * as React from "react"

export function BackgroundFX() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.32]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.18) 2px, transparent 2px)",
          backgroundSize: "32px 32px",
          backgroundPosition:
            "calc(var(--mx) * 0.02) calc(var(--my) * 0.02)",
          maskImage:
            "radial-gradient(1000px 600px at 50% 35%, black 60%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(1000px 600px at 50% 35%, black 60%, transparent 100%)",
        }}
      />

      <div className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay">
        <div className="absolute inset-0 animate-[grain_6s_steps(6)_infinite] bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22600%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22600%22 height=%22600%22 filter=%22url(%23n)%22 opacity=%220.45%22/%3E%3C/svg%3E')]" />
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(520px 420px at var(--mx) var(--my), rgba(16,185,129,0.16), transparent 60%)",
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[340px] bg-[radial-gradient(900px_320px_at_50%_100%,rgba(16,185,129,0.18),transparent_70%)]" />

      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_160px_rgba(0,0,0,0.9)]" />

      <style jsx global>{`
        @keyframes grain {
          0% {
            transform: translate(0px, 0px);
          }
          20% {
            transform: translate(-10px, 8px);
          }
          40% {
            transform: translate(12px, -6px);
          }
          60% {
            transform: translate(-8px, -10px);
          }
          80% {
            transform: translate(14px, 10px);
          }
          100% {
            transform: translate(0px, 0px);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-40%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </>
  )
}
