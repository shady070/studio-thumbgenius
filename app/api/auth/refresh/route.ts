import { NextResponse } from "next/server"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_BASE_URL

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
  if (!API_BASE) {
    return NextResponse.json({ ok: false, error: "Missing NEXT_PUBLIC_API_BASE_URL" }, { status: 500 })
  }

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
