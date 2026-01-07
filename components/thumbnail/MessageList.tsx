"use client"

import * as React from "react"
import { Sparkles } from "lucide-react"
import { ChatMsg } from "./types"
import { MetaChip, getPersonaName, getStyleName } from "./Pickers"
import { GeneratingCard } from "./GeneratingCard"
import { ImageBubble } from "./ImageBubble"
import { TitleResults } from "./TitleResults"
import { Card } from "@/components/ui/card"

export function MessageList({
  msgs,
  openFull,
  onOneClickFix,
  onEditImage,
}: {
  msgs: ChatMsg[]
  openFull: (url: string) => void
  onOneClickFix: (assistantMessageId: string) => void
  onEditImage: (assistantMessageId: string) => void
}) {
  return (
    <div className="flex flex-col gap-5">
      {msgs.map((m) => {
        if (m.role === "user") {
          return (
            <div key={m.id} className="flex justify-end">
              <div className="max-w-[78%] space-y-2">
                <div className="flex justify-end gap-2 text-[11px] text-white/60">
                  {m.meta?.personaId ? <MetaChip label={getPersonaName(m.meta.personaId)} /> : null}
                  {m.meta?.styleId ? <MetaChip label={getStyleName(m.meta.styleId)} /> : null}
                  {m.meta?.mode ? <MetaChip label={m.meta.mode} /> : null}
                </div>

                <div className="rounded-3xl bg-emerald-500/14 px-5 py-4 text-sm text-white ring-1 ring-emerald-500/20">
                  {m.text}
                </div>
              </div>
            </div>
          )
        }

        return (
          <div key={m.id} className="flex justify-start">
            <div className="max-w-[82%] rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="mb-3 flex items-center gap-2 text-xs text-white/70">
                <div className="h-7 w-7 overflow-hidden rounded-full ring-1 ring-white/10 bg-white/5">
                  <img src="/logo.svg" alt="ThumbGenius logo" className="h-full w-full object-contain" />
                </div>
                <span>ThumbGenius</span>

                {m.status === "generating" ? (
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300 ring-1 ring-emerald-500/20">
                    <Sparkles className="h-3 w-3" />
                    Generating…
                  </span>
                ) : (
                  <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white/70 ring-1 ring-white/10">
                    Done
                  </span>
                )}
              </div>

              {m.status === "generating" ? (
                <GeneratingCard progress={m.progress} />
              ) : m.kind === "titles" ? (
                <TitleResults
                  titles={
                    m.titles ??
                    (() => {
                      if (!("text" in m) || typeof m.text !== "string") return []
                      try {
                        const parsed = JSON.parse(m.text)
                        if (!Array.isArray(parsed)) return []
                        return parsed.map((t: any, i: number) => ({
                          id: `${m.id}_${i}`,
                          text: typeof t === "string" ? t : t?.text ?? "",
                        }))
                      } catch {
                        return []
                      }
                    })()
                  }
                />
              ) : m.kind === "analysis" ? (
                <Card className="bg-white/5 text-sm text-white/80 ring-1 ring-white/10">
                  <div className="space-y-3 p-4">
                    <div className="flex items-center justify-between text-xs uppercase text-white/60">
                      <span>Analysis</span>
                      {m.text ? null : <span className="text-amber-300">No data</span>}
                    </div>
                    {(() => {
                      let parsed: any = null
                      try {
                        parsed = typeof m.text === "string" ? JSON.parse(m.text) : null
                      } catch {
                        parsed = null
                      }
                      if (!parsed) {
                        return (
                          <pre className="whitespace-pre-wrap break-words text-[12px] leading-relaxed text-white/80">
                            {m.text || "No analysis returned."}
                          </pre>
                        )
                      }
                      const overall = parsed.overall ?? {}
                      const pillars: any[] = parsed.pillars ?? []
                      const risks: string[] = parsed.risks ?? []
                      const suggestions: string[] = parsed.suggestions ?? []
                      return (
                        <div className="space-y-3">
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                            <div className="flex items-center justify-between text-xs text-white/60">
                              <span>Overall score</span>
                              {typeof overall.score === "number" ? (
                                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-200">
                                  {overall.score}
                                </span>
                              ) : null}
                            </div>
                            {overall.summary ? (
                              <p className="mt-2 text-sm leading-relaxed text-white/85">{overall.summary}</p>
                            ) : null
                            }
                          </div>

                          {pillars.length ? (
                            <div className="space-y-2">
                              {pillars.map((p, idx) => (
                                <details
                                  key={`${p.name || "pillar"}-${idx}`}
                                  className="rounded-2xl border border-white/10 bg-white/3 p-3 text-sm text-white/85"
                                  open
                                >
                                  <summary className="flex cursor-pointer items-center justify-between text-white">
                                    <span className="font-semibold">{p.name || "Pillar"}</span>
                                    {typeof p.score === "number" ? (
                                      <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/80">
                                        {p.score}
                                      </span>
                                    ) : null}
                                  </summary>
                                  <div className="mt-2 space-y-2 text-[13px] leading-relaxed">
                                    {Array.isArray(p.strengths) && p.strengths.length ? (
                                      <div>
                                        <div className="text-xs uppercase text-emerald-200/80">Strengths</div>
                                        <ul className="ml-4 list-disc space-y-1 text-white/85">
                                          {p.strengths.map((s: string, i: number) => (
                                            <li key={i}>{s}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    ) : null}
                                    {Array.isArray(p.fixes) && p.fixes.length ? (
                                      <div>
                                        <div className="text-xs uppercase text-amber-200/80">Fixes</div>
                                        <ul className="ml-4 list-disc space-y-1 text-white/85">
                                          {p.fixes.map((s: string, i: number) => (
                                            <li key={i}>{s}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    ) : null}
                                  </div>
                                </details>
                              ))}
                            </div>
                          ) : null}

                          {risks.length ? (
                            <div className="space-y-1 rounded-2xl border border-white/10 bg-white/3 p-3">
                              <div className="text-xs uppercase text-amber-200/80">Risks</div>
                              <ul className="ml-4 list-disc space-y-1 text-sm text-white/85">
                                {risks.map((r, i) => (
                                  <li key={i}>{r}</li>
                                ))}
                              </ul>
                            </div>
                          ) : null}

                          {suggestions.length ? (
                            <div className="space-y-1 rounded-2xl border border-white/10 bg-white/3 p-3">
                              <div className="text-xs uppercase text-emerald-200/80">Suggestions</div>
                              <ul className="ml-4 list-disc space-y-1 text-sm text-white/85">
                                {suggestions.map((s, i) => (
                                  <li key={i}>{s}</li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                        </div>
                      )
                    })()}
                  </div>
                </Card>
              ) : (
                <ImageBubble
                  url={m.imageUrl ?? ""}
                  score={m.score ?? 74}
                  onFull={() => m.imageUrl && openFull(m.imageUrl)}
                  onFix={() => onOneClickFix(m.id)}
                  onCompare={() => console.log("compare", m.id)}
                  onRedo={() => console.log("redo", m.id)}
                  onDownload={
                    m.imageUrl
                      ? () => {
                          const link = document.createElement("a")
                          link.href = m.imageUrl ?? ""
                          link.download = "thumbnail.png"
                          link.click()
                        }
                      : undefined
                  }
                />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
