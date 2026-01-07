"use client"

import Link from "next/link"

const sampleImages = [
  "1-01 (1).png",
  "1-01 (2).png",
  "1-01 (3).png",
  "1-01 (4).png",
  "1-01 (6).png",
  "1-01 (7).png",
  "1-01 (8).png",
  "1-01 (9).png",
  "1-01 (10).png",
  "1-01 (11).png",
  "1-01 (12).png",
]

const workflows = [
  { title: "Remake any thumbnail", desc: "Paste a YouTube link or upload. Swap faces, rewrite text, match style.", cta: "Remake now" },
  { title: "Face-perfect personas", desc: "Lock identity across renders so every thumbnail matches your talent.", cta: "Create persona" },
  { title: "Instant analysis", desc: "OCR, elements, and subject detection so you know what to fix before you spend credits.", cta: "Analyze thumbnail" },
  { title: "Prompt enhancer", desc: "Rewrite prompts into high-converting thumbnail briefs in one tap.", cta: "Enhance prompt" },
]

const steps = [
  { title: "Analyze", desc: "Upload or link a thumbnail. We extract text, elements, subject, and style." },
  { title: "Fix", desc: "Rewrite the text, swap faces with a persona, and set the background mood." },
  { title: "Generate", desc: "Remake from reference or create net-new thumbnails with your persona baked in." },
  { title: "Iterate", desc: "Preview, download, and keep history in threads. Credits tracked automatically." },
]

const plans = [
  {
    name: "Premium",
    price: "$9.99 / mo",
    highlight: "500 credits monthly",
    features: [
      "Generate + Remake",
      "Persona face swap",
      "Analyze + OCR",
      "Prompt enhancer",
      "Title generator",
      "Recreate from YouTube",
      "Top-up credits anytime",
      "Priority rendering",
    ],
    cta: "Start premium",
  },
]

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#050709] text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-20 border-b border-white/10 bg-[#050709]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 overflow-hidden rounded-lg ring-1 ring-white/10 bg-white/5">
              <img src="/logo.svg" alt="ThumbGenius logo" className="h-full w-full object-contain" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">ThumbGenius</span>
          </Link>
          <div className="hidden items-center gap-5 text-sm text-white/70 md:flex">
            <a href="#workflow" className="hover:text-white">Workflow</a>
            <a href="#how" className="hover:text-white">How it works</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
            <a href="#cta" className="hover:text-white">Get started</a>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/auth"
              className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-black shadow-lg shadow-emerald-500/30 hover:bg-emerald-400"
            >
              Start free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section
        id="hero"
        className="relative overflow-hidden bg-gradient-to-b from-emerald-600/20 via-[#0a0f14] to-[#050709] px-4 pb-16 pt-20"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.25),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.2),transparent_45%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center text-center">
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-wide text-emerald-200">
            ThumbGenius • AI Thumbnail Lab
          </div>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            The shortcut to <span className="text-emerald-400">high-click</span> thumbnails.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/70 sm:text-lg">
            Analyze, fix, and remake YouTube thumbnails with face-perfect personas, OCR-aware text, and DashScope edits.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/auth"
              className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-emerald-500/30 hover:bg-emerald-400"
            >
              Start for free
            </Link>
            <Link
              href="/studio"
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/80 hover:border-emerald-400 hover:text-white"
            >
              Open studio
            </Link>
          </div>
          <div className="mt-12 w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 py-4">
            <div
              className="flex w-max items-center gap-4 px-4"
              style={{ animation: "marquee 40s linear infinite" }}
            >
              {[...sampleImages, ...sampleImages].map((name, i) => {
                const url = `/landing-samples/${encodeURIComponent(name)}`
                return (
                  <div
                    key={`${name}-${i}`}
                    className="h-52 w-80 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10"
                  >
                    <img src={url} alt="Thumbnail sample" className="h-full w-full object-contain" />
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-emerald-400">2.1M+</span> images generated
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-emerald-400">1.7B+</span> views influenced
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Persona-safe face swapping
            </div>
          </div>
        </div>
      </section>

      {/* Workflows */}
      <section id="workflow" className="relative bg-[#050709] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-emerald-300">Workflow</p>
              <h2 className="text-3xl font-semibold">Fix packaging instantly</h2>
              <p className="mt-2 max-w-2xl text-white/65">
                Four core flows to analyze, repair, remake, and iterate thumbnails with credit tracking built in.
              </p>
            </div>
            <Link href="/studio" className="text-emerald-300 hover:text-emerald-200">
              Open studio →
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {workflows.map((w, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-black/40 p-5">
                <div className="text-lg font-semibold text-white">{w.title}</div>
                <p className="mt-2 text-sm text-white/65">{w.desc}</p>
                <div className="mt-4 flex justify-between text-xs text-emerald-300">
                  <span>{w.cta}</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section id="how" className="relative bg-gradient-to-b from-[#050709] to-[#0a1016] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-widest text-emerald-300">How it works</p>
          <h3 className="text-3xl font-semibold text-white">Turn broken thumbnails into winners</h3>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <div className="flex items-center gap-2 text-emerald-300">
                  <span className="text-sm">Step {i + 1}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </div>
                <div className="mt-2 text-lg font-semibold">{s.title}</div>
                <p className="mt-2 text-sm text-white/65">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="pricing" className="relative bg-[#050709] px-4 py-16">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs uppercase tracking-widest text-emerald-300">Pricing</p>
          <h3 className="text-3xl font-semibold text-white">Start with a free trial, scale when you’re ready</h3>
          <div className="mt-10 grid gap-4 md:grid-cols-1">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-black/50 p-5 text-left"
              >
                <div className="text-sm uppercase tracking-wide text-emerald-300">{plan.name}</div>
                <div className="mt-1 text-2xl font-semibold">{plan.price}</div>
                <div className="mt-1 text-xs text-emerald-200">{plan.highlight}</div>
                <ul className="mt-4 space-y-2 text-sm text-white/70">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth"
                  className="mt-6 inline-flex w-full justify-center rounded-full border border-emerald-400 bg-emerald-500 px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-emerald-500/30 hover:bg-emerald-400"
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="relative overflow-hidden bg-gradient-to-r from-emerald-600/20 via-[#0a1016] to-[#050709] px-4 py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(16,185,129,0.2),transparent_40%)]" />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
          <h4 className="text-3xl font-semibold text-white">Ship thumbnails that get clicked.</h4>
          <p className="max-w-2xl text-sm text-white/70">
            Personas for face-perfect swaps, DashScope edits, OCR-aware text rewriting, and credits that stay in sync.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/auth"
              className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-emerald-500/30 hover:bg-emerald-400"
            >
              Start free
            </Link>
            <Link
              href="/studio"
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/80 hover:border-emerald-400 hover:text-white"
            >
              Open studio
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#050709] px-4 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 overflow-hidden rounded-lg ring-1 ring-white/10 bg-white/5">
              <img src="/logo.svg" alt="ThumbGenius logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="text-sm font-semibold">ThumbGenius</div>
              <div className="text-xs text-white/50">Contact: malikx029squaddie@gmail.com</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            <a href="#hero" className="hover:text-white">Back to top</a>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </main>
  )
}
