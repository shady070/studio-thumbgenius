"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Mode = "login" | "signup" | "verify"

export default function AuthPage() {
  const router = useRouter()

  const [mode, setMode] = useState<Mode>("login")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const endpoint = useMemo(() => {
    if (mode === "login") return "/api/auth/login"
    if (mode === "signup") return "/api/auth/register"
    return "/api/auth/verify"
  }, [mode])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    setLoading(true)
    try {
    const body =
      mode === "login"
        ? { email, password }
        : mode === "signup"
        ? { email, username: username || undefined, password }
        : { email, code }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        const msg = data?.message || data?.error || "Auth failed"
        if (data?.code === "EMAIL_NOT_VERIFIED" || msg.toLowerCase().includes("not verified")) {
          setMode("verify")
          setError("Verify your email to continue.")
          return
        }
        setError(msg)
        return
      }

      if (data?.requiresVerification || mode === "signup") {
        setMode("verify")
        setError("We sent a verification code to your email.")
        return
      }

      router.replace("/studio")
      router.refresh()
    } catch (err: any) {
      setError(err?.message || "Network error")
    } finally {
      setLoading(false)
    }
  }

  async function onResend() {
    if (!email) {
      setError("Enter your email first.")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/auth/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message || "Failed to resend code")
      setError("Verification code sent.")
    } catch (err: any) {
      setError(err?.message || "Failed to resend code")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0b0b0d] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/15 blur-[120px]" />
        <div className="absolute bottom-[-120px] right-[-120px] h-96 w-96 rounded-full bg-blue-500/15 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_45%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-12">
        <Card className="w-full max-w-lg border-white/10 bg-white/5 p-6 text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-xl ring-1 ring-white/10 bg-white/5">
                <img src="/logo.svg" alt="ThumbGenius logo" className="h-full w-full object-contain" />
              </div>
              <div>
                <div className="text-sm text-white/50">ThumbGenius</div>
                <div className="text-lg font-semibold">Studio Access</div>
              </div>
            </div>

            {mode !== "verify" ? (
              <div className="flex rounded-full bg-white/5 p-1 ring-1 ring-white/10">
                <button
                  type="button"
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold transition",
                    mode === "login" ? "bg-white/15 text-white" : "text-white/50 hover:text-white"
                  )}
                  onClick={() => setMode("login")}
                >
                  Login
                </button>
                <button
                  type="button"
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold transition",
                    mode === "signup" ? "bg-white/15 text-white" : "text-white/50 hover:text-white"
                  )}
                  onClick={() => setMode("signup")}
                >
                  Sign up
                </button>
              </div>
            ) : null}
          </div>

          <div className="mt-6">
            <h1 className="text-2xl font-semibold">
              {mode === "login" ? "Welcome back" : mode === "signup" ? "Create your account" : "Verify your email"}
            </h1>
            <p className="mt-2 text-sm text-white/60">
              {mode === "login"
                ? "Sign in to continue to the studio."
                : mode === "signup"
                ? "Get 100 free credits once your email is verified."
                : "Enter the 6-digit code we sent to your inbox."}
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase text-white/50">Email</label>
              <Input
                className="h-11 rounded-xl border-white/10 bg-black/40 text-white placeholder:text-white/35"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
            </div>

            {mode === "signup" ? (
              <div className="space-y-2">
                <label className="text-xs uppercase text-white/50">Username (optional)</label>
                <Input
                  className="h-11 rounded-xl border-white/10 bg-black/40 text-white placeholder:text-white/35"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  placeholder="Your name"
                />
              </div>
            ) : null}

            {mode !== "verify" ? (
              <div className="space-y-2">
                <label className="text-xs uppercase text-white/50">Password</label>
                <Input
                  className="h-11 rounded-xl border-white/10 bg-black/40 text-white placeholder:text-white/35"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  placeholder="••••••••"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-xs uppercase text-white/50">Verification code</label>
                <Input
                  className="h-11 rounded-xl border-white/10 bg-black/40 text-white placeholder:text-white/35"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  placeholder="123456"
                  inputMode="numeric"
                />
              </div>
            )}

            {error ? (
              <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
                {error}
              </div>
            ) : null}

            <Button
              className="h-11 w-full rounded-xl bg-emerald-500 text-black hover:bg-emerald-400"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Login"
                : mode === "signup"
                ? "Sign up"
                : "Verify"}
            </Button>
          </form>

          <div className="mt-4 flex flex-wrap items-center justify-between text-sm text-white/60">
            {mode === "verify" ? (
              <>
                <button
                  type="button"
                  className="text-emerald-300 hover:text-emerald-200"
                  onClick={onResend}
                >
                  Resend code
                </button>
                <button
                  type="button"
                  className="text-white/70 hover:text-white"
                  onClick={() => setMode("login")}
                >
                  Back to login
                </button>
              </>
            ) : mode === "login" ? (
              <>
                <span>New here?</span>
                <button
                  type="button"
                  className="text-emerald-300 hover:text-emerald-200"
                  onClick={() => setMode("signup")}
                >
                  Create account
                </button>
              </>
            ) : (
              <>
                <span>Already have an account?</span>
                <button
                  type="button"
                  className="text-emerald-300 hover:text-emerald-200"
                  onClick={() => setMode("login")}
                >
                  Login
                </button>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
