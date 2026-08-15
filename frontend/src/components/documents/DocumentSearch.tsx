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
        className="clinical-input w-full py-2.5 pl-9 pr-3 text-sm placeholder:text-fg-muted"
        aria-label="Search documents"
      />
    </div>
  )
}
