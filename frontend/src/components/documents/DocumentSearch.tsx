import { Search } from 'lucide-react'
import { useDocuments } from '../../hooks/useDocuments'

export function DocumentSearch() {
  const { searchQuery, setSearchQuery } = useDocuments()

  return (
    <div className="relative w-full sm:max-w-xs">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted"
        aria-hidden="true"
      />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search documents…"
        className="w-full rounded-lg border border-line bg-surface py-2 pl-9 pr-3 text-sm text-fg placeholder-fg-muted outline-none transition-colors focus:border-primary"
        aria-label="Search documents"
      />
    </div>
  )
}
