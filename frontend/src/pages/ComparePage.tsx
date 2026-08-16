import { useCallback, useEffect, useState } from 'react'
import { ShieldCheck, Loader2 } from 'lucide-react'
import { ChatLayout } from '../components/layout/ChatLayout'
import { DrugSelector } from '../components/compare/DrugSelector'
import { ComparisonTable } from '../components/compare/ComparisonTable'
import { ComparisonEmptyState } from '../components/compare/ComparisonEmptyState'
import { ComparisonSkeleton } from '../components/compare/ComparisonSkeleton'
import { ComparisonError } from '../components/compare/ComparisonError'
import { useDocuments } from '../hooks/useDocuments'
import { useChat } from '../hooks/useChat'
import { compareDrugs } from '../services/comparisonService'
import type { ComparisonResult, ComparisonCitation } from '../types/comparison'
import medicalDocumentsImage from '../assets/documents.png';


export default function ComparePage() {
  const { documents } = useDocuments()
  const { setSelectedCitation } = useChat()

  const readyDocs = documents.filter((d) => d.status === 'ready')

  const [drug1Id, setDrug1Id] = useState<string | null>(null)
  const [drug2Id, setDrug2Id] = useState<string | null>(null)
  const [result, setResult] = useState<ComparisonResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationMsg, setValidationMsg] = useState<string | null>(null)

  // Invalidate previous comparison when either drug changes
  useEffect(() => {
    setResult(null)
    setError(null)
    setValidationMsg(null)
  }, [drug1Id, drug2Id])

  const handleSwap = useCallback(() => {
    setDrug1Id(drug2Id)
    setDrug2Id(drug1Id)
  }, [drug1Id, drug2Id])

  const handleCompare = useCallback(async () => {
    setValidationMsg(null)

    if (!drug1Id) {
      setValidationMsg('Select the first drug.')
      return
    }
    if (!drug2Id) {
      setValidationMsg('Select the second drug.')
      return
    }
    if (drug1Id === drug2Id) {
      setValidationMsg('Select two different drugs to compare.')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await compareDrugs(drug1Id, drug2Id)
      setResult(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Comparison failed.')
    } finally {
      setLoading(false)
    }
  }, [drug1Id, drug2Id])

  const handleCitationClick = useCallback(
    (citation: ComparisonCitation) => {
      setSelectedCitation(citation)
    },
    [setSelectedCitation],
  )

  const handleRetry = useCallback(() => {
    handleCompare()
  }, [handleCompare])

  return (
    <ChatLayout>
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-5">
          {/* Page Header */}
          <section className="pt-2 lg:pt-0">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-4 shadow-card sm:p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,119,114,0.1),transparent_45%)]" />

              {/* Low opacity subtle medicine.png background element */}
                <div className="absolute right-0 bottom-0 top-0 w-1/3 pointer-events-none select-none overflow-hidden hidden md:block">
                  <div className="absolute inset-0 bg-gradient-to-r from-surface to-transparent z-10 w-24" />
                  <img
                    src={medicalDocumentsImage}
                    alt=""
                    className="absolute right-4 bottom-2 h-full max-h-[140px] w-auto object-contain opacity-30"
                  />
                </div>

              <div className="relative max-w-xl space-y-2 z-20">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Drug Comparison
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-primary sm:text-2xl">
                  Compare medications
                </h1>
                <p className="mt-1 text-sm leading-relaxed text-fg-secondary">
                  Review clinical data side-by-side based on verified sources.
                </p>
              </div>
            </div>
          </section>

          {/* Drug Selector */}
          <DrugSelector
            documents={readyDocs}
            drug1Id={drug1Id}
            drug2Id={drug2Id}
            onDrug1Change={setDrug1Id}
            onDrug2Change={setDrug2Id}
            onSwap={handleSwap}
            onCompare={handleCompare}
            loading={loading}
          />

          {/* Validation message */}
          {validationMsg && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-xl border border-warning/30 bg-warning/5 px-4 py-2.5 text-sm text-warning animate-fade-in"
            >
              <span className="font-semibold">{validationMsg}</span>
            </div>
          )}

          {/* Results area */}
          <section aria-live="polite" aria-busy={loading}>
            {loading ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Comparing drug information\u2026</span>
                </div>
                <ComparisonSkeleton />
              </div>
            ) : error ? (
              <ComparisonError message={error} onRetry={handleRetry} />
            ) : result ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
                    Comparison Results
                  </h2>
                  <span className="text-[11px] text-fg-muted">
                    Based on approved source documents
                  </span>
                </div>
                <ComparisonTable result={result} onCitationClick={handleCitationClick} />
              </div>
            ) : (
              <ComparisonEmptyState />
            )}
          </section>
        </div>
      </div>
    </ChatLayout>
  )
}
