import { NextResponse } from "next/server"
import { getApiBase } from "../../_lib/apiBase"

const API_BASE = getApiBase()

export async function POST(req: Request) {
  if (!API_BASE) return NextResponse.json({ error: "Missing API_BASE_URL" }, { status: 500 })
  const formData = await req.formData()
  const backendRes = await fetch(`${API_BASE}/personas/upload`, {
    method: "POST",
    headers: { cookie: req.headers.get("cookie") || "" },
    body: formData,
    cache: "no-store",
  })
  const data = await backendRes.json().catch(() => ({}))
  return NextResponse.json(data, { status: backendRes.status })
}
