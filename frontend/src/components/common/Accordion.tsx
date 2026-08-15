import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export interface AccordionItem {
  id: string | number
  number?: string
  title: string
  content: React.ReactNode
}

export interface AccordionProps {
  items: AccordionItem[]
  defaultOpenId?: string | number
  className?: string
}

export function Accordion({ items, defaultOpenId, className = '' }: AccordionProps) {
  const [openId, setOpenId] = useState<string | number | null>(defaultOpenId ?? null)

  const toggle = (id: string | number) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <div className={`space-y-2.5 ${className}`}>
      {items.map((item) => {
        const isOpen = openId === item.id
        return (
          <div
            key={item.id}
            className={`overflow-hidden rounded-xl border transition-all duration-200 theme-transition ${
              isOpen
                ? 'border-primary/30 bg-surface shadow-card'
                : 'border-border bg-surface shadow-subtle hover:border-primary/20 hover:shadow-card'
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between px-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-4">
                {item.number && (
                  <span
                    className={`font-mono text-xs font-bold tabular-nums ${
                      isOpen ? 'text-primary' : 'text-fg-muted'
                    }`}
                  >
                    {item.number}
                  </span>
                )}
                <span
                  className={`text-sm font-semibold leading-snug transition-colors duration-200 ${
                    isOpen ? 'text-primary' : 'text-fg'
                  }`}
                >
                  {item.title}
                </span>
              </div>
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                  isOpen
                    ? 'border-primary/20 bg-primary/10 text-primary'
                    : 'border-border bg-surface-highlight text-fg-muted'
                }`}
              >
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="border-t border-border px-6 pb-5 pt-4 text-sm leading-relaxed text-fg-secondary">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Accordion
