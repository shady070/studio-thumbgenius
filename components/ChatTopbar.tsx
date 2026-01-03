"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Wand2, BarChart3, Type, RefreshCw } from "lucide-react"
import type { Mode } from "@/components/thumbnail/types"

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

function ModePill({
  active,
  icon,
  onClick,
  children,
}: {
  active?: boolean
  icon: React.ReactNode
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      variant="ghost"
      className={cn(
        "h-9 rounded-full px-4 text-sm",
        active
          ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25"
          : "bg-white/5 text-white/70 ring-1 ring-white/10 hover:bg-emerald-500/10 hover:ring-emerald-500/20 hover:text-white"
      )}
    >
      <span className="mr-2">{icon}</span>
      {children}
    </Button>
  )
}

export function ChatTopbar({
  mode,
  setMode,
  onRemake,
  creditsRemake = 20,
}: {
  mode: Mode
  setMode: (m: Mode) => void
  onRemake: () => void
  creditsRemake?: number
}) {
  return (
    <div className="border-b border-white/10 bg-black/40 px-5 py-4 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">What’s Next?</div>
          <div className="text-xs text-white/55">Prompt • generate • analyze • titles</div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ModePill
            active={mode === "prompt"}
            icon={<Wand2 className="h-4 w-4" />}
            onClick={() => setMode("prompt")}
          >
            Prompt
          </ModePill>

          <ModePill
            active={mode === "title"}
            icon={<Type className="h-4 w-4" />}
            onClick={() => setMode("title")}
          >
            Title
          </ModePill>

          <ModePill
            active={mode === "analyze"}
            icon={<BarChart3 className="h-4 w-4" />}
            onClick={() => setMode("analyze")}
          >
            Analyze
          </ModePill>

          <CreditTooltip credits={creditsRemake} label="Remake from thumbnail">
            <Button
              variant="secondary"
              onClick={onRemake}
              className="h-9 rounded-full bg-white/6 text-white/80 ring-1 ring-white/10 hover:bg-emerald-500/10 hover:ring-emerald-500/20"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Remake
            </Button>
          </CreditTooltip>
        </div>
      </div>
    </div>
  )
}
