"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type AdminStats = {
  totals?: {
    users?: number
    newUsers24h?: number
    newUsers7d?: number
    threads?: number
    messages?: number
    personas?: number
    orders?: number
  }
  activity?: {
    assistantImages?: number
    assistantTitles?: number
  }
  credits?: {
    sumLeft?: number
    sumUsed?: number
  }
  recentUsers?: Array<{ id: string; email: string; createdAt: string; creditsLeft: number }>
  recentOrders?: Array<{ id: string; status: string; variantId: string; createdAt: string }>
  recentImages?: Array<{ id: string; threadId: string; userId: string; imageUrl: string; createdAt: string }>
}

type AdminUser = {
  id: string
  email: string
  username?: string | null
  createdAt: string
  emailVerifiedAt?: string | null
  creditsLeft: number
  creditsUsed: number
}

type UserDetail = {
  user: AdminUser | null
  threads?: Array<{ id: string; title: string; mode: string; createdAt: string; updatedAt: string }>
  messages?: Array<{ id: string; role: string; kind: string | null; text: string | null; createdAt: string; threadId: string }>
  images?: Array<{ id: string; imageUrl: string; createdAt: string; threadId: string }>
  personas?: Array<{ id: string; name: string; imageUrl: string; createdAt: string }>
}

export function AdminPage() {
  const [data, setData] = React.useState<AdminStats | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [users, setUsers] = React.useState<AdminUser[]>([])
  const [usersCursor, setUsersCursor] = React.useState<string | null>(null)
  const [usersLoading, setUsersLoading] = React.useState(false)
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null)
  const [userDetail, setUserDetail] = React.useState<UserDetail | null>(null)
  const [detailLoading, setDetailLoading] = React.useState(false)

  React.useEffect(() => {
    fetch("/api/admin/stats", { credentials: "include" })
      .then(async (res) => {
        const payload = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(payload?.message || "Unable to load admin stats.")
        setData(payload)
      })
      .catch((err: any) => setError(err?.message || "Unable to load admin stats."))
      .finally(() => setLoading(false))
  }, [])

  const loadUsers = React.useCallback(
    async (cursor?: string | null) => {
      setUsersLoading(true)
      try {
        const qs = new URLSearchParams()
        qs.set("limit", "50")
        if (cursor) qs.set("cursor", cursor)
        const res = await fetch(`/api/admin/users?${qs.toString()}`, { credentials: "include" })
        const payload = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(payload?.message || "Unable to load users.")
        const next = (payload?.users || []) as AdminUser[]
        setUsers((prev) => (cursor ? [...prev, ...next] : next))
        setUsersCursor(payload?.nextCursor || null)
      } catch (err: any) {
        setError(err?.message || "Unable to load users.")
      } finally {
        setUsersLoading(false)
      }
    },
    []
  )

  React.useEffect(() => {
    loadUsers(null)
  }, [loadUsers])

  const loadUserDetail = React.useCallback(async (id: string) => {
    setDetailLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(id)}`, { credentials: "include" })
      const payload = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(payload?.message || "Unable to load user detail.")
      setUserDetail(payload as UserDetail)
    } catch (err: any) {
      setError(err?.message || "Unable to load user detail.")
    } finally {
      setDetailLoading(false)
    }
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0b0b0d] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[-120px] right-[-120px] h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_45%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase text-white/45">Admin</div>
            <div className="text-2xl font-semibold">Dashboard</div>
          </div>
          <Link href="/studio">
            <Button variant="secondary" className="rounded-full bg-white/5 text-white/80 ring-1 ring-white/10 hover:bg-white/10">
              Back to studio
            </Button>
          </Link>
        </div>

        {loading ? (
          <Card className="mt-6 border-white/10 bg-white/5 p-6 text-white/70">Loading…</Card>
        ) : error ? (
          <Card className="mt-6 border-rose-400/30 bg-rose-500/10 p-6 text-rose-100">{error}</Card>
        ) : (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <StatCard title="Total users" value={data?.totals?.users} />
              <StatCard title="New users (24h)" value={data?.totals?.newUsers24h} />
              <StatCard title="New users (7d)" value={data?.totals?.newUsers7d} />
              <StatCard title="Threads" value={data?.totals?.threads} />
              <StatCard title="Messages" value={data?.totals?.messages} />
              <StatCard title="Personas" value={data?.totals?.personas} />
              <StatCard title="Orders" value={data?.totals?.orders} />
              <StatCard title="Images generated" value={data?.activity?.assistantImages} />
              <StatCard title="Titles generated" value={data?.activity?.assistantTitles} />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Card className="border-white/10 bg-white/5 p-5">
                <div className="text-xs uppercase text-white/50">Credits</div>
                <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-white/70">
                  <div>
                    <div className="text-white/50">Total left</div>
                    <div className="text-lg font-semibold text-white">{data?.credits?.sumLeft ?? 0}</div>
                  </div>
                  <div>
                    <div className="text-white/50">Total used</div>
                    <div className="text-lg font-semibold text-white">{data?.credits?.sumUsed ?? 0}</div>
                  </div>
                </div>
              </Card>

              <Card className="border-white/10 bg-white/5 p-5">
                <div className="text-xs uppercase text-white/50">Recent users</div>
                <div className="mt-3 space-y-3 text-sm">
                  {(data?.recentUsers ?? []).length === 0 ? (
                    <div className="text-white/60">No recent users.</div>
                  ) : (
                    data?.recentUsers?.map((u) => (
                      <div key={u.id} className="flex items-center justify-between text-white/75">
                        <div>
                          <div className="text-white">{u.email}</div>
                          <div className="text-xs text-white/45">{new Date(u.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="text-xs text-emerald-200">Credits: {u.creditsLeft}</div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>

            <Card className="mt-4 border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase text-white/50">Recent orders</div>
              <div className="mt-3 space-y-3 text-sm">
                {(data?.recentOrders ?? []).length === 0 ? (
                  <div className="text-white/60">No recent orders.</div>
                ) : (
                  data?.recentOrders?.map((o) => (
                    <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 text-white/75">
                      <div>
                        <div className="text-white">Order #{o.id}</div>
                        <div className="text-xs text-white/45">{new Date(o.createdAt).toLocaleString()}</div>
                      </div>
                      <div className="text-xs text-white/60">Variant: {o.variantId}</div>
                      <div className="text-xs text-emerald-200">Status: {o.status}</div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="mt-4 border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase text-white/50">All users</div>
                <div className="text-xs text-white/50">{users.length} loaded</div>
              </div>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left text-xs text-white/70">
                  <thead className="text-white/45">
                    <tr>
                      <th className="pb-2 pr-3">Select</th>
                      <th className="pb-2 pr-3">Email</th>
                      <th className="pb-2 pr-3">Username</th>
                      <th className="pb-2 pr-3">Credits left</th>
                      <th className="pb-2 pr-3">Credits used</th>
                      <th className="pb-2 pr-3">Verified</th>
                      <th className="pb-2 pr-3">Created</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/75">
                    {users.map((u) => (
                      <tr key={u.id} className="border-t border-white/5">
                        <td className="py-2 pr-3">
                          <Button
                            variant="secondary"
                            className="h-7 rounded-full bg-white/5 text-white/80 ring-1 ring-white/10 hover:bg-white/10"
                            onClick={() => {
                              setSelectedUserId(u.id)
                              loadUserDetail(u.id)
                            }}
                          >
                            View
                          </Button>
                        </td>
                        <td className="py-2 pr-3 text-white">{u.email}</td>
                        <td className="py-2 pr-3">{u.username || "—"}</td>
                        <td className="py-2 pr-3">{u.creditsLeft}</td>
                        <td className="py-2 pr-3">{u.creditsUsed}</td>
                        <td className="py-2 pr-3">{u.emailVerifiedAt ? "Yes" : "No"}</td>
                        <td className="py-2 pr-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="secondary"
                  className="rounded-full bg-white/5 text-white/80 ring-1 ring-white/10 hover:bg-white/10"
                  onClick={() => loadUsers(usersCursor)}
                  disabled={usersLoading || !usersCursor}
                >
                  {usersLoading ? "Loading…" : usersCursor ? "Load more" : "All loaded"}
                </Button>
              </div>
            </Card>

            <Card className="mt-4 border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase text-white/50">User detail</div>
              {!selectedUserId ? (
                <div className="mt-3 text-sm text-white/60">Select a user to view details.</div>
              ) : detailLoading ? (
                <div className="mt-3 text-sm text-white/70">Loading user data…</div>
              ) : !userDetail?.user ? (
                <div className="mt-3 text-sm text-white/70">User not found.</div>
              ) : (
                <div className="mt-4 space-y-6">
                  <div className="grid gap-3 md:grid-cols-3 text-sm text-white/75">
                    <div>
                      <div className="text-white/50">Email</div>
                      <div className="text-white">{userDetail.user.email}</div>
                    </div>
                    <div>
                      <div className="text-white/50">Username</div>
                      <div>{userDetail.user.username || "—"}</div>
                    </div>
                    <div>
                      <div className="text-white/50">Verified</div>
                      <div>{userDetail.user.emailVerifiedAt ? "Yes" : "No"}</div>
                    </div>
                    <div>
                      <div className="text-white/50">Credits left</div>
                      <div>{userDetail.user.creditsLeft}</div>
                    </div>
                    <div>
                      <div className="text-white/50">Credits used</div>
                      <div>{userDetail.user.creditsUsed}</div>
                    </div>
                    <div>
                      <div className="text-white/50">Created</div>
                      <div>{new Date(userDetail.user.createdAt).toLocaleString()}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs uppercase text-white/50">Personas</div>
                    <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {(userDetail.personas ?? []).length === 0 ? (
                        <div className="text-white/60">No personas.</div>
                      ) : (
                        userDetail.personas?.map((p) => (
                          <div key={p.id} className="rounded-xl border border-white/10 bg-black/40 p-3 text-xs">
                            <div className="text-white">{p.name}</div>
                            <div className="text-white/50">{new Date(p.createdAt).toLocaleDateString()}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs uppercase text-white/50">Generated images</div>
                    <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {(userDetail.images ?? []).length === 0 ? (
                        <div className="text-white/60">No images.</div>
                      ) : (
                        userDetail.images?.map((img) => (
                          <div key={img.id} className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
                            <div className="aspect-video w-full bg-black/40">
                              <img
                                src={img.imageUrl}
                                alt={`User image ${img.id}`}
                                className="h-full w-full object-contain"
                                loading="lazy"
                              />
                            </div>
                            <div className="p-2 text-xs text-white/60">
                              <div>Thread: {img.threadId}</div>
                              <div>{new Date(img.createdAt).toLocaleString()}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs uppercase text-white/50">Recent threads</div>
                    <div className="mt-2 space-y-2 text-xs text-white/70">
                      {(userDetail.threads ?? []).length === 0 ? (
                        <div className="text-white/60">No threads.</div>
                      ) : (
                        userDetail.threads?.map((t) => (
                          <div key={t.id} className="rounded-xl border border-white/10 bg-black/40 p-2">
                            <div className="text-white">{t.title}</div>
                            <div className="text-white/50">
                              {t.mode} · {new Date(t.updatedAt).toLocaleString()}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  )
}

function StatCard({ title, value }: { title: string; value?: number }) {
  return (
    <Card className="border-white/10 bg-white/5 p-5">
      <div className="text-xs uppercase text-white/50">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{typeof value === "number" ? value : "—"}</div>
    </Card>
  )
}
