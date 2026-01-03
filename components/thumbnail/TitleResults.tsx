"use client"

import * as React from "react"
import { Copy } from "lucide-react"
import { TitleRow } from "./types"

export function TitleResults({ titles }: { titles: TitleRow[] }) {
  return (
    <div className="w-[620px] max-w-full space-y-2">
      {titles.map((t) => (
        <TitleRowItem key={t.id} title={t} />
      ))}
    </div>
  )
}

function TitleRowItem({ title }: { title: TitleRow }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(title.text)
    } catch {
      const el = document.createElement("textarea")
      el.value = title.text
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
      <div className="min-w-0 flex-1 truncate text-sm text-white/85">{title.text}</div>

      <div className="flex items-center gap-2 shrink-0">
        <IconBtn title="Copy" onClick={copy}>
          <Copy className="h-4 w-4" />
        </IconBtn>
      </div>
    </div>
  )
}

function IconBtn({
  title,
  onClick,
  children,
}: {
  title: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-white/85 ring-1 ring-white/10 transition hover:bg-emerald-500/10 hover:ring-emerald-500/20"
    >
      {children}
    </button>
  )
}
