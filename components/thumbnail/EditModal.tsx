"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

export function EditModal({
  open,
  onOpenChange,
  imageUrl,
  detectedText,
  detectedSubject,
  onApply,
  busy,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  imageUrl: string
  detectedText: string[]
  detectedSubject: string
  onApply: (args: { replaceText?: string; replaceSubject?: string; extra?: string }) => void
  busy: boolean
}) {
  const [replaceText, setReplaceText] = React.useState("")
  const [replaceSubject, setReplaceSubject] = React.useState("")
  const [extra, setExtra] = React.useState("")

  React.useEffect(() => {
    if (!open) return
    // prefill
    setReplaceText(detectedText?.[0] ? detectedText[0] : "")
    setReplaceSubject("")
    setExtra("")
  }, [open, detectedText])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl border-white/10 bg-[#0e0e12] text-white">
        <DialogHeader>
          <DialogTitle>Edit Thumbnail</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl ring-1 ring-white/10 overflow-hidden bg-black/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="edit" className="w-full" />
          </div>

          <div className="space-y-3">
            <div className="text-xs text-white/60">Detected text</div>
            <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
              {detectedText?.length ? (
                <ul className="list-disc pl-4 text-sm text-white/85 space-y-1">
                  {detectedText.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-white/60">No text detected.</div>
              )}
            </div>

            <div className="text-xs text-white/60">Main subject</div>
            <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10 text-sm text-white/85">
              {detectedSubject || "Unknown"}
            </div>

            <div className="text-xs text-white/60">Replace headline text with</div>
            <Input
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              placeholder='e.g. "THIS CHANGED EVERYTHING"'
              className="border-white/10 bg-black/40 text-white"
            />

            <div className="text-xs text-white/60">Replace subject with</div>
            <Input
              value={replaceSubject}
              onChange={(e) => setReplaceSubject(e.target.value)}
              placeholder='e.g. "Elon Musk", "a cute cat", "a shocked gamer"'
              className="border-white/10 bg-black/40 text-white"
            />

            <div className="text-xs text-white/60">Extra instruction</div>
            <Textarea
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              placeholder="Optional: change colors, add glow, improve readability, etc."
              className="min-h-[110px] resize-none border-white/10 bg-black/40 text-white"
            />

            <Button
              disabled={busy}
              onClick={() =>
                onApply({
                  replaceText: replaceText.trim() || undefined,
                  replaceSubject: replaceSubject.trim() || undefined,
                  extra: extra.trim() || undefined,
                })
              }
              className="w-full bg-emerald-500 text-black hover:bg-emerald-400"
            >
              {busy ? "Applying…" : "Apply Edit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
