import { NextResponse } from "next/server"
import { getApiBase } from "../../_lib/apiBase"

const API_BASE = getApiBase()

export async function GET(req: Request) {
  if (!API_BASE) return NextResponse.json({ ok: false, error: "Missing API_BASE_URL" }, { status: 500 })

  const cookie = req.headers.get("cookie") ?? ""
  const { searchParams } = new URL(req.url)
  const limit = searchParams.get("limit") || ""
  const cursor = searchParams.get("cursor") || ""

  const qs = new URLSearchParams()
  if (limit) qs.set("limit", limit)
  if (cursor) qs.set("cursor", cursor)

  const backendRes = await fetch(`${API_BASE}/admin/users?${qs.toString()}`, {
    method: "GET",
    headers: { Cookie: cookie },
    cache: "no-store",
    credentials: "include",
  })

  const data = await backendRes.json().catch(() => ({}))
  return NextResponse.json(data, { status: backendRes.status })
}
