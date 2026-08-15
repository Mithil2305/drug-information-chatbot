export function AuthBrandPanel() {
  return (
    <div 
      className="relative hidden h-full w-1/2 overflow-hidden border-l border-border lg:flex flex-col justify-between p-12 xl:p-16 bg-sidebar select-none"
    >
      {/* Abstract Scientific Linework */}
      <div className="absolute inset-0 pointer-events-none opacity-20" aria-hidden="true">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="evidence-field-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <circle cx="24" cy="24" r="1" fill="#22D3E8" fillOpacity="0.4" />
              <path d="M 24 0 L 24 48 M 0 24 L 48 24" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="0.5" strokeDasharray="2 2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#evidence-field-grid)" />
          
          {/* Layered Document Wireframes */}
          <rect x="80" y="120" width="160" height="220" rx="6" fill="#141A2A" fillOpacity="0.9" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />
          <line x1="100" y1="150" x2="180" y2="150" stroke="#565F74" strokeWidth="1.5" strokeDasharray="4 2" />
          <line x1="100" y1="170" x2="210" y2="170" stroke="#565F74" strokeWidth="1.5" />
          <line x1="100" y1="190" x2="190" y2="190" stroke="#565F74" strokeWidth="1.5" />
          <line x1="100" y1="210" x2="220" y2="210" stroke="#565F74" strokeWidth="1.5" />
          
          {/* Connecting Evidence Paths */}
          <path d="M 240 230 C 340 230, 360 160, 460 160" fill="none" stroke="#22D3E8" strokeWidth="1.5" />
          <path d="M 240 250 C 320 250, 380 340, 480 340" fill="none" stroke="#38EDFF" strokeWidth="1.5" strokeDasharray="4 3" />
          
          {/* Data Points & Precision Nodes */}
          <circle cx="240" cy="230" r="3.5" fill="#22D3E8" />
          <circle cx="460" cy="160" r="4.5" fill="#22D3E8" />
          <circle cx="480" cy="340" r="4" fill="#38EDFF" />
        </svg>
      </div>




      {/* Top Header */}
      <div className="flex items-center gap-3 z-10">
        <div className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-[#22D3E8] text-[#0D1220] font-black shadow-sm">
          <span className="text-sm">L</span>
        </div>
        <div className="flex flex-col">
          <span className="font-sans text-xs font-bold tracking-[0.18em] uppercase text-text-primary">LABELPROOF</span>
          <span className="text-[10px] text-text-tertiary font-medium">EVIDENCE AI</span>
        </div>
      </div>

      {/* Center Tagline & Proof Points */}
      <div className="relative z-10 my-auto max-w-md">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[#22D3E8]/15 px-3 py-1 font-mono text-[10px] font-bold text-[#22D3E8] border border-[#22D3E8]/30">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22D3E8]" />
          CLINICAL EVIDENCE INTELLIGENCE
        </div>
        <h1 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-text-primary leading-[1.2]">
          Evidence-first<br />
          drug intelligence.<br />
          <span className="text-[#22D3E8]">Trusted answers.</span>
        </h1>
        <p className="mt-4 text-xs sm:text-sm text-text-secondary leading-relaxed font-sans max-w-sm">
          Grounded clinical queries backed by official FDA drug labels and section-level page citations.
        </p>

        {/* Feature Checkmarks */}
        <div className="mt-6 flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-xs text-text-primary font-medium">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#22D3E8]/15 text-[#22D3E8] text-[10px] font-bold">✓</span>
            <span>Source-grounded clinical answers</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-primary font-medium">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#22D3E8]/15 text-[#22D3E8] text-[10px] font-bold">✓</span>
            <span>Approved drug-label evidence vault</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-primary font-medium">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#22D3E8]/15 text-[#22D3E8] text-[10px] font-bold">✓</span>
            <span>Citation-first research workflow</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="z-10 flex items-center justify-between text-[11px] font-mono text-text-tertiary border-t border-border pt-4">
        <span>LABELPROOF PLATFORM v2.5</span>
        <span className="text-[#3FCB78] flex items-center gap-1.5 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-[#3FCB78]" />
          REGULATORY VERIFIED
        </span>
      </div>

    </div>
  )
}










