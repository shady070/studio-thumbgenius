import { NextResponse } from "next/server"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || ""

function passSetCookie(backendRes: Response, nextRes: NextResponse) {
  // @ts-ignore
  const setCookies: string[] | undefined = backendRes.headers.getSetCookie?.()
  const cookies = setCookies?.length
    ? setCookies
    : (() => {
        const single = backendRes.headers.get("set-cookie")
        return single ? [single] : []
      })()

  for (const c of cookies) {
    nextRes.headers.append("Set-Cookie", c)
  }
}

export async function POST(req: Request) {
  if (!API_BASE) {
    return NextResponse.json({ ok: false, error: "Missing NEXT_PUBLIC_API_BASE_URL" }, { status: 500 })
  }

  const body = await req.json().catch(() => ({}))

  const backendRes = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
    credentials: "include",
  })

  const data = await backendRes.json().catch(() => ({}))
  const nextRes = NextResponse.json(data, { status: backendRes.status })

  // ✅ this makes cookies appear on localhost:3000
  passSetCookie(backendRes, nextRes)

  return nextRes
}
