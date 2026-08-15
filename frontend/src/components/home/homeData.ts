import {
  Pill,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Layers,
  Search,
} from 'lucide-react'

export const drugCategories = [
  {
    title: 'Indications & Usage',
    description: 'Approved clinical conditions, patient population criteria, and authorized therapeutic indications.',
    icon: Pill,
    badge: 'Clinical Scope',
  },
  {
    title: 'Dosage & Administration',
    description: 'Recommended daily regimens, dose titration, route adjustments, and renal/hepatic guidance.',
    icon: Clock,
    badge: 'Posology',
  },
  {
    title: 'Contraindications',
    description: 'Strict situations where the medication must never be administered due to hypersensitivity or risks.',
    icon: AlertTriangle,
    badge: 'Safety Rules',
  },
  {
    title: 'Warnings & Precautions',
    description: 'Boxed warnings, adverse risk monitoring, laboratory surveillance, and clinical safeguards.',
    icon: ShieldCheck,
    badge: 'Boxed Warnings',
  },
  {
    title: 'Adverse Reactions',
    description: 'Incidence rates, most commonly observed side effects, and serious treatment-emergent events.',
    icon: Layers,
    badge: 'Safety Profiles',
  },
  {
    title: 'Drug Interactions',
    description: 'CYP450 pathways, pharmacokinetic co-administration warnings, and contraindicated combinations.',
    icon: Search,
    badge: 'Pharmacology',
  },
]

export const howItWorksSteps = [
  {
    step: '01',
    title: 'Clinical Inquiry',
    description: 'Enter a targeted clinical or pharmaceutical question regarding a prescription drug.',
  },
  {
    step: '02',
    title: 'Semantic Search',
    description: 'Dense embedding queries match exact paragraphs across vectorized official PDF prescribing documents.',
  },
  {
    step: '03',
    title: 'Evidence Assembly',
    description: 'Relevant chunks are extracted with metadata: Document ID, Page Number, and Section Title.',
  },
  {
    step: '04',
    title: 'Grounded Synthesis',
    description: 'The LLM synthesizes an evidence-constrained answer without external hallucinations.',
  },
  {
    step: '05',
    title: 'Source Verification',
    description: 'Every statement is cited with clickable evidence badges pointing directly to source pages.',
  },
]

export const faqItems = [
  {
    id: 'faq-1',
    number: '01',
    title: 'How does LabelProof guarantee answers are medically grounded?',
    content:
      'LabelProof uses an evidence-first RAG (Retrieval-Augmented Generation) pipeline. The AI generation model is strictly constrained to answer using only the verified text snippets retrieved from approved FDA prescribing documents. If no relevant source is found in the documentation, the system explicitly abstains rather than hallucinating.',
  },
  {
    id: 'faq-2',
    number: '02',
    title: 'What documents and drug labels are supported?',
    content:
      'The platform supports all official pharmaceutical label PDFs, FDA prescribing information, package inserts, and clinical documentation. Uploaded files undergo text extraction, structural chunking, and semantic vectorization for precise retrieval.',
  },
  {
    id: 'faq-3',
    number: '03',
    title: 'How do users verify the citations provided with an answer?',
    content:
      'Each AI answer comes with clear citation badges showing the document name, page number, and section heading. Clicking a citation opens the Evidence Panel with the exact supporting text extracted from the document.',
  },
  {
    id: 'faq-4',
    number: '04',
    title: 'Can LabelProof be used for drug comparison?',
    content:
      'Yes. You can compare dosage, warnings, adverse reaction profiles, and indications across multiple approved drug labels in the repository simultaneously.',
  },
]

export const verificationFeatures = [
  'Document Title & Exact Page Number',
  'Specific Label Section (e.g. Warnings, Dosage)',
  'Original Unedited Source Excerpt for Verification',
  'Direct Link to PDF Page Inspector',
]

export const samplePrompts = [
  'Recommended dosage for Rinvoq?',
  'What are the boxed warnings?',
  'Contraindications with live vaccines?',
]
