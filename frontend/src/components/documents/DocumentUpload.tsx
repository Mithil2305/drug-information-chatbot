import { useRef, useState } from 'react'
import { UploadCloud } from 'lucide-react'
import { toast } from 'sonner'
import { useDocuments } from '../../hooks/useDocuments'

export function DocumentUpload() {
  const { uploadDocument } = useDocuments()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Only PDF drug label documents are supported')
      return
    }
    uploadDocument(file)
    toast.success(`Uploading "${file.name}"…`)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative flex flex-col items-center justify-center rounded-[8px] bg-[var(--bg-upload)] p-8 sm:p-10 text-center border transition-all cursor-pointer select-none shadow-sm ${
        dragging 
          ? 'border-accent ring-2 ring-accent/20 bg-surface' 
          : 'border-[var(--border-upload)] hover:border-accent hover:bg-surface-raised'
      }`}
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-[8px] bg-[var(--bg-icon-container)] text-accent border border-[var(--border-icon-container)] shadow-sm">
        <UploadCloud className="h-5 w-5 stroke-[2.2] text-[#20C7DC] dark:text-[#22D3E8]" aria-hidden="true" />
      </div>

      <h3 className="font-sans text-sm sm:text-base font-bold text-text-primary">
        Secure Document Upload
      </h3>
      
      <p className="mt-1 text-xs text-text-secondary font-sans max-w-sm">
        Drag and drop clinical protocols, investigator brochures, or medical datasets here.
      </p>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          inputRef.current?.click()
        }}
        className="mt-3.5 inline-flex items-center gap-1.5 rounded-[6px] bg-[#20C7DC] text-[#0B1830] px-4 py-1.5 font-sans text-xs font-bold hover:bg-[#38EDFF] transition-all cursor-pointer shadow-sm"
      >
        Browse Files
      </button>


      <span className="mt-3 font-mono text-[10.5px] text-text-tertiary">
        Supported formats: PDF. Max size: 200MB.
      </span>





      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}







