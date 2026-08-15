import type { DocumentStatus as Status } from '../../types/document'

interface DocumentStatusProps {
  status: Status
}

export function DocumentStatus({ status }: DocumentStatusProps) {
  if (status === 'ready') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#22D3E8]/15 px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-[#22D3E8] border border-[#22D3E8]/40">
        <span className="h-1.5 w-1.5 rounded-full bg-[#22D3E8]" />
        <span>Verified</span>
      </span>
    )
  }

  if (status === 'processing') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E0A83C]/15 px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-[#E0A83C] border border-[#E0A83C]/40">
        <span className="h-1.5 w-1.5 rounded-full bg-[#E0A83C] animate-pulse" />
        <span>Analyzing</span>
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E0554F]/15 px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-[#E0554F] border border-[#E0554F]/40">
      <span className="h-1.5 w-1.5 rounded-full bg-[#E0554F]" />
      <span>Failed</span>
    </span>
  )
}











