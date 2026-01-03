"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"

type Mode = "login" | "signup"

export default function AuthPage() {
  const router = useRouter()

  const [mode, setMode] = useState<Mode>("login")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const endpoint = useMemo(() => {
    return mode === "login" ? "/api/auth/login" : "/api/auth/register"
  }, [mode])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    setLoading(true)
    try {
      const body =
        mode === "login"
          ? { email, password }
          : { email, username: username || undefined, password }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data?.message || data?.error || "Auth failed")
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

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>{mode === "login" ? "Login" : "Create account"}</h1>
        <p style={styles.subtitle}>
          {mode === "login" ? "Sign in to continue to Studio." : "Sign up to start using the app."}
        </p>

        <form onSubmit={onSubmit} style={styles.form}>
          <label style={styles.label}>
            Email
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </label>

          {mode === "signup" && (
            <label style={styles.label}>
              Username (optional)
              <input
                style={styles.input}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="yourname"
              />
            </label>
          )}

          <label style={styles.label}>
            Password
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              placeholder="••••••••"
            />
          </label>

          {error && <div style={styles.error}>{error}</div>}

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Sign up"}
          </button>
        </form>

        <div style={styles.footer}>
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button style={styles.linkBtn} onClick={() => setMode("signup")} type="button">
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button style={styles.linkBtn} onClick={() => setMode("login")} type="button">
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 24,
    background: "#0b1220",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "white",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  },
  title: { fontSize: 28, margin: 0 },
  subtitle: { marginTop: 8, marginBottom: 20, color: "#475569" },
  form: { display: "grid", gap: 12 },
  label: { display: "grid", gap: 6, fontSize: 14, color: "#0f172a" },
  input: {
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: "10px 12px",
    outline: "none",
    fontSize: 14,
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "10px 12px",
    borderRadius: 10,
    fontSize: 14,
  },
  button: {
    marginTop: 6,
    border: "none",
    borderRadius: 12,
    padding: "12px 14px",
    fontSize: 15,
    cursor: "pointer",
    background: "#2563eb",
    color: "white",
    fontWeight: 600,
  },
  footer: { marginTop: 16, fontSize: 14, color: "#334155" },
  linkBtn: {
    border: "none",
    background: "transparent",
    color: "#2563eb",
    cursor: "pointer",
    padding: 0,
    fontSize: 14,
    fontWeight: 600,
  },
}
