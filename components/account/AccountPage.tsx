"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function AccountPage() {
  const variantId = process.env.NEXT_PUBLIC_LS_VARIANT_ID || ""
  const topupVariantId = process.env.NEXT_PUBLIC_LS_TOPUP_VARIANT_ID || ""
  const [entitlement, setEntitlement] = React.useState<any>(undefined)
  const [entLoaded, setEntLoaded] = React.useState(false)
  const [userCredits, setUserCredits] = React.useState<number | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)

  React.useEffect(() => {
    fetch(`/api/billing/entitlement`, { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Unable to load billing status.")
        const data = await res.json()
        setEntitlement(data.entitlement || null)
      })
      .catch(() => {
        setErrorMsg("Unable to load billing status. Please refresh.")
        setEntitlement(undefined)
      })
      .finally(() => setEntLoaded(true))
  }, [])

  React.useEffect(() => {
    fetch(`/api/auth/me`, { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) return
        const data = await res.json()
        if (typeof data?.creditsLeft === "number") setUserCredits(data.creditsLeft)
      })
      .catch(() => {})
  }, [])

  const startCheckout = async (targetVariant?: string) => {
    const useVariant = targetVariant || variantId
    if (!useVariant) {
      setErrorMsg("Billing is not configured yet.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/billing/checkout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId: useVariant }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || "Checkout failed")
      if (data.url) window.location.href = data.url
    } catch (err: any) {
      setErrorMsg(err?.message || "Checkout failed")
    } finally {
      setLoading(false)
    }
  }

  const plan = entitlement?.plan || "Free"
  const status = entitlement?.status || "active"
  const creditsLeft =
    typeof entitlement?.creditsLeft === "number"
      ? entitlement.creditsLeft
      : userCredits
  const renewsAt = entitlement?.renewsAt ? new Date(entitlement.renewsAt).toDateString() : null

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0b0b0d] text-white">
      <AccountBackgroundFX />

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-10">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold tracking-tight">Account & Billing</div>
          <Button
            variant="secondary"
            className="h-10 rounded-full bg-white/5 text-white/80 ring-1 ring-white/10 hover:bg-white/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-white/10 bg-white/5 p-6 text-white">
            {errorMsg ? (
              <div className="mb-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
                {errorMsg}
              </div>
            ) : null}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase text-white/50">Plan</div>
                <div className="text-2xl font-semibold">{plan}</div>
                <div className="text-sm text-white/60">Status: {status}</div>
                {renewsAt ? <div className="text-sm text-white/60">Renews: {renewsAt}</div> : null}
                {typeof creditsLeft === "number" ? (
                  <div className="mt-1 text-sm text-emerald-200">Credits left: {creditsLeft}</div>
                ) : null}
              </div>
              <div className="flex gap-2">
                <Button
                  className="rounded-full bg-emerald-500 text-black hover:bg-emerald-400"
                  onClick={() => startCheckout()}
                  disabled={loading}
                  title="Upgrade (checkout via Lemon Squeezy)"
                >
                  {loading ? "Loading…" : "Upgrade"}
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-full bg-white/10 text-white hover:bg-white/20 disabled:cursor-not-allowed"
                  onClick={() => startCheckout(topupVariantId)}
                  disabled={loading || !topupVariantId}
                  title="Buy credits"
                >
                  Buy credits
                </Button>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
              Billing and invoices will appear here after your first payment.
            </div>
          </Card>

          <Card className="border-white/10 bg-white/5 p-6 text-white">
            <div className="text-xs uppercase text-white/50">Credits</div>
            <div className="mt-2 text-sm text-white/70">
              - Generate/remake: 20 credits<br />
              - Analyze: 10 credits<br />
              - Enhance prompt: 4 credits<br />
              - Titles: 5 credits
            </div>
            <div className="mt-4 text-sm text-white/70">
              Credits refresh when your subscription renews. Upgrade to add more.
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function AccountBackgroundFX() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute bottom-10 right-[-120px] h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_45%)]" />
    </div>
  )
}
