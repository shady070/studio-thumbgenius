"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

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

export function TitleComposer({
  value,
  onChange,
  onGenerate,
  credits,
}: {
  value: string
  onChange: (v: string) => void
  onGenerate: () => void
  credits: number
}) {
  return (
    <div className="flex w-full items-end gap-3">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe your video idea…"
        className={cn(
          "min-h-[90px] flex-1 min-w-0 resize-none rounded-3xl border-white/10 bg-black/40 px-4 py-3",
          "text-white placeholder:text-white/35 focus-visible:ring-emerald-500/30"
        )}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === "Enter") onGenerate()
        }}
      />

      <CreditTooltip credits={credits} label="Generate titles">
        <Button
          onClick={onGenerate}
          className="h-[90px] shrink-0 rounded-3xl bg-emerald-500 px-6 text-black hover:bg-emerald-400"
        >
          Generate
        </Button>
      </CreditTooltip>
    </div>
  )
}
