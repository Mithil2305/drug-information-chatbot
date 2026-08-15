import { Search, X } from 'lucide-react'
import { useDocuments } from '../../hooks/useDocuments'

export function DocumentSearch() {
  const { searchQuery, setSearchQuery } = useDocuments()

  return (
    <div className="relative w-full sm:max-w-xs">
      <Search
        className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted"
        aria-hidden="true"
      />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search documents..."
        className="h-8 w-full rounded-[6px] bg-surface py-1.5 pl-8 pr-7 text-xs text-text-primary placeholder:text-text-muted outline-none transition-colors border border-border focus:border-accent focus:shadow-inputFocus font-sans"
        aria-label="Search documents"
      />


      {searchQuery && (
        <button
          type="button"
          onClick={() => setSearchQuery('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-[4px] p-0.5 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}









