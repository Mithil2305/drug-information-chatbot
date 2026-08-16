import { useCallback, useEffect, useState } from 'react'
import {
  Brain,
  Trash2,
  Plus,
  Search,
  Info,
  Loader2,
  Trash,
  Check,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  getMemoriesRequest,
  createMemoryRequest,
  deleteMemoryRequest,
  clearMemoriesRequest,
  toggleMemoryRequest
} from '../api/memories'
import type { UserMemory } from '../api/memories'
import { toast } from 'sonner'

export default function MemoryPage() {
  const { user, updateUser } = useAuth()
  const [memories, setMemories] = useState<UserMemory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [newMemoryText, setNewMemoryText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // Fetch memories on mount
  const fetchMemories = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getMemoriesRequest()
      setMemories(data)
    } catch (err: any) {
      toast.error(err.message || 'Failed to retrieve memories')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMemories()
  }, [fetchMemories])

  // Toggle memory active status
  const handleToggleMemory = async () => {
    if (toggling) return
    const nextState = !user?.memory_enabled
    setToggling(true)
    try {
      await toggleMemoryRequest(nextState)
      updateUser({ memory_enabled: nextState })
      toast.success(nextState ? 'AI Memory enabled' : 'AI Memory paused')
    } catch (err: any) {
      toast.error(err.message || 'Failed to toggle memory setting')
    } finally {
      setToggling(false)
    }
  }

  // Create manual memory
  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault()
    const content = newMemoryText.trim()
    if (!content) return

    setSubmitting(true)
    try {
      const created = await createMemoryRequest(content)
      setMemories((prev) => [created, ...prev])
      setNewMemoryText('')
      toast.success('Preference added to memory')
    } catch (err: any) {
      toast.error(err.message || 'Failed to add memory')
    } finally {
      setSubmitting(false)
    }
  }

  // Delete specific memory
  const handleDeleteMemory = async (id: string) => {
    try {
      await deleteMemoryRequest(id)
      setMemories((prev) => prev.filter((m) => m.memory_id !== id))
      toast.success('Memory deleted')
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete memory')
    }
  }

  // Clear all memories
  const handleClearAll = async () => {
    try {
      await clearMemoriesRequest()
      setMemories([])
      setShowClearConfirm(false)
      toast.success('All memories cleared')
    } catch (err: any) {
      toast.error(err.message || 'Failed to clear memories')
    }
  }

  // Filter memories based on search query
  const filteredMemories = memories.filter((m) =>
    m.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const memoryEnabled = user?.memory_enabled ?? true

  return (
    <div className="flex flex-col min-h-screen bg-background text-fg">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur-md px-4 py-3.5 shadow-subtle">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-bold text-fg-muted hover:bg-surface-highlight hover:text-fg transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Chat
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-2xl bg-primary text-white">
              <Brain className="h-4 w-4" />
            </div>
            <span className="text-[13px] font-bold tracking-tight text-fg">
              MediMei Memory Hub
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
          
          {/* Header Dashboard Banner */}
          <section className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-card">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,119,114,0.08),transparent_40%)]" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                  <Brain className="h-4 w-4" />
                  Personalization Engine
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-primary">
                  AI Memory Manager
                </h1>
                <p className="text-sm leading-relaxed text-fg-secondary">
                  MediMei learns from your preferences, instructions, and professional context dynamically. Stored facts are injected into subsequent queries to provide custom, grounded answers.
                </p>
              </div>

              {/* High-End Feature Toggle Switch */}
              <div className="flex items-center gap-3 shrink-0 self-start md:self-center bg-surface-highlight/40 rounded-2xl p-3 border border-border/60">
                <div className="text-right">
                  <span className="block text-xs font-bold text-fg">AI Memory</span>
                  <span className="text-[10px] text-fg-muted block">
                    {memoryEnabled ? 'Enabled & Active' : 'Paused'}
                  </span>
                </div>
                <button
                  onClick={handleToggleMemory}
                  disabled={toggling}
                  type="button"
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    memoryEnabled ? 'bg-primary' : 'bg-border'
                  }`}
                  role="switch"
                  aria-checked={memoryEnabled}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      memoryEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Warning state if disabled */}
          {!memoryEnabled && (
            <div className="flex items-center gap-3 rounded-2xl border border-warning/20 bg-warning/5 px-4 py-3 text-xs text-warning animate-fade-in">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>
                <strong>AI Memory is paused.</strong> MediMei will not access existing memories or save new information from chats until re-enabled.
              </span>
            </div>
          )}

          {/* Grid Layout: Manual Add & Memory List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column: Manual Form */}
            <div className="md:col-span-1 space-y-4">
              <div className="rounded-2xl border border-border bg-surface p-4 shadow-subtle">
                <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
                  Add Preference
                </h2>
                <form onSubmit={handleAddMemory} className="space-y-3">
                  <textarea
                    value={newMemoryText}
                    onChange={(e) => setNewMemoryText(e.target.value)}
                    placeholder="e.g. I prefer concise bullet points, I am a pediatric resident..."
                    className="w-full h-28 rounded-xl border border-border bg-background p-3 text-xs text-fg placeholder-fg-muted focus:border-primary focus:outline-none resize-none"
                    disabled={submitting}
                  />
                  <button
                    type="submit"
                    disabled={submitting || !newMemoryText.trim()}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-primary text-white py-2 text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5" />
                        Save Preference
                      </>
                    )}
                  </button>
                </form>

                {/* Suggestions Box */}
                <div className="mt-4 border-t border-border/60 pt-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-fg-muted block mb-2">
                    Try adding:
                  </span>
                  <div className="space-y-1.5">
                    {[
                      'I work in cardiology',
                      'Focus on Rinvoq warnings',
                      'Explain pediatric dosages only'
                    ].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setNewMemoryText(s)}
                        className="w-full text-left text-[11px] text-primary hover:text-accent font-medium truncate block py-0.5"
                      >
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Search & Memories List */}
            <div className="md:col-span-2 space-y-4">
              
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
                
                {/* Search Bar */}
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-fg-muted" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search memories..."
                    className="w-full rounded-xl border border-border bg-surface pl-9 pr-3 py-2 text-xs text-fg placeholder-fg-muted focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Clear All Dialog Trigger */}
                {memories.length > 0 && (
                  <div className="relative shrink-0 w-full sm:w-auto">
                    {showClearConfirm ? (
                      <div className="flex items-center gap-2 bg-surface border border-danger/30 rounded-xl p-1 animate-fade-in">
                        <span className="text-[10px] font-bold text-danger px-2">Are you sure?</span>
                        <button
                          onClick={handleClearAll}
                          className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-danger text-white hover:bg-danger-hover transition-colors"
                        >
                          Yes, clear
                        </button>
                        <button
                          onClick={() => setShowClearConfirm(false)}
                          className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-surface-highlight text-fg hover:bg-border transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowClearConfirm(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-bold text-danger hover:bg-danger/5 transition-colors"
                      >
                        <Trash className="h-3.5 w-3.5" />
                        Clear All Memories
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Memories Cards */}
              <div className="space-y-2">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16 text-fg-muted gap-2">
                    <Loader2 className="h-7 w-7 animate-spin text-primary" />
                    <span className="text-xs">Loading stored preferences...</span>
                  </div>
                ) : filteredMemories.length === 0 ? (
                  <div className="rounded-2xl border border-border/60 bg-surface/50 p-12 text-center">
                    <Brain className="h-10 w-10 text-fg-muted/40 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-fg mb-1">
                      No memories stored
                    </h3>
                    <p className="text-xs text-fg-muted max-w-sm mx-auto">
                      {searchQuery
                        ? 'No match found for your search term.'
                        : 'Memories extracted from your conversations or added manually will appear here.'}
                    </p>
                  </div>
                ) : (
                  filteredMemories.map((m) => (
                    <div
                      key={m.memory_id}
                      className="group flex items-start justify-between gap-4 rounded-2xl border border-border bg-surface p-3.5 hover:shadow-subtle transition-all duration-200 animate-fade-in-up"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="flex h-6 w-6 items-center justify-center rounded-xl bg-primary/5 text-primary shrink-0 mt-0.5">
                          <Check className="h-3 w-3" />
                        </div>
                        <p className="text-xs leading-relaxed text-fg break-words font-medium">
                          {m.content}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteMemory(m.memory_id)}
                        type="button"
                        className="opacity-0 group-hover:opacity-100 flex h-7 w-7 items-center justify-center rounded-lg text-fg-muted hover:bg-danger/10 hover:text-danger transition-all duration-200 focus:opacity-100"
                        aria-label="Delete preference"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Grounding and Safety Context Explanation banner */}
          <section className="rounded-2xl border border-border/80 bg-surface-highlight/20 p-4 flex gap-3 text-xs leading-relaxed text-fg-muted">
            <Info className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-fg mb-0.5">Clinical Accuracy Guardrails</p>
              <p>
                To maintain clinical safety, user preferences are treated strictly as guidance parameters (e.g. style, roles, formatting). Stored memories are strictly prevented from overriding clinical facts, dosages, frequencies, or warnings retrieved from original medical documents.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
