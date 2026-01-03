"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Wand2, Pencil, SplitSquareVertical, RotateCcw, Maximize2, Loader2, Download } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const DEFAULT_CREDITS = {
  fix: 8,
  edit: 10,
  compare: 2,
  redo: 10,
} as const

function CreditTooltip({
  credits,
  label,
  children,
}: {
  credits: number
  label: string
  children: React.ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="border-white/10 bg-[#0e0e12] text-white">
        <div className="text-xs">
          <span className="font-semibold">{label}</span>
          {credits > 0 ? <> • {credits} credits</> : null}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

function MiniIconButton({
  children,
  title,
  credits,
  onClick,
  disabled,
}: {
  children: React.ReactNode
  title: string
  credits: number
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <CreditTooltip credits={credits} label={title + " (coming soon)"}>
      <button
        type="button"
        title={title}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "grid h-9 w-9 place-items-center rounded-full bg-white/5 text-white/85 ring-1 ring-white/10 transition",
          "hover:bg-emerald-500/10 hover:ring-emerald-500/20",
          disabled && "cursor-not-allowed opacity-50 hover:bg-white/5 hover:ring-white/10"
        )}
      >
        {children}
      </button>
    </CreditTooltip>
  )
}

export function ImageBubble({
  url,
  score,
  onFull,
  onFix,
  onCompare,
  onRedo,
  onDownload,
  credits = DEFAULT_CREDITS,
}: {
  url: string
  score: number
  onFull: () => void
  onFix: () => void | Promise<void>
  onCompare: () => void
  onRedo: () => void
  onDownload?: () => void
  credits?: { fix: number; edit: number; compare: number; redo: number }
}) {
  const [busy, setBusy] = React.useState<null | "fix" | "edit" | "compare" | "redo">(null)

  const run = async (kind: NonNullable<typeof busy>, fn: () => void | Promise<void>) => {
    if (busy) return
    setBusy(kind)
    try {
      await fn()
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="space-y-2">
      <div className="group relative w-[560px] max-w-full overflow-hidden rounded-2xl ring-1 ring-white/10">
        <div className="absolute right-3 top-3 z-10 opacity-0 transition group-hover:opacity-100">
          <CreditTooltip credits={0} label="Full preview">
            <button
              type="button"
              onClick={onFull}
              className="grid h-9 w-9 place-items-center rounded-full bg-black/55 text-white ring-1 ring-white/10 backdrop-blur hover:bg-black/70"
              title="Full preview"
              disabled={!!busy}
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </CreditTooltip>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="generated" className="w-full" />

        <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full bg-black/55 px-2 py-2 ring-1 ring-white/10 backdrop-blur">
            <MiniIconButton
              credits={credits.fix}
              title="One-Click Fix"
              disabled={true}
              onClick={() => {}}
            >
              <Wand2 className="h-4 w-4" />
            </MiniIconButton>

            <MiniIconButton
              credits={credits.compare}
              title="Compare"
              disabled={true}
              onClick={() => {}}
            >
              <SplitSquareVertical className="h-4 w-4" />
            </MiniIconButton>

            <MiniIconButton
              credits={credits.redo}
              title="Redo"
              disabled={true}
              onClick={() => {}}
            >
              <RotateCcw className="h-4 w-4" />
            </MiniIconButton>

            <CreditTooltip credits={0} label="Download">
              <button
                type="button"
                title="Download"
                onClick={() => onDownload && onDownload()}
                disabled={!onDownload}
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-full bg-white/5 text-white/85 ring-1 ring-white/10 transition",
                  "hover:bg-emerald-500/10 hover:ring-emerald-500/20",
                  (!onDownload) && "cursor-not-allowed opacity-50 hover:bg-white/5 hover:ring-white/10"
                )}
              >
                <Download className="h-4 w-4" />
              </button>
            </CreditTooltip>
          </div>
        </div>
      </div>
    </div>
  )
}
