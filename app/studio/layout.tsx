"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { FloatingSidebarTrigger } from "@/components/floating-sidebar-trigger"
import { ChatStoreProvider } from "@/components/chat/ChatStore"

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  // Client-side guard: auth + entitlement
  useEffect(() => {
    const check = async () => {
      try {
        const meRes = await fetch("/api/auth/me", { credentials: "include" })
        if (!meRes.ok) return router.replace("/auth")
        const entRes = await fetch("/api/billing/entitlement", { credentials: "include" })
        if (!entRes.ok) return router.replace("/account")
        const entJson = await entRes.json().catch(() => ({}))
        const ent = entJson?.entitlement
        const blocked = ["canceled", "expired", "unpaid", "past_due"]
        const active = ent && !blocked.includes((ent.status || "").toLowerCase())
        if (!active) return router.replace("/account")
        setReady(true)
      } catch {
        router.replace("/auth")
      }
    }
    check()
  }, [router])

  if (!ready) return null

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
