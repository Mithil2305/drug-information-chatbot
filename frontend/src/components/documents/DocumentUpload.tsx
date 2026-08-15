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
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Only PDF files are supported')
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
      className={`
        group relative flex flex-col items-center justify-center rounded-xl
        border-2 border-dashed p-10 text-center
        transition-all duration-200
        ${dragging
          ? 'border-primary bg-primary-soft'
          : 'border-line bg-surface hover:border-primary/40 hover:bg-surface-highlight'
        }
      `}
    >
      {/* Upload Icon */}
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
          dragging ? 'bg-primary text-white' : 'bg-surface-highlight text-primary'
        }`}
      >
        <Upload className="h-5 w-5" aria-hidden="true" />
      </div>

      {/* Copy */}
      <p className="mb-1 text-sm font-semibold text-fg">
        {dragging ? 'Drop to upload' : 'Drop PDF here'}
      </p>
      <p className="mb-5 text-xs text-fg-muted">
        Approved drug-label documents only · PDF format
      </p>

      {/* Button */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        Upload PDF
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
        aria-label="Select PDF file"
      />
    </div>
  )
}
