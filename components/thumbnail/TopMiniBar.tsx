"use client"

import * as React from "react"

type Entitlement = {
  plan?: string
  status?: string
}

export function TopMiniBar({ creditsLeft }: { creditsLeft: number }) {
  const topupVariantId = process.env.NEXT_PUBLIC_LS_TOPUP_VARIANT_ID || ""
  const [entitlement, setEntitlement] = React.useState<Entitlement | null>(null)
  const [busy, setBusy] = React.useState(false)

  React.useEffect(() => {
    fetch(`/api/billing/entitlement`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setEntitlement(data.entitlement || null))
      .catch(() => {})
  }, [])

  const startCheckout = async (variantId?: string) => {
    if (!variantId) return
    setBusy(true)
    try {
      const res = await fetch(`/api/billing/checkout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId }),
      })
      const data = await res.json()
      if (data?.url) window.location.href = data.url
    } finally {
      setBusy(false)
    }
  }

  const plan = entitlement?.plan || "Free"
  const status = entitlement?.status || "active"

  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/80 backdrop-blur">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        {plan} <span className="text-white/40">•</span> {status}
      </div>

      <div className="flex items-center gap-2 text-xs text-white/60">
        <span className="font-semibold text-white">{creditsLeft}</span> credits left
        <button
          className="rounded-full bg-emerald-500 px-2 py-1 text-[11px] font-semibold text-black hover:bg-emerald-400 disabled:opacity-60"
          onClick={() => startCheckout(topupVariantId)}
          disabled={busy || !topupVariantId}
          title="Buy credits"
        >
          Buy credits
        </button>
      </div>
    </div>
  )
}
