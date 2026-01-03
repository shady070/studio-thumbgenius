"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useChatStore } from "@/components/chat/ChatStore"
import { BackgroundFX } from "@/components/thumbnail/BackgroundFX"

export default function StudioIndexPage() {
  const router = useRouter()
  const { refreshThreads, threads } = useChatStore()
  const [tipIndex, setTipIndex] = React.useState(0)
  const tips = React.useMemo(
    () => [
      "Tip: Add a persona to keep faces consistent across thumbnails.",
      "Tip: Use Remake with a YouTube URL to iterate on existing thumbnails.",
      "Tip: Enhance your prompt for 4 credits to get clearer, cinematic results.",
      "Tip: Analyze first to see text/elements before editing.",
    ],
    []
  )

  React.useEffect(() => {
    refreshThreads().catch(() => {})
  }, [refreshThreads])

  React.useEffect(() => {
    if (threads.length > 0) {
      router.replace(`/studio/c/${threads[0].id}`)
    }
  }, [threads, router])

  React.useEffect(() => {
    const id = setInterval(() => {
      setTipIndex((i) => (i + 1) % tips.length)
    }, 3500)
    return () => clearInterval(id)
  }, [tips.length])

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#0b0b0d] text-white">
      <BackgroundFX />
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 text-center">
        <div className="text-3xl font-semibold text-white">No chats yet</div>
        <p className="text-sm text-white/70">
          Click “New chat” to start generating, remaking, or analyzing thumbnails.
        </p>
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-emerald-200">
          {tips[tipIndex]}
        </div>
      </div>
    </div>
  )
}
