import { Activity } from 'lucide-react'

export function AuthBrandPanel() {
  return (
    <div className="relative hidden h-full w-1/2 overflow-hidden bg-surface lg:flex">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-primary)_0%,_transparent_50%)] opacity-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--color-ai)_0%,_transparent_50%)] opacity-10" />

      <div className="absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div
        className="absolute bottom-1/4 right-1/4 h-80 w-80 translate-x-1/3 translate-y-1/3 rounded-full bg-ai/20 blur-3xl"
        style={{ animationDuration: '3s' }}
      />

      <div className="absolute left-16 top-24 h-16 w-16 rotate-45 rounded-lg border border-primary/30 bg-surface-highlight/40" />
      <div className="absolute bottom-32 right-20 h-20 w-20 rounded-full border border-ai/30 bg-surface-highlight/40" />

      <div className="absolute left-1/2 top-1/2 h-px w-48 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-primary to-transparent opacity-40" />
      <div className="absolute left-1/2 top-1/2 h-48 w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-ai to-transparent opacity-40" />

      <div className="absolute right-12 top-1/3 h-32 w-1 bg-gradient-to-b from-transparent via-primary to-transparent" />
      <div className="absolute bottom-1/4 left-12 h-1 w-32 bg-gradient-to-r from-transparent via-ai to-transparent" />

      <div className="absolute left-1/2 top-1/2 z-10 flex w-full max-w-md -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-surface-highlight/50 shadow-[0_0_40px_-10px_var(--color-primary)]">
          <Activity className="h-8 w-8 text-primary" aria-hidden="true" />
        </div>
        <h2 className="mb-3 text-3xl font-semibold text-fg">LabelProof</h2>
        <p className="text-base leading-relaxed text-fg-muted">
          Trusted answers from trusted drug information.
        </p>
        <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-line bg-surface-highlight/50 px-4 py-2 text-sm text-fg-muted">
          <span className="h-2 w-2 rounded-full bg-success" />
          Evidence-first, always verified
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 text-center text-xs text-fg-muted">
        © 2026 LabelProof. All rights reserved.
      </div>
    </div>
  )
}
