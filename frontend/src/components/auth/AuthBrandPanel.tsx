import { ShieldCheck, CheckCircle2 } from 'lucide-react'

export function AuthBrandPanel() {
  return (
    <div className="relative hidden h-full w-1/2 overflow-hidden bg-primary text-white lg:flex flex-col justify-between p-12 lg:p-16">
      {/* Background blurs */}
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-teal/40 blur-3xl" />
      <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-accent/30 blur-3xl" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal text-white shadow-card">
          <ShieldCheck className="h-6 w-6 text-surface-warm" />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight">LabelProof</span>
          <span className="block text-[10px] uppercase tracking-wider text-surface-warm/80">Clinical AI</span>
        </div>
      </div>

      {/* Center Value Prop */}
      <div className="relative z-10 max-w-md space-y-6">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl leading-tight">
          Evidence-First Drug Information, Grounded in Official Labels.
        </h2>
        <p className="text-sm leading-relaxed text-white/80">
          Access verified pharmaceutical prescribing guidelines, dosage regimens, warnings, and adverse reactions with exact page-level citations.
        </p>

        <div className="space-y-3 pt-2">
          {[
            'FDA Prescribing Information Grounding',
            'Zero-Hallucination Safe Abstention Rules',
            'Verifiable Page & Section Citations',
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/20 text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-semibold text-white/90">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-xs text-white/60">
        © {new Date().getFullYear()} LabelProof. Cognizant NPN Healthcare AI Initiative.
      </div>
    </div>
  )
}

export default AuthBrandPanel
