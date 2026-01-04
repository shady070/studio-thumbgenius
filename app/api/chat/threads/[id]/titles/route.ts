import { NextRequest, NextResponse } from "next/server"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || ""

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!API_BASE) return NextResponse.json({ error: "Missing API base" }, { status: 500 })
  const body = await req.json().catch(() => ({}))
  const backendRes = await fetch(`${API_BASE}/chat/threads/${params.id}/titles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: req.headers.get("cookie") || "",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  })
  const data = await backendRes.json().catch(() => ({}))
  return NextResponse.json(data, { status: backendRes.status })
}
