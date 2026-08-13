import { useState } from 'react'
import { Check, FileText, MoreVertical, Pencil, Trash2, Eye, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useDocuments } from '../../hooks/useDocuments'
import { formatDate, formatFileSize } from '../../utils/formatters'
import type { Document } from '../../types/document'
import { DocumentStatus } from './DocumentStatus'

interface DocumentCardProps {
  document: Document
  onDelete: (doc: Document) => void
}

export function DocumentCard({ document, onDelete }: DocumentCardProps) {
  const { renameDocument } = useDocuments()
  const [menuOpen, setMenuOpen] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [name, setName] = useState(document.name)

  const commitRename = () => {
    renameDocument(document.id, name)
    setRenaming(false)
  }

  const cancelRename = () => {
    setName(document.name)
    setRenaming(false)
  }

  return (
    <div className="relative flex flex-col rounded-xl border border-line bg-surface p-4 transition-colors hover:border-primary/40">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-highlight text-primary">
          <FileText className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          {renaming ? (
            <div className="flex items-center gap-1">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitRename()
                  if (e.key === 'Escape') cancelRename()
                }}
                autoFocus
                className="w-full rounded bg-background px-2 py-1 text-sm font-medium text-fg outline-none ring-1 ring-primary"
              />
              <button
                type="button"
                onClick={commitRename}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-success hover:bg-surface-highlight"
                aria-label="Save name"
              >
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={cancelRename}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-fg-muted hover:bg-surface-highlight"
                aria-label="Cancel rename"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <h3 className="truncate text-sm font-semibold text-fg" title={document.name}>
              {document.name}
            </h3>
          )}
          <p className="truncate text-xs text-fg-muted" title={document.filename}>
            {document.filename}
          </p>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-highlight hover:text-fg"
            aria-label="Document actions"
          >
            <MoreVertical className="h-4 w-4" aria-hidden="true" />
          </button>
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 top-9 z-20 w-36 rounded-lg border border-line bg-surface py-1 shadow-lg">
                <MenuItem
                  icon={Eye}
                  label="View"
                  onClick={() => {
                    setMenuOpen(false)
                    alert('PDF viewer coming soon')
                  }}
                />
                <MenuItem
                  icon={Pencil}
                  label="Rename"
                  onClick={() => {
                    setMenuOpen(false)
                    setRenaming(true)
                  }}
                />
                <MenuItem
                  icon={Trash2}
                  label="Delete"
                  danger
                  onClick={() => {
                    setMenuOpen(false)
                    onDelete(document)
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <DocumentStatus status={document.status} />
        <span className="text-xs text-fg-muted">
          {document.pageCount ? `${document.pageCount} pages` : '—'}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-xs text-fg-muted">
        <span>{formatFileSize(document.fileSize)}</span>
        <span>{formatDate(document.uploadedAt)}</span>
      </div>
    </div>
  )
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: LucideIcon
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-surface-highlight ${
        danger ? 'text-danger' : 'text-fg'
      }`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span>{label}</span>
    </button>
  )
}
