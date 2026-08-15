import type { Citation } from '../types/chat'

export const MOCK_CITATIONS: Citation[] = [
  {
    citationId: 'mock-c1',
    documentId: 'doc-rinvoq',
    documentName: 'Rinvoq Prescribing Information',
    page: 12,
    section: 'Dosage and Administration',
    text: 'The recommended starting dose of RINVOQ is 15 mg once daily for most approved indications.',
  },
  {
    citationId: 'mock-c2',
    documentId: 'doc-rinvoq',
    documentName: 'Rinvoq Prescribing Information',
    page: 4,
    section: 'Boxed Warnings',
    text: 'WARNING: SERIOUS INFECTIONS, MALIGNANCY, THROMBOSIS, MACE, and MORTALITY.',
  },
  {
    citationId: 'mock-c3',
    documentId: 'doc-rinvoq',
    documentName: 'Rinvoq Prescribing Information',
    page: 8,
    section: 'Contraindications',
    text: 'RINVOQ is contraindicated in patients with active serious infections, severe hepatic impairment.',
  },
  {
    citationId: 'mock-c4',
    documentId: 'doc-rinvoq',
    documentName: 'Rinvoq Prescribing Information',
    page: 18,
    section: 'Adverse Reactions',
    text: 'The most common adverse reactions (>=10%) were upper respiratory tract infections, headache, and nausea.',
  },
  {
    citationId: 'mock-c5',
    documentId: 'doc-skyrizi',
    documentName: 'Skyrizi Prescribing Information',
    page: 6,
    section: 'Dosage and Administration',
    text: 'The recommended dose is 150 mg administered by subcutaneous injection at Week 0 and Week 4.',
  },
]

export interface MockResponse {
  content: string
  citations: Citation[]
  followUps: string[]
}

export function getMockResponse(question: string): MockResponse {
  const q = question.toLowerCase()

  if (q.includes('dosage') || q.includes('dose') || q.includes('administration')) {
    return {
      content:
        'Based on the approved prescribing information, the recommended dosage depends on the specific drug and indication:\n\n' +
        '**Rinvoq (upadacitinib):**\n- The recommended starting dose is **15 mg once daily** for most approved indications.\n- For rheumatoid arthritis, the dose may be increased to 30 mg once daily if the patient has an inadequate response.\n- Can be taken with or without food.\n\n' +
        '**Skyrizi (risankizumab):**\n- The recommended dose is **150 mg** administered by subcutaneous injection at Week 0 and Week 4, then every 12 weeks thereafter.\n\n' +
        'Always consult the full prescribing information for dose adjustments in special populations such as hepatic or renal impairment.',
      citations: [MOCK_CITATIONS[0], MOCK_CITATIONS[4]],
      followUps: [
        'What are the boxed warnings for this drug?',
        'Are there any contraindications I should know about?',
        'What adverse reactions are most common?',
      ],
    }
  }

  if (q.includes('warning') || q.includes('boxed') || q.includes('precaution')) {
    return {
      content:
        'The prescribing information includes the following **boxed warnings**:\n\n' +
        '1. **Serious Infections** — Increased risk of serious and sometimes fatal infections including tuberculosis (TB), bacterial, viral, and fungal infections.\n\n' +
        '2. **Malignancy** — Increased risk of lymphoma and other malignancies, particularly lung cancer.\n\n' +
        '3. **Thrombosis** — Events of deep venous thrombosis (DVT) and pulmonary embolism (PE) have been reported.\n\n' +
        '4. **Major Adverse Cardiovascular Events (MACE)** — Including cardiovascular death, myocardial infarction, and stroke.\n\n' +
        '5. **Mortality** — A higher rate of all-cause mortality was observed in clinical trials.\n\n' +
        'These warnings are based on data from controlled clinical trials across multiple JAK inhibitor indications.',
      citations: [MOCK_CITATIONS[1]],
      followUps: [
        'What are the contraindications for this medication?',
        'How should patients be monitored during treatment?',
        'What is the recommended dosage?',
      ],
    }
  }

  if (q.includes('contraindication') || q.includes('high-risk') || q.includes('patient group')) {
    return {
      content:
        'The following **contraindications** are listed in the prescribing information:\n\n' +
        '- **Active serious infections** — Including sepsis, active TB, or opportunistic infections\n' +
        '- **Severe hepatic impairment** — Use is contraindicated in patients with severe hepatic impairment\n' +
        '- **Hypersensitivity** — Known hypersensitivity to the active ingredient or any excipients\n\n' +
        '**High-risk patient groups** requiring caution include:\n' +
        '- Patients with chronic or recurrent infections\n' +
        '- Patients with a history of malignancy\n' +
        '- Patients with cardiovascular risk factors\n' +
        '- Pregnant or breastfeeding women\n' +
        '- Elderly patients (>= 65 years)\n\n' +
        'A thorough patient screening is essential before initiating therapy.',
      citations: [MOCK_CITATIONS[2]],
      followUps: [
        'What adverse reactions are most common?',
        'What are the boxed warnings?',
        'How is this drug administered?',
      ],
    }
  }

  if (q.includes('adverse') || q.includes('side effect') || q.includes('reaction')) {
    return {
      content:
        'The most commonly reported **adverse reactions** (occurring in >= 10% of patients) from clinical trials are:\n\n' +
        '1. **Upper respiratory tract infections** — Most frequently reported\n' +
        '2. **Headache** — Generally mild to moderate severity\n' +
        '3. **Nausea** — Usually transient\n' +
        '4. **Elevated liver enzymes** — ALT/AST elevations observed\n' +
        '5. **Neutropenia** — Decreased neutrophil counts reported\n\n' +
        'Less common but serious adverse reactions include:\n' +
        '- Serious infections (TB, opportunistic)\n' +
        '- Venous thromboembolism\n' +
        '- Gastrointestinal perforation (rare)\n\n' +
        'Patients should be monitored with regular lab work throughout treatment.',
      citations: [MOCK_CITATIONS[3]],
      followUps: [
        'What are the contraindications for this drug?',
        'How should adverse reactions be managed?',
        'What is the recommended dosage?',
      ],
    }
  }

  return {
    content:
      'Based on the approved drug-label documents, here is what I found:\n\n' +
      'The queried medication has been studied across multiple clinical trials for its approved indications. ' +
      'The prescribing information provides comprehensive guidance on **dosage**, **warnings**, **contraindications**, and **adverse reactions**.\n\n' +
      'For specific clinical guidance, please refer to the cited sections of the prescribing information below. ' +
      'You can also ask me about any of the follow-up topics for more detailed information.',
    citations: [MOCK_CITATIONS[0], MOCK_CITATIONS[1]],
    followUps: [
      'What is the recommended dosage?',
      'What are the boxed warnings?',
      'What are the contraindications?',
    ],
  }
}
