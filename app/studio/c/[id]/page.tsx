"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { useChatStore } from "@/components/chat/ChatStore"
import { ThumbnailChat } from "@/components/thumbnail/thumbnail-chat"

export default function ChatPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params?.id
  const { setActive, loadThread } = useChatStore()

  React.useEffect(() => {
    if (!id) return
    setActive(id)
    loadThread(id).catch(() => router.replace("/studio"))
  }, [id, setActive, loadThread, router])

  if (!id) return null
  return <ThumbnailChat />
}
