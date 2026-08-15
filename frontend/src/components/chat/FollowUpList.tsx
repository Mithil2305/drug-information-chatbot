interface FollowUpListProps {
  questions: string[]
  onSelect: (question: string) => void
}


export function FollowUpList({ questions, onSelect }: FollowUpListProps) {
  return (
    <div className="mt-4 flex flex-col gap-1.5 border-t border-border pt-3">
      <span className="text-[10px] font-mono tracking-[0.14em] uppercase text-text-muted font-semibold">
        CONTINUE EXPLORING
      </span>
      <div className="flex flex-col gap-1">
        {questions.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onSelect(q)}
            className="group flex w-full items-center gap-2 rounded-[6px] bg-surface px-3 py-1.5 text-left text-xs text-text-secondary transition-colors hover:text-text-primary hover:border-accent hover:bg-surface-raised border border-border cursor-pointer"
          >
            <span className="text-accent group-hover:translate-x-0.5 transition-transform font-bold">→</span>
            <span className="line-clamp-1 font-sans">{q}</span>
          </button>
        ))}

      </div>
    </div>
  )
}








