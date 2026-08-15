import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Check, CheckCircle2, BookOpen, ExternalLink } from 'lucide-react'
import { verificationFeatures } from './homeData'

export function VerificationSection() {
  return (
    <section id="verification" className="scroll-mt-24 px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          {/* Left: Feature list */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent mb-3">
              Source Transparency
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl leading-tight">
              Always know where every answer originated.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-fg-secondary">
              Unlike generic chatbots that guess, MediMei pins every clinical statement to the official Prescribing Information PDF.
            </p>

            <ul className="mt-8 space-y-3.5">
              {verificationFeatures.map((feat) => (
                <li key={feat} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                    <Check className="h-3 w-3" />
                  </div>
                  <span className="text-sm font-medium text-fg">{feat}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9">
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 rounded-pill bg-primary px-6 py-3 text-sm font-bold text-white shadow-card hover:bg-primary-hover transition-all duration-200 active:scale-[0.97]"
              >
                <span>Test Source Verification</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right: Interactive Sample Card */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-hover space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <Sparkles className="h-4 w-4 text-accent" />
                <span>Sample Query Result</span>
              </div>
              <span className="rounded-pill bg-success/10 px-2.5 py-0.5 text-[10px] font-bold text-success">
                100% Grounded
              </span>
            </div>

            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-fg-muted">Question</p>
              <div className="rounded-xl bg-surface-highlight border border-border/60 p-3 text-xs font-medium text-fg">
                "What is the recommended dosage of RINVOQ for Rheumatoid Arthritis?"
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-fg-muted">AI Clinical Response</p>
              <div className="rounded-xl border border-border bg-surface p-4 text-xs leading-relaxed text-fg space-y-2">
                <p>
                  The recommended dosage of <strong className="text-primary font-bold">RINVOQ (upadacitinib)</strong> for moderate to severe rheumatoid arthritis is <strong className="text-primary font-bold">15 mg orally once daily</strong>.
                </p>
                <p className="text-fg-secondary">
                  It may be used as monotherapy or in combination with methotrexate or other nonbiologic DMARDs.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-fg">RINVOQ Prescribing Information</span>
                </div>
                <span className="shrink-0 rounded-pill bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  Page 12
                </span>
              </div>
              <p className="text-[11px] font-semibold text-accent mb-1.5">
                § 2.1 Recommended Dosage — Rheumatoid Arthritis
              </p>
              <p className="text-[11px] italic text-fg-secondary border-l-2 border-primary/25 pl-2.5 leading-relaxed">
                "RINVOQ 15 mg once daily with or without food. Discontinue if serious infection occurs..."
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-success">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified Source
                </span>
                <button type="button" className="text-[10px] font-bold text-accent hover:underline inline-flex items-center gap-0.5">
                  <span>View Source</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
