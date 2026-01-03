import { NextResponse } from "next/server"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export async function GET(req: Request) {
  if (!API_BASE) {
    return NextResponse.json({ ok: false, error: "Missing NEXT_PUBLIC_API_BASE_URL" }, { status: 500 })
  }

  const cookie = req.headers.get("cookie") ?? ""

  const backendRes = await fetch(`${API_BASE}/auth/me`, {
    method: "GET",
    headers: { Cookie: cookie },
    cache: "no-store",
  })

  const data = await backendRes.json().catch(() => ({}))
  return NextResponse.json(data, { status: backendRes.status })
}
