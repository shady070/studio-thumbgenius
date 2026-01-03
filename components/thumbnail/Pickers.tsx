"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { ChevronDown, Check, UploadCloud } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import { DEMO_PERSONAS, DEMO_STYLES, Persona, Style } from "./types"
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_BASE_URL || ""

export function getPersonaName(id: string, list?: Persona[]) {
  const all = list ?? DEMO_PERSONAS
  return all.find((p) => p.id === id)?.name ?? "Persona"
}
export function getStyleName(id: string) {
  return DEMO_STYLES.find((s) => s.id === id)?.name ?? "Style"
}

export function MetaChip({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-white/5 px-2 py-0.5 ring-1 ring-white/10">
      {label}
    </span>
  )
}

export function PickerChipPersona({
  value,
  onChange,
}: {
  value: Persona | null
  onChange: (p: Persona | null) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [items, setItems] = React.useState<Persona[]>(DEMO_PERSONAS)
  const fileRef = React.useRef<HTMLInputElement | null>(null)
  const [createOpen, setCreateOpen] = React.useState(false)
  const [newName, setNewName] = React.useState("")
  const [newFile, setNewFile] = React.useState<File | null>(null)

  React.useEffect(() => {
    if (!API_BASE) return
    fetch(`${API_BASE}/personas`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const personas = (data?.personas || data) as any[]
        const mapped = personas.map((p) => ({
          id: p.id,
          name: p.name,
          avatarUrl: p.imageUrl,
        }))
        setItems(mapped)
      })
      .catch(() => {})
  }, [])

  const uploadPersona = async (file: File, name: string) => {
    if (!API_BASE || !file || !name.trim()) return
    const fd = new FormData()
    fd.append("file", file)
    fd.append("name", name.trim())
    try {
      const res = await fetch(`${API_BASE}/personas/upload`, {
        method: "POST",
        body: fd,
        credentials: "include",
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || "Upload failed")
      const persona = data?.persona || data
      const mapped = {
        id: persona.id,
        name: persona.name,
        avatarUrl: persona.imageUrl,
      }
      setItems((prev) => [mapped, ...prev])
      onChange(mapped)
      setOpen(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreateSubmit = async () => {
    if (!newName.trim() || !newFile) return
    await uploadPersona(newFile, newName)
    setNewName("")
    setNewFile(null)
    setCreateOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className="h-9 rounded-full bg-white/6 text-white/80 ring-1 ring-white/10 hover:bg-emerald-500/10 hover:ring-emerald-500/20"
        >
          <div className="mr-2 h-5 w-5 rounded-full bg-emerald-500/20 ring-1 ring-emerald-500/20" />
          <span className="max-w-[160px] truncate">
            {value ? value.name : "Persona"}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[320px] rounded-2xl border-white/10 bg-[#0e0e12] p-0 text-white shadow-xl">
        <Command>
          <CommandInput placeholder="Search personas…" />
          <CommandList>
            <CommandEmpty>No personas found.</CommandEmpty>
            <CommandGroup heading="Your Personas">
              <CommandItem
                value="none"
                onSelect={() => {
                  onChange(null)
                  setOpen(false)
                }}
              >
                <div className="mr-2 h-7 w-7 rounded-full bg-white/10 ring-1 ring-white/10" />
                <span className="flex-1">None</span>
                {!value ? <Check className="h-4 w-4" /> : null}
              </CommandItem>

              {items.map((p) => (
                <CommandItem
                  key={p.id}
                  value={p.name}
                  onSelect={() => {
                    onChange(p)
                    setOpen(false)
                  }}
                >
                  <div className="mr-2 h-7 w-7 rounded-full bg-emerald-500/18 ring-1 ring-emerald-500/18" />
                  <span className="flex-1">{p.name}</span>
                  {value?.id === p.id ? <Check className="h-4 w-4" /> : null}
                </CommandItem>
              ))}
            </CommandGroup>

            <div className="p-2">
              <Button className="w-full rounded-xl bg-emerald-500 text-black hover:bg-emerald-400" onClick={() => setCreateOpen(true)}>
                + Create Persona
              </Button>
            </div>
          </CommandList>
        </Command>
      </PopoverContent>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="bg-[#0e0e12] text-white border-white/10">
          <DialogHeader>
            <DialogTitle>Create Persona</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs text-white/60">Name</label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Persona name"
                className="bg-white/5 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-white/60">Image</label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setNewFile(e.target.files?.[0] || null)}
              />
              <Button
                variant="outline"
                className="w-full justify-start bg-white/5 text-white/80 ring-1 ring-white/10 hover:bg-white/10"
                onClick={() => fileRef.current?.click()}
              >
                <UploadCloud className="mr-2 h-4 w-4" />
                {newFile ? newFile.name : "Choose image"}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateSubmit} disabled={!newName.trim() || !newFile} className="bg-emerald-500 text-black hover:bg-emerald-400">
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Popover>
  )
}

export function PickerChipStyle({
  value,
  onChange,
}: {
  value: Style | null
  onChange: (s: Style | null) => void
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className="h-9 rounded-full bg-white/6 text-white/80 ring-1 ring-white/10 hover:bg-emerald-500/10 hover:ring-emerald-500/20"
        >
          <div className="mr-2 h-5 w-5 rounded-md bg-white/10 ring-1 ring-white/10" />
          <span className="max-w-[160px] truncate">
            {value ? value.name : "Style"}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[320px] rounded-2xl border-white/10 bg-[#0e0e12] p-0 text-white shadow-xl">
        <Command>
          <CommandInput placeholder="Search styles…" />
          <CommandList>
            <CommandEmpty>No styles found.</CommandEmpty>
            <CommandGroup heading="Your Styles">
              <CommandItem
                value="none"
                onSelect={() => {
                  onChange(null)
                  setOpen(false)
                }}
              >
                <div className="mr-2 h-7 w-7 rounded-md bg-white/10 ring-1 ring-white/10" />
                <span className="flex-1">None</span>
                {!value ? <Check className="h-4 w-4" /> : null}
              </CommandItem>

              {DEMO_STYLES.map((s) => (
                <CommandItem
                  key={s.id}
                  value={s.name}
                  onSelect={() => {
                    onChange(s)
                    setOpen(false)
                  }}
                >
                  <div className="mr-2 h-7 w-10 rounded-md bg-white/10 ring-1 ring-white/10" />
                  <span className="flex-1">{s.name}</span>
                  {value?.id === s.id ? <Check className="h-4 w-4" /> : null}
                </CommandItem>
              ))}
            </CommandGroup>

            <div className="p-2">
              <Button className="w-full rounded-xl bg-emerald-500 text-black hover:bg-emerald-400">
                + Create Style
              </Button>
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
