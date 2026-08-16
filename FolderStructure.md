# The Folder Structure

## 1. Frontend folder structure


```text
frontend
│
├── public
│
└── src
    ├── assets
    │   └── images
    │
    ├── components
    │   ├── common
    │   ├── upload
    │   ├── chat
    │   ├── evidence
    │   ├── pdf
    │   └── comparison
    │
    ├── pages
    ├── api
    ├── hooks
    ├── stores
    ├── types
    └── utils
```

---

# 2. Backend folder structure

```text
backend
│
├── app
│   │
│   ├── api
│   │   └── routes
│   │
│   ├── core
│   │
│   ├── models
│   │
│   ├── schemas
│   │
│   ├── services
│   │   ├── pdf
│   │   ├── chunking
│   │   ├── embeddings
│   │   ├── retrieval
│   │   ├── llm
│   │   ├── validation
│   │   ├── chat
│   │   └── comparison
│   │
│   ├── repositories
│   │
│   ├── db
│   │   └── migrations
│   │
│   └── dependencies
│
└── tests
```

---

# 3. Root project folder structure

```text
MediMei/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       │   └── images/
│       ├── components/
│       │   ├── common/
│       │   ├── upload/
│       │   ├── chat/
│       │   ├── evidence/
│       │   ├── pdf/
│       │   └── comparison/
│       ├── pages/
│       ├── api/
│       ├── hooks/
│       ├── stores/
│       ├── types/
│       └── utils/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   │   ├── pdf/
│   │   │   ├── chunking/
│   │   │   ├── embeddings/
│   │   │   ├── retrieval/
│   │   │   ├── llm/
│   │   │   ├── validation/
│   │   │   ├── chat/
│   │   │   └── comparison/
│   │   ├── repositories/
│   │   ├── db/
│   │   │   └── migrations/
│   │   └── dependencies/
│   │
│   └── tests/
│
└── data/
    ├── uploads/
    ├── processed/
    └── test_documents/
```

-----
-----

# Folder structure with filename

```text
MediMei/
│
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   └── logo.svg
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   └── images/
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Spinner.tsx
│   │   │   │   └── ErrorMessage.tsx
│   │   │   │
│   │   │   ├── upload/
│   │   │   │   ├── PdfUploader.tsx
│   │   │   │   ├── UploadProgress.tsx
│   │   │   │   └── DocumentCard.tsx
│   │   │   │
│   │   │   ├── chat/
│   │   │   │   ├── ChatWindow.tsx
│   │   │   │   ├── ChatInput.tsx
│   │   │   │   ├── MessageBubble.tsx
│   │   │   │   └── ConversationHeader.tsx
│   │   │   │
│   │   │   ├── evidence/
│   │   │   │   ├── EvidencePanel.tsx
│   │   │   │   ├── EvidenceCard.tsx
│   │   │   │   ├── CitationBadge.tsx
│   │   │   │   └── WhyThisAnswer.tsx
│   │   │   │
│   │   │   ├── pdf/
│   │   │   │   ├── PdfViewer.tsx
│   │   │   │   ├── PdfToolbar.tsx
│   │   │   │   └── PdfPageNavigator.tsx
│   │   │   │
│   │   │   └── comparison/
│   │   │       ├── CompareTable.tsx
│   │   │       ├── DrugColumn.tsx
│   │   │       └── ComparisonEvidence.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Upload.tsx
│   │   │   ├── Chat.tsx
│   │   │   ├── Compare.tsx
│   │   │   └── Document.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── documents.ts
│   │   │   ├── chat.ts
│   │   │   ├── compare.ts
│   │   │   └── citations.ts
│   │   │
│   │   ├── hooks/
│   │   │   ├── useChat.ts
│   │   │   ├── useDocuments.ts
│   │   │   ├── useUpload.ts
│   │   │   └── usePdfViewer.ts
│   │   │
│   │   ├── stores/
│   │   │   ├── chatStore.ts
│   │   │   ├── documentStore.ts
│   │   │   └── viewerStore.ts
│   │   │
│   │   ├── types/
│   │   │   ├── document.ts
│   │   │   ├── chat.ts
│   │   │   ├── evidence.ts
│   │   │   └── comparison.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── formatters.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── .env
│
│
├── backend/
│   ├── app/
│   │   │
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── documents.py
│   │   │   │   ├── chat.py
│   │   │   │   ├── compare.py
│   │   │   │   └── citations.py
│   │   │   │
│   │   │   └── router.py
│   │   │
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── logging.py
│   │   │   └── security.py
│   │   │
│   │   ├── models/
│   │   │   ├── document.py
│   │   │   ├── chunk.py
│   │   │   ├── chat.py
│   │   │   └── citation.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── document.py
│   │   │   ├── chat.py
│   │   │   ├── evidence.py
│   │   │   └── comparison.py
│   │   │
│   │   ├── services/
│   │   │   │
│   │   │   ├── pdf/
│   │   │   │   ├── extractor.py
│   │   │   │   ├── section_detector.py
│   │   │   │   ├── table_extractor.py
│   │   │   │   └── ocr.py
│   │   │   │
│   │   │   ├── chunking/
│   │   │   │   ├── chunker.py
│   │   │   │   └── metadata.py
│   │   │   │
│   │   │   ├── embeddings/
│   │   │   │   └── embedding_service.py
│   │   │   │
│   │   │   ├── retrieval/
│   │   │   │   ├── semantic_search.py
│   │   │   │   ├── keyword_search.py
│   │   │   │   ├── hybrid_search.py
│   │   │   │   └── reranker.py
│   │   │   │
│   │   │   ├── llm/
│   │   │   │   ├── client.py
│   │   │   │   ├── prompts.py
│   │   │   │   └── answer_generator.py
│   │   │   │
│   │   │   ├── validation/
│   │   │   │   ├── evidence_validator.py
│   │   │   │   ├── claim_validator.py
│   │   │   │   ├── citation_validator.py
│   │   │   │   └── safety_validator.py
│   │   │   │
│   │   │   ├── chat/
│   │   │   │   ├── query_router.py
│   │   │   │   ├── conversation.py
│   │   │   │   └── context_builder.py
│   │   │   │
│   │   │   └── comparison/
│   │   │       └── drug_comparator.py
│   │   │
│   │   ├── repositories/
│   │   │   ├── document_repository.py
│   │   │   ├── qdrant_repository.py
│   │   │   └── citation_repository.py
│   │   │
│   │   ├── db/
│   │   │   ├── database.py
│   │   │   └── migrations/
│   │   │
│   │   ├── dependencies/
│   │   │   ├── qdrant.py
│   │   │   ├── llm.py
│   │   │   └── embeddings.py
│   │   │
│   │   └── main.py
│   │
│   ├── tests/
│   │   ├── test_pdf.py
│   │   ├── test_chunking.py
│   │   ├── test_retrieval.py
│   │   ├── test_validation.py
│   │   ├── test_chat.py
│   │   └── test_citations.py
│   │
│   ├── requirements.txt
│   ├── .env
│
├── data/
│   ├── uploads/
│   ├── processed/
│   └── test_documents/
│
├── .gitignore
├── README.md
└── .env.example
```