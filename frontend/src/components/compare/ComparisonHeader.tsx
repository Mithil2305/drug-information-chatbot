import { FileText } from 'lucide-react'
import type { DrugInfo } from '../../types/comparison'

interface ComparisonHeaderProps {
  drug1: DrugInfo
  drug2: DrugInfo
}

export function ComparisonHeader({ drug1, drug2 }: ComparisonHeaderProps) {
  return (
    <>
      <th
        scope="col"
        className="border-b border-border px-4 py-4 text-left align-bottom"
      >
        <span className="text-[11px] font-bold uppercase tracking-wider text-fg-muted">Attribute</span>
      </th>
      <DrugColumnHeader drug={drug1} />
      <DrugColumnHeader drug={drug2} />
    </>
  )
}

function DrugColumnHeader({ drug }: { drug: DrugInfo }) {
  return (
    <th
      scope="col"
      className="border-b border-border px-4 py-4 text-left align-bottom"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-fg leading-tight truncate">{drug.name}</h3>
            {drug.genericName && (
              <p className="text-[13px] text-fg-muted leading-tight">{drug.genericName}</p>
            )}
          </div>
        </div>
        {drug.drugClass && (
          <span className="inline-flex items-center rounded-pill bg-accent/10 px-2.5 py-0.5 text-[11px] font-bold text-accent">
            {drug.drugClass}
          </span>
        )}
        {drug.documentName && (
          <p className="text-[11px] text-fg-muted pt-0.5">
            {drug.documentName}
            {drug.pageCount ? ` \u00b7 ${drug.pageCount} pages` : ''}
          </p>
        )}
      </div>
    </th>
  )
}

export default ComparisonHeader
