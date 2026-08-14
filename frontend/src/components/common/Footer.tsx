import { Link } from 'react-router-dom'
import { ShieldCheck, ArrowUpRight } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full bg-primary text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">

          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal text-white shadow-card transition-transform group-hover:scale-105">
                <ShieldCheck className="h-5 w-5 text-surface-warm" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-bold tracking-tight">LabelProof</span>
                <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/60">Clinical AI</span>
              </div>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white/65">
              Evidence-first drug information platform powered by AI. Every answer is retrieved and verified directly against FDA-approved pharmaceutical prescribing information.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
              <span className="flex h-2 w-2 items-center justify-center">
                <span className="inline-block h-2 w-2 rounded-full bg-success animate-pulse" />
              </span>
              <span>Grounded Retrieval System Active</span>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Explore */}
          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/50 mb-4">Explore</h4>
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
                    className="text-white/65 transition-colors duration-150 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/50 mb-4">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/#how-it-works" className="text-white/65 transition-colors hover:text-white">How RAG Works</a>
              </li>
              <li>
                <a href="/#verification" className="text-white/65 transition-colors hover:text-white">Source Verification</a>
              </li>
              <li>
                <a href="/#faq" className="text-white/65 transition-colors hover:text-white">Clinical FAQ</a>
              </li>
              <li>
                <a
                  href="http://127.0.0.1:8000/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-white/65 transition-colors hover:text-white"
                >
                  <span>Backend API</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="lg:col-span-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/50 mb-4">Clinical Disclaimer</h4>
            <p className="text-xs leading-relaxed text-white/55">
              LabelProof is designed for healthcare professionals, clinical researchers, and informational drug reference. Responses are synthesized from official prescribing labels and should not replace professional medical judgment.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} LabelProof. Cognizant NPN Healthcare AI Initiative.</p>
          <div className="flex gap-6">
            <span className="cursor-pointer transition-colors hover:text-white/70">Privacy Protocol</span>
            <span className="cursor-pointer transition-colors hover:text-white/70">Terms of Verification</span>
            <span className="cursor-pointer transition-colors hover:text-white/70">Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
