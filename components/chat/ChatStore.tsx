"use client"

import * as React from "react"
import type { ChatMsg, Mode } from "@/components/thumbnail/types"

export type ChatThread = {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  mode: Mode
  messages: ChatMsg[]
}

/** exported because ThumbnailChat imports it */
export function defaultTitle() {
  return "New Chat"
}

type StartEditResult = {
  analysis: {
    visibleText?: string[]
    mainSubject?: string
    subjectType?: string
    style?: string
    mood?: string
  }
  originalPrompt: string
}

type ChatStoreApi = {
  apiBase: string

  threads: ChatThread[]
  activeId: string | null
  activeThread: ChatThread | null

  creditsLeft: number | null
  refreshCredits: () => Promise<void>
  enhancePrompt: (threadId: string, text: string) => Promise<string>
  generateTitles: (threadId: string, idea: string) => Promise<string[]>

  getThreadById: (id: string) => ChatThread | null
  setActive: (id: string) => void

  refreshThreads: () => Promise<void>
  loadThread: (id: string) => Promise<void>

  createThread: (opts?: { title?: string; mode?: Mode }) => Promise<string>
  renameThread: (id: string, title: string) => Promise<void>
  deleteThread: (id: string) => Promise<void>

  setThreadMode: (id: string, mode: Mode) => Promise<void>
  setThreadMessages: (id: string, messages: ChatMsg[]) => void

  sendPrompt: (threadId: string, text: string, meta?: any) => Promise<void>

  oneClickFix: (threadId: string, assistantMessageId: string) => Promise<void>

  /** ✅ NEW: edit flow */
  startEdit: (threadId: string, assistantMessageId: string) => Promise<StartEditResult>
  commitEdit: (
    threadId: string,
    payload: {
      assistantMessageId: string
      replaceText?: string | null
      replaceSubject?: string | null
      extra?: string | null
      personaName?: string | null
      styleName?: string | null
    }
  ) => Promise<void>
}

const ChatStoreCtx = React.createContext<ChatStoreApi | null>(null)

function mapThread(t: any): ChatThread {
  return {
    id: t.id,
    title: t.title ?? defaultTitle(),
    mode: (t.mode ?? "prompt") as Mode,
    createdAt: new Date(t.createdAt).getTime(),
    updatedAt: new Date(t.updatedAt).getTime(),
    messages: [],
  }
}

function mapMsg(m: any): ChatMsg {
  return {
    id: m.id,
    role: m.role,
    kind: m.kind ?? undefined,
    text: m.text ?? undefined,
    imageUrl: m.imageUrl ?? undefined,
    score: m.score ?? undefined,
    status: m.status ?? "done",
    progress: m.progress ?? 100,
    meta: m.metaJson ?? undefined,
    createdAt: new Date(m.createdAt).getTime(),
    promptId: m.id,
  } as any
}

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    credentials: "include",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg =
      (Array.isArray(data?.message) ? data.message.join(", ") : data?.message) ||
      data?.error ||
      `Request failed (${res.status})`
    throw new Error(msg)
  }
  return data as T
}

export function ChatStoreProvider({ children }: { children: React.ReactNode }) {
  const apiBase = "" // use Next.js API proxies
  const apiUrl = (path: string) => `${apiBase}${path}`

  const [threads, setThreads] = React.useState<ChatThread[]>([])
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [creditsLeft, setCreditsLeft] = React.useState<number | null>(null)

  const activeThread = React.useMemo(
    () => threads.find((t) => t.id === activeId) ?? null,
    [threads, activeId]
  )

  const getThreadById = React.useCallback(
    (id: string) => threads.find((t) => t.id === id) ?? null,
    [threads]
  )

  const setActive = React.useCallback((id: string) => setActiveId(id), [])

  const refreshCredits = React.useCallback(async () => {
    const me = await jsonFetch<any>(apiUrl("/api/auth/me"), { method: "GET" })
    const c =
      (typeof me?.creditsLeft === "number" ? me.creditsLeft : undefined) ??
      (typeof me?.user?.creditsLeft === "number" ? me.user.creditsLeft : undefined)

    if (typeof c === "number") setCreditsLeft(c)
  }, [apiBase])

  const refreshThreads = React.useCallback(async () => {
    const data = await jsonFetch<{ threads: any[] }>(apiUrl("/api/chat/threads"), { method: "GET" })
    const next = (data.threads ?? []).map(mapThread)

    setThreads((prev) => {
      // preserve already-loaded messages for threads we already have
      const withMessages = new Map(prev.map((t) => [t.id, t.messages]))
      return next.map((t) => ({
        ...t,
        messages: withMessages.get(t.id) ?? [],
      }))
    })
    setActiveId((cur) => (cur && next.some((t) => t.id === cur) ? cur : cur))
  }, [apiBase])

  React.useEffect(() => {
    refreshThreads().catch(() => {})
    const onFocus = () => refreshThreads().catch(() => {})
    window.addEventListener("focus", onFocus)
    return () => window.removeEventListener("focus", onFocus)
  }, [refreshThreads])

  const loadThread = React.useCallback(
    async (id: string) => {
      const data = await jsonFetch<{ thread: any }>(apiUrl(`/api/chat/threads/${id}`), { method: "GET" })
      const t = data.thread
      const msgs = (t.messages ?? []).map(mapMsg)

      setThreads((prev) => {
        const nextThread: ChatThread = {
          id: t.id,
          title: t.title ?? defaultTitle(),
          mode: (t.mode ?? "prompt") as Mode,
          createdAt: new Date(t.createdAt).getTime(),
          updatedAt: new Date(t.updatedAt).getTime(),
          messages: msgs,
        }
        const exists = prev.some((x) => x.id === id)
        return exists ? prev.map((x) => (x.id === id ? nextThread : x)) : [nextThread, ...prev]
      })
    },
    [apiBase]
  )

  const createThread = React.useCallback(
    async (opts?: { title?: string; mode?: Mode }) => {
      const data = await jsonFetch<{ thread: any }>(apiUrl("/api/chat/threads"), {
        method: "POST",
        body: JSON.stringify({
          title: opts?.title,
          mode: opts?.mode,
        }),
      })

      const thread = mapThread(data.thread)
      setThreads((prev) => [thread, ...prev])
      setActiveId(thread.id)
      return thread.id
    },
    [apiBase]
  )

  const renameThread = React.useCallback(
    async (id: string, title: string) => {
      const nextTitle = title.trim() || defaultTitle()

      const data = await jsonFetch<{ thread: any }>(apiUrl(`/api/chat/threads/${id}`), {
        method: "PATCH",
        body: JSON.stringify({ title: nextTitle }),
      })

      setThreads((prev) =>
        prev.map((t) => (t.id === id ? { ...t, title: data.thread.title, updatedAt: Date.now() } : t))
      )
    },
    [apiBase]
  )

  const deleteThread = React.useCallback(
    async (id: string) => {
      await jsonFetch(apiUrl(`/api/chat/threads/${id}`), { method: "DELETE" })

      setThreads((prev) => prev.filter((t) => t.id !== id))
      setActiveId((cur) => (cur === id ? null : cur))
    },
    [apiBase]
  )

  const setThreadMode = React.useCallback(
    async (id: string, mode: Mode) => {
      const data = await jsonFetch<{ thread: any }>(apiUrl(`/api/chat/threads/${id}`), {
        method: "PATCH",
        body: JSON.stringify({ mode }),
      })

      setThreads((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, mode: (data.thread.mode ?? mode) as Mode, updatedAt: Date.now() } : t
        )
      )
    },
    [apiBase]
  )

  const setThreadMessages = React.useCallback((id: string, messages: ChatMsg[]) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, messages, updatedAt: Date.now() } : t))
    )
  }, [])

  const enhancePrompt = React.useCallback(
    async (threadId: string, text: string) => {
      const cleaned = (text ?? "").trim()
      if (!cleaned) throw new Error("Empty prompt")

      const data = await jsonFetch<{ prompt: string; creditsLeft?: number }>(
        apiUrl(`/api/chat/threads/${threadId}/enhance`),
        {
          method: "POST",
          body: JSON.stringify({ text: cleaned }),
        }
      )
      if (typeof data?.creditsLeft === "number") setCreditsLeft(data.creditsLeft)
      return data.prompt
    },
    [apiBase]
  )

  const generateTitles = React.useCallback(
    async (threadId: string, idea: string) => {
      const cleaned = (idea ?? "").trim()
      if (!cleaned) throw new Error("Empty idea")

      const data = await jsonFetch<{ titles: string[]; creditsLeft?: number }>(
        apiUrl(`/api/chat/threads/${threadId}/titles`),
        {
          method: "POST",
          body: JSON.stringify({ idea: cleaned }),
        }
      )
      if (typeof data?.creditsLeft === "number") setCreditsLeft(data.creditsLeft)
      return data.titles ?? []
    },
    [apiBase]
  )

  const sendPrompt = React.useCallback(
    async (threadId: string, text: string, meta?: any) => {
      const cleaned = (text ?? "").trim()
      if (!cleaned) throw new Error("Empty prompt")

      const now = Date.now()
      const tempU = `temp_u_${now}`
      const tempA = `temp_a_${now}`

      // optimistic UI
      setThreads((prev) =>
        prev.map((t) =>
          t.id === threadId
            ? {
                ...t,
                updatedAt: now,
                messages: [
                  ...(t.messages ?? []),
                  { id: tempU, role: "user", text: cleaned, createdAt: now, meta } as any,
                  {
                    id: tempA,
                    role: "assistant",
                    kind: "image",
                    status: "generating",
                    progress: 0,
                    createdAt: now + 1,
                    meta,
                  } as any,
                ],
              }
            : t
        )
      )

      try {
        const data = await jsonFetch<any>(apiUrl(`/api/chat/threads/${threadId}/prompt`), {
          method: "POST",
          body: JSON.stringify({ text: cleaned, meta }),
        })

        if (typeof data?.creditsLeft === "number") setCreditsLeft(data.creditsLeft)

        const userMsg = mapMsg(data.userMsg)
        const asstMsg = mapMsg(data.assistantMsg)

        setThreads((prev) =>
          prev.map((t) =>
            t.id === threadId
              ? {
                  ...t,
                  updatedAt: Date.now(),
                  messages: (t.messages ?? [])
                    .filter((m: any) => m.id !== tempU && m.id !== tempA)
                    .concat([userMsg, asstMsg]),
                }
              : t
          )
        )

        refreshThreads().catch(() => {})
      } catch (e) {
        // rollback optimistic
        setThreads((prev) =>
          prev.map((t) =>
            t.id === threadId
              ? { ...t, messages: (t.messages ?? []).filter((m: any) => m.id !== tempU && m.id !== tempA) }
              : t
          )
        )
        throw e
      }
    },
    [apiBase, refreshThreads]
  )

  const oneClickFix = React.useCallback(
    async (_threadId: string, _assistantMessageId: string) => {},
    []
  )

  /** ✅ NEW: start edit (OCR + subject detection) */
  const startEdit = React.useCallback(
    async (_threadId: string, _assistantMessageId: string) =>
      ({
        analysis: {},
        originalPrompt: "",
      } as StartEditResult),
    []
  )

  /** ✅ NEW: commit edit (auto-generate edited image, appends messages) */
  const commitEdit = React.useCallback(
    async (
      _threadId: string,
      _payload: {
        assistantMessageId: string
        replaceText?: string | null
        replaceSubject?: string | null
        extra?: string | null
        personaName?: string | null
        styleName?: string | null
      }
    ) => {},
    []
  )

  const api: ChatStoreApi = {
    apiBase,
    threads,
    activeId,
    activeThread,
    creditsLeft,
    refreshCredits,
    enhancePrompt,
    generateTitles,
    getThreadById,
    setActive,
    refreshThreads,
    loadThread,
    createThread,
    renameThread,
    deleteThread,
    setThreadMode,
    setThreadMessages,
    sendPrompt,
    oneClickFix,
    startEdit,
    commitEdit,
  }

  return <ChatStoreCtx.Provider value={api}>{children}</ChatStoreCtx.Provider>
}

export function useChatStore() {
  const ctx = React.useContext(ChatStoreCtx)
  if (!ctx) throw new Error("useChatStore must be used inside ChatStoreProvider")
  return ctx
}
