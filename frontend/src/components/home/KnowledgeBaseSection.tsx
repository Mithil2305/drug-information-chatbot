import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'

interface KnowledgeBaseSectionProps {
  readyCount: number
}

export function KnowledgeBaseSection({ readyCount }: KnowledgeBaseSectionProps) {
  return (
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
              <span className="text-3xl font-extrabold text-primary tabular-nums">{readyCount}</span>
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
  )
}
