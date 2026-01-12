import Link from "next/link"
import Image from "next/image"
import { headers } from "next/headers"

type GalleryImage = {
  url: string
  name: string
  createdAt?: string | null
}

const ALT_KEYWORDS: Array<{ re: RegExp; label: string }> = [
  { re: /fitness|workout|gym/i, label: "YouTube thumbnail for fitness channel" },
  { re: /podcast|interview|talk/i, label: "Podcast cover thumbnail" },
  { re: /gaming|game|esports/i, label: "Gaming YouTube thumbnail" },
  { re: /finance|money|invest|crypto|stock/i, label: "YouTube thumbnail for finance channel" },
  { re: /travel|vlog|adventure/i, label: "Travel vlog YouTube thumbnail" },
  { re: /tech|ai|software|app/i, label: "Tech YouTube thumbnail design" },
  { re: /food|recipe|cook/i, label: "Food recipe YouTube thumbnail" },
  { re: /business|startup|marketing/i, label: "YouTube thumbnail for business channel" },
  { re: /education|tutorial|how-to|learn/i, label: "How-to tutorial YouTube thumbnail" },
]

function galleryAlt(name: string, fallback: string) {
  const base = name.split("/").pop() || ""
  const cleaned = base.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").trim()
  const match = ALT_KEYWORDS.find((item) => item.re.test(cleaned))
  const label = match?.label ?? "AI YouTube thumbnail example"
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

export default async function GalleryPage() {
  const gallery = await fetchGallery(200)
  const error = gallery === null ? "Unable to load gallery right now." : null

  return (
    <main className="min-h-screen bg-[#050709] text-white">
      <nav className="sticky top-0 z-20 border-b border-white/10 bg-[#050709]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 overflow-hidden rounded-lg ring-1 ring-white/10 bg-white/5">
              <Image src="/logo.svg" alt="ThumbGenius logo" width={32} height={32} className="h-full w-full object-contain" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">ThumbGenius</span>
          </Link>
          <div className="flex items-center gap-3 text-sm text-white/70">
            <Link href="/studio" className="hover:text-white">Open studio</Link>
            <Link href="/auth" className="hover:text-white">Sign in</Link>
          </div>
        </div>
      </nav>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-emerald-300">Gallery</p>
              <h1 className="text-3xl font-semibold">Community thumbnails</h1>
              <p className="mt-2 max-w-2xl text-white/65">
                A live feed of the latest renders coming out of ThumbGenius.
              </p>
            </div>
            <Link href="/" className="text-emerald-300 hover:text-emerald-200">
              Back to home &rarr;
            </Link>
          </div>

          {error ? (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
              {error}
            </div>
          ) : null}

          {!error && (gallery ?? []).length === 0 ? (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-sm text-white/70">
              No images yet. Check back soon.
            </div>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(gallery ?? []).map((img, idx) => (
                <div
                  key={`${img.name}-${idx}`}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-black/30"
                >
                  <Image
                    src={img.url}
                    alt={galleryAlt(img.name, `image ${idx + 1}`)}
                    width={640}
                    height={360}
                    quality={70}
                    loading="lazy"
                    sizes="(max-width: 1024px) 90vw, 480px"
                    className="h-60 w-full object-contain"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
