"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Pencil, Trash2, MoreVertical, MessageSquarePlus, Search, UserCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useChatStore } from "@/components/chat/ChatStore"

function getActiveIdFromPath(pathname: string) {
  const m = pathname.match(/\/studio\/c\/([^/]+)/)
  return m?.[1] ?? null
}

export function AppSidebar() {
  const { state } = useSidebar()
  const router = useRouter()
  const pathname = usePathname()

  const { threads, activeThread, createThread, setActive, renameThread, deleteThread } = useChatStore()

  const activeIdFromUrl = React.useMemo(() => getActiveIdFromPath(pathname), [pathname])
  const activeId = activeIdFromUrl ?? activeThread?.id ?? null

  const [q, setQ] = React.useState("")
  const [renameOpen, setRenameOpen] = React.useState(false)
  const [renameId, setRenameId] = React.useState<string | null>(null)
  const [renameValue, setRenameValue] = React.useState("")

  const filtered = React.useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return threads
    return threads.filter((t) => t.title.toLowerCase().includes(query))
  }, [threads, q])

  const onNewChat = async () => {
    const id = await createThread({ title: "New Chat", mode: "prompt" })
    setActive(id)
    router.push(`/studio/c/${id}`)
  }

  const onSelectChat = (id: string) => {
    setActive(id)
    router.push(`/studio/c/${id}`)
  }

  const openRename = (id: string, current: string) => {
    setRenameId(id)
    setRenameValue(current)
    setRenameOpen(true)
  }

  const submitRename = async () => {
    if (!renameId) return
    await renameThread(renameId, renameValue)
    setRenameOpen(false)
    setRenameId(null)
  }

  return (
    <>
      <Sidebar className="border-r border-white/10 bg-[#0b0b0d] text-white overflow-hidden dark" collapsible="offcanvas">
        <SidebarHeader className="gap-3 p-3 bg-black/20">
          <div className="flex items-center justify-between">
            <Link href="/studio" className="flex items-center gap-2">
              <div className="h-7 w-7 overflow-hidden rounded-md ring-1 ring-white/10 bg-white/5">
                <img src="/logo.svg" alt="ThumbGenius logo" className="h-full w-full object-contain" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-white">ThumbGenius</span>
            </Link>
            {state === "expanded" && (
              <SidebarTrigger className="h-9 w-9 rounded-xl bg-white/5 text-white/80 ring-1 ring-white/10 hover:bg-white/10 hover:text-white" />
            )}
          </div>

          <Button
            type="button"
            onClick={onNewChat}
            className="w-full justify-center gap-2 rounded-xl bg-white/6 text-white/85 ring-1 ring-white/10 hover:bg-white/10 hover:text-white"
            variant="secondary"
          >
            <MessageSquarePlus className="h-4 w-4" />
            New Chat
          </Button>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-10 rounded-xl pl-10 bg-black/30 text-white placeholder:text-white/35 ring-1 ring-white/10 border-white/10"
              placeholder="Search chats…"
            />
          </div>
        </SidebarHeader>

        <SidebarSeparator className="bg-white/10" />

        <SidebarContent className="p-2 chat-scroll overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupLabel className="px-2 text-xs text-white/45">Chats</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filtered.map((t) => {
                  const isActive = activeId === t.id
                  return (
                    <SidebarMenuItem key={t.id}>
                      <div className={cn("group flex items-center gap-2 rounded-xl px-2 py-1", isActive ? "bg-white/10" : "hover:bg-white/8")}>
                        <button
                          type="button"
                          onClick={() => onSelectChat(t.id)}
                          className={cn("flex-1 truncate text-left text-sm", isActive ? "text-white" : "text-white/75")}
                        >
                          {t.title}
                        </button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className={cn(
                                "opacity-0 group-hover:opacity-100 transition",
                                "grid h-8 w-8 place-items-center rounded-xl",
                                "bg-white/5 text-white/70 ring-1 ring-white/10 hover:bg-white/10 hover:text-white"
                              )}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-44 border-white/10 bg-[#0e0e12] text-white">
                            <DropdownMenuItem onClick={() => openRename(t.id, t.title)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem
                              className="text-red-200 focus:text-red-200"
                              onClick={async () => {
                                await deleteThread(t.id)
                                if (activeId === t.id) router.push("/studio")
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-3">
          <Link
            href="/account"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/10 ring-1 ring-white/10"
          >
            <UserCircle className="h-5 w-5" />
            Account & Billing
          </Link>
        </SidebarFooter>
      </Sidebar>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="max-w-md border-white/10 bg-[#0e0e12] text-white">
          <DialogHeader>
            <DialogTitle>Rename chat</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className="h-11 rounded-xl bg-black/40 text-white ring-1 ring-white/10 border-white/10"
              placeholder="Chat name…"
              onKeyDown={(e) => {
                if (e.key === "Enter") submitRename()
              }}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                className="rounded-xl bg-white/5 text-white/80 ring-1 ring-white/10 hover:bg-white/10"
                onClick={() => setRenameOpen(false)}
              >
                Cancel
              </Button>
              <Button className="rounded-xl bg-emerald-500 text-black hover:bg-emerald-400" onClick={submitRename}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
