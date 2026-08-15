import { Link } from 'react-router-dom'
import { ShieldCheck, ArrowUpRight } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-surface text-fg">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12">

          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-5">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-white shadow-card transition-transform group-hover:scale-105">
                <ShieldCheck className="h-5 w-5 text-surface-warm" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-bold tracking-tight text-primary">LabelProof</span>
                <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-accent">Clinical AI</span>
              </div>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-fg-secondary">
              Evidence-first drug information platform powered by AI. Every answer is retrieved and verified directly against FDA-approved pharmaceutical prescribing information.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-fg-secondary">
              <span className="flex h-2 w-2 items-center justify-center">
                <span className="inline-block h-2 w-2 rounded-full bg-success animate-pulse" />
              </span>
              <span>Grounded Retrieval System Active</span>
            </div>
          </div>

          {/* Spacer */}
          {/* Explore */}
          <div className="lg:col-span-2">
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.12em] text-fg-muted">Explore</h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Home', to: '/' },
                { label: 'Drug Library', to: '/drugs' },
                { label: 'AI Assistant', to: '/chat' },
                { label: 'Documents & Labels', to: '/documents' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-fg-secondary transition-colors duration-150 hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2">
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.12em] text-fg-muted">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/#how-it-works" className="text-fg-secondary transition-colors hover:text-primary">How RAG Works</Link>
              </li>
              <li>
                <Link to="/#verification" className="text-fg-secondary transition-colors hover:text-primary">Source Verification</Link>
              </li>
              <li>
                <Link to="/#faq" className="text-fg-secondary transition-colors hover:text-primary">Clinical FAQ</Link>
              </li>
              <li>
                <a
                  href="http://127.0.0.1:8000/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-fg-secondary transition-colors hover:text-primary"
                >
                  <span>Backend API</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="lg:col-span-3">
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.12em] text-fg-muted">Clinical Disclaimer</h4>
            <p className="text-xs leading-relaxed text-fg-secondary">
              LabelProof is designed for healthcare professionals, clinical researchers, and informational drug reference. Responses are synthesized from official prescribing labels and should not replace professional medical judgment.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-fg-muted sm:flex-row">
          <p>© {new Date().getFullYear()} LabelProof. Cognizant NPN Healthcare AI Initiative.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link to="/" className="transition-colors hover:text-primary">Home</Link>
            <Link to="/drugs" className="transition-colors hover:text-primary">Drug Library</Link>
            <Link to="/documents" className="transition-colors hover:text-primary">Documents</Link>
            <Link to="/chat" className="transition-colors hover:text-primary">AI Assistant</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
