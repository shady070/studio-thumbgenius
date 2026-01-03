"use client"

import * as React from "react"
import { Mode, Persona, Style, CREDITS } from "./types"
import { PickerChipPersona, PickerChipStyle } from "./Pickers"
import { PromptComposer } from "./PromptComposer"
import { EditComposer } from "./EditComposer"
import { TitleComposer } from "./TitleComposer"

export function Composer({
  mode,
  persona,
  setPersona,
  personaMode,
  setPersonaMode,
  style,
  setStyle,
  input,
  setInput,
  onSend,
  onEnhance,

  titleIdea,
  setTitleIdea,
  onGenerateTitles,
  analyzeTitle,
  setAnalyzeTitle,
  analyzeYoutubeUrl,
  setAnalyzeYoutubeUrl,
  onAnalyze,
  onAnalyzeUpload,
  enhanceLoading,
}: {
  mode: Mode
  persona: Persona | null
  setPersona: (p: Persona | null) => void
  personaMode: "face" | "full"
  setPersonaMode: (m: "face" | "full") => void
  style: Style | null
  setStyle: (s: Style | null) => void
  input: string
  setInput: (v: string) => void
  onSend: () => void

  titleIdea: string
  setTitleIdea: (v: string) => void
  onGenerateTitles: () => void
  onEnhance: () => void
  analyzeTitle: string
  setAnalyzeTitle: (v: string) => void
  analyzeYoutubeUrl: string
  setAnalyzeYoutubeUrl: (v: string) => void
  onAnalyze: () => void
  onAnalyzeUpload: () => void
  enhanceLoading?: boolean
}) {
  return (
    <div className="border-t border-white/10 bg-black/40 p-4 backdrop-blur">
      <div className="flex items-end gap-4">
        {mode === "prompt" ? (
          <div className="flex flex-col gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <PickerChipPersona value={persona} onChange={setPersona} />
              <select
                className="h-9 rounded-full bg-white/5 px-3 text-sm text-white ring-1 ring-white/10 outline-none"
                value={personaMode}
                onChange={(e) => setPersonaMode(e.target.value === "full" ? "full" : "face")}
              >
                <option value="face">Face swap</option>
                <option value="full">Full body</option>
              </select>
            </div>
            <button
              type="button"
              onClick={onEnhance}
              className="inline-flex items-center justify-center rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/10 hover:bg-emerald-500/15 hover:text-emerald-100 hover:ring-emerald-500/30 disabled:opacity-60"
              disabled={enhanceLoading}
              title="Enhance prompt (4 credits)"
            >
              {enhanceLoading ? "Enhancing…" : "Enhance prompt (4 cr)"}
            </button>
          </div>
        ) : null}

        <div className="flex flex-1 items-end gap-3 min-w-0">
          {mode === "prompt" ? (
            <PromptComposer
              input={input}
              setInput={setInput}
              onSend={onSend}
              creditsGenerate={CREDITS.generate}
            />
          ) : mode === "edit" ? (
            <div className="w-full">
              <EditComposer onSubmit={(payload) => console.log("EDIT submit", payload)} />
            </div>
        ) : mode === "title" ? (
          <TitleComposer value={titleIdea} onChange={setTitleIdea} onGenerate={onGenerateTitles} />
        ) : (
            <div className="w-full rounded-3xl border border-white/10 bg-black/30 p-4 text-sm text-white/70 space-y-3">
              <div className="font-semibold text-white">Analyze / Remake</div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-white/60">Video title</label>
                  <input
                    className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white ring-1 ring-white/10 outline-none"
                    value={analyzeTitle}
                    onChange={(e) => setAnalyzeTitle(e.target.value)}
                    placeholder="Enter title (used for analysis)"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-white/60">YouTube URL (optional)</label>
                  <input
                    className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white ring-1 ring-white/10 outline-none"
                    value={analyzeYoutubeUrl}
                    onChange={(e) => setAnalyzeYoutubeUrl(e.target.value)}
                    placeholder="https://youtu.be/..."
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={onAnalyze}
                  className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400"
                >
                  Analyze
                </button>
                <button
                  onClick={onAnalyzeUpload}
                  className="rounded-full bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
                >
                  Upload image for analyze/remake
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
