import { Accordion } from '../common/Accordion'
import { faqItems } from './homeData'

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-24 px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent mb-2">
            Frequently Asked Questions
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            Everything you need to know
          </h2>
        </div>

        <Accordion items={faqItems} defaultOpenId="faq-1" />
      </div>
    </section>
  )
}
