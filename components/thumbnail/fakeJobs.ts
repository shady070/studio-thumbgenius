export function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16)
}

export function simulateJob(
  promptId: string,
  onUpdate: (progress: number, imageUrl?: string, score?: number) => void
) {
  let p = 0
  const tick = setInterval(() => {
    p += Math.random() * 9 + 4
    if (p >= 100) {
      clearInterval(tick)
      onUpdate(100, "/demo.avif", 74)
      return
    }
    onUpdate(Math.min(99, p))
  }, 320)

  return () => clearInterval(tick)
}
