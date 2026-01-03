"use client"

import * as React from "react"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

export function GeneratingCard({ progress }: { progress: number }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-black/30 p-4">
      <div className="pointer-events-none absolute inset-0 opacity-[0.35]">
        <div className="absolute -left-1/2 top-0 h-full w-[60%] animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent" />
      </div>

      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-xs font-semibold text-white/80">
            Generating thumbnail…
          </div>
          <div className="text-xs text-white/60">{Math.round(progress)}%</div>
        </div>

        <div className="mb-4 aspect-video w-[460px] max-w-full overflow-hidden rounded-xl bg-black/30 ring-1 ring-white/10">
          <div className="p-4">
            <Skeleton className="h-4 w-40" />
            <div className="mt-3 grid grid-cols-3 gap-2">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
            <Skeleton className="mt-3 h-3 w-64" />
          </div>
        </div>

        <Progress value={progress} className="h-2 bg-white/10" />
        <div className="mt-3 flex items-center gap-2 text-[11px] text-white/55">
          <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
          Optimizing composition, contrast & readability…
        </div>
      </div>
    </div>
  )
}
