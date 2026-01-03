import { NextResponse } from "next/server"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_BASE_URL

function passSetCookie(backendRes: Response, nextRes: NextResponse) {
  // @ts-ignore
  const setCookies: string[] | undefined = backendRes.headers.getSetCookie?.()
  if (setCookies?.length) {
    for (const c of setCookies) nextRes.headers.append("Set-Cookie", c)
  } else {
    const single = backendRes.headers.get("set-cookie")
    if (single) nextRes.headers.set("Set-Cookie", single)
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
