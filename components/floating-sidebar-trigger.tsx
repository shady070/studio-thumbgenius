"use client"

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"

export function FloatingSidebarTrigger() {
  const { state } = useSidebar()

  if (state !== "collapsed") return null

  return (
    <div className="fixed left-3 top-3 z-50">
      <SidebarTrigger className="h-11 w-11 rounded-2xl bg-black/50 text-white/80 ring-1 ring-white/10 backdrop-blur-xl hover:bg-black/65 hover:text-white hover:ring-emerald-500/20" />
    </div>
  )
}
