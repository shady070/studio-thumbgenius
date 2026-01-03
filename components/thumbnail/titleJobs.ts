import { BrainstormTone, TitleAction, TitleRow } from "./types"
import { uid } from "./fakeJobs"

export function simulateTitleJob(
  promptId: string,
  idea: string,
  onUpdate: (progress: number, titles?: TitleRow[]) => void
) {
  let p = 0
  const tick = setInterval(() => {
    p += Math.random() * 12 + 6
    if (p >= 100) {
      clearInterval(tick)
      const titles = makeThreeTitles(idea)
      onUpdate(100, titles)
      return
    }
    onUpdate(Math.min(99, p))
  }, 240)

  return () => clearInterval(tick)
}

export function simulateTitleAction(original: string, action: TitleAction): string {
  const t = original.trim()

  switch (action) {
    case "reword":
      return reword(t)
    case "shorten":
      return shorten(t)
    case "lengthen":
      return lengthen(t)
    case "emphasize":
      return emphasize(t)
    default:
      return t
  }
}

export function simulateBrainstorm(original: string, tone: BrainstormTone): TitleRow[] {
  const base = original.trim()

  switch (tone) {
    case "Fearful":
      return [
        { id: uid(), text: `This Is Why ${base} Is Terrifying` },
        { id: uid(), text: `You’re Not Ready for ${base}` },
        { id: uid(), text: `${base} Could Happen to You Next` },
      ]
    case "Extreme":
      return [
        { id: uid(), text: `${base} DESTROYED Everything` },
        { id: uid(), text: `The Most INSANE Version of ${base}` },
        { id: uid(), text: `${base} Went Way Too Far…` },
      ]
    case "Clickbait":
      return [
        { id: uid(), text: `I Can’t Believe ${base} Happened…` },
        { id: uid(), text: `${base} (You Won’t Believe #3)` },
        { id: uid(), text: `This Changes Everything About ${base}` },
      ]
    case "Intriguing":
      return [
        { id: uid(), text: `The Hidden Truth Behind ${base}` },
        { id: uid(), text: `What They Don’t Tell You About ${base}` },
        { id: uid(), text: `The Mystery of ${base} Finally Explained` },
      ]
    case "Snappy":
      return [
        { id: uid(), text: `${base}. Explained.` },
        { id: uid(), text: `Inside ${base}` },
        { id: uid(), text: `${base} — The Real Story` },
      ]
    default:
      return []
  }
}

/* helpers */

function makeThreeTitles(idea: string): TitleRow[] {
  const cleaned = idea.replace(/\s+/g, " ").trim()
  const seed = cleaned.length ? cleaned : "This Happened"

  return [
    { id: uid(), text: `What Really Happened When ${seed}` },
    { id: uid(), text: `The Untold Truth Behind ${seed}` },
    { id: uid(), text: `How ${seed} Changed Everything (Nobody Saw It Coming)` },
  ]
}

function reword(t: string) {
  if (t.toLowerCase().includes("what really happened")) {
    return t.replace(/What Really Happened/i, "Here’s What Actually Happened")
  }
  return `Here’s the Truth: ${t}`
}

function shorten(t: string) {
  return t.length > 62 ? t.slice(0, 60).trimEnd() + "…" : t
}

function lengthen(t: string) {
  return `${t} — Full Breakdown`
}

function emphasize(t: string) {
  if (t.includes("!")) return t
  return `${t} (INSANE!)`
}
