import type { ComparisonAttribute, ComparisonCitation } from '../../types/comparison'
import { ComparisonCell } from './ComparisonCell'

interface ComparisonRowProps {
  attribute: ComparisonAttribute
  onCitationClick?: (citation: ComparisonCitation) => void
}

export function ComparisonRow({ attribute, onCitationClick }: ComparisonRowProps) {
  return (
    <tr className="transition-colors duration-150 hover:bg-surface-highlight/40">
      <th
        scope="row"
        className="border-b border-border/60 px-4 py-4 text-left align-top text-[13px] font-semibold text-fg whitespace-nowrap"
      >
        {attribute.label}
      </th>
      <ComparisonCell cell={attribute.drug1} onCitationClick={onCitationClick} />
      <ComparisonCell cell={attribute.drug2} onCitationClick={onCitationClick} />
    </tr>
  )
}

export default ComparisonRow
