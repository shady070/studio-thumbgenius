import { NextRequest, NextResponse } from "next/server"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || ""

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!API_BASE) return NextResponse.json({ error: "Missing API base" }, { status: 500 })
  const backendRes = await fetch(`${API_BASE}/chat/threads/${params.id}`, {
    method: "GET",
    headers: { cookie: req.headers.get("cookie") || "" },
    cache: "no-store",
  })
  const data = await backendRes.json().catch(() => ({}))
  return NextResponse.json(data, { status: backendRes.status })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!API_BASE) return NextResponse.json({ error: "Missing API base" }, { status: 500 })
  const body = await req.json().catch(() => ({}))
  const backendRes = await fetch(`${API_BASE}/chat/threads/${params.id}`, {
    method: "PATCH",
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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!API_BASE) return NextResponse.json({ error: "Missing API base" }, { status: 500 })
  const backendRes = await fetch(`${API_BASE}/chat/threads/${params.id}`, {
    method: "DELETE",
    headers: { cookie: req.headers.get("cookie") || "" },
    cache: "no-store",
  })
  const data = await backendRes.json().catch(() => ({}))
  return NextResponse.json(data, { status: backendRes.status })
}
