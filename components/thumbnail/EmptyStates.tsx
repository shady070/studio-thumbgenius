"use client"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <div className="text-base font-semibold text-white/90">Start with a prompt</div>
      <div className="max-w-md text-sm text-white/55">
        Pick a persona + style, write a prompt, and the image will arrive here.
      </div>
    </div>
  )
}

export function EditEmptyState() {
  return null
}

export function TitleEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <div className="text-base font-semibold text-white/90">Create titles for your video</div>
      <div className="max-w-md text-sm text-white/55">
        Describe your video idea below and I’ll generate title options.
      </div>
    </div>
  )
}
