import { NextResponse } from "next/server"
import { getApiBase } from "../_lib/apiBase"

const API_BASE = getApiBase()

export async function GET(req: Request) {
  if (!API_BASE) return NextResponse.json({ error: "Missing API_BASE_URL" }, { status: 500 })
  const backendRes = await fetch(`${API_BASE}/personas`, {
    method: "GET",
    headers: { cookie: req.headers.get("cookie") || "" },
    cache: "no-store",
  })
  const data = await backendRes.json().catch(() => ({}))
  return NextResponse.json(data, { status: backendRes.status })
}
