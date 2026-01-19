// app/page.tsx (Landing Page) — SEO-optimized version
// Notes:
// - Adds semantic headings, internal links, FAQ, breadcrumbs, schema (FAQ + WebPage + BreadcrumbList)
// - Improves copy for target keywords + long-tail intent
// - Adds keyword-rich but natural alt text + captions
// - Keeps your UI/design intact

import Link from "next/link"
import Image from "next/image"
import Script from "next/script"
import { headers } from "next/headers"

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
  "test-2.png",
  "test-1.png",
  "test.png",
]

const workflows = [
  {
    title: "Remake any YouTube thumbnail",
    desc: "Paste a YouTube link or upload a thumbnail. Swap faces, rewrite text, match style, and regenerate variants fast.",
    cta: "Remake now",
    href: "/studio?mode=remake",
  },
  {
    title: "Face-perfect personas",
    desc: "Lock identity across renders so every thumbnail matches your host, talent, or creator persona consistently.",
    cta: "Create persona",
    href: "/studio?mode=persona",
  },
  {
    title: "Instant thumbnail analysis",
    desc: "OCR + element detection so you know what to fix (headline, contrast, clutter, subject) before spending credits.",
    cta: "Analyze thumbnail",
    href: "/studio?mode=analyze",
  },
  {
    title: "AI prompt enhancer",
    desc: "Turn messy prompts into high-converting thumbnail briefs. Get clearer composition, headline, and emotion instantly.",
    cta: "Enhance prompt",
    href: "/studio?mode=prompt",
  },
]

const steps = [
  {
    title: "Analyze the thumbnail",
    desc: "Upload or link a thumbnail. We extract text (OCR), elements, subject, and style so you know exactly what’s wrong.",
  },
  {
    title: "Fix packaging + message",
    desc: "Rewrite the hook text, clean up clutter, swap faces with a persona, and choose a stronger background mood.",
  },
  {
    title: "Generate high-CTR variants",
    desc: "Remake from reference or create net-new thumbnails with your persona baked in—optimized for clicks and clarity.",
  },
  {
    title: "Iterate and download",
    desc: "Preview, download, and keep history in threads. Credits are tracked automatically so you can ship faster.",
  },
]

const plans = [
  {
    name: "Premium",
    price: "$9.99 / mo",
    highlight: "500 credits monthly",
    features: [
      "Generate + Remake thumbnails",
      "Persona face swap",
      "Analyze + OCR",
      "Prompt enhancer",
      "Title generator",
      "Recreate from YouTube link",
      "Top-up credits anytime",
      "Priority rendering",
    ],
    cta: "Start premium",
  },
]

type GalleryImage = {
  url: string
  name: string
  createdAt?: string | null
}

const ALT_KEYWORDS: Array<{ re: RegExp; label: string }> = [
  { re: /fitness|workout|gym/i, label: "YouTube thumbnail for fitness channel" },
  { re: /podcast|interview|talk/i, label: "podcast YouTube thumbnail design" },
  { re: /gaming|game|esports/i, label: "gaming YouTube thumbnail" },
  { re: /finance|money|invest|crypto|stock/i, label: "finance YouTube thumbnail" },
  { re: /travel|vlog|adventure/i, label: "travel vlog YouTube thumbnail" },
  { re: /tech|ai|software|app/i, label: "tech YouTube thumbnail design" },
  { re: /food|recipe|cook/i, label: "food recipe YouTube thumbnail" },
  { re: /business|startup|marketing/i, label: "business YouTube thumbnail" },
  { re: /education|tutorial|how-to|learn/i, label: "how-to tutorial YouTube thumbnail" },
]

function galleryAlt(name: string, fallback: string) {
  const base = name.split("/").pop() || ""
  const cleaned = base.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").trim()
  const match = ALT_KEYWORDS.find((item) => item.re.test(cleaned))
  const label = match?.label ?? fallback ?? "AI YouTube thumbnail example"
  const suffix = cleaned ? ` - ${cleaned}` : ""
  return `ThumbGenius ${label}${suffix}`.trim()
}

async function fetchGallery(limit: number): Promise<GalleryImage[] | null> {
  const headerList = await headers()
  const host = headerList.get("host")
  const proto = headerList.get("x-forwarded-proto") || "http"
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_FRONTEND_URL ||
    (host ? `${proto}://${host}` : "http://localhost:3000")
  try {
    const res = await fetch(`${origin}/api/gallery?limit=${limit}`, { cache: "no-store" })
    if (!res.ok) return null
    const data = await res.json()
    return Array.isArray(data?.images) ? (data.images as GalleryImage[]) : []
  } catch {
    return null
  }
}

export const dynamic = "force-dynamic"

export default async function LandingPage() {
  const gallery = await fetchGallery(5)
  const galleryError = gallery === null ? "Unable to load latest thumbnails right now." : null
  const galleryItems = (gallery ?? []).slice(0, 5)

  // JSON-LD: WebPage + Breadcrumb + FAQ (helps rich results / “People also ask”)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Free AI YouTube Thumbnail Maker | ThumbGenius",
        url: "https://thumbgenius.art/",
        description:
          "ThumbGenius is a free AI YouTube thumbnail maker to generate, edit, analyze, and remake thumbnails fast—no Photoshop required.",
        isPartOf: {
          "@type": "WebSite",
          name: "ThumbGenius",
          url: "https://thumbgenius.art/",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://thumbgenius.art/",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How do I create a YouTube thumbnail with AI?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Upload a thumbnail or paste a YouTube link, then use ThumbGenius to analyze the design (OCR + elements), rewrite the headline, swap faces with personas, and generate high-CTR variants in seconds.",
            },
          },
          {
            "@type": "Question",
            name: "Is ThumbGenius a free YouTube thumbnail maker?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. You can start free with credits and create thumbnails without a credit card. Upgrading unlocks more monthly credits and priority rendering.",
            },
          },
          {
            "@type": "Question",
            name: "Can I remake an existing YouTube thumbnail?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. ThumbGenius can remake thumbnails from a reference image or YouTube link—keeping the style while improving clarity, text, and subject focus.",
            },
          },
          {
            "@type": "Question",
            name: "What makes a high-CTR YouTube thumbnail?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "High-CTR thumbnails usually have one clear subject, strong contrast, a short readable headline, and an emotion or outcome-focused message. ThumbGenius helps you identify and fix these quickly.",
            },
          },
        ],
      },
    ],
  }

  return (
    <main className="min-h-screen bg-[#050709] text-white">
      <Script
        id="jsonld-landing"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="sticky top-0 z-20 border-b border-white/10 bg-[#050709]/80 backdrop-blur" aria-label="Primary">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2" aria-label="ThumbGenius home">
            <div className="h-8 w-8 overflow-hidden rounded-lg ring-1 ring-white/10 bg-white/5">
              <Image src="/logo.svg" alt="ThumbGenius logo" width={32} height={32} className="h-full w-full object-contain" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">ThumbGenius</span>
          </Link>

          <div className="hidden items-center gap-5 text-sm text-white/70 md:flex">
            <a href="#workflow" className="hover:text-white">
              Workflow
            </a>
            <a href="#how" className="hover:text-white">
              How it works
            </a>
            <a href="#examples" className="hover:text-white">
              Examples
            </a>
            <a href="#pricing" className="hover:text-white">
              Pricing
            </a>
            <a href="#faq" className="hover:text-white">
              FAQ
            </a>
            <a href="#cta" className="hover:text-white">
              Get started
            </a>
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

      <header
        id="hero"
        className="relative overflow-hidden bg-gradient-to-b from-emerald-600/20 via-[#0a0f14] to-[#050709] px-4 pb-16 pt-20"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.25),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.2),transparent_45%)]" />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center text-center">
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-wide text-emerald-200">
            Free AI YouTube Thumbnail Maker
          </div>

          {/* SEO: One clear H1 for the page */}
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Create <span className="text-emerald-400">high-CTR</span> YouTube thumbnails with AI in seconds.
          </h1>

          <p className="mt-4 max-w-2xl text-base text-white/70 sm:text-lg">
            Generate, edit, analyze, and remake thumbnails with face-perfect personas, OCR-aware text extraction, and fast
            iterations. Start with 100 free credits—no credit card required.
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

          {/* Samples carousel */}
          <div className="mt-12 w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 py-4" aria-label="Thumbnail examples carousel">
            <div className="flex w-max items-center gap-4 px-4" style={{ animation: "marquee 40s linear infinite" }}>
              {[...sampleImages, ...sampleImages].map((name, i) => {
                const url = `/landing-samples/${encodeURIComponent(name)}`
                return (
                  <figure
                    key={`${name}-${i}`}
                    className="h-52 w-80 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10"
                  >
                    <Image
                      src={url}
                      alt={`AI YouTube thumbnail example ${i + 1} made with ThumbGenius`}
                      width={640}
                      height={360}
                      quality={70}
                      loading="lazy"
                      sizes="(max-width: 768px) 70vw, 320px"
                      className="h-full w-full object-contain"
                    />
                    <figcaption className="sr-only">Example YouTube thumbnail design created using AI</figcaption>
                  </figure>
                )
              })}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/70" aria-label="Product stats">
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
      </header>

      <section id="workflow" className="relative bg-[#050709] px-4 py-16" aria-labelledby="workflow-title">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-emerald-300">Workflow</p>
              <h2 id="workflow-title" className="text-3xl font-semibold">
                Fix YouTube thumbnail packaging instantly
              </h2>
              <p className="mt-2 max-w-2xl text-white/65">
                Four core workflows to analyze, repair, remake, and iterate thumbnails with AI—plus credit tracking built
                in.
              </p>
            </div>
            <Link href="/studio" className="text-emerald-300 hover:text-emerald-200">
              Open studio &rarr;
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {workflows.map((w, i) => (
              <Link
                key={i}
                href={w.href}
                className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-black/40 p-5 hover:border-emerald-400/40"
                aria-label={w.title}
              >
                <div className="text-lg font-semibold text-white">{w.title}</div>
                <p className="mt-2 text-sm text-white/65">{w.desc}</p>
                <div className="mt-4 flex justify-between text-xs text-emerald-300">
                  <span className="group-hover:text-emerald-200">{w.cta}</span>
                  <span>&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="relative bg-gradient-to-b from-[#050709] to-[#0a1016] px-4 py-16" aria-labelledby="how-title">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-widest text-emerald-300">How it works</p>
          <h2 id="how-title" className="text-3xl font-semibold text-white">
            Make thumbnails that get clicked (without Photoshop)
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <article key={i} className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <div className="flex items-center gap-2 text-emerald-300">
                  <span className="text-sm">Step {i + 1}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </div>
                <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-white/65">{s.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="examples" className="relative bg-[#050709] px-4 py-16" aria-labelledby="examples-title">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-emerald-300">Examples</p>
              <h2 id="examples-title" className="text-3xl font-semibold">
                Latest AI thumbnail creations
              </h2>
              <p className="mt-2 max-w-2xl text-white/65">
                Real thumbnail examples generated and remade with ThumbGenius. Use them as inspiration for high-CTR
                layouts.
              </p>
            </div>
            <Link href="/gallery" className="text-sm text-emerald-300 hover:text-emerald-200">
              View full gallery &rarr;
            </Link>
          </div>

          {galleryError ? (
            <p className="mt-6 text-sm text-white/60">{galleryError}</p>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {galleryItems.map((img, idx) => (
                <figure
                  key={`${img.url}-${idx}`}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 ring-1 ring-white/10"
                >
                  <Image
                    src={img.url}
                    alt={galleryAlt(img.name, "AI YouTube thumbnail example")}
                    width={640}
                    height={360}
                    quality={75}
                    loading="lazy"
                    sizes="(max-width: 768px) 45vw, 220px"
                    className="h-full w-full object-cover"
                  />
                  <figcaption className="px-3 py-2 text-xs text-white/60">
                    AI YouTube thumbnail example
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="pricing" className="relative bg-[#050709] px-4 py-16" aria-labelledby="pricing-title">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs uppercase tracking-widest text-emerald-300">Pricing</p>
          <h2 id="pricing-title" className="text-3xl font-semibold text-white">
            Start free. Upgrade when you want more thumbnails.
          </h2>
          <p className="mt-3 text-sm text-white/70">
            Get 100 free credits to test generation, remixing, and analysis. Premium adds monthly credits and priority
            rendering.
          </p>

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

      {/* SEO: FAQ section matches schema above */}
      <section id="faq" className="relative bg-gradient-to-b from-[#050709] to-[#0a1016] px-4 py-16" aria-labelledby="faq-title">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs uppercase tracking-widest text-emerald-300">FAQ</p>
          <h2 id="faq-title" className="text-3xl font-semibold text-white">
            YouTube thumbnail maker questions
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              {
                q: "How do I make a YouTube thumbnail that gets clicks?",
                a: "Keep one clear subject, increase contrast, use a short headline that stays readable on mobile, and show emotion or outcome. ThumbGenius helps you analyze and remake thumbnails into high-CTR variants fast.",
              },
              {
                q: "Can I remake an existing thumbnail from a YouTube link?",
                a: "Yes. Paste a YouTube link or upload a thumbnail to remake it while improving clarity, text, and subject focus.",
              },
              {
                q: "Does ThumbGenius work without Photoshop?",
                a: "Yes. You can generate and edit thumbnails directly in the studio—no design software required.",
              },
              {
                q: "What are personas and why do they matter?",
                a: "Personas help you keep the same face/identity across thumbnails, so your channel looks consistent and recognizable.",
              },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-black/40 p-5">
                <h3 className="text-base font-semibold text-white">{item.q}</h3>
                <p className="mt-2 text-sm text-white/65">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="cta"
        className="relative overflow-hidden bg-gradient-to-r from-emerald-600/20 via-[#0a1016] to-[#050709] px-4 py-14"
        aria-labelledby="cta-title"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(16,185,129,0.2),transparent_40%)]" />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
          <h2 id="cta-title" className="text-3xl font-semibold text-white">
            Ship thumbnails that get clicked.
          </h2>
          <p className="max-w-2xl text-sm text-white/70">
            Start without a credit card, get 100 free credits, and try the full workflow before you upgrade.
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

          {/* SEO: internal links to important pages */}
          <p className="mt-4 text-xs text-white/50">
            Learn more:{" "}
            <Link href="/gallery" className="text-emerald-300 hover:text-emerald-200">
              Gallery
            </Link>{" "}
            •{" "}
            <Link href="/blog" className="text-emerald-300 hover:text-emerald-200">
              Blog
            </Link>{" "}
            •{" "}
            <Link href="/studio" className="text-emerald-300 hover:text-emerald-200">
              Studio
            </Link>
          </p>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#050709] px-4 py-10" aria-label="Footer">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 overflow-hidden rounded-lg ring-1 ring-white/10 bg-white/5">
              <Image src="/logo.svg" alt="ThumbGenius logo" width={36} height={36} className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="text-sm font-semibold">ThumbGenius</div>
              <div className="text-xs text-white/50">Contact: malikx029squaddie@gmail.com</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>
            <a href="#hero" className="hover:text-white">
              Back to top
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
