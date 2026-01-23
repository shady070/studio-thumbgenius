import { NextResponse, type NextRequest } from "next/server"
import { getApiBase } from "../../../_lib/apiBase"

const API_BASE = getApiBase()

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!API_BASE) return NextResponse.json({ ok: false, error: "Missing API_BASE_URL" }, { status: 500 })

  const cookie = req.headers.get("cookie") ?? ""
  const { id } = await context.params
  const backendRes = await fetch(`${API_BASE}/admin/users/${id}`, {
    method: "GET",
    headers: { Cookie: cookie },
    cache: "no-store",
    credentials: "include",
  })

  const data = await backendRes.json().catch(() => ({}))
  return NextResponse.json(data, { status: backendRes.status })
}
