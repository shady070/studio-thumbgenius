import { redirect } from "next/navigation"
import { cookies } from "next/headers"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { FloatingSidebarTrigger } from "@/components/floating-sidebar-trigger"
import { ChatStoreProvider } from "@/components/chat/ChatStore"

async function cookieHeaderFromRequest() {
  const jar = await cookies()
  const all = jar.getAll()
  return all.map((c) => `${c.name}=${c.value}`).join("; ")
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieHeader = await cookieHeaderFromRequest()

  const host = (await import("next/headers")).headers().get("host")
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_FRONTEND_URL ||
    (host ? `https://${host}` : "")

  if (!origin) {
    redirect("/auth")
  }

  const callMe = async () =>
    fetch(`${origin}/api/auth/me`, {
      method: "GET",
      cache: "no-store",
      headers: { cookie: cookieHeader },
    })

  let res = await callMe()
  if (!res.ok) {
    await fetch(`${origin}/api/auth/refresh`, {
      method: "POST",
      cache: "no-store",
      headers: { cookie: cookieHeader },
    }).catch(() => {})
    res = await callMe()
  }

  if (!res.ok) redirect("/auth")

  // Require active entitlement before accessing studio
  const entRes = await fetch(`${origin}/api/billing/entitlement`, {
    method: "GET",
    cache: "no-store",
    headers: { cookie: cookieHeader },
  }).catch(() => null)
  const entJson = entRes ? await entRes.json().catch(() => ({})) : {}
  const ent = entJson?.entitlement
  const blockedStatuses = ["canceled", "expired", "unpaid", "past_due"]
  const active = ent && !blockedStatuses.includes((ent.status || "").toLowerCase())
  if (!active) {
    redirect("/account")
  }

  return (
    <ChatStoreProvider>
      <SidebarProvider defaultOpen>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1">{children}</main>
        </div>

        {/* Shows ONLY when collapsed */}
        <FloatingSidebarTrigger />
      </SidebarProvider>
    </ChatStoreProvider>
  )
}
