import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { toast } from 'sonner'
import { useDocuments } from '../../hooks/useDocuments'

export function DocumentUpload() {
  const { uploadDocument } = useDocuments()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]
    const allowed = ['.pdf', '.docx', '.doc']
    const isAllowed = allowed.some((ext) => file.name.toLowerCase().endsWith(ext))
    if (!isAllowed) {
      toast.error('Only PDF, DOCX, and DOC files are supported')
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
      role="region"
      aria-label="Document upload area"
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
        dragging ? 'border-primary bg-primary/5' : 'border-border bg-surface'
      }`}
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-highlight text-primary">
        <Upload className="h-6 w-6" aria-hidden="true" />
      </div>

      {/* Copy */}
      <p className="mb-1 text-sm font-semibold text-fg">
        {dragging ? 'Drop to upload' : 'Drop PDF, DOCX, or DOC here'}
      </p>
      <p className="mb-5 text-xs text-fg-muted">
        Approved drug-label documents only · PDF, DOCX, DOC format
      </p>

      {/* Button */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="rounded-pill bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
      >
        Upload Document
      </button>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
        aria-label="Select PDF, DOCX, or DOC file"
      />
    </div>
  )
}







