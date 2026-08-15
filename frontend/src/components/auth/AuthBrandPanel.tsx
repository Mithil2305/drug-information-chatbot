import { CheckCircle2, FileText, Shield } from 'lucide-react'

const FEATURES = [
  {
    icon: FileText,
    title: 'Evidence-first answers',
    description: 'Every response is grounded in uploaded drug-label documents.',
  },
  {
    icon: CheckCircle2,
    title: 'Page-level citations',
    description: 'Click any citation to jump directly to the source page.',
  },
  {
    icon: Shield,
    title: 'Approved drug-label sources',
    description: 'Built on verified regulatory documents, not general web data.',
  },
]

export function AuthBrandPanel() {
  return (
    <div className="relative hidden flex-1 flex-col justify-center overflow-hidden bg-surface lg:flex border-l border-line">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--color-foreground) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      {/* Subtle top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-1 bg-primary"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-start justify-center px-12 xl:px-16">
        {/* Logo Mark */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary mb-6">
          <FileText className="h-6 w-6 text-white" aria-hidden="true" />
        </div>

        {/* Brand */}
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-fg">
          LabelProof
        </h2>
        <p className="mb-10 max-w-sm text-sm leading-relaxed text-fg-muted">
          Trusted drug information backed by source evidence.
          Ask questions, get grounded answers, verify with citations.
        </p>

        {/* Feature List */}
        <div className="flex flex-col gap-5 max-w-sm">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft mt-0.5">
                <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium text-fg leading-snug">{title}</p>
                <p className="mt-0.5 text-xs text-fg-muted leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-10 inline-flex items-center gap-2 rounded-lg border border-line bg-surface-highlight px-3 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
          <span className="text-xs font-medium text-fg-muted">
            Evidence-first · Always verified
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 px-12 xl:px-16">
        <p className="text-xs text-fg-subtle">
          © 2026 LabelProof. All rights reserved.
        </p>
      </div>
    </div>
  )
}
