import { NextRequest, NextResponse } from "next/server"
import { getApiBase } from "../../../_lib/apiBase"

const API_BASE = getApiBase()

export async function GET(
  req: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  if (!API_BASE) return NextResponse.json({ error: "Missing API_BASE_URL" }, { status: 500 })
  const params = await Promise.resolve(context.params)
  const backendRes = await fetch(`${API_BASE}/chat/threads/${params.id}`, {
    method: "GET",
    headers: { cookie: req.headers.get("cookie") || "" },
    cache: "no-store",
  })
  const data = await backendRes.json().catch(() => ({}))
  return NextResponse.json(data, { status: backendRes.status })
}

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  if (!API_BASE) return NextResponse.json({ error: "Missing API_BASE_URL" }, { status: 500 })
  const params = await Promise.resolve(context.params)
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

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  if (!API_BASE) return NextResponse.json({ error: "Missing API_BASE_URL" }, { status: 500 })
  const params = await Promise.resolve(context.params)
  const backendRes = await fetch(`${API_BASE}/chat/threads/${params.id}`, {
    method: "DELETE",
    headers: { cookie: req.headers.get("cookie") || "" },
    cache: "no-store",
  })
  const data = await backendRes.json().catch(() => ({}))
  return NextResponse.json(data, { status: backendRes.status })
}
