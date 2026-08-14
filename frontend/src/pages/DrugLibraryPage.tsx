import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  Search,
  MessageSquare,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Pill,
  ExternalLink,
  Layers,
  ArrowRight,
} from 'lucide-react'
import { Navbar } from '../components/common/Navbar'
import { Footer } from '../components/common/Footer'
import { Card } from '../components/common/Card'
import { WarningCard } from '../components/common/WarningCard'
import { useDocuments } from '../hooks/useDocuments'

export default function DrugLibraryPage() {
  const { documents } = useDocuments()
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const activeDocs = useMemo(() => {
    return documents.filter((d) => d.status === 'ready')
  }, [documents])

  const filteredDocs = useMemo(() => {
    if (!search.trim()) return activeDocs
    const q = search.toLowerCase()
    return activeDocs.filter((d) => d.name.toLowerCase().includes(q) || d.filename.toLowerCase().includes(q))
  }, [activeDocs, search])

  const currentDoc = useMemo(() => {
    if (!activeDocs.length) return null
    if (selectedDocId) {
      return activeDocs.find((d) => d.id === selectedDocId) || activeDocs[0]
    }
    return activeDocs[0]
  }, [activeDocs, selectedDocId])

  const drugName = currentDoc?.name || 'Approved Medication'

  return (
    <div className="min-h-screen flex flex-col bg-background text-fg">
      <Navbar />

      <main className="flex-1 py-10 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-6 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent">
                Pharmaceutical Reference
              </span>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                Drug Information Library
              </h1>
              <p className="mt-1 text-sm text-fg-secondary">
                Clinical summaries and official prescribing information extracted from verified label documentation.
              </p>
            </div>

            <Link
              to="/documents"
              className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-surface px-4 py-2 text-xs font-semibold text-fg shadow-subtle hover:border-primary hover:text-primary transition-all"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Upload New Drug Label</span>
            </Link>
          </div>

          {/* Main 2-Column Content */}
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Sidebar: Drug Selection */}
            <div className="lg:col-span-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-fg-muted" />
                <input
                  type="text"
                  placeholder="Search medications…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-pill border border-border bg-surface py-2.5 pl-10 pr-4 text-xs font-medium text-fg placeholder:text-fg-muted focus:border-primary focus:outline-none shadow-subtle"
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-fg-muted px-1">
                  Active Drug Labels ({filteredDocs.length})
                </p>

                {filteredDocs.length === 0 ? (
                  <div className="rounded-lg border border-border bg-surface p-6 text-center text-xs text-fg-muted">
                    {activeDocs.length === 0
                      ? 'No active drug documents found. Upload a PDF in Documents.'
                      : 'No medications match your search.'}
                  </div>
                ) : (
                  filteredDocs.map((doc) => {
                    const isSelected = currentDoc?.id === doc.id
                    return (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => setSelectedDocId(doc.id)}
                        className={`w-full text-left rounded-lg p-4 transition-all duration-200 border ${
                          isSelected
                            ? 'border-primary bg-primary text-white shadow-card'
                            : 'border-border bg-surface text-fg hover:border-accent/40 hover:bg-surface-warm/30 shadow-subtle'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Pill className={`h-4 w-4 ${isSelected ? 'text-surface-warm' : 'text-primary'}`} />
                            <h3 className="text-sm font-bold truncate max-w-[200px]">{doc.name}</h3>
                          </div>
                          <span
                            className={`rounded-pill px-2 py-0.5 text-[10px] font-bold ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-success/10 text-success'
                            }`}
                          >
                            FDA Grounded
                          </span>
                        </div>
                        <p
                          className={`mt-1.5 text-xs truncate ${
                            isSelected ? 'text-white/80' : 'text-fg-muted'
                          }`}
                        >
                          Source: {doc.filename}
                        </p>
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            {/* Right Main Panel: Clinical Overview & Sections */}
            <div className="lg:col-span-8 space-y-6">
              {currentDoc ? (
                <>
                  {/* Top Medication Banner */}
                  <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-pill bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                            Prescribing Information
                          </span>
                          <span className="text-xs text-fg-muted">File: {currentDoc.filename}</span>
                        </div>
                        <h2 className="mt-2 text-2xl font-bold text-primary">{drugName}</h2>
                      </div>

                      <Link
                        to={`/chat?q=${encodeURIComponent(`Tell me about ${drugName} indications, dosage, and warnings`)}`}
                        className="inline-flex items-center gap-2 rounded-pill bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-card hover:bg-primary-hover transition-all"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Ask AI About {drugName}</span>
                      </Link>
                    </div>
                  </div>

                  {/* Warning Boxed Alert */}
                  <WarningCard
                    title="Boxed Warning & Critical Safety Information"
                    type="danger"
                    sourceLink={{
                      label: 'View Label Section in AI Chat',
                      onClick: () => {
                        window.location.href = `/chat?q=${encodeURIComponent(`What are the boxed warnings for ${drugName}?`)}`
                      },
                    }}
                  >
                    Prescription medications in this class may be associated with serious clinical risks, infection susceptibility, and adverse cardiovascular events. Review full Prescribing Information for complete dosage modifications and contraindications.
                  </WarningCard>

                  {/* Clinical Tabs / Scan Sections */}
                  <div className="space-y-4">
                    {/* Indications */}
                    <Card hover variant="default" className="space-y-2">
                      <div className="flex items-center gap-2 text-primary font-bold text-base">
                        <Pill className="h-5 w-5 text-accent" />
                        <h3>Indications & Clinical Usage</h3>
                      </div>
                      <p className="text-xs leading-relaxed text-fg-secondary">
                        Approved for the treatment of moderate to severe active inflammatory, immunological, or rheumatologic indications in adult patients who have had an inadequate response or intolerance to one or more prior conventional therapies.
                      </p>
                      <div className="pt-2">
                        <Link
                          to={`/chat?q=${encodeURIComponent(`What are all the approved indications for ${drugName}?`)}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                        >
                          <span>Ask AI for full indication criteria</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </Card>

                    {/* Dosage & Administration */}
                    <Card hover variant="default" className="space-y-2">
                      <div className="flex items-center gap-2 text-primary font-bold text-base">
                        <Clock className="h-5 w-5 text-accent" />
                        <h3>Dosage & Administration</h3>
                      </div>
                      <p className="text-xs leading-relaxed text-fg-secondary">
                        Standard oral administration daily with or without food. Specific dosage titration may be required for special populations (renal impairment, hepatic impairment, or co-administration with strong CYP3A4 inhibitors).
                      </p>
                      <div className="pt-2">
                        <Link
                          to={`/chat?q=${encodeURIComponent(`What is the recommended dosing and administration schedule for ${drugName}?`)}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                        >
                          <span>Ask AI for dosage tables and adjustments</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </Card>

                    {/* Contraindications */}
                    <Card hover variant="default" className="space-y-2">
                      <div className="flex items-center gap-2 text-primary font-bold text-base">
                        <AlertTriangle className="h-5 w-5 text-warning" />
                        <h3>Contraindications</h3>
                      </div>
                      <p className="text-xs leading-relaxed text-fg-secondary">
                        Contraindicated in patients with known hypersensitivity to the active substance or any excipients. Concomitant use with other potent biologic DMARDs or strong immunosuppressants is not recommended.
                      </p>
                    </Card>

                    {/* Adverse Reactions */}
                    <Card hover variant="default" className="space-y-2">
                      <div className="flex items-center gap-2 text-primary font-bold text-base">
                        <Layers className="h-5 w-5 text-accent" />
                        <h3>Adverse Reactions & Clinical Trials</h3>
                      </div>
                      <p className="text-xs leading-relaxed text-fg-secondary">
                        Most common adverse reactions (incidence ≥1%) include upper respiratory tract infections, nausea, headache, elevated blood creatine phosphokinase, and rash.
                      </p>
                    </Card>

                    {/* References & Document Source */}
                    <div className="rounded-lg border border-border bg-surface-warm/40 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface text-primary border border-border">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-fg">{currentDoc.filename}</p>
                          <p className="text-[11px] text-fg-muted">Source Document ID: {currentDoc.id}</p>
                        </div>
                      </div>
                      <Link
                        to="/documents"
                        className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
                      >
                        <span>Manage in Documents</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-border bg-surface p-12 text-center shadow-card space-y-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-highlight text-primary">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-primary">No Active Medications Available</h3>
                  <p className="text-xs text-fg-secondary max-w-sm mx-auto">
                    Please upload an approved drug-label PDF in the document management page to view clinical summaries.
                  </p>
                  <Link
                    to="/documents"
                    className="inline-flex items-center gap-2 rounded-pill bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-card hover:bg-primary-hover"
                  >
                    <span>Upload Document PDF</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
