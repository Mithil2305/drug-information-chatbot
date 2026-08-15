import { CornerDownRight } from 'lucide-react'

interface FollowUpListProps {
  questions: string[]
  onSelect: (question: string) => void
}

export function FollowUpList({ questions, onSelect }: FollowUpListProps) {
  return (
    <div className="mt-4 flex flex-col gap-0.5">
      <span className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-fg-subtle">
        Follow-ups
      </span>
      {questions.map((q) => (
        <button
          key={q}
          type="button"
          onClick={() => onSelect(q)}
          className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-fg-muted transition-colors hover:bg-surface-highlight hover:text-fg"
        >
          <CornerDownRight
            className="h-3.5 w-3.5 shrink-0 text-fg-subtle transition-colors group-hover:text-primary"
            aria-hidden="true"
          />
          <span>{q}</span>
        </button>
      ))}
    </div>
  )
}
