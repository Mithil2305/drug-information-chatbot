import { howItWorksSteps } from './homeData'

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-24 px-5 py-16 lg:px-8 bg-surface-warm/40 border-y border-border">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent mb-2">
            RAG Pipeline
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            How Grounded Information Retrieval Works
          </h2>
          <p className="mt-3 text-sm text-fg-secondary">
            A deterministic, five-step verification cycle powers every clinical answer.
          </p>
        </div>

        <div className="relative">
          <div className="absolute top-8 left-0 right-0 h-px bg-border hidden lg:block mx-[10%]" aria-hidden />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
            {howItWorksSteps.map((stepItem, index) => (
              <div key={stepItem.step} className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-surface border-2 border-border shadow-card mb-5 flex-shrink-0">
                  <span className="font-mono text-base font-extrabold text-primary/30">
                    {stepItem.step}
                  </span>
                </div>

                {index < howItWorksSteps.length - 1 && (
                  <div className="absolute top-16 left-1/2 -translate-x-1/2 h-6 w-px bg-border lg:hidden" aria-hidden />
                )}

                <h3 className="text-sm font-bold text-fg mb-2">{stepItem.title}</h3>
                <p className="text-xs leading-relaxed text-fg-secondary">{stepItem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
