"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"

import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"

import { ChatTopbar } from "@/components/ChatTopbar"
import { BackgroundFX } from "./BackgroundFX"
import { TopMiniBar } from "./TopMiniBar"
import { EmptyState, EditEmptyState, TitleEmptyState } from "./EmptyStates"
import { Composer } from "./Composer"
import { MessageList } from "./MessageList"

import { CREDITS, ChatMsg, Mode, Persona, Style } from "./types"
import { uid } from "./fakeJobs"

import { defaultTitle, useChatStore } from "@/components/chat/ChatStore"
import { EditModal } from "./EditModal"

function toAutoTitle(text: string) {
  const t = text.replace(/\s+/g, " ").trim()
  if (!t) return defaultTitle()
  return t.length > 42 ? t.slice(0, 42).trimEnd() + "…" : t
}

export function ThumbnailChat() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const urlId = params?.id

  const {
    creditsLeft,
    refreshCredits,
    oneClickFix,
    startEdit,
    commitEdit,
    enhancePrompt,
    generateTitles,

    getThreadById,
    setActive,
    activeThread,
    renameThread,
    setThreadMessages,
    setThreadMode,
    loadThread,
    sendPrompt,
  } = useChatStore()

  // refresh credits on mount (best effort)
  React.useEffect(() => {
    refreshCredits().catch(() => {})
  }, [refreshCredits])

  // Load thread from backend (no creation here)
  React.useEffect(() => {
    if (!urlId) return
    let cancelled = false

    ;(async () => {
      const exists = getThreadById(urlId)
      if (exists) {
        setActive(urlId)
        if ((exists.messages?.length ?? 0) === 0) await loadThread(urlId).catch(() => {})
        return
      }

      try {
        await loadThread(urlId)
        if (!cancelled) setActive(urlId)
      } catch {
        if (!cancelled) router.replace("/studio")
      }
    })()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlId])

  const threadId = activeThread?.id ?? null
  const msgs: ChatMsg[] = activeThread?.messages ?? []
  const mode: Mode = activeThread?.mode ?? "prompt"

  const [input, setInput] = React.useState("")
  const [titleIdea, setTitleIdea] = React.useState("")
  const [mouse, setMouse] = React.useState({ x: 0, y: 0 })
  const [analyzeTitle, setAnalyzeTitle] = React.useState("")
  const [analyzeYoutubeUrl, setAnalyzeYoutubeUrl] = React.useState("")
  const [enhanceBusy, setEnhanceBusy] = React.useState(false)
  const [uiError, setUiError] = React.useState<string | null>(null)
  const errorTimerRef = React.useRef<number | null>(null)

  const [persona, setPersona] = React.useState<Persona | null>(null)
  const [personaMode, setPersonaMode] = React.useState<"face" | "full">("face")
  const [style, setStyle] = React.useState<Style | null>(null)

  const [fullOpen, setFullOpen] = React.useState(false)
  const [fullUrl, setFullUrl] = React.useState<string | null>(null)
  const [remakeOpen, setRemakeOpen] = React.useState(false)
  const [remakeYoutube, setRemakeYoutube] = React.useState("")
  const [remakePrompt, setRemakePrompt] = React.useState("")
  const [remakeImageName, setRemakeImageName] = React.useState("")
  const remakeImageDataUrl = React.useRef<string | null>(null)

  // ✅ EDIT MODAL STATE
  const [editOpen, setEditOpen] = React.useState(false)
  const [editBusy, setEditBusy] = React.useState(false)
  const [editMsgId, setEditMsgId] = React.useState<string | null>(null)
  const [editImageUrl, setEditImageUrl] = React.useState<string>("")
  const [detectedText, setDetectedText] = React.useState<string[]>([])
  const [detectedSubject, setDetectedSubject] = React.useState<string>("")

  const viewportRef = React.useRef<HTMLDivElement | null>(null)
  const scrollViewportRef = React.useRef<HTMLDivElement | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const uploadIntent = React.useRef<"remakeDialog" | null>(null)

  React.useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
    el.addEventListener("mousemove", onMove)
    return () => el.removeEventListener("mousemove", onMove)
  }, [])

  React.useEffect(() => {
    const el = scrollViewportRef.current
    if (!el) return
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight
    })
  }, [msgs])

  const pushError = React.useCallback((message: string) => {
    setUiError(message)
    if (errorTimerRef.current) window.clearTimeout(errorTimerRef.current)
    errorTimerRef.current = window.setTimeout(() => setUiError(null), 5000)
  }, [])

  const openFull = (url: string) => {
    setFullUrl(url)
    setFullOpen(true)
  }

  const setMsgsForThread = (next: ChatMsg[]) => {
    if (!threadId) return
    setThreadMessages(threadId, next)
  }

  const onRemake = () => setRemakeOpen(true)

  const onChangeMode = (m: Mode) => {
    if (!threadId) return
    setThreadMode(threadId, m)
  }

  const send = async () => {
    const text = input.trim()
    if (!text) return
    if (!threadId) return

    setInput("")

    // best-effort rename on first prompt
    if (activeThread && activeThread.title === defaultTitle() && msgs.length === 0) {
      try {
        await renameThread(threadId, toAutoTitle(text))
      } catch {
        await loadThread(threadId).catch(() => {})
      }
    }

    try {
      await sendPrompt(threadId, text, {
        personaId: persona?.id ?? null,
        personaMode,
        styleId: style?.id ?? null,
        mode,
      })
      refreshCredits().catch(() => {})
    } catch (e: any) {
      if (String(e?.message || "").toLowerCase().includes("thread not found")) {
        await loadThread(threadId).catch(() => {})
        await sendPrompt(threadId, text, {
          personaId: persona?.id ?? null,
          personaMode,
          styleId: style?.id ?? null,
          mode,
        })
        refreshCredits().catch(() => {})
        return
      }
      pushError(e?.message || "Failed to send prompt.")
    }
  }

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const fr = new FileReader()
      fr.onload = () => resolve(String(fr.result))
      fr.onerror = reject
      fr.readAsDataURL(file)
    })

  const doAnalyze = async () => {
    if (!threadId) return
    const youtube = analyzeYoutubeUrl.trim()
    if (!youtube) {
      pushError("Add a YouTube URL first.")
      return
    }
    const payloadMeta: any = {
      mode: "analyze",
      youtubeUrl: youtube || undefined,
      title: analyzeTitle || input || undefined,
    }
    try {
      await sendPrompt(threadId, input.trim() || "Analyze thumbnail", payloadMeta)
      refreshCredits().catch(() => {})
    } catch (err: any) {
      pushError(err?.message || "Analyze failed")
    }
  }

  const doRemakeYoutube = async (urlOverride?: string) => {
    if (!threadId) return
    const youtube = (urlOverride ?? analyzeYoutubeUrl).trim()
    if (!youtube) {
      pushError("Enter a YouTube URL to remake.")
      return
    }
    const promptText = remakePrompt.trim() || input.trim() || "Remake this thumbnail"
    try {
      await sendPrompt(threadId, promptText, {
        youtubeUrl: youtube,
        personaId: persona?.id ?? null,
        personaMode,
      })
      refreshCredits().catch(() => {})
    } catch (err: any) {
      pushError(err?.message || "Remake failed")
    }
  }

  const doRemakeWithImage = async (dataUrl: string) => {
    if (!threadId) return
    if (!dataUrl) {
      pushError("Upload an image to remake.")
      return
    }
    const promptText = remakePrompt.trim() || input.trim() || "Remake this thumbnail"
    try {
      await sendPrompt(threadId, promptText, {
        recreate: true,
        imageUrl: dataUrl,
        personaId: persona?.id ?? null,
        personaMode,
      })
      refreshCredits().catch(() => {})
    } catch (err: any) {
      pushError(err?.message || "Remake failed")
    }
  }

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await readFileAsDataUrl(file)
    const intent = uploadIntent.current
    uploadIntent.current = null
    e.target.value = ""
    if (intent === "remakeDialog") {
      remakeImageDataUrl.current = dataUrl
      setRemakeImageName(file.name)
    }
  }

  const onOneClickFix = async (assistantMessageId: string) => {
    if (!threadId) return
    await oneClickFix(threadId, assistantMessageId)
    refreshCredits().catch(() => {})
  }

  // ✅ OPEN EDIT: runs OCR/subject detection
  const openEdit = async (assistantMessageId: string) => {
    if (!threadId) return
    const msg = msgs.find((m) => m.id === assistantMessageId)
    if (!msg || !("imageUrl" in msg) || !msg.imageUrl) return

    setEditMsgId(assistantMessageId)
    setEditImageUrl(msg.imageUrl as string)
    setDetectedText([])
    setDetectedSubject("")
    setEditOpen(true)

    try {
      const res = await startEdit(threadId, assistantMessageId)
      setDetectedText(res.analysis?.visibleText ?? [])
      setDetectedSubject(res.analysis?.mainSubject ?? "")
    } catch {
      // keep modal open but without detections
      setDetectedText([])
      setDetectedSubject("")
    }
  }

  // ✅ APPLY EDIT: commits edit and generates new image automatically
  const applyEdit = async (args: { replaceText?: string; replaceSubject?: string; extra?: string }) => {
    if (!threadId || !editMsgId) return
    setEditBusy(true)
    try {
      await commitEdit(threadId, {
        assistantMessageId: editMsgId,
        replaceText: args.replaceText ?? null,
        replaceSubject: args.replaceSubject ?? null,
        extra: args.extra ?? null,
        // later: wire persona/style names from pickers if you want
        personaName: persona?.name ?? null,
        styleName: style?.name ?? null,
      })
      setEditOpen(false)
      refreshCredits().catch(() => {})
    } finally {
      setEditBusy(false)
    }
  }

  const generateTitlesHandler = async () => {
    if (!threadId) return
    const idea = titleIdea.trim()
    if (!idea) return

    if (activeThread && activeThread.title === defaultTitle() && msgs.length === 0) {
      try {
        await renameThread(threadId, toAutoTitle(idea))
      } catch {}
    }

    setTitleIdea("")
    const now = Date.now()
    const tempUserId = uid()
    const tempBotId = uid()
    const promptId = uid()

    const userMsg: ChatMsg = {
      id: tempUserId,
      role: "user",
      text: idea,
      createdAt: now,
      meta: { mode: "title" },
    }

    const botMsg: ChatMsg = {
      id: tempBotId,
      role: "assistant",
      promptId,
      status: "generating",
      progress: 0,
      createdAt: now + 1,
      kind: "titles",
      titles: [],
    }

    setMsgsForThread([...msgs, userMsg, botMsg])

    try {
      const titles = await generateTitles(threadId, idea)
      const rows = titles.map((t) => ({ id: uid(), text: t }))
      setMsgsForThread(
        [...msgs, userMsg, { ...botMsg, status: "done", progress: 100, titles: rows }]
      )
      refreshCredits().catch(() => {})
    } catch (err) {
      setMsgsForThread(msgs) // rollback
      pushError((err as any)?.message || "Failed to generate titles")
    }
  }

  const onEnhancePrompt = async () => {
    if (!threadId) return
    const base = input.trim()
    if (!base) {
      pushError("Enter a prompt to enhance.")
      return
    }
    setEnhanceBusy(true)
    try {
      const improved = await enhancePrompt(threadId, base)
      setInput(improved)
      refreshCredits().catch(() => {})
    } catch (err: any) {
      pushError(err?.message || "Enhance failed")
    } finally {
      setEnhanceBusy(false)
    }
  }

  return (
    <TooltipProvider>
      <div
        ref={viewportRef}
        className="relative min-h-screen w-full overflow-hidden bg-[#0b0b0d] text-white"
        style={{ ["--mx" as any]: `${mouse.x}px`, ["--my" as any]: `${mouse.y}px` } as React.CSSProperties}
      >
        <BackgroundFX />

        <div className="relative mx-auto flex h-screen w-full max-w-6xl flex-col px-4 py-4">
          <TopMiniBar creditsLeft={creditsLeft ?? 0} />

          <Card className="flex-1 overflow-hidden rounded-3xl border-white/10 bg-black/10 p-0 backdrop-blur-30">
            <div className="grid h-full grid-rows-[auto_1fr_auto]">
              <ChatTopbar mode={mode} setMode={onChangeMode} onRemake={onRemake} creditsRemake={CREDITS.remake} />

              <div ref={scrollViewportRef} className="chat-scroll min-h-0 overflow-y-auto px-5 py-5 pr-3">
                {uiError ? (
                  <div className="mb-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
                    {uiError}
                  </div>
                ) : null}
                {msgs.length === 0 ? (
                  mode === "prompt" ? (
                    <EmptyState />
                  ) : mode === "edit" ? (
                    <EditEmptyState />
                  ) : mode === "title" ? (
                    <TitleEmptyState />
                  ) : null
                ) : (
                  <MessageList
                    msgs={msgs}
                    openFull={openFull}
                    onOneClickFix={onOneClickFix}
                    onEditImage={openEdit}
                  />
                )}
              </div>

              <Composer
                mode={mode}
                persona={persona}
                setPersona={setPersona}
                personaMode={personaMode}
                setPersonaMode={setPersonaMode}
                style={style}
              setStyle={setStyle}
              input={input}
              setInput={setInput}
              onSend={send}
              titleIdea={titleIdea}
              setTitleIdea={setTitleIdea}
              onGenerateTitles={generateTitlesHandler}
              analyzeTitle={analyzeTitle}
                setAnalyzeTitle={setAnalyzeTitle}
                analyzeYoutubeUrl={analyzeYoutubeUrl}
                setAnalyzeYoutubeUrl={setAnalyzeYoutubeUrl}
              onAnalyze={() => doAnalyze()}
              onEnhance={onEnhancePrompt}
              enhanceLoading={enhanceBusy}
            />
            </div>
          </Card>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />

        <Dialog open={fullOpen} onOpenChange={setFullOpen}>
          <DialogContent className="max-w-6xl border-white/10 bg-[#0e0e12] text-white">
            <DialogHeader>
              <DialogTitle>Preview</DialogTitle>
            </DialogHeader>
            {fullUrl ? (
              <img
                src={fullUrl}
                alt="full preview"
                className="mx-auto max-h-[80vh] w-auto rounded-xl ring-1 ring-white/10"
              />
            ) : null}
          </DialogContent>
        </Dialog>

        <Dialog open={remakeOpen} onOpenChange={setRemakeOpen}>
          <DialogContent className="max-w-md border-white/10 bg-[#0e0e12] text-white">
            <DialogHeader>
              <DialogTitle>Remake thumbnail</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-white/60">What should change? (prompt)</label>
                <textarea
                  className="w-full rounded-xl bg-white/5 px-3 py-2 text-sm text-white ring-1 ring-white/10 outline-none"
                  rows={3}
                  value={remakePrompt}
                  onChange={(e) => setRemakePrompt(e.target.value)}
                  placeholder="Describe the edits you want"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-white/60">YouTube URL (optional)</label>
                <input
                  className="w-full rounded-xl bg-white/5 px-3 py-2 text-sm text-white ring-1 ring-white/10 outline-none"
                  value={remakeYoutube}
                  onChange={(e) => setRemakeYoutube(e.target.value)}
                  placeholder="https://youtu.be/..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-white/60">Or upload image</label>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white/5 text-white/80 ring-1 ring-white/10 hover:bg-white/10"
                  onClick={() => {
                    uploadIntent.current = "remakeDialog"
                    fileInputRef.current?.click()
                  }}
                >
                  {remakeImageName || "Choose image"}
                </Button>
              </div>
              <p className="text-xs text-white/50">
                Remake uses persona selection from Prompt mode. Leave YouTube URL empty if using the uploaded image.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setRemakeOpen(false)} className="text-white/70">
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    if (remakeYoutube.trim()) {
                      await doRemakeYoutube(remakeYoutube)
                      setRemakeOpen(false)
                      return
                    }
                    if (remakeImageDataUrl.current) {
                      await doRemakeWithImage(remakeImageDataUrl.current)
                      setRemakeOpen(false)
                      return
                    }
                    pushError("Add a YouTube URL or upload an image.")
                  }}
                  className="bg-emerald-500 text-black hover:bg-emerald-400"
                >
                  Remake
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* ✅ EDIT MODAL */}
        <EditModal
          open={editOpen}
          onOpenChange={setEditOpen}
          imageUrl={editImageUrl}
          detectedText={detectedText}
          detectedSubject={detectedSubject}
          onApply={applyEdit}
          busy={editBusy}
        />
      </div>
    </TooltipProvider>
  )
}
