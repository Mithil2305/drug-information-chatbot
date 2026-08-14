import { useEffect, useState } from 'react'

interface StreamingTextProps {
  content: string
  onComplete?: () => void
}

export function StreamingText({ content, onComplete }: StreamingTextProps) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    let index = 0

    const interval = setInterval(() => {
      index += 1
      setDisplayed(content.slice(0, index))
      if (index >= content.length) {
        clearInterval(interval)
        onComplete?.()
      }
    }, 10)

    return () => clearInterval(interval)
  }, [content, onComplete])

  return (
    <span className="whitespace-pre-wrap">
      {displayed}
      <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-ai" aria-hidden="true" />
    </span>
  )
}
