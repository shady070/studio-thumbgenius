"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Upload, Link as LinkIcon, X } from "lucide-react"

export function EditComposer({
  onSubmit,
}: {
  onSubmit: (payload: { file?: File | null; link?: string }) => void
}) {
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  const [dragOver, setDragOver] = React.useState(false)
  const [file, setFile] = React.useState<File | null>(null)
  const [link, setLink] = React.useState("")
  const [tab, setTab] = React.useState<"upload" | "link">("upload")

  const pickFile = () => inputRef.current?.click()

  const onFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    setFile(files[0])
    setTab("upload")
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    onFiles(e.dataTransfer.files)
  }

  const disabled =
    (tab === "upload" && !file) || (tab === "link" && link.trim().length < 8)

  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-4 backdrop-blur">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />

      {/* Top pills */}
      <div className="mb-3 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => {
            setTab("upload")
            pickFile()
          }}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ring-1 transition",
            tab === "upload"
              ? "bg-emerald-500/15 text-emerald-200 ring-emerald-500/25"
              : "bg-white/5 text-white/70 ring-white/10 hover:bg-white/8"
          )}
        >
          <Upload className="h-4 w-4" />
          Upload
        </button>

        <button
          type="button"
          onClick={() => setTab("link")}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ring-1 transition",
            tab === "link"
              ? "bg-emerald-500/15 text-emerald-200 ring-emerald-500/25"
              : "bg-white/5 text-white/70 ring-white/10 hover:bg-white/8"
          )}
        >
          <LinkIcon className="h-4 w-4" />
          Link
        </button>
      </div>

      {/* Body */}
      {tab === "upload" ? (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cn(
            "rounded-2xl border border-dashed px-5 py-6 text-center transition",
            dragOver
              ? "border-emerald-500/40 bg-emerald-500/5"
              : "border-white/12 bg-black/20"
          )}
        >
          <div className="mx-auto flex max-w-xl flex-col items-center gap-2">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-white/85">
              <Upload className="h-4 w-4 text-emerald-300" />
              Upload any thumbnail or drag & drop it here.
            </div>
            <div className="text-xs text-white/55">
              PNG, JPG, JPEG & WebP formats, up to 4 MB.
            </div>

            <div className="mt-3 flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={pickFile}
                className="rounded-full bg-white/6 text-white/80 ring-1 ring-white/10 hover:bg-white/10"
              >
                Choose file
              </Button>

              {file ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
                  <span className="max-w-[220px] truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="grid h-5 w-5 place-items-center rounded-full hover:bg-white/10"
                    aria-label="Remove file"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="text-xs font-semibold text-white/80">Image URL</div>
          <div className="mt-2 flex items-center gap-2">
            <Input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Paste an image link…"
              className="h-11 rounded-2xl border-white/10 bg-black/40 text-white placeholder:text-white/35"
            />
            <Button
              type="button"
              variant="secondary"
              className="h-11 rounded-2xl bg-white/6 text-white/80 ring-1 ring-white/10 hover:bg-white/10"
              onClick={() => setLink("")}
            >
              Clear
            </Button>
          </div>
          <div className="mt-2 text-[11px] text-white/55">
            Make sure the URL points directly to an image (jpg/png/webp).
          </div>
        </div>
      )}

      {/* Bottom action */}
      <div className="mt-4 flex justify-center">
        <Button
          type="button"
          disabled={disabled}
          onClick={() => onSubmit({ file, link: link.trim() })}
          className="h-11 rounded-full bg-emerald-500 px-10 text-black hover:bg-emerald-400 disabled:opacity-50"
        >
          ✨ Edit
        </Button>
      </div>
    </div>
  )
}
