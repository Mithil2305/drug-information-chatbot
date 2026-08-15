import { ArrowLeftRight } from 'lucide-react'
import { Tooltip } from '../common/Tooltip'

interface SwapDrugsButtonProps {
  onSwap: () => void
  disabled?: boolean
}

export function SwapDrugsButton({ onSwap, disabled }: SwapDrugsButtonProps) {
  return (
    <Tooltip content="Swap drugs" side="top">
      <button
        type="button"
        onClick={onSwap}
        disabled={disabled}
        aria-label="Swap drugs"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-fg-muted transition-all duration-200 hover:border-accent hover:text-accent hover:shadow-subtle disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent/20"
      >
        <ArrowLeftRight className="h-4 w-4" />
      </button>
    </Tooltip>
  )
}

export default SwapDrugsButton
