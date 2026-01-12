import { NextResponse } from "next/server"

const SUPABASE_URL = process.env.SUPABASE_URL || ""
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const SUPABASE_THUMBNAILS_BUCKET =
  process.env.SUPABASE_THUMBNAILS_BUCKET ||
  process.env.SUPABASE_BUCKET ||
  "thumbnails"

function encodePath(path: string) {
  return path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")
}

const IMAGE_EXT = /\.(png|jpe?g|webp|gif)$/i

function isImageName(name: string) {
  return IMAGE_EXT.test(name)
}

export async function GET(request: Request) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ images: [] }, { status: 200 })
  }

  const url = new URL(request.url)
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || "60"), 1), 200)

  try {
    const listPrefix = async (prefix: string, max: number) => {
      const listUrl = `${SUPABASE_URL}/storage/v1/object/list/${encodeURIComponent(
        SUPABASE_THUMBNAILS_BUCKET
      )}`
      const res = await fetch(listUrl, {
        method: "POST",
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prefix,
          limit: max,
          offset: 0,
          sortBy: { column: "created_at", order: "desc" },
        }),
        cache: "no-store",
      })
      if (!res.ok) return []
      return (await res.json()) as Array<{ name: string; created_at?: string | null }>
    }

    const images: Array<{ name: string; createdAt: string | null; url: string }> = []
    const queue: Array<{ prefix: string; depth: number }> = [{ prefix: "", depth: 0 }]
    const maxDepth = 2

    while (queue.length && images.length < limit) {
      const current = queue.shift()
      if (!current) break
      const rows = await listPrefix(current.prefix, limit)
      for (const row of rows) {
        if (!row?.name) continue
        const name = row.name
        const fullPath = current.prefix ? `${current.prefix}${name}` : name
        if (isImageName(name)) {
          images.push({
            name: fullPath,
            createdAt: row.created_at ?? null,
            url: `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_THUMBNAILS_BUCKET}/${encodePath(fullPath)}`,
          })
          if (images.length >= limit) break
        } else if (current.depth < maxDepth) {
          queue.push({ prefix: `${fullPath}/`, depth: current.depth + 1 })
        }
      }
    }

    return NextResponse.json({ images: images.slice(0, limit) }, { status: 200 })
  } catch {
    return NextResponse.json({ images: [] }, { status: 200 })
  }
}
