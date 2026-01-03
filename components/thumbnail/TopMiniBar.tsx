"use client"

import * as React from "react"

type Entitlement = {
  plan?: string
  status?: string
}

export function TopMiniBar({ creditsLeft }: { creditsLeft: number }) {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_BASE_URL || ""
  const topupVariantId = process.env.NEXT_PUBLIC_LS_TOPUP_VARIANT_ID || ""
  const paidVariantId =
    process.env.NEXT_PUBLIC_LS_PAID_VARIANT_ID ||
    process.env.NEXT_PUBLIC_LS_VARIANT_ID ||
    ""
  const [entitlement, setEntitlement] = React.useState<Entitlement | null>(null)
  const [busy, setBusy] = React.useState(false)

  React.useEffect(() => {
    if (!apiBase) return
    fetch(`${apiBase}/billing/entitlement`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setEntitlement(data.entitlement || null))
      .catch(() => {})
  }, [apiBase])

  const startCheckout = async (variantId?: string) => {
    if (!apiBase || !variantId) return
    setBusy(true)
    try {
      const res = await fetch(`${apiBase}/billing/checkout`, {
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

  const endTrialAndPay = async () => {
    await startCheckout(paidVariantId)
  }

  const plan = entitlement?.plan || "Free Trial"
  const status = entitlement?.status || "active"
  const showEndTrial = plan?.toLowerCase?.() === "trial"
  const buyDisabled = showEndTrial

  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/80 backdrop-blur">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        {plan} <span className="text-white/40">•</span> {status}
      </div>

      <div className="flex items-center gap-2 text-xs text-white/60">
        <span className="font-semibold text-white">{creditsLeft}</span> credits left
        {showEndTrial ? (
          <button
            className="rounded-full bg-white/10 px-2 py-1 text-[11px] text-white hover:bg-white/20 disabled:opacity-60"
            onClick={endTrialAndPay}
            disabled={busy}
            title="End trial and start paid plan (payment via Lemon)"
          >
            End trial & pay now
          </button>
        ) : null}
        <button
          className="rounded-full bg-emerald-500 px-2 py-1 text-[11px] font-semibold text-black hover:bg-emerald-400 disabled:opacity-60"
          onClick={() => startCheckout(topupVariantId)}
          disabled={busy || !topupVariantId || buyDisabled}
          title={buyDisabled ? "Buy credits is available after trial ends" : "Buy credits"}
        >
          Buy credits
        </button>
      </div>
    </div>
  )
}
