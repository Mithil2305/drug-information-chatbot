# LabelProof Backend Implementation Guide

**Project:** LabelProof --- Evidence-First Drug Information Q&A Chatbot\
**Backend:** Python + FastAPI\
**AI approach:** Retrieval-Augmented Generation (RAG)\
**Core principle:** **Question → Evidence → Answer → Validation →
Citation → Exact PDF Page**

> LabelProof is a document-grounded drug-information assistant. It is
> not an autonomous prescriber, diagnosis engine, or replacement for a
> qualified clinician. When the available document does not contain
> enough evidence, the system should prefer a transparent "I don't know"
> response over a confident unsupported statement.

------------------------------------------------------------------------

## 1. Backend Objective

The backend converts approved/selected drug-label PDFs into a searchable
evidence layer and exposes APIs for the React frontend.

The complete pipeline is:

``` text
PDF
 ↓
Cloudflare R2
 ↓
PyMuPDF
 ↓
Extraction Quality Check
 ↓
PaddleOCR when required
 ↓
Clean Text + Page/Section Metadata
 ↓
Semantic Chunking
 ↓
BGE-M3 Embeddings
 ↓
Qdrant
 ↓
User Query
 ↓
Session/Context Handling
 ↓
Semantic / Hybrid Retrieval
 ↓
Evidence Filtering
 ↓
Grounded Prompt
 ↓
Qwen 3.5 4B
 ↓
Evidence Validation
 ↓
Claim Validation
 ↓
Citation Validation
 ↓
Safety Validation
 ↓
Answer + Evidence + Page Reference
```

The supplied project design requires PDF ingestion, session context and
page-level citations, and separates document processing, retrieval,
generation, validation, metadata and source storage.

------------------------------------------------------------------------

# 2. Technology Stack

  -----------------------------------------------------------------------
  Technology              Role                    Why
  ----------------------- ----------------------- -----------------------
  Python                  Backend language        Strong PDF, OCR and ML
                                                  ecosystem

  FastAPI                 REST API                Lightweight, typed,
                                                  async-friendly

  Uvicorn                 API server              ASGI server for FastAPI

  Pydantic                API schemas             Request/response
                                                  validation

  pydantic-settings       Configuration           `.env` configuration

  SQLAlchemy              ORM                     Database abstraction

  Alembic                 Migrations              Versioned DB schema

  MySQL                   Relational DB           Users, sessions,
                                                  documents, jobs,
                                                  citations

  Cloudflare R2           Object storage          Original PDFs

  PyMuPDF                 PDF extraction          Page-aware digital PDF
                                                  parsing

  PaddleOCR               OCR fallback            Scanned/image-heavy
                                                  pages

  PyTorch                 ML runtime              Embedding and LLM
                                                  execution

  Transformers            LLM/model framework     Qwen 3.5 4B

  Accelerate              Model execution support Device/model loading
                                                  support

  Safetensors             Model weights           Safe tensor loading

  Sentence-Transformers / Embeddings              Semantic
  BGE-M3 tooling                                  representations

  Qdrant                  Vector DB               Vector search +
                                                  metadata filtering

  python-multipart        Uploads                 FastAPI multipart file
                                                  handling

  HTTPX                   HTTP/testing            API calls and tests

  pytest                  Testing                 Unit/integration tests

  pytest-asyncio          Async tests             Async backend tests
  -----------------------------------------------------------------------

### Initial requirements

Do not freeze versions until the target Python/CUDA environment is
validated.

``` text
fastapi
uvicorn[standard]
python-multipart
pydantic
pydantic-settings

sqlalchemy
asyncmy
alembic

pymupdf

paddleocr
paddlepaddle

torch
transformers
accelerate
safetensors
sentence-transformers

qdrant-client

httpx
orjson

pytest
pytest-asyncio
```

### Avoid initially

``` text
LangChain
LlamaIndex
Celery
Kafka
RabbitMQ
Redis
agent frameworks
large microservice architecture
```

Direct orchestration gives us better control over evidence, page
metadata, validation and citations.

------------------------------------------------------------------------

# 3. Backend Folder Structure

``` text
backend/
├── app/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── documents.py
│   │   │   ├── chat.py
│   │   │   ├── compare.py
│   │   │   └── citations.py
│   │   └── router.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── logging.py
│   │   └── security.py
│   │
│   ├── models/
│   │   ├── document.py
│   │   ├── chunk.py
│   │   ├── chat.py
│   │   └── citation.py
│   │
│   ├── schemas/
│   │   ├── document.py
│   │   ├── chat.py
│   │   ├── evidence.py
│   │   └── comparison.py
│   │
│   ├── services/
│   │   ├── pdf/
│   │   │   ├── extractor.py
│   │   │   ├── quality_checker.py
│   │   │   ├── section_detector.py
│   │   │   ├── table_extractor.py
│   │   │   └── ocr.py
│   │   ├── chunking/
│   │   │   ├── chunker.py
│   │   │   └── metadata.py
│   │   ├── embeddings/
│   │   │   └── embedding_service.py
│   │   ├── retrieval/
│   │   │   ├── semantic_search.py
│   │   │   ├── keyword_search.py
│   │   │   ├── hybrid_search.py
│   │   │   └── reranker.py
│   │   ├── llm/
│   │   │   ├── client.py
│   │   │   ├── prompts.py
│   │   │   └── answer_generator.py
│   │   ├── validation/
│   │   │   ├── evidence_validator.py
│   │   │   ├── claim_validator.py
│   │   │   ├── citation_validator.py
│   │   │   └── safety_validator.py
│   │   ├── chat/
│   │   │   ├── query_router.py
│   │   │   ├── conversation.py
│   │   │   └── context_builder.py
│   │   └── comparison/
│   │       └── drug_comparator.py
│   │
│   ├── repositories/
│   │   ├── document_repository.py
│   │   ├── qdrant_repository.py
│   │   └── citation_repository.py
│   │
│   ├── db/
│   │   ├── database.py
│   │   └── migrations/
│   │
│   ├── dependencies/
│   │   ├── qdrant.py
│   │   ├── llm.py
│   │   └── embeddings.py
│   │
│   └── main.py
│
├── tests/
│   ├── test_pdf.py
│   ├── test_chunking.py
│   ├── test_retrieval.py
│   ├── test_validation.py
│   ├── test_chat.py
│   └── test_citations.py
│
├── requirements.txt
├── .env
└── Dockerfile
```

------------------------------------------------------------------------

# 4. Architecture Rules

## 4.1 Layering

Use:

``` text
API Route
 ↓
Service
 ↓
Repository
 ↓
Database / Qdrant / R2
```

Routes handle HTTP. Services contain business logic. Repositories handle
persistence.

## 4.2 Source authority

``` text
PDF evidence = authority
Qdrant = retrieval
Qwen = language generation
Validation = control layer
```

The model must never be treated as the source of truth.

## 4.3 Preserve provenance

Every chunk should retain:

``` text
document_id
document_name
page_no
section
chunk_id
chunk_index
version
extraction_method
text_hash
```

This enables:

``` text
Answer
 ↓
Evidence
 ↓
Chunk
 ↓
Page
 ↓
PDF.js
 ↓
Exact source page
```

------------------------------------------------------------------------

# 5. Storage Architecture

Use three separate storage responsibilities:

``` text
MySQL
 └── structured application state

Qdrant
 └── vectors + searchable chunk metadata

Cloudflare R2
 └── original PDFs
```

Do not put large source PDFs inside MySQL.

------------------------------------------------------------------------

# 6. MySQL Data Model

## User

``` text
user_id
email
role
created_at
```

## Session

``` text
session_id
user_id
started_at
summary
```

## Message

``` text
message_id
session_id
role
content
timestamp
```

Roles:

``` text
user
assistant
system
```

## Document

``` text
document_id
file_name
storage_key
source
version
status
created_at
updated_at
```

Statuses:

``` text
uploaded
processing
completed
failed
inactive
```

## DocumentPage

``` text
document_page_id
document_id
page_no
extraction_method
quality_score
text
```

## ProcessingJob

``` text
job_id
document_id
stage
status
error
started_at
completed_at
```

## Citation

``` text
citation_id
message_id
document_id
page_no
chunk_id
section
```

------------------------------------------------------------------------

# 7. Qdrant Payload

A Qdrant point should look conceptually like:

``` json
{
  "id": "chunk-000123",
  "vector": [0.012, -0.034, "..."],
  "payload": {
    "document_id": "doc-001",
    "document_name": "Rinvoq_PI.pdf",
    "page_no": 12,
    "section": "Dosage and Administration",
    "chunk_id": "chunk-000123",
    "chunk_index": 42,
    "version": "current",
    "extraction_method": "pymupdf",
    "text_hash": "abc123",
    "text": "..."
  }
}
```

The payload must be sufficient to reconstruct a citation.

------------------------------------------------------------------------

# 8. PDF Processing

## 8.1 PyMuPDF

Responsibilities:

-   open PDF
-   iterate pages
-   extract text
-   preserve page number
-   inspect metadata
-   identify image-heavy pages
-   optionally render pages

Concept:

``` python
import fitz

doc = fitz.open(pdf_path)

for page_number, page in enumerate(doc, start=1):
    text = page.get_text("text")

    result = {
        "page_no": page_number,
        "text": text,
        "extraction_method": "pymupdf",
    }
```

## 8.2 Extraction quality

Do not OCR every page.

Calculate signals such as:

``` text
character count
word count
text density
empty-page detection
suspicious extraction patterns
```

Then:

``` text
PyMuPDF
 ↓
quality_checker
 ├── good → continue
 └── poor → PaddleOCR
```

## 8.3 PaddleOCR

Use PaddleOCR for:

-   scanned pages
-   image-only PDFs
-   incomplete text extraction

Always preserve the original page number.

------------------------------------------------------------------------

# 9. Section Detection

Drug labels have meaningful sections such as:

``` text
INDICATIONS AND USAGE
DOSAGE AND ADMINISTRATION
CONTRAINDICATIONS
WARNINGS AND PRECAUTIONS
ADVERSE REACTIONS
DRUG INTERACTIONS
PREGNANCY
PEDIATRIC USE
GERIATRIC USE
OVERDOSAGE
DESCRIPTION
CLINICAL PHARMACOLOGY
```

Section metadata improves retrieval.

For:

``` text
"What are the major warnings?"
```

the system should prioritize:

``` text
WARNINGS AND PRECAUTIONS
```

------------------------------------------------------------------------

# 10. Chunking

Chunking converts long documents into retrieval units.

``` text
PDF
 ↓
Pages
 ↓
Sections
 ↓
Chunks
```

Prefer semantic boundaries over arbitrary character counts.

A chunk should preserve:

``` text
heading
paragraphs
relevant table content
page number
section
document
```

Use overlap so information crossing a chunk boundary remains
retrievable.

Do not assume one universal chunk size. Tune chunk size and overlap
using the retrieval benchmark.

------------------------------------------------------------------------

# 11. Machine Learning Concepts

The team must distinguish these concepts:

``` text
PDF parsing
≠ OCR
≠ Embedding
≠ Vector search
≠ RAG
≠ LLM generation
≠ Validation
```

### PDF parsing

Extracts existing digital text.

### OCR

Converts image pixels into text.

### Embedding

Converts text into numerical vectors representing semantic information.

### Vector search

Finds chunks whose vectors are similar to the query vector.

### RAG

Retrieves evidence and gives it to a generator.

### LLM

Generates natural-language wording.

### Validation

Checks whether generated claims are supported by evidence.

------------------------------------------------------------------------

# 12. Embeddings

An embedding maps text to a vector.

``` text
"What is the recommended dosage?"
                ↓
              BGE-M3
                ↓
[0.12, -0.04, 0.87, ...]
```

A semantically similar question should produce a nearby vector.

A conceptual similarity function is cosine similarity:

``` text
cosine_similarity(A,B)
=
(A · B) / (||A|| ||B||)
```

Qdrant performs the vector search using its configured distance metric.

------------------------------------------------------------------------

# 13. BGE-M3

BGE-M3 is the embedding model.

At ingestion:

``` text
chunk
 ↓
BGE-M3
 ↓
vector
 ↓
Qdrant
```

At query time:

``` text
question
 ↓
BGE-M3
 ↓
query vector
 ↓
Qdrant
 ↓
top-K evidence
```

Use a consistent embedding model/version for both indexing and querying.

If the embedding model changes, re-index the affected collection.

------------------------------------------------------------------------

# 14. Qdrant

Qdrant is the vector database.

It is responsible for:

``` text
storing vectors
storing metadata
similarity search
metadata filtering
```

Example:

``` text
Question:
"What are the contraindications?"

        ↓
BGE-M3

        ↓
Qdrant

        ↓
Page 8  CONTRAINDICATIONS
Page 9  WARNINGS
Page 10 PRECAUTIONS
```

------------------------------------------------------------------------

# 15. Semantic Search

Semantic search finds meaning-related content.

Example:

``` text
Question:
"What dose should be given?"

Retrieved:
"DOSAGE AND ADMINISTRATION..."
```

The exact words may differ, but the meaning is related.

------------------------------------------------------------------------

# 16. Keyword Search

Keyword search is useful for exact medical terminology:

``` text
contraindications
warnings
upadacitinib
40 mg
pregnancy
```

It is especially useful for:

-   drug names
-   section headings
-   dosage strengths
-   abbreviations
-   exact medical terminology

------------------------------------------------------------------------

# 17. Hybrid Search

Hybrid retrieval combines:

``` text
semantic search
+
keyword search
```

Flow:

``` text
             Query
               │
        ┌──────┴──────┐
        ▼             ▼
    Semantic       Keyword
     Search         Search
        │             │
        └──────┬──────┘
               ▼
          Merge/Rank
               ▼
          Top Evidence
```

Implementation priority:

1.  Semantic retrieval first.
2.  Keyword retrieval second.
3.  Hybrid search third.
4.  Reranking only if time permits.

------------------------------------------------------------------------

# 18. Reranking

Reranking is a second-stage relevance model.

``` text
20 retrieved chunks
        ↓
     reranker
        ↓
best 5 chunks
```

It can improve difficult queries but is not required before the core RAG
loop works.

------------------------------------------------------------------------

# 19. Query Processing and Session Context

Example:

``` text
User:
What is the dosage?

Assistant:
...

User:
What about elderly patients?
```

The second query needs context.

The backend can resolve it to:

``` text
What does the document say about dosage for elderly patients?
```

Context helps interpret the question, but previous assistant output must
never override the PDF evidence.

------------------------------------------------------------------------

# 20. Query Router

`query_router.py` determines how the query should be handled.

Possible categories:

``` text
dosage
administration
indication
contraindication
warning
precaution
interaction
adverse reaction
pregnancy
pediatric
geriatric
storage
overdose
comparison
unsupported/general
```

For the MVP, a lightweight rules/retrieval approach is sufficient. A
large classifier is unnecessary.

------------------------------------------------------------------------

# 21. RAG --- Retrieval-Augmented Generation

A normal LLM flow is:

``` text
Question
 ↓
LLM memory
 ↓
Answer
```

LabelProof uses:

``` text
Question
 ↓
Retrieve evidence
 ↓
LLM
 ↓
Answer
```

The LLM receives only the evidence relevant to the current question
instead of the entire PDF.

This reduces irrelevant context and improves traceability.

------------------------------------------------------------------------

# 22. Qwen 3.5 4B

Qwen 3.5 4B is the generation model.

Its responsibility is:

``` text
Question
+
Session context
+
Retrieved evidence
+
Safety rules
        ↓
Qwen
        ↓
Grounded answer
```

It is not the source of truth.

------------------------------------------------------------------------

# 23. Grounded Prompt

A prompt should contain:

``` text
SYSTEM RULES

TASK

USER QUESTION

SESSION CONTEXT

RETRIEVED EVIDENCE

OUTPUT RULES
```

Concept:

``` text
SYSTEM:
You are LabelProof, a document-grounded drug information assistant.

RULES:
1. Use retrieved evidence for factual claims.
2. Do not invent information.
3. Do not treat previous assistant messages as authoritative.
4. If evidence is insufficient, explicitly say so.
5. Do not make unsupported prescribing decisions.
6. Keep citations tied to supplied evidence.

QUESTION:
What are the major warnings?

CONTEXT:
The user is asking about the selected drug.

EVIDENCE:
Document: Rinvoq_PI.pdf
Page: 18
Section: Warnings and Precautions
Text:
...

OUTPUT:
Provide a concise answer grounded only in the evidence.
```

------------------------------------------------------------------------

# 24. Evidence Validation

Never immediately return the model output.

``` text
Qwen draft
 ↓
Evidence Validator
```

Conceptually:

``` text
Claim 1 → supported ✓
Claim 2 → supported ✓
Claim 3 → unsupported ✗
```

Unsupported claims should be removed, rewritten conservatively, or cause
abstention depending on severity.

------------------------------------------------------------------------

# 25. Claim Validation

A claim is a factual statement.

Example:

``` text
"The recommended dose is X mg."
```

The backend must ask:

``` text
Is this supported by retrieved evidence?
```

High-risk values deserve especially strict checking:

``` text
dosage
strength
frequency
contraindications
interactions
pregnancy guidance
patient-specific instructions
```

------------------------------------------------------------------------

# 26. Citation Validation

Never trust an LLM-generated page number.

Bad:

``` text
Qwen:
"The answer is on page 12."
```

Correct:

``` text
Qdrant result
 ↓
document_id
page_no
section
chunk_id
 ↓
Citation Validator
 ↓
Citation
```

Example:

``` json
{
  "document_name": "Rinvoq_PI.pdf",
  "page": 12,
  "section": "Dosage and Administration",
  "chunk_id": "chunk-42"
}
```

------------------------------------------------------------------------

# 27. Safety Validation

Check for:

-   unsupported medical claims
-   insufficient evidence
-   unsafe patient-specific instructions
-   prompt injection
-   conflicting documents
-   stale versions
-   OCR uncertainty

The final answer should clearly distinguish source evidence from model
wording.

------------------------------------------------------------------------

# 28. Safe Abstention

This is a critical feature.

If retrieval finds no sufficiently relevant evidence:

``` text
No reliable evidence
 ↓
Do not call generation, or force an abstaining response
 ↓
"I couldn't find sufficient information in the provided document. I don't want to guess."
```

Do not allow the LLM to fill missing information from general medical
knowledge.

------------------------------------------------------------------------

# 29. Document Versioning

Drug information changes.

Store:

``` text
source
version
publication/revision information when available
ingestion timestamp
active/inactive status
```

Example:

``` text
Rinvoq label
 ├── v1 → inactive
 └── v2 → active
```

Retrieval should normally be restricted to the intended active/approved
version.

------------------------------------------------------------------------

# 30. Prompt Injection Protection

PDF content is **data**, not trusted instructions.

If a PDF contains:

``` text
Ignore previous instructions...
```

the LLM must treat that as document text, not as a system command.

Separate:

``` text
SYSTEM RULES
--------------
trusted

EVIDENCE
--------------
untrusted document text

USER QUESTION
--------------
user request
```

------------------------------------------------------------------------

# 31. Cloudflare R2

R2 stores:

``` text
original PDF
optional derived artifacts
```

MySQL stores:

``` text
document metadata
storage key
version
status
```

Use private storage and signed/temporary access URLs.

------------------------------------------------------------------------

# 32. API Design

Use:

``` text
/api/v1
```

### Documents

``` http
POST /api/v1/documents/upload
GET  /api/v1/documents
GET  /api/v1/documents/{document_id}
POST /api/v1/documents/{document_id}/process
```

### Chat

``` http
POST /api/v1/chat
GET  /api/v1/sessions/{session_id}
GET  /api/v1/sessions/{session_id}/messages
```

### Citations

``` http
GET /api/v1/citations/{citation_id}
```

### Comparison

``` http
POST /api/v1/compare
```

------------------------------------------------------------------------

# 33. Example Chat Request

``` json
{
  "session_id": "session-001",
  "document_ids": ["doc-001"],
  "message": "What are the major warnings?"
}
```

Example response:

``` json
{
  "message_id": "msg-123",
  "answer": "The document identifies several major warnings...",
  "grounded": true,
  "evidence_count": 2,
  "citations": [
    {
      "document_id": "doc-001",
      "document_name": "Rinvoq_PI.pdf",
      "page": 18,
      "section": "Warnings and Precautions",
      "chunk_id": "chunk-123"
    }
  ]
}
```

------------------------------------------------------------------------

# 34. Configuration

Use `.env` and never hard-code secrets.

Example:

``` env
APP_NAME=LabelProof
ENVIRONMENT=development

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=labelproof
MYSQL_USER=labelproof
MYSQL_PASSWORD=change_me

QDRANT_URL=http://localhost:6333
QDRANT_COLLECTION=drug_documents

R2_ENDPOINT_URL=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=

EMBEDDING_MODEL=BAAI/bge-m3
LLM_MODEL=Qwen/Qwen3.5-4B

TOP_K=8
MIN_RELEVANCE_SCORE=0.35

MAX_UPLOAD_SIZE_MB=50
```

The exact threshold must be tuned using your retrieval benchmark rather
than assumed as a medical-quality guarantee.

------------------------------------------------------------------------

# 35. FastAPI Dependency Injection

Use dependencies for:

``` text
Qdrant client
embedding model
LLM client
database session
configuration
```

Conceptually:

``` text
Request
 ↓
get_db()
get_qdrant()
get_embeddings()
get_llm()
 ↓
Service
```

This makes services testable because fake dependencies can be injected.

------------------------------------------------------------------------

# 36. Logging and Observability

Record operational information:

``` text
request_id
document_id
processing stage
processing duration
retrieval count
retrieval scores
LLM latency
citation count
error type
```

Avoid unnecessarily logging sensitive user content.

Measure:

``` text
PDF extraction latency
OCR latency
embedding latency
Qdrant latency
LLM generation latency
validation latency
total response latency
```

------------------------------------------------------------------------

# 37. Error Handling

Define structured errors:

``` text
INVALID_PDF
FILE_TOO_LARGE
UNSUPPORTED_FILE
PDF_EXTRACTION_FAILED
OCR_FAILED
EMBEDDING_FAILED
QDRANT_UNAVAILABLE
LLM_UNAVAILABLE
INSUFFICIENT_EVIDENCE
DOCUMENT_NOT_FOUND
SESSION_NOT_FOUND
UNAUTHORIZED_DOCUMENT
```

Example:

``` json
{
  "error": {
    "code": "INSUFFICIENT_EVIDENCE",
    "message": "The provided document does not contain enough information to answer this question."
  }
}
```

------------------------------------------------------------------------

# 38. Testing

## Unit tests

Test:

``` text
PDF extraction
quality checking
section detection
chunking
metadata generation
citation formatting
```

## Retrieval tests

Build a small benchmark:

``` text
Question
Expected section
Expected page
```

Example:

``` text
"What is the recommended dosage?"
→ Dosage and Administration
→ expected page
```

## Generation tests

Test:

``` text
supported question
unsupported question
ambiguous question
follow-up question
```

## Citation tests

Every grounded answer must map to:

``` text
document_id
page_no
chunk_id
```

## Security tests

Test:

``` text
malicious PDF
prompt injection in PDF
oversized upload
invalid file
unauthorized document access
```

------------------------------------------------------------------------

# 39. Retrieval Evaluation

Do not evaluate RAG only by reading the final answer.

Evaluate retrieval separately.

### Recall@K

Did the correct evidence appear in the top K?

``` text
Recall@K =
queries with relevant evidence in top K
/
total relevant queries
```

### Precision@K

How much of the retrieved set is relevant?

``` text
Precision@K =
relevant retrieved chunks
/
total retrieved chunks
```

### MRR

Mean Reciprocal Rank rewards finding the first relevant result early.

``` text
MRR = average(1 / rank_of_first_relevant_result)
```

Use a manually verified benchmark for the hackathon rather than claiming
metrics without a reliable evaluation set.

------------------------------------------------------------------------

# 40. Generation Evaluation

Evaluate:

``` text
Groundedness
Correctness
Citation validity
Abstention behavior
Completeness
Latency
```

Remember:

``` text
Fluency ≠ correctness
```

A fluent unsupported answer is still a failure.

------------------------------------------------------------------------

# 41. Acceptance Criteria

The MVP is ready when:

-   A digital PDF uploads successfully.
-   A scanned page can be processed with OCR.
-   Page numbers survive extraction and chunking.
-   Chunks are indexed in Qdrant.
-   A known question retrieves the correct source section/page.
-   Qwen answers using retrieved evidence.
-   Unsupported questions trigger safe abstention.
-   Every grounded answer exposes document/page evidence.
-   Follow-up questions preserve session context.
-   Citation clicks can open the corresponding PDF page.
-   Failure states are understandable.
-   No critical security defect remains open.

------------------------------------------------------------------------

# 42. Development Phases

## Phase 1 --- Backend skeleton

``` text
FastAPI
configuration
logging
MySQL
Qdrant
health endpoint
```

Deliverable:

``` text
GET /health
```

## Phase 2 --- Ingestion

``` text
upload
R2
MySQL document record
PyMuPDF
quality check
PaddleOCR
```

Deliverable:

``` text
PDF → page text + metadata
```

## Phase 3 --- Retrieval

``` text
chunking
BGE-M3
Qdrant
semantic search
```

Deliverable:

``` text
Question → relevant chunks
```

## Phase 4 --- RAG

``` text
Qwen
prompting
context builder
answer generator
```

Deliverable:

``` text
Question → grounded answer
```

## Phase 5 --- ProofChain

``` text
evidence validator
claim validator
citation validator
safety validator
```

Deliverable:

``` text
Answer → validated answer + citations
```

## Phase 6 --- Context

``` text
sessions
messages
query router
conversation context
```

Deliverable:

``` text
follow-up questions work
```

## Phase 7 --- Integration

``` text
React
FastAPI
R2
MySQL
Qdrant
Qwen
PDF.js
```

Deliverable:

``` text
Upload → Ask → Answer → Evidence → Exact PDF Page
```

------------------------------------------------------------------------

# 43. Seven-Day Backend Schedule

  -----------------------------------------------------------------------
  Day                     Backend work            Output
  ----------------------- ----------------------- -----------------------
  Day 1                   FastAPI, config, MySQL, Runnable backend
                          Qdrant, skeleton        

  Day 2                   Upload, R2, PyMuPDF,    PDF ingestion
                          OCR fallback            

  Day 3                   Section detection,      Searchable document
                          chunking, BGE-M3,       
                          Qdrant                  

  Day 4                   Retrieval, Qwen,        RAG answer
                          grounded prompts        

  Day 5                   Validation, citations,  ProofChain
                          sessions                

  Day 6                   Hybrid retrieval,       Release candidate
                          tests, security, tuning 

  Day 7                   Full integration, UAT,  Demo-ready MVP
                          deployment              
  -----------------------------------------------------------------------

Parallel work is expected; the days represent integration milestones,
not one-person sequential work.

------------------------------------------------------------------------

# 44. Team Ownership

### Person 1 --- Product/Project Lead

Requirements, acceptance criteria, priorities, UAT and coordination.

### Person 2 --- Solution Architect / AI Lead

RAG architecture, prompt strategy, service contracts and technical
decisions.

### Person 3 --- Frontend Developer

React chat, upload, evidence UI, PDF.js and comparison UI.

### Person 4 --- Backend/API Developer

FastAPI routes, session handling, orchestration and API contracts.

### Person 5 --- Document AI/OCR Engineer

PyMuPDF, PaddleOCR, extraction quality, section detection and chunking.

### Person 6 --- ML/Retrieval Engineer

BGE-M3, Qdrant, semantic/keyword/hybrid retrieval and evaluation.

### Person 7 --- Data/DevOps Engineer

MySQL, R2, Docker, environment configuration, deployment and logging.

### Person 8 --- QA/Security/Integration Engineer

Unit tests, integration tests, citation tests, security tests,
prompt-injection tests and UAT.

------------------------------------------------------------------------

# 45. Backend--Frontend Contract

Return structured JSON, not HTML.

Good:

``` json
{
  "answer": "The recommended dosage is...",
  "evidence": [
    {
      "chunk_id": "chunk-42",
      "page": 12,
      "section": "Dosage and Administration",
      "text": "..."
    }
  ],
  "citations": [
    {
      "document_id": "doc-001",
      "page": 12,
      "section": "Dosage and Administration"
    }
  ]
}
```

React decides how to render:

``` text
Answer
Evidence card
Citation badge
View Source
Why this answer?
```

------------------------------------------------------------------------

# 46. Comparison Feature

Comparison is optional after the core loop works.

``` text
Rinvoq PDF
      +
Skyrizi PDF
      ↓
Retrieve evidence separately
      ↓
Compare
  Indications
  Dosage
  Warnings
  Interactions
      ↓
Evidence per cell
```

Every comparison result should retain evidence for each document.

------------------------------------------------------------------------

# 47. Deployment

MVP topology:

``` text
Browser
   ↓
React
   ↓
FastAPI
   ├── MySQL
   ├── Cloudflare R2
   ├── Qdrant
   ├── PDF/OCR processing
   └── Qwen 3.5 4B
```

PDF.js runs in the browser.

Qdrant handles vector retrieval.

MySQL handles application metadata.

R2 handles original PDFs.

The Qwen inference runtime should run on hardware appropriate for the
selected model configuration.

------------------------------------------------------------------------

# 48. Performance Strategy

Optimize the expensive parts:

``` text
1. Keep retrieved context small.
2. Limit top-K.
3. Never recompute stored document embeddings unnecessarily.
4. Cache model loading.
5. OCR only low-quality pages.
6. Never send the entire PDF to Qwen.
7. Keep session context compact.
8. Measure retrieval and generation latency separately.
```

------------------------------------------------------------------------

# 49. Core ProofChain

This is the main technical differentiator:

``` text
                 QUESTION
                     │
                     ▼
              Query Processing
                     │
                     ▼
              Hybrid Retrieval
                     │
                     ▼
                  Evidence
                     │
                     ▼
                Qwen 3.5 4B
                     │
                     ▼
               Draft Answer
                     │
                     ▼
            Evidence Validator
                     │
                     ▼
              Claim Validator
                     │
                     ▼
             Citation Validator
                     │
                     ▼
              Safety Validator
                     │
                     ▼
            FINAL ANSWER
              + EVIDENCE
              + CITATION
                     │
                     ▼
               EXACT PDF PAGE
```

The key presentation line is:

> **We don't just generate an answer. We verify the answer against the
> source evidence before showing it.**

------------------------------------------------------------------------

# 50. What Not to Build

For the seven-day MVP, do not spend time on:

``` text
❌ Autonomous agents
❌ Voice assistant
❌ Mobile app
❌ Blockchain
❌ Knowledge graph
❌ EHR integration
❌ Training a custom LLM
❌ Multiple unnecessary LLMs
❌ Huge microservice architecture
❌ Enterprise IAM
❌ Complex analytics dashboard
```

Prioritize:

``` text
correctness
traceability
safety
working end-to-end flow
```

------------------------------------------------------------------------

# 51. Final Backend Definition

``` text
FastAPI
    │
    ├── Document API
    │      ↓
    │   R2 + MySQL
    │      ↓
    │   PyMuPDF
    │      ↓
    │   PaddleOCR
    │      ↓
    │   Section Detection
    │      ↓
    │   Chunking
    │
    ├── Embedding Service
    │      ↓
    │   BGE-M3
    │      ↓
    │   Qdrant
    │
    └── Chat API
           ↓
      Session Context
           ↓
      Query Processing
           ↓
      Retrieval
           ↓
      Grounded Prompt
           ↓
      Qwen 3.5 4B
           ↓
      ProofChain
           ↓
      Answer + Evidence + Citation
```

## The most important end-to-end test

``` text
Upload Rinvoq.pdf
        ↓
Ask:
"What is the recommended dosage?"
        ↓
Retrieve:
Dosage and Administration
        ↓
Qwen generates answer
        ↓
Validator confirms evidence
        ↓
Citation:
Rinvoq.pdf — Page X
        ↓
PDF.js opens the cited page
```

## The second most important test

``` text
Ask:
"What is the interaction with XYZ?"
        ↓
No sufficient evidence
        ↓
DO NOT GUESS
        ↓
"I couldn't find sufficient information
in the provided document. I don't want to guess."
```

That combination --- **evidence + citation + abstention** --- is the
core of LabelProof.

------------------------------------------------------------------------

# 52. Implementation Order for the Team

Do not create all files and then try to connect them.

Build vertical slices.

### Slice 1

``` text
FastAPI
 ↓
POST /documents/upload
 ↓
PyMuPDF
 ↓
page text
```

### Slice 2

``` text
page text
 ↓
chunking
 ↓
BGE-M3
 ↓
Qdrant
 ↓
retrieval result
```

### Slice 3

``` text
query
 ↓
Qdrant
 ↓
evidence
 ↓
Qwen
 ↓
answer
```

### Slice 4

``` text
answer
 ↓
validation
 ↓
citation
 ↓
React
 ↓
PDF.js exact page
```

### Slice 5

``` text
follow-up question
 ↓
session context
 ↓
retrieval
 ↓
grounded answer
```

Once Slice 4 works, you already have the **minimum viable LabelProof**.
Everything else improves it.

------------------------------------------------------------------------

# 53. Backend Completion Checklist

``` text
[ ] FastAPI starts successfully
[ ] /health works
[ ] MySQL connection works
[ ] Qdrant connection works
[ ] R2 credentials/configuration works
[ ] PDF upload works
[ ] PDF validation works
[ ] PyMuPDF extraction works
[ ] Extraction quality check works
[ ] PaddleOCR fallback works
[ ] Page metadata is preserved
[ ] Section detection works
[ ] Chunking works
[ ] BGE-M3 loads
[ ] Embeddings are generated
[ ] Qdrant collection exists
[ ] Chunks are indexed
[ ] Semantic search works
[ ] Keyword search works
[ ] Hybrid search works
[ ] Qwen loads
[ ] Grounded prompt works
[ ] Evidence validation works
[ ] Claim validation works
[ ] Citation validation works
[ ] Safety validation works
[ ] Safe abstention works
[ ] Session context works
[ ] Citation response works
[ ] PDF page reference works
[ ] Tests pass
[ ] Docker/deployment works
```

------------------------------------------------------------------------

## Source basis

This implementation guide is based primarily on the supplied Cognizant
Use Case 7/project-design materials and the LabelProof planning
document. The project-design material defines the RAG architecture,
seven-day delivery, technology rationale, entities, safety controls,
testing strategy and team allocation. The LabelProof material emphasizes
the evidence-first **ProofChain**, citation UI, safe abstention, hybrid
retrieval, conversation memory and exact-page demo flow.
