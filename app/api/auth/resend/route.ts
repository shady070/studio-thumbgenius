import { NextResponse } from "next/server"
import { getApiBase } from "../../_lib/apiBase"

const API_BASE = getApiBase()

export async function POST(req: Request) {
  if (!API_BASE) return NextResponse.json({ ok: false, error: "Missing API_BASE_URL" }, { status: 500 })
  const body = await req.json().catch(() => ({}))
  const backendRes = await fetch(`${API_BASE}/auth/resend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  })
  const data = await backendRes.json().catch(() => ({}))
  return NextResponse.json(data, { status: backendRes.status })
}
