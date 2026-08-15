import { useState } from 'react'
import { Check, FileText, MoreVertical, Pencil, RefreshCw, Trash2, X } from 'lucide-react'
import { useDocuments } from '../../hooks/useDocuments'
import { formatDate, formatFileSize } from '../../utils/formatters'
import type { Document } from '../../types/document'
import { DocumentStatus } from './DocumentStatus'

interface DocumentListProps {
  onDelete: (doc: Document) => void
}

function DocumentTableRow({ 
  document, 
  onDelete 
}: { 
  document: Document
  onDelete: (doc: Document) => void 
}) {
  const { renameDocument } = useDocuments()
  const [renaming, setRenaming] = useState(false)
  const [name, setName] = useState(document.name)
  const [showMenu, setShowMenu] = useState(false)

  const commitRename = () => {
    renameDocument(document.id, name)
    setRenaming(false)
  }

  const cancelRename = () => {
    setName(document.name)
    setRenaming(false)
  }

  return (
    <tr className="group transition-colors hover:bg-[#E5F7FA] dark:hover:bg-surface-raised/50 text-xs">
      {/* Document Name Column */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-[var(--bg-icon-container)] text-accent border border-[var(--border-icon-container)] shadow-sm">
            <FileText className="h-3.5 w-3.5 text-[#20C7DC] dark:text-[#22D3E8]" aria-hidden="true" />
          </div>

          <div className="min-w-0 flex-1">
            {renaming ? (
              <div className="flex items-center gap-1 my-0.5">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitRename()
                    if (e.key === 'Escape') cancelRename()
                  }}
                  autoFocus
                  className="w-full rounded-[6px] bg-surface-raised px-2 py-1 text-xs text-text-primary outline-none border border-accent font-sans"
                />
                <button
                  type="button"
                  onClick={commitRename}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-accent hover:bg-surface-raised cursor-pointer"
                  aria-label="Save"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={cancelRename}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-text-tertiary hover:bg-surface-raised cursor-pointer"
                  aria-label="Cancel"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div>
                <div className="truncate font-medium text-text-primary font-sans group-hover:text-[#22D3E8] transition-colors" title={document.name}>
                  {document.name}
                </div>
                <div className="font-mono text-[10.5px] text-text-tertiary truncate">
                  {document.filename} {document.fileSize ? `· ${formatFileSize(document.fileSize)}` : ''}
                </div>
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Date Uploaded Column */}
      <td className="py-3 px-4 font-mono text-[11px] text-text-secondary whitespace-nowrap hidden sm:table-cell">
        {formatDate(document.uploadedAt)}
      </td>

      {/* Status Column */}
      <td className="py-3 px-4 whitespace-nowrap">
        <DocumentStatus status={document.status} />
      </td>

      {/* Actions Column */}
      <td className="py-3 px-4 text-right whitespace-nowrap">
        <div className="relative inline-flex items-center justify-end gap-1">
          {document.status === 'failed' && (
            <button
              type="button"
              onClick={() => alert(`Retrying ingestion for ${document.filename}...`)}
              className="flex items-center gap-1.5 rounded-[6px] bg-[#E0A83C]/15 border border-[#E0A83C]/40 px-2.5 py-1 text-[10.5px] font-mono font-bold text-[#E0A83C] hover:bg-[#E0A83C]/25 transition-colors cursor-pointer mr-1 shadow-sm"
              title="Retry Ingestion"
            >
              <RefreshCw className="h-3 w-3 animate-spin" />
              <span>Retry</span>
            </button>
          )}


          <button
            type="button"
            onClick={() => setRenaming(true)}
            className="hidden md:inline-flex h-7 w-7 items-center justify-center rounded-[6px] text-text-tertiary hover:bg-surface-raised hover:text-text-primary transition-colors cursor-pointer"
            title="Rename"
            aria-label="Rename document"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(document)}
            className="hidden md:inline-flex h-7 w-7 items-center justify-center rounded-[6px] text-text-tertiary hover:bg-surface-raised hover:text-danger transition-colors cursor-pointer"
            title="Delete"
            aria-label="Delete document"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>

          {/* Mobile & Overflow Menu Button */}
          <div className="relative inline-block md:hidden">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="flex h-7 w-7 items-center justify-center rounded-[6px] text-text-tertiary hover:bg-surface-raised hover:text-text-primary transition-colors cursor-pointer"
              aria-label="Document actions"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </button>

            {showMenu && (
              <div 
                className="absolute right-0 z-30 mt-1 w-32 rounded-[6px] border border-border bg-surface-raised py-1 shadow-console"
                onMouseLeave={() => setShowMenu(false)}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false)
                    setRenaming(true)
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-text-secondary hover:bg-surface hover:text-text-primary"
                >
                  <Pencil className="h-3 w-3" />
                  <span>Rename</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false)
                    onDelete(document)
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-danger hover:bg-surface"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  )
}

export function DocumentList({ onDelete }: DocumentListProps) {
  const { filteredDocuments, documents } = useDocuments()

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[8px] py-16 px-4 text-center bg-surface border border-border shadow-sm">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[6px] bg-accent-tint text-accent border border-accent/20 shadow-sm">
          <FileText className="h-5 w-5" aria-hidden="true" />
        </div>

        <h3 className="font-sans text-sm sm:text-base font-semibold text-text-primary">No documents in repository</h3>
        <p className="max-w-sm text-xs leading-relaxed text-text-secondary mt-1 font-sans">
          Upload clinical protocols and drug label PDFs to ground inquiries with verified citations.
        </p>
      </div>
    )
  }

  if (filteredDocuments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[8px] py-12 px-4 text-center bg-surface border border-border shadow-sm">
        <h3 className="font-sans text-xs sm:text-sm font-semibold text-text-primary">No matching documents</h3>
        <p className="text-xs text-text-tertiary mt-1">Try searching for a different medication name or keyword.</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden rounded-[8px] border border-border bg-surface shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-alt text-[10px] font-mono tracking-[0.1em] uppercase text-text-tertiary font-semibold">
              <th className="py-2.5 px-4 font-semibold">DOCUMENT NAME</th>
              <th className="py-2.5 px-4 font-semibold hidden sm:table-cell">DATE UPLOADED</th>
              <th className="py-2.5 px-4 font-semibold">STATUS</th>
              <th className="py-2.5 px-4 font-semibold text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {filteredDocuments.map((doc) => (
              <DocumentTableRow key={doc.id} document={doc} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}








