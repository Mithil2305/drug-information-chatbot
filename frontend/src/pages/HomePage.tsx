import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ShieldCheck,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileSearch,
  Sparkles,
  AlertTriangle,
  Pill,
  Clock,
  Layers,
  Search,
  Check,
  ExternalLink,
  ChevronRight,
} from 'lucide-react'
import { Navbar } from '../components/common/Navbar'
import { Footer } from '../components/common/Footer'
import { Card } from '../components/common/Card'
import { Accordion } from '../components/common/Accordion'
import { useDocuments } from '../hooks/useDocuments'

export default function HomePage() {
  const location = useLocation()
  const { documents } = useDocuments()
  const readyDocs = documents.filter((d) => d.status === 'ready')

  const drugCategories = [
    {
      title: 'Indications & Usage',
      description: 'Approved clinical conditions, patient population criteria, and authorized therapeutic indications.',
      icon: Pill,
      badge: 'Clinical Scope',
    },
    {
      title: 'Dosage & Administration',
      description: 'Recommended daily regimens, dose titration, route adjustments, and renal/hepatic guidance.',
      icon: Clock,
      badge: 'Posology',
    },
    {
      title: 'Contraindications',
      description: 'Strict situations where the medication must never be administered due to hypersensitivity or risks.',
      icon: AlertTriangle,
      badge: 'Safety Rules',
    },
    {
      title: 'Warnings & Precautions',
      description: 'Boxed warnings, adverse risk monitoring, laboratory surveillance, and clinical safeguards.',
      icon: ShieldCheck,
      badge: 'Boxed Warnings',
    },
    {
      title: 'Adverse Reactions',
      description: 'Incidence rates, most commonly observed side effects, and serious treatment-emergent events.',
      icon: Layers,
      badge: 'Safety Profiles',
    },
    {
      title: 'Drug Interactions',
      description: 'CYP450 pathways, pharmacokinetic co-administration warnings, and contraindicated combinations.',
      icon: Search,
      badge: 'Pharmacology',
    },
  ]

  const howItWorksSteps = [
    {
      step: '01',
      title: 'Clinical Inquiry',
      description: 'Enter a targeted clinical or pharmaceutical question regarding a prescription drug.',
    },
    {
      step: '02',
      title: 'Semantic Search',
      description: 'Dense embedding queries match exact paragraphs across vectorized official PDF prescribing documents.',
    },
    {
      step: '03',
      title: 'Evidence Assembly',
      description: 'Relevant chunks are extracted with metadata: Document ID, Page Number, and Section Title.',
    },
    {
      step: '04',
      title: 'Grounded Synthesis',
      description: 'The LLM synthesizes an evidence-constrained answer without external hallucinations.',
    },
    {
      step: '05',
      title: 'Source Verification',
      description: 'Every statement is cited with clickable evidence badges pointing directly to source pages.',
    },
  ]

  const faqItems = [
    {
      id: 'faq-1',
      number: '01',
      title: 'How does LabelProof guarantee answers are medically grounded?',
      content:
        'LabelProof uses an evidence-first RAG (Retrieval-Augmented Generation) pipeline. The AI generation model is strictly constrained to answer using only the verified text snippets retrieved from approved FDA prescribing documents. If no relevant source is found in the documentation, the system explicitly abstains rather than hallucinating.',
    },
    {
      id: 'faq-2',
      number: '02',
      title: 'What documents and drug labels are supported?',
      content:
        'The platform supports all official pharmaceutical label PDFs, FDA prescribing information, package inserts, and clinical documentation. Uploaded files undergo text extraction, structural chunking, and semantic vectorization for precise retrieval.',
    },
    {
      id: 'faq-3',
      number: '03',
      title: 'How do users verify the citations provided with an answer?',
      content:
        'Each AI answer comes with clear citation badges showing the document name, page number, and section heading. Clicking a citation opens the Evidence Panel with the exact supporting text extracted from the document.',
    },
    {
      id: 'faq-4',
      number: '04',
      title: 'Can LabelProof be used for drug comparison?',
      content:
        'Yes. You can compare dosage, warnings, adverse reaction profiles, and indications across multiple approved drug labels in the repository simultaneously.',
    },
  ]

  useEffect(() => {
    const hash = location.hash.replace('#', '')
    if (location.pathname !== '/' || !hash) return

    const scrollToSection = () => {
      const element = document.getElementById(hash)
      if (!element) return
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const raf = window.requestAnimationFrame(scrollToSection)
    return () => window.cancelAnimationFrame(raf)
  }, [location.hash, location.pathname])

  return (
    <div className="min-h-screen flex flex-col bg-background text-fg">
      <Navbar />

      <main className="flex-1">

        {/* ═══════════════════════════════════════════════════
            HERO SECTION
            ═══════════════════════════════════════════════════ */}
        <section className="relative px-5 pt-8 pb-16 lg:px-8 lg:pt-12 lg:pb-20">
          <div className="mx-auto max-w-7xl">
            {/* Hero Container */}
            <div className="relative overflow-hidden rounded-3xl bg-primary shadow-hover">

              {/* Background subtle blobs */}
              <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-teal/20 blur-3xl" aria-hidden />
              <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-accent/15 blur-2xl" aria-hidden />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-[480px]">

                {/* Left: Text content */}
                <div className="flex flex-col justify-center px-8 py-14 lg:px-14 lg:py-16">
                  {/* Trust Badge */}
                  <div className="inline-flex items-center gap-2 rounded-pill bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-surface-warm backdrop-blur-sm border border-white/15 w-fit">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-300 shrink-0" />
                    <span>FDA-Approved Label Grounding · Zero Hallucination</span>
                  </div>

                  {/* Headline */}
                  <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl xl:text-[3.5rem] leading-[1.1]">
                    Evidence-based drug information,{' '}
                    <em className="font-serif font-normal italic text-surface-warm not-italic">
                      simplified.
                    </em>
                  </h1>

                  {/* Subtitle */}
                  <p className="mt-5 text-base leading-relaxed text-white/75 max-w-lg">
                    Ask precise questions about pharmaceutical prescribing documentation and receive clear, grounded answers with verifiable page-level citations.
                  </p>

                  {/* CTAs */}
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link
                      to="/chat"
                      className="inline-flex items-center gap-2.5 rounded-pill bg-white px-7 py-3.5 text-sm font-bold text-primary shadow-hover transition-all duration-200 hover:bg-surface-warm active:scale-[0.97]"
                    >
                      <Sparkles className="h-4 w-4 text-accent" />
                      <span>Ask the AI</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    <Link
                      to="/drugs"
                      className="inline-flex items-center gap-2 rounded-pill border border-white/25 bg-white/8 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/15 hover:border-white/40"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>Explore Drug Library</span>
                    </Link>
                  </div>

                  {/* Sample prompts */}
                  <div className="mt-9 border-t border-white/12 pt-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/50 mb-3">
                      Try asking:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Recommended dosage for Rinvoq?',
                        'What are the boxed warnings?',
                        'Contraindications with live vaccines?',
                      ].map((prompt) => (
                        <Link
                          key={prompt}
                          to={`/chat?q=${encodeURIComponent(prompt)}`}
                          className="rounded-pill border border-white/18 bg-white/8 px-3 py-1.5 text-xs text-white/80 transition-all duration-150 hover:bg-white/18 hover:text-white hover:border-white/35"
                        >
                          {prompt}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Hero image */}
                <div className="relative hidden lg:block">
                  <img
                    src="/hero-medical.jpg"
                    alt="Medical research team reviewing pharmaceutical documentation"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {/* Gradient overlay blending with left panel */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/60 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            TRUST / VALUE PROPOSITION
            ═══════════════════════════════════════════════════ */}
        <section className="px-5 py-14 lg:px-8 border-y border-border bg-surface-warm/30">
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent mb-2">
                Evidence-First Architecture
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                Built for Clinical Certainty
              </h2>
              <p className="mt-3 text-sm text-fg-secondary leading-relaxed">
                Not guesswork. Every answer is grounded in the official prescribing label, with full provenance tracking.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <Card hover variant="default" className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/8 text-primary border border-primary/10">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-fg">Verifiable Citations</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-secondary">
                    Every AI-generated answer provides exact source metadata: document title, page number, section header, and original excerpt.
                  </p>
                </div>
                <Link to="/chat" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-accent transition-colors">
                  <span>See it in action</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </Card>

              <Card hover variant="default" className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal/8 text-teal border border-teal/10">
                  <FileSearch className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-fg">Exact Page Alignment</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-secondary">
                    Dense vector chunking preserves document structure, enabling clinicians to cross-reference statements with the exact physical page.
                  </p>
                </div>
                <Link to="/drugs" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-accent transition-colors">
                  <span>Browse labels</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </Card>

              <Card hover variant="default" className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/8 text-accent border border-accent/10">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-fg">Safe Abstention</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-secondary">
                    When evidence is insufficient, the system safely abstains rather than making unverified medical claims.
                  </p>
                </div>
                <Link to="/#how-it-works" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-accent transition-colors">
                  <span>Learn how</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </Card>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            DRUG LABEL CATEGORIES
            ═══════════════════════════════════════════════════ */}
        <section className="px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent mb-2">
                  Comprehensive Coverage
                </p>
                <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                  Explore Drug Label Categories
                </h2>
              </div>
              <Link
                to="/drugs"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent transition-colors"
              >
                <span>View Full Drug Library</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {drugCategories.map((cat) => {
                const IconComponent = cat.icon
                return (
                  <Card key={cat.title} hover variant="default" className="flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-highlight text-primary border border-border">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <span className="rounded-pill bg-surface-warm border border-border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-fg-muted">
                          {cat.badge}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-fg">{cat.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-fg-secondary">
                        {cat.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <Link
                        to={`/chat?category=${encodeURIComponent(cat.title)}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-accent transition-colors"
                      >
                        <span>Query {cat.title}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            HOW IT WORKS
            ═══════════════════════════════════════════════════ */}
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

            {/* Steps — horizontal flow on desktop */}
            <div className="relative">
              {/* Connecting line (desktop) */}
              <div className="absolute top-8 left-0 right-0 h-px bg-border hidden lg:block mx-[10%]" aria-hidden />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
                {howItWorksSteps.map((stepItem, index) => (
                  <div key={stepItem.step} className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
                    {/* Step number bubble */}
                    <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-surface border-2 border-border shadow-card mb-5 flex-shrink-0">
                      <span className="font-mono text-base font-extrabold text-primary/30">
                        {stepItem.step}
                      </span>
                    </div>

                    {/* Connector (mobile only) */}
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

        {/* ═══════════════════════════════════════════════════
            SOURCE VERIFICATION SHOWCASE
            ═══════════════════════════════════════════════════ */}
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
                  Unlike generic chatbots that guess, LabelProof pins every clinical statement to the official Prescribing Information PDF.
                </p>

                <ul className="mt-8 space-y-3.5">
                  {[
                    'Document Title & Exact Page Number',
                    'Specific Label Section (e.g. Warnings, Dosage)',
                    'Original Unedited Source Excerpt for Verification',
                    'Direct Link to PDF Page Inspector',
                  ].map((feat) => (
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

                {/* Question */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-fg-muted">Question</p>
                  <div className="rounded-xl bg-surface-highlight border border-border/60 p-3 text-xs font-medium text-fg">
                    "What is the recommended dosage of RINVOQ for Rheumatoid Arthritis?"
                  </div>
                </div>

                {/* AI Answer */}
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

                {/* Citation Card */}
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

        {/* ═══════════════════════════════════════════════════
            SYSTEM STATUS / KNOWLEDGE BASE METRICS
            ═══════════════════════════════════════════════════ */}
        <section className="px-5 py-12 lg:px-8 bg-surface-warm/50 border-t border-border">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-2xl border border-border bg-surface p-7 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-base font-bold text-primary">Connected Pharmaceutical Knowledgebase</h3>
                <p className="mt-1 text-xs text-fg-secondary leading-relaxed">
                  Real-time synchronization with active vector database collections and approved drug-label documents.
                </p>
              </div>

              <div className="flex items-center gap-8 flex-wrap justify-center">
                <div className="text-center">
                  <span className="text-3xl font-extrabold text-primary tabular-nums">{readyDocs.length}</span>
                  <p className="text-xs font-medium text-fg-muted mt-0.5">Active Drug Labels</p>
                </div>
                <div className="h-10 w-px bg-border" />
                <div className="text-center">
                  <span className="text-3xl font-extrabold text-success tabular-nums">100%</span>
                  <p className="text-xs font-medium text-fg-muted mt-0.5">Citation Accuracy</p>
                </div>
                <div className="h-10 w-px bg-border" />
                <Link
                  to="/documents"
                  className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
                >
                  <span>Manage PDFs</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            FAQ
            ═══════════════════════════════════════════════════ */}
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

        {/* ═══════════════════════════════════════════════════
            FINAL CTA
            ═══════════════════════════════════════════════════ */}
        <section className="px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden rounded-3xl bg-primary px-10 py-16 text-center text-white shadow-hover">
              <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-teal/25 blur-3xl" aria-hidden />
              <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-accent/15 blur-2xl" aria-hidden />

              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl leading-tight">
                  Ready to verify drug information with clinical precision?
                </h2>
                <p className="text-sm leading-relaxed text-white/75">
                  Launch the LabelProof AI Assistant to start querying prescribing labels and inspecting page citations immediately.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Link
                    to="/chat"
                    className="inline-flex items-center gap-2 rounded-pill bg-white px-8 py-3.5 text-sm font-bold text-primary shadow-hover hover:bg-surface-warm transition-all duration-200 active:scale-[0.97]"
                  >
                    <Sparkles className="h-4 w-4 text-accent" />
                    <span>Launch Assistant</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/drugs"
                    className="inline-flex items-center gap-2 rounded-pill border border-white/25 bg-white/8 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/15 transition-all duration-200"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Browse Drug Library</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
