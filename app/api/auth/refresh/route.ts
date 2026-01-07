import { NextResponse } from "next/server"
import { getApiBase } from "../../_lib/apiBase"

const API_BASE = getApiBase()

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
    const rewritten = c.replace(/; *Domain=[^;]+/gi, "")
    nextRes.headers.append("Set-Cookie", rewritten)
  }
}

export async function POST(req: Request) {
  if (!API_BASE) return NextResponse.json({ ok: false, error: "Missing API_BASE_URL" }, { status: 500 })

  const backendRes = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { cookie: req.headers.get("cookie") || "" },
    cache: "no-store",
  })

  const data = await backendRes.json().catch(() => ({}))
  const nextRes = NextResponse.json(data, { status: backendRes.status })
  passSetCookie(backendRes, nextRes)
  return nextRes
}
