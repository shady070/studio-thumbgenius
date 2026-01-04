"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { FloatingSidebarTrigger } from "@/components/floating-sidebar-trigger"
import { ChatStoreProvider } from "@/components/chat/ChatStore"

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  // Client-side guard: if not logged in, /api/auth/me will 401 and we send to /auth
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" })
        if (!res.ok) {
          router.replace("/auth")
        }
      } catch {
        router.replace("/auth")
      }
    }
    check()
  }, [router])

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
