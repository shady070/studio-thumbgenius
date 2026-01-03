export type Persona = { id: string; name: string; avatarUrl?: string }
export type Style = { id: string; name: string; thumbUrl?: string }

export type Mode = "prompt" | "edit" | "title" | "analyze"

export type MsgMeta = {
  personaId?: string | null
  styleId?: string | null
  mode?: Mode
}

export type TitleAction = "reword" | "shorten" | "lengthen" | "emphasize"

export type BrainstormTone =
  | "Fearful"
  | "Extreme"
  | "Clickbait"
  | "Intriguing"
  | "Snappy"

export type TitleRow = {
  id: string
  text: string
}

/** Demo data — replace with DB */
export const DEMO_PERSONAS: Persona[] = []
export const DEMO_STYLES: Style[] = []

export const CREDITS = {
  generate: 20,
  remake: 20,
  analyze: 10,
  enhance: 4,
  titles: 5,
  fix: 0,
  edit: 0,
  compare: 0,
  redo: 0,
  title: 0,
  brainstorm: 0,
  tweak: 0,
} as const

/** Discriminated assistant message types */
export type AssistantImageMsg = {
  id: string
  role: "assistant"
  promptId: string
  status: "generating" | "done"
  progress: number
  createdAt: number

  kind: "image"
  imageUrl?: string
  score?: number
}

export type AssistantTitleMsg = {
  id: string
  role: "assistant"
  promptId: string
  status: "generating" | "done"
  progress: number
  createdAt: number

  kind: "titles"
  titles: TitleRow[]
}

export type AssistantAnalysisMsg = {
  id: string
  role: "assistant"
  promptId: string
  status: "generating" | "done"
  progress: number
  createdAt: number

  kind: "analysis"
  text?: string
}

export type UserMsg = {
  id: string
  role: "user"
  text: string
  createdAt: number
  meta?: MsgMeta
  imageUrl?: string;
}

export type ChatMsg = UserMsg | AssistantImageMsg | AssistantTitleMsg | AssistantAnalysisMsg
