import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, FileText, Search, X, CheckSquare, Square } from 'lucide-react'
import type { Document } from '../../types/document'

interface DocumentSelectorModalProps {
  open: boolean
  onClose: () => void
  documents: Document[]
  selectedIds: string[]
  onConfirm: (ids: string[]) => void
}

export function DocumentSelectorModal({
  open,
  onClose,
  documents,
  selectedIds,
  onConfirm,
}: DocumentSelectorModalProps) {
  const [search, setSearch] = useState('')
  const [draftIds, setDraftIds] = useState<string[]>(selectedIds)

  useEffect(() => {
    if (open) {
      setSearch('')
      setDraftIds(selectedIds)
    }
  }, [open, selectedIds])

  const readyDocs = useMemo(
    () => documents.filter((d) => d.status === 'ready'),
    [documents],
  )

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return readyDocs
    return readyDocs.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.filename.toLowerCase().includes(q),
    )
  }, [readyDocs, search])

  const allSelected = draftIds.length === readyDocs.length && readyDocs.length > 0
  const noneSelected = draftIds.length === 0

  const toggleSelectAll = () => {
    setDraftIds(allSelected ? [] : readyDocs.map((d) => d.id))
  }

  const toggleDoc = (id: string) => {
    setDraftIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const handleConfirm = () => {
    onConfirm(draftIds)
    onClose()
  }

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Select documents"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface shadow-hover animate-fade-in"
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-accent" />
            <h2 className="text-sm font-bold text-fg">Select Documents</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-surface-highlight hover:text-fg"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* search bar */}
        <div className="flex h-10 items-center gap-2 border-b border-border px-3">
          <Search className="h-3.5 w-3.5 shrink-0 text-fg-muted" aria-hidden="true" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents…"
            aria-label="Search documents"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-fg outline-none placeholder:text-fg-muted"
            autoFocus
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="flex h-5 w-5 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-surface-highlight hover:text-fg"
              aria-label="Clear search"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* select all row */}
        <div className="border-b border-border">
          <button
            type="button"
            onClick={toggleSelectAll}
            className="flex h-10 w-full items-center gap-2.5 px-4 text-left transition-colors hover:bg-surface-highlight"
          >
            {allSelected ? (
              <CheckSquare className="h-4 w-4 shrink-0 text-primary" />
            ) : (
              <Square className="h-4 w-4 shrink-0 text-fg-muted" />
            )}
            <span className="text-[13px] font-semibold text-fg">
              {allSelected ? 'All documents selected' : 'Select all'}
            </span>
            <span className="ml-auto text-[11px] text-fg-muted">
              {readyDocs.length} ready
            </span>
          </button>
        </div>

        {/* document list */}
        <div className="max-h-64 overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-1 px-4 py-8">
              <span className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-surface-highlight text-fg-muted">
                <Search className="h-4 w-4" />
              </span>
              <span className="text-[13px] font-medium text-fg">No documents found</span>
              <span className="text-[12px] text-fg-muted">
                {search ? 'Try a different search term' : 'Upload documents to get started'}
              </span>
            </div>
          ) : (
            filtered.map((doc) => {
              const isSelected = draftIds.includes(doc.id)
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => toggleDoc(doc.id)}
                  className="flex h-10 w-full items-center gap-2.5 rounded-lg px-2.5 text-left transition-colors hover:bg-surface-highlight"
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary text-white'
                        : 'border-border text-transparent'
                    }`}
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <FileText className="h-3.5 w-3.5 shrink-0 text-accent" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] text-fg">{doc.name}</div>
                    <div className="truncate text-[11px] text-fg-muted">{doc.filename}</div>
                  </div>
                  {doc.pageCount && (
                    <span className="shrink-0 text-[10px] text-fg-muted">
                      {doc.pageCount}p
                    </span>
                  )}
                </button>
              )
            })
          )}
        </div>

        {/* footer */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <span className="text-[12px] text-fg-muted">
            {noneSelected
              ? 'No documents selected'
              : allSelected
                ? 'All documents selected'
                : `${draftIds.length} selected`}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-pill border border-border bg-surface px-4 py-2 text-xs font-semibold text-fg transition-colors hover:bg-surface-highlight"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={noneSelected}
              className="rounded-pill bg-primary px-4 py-2 text-xs font-bold text-white shadow-subtle transition-all hover:bg-primary-hover active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
