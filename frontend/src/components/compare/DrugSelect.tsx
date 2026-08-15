import { useEffect, useRef, useState, useCallback } from 'react'
import { ChevronDown, Check, Search, Pill } from 'lucide-react'
import type { Document } from '../../types/document'

interface DrugSelectProps {
  label: string
  documents: Document[]
  value: string | null
  onChange: (id: string | null) => void
  excludeId?: string | null
}

export function DrugSelect({ label, documents, value, onChange, excludeId }: DrugSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedDoc = documents.find((d) => d.id === value) ?? null

  const filtered = documents.filter((d) => {
    if (d.id === excludeId) return false
    if (!search.trim()) return true
    return d.name.toLowerCase().includes(search.toLowerCase())
  })

  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setOpen(false)
      setSearch('')
    }
  }, [])

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleOutsideClick)
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [open, handleOutsideClick])

  const handleSelect = (id: string) => {
    onChange(id)
    setOpen(false)
    setSearch('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpen((prev) => !prev)
    }
    if (e.key === 'Escape') {
      setOpen(false)
      setSearch('')
    }
  }

  return (
    <div className="flex-1 min-w-0">
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-fg-muted">
        {label}
      </label>
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`clinical-input flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm transition-all duration-150 ${
            open ? 'ring-2 ring-accent/20' : ''
          }`}
        >
          <span className="flex items-center gap-2.5 truncate">
            {selectedDoc ? (
              <>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Pill className="h-3.5 w-3.5" />
                </span>
                <span className="truncate font-semibold text-fg">{selectedDoc.name}</span>
              </>
            ) : (
              <span className="text-fg-muted">Select a drug\u2026</span>
            )}
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-fg-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open && (
          <div
            className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-xl border border-border bg-surface shadow-hover animate-fade-in"
            role="listbox"
          >
            {/* Search */}
            <div className="border-b border-border p-2">
              <div className="flex items-center gap-2 rounded-lg bg-background px-2.5 py-1.5">
                <Search className="h-3.5 w-3.5 text-fg-muted" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search drugs\u2026"
                  className="w-full bg-transparent text-sm text-fg outline-none placeholder:text-fg-muted"
                  autoFocus
                />
              </div>
            </div>

            {/* Options */}
            <div className="max-h-56 overflow-y-auto p-1">
              {filtered.length === 0 ? (
                <p className="px-3 py-4 text-center text-xs text-fg-muted">
                  No documents available
                </p>
              ) : (
                filtered.map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => handleSelect(doc.id)}
                    role="option"
                    aria-selected={doc.id === value}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors duration-150 ${
                      doc.id === value
                        ? 'bg-primary/10 text-primary'
                        : 'text-fg hover:bg-surface-highlight'
                    }`}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Pill className="h-3 w-3" />
                    </span>
                    <span className="min-w-0 flex-1 truncate font-medium">{doc.name}</span>
                    {doc.id === value && <Check className="h-4 w-4 shrink-0 text-primary" />}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DrugSelect
