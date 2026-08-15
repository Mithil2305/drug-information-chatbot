import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ShieldCheck, Menu, BadgeCheck, FileUp, ScanSearch } from 'lucide-react'
import { toast } from 'sonner'
import medicineVerificationImage from '../assets/medicine.png.png'
import { Navbar } from '../components/common/Navbar'
import { Sidebar } from '../components/layout/Sidebar'
import { MobileSidebar } from '../components/layout/MobileSidebar'
import { DeleteDocumentDialog } from '../components/documents/DeleteDocumentDialog'
import { DocumentList } from '../components/documents/DocumentList'
import { DocumentSearch } from '../components/documents/DocumentSearch'
import { DocumentUpload } from '../components/documents/DocumentUpload'
import { useDocuments } from '../hooks/useDocuments'
import { useUI } from '../hooks/useUI'
import type { Document } from '../types/document'

export default function DocumentsPage() {
  const { deleteDocument, documents } = useDocuments()
  const { toggleSidebar } = useUI()
  const [pendingDelete, setPendingDelete] = useState<Document | null>(null)
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null)
  const [searchParams] = useSearchParams()

  const readyDocs = useMemo(() => documents.filter((d) => d.status === 'ready'), [documents])
  const readyCount = readyDocs.length

  useEffect(() => {
    const docId = searchParams.get('doc')
    if (docId) {
      setSelectedDocId(docId)
      return
    }

    if (!selectedDocId && readyDocs[0]) {
      setSelectedDocId(readyDocs[0].id)
    }
  }, [readyDocs, searchParams, selectedDocId])

  const handleConfirmDelete = () => {
    if (!pendingDelete) return
    deleteDocument(pendingDelete.id)
    toast.success(`Deleted "${pendingDelete.name}"`)
    setPendingDelete(null)
  }

  return (
    <div className="app-shell flex min-h-screen flex-col text-fg">
      <Navbar />
      <MobileSidebar />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="hidden shrink-0 lg:block lg:sticky lg:top-0 lg:h-screen">
          <Sidebar />
        </div>

        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="flex items-center justify-between gap-3 border-b border-border pb-4 lg:hidden">
              <button
                type="button"
                onClick={toggleSidebar}
                className="inline-flex items-center gap-2 rounded-pill border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg shadow-subtle"
                aria-label="Open sidebar"
              >
                <Menu className="h-4 w-4" />
                Menu
              </button>
              <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-fg-muted hover:text-primary">
                <ArrowLeft className="h-3.5 w-3.5" />
                Home
              </Link>
            </div>

            <section className="pt-4 lg:pt-0">
              <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-card sm:p-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,119,114,0.08),transparent_38%),linear-gradient(90deg,rgba(255,255,255,0.02),transparent_40%)]" />
                <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_210px] lg:items-start">
                  <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Pharmaceutical Reference
                  </div>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-2xl">
                      <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                        Pharmaceutical Label Documents
                      </h1>
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-secondary">
                        Upload and manage FDA-approved prescribing information for accurate, evidence-grounded AI responses.
                      </p>
                    </div>
                  </div>

                  </div>

                  <div className="relative justify-self-start lg:justify-self-end">
                    <div className="pointer-events-none absolute -right-8 -top-2 h-24 w-24 rounded-full bg-teal/10 blur-2xl" aria-hidden />
                    <img
                      src={medicineVerificationImage}
                      alt="Medicine verification illustration"
                      className="relative h-20 w-auto object-contain opacity-75 sm:h-24 lg:h-28"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-8 rounded-2xl border border-border bg-surface p-4 shadow-card sm:p-6">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
                    <FileUp className="h-4 w-4 text-accent" />
                    Upload Approved Drug Label (PDF)
                  </div>
                  <p className="max-w-2xl text-sm leading-relaxed text-fg-secondary">
                    FDA-approved prescribing information only. Files are uploaded, parsed, chunked, and indexed using the existing LabelProof processing pipeline.
                  </p>

                  <div className="mt-5">
                    <DocumentUpload />
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-background p-4">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">
                    Upload checks
                  </div>
                  <ul className="space-y-2 text-sm text-fg-secondary">
                    <li className="flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4 text-success" />
                      PDF format only
                    </li>
                    <li className="flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4 text-success" />
                      Up to 100MB supported
                    </li>
                    <li className="flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4 text-success" />
                      Automatically parsed
                    </li>
                    <li className="flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4 text-success" />
                      Secure & compliant
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mt-8 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                    Repository Labels ({readyCount} Active)
                  </div>
                  <p className="mt-1 text-sm text-fg-secondary">
                    Search approved label documents and open them in the AI Assistant.
                  </p>
                </div>

                <div className="w-full sm:max-w-sm">
                  <DocumentSearch />
                </div>
              </div>

              <DocumentList onDelete={setPendingDelete} selectedDocumentId={selectedDocId} />
            </section>

            <section className="mt-8 rounded-2xl border border-border bg-surface p-4 shadow-subtle sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <ScanSearch className="h-4 w-4 text-accent" />
                    Evidence you can trust
                  </div>
                  <p className="mt-1 text-sm text-fg-secondary">
                    Every response is grounded in verified FDA-approved label content with exact page-level citations.
                  </p>
                </div>
                <Link to="/chat" className="text-sm font-semibold text-accent hover:underline">
                  Learn more about our evidence standards →
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>

      <DeleteDocumentDialog
        document={pendingDelete}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}