import { DrugSelect } from './DrugSelect'
import { SwapDrugsButton } from './SwapDrugsButton'
import { CompareButton } from './CompareButton'
import type { Document } from '../../types/document'

interface DrugSelectorProps {
  documents: Document[]
  drug1Id: string | null
  drug2Id: string | null
  onDrug1Change: (id: string | null) => void
  onDrug2Change: (id: string | null) => void
  onSwap: () => void
  onCompare: () => void
  loading?: boolean
}

export function DrugSelector({
  documents,
  drug1Id,
  drug2Id,
  onDrug1Change,
  onDrug2Change,
  onSwap,
  onCompare,
  loading,
}: DrugSelectorProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-5">
        {/* Drug 1 */}
        <DrugSelect
          label="Drug 1"
          documents={documents}
          value={drug1Id}
          onChange={onDrug1Change}
          excludeId={drug2Id}
        />

        {/* Swap */}
        <div className="flex shrink-0 items-center justify-center pb-0.5 lg:pb-2.5">
          <SwapDrugsButton onSwap={onSwap} disabled={!drug1Id || !drug2Id} />
        </div>

        {/* Drug 2 */}
        <DrugSelect
          label="Drug 2"
          documents={documents}
          value={drug2Id}
          onChange={onDrug2Change}
          excludeId={drug1Id}
        />

        {/* Compare */}
        <div className="shrink-0 pb-0.5 lg:pb-0">
          <CompareButton onClick={onCompare} loading={loading} />
        </div>
      </div>
    </div>
  )
}

export default DrugSelector
