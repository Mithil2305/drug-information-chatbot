# Chatbot-drugInfo --- Frontend Full Implementation Guide

## 1. Purpose

This document defines the frontend implementation for **Chatbot-drugInfo**,
the evidence-first drug-information RAG chatbot.

The frontend should feel like a modern AI assistant similar to ChatGPT,
while making **document evidence, citations, source pages, and
conversation history** much more visible.

The core interaction is:

``` text
User Question
      ↓
ChatGPT-like Answer
      ↓
Citation / Source
      ↓
Evidence Card
      ↓
Open Exact PDF Page
```

The frontend is intentionally kept at a **medium level of complexity**.

We will use:

-   React
-   TypeScript
-   Vite
-   Tailwind CSS
-   Beautiful UI-inspired AI components
-   React Router
-   Axios
-   React Context API
-   useState / useReducer
-   React Hook Form
-   Zod
-   react-pdf / PDF.js
-   Lucide React
-   react-markdown
-   Sonner

We will **not use Zustand, Redux, TanStack Query, or other heavy
state-management layers**.

------------------------------------------------------------------------

# 2. UI Direction

The visual language is inspired by **Beautiful UI's AI-native interface
patterns**.

Beautiful UI presents components such as Chat, Prompt Bar, Thinking,
Streaming Text, Context Cards, Sidebar Nav, Search, Loading State and
related AI interaction primitives. The site describes its Chat component
as a tabbed chat panel with reasoning-style replies and a composer, and
its Context Cards as retrieved knowledge chunks with their sources.
citeturn0view0

For Chatbot-drugInfo, we adapt these ideas to the medical-document RAG
workflow.

Reference:

urlBeautiful UI --- AI-native interface
componentshttps://www.beautifului.dev/

Important:

> Beautiful UI is the **visual/component inspiration and source for
> selected UI primitives**. The application logic remains our own React
> implementation and is connected to the FastAPI backend.

Do not add every Beautiful UI component. Only use the patterns that make
sense for this chatbot.

------------------------------------------------------------------------

# 3. Selected Beautiful UI Patterns

  -----------------------------------------------------------------------
  Beautiful UI Pattern                Chatbot-drugInfo Usage
  ----------------------------------- -----------------------------------
  Chat                                Main chatbot interface

  Prompt Bar                          User question composer

  Streaming Text                      Display generated answer
                                      progressively if backend supports
                                      streaming

  Thinking                            Show retrieval/processing status
                                      without exposing private
                                      chain-of-thought

  Loading State                       Document processing and chat
                                      loading

  Context Cards                       Retrieved evidence chunks

  Sidebar Nav                         Chat history and application
                                      navigation

  Search                              Search previous
                                      conversations/documents

  Task Rows                           Optional document processing status

  Tool Chips                          Optional compact retrieval/source
                                      status

  Recommendation Card                 Not required for MVP

  Diff Table                          Not required for MVP

  Records Table                       Not required for MVP

  Filter Table                        Not required for MVP

  Insight Cards                       Not required for MVP

  Code Block                          Not required for drug chatbot

  Fine-tune Card                      Not required

  Selection Actions                   Not required for MVP
  -----------------------------------------------------------------------

The primary UI should therefore focus on:

``` text
Sidebar
Chat
Prompt Bar
Streaming Text
Thinking / Loading
Context Cards
PDF Viewer
Search
```

------------------------------------------------------------------------

# 4. Frontend Stack

  Purpose           Technology
  ----------------- ----------------------------------
  Framework         React.js
  Language          TypeScript
  Build             Vite
  Styling           Tailwind CSS
  AI UI             Beautiful UI patterns/components
  Routing           React Router DOM
  API               Axios
  Global state      React Context API + useContext
  Component state   useState / useReducer
  Forms             React Hook Form
  Validation        Zod
  PDF               react-pdf + PDF.js
  Icons             Lucide React
  Markdown          react-markdown
  Notifications     Sonner

### State management rule

``` text
Server/API data
      ↓
React Context

Temporary component state
      ↓
useState

More complicated local state
      ↓
useReducer
```

No Zustand.

No Redux.

No TanStack Query.

Keep the architecture understandable to the entire team.

------------------------------------------------------------------------

# 5. Application Structure

Recommended project structure:

``` text
frontend/
│
├── public/
│   ├── favicon.ico
│   └── logo.svg
│
├── src/
│   │
│   ├── assets/
│   │   └── images/
│   │
│   ├── components/
│   │   │
│   │   ├── ui/
│   │   │   └── beautiful-ui/
│   │   │
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── MobileSidebar.tsx
│   │   │
│   │   ├── chat/
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── UserMessage.tsx
│   │   │   ├── AssistantMessage.tsx
│   │   │   ├── PromptBar.tsx
│   │   │   ├── ThinkingState.tsx
│   │   │   ├── StreamingAnswer.tsx
│   │   │   └── SuggestedQuestions.tsx
│   │   │
│   │   ├── evidence/
│   │   │   ├── EvidencePanel.tsx
│   │   │   ├── ContextCard.tsx
│   │   │   ├── CitationBadge.tsx
│   │   │   ├── CitationList.tsx
│   │   │   └── WhyThisAnswer.tsx
│   │   │
│   │   ├── documents/
│   │   │   ├── UploadDropzone.tsx
│   │   │   ├── DocumentCard.tsx
│   │   │   ├── DocumentList.tsx
│   │   │   └── ProcessingStatus.tsx
│   │   │
│   │   ├── pdf/
│   │   │   ├── PdfViewer.tsx
│   │   │   ├── PdfToolbar.tsx
│   │   │   └── PageNavigator.tsx
│   │   │
│   │   ├── history/
│   │   │   ├── ChatHistory.tsx
│   │   │   ├── HistoryItem.tsx
│   │   │   └── HistorySearch.tsx
│   │   │
│   │   └── compare/
│   │       ├── CompareView.tsx
│   │       ├── DrugSelector.tsx
│   │       └── ComparisonTable.tsx
│   │
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Chat.tsx
│   │   ├── Documents.tsx
│   │   ├── History.tsx
│   │   ├── Compare.tsx
│   │   └── NotFound.tsx
│   │
│   ├── context/
│   │   ├── AppContext.tsx
│   │   ├── ChatContext.tsx
│   │   ├── DocumentContext.tsx
│   │   └── ViewerContext.tsx
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── chatApi.ts
│   │   ├── documentApi.ts
│   │   ├── citationApi.ts
│   │   └── compareApi.ts
│   │
│   ├── hooks/
│   │   ├── useChat.ts
│   │   ├── useDocuments.ts
│   │   └── useViewer.ts
│   │
│   ├── types/
│   │   ├── chat.ts
│   │   ├── document.ts
│   │   ├── citation.ts
│   │   └── comparison.ts
│   │
│   ├── lib/
│   │   ├── constants.ts
│   │   └── utils.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .env
├── package.json
├── tsconfig.json
└── vite.config.ts
```

------------------------------------------------------------------------

# 6. Main Screens

The frontend will have these main screens:

``` text
1. Home / Dashboard
2. Chat
3. Documents
4. History
5. Compare
```

The PDF viewer is not necessarily a separate route. It can appear as a
side panel/drawer inside Chat.

------------------------------------------------------------------------

# 7. Main Application Layout

The overall application should look like a modern AI workspace.

``` text
┌──────────────────────────────────────────────────────────────┐
│ Chatbot-drugInfo                                      Profile / ⚙ │
├──────────────┬───────────────────────────────┬───────────────┤
│              │                               │               │
│ Chat History │          Chat Area            │   Evidence    │
│              │                               │               │
│ + New Chat   │  User question               │ Context Card  │
│              │                               │               │
│ Today        │  Assistant answer             │ Context Card  │
│ • Dosage     │                               │               │
│ • Warnings   │  Citation [Page 12]          │ [View Source] │
│              │                               │               │
│ Yesterday    │                               │               │
│ • Drug use   │                               │               │
│              │                               │               │
│ Documents    │                               │               │
│ Compare     │                               │               │
│              │                               │               │
├──────────────┴───────────────────────────────┴───────────────┤
│                    Prompt Bar                                │
└──────────────────────────────────────────────────────────────┘
```

On smaller screens:

``` text
Sidebar → slide-over drawer

Evidence → slide-over drawer

Chat → primary screen
```

------------------------------------------------------------------------

# 8. Sidebar

The sidebar follows the Beautiful UI-style workspace navigation concept.

Sections:

``` text
Chatbot-drugInfo

+ New Chat

Chats
  Today
  Yesterday
  Previous 7 days

Workspace
  Documents
  History
  Compare

Settings
```

The sidebar should be collapsible.

### Expanded

``` text
┌──────────────────────┐
│ Chatbot-drugInfo           │
│                      │
│ + New Chat           │
│                      │
│ Chats                │
│  Dosage question     │
│  Drug interactions   │
│  Warnings            │
│                      │
│ Workspace            │
│  Documents           │
│  History             │
│  Compare             │
└──────────────────────┘
```

### Collapsed

Show icons only.

------------------------------------------------------------------------

# 9. Slide Sidebar

The user specifically wants history pages and sidebar navigation with a
slide behavior.

Use:

``` text
Sidebar
MobileSidebar
Dialog / Sheet-style overlay
```

Behavior:

``` text
Menu button
    ↓
Sidebar slides in
    ↓
User selects Chat / Documents / History / Compare
    ↓
Sidebar closes
```

For desktop, keep the sidebar persistent.

For mobile/tablet, use a slide-over.

------------------------------------------------------------------------

# 10. Chat Page

The Chat page is the most important screen.

The UI should feel familiar to ChatGPT but have stronger evidence
visibility.

``` text
┌──────────────────────────────────────────────────────────────┐
│ Rinvoq Prescribing Information                     • Ready   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                         CHAT                                 │
│                                                              │
│ User                                                        │
│ What is the recommended dosage?                              │
│                                                              │
│ Assistant                                                   │
│ The recommended dosage is ...                                │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ Sources                                                │   │
│ │ [Page 12] Dosage and Administration                   │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                              │
│                   Thinking / Loading                         │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ Ask about this document...                       [Send]      │
└──────────────────────────────────────────────────────────────┘
```

------------------------------------------------------------------------

# 11. Prompt Bar

The Prompt Bar is inspired by Beautiful UI's Prompt Bar.

It should be the primary interaction control.

Features:

``` text
Textarea
Send button
Attach document button if needed
Optional source/document selector
```

MVP:

``` text
┌─────────────────────────────────────────────────────────────┐
│ Ask about this document...                          ↑ Send  │
└─────────────────────────────────────────────────────────────┘
```

Do not implement unnecessary `/commands`, model selection, dictation or
advanced controls unless the team has extra time.

------------------------------------------------------------------------

# 12. User Message

User messages should be visually simple.

``` text
                    User
                    ┌─────────────────────────────┐
                    │ What are the major warnings?│
                    └─────────────────────────────┘
```

Do not over-design user bubbles.

The assistant answer is the important content.

------------------------------------------------------------------------

# 13. Assistant Message

Assistant responses should support:

-   Markdown.
-   Citations.
-   Evidence.
-   Follow-up suggestions.
-   Safe response state.

Example:

``` text
The major warnings include ...

[Page 8] [Page 9]

Sources
┌─────────────────────────────────────────┐
│ Dosage and Administration               │
│ Page 8                                   │
│ View source →                            │
└─────────────────────────────────────────┘
```

------------------------------------------------------------------------

# 14. Streaming Text

If the FastAPI backend provides streaming responses, use a Beautiful
UI-inspired streaming presentation.

Flow:

``` text
Backend
  ↓
Token/chunk
  ↓
Frontend
  ↓
Assistant message updates
```

Example:

``` text
The recommended dosage is
The recommended dosage is 15 mg
The recommended dosage is 15 mg once daily...
```

If streaming is not implemented in the backend initially, render the
completed answer normally.

Do not delay the MVP waiting for streaming.

------------------------------------------------------------------------

# 15. Thinking State

Beautiful UI provides an expandable Thinking component. For Chatbot-drugInfo,
use a **safe processing indicator**, not private chain-of-thought.

Good:

``` text
Searching the document...
Finding relevant evidence...
Validating citations...
Preparing answer...
```

Avoid displaying:

``` text
Private model reasoning
Internal chain-of-thought
Hidden prompts
```

The UI should expose **system status**, not hidden reasoning.

Example:

``` text
⌁ Searching the document
  Finding relevant sections
  Checking supporting evidence
```

This is particularly useful during a RAG request.

------------------------------------------------------------------------

# 16. Loading State

Use a Beautiful UI-inspired loading state during:

``` text
PDF processing
Chat retrieval
PDF loading
Comparison
```

Example:

``` text
Searching the prescribing information...

Finding supporting evidence
```

Keep the animation subtle.

------------------------------------------------------------------------

# 17. Suggested Questions

At the start of a conversation:

``` text
Suggested questions

What is this drug used for?

What is the recommended dosage?

What are the major warnings?

What are the contraindications?

What are the drug interactions?
```

Clicking one should place the question into the Prompt Bar or submit it
directly.

------------------------------------------------------------------------

# 18. Evidence Panel

This is the main differentiator of Chatbot-drugInfo.

The project specification explicitly makes evidence/citation a mandatory
feature and requires clicking a citation to open the exact source page.
fileciteturn1file4

The UI should therefore make evidence easy to discover.

Example:

``` text
┌─────────────────────────────────────────┐
│ Evidence                                │
│                                         │
│ 1. Dosage and Administration             │
│                                         │
│ Page 12                                 │
│                                         │
│ Relevant source text appears here...    │
│                                         │
│ [ Open Page 12 ]                        │
│ [ Why this answer? ]                    │
└─────────────────────────────────────────┘
```

------------------------------------------------------------------------

# 19. Context Cards

Use the Beautiful UI Context Card pattern for retrieved RAG chunks.

Beautiful UI describes Context Cards as retrieved knowledge chunks
together with their sources. citeturn0view0

For Chatbot-drugInfo:

``` text
┌─────────────────────────────────────────┐
│ Dosage and Administration                │
│                                         │
│ The recommended dosage is ...           │
│                                         │
│ PDF                                     │
│ Rinvoq Prescribing Information          │
│ Page 12                                 │
│                                         │
│ [View Source]                            │
└─────────────────────────────────────────┘
```

Each card should show:

``` text
Section
Evidence text
Document
Page
```

Optional:

``` text
Relevance score
```

Do not overload the card with technical RAG information.

------------------------------------------------------------------------

# 20. Citation Badge

Use compact citation badges inside assistant responses.

Example:

``` text
The recommended dosage is 15 mg once daily. [Page 12]
```

The page badge should be clickable.

Alternative:

``` text
📄 Page 12
```

Click:

``` text
Citation
  ↓
ViewerContext
  ↓
PDF page 12
```

------------------------------------------------------------------------

# 21. PDF Viewer

The project architecture specifies React/PDF.js source viewing, with
citation navigation opening the relevant source page.
fileciteturn1file6

Use:

``` text
react-pdf
PDF.js
```

Viewer layout:

``` text
┌──────────────────────────────────────────────┐
│ Rinvoq.pdf          − 100% +    Page 12 / 48│
├──────────────────────────────────────────────┤
│                                              │
│                PDF PAGE 12                   │
│                                              │
│        DOSAGE AND ADMINISTRATION             │
│                                              │
└──────────────────────────────────────────────┘
```

Required:

-   Page number.
-   Previous page.
-   Next page.
-   Zoom.
-   Document name.
-   Loading state.
-   Error state.

------------------------------------------------------------------------

# 22. Citation → PDF Navigation

This is one of the most important interactions.

``` text
User clicks [Page 12]
          ↓
citation.page = 12
          ↓
ViewerContext.setPage(12)
          ↓
PdfViewer
          ↓
Render page 12
```

Example state:

``` ts
interface ViewerState {
  documentId: string | null;
  page: number;
  zoom: number;
  isOpen: boolean;
}
```

------------------------------------------------------------------------

# 23. Viewer Context

Use React Context.

Example:

``` ts
interface ViewerContextType {
  documentId: string | null;
  page: number;
  zoom: number;
  isOpen: boolean;

  openSource: (
    documentId: string,
    page: number
  ) => void;

  closeViewer: () => void;

  setPage: (page: number) => void;
  setZoom: (zoom: number) => void;
}
```

Provider:

``` text
ViewerProvider
    ↓
Chat
    ↓
EvidenceCard
    ↓
PdfViewer
```

------------------------------------------------------------------------

# 24. Why This Answer

The project specification identifies "Why this answer?" as a major WOW
feature. fileciteturn1file4

Use a simple dialog/drawer.

Example:

``` text
Why this answer?

Answer is based on:

✓ Supporting evidence found
✓ Source document identified
✓ Page identified
✓ Citation available

Source

Rinvoq Prescribing Information

Page 12
DOSAGE AND ADMINISTRATION

Relevant evidence:
"The recommended dosage..."
```

Button:

``` text
[ Open Source ]
```

Important:

This feature should show **evidence provenance and validation**, not
hidden model reasoning.

------------------------------------------------------------------------

# 25. Safe "I Don't Know"

The project specifically requires the chatbot to avoid guessing when the
requested information is not present in the document.
fileciteturn1file7

The frontend should render a distinct state.

``` text
┌─────────────────────────────────────────────┐
│ Information not found                       │
│                                             │
│ I couldn't find this information in the     │
│ provided document. I don't want to guess.   │
└─────────────────────────────────────────────┘
```

Backend response:

``` json
{
  "status": "insufficient_evidence",
  "answer": "I couldn't find this information in the provided document. I don't want to guess.",
  "citations": []
}
```

Do not manufacture citations on the frontend.

------------------------------------------------------------------------

# 26. Chat History

The user wants history pages and a slide sidebar.

History should contain:

``` text
Today
  What is the dosage?
  What are the warnings?

Yesterday
  Drug interactions

Previous 7 days
  Contraindications
```

Each history item contains:

``` text
conversation_id
title
document_name
updated_at
```

Clicking it:

``` text
History item
    ↓
/chat/:conversationId
    ↓
Load conversation
```

------------------------------------------------------------------------

# 27. History Search

Use a simple search box.

``` text
Search conversations...
```

Search:

``` text
dosage
warnings
interaction
Rinvoq
```

The backend can provide search later. For MVP, if history is small,
client-side filtering is enough.

------------------------------------------------------------------------

# 28. Documents Page

Documents page manages uploaded PDFs.

``` text
Documents

[ Upload PDF ]

┌─────────────────────────────┐
│ Rinvoq.pdf                  │
│ 48 pages                    │
│ Ready                       │
│                             │
│ [ Open Chat ] [ View PDF ] │
└─────────────────────────────┘
```

Statuses:

``` text
Uploading
Processing
Ready
Failed
```

------------------------------------------------------------------------

# 29. Upload UI

Use a simple Beautiful UI-inspired loading/task experience.

``` text
┌────────────────────────────────────────────┐
│ Upload Drug Label                          │
│                                            │
│ Drop PDF here                              │
│ or                                         │
│ [ Browse ]                                 │
│                                            │
│ PDF only                                   │
└────────────────────────────────────────────┘
```

After upload:

``` text
Rinvoq.pdf

✓ Uploaded
✓ Text extracted
✓ Sections processed
● Creating embeddings
○ Ready
```

The exact processing stages can be simplified to whatever the backend
API actually reports.

------------------------------------------------------------------------

# 30. Compare Page

The project includes multi-drug comparison as a feature.
fileciteturn1file4

UI:

``` text
Compare Drugs

Drug A
[ Rinvoq ]

Drug B
[ Skyrizi ]

[ Compare ]
```

Result:

``` text
┌──────────────┬──────────────────┬──────────────────┐
│              │ Rinvoq           │ Skyrizi          │
├──────────────┼──────────────────┼──────────────────┤
│ Indications  │ Evidence         │ Evidence         │
│ Dosage       │ Evidence         │ Evidence         │
│ Warnings     │ Evidence         │ Evidence         │
│ Interactions │ Evidence         │ Evidence         │
└──────────────┴──────────────────┴──────────────────┘
```

Each cell:

``` text
Answer
[Page 12]
```

Clicking the citation opens the source page.

------------------------------------------------------------------------

# 31. React Context Architecture

Use only a few contexts.

``` text
AppContext
    │
    ├── ChatContext
    │
    ├── DocumentContext
    │
    └── ViewerContext
```

## AppContext

Stores:

``` text
sidebarOpen
currentRoute-related UI state
theme if required
```

## ChatContext

Stores:

``` text
current conversation
messages
conversationId
selectedDocument
loading
error
```

## DocumentContext

Stores:

``` text
documents
selectedDocument
upload state
processing state
```

## ViewerContext

Stores:

``` text
viewer open/closed
document ID
page
zoom
```

------------------------------------------------------------------------

# 32. Chat Context Example

``` ts
interface ChatContextType {
  messages: ChatMessage[];
  conversationId: string | null;
  documentId: string | null;
  isLoading: boolean;
  error: string | null;

  sendMessage: (question: string) => Promise<void>;
  clearChat: () => void;
  loadConversation: (id: string) => Promise<void>;
}
```

The context should call the API service.

Components should not directly contain large API workflows.

------------------------------------------------------------------------

# 33. API Service Layer

Use Axios.

`services/api.ts`:

``` ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
```

Environment:

``` env
VITE_API_URL=http://localhost:8000/api
```

------------------------------------------------------------------------

# 34. Backend APIs Used by Frontend

The supplied project specification lists these core APIs: upload,
process, documents, chat, compare and citations. fileciteturn1file14

Recommended frontend integration:

``` text
POST /documents/upload
POST /documents/process
GET  /documents

POST /chat
GET  /chat/{conversation_id}

POST /compare

GET  /citations/{id}
```

The exact request/response schema should be finalized jointly with the
backend developer.

------------------------------------------------------------------------

# 35. Chat Request

Example:

``` json
{
  "question": "What is the recommended dosage?",
  "document_id": "doc_123",
  "conversation_id": "conv_123"
}
```

The backend architecture already expects the question,
session/conversation context and selected document scope.
fileciteturn1file8

------------------------------------------------------------------------

# 36. Chat Response

Recommended frontend contract:

``` json
{
  "conversation_id": "conv_123",
  "answer": "The recommended dosage is ...",
  "status": "grounded",
  "citations": [
    {
      "citation_id": "cit_001",
      "document_id": "doc_123",
      "document_name": "Rinvoq.pdf",
      "page": 12,
      "section": "Dosage and Administration",
      "text": "..."
    }
  ]
}
```

The frontend should consume structured response data rather than trying
to infer citations from answer text.

------------------------------------------------------------------------

# 37. TypeScript Types

## Chat

``` ts
export type AnswerStatus =
  | "grounded"
  | "insufficient_evidence";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  status?: AnswerStatus;
}

export interface ChatResponse {
  conversation_id: string;
  answer: string;
  status: AnswerStatus;
  citations: Citation[];
}
```

## Citation

``` ts
export interface Citation {
  citation_id: string;
  document_id: string;
  document_name: string;
  page: number;
  section?: string;
  text: string;
}
```

## Document

``` ts
export interface Document {
  id: string;
  name: string;
  pages?: number;
  status: "uploading" | "processing" | "ready" | "failed";
}
```

------------------------------------------------------------------------

# 38. React Router

Routes:

``` text
/
├── /chat/:conversationId?
├── /documents
├── /history
├── /compare
└── *
```

Possible navigation:

``` text
Home
  ↓
Chat

Sidebar
  ├── Chat
  ├── Documents
  ├── History
  └── Compare
```

------------------------------------------------------------------------

# 39. Home Page

Keep the home page simple.

``` text
Chatbot-drugInfo

Evidence-first drug information

Ask questions from approved drug documents.

[ Upload PDF ]
[ Start Chat ]
```

Recent documents can appear underneath.

Do not turn Home into a large analytics dashboard.

------------------------------------------------------------------------

# 40. Chat Layout Modes

The chat page should support three states.

## Normal

``` text
Sidebar | Chat | Evidence
```

## Evidence Open

``` text
Sidebar | Chat | Evidence + source
```

## PDF Open

``` text
Sidebar | Chat | PDF Viewer
```

The evidence/source area can be implemented as a right-side panel.

------------------------------------------------------------------------

# 41. Right Evidence Drawer

When the user clicks a citation:

``` text
Chat
 ↓
Evidence drawer opens
 ↓
Context Card
 ↓
View Source
 ↓
PDF viewer
```

This avoids navigating away from the conversation.

------------------------------------------------------------------------

# 42. Mobile Behavior

Desktop:

``` text
┌───────┬──────────────┬──────────────┐
│ Side  │ Chat         │ Evidence     │
└───────┴──────────────┴──────────────┘
```

Mobile:

``` text
┌───────────────────────┐
│ Chat                  │
│                       │
│                       │
│                       │
├───────────────────────┤
│ Prompt                │
└───────────────────────┘
```

Sidebar:

``` text
☰
 ↓
Slide-over
```

Evidence:

``` text
Citation click
 ↓
Evidence drawer
```

PDF:

``` text
View Source
 ↓
Full-screen/modal viewer
```

------------------------------------------------------------------------

# 43. Visual Design

Use the Beautiful UI visual direction:

-   Clean.
-   Minimal.
-   Modern.
-   AI-native.
-   Compact cards.
-   Subtle borders.
-   Rounded components.
-   Clear hierarchy.
-   Minimal animation.
-   Professional medical feel.

Do not make the application look like a generic admin dashboard.

The UI should feel closer to:

``` text
ChatGPT
+
Perplexity-style citations
+
Document viewer
```

but branded as Chatbot-drugInfo.

------------------------------------------------------------------------

# 44. Color Direction

Recommended:

``` text
Background
Light neutral / white

Primary
Professional blue

Text
Dark neutral

Secondary text
Muted gray

Success
Green

Warning
Amber

Error
Red

Evidence
Subtle blue/neutral surface
```

Avoid overly bright gradients and excessive AI-glow effects.

------------------------------------------------------------------------

# 45. Typography

Use a clean sans-serif font.

Hierarchy:

``` text
Page title
    ↓
Section title
    ↓
Message text
    ↓
Evidence text
    ↓
Metadata
```

The actual answer should remain highly readable.

------------------------------------------------------------------------

# 46. Animations

Keep animation limited to:

``` text
Sidebar slide
Evidence drawer slide
Loading indicator
Message appearance
PDF panel transition
```

Do not animate every card.

The chatbot should feel fast.

------------------------------------------------------------------------

# 47. Notifications

Use Sonner for:

``` text
Document uploaded
Upload failed
Document ready
Chat request failed
PDF unavailable
Comparison generated
```

Example:

``` text
✓ Document uploaded successfully
```

Errors should also be visible inline when they affect the current
workflow.

------------------------------------------------------------------------

# 48. Error Handling

Handle:

``` text
Backend unavailable
Upload failed
Invalid PDF
Document processing failed
Chat request failed
No evidence
Citation unavailable
PDF loading failed
Comparison failed
```

Example:

``` text
Unable to get an answer.

Please try again.
```

For insufficient evidence:

``` text
I couldn't find this information in the provided document.
I don't want to guess.
```

This is not a generic error; it is a valid RAG result.

------------------------------------------------------------------------

# 49. Frontend Security

Never place these in frontend code:

``` text
LLM API key
Qdrant credentials
Database password
R2 secret
Backend private credentials
```

Only:

``` env
VITE_API_URL
```

should normally be required.

The backend performs the protected operations.

------------------------------------------------------------------------

# 50. PDF Security

Frontend should validate:

``` text
PDF file type
Reasonable file size
```

But backend must validate independently.

Never trust frontend validation as a security boundary.

------------------------------------------------------------------------

# 51. API Data Flow

## Upload

``` text
UploadDropzone
      ↓
documentApi.upload()
      ↓
Axios
      ↓
FastAPI
      ↓
Document status
      ↓
DocumentContext
      ↓
DocumentCard
```

## Chat

``` text
PromptBar
      ↓
ChatContext.sendMessage()
      ↓
chatApi.sendMessage()
      ↓
FastAPI
      ↓
RAG
      ↓
Answer + citations
      ↓
ChatContext
      ↓
ChatMessage
      ↓
ContextCard
```

## Citation

``` text
CitationBadge
      ↓
ViewerContext.openSource()
      ↓
documentId + page
      ↓
PdfViewer
```

------------------------------------------------------------------------

# 52. RAG-Aware Frontend

The frontend does not perform RAG.

Backend handles:

``` text
Query
 ↓
Conversation context
 ↓
BGE-M3
 ↓
Qdrant
 ↓
Evidence filtering
 ↓
Qwen 3.5 4B
 ↓
Citation binding
```

The frontend receives:

``` text
Answer
+
Citation
+
Evidence metadata
```

The project architecture explicitly separates React rendering from the
retrieval/generation pipeline. fileciteturn1file8

------------------------------------------------------------------------

# 53. What Frontend Should Never Do

Do not:

``` text
Generate medical answers
Calculate citations
Guess page numbers
Search the vector database directly
Call Qwen directly
Call Qdrant directly
Store LLM secrets
Invent missing evidence
```

Frontend is a client of the backend.

------------------------------------------------------------------------

# 54. Conversation Memory

The backend handles contextual awareness, but the frontend must preserve
the conversation ID.

Example:

``` text
Conversation:
conv_123

Question 1:
What is this drug used for?

Question 2:
What is the dosage?

Question 3:
What about elderly patients?
```

Every follow-up uses:

``` text
conversation_id = conv_123
```

The project requirement explicitly includes follow-up questions without
requiring the user to repeat the full context. fileciteturn1file3

------------------------------------------------------------------------

# 55. History Data Flow

``` text
Chat
 ↓
conversation_id
 ↓
Backend saves session/history
 ↓
History API
 ↓
HistoryContext / ChatContext
 ↓
Sidebar
```

Clicking a history item:

``` text
HistoryItem
 ↓
navigate(`/chat/${conversationId}`)
 ↓
loadConversation()
 ↓
render messages
```

------------------------------------------------------------------------

# 56. Document Selection

Chat header should clearly show the current source.

Example:

``` text
Rinvoq Prescribing Information
48 pages
● Ready
```

This avoids confusion about which PDF the chatbot is answering from.

------------------------------------------------------------------------

# 57. Source Scope

If the user has multiple documents, the frontend should allow selecting
the source.

Example:

``` text
Source

[ Rinvoq Prescribing Information ▼ ]
```

MVP can use one selected document at a time.

Multi-document retrieval can be introduced later.

------------------------------------------------------------------------

# 58. Comparison Evidence

Comparison cells should behave like evidence cards.

Example:

``` text
Rinvoq

Indication:
Approved for ...

[Page 4]
```

Click:

``` text
Page 4
 ↓
PDF viewer
 ↓
Rinvoq.pdf page 4
```

Same for Skyrizi.

------------------------------------------------------------------------

# 59. Frontend Implementation Order

Do not build all screens at once.

## Step 1 --- Foundation

Build:

``` text
Vite
React
TypeScript
Tailwind
Router
Layout
Sidebar
```

## Step 2 --- Chat

Build:

``` text
ChatWindow
ChatMessage
PromptBar
```

Use mock data first.

## Step 3 --- API

Connect:

``` text
POST /chat
```

## Step 4 --- Evidence

Build:

``` text
CitationBadge
ContextCard
EvidencePanel
```

## Step 5 --- PDF

Build:

``` text
PdfViewer
ViewerContext
Citation navigation
```

## Step 6 --- Upload

Build:

``` text
UploadDropzone
Documents page
Processing status
```

## Step 7 --- History

Build:

``` text
History sidebar
History page
Conversation loading
```

## Step 8 --- Compare

Build:

``` text
DrugSelector
ComparisonTable
ComparisonEvidence
```

## Step 9 --- Polish

Only after the complete workflow works.

------------------------------------------------------------------------

# 60. Mock Data First

Before backend integration, create mock chat data.

Example:

``` ts
const mockMessage = {
  role: "assistant",
  content: "The recommended dosage is ...",
  citations: [
    {
      citation_id: "cit_001",
      document_id: "doc_001",
      document_name: "Rinvoq.pdf",
      page: 12,
      section: "Dosage and Administration",
      text: "..."
    }
  ]
};
```

This lets the frontend developer finish the UI before the backend is
fully ready.

Then replace mock API functions with Axios calls.

------------------------------------------------------------------------

# 61. Definition of Done

## Chat

-   [ ] Chat UI resembles a modern AI assistant.
-   [ ] User can send a question.
-   [ ] Assistant answer renders.
-   [ ] Markdown renders correctly.
-   [ ] Loading state works.
-   [ ] Error state works.

## Prompt Bar

-   [ ] Text input works.
-   [ ] Send button works.
-   [ ] Enter submission works if desired.
-   [ ] Disabled state works while loading.

## Evidence

-   [ ] Citations appear.
-   [ ] Context cards appear.
-   [ ] Page number appears.
-   [ ] Document name appears.
-   [ ] Section appears.
-   [ ] View Source works.
-   [ ] Why This Answer works.

## PDF

-   [ ] PDF opens.
-   [ ] Correct document opens.
-   [ ] Correct page opens.
-   [ ] Previous/next works.
-   [ ] Zoom works.

## Documents

-   [ ] Upload works.
-   [ ] Processing status works.
-   [ ] Documents list works.
-   [ ] Open Chat works.

## History

-   [ ] Conversations appear.
-   [ ] Sidebar can slide.
-   [ ] History item opens conversation.
-   [ ] Search/filter works.

## Compare

-   [ ] Two documents can be selected.
-   [ ] Comparison displays.
-   [ ] Evidence can be opened.

## Safety

-   [ ] Insufficient evidence is shown clearly.
-   [ ] Frontend never invents an answer.
-   [ ] Frontend never invents citations.

------------------------------------------------------------------------

# 62. Core Demo Flow

The frontend should make this demo extremely smooth:

``` text
1. Open Chatbot-drugInfo
       ↓
2. Upload Rinvoq PDF
       ↓
3. Processing status
       ↓
4. Open Chat
       ↓
5. Ask:
   "What is the recommended dosage?"
       ↓
6. Answer appears
       ↓
7. Citation appears:
   Page 12
       ↓
8. Click citation
       ↓
9. Evidence drawer opens
       ↓
10. Click View Source
       ↓
11. PDF opens directly at Page 12
       ↓
12. Ask:
    "What about elderly patients?"
       ↓
13. Backend uses conversation context
       ↓
14. Answer + evidence
       ↓
15. Ask something not present
       ↓
16. "I couldn't find this information..."
       ↓
17. Upload second drug
       ↓
18. Compare
       ↓
19. Comparison table + evidence
```

This directly demonstrates the core workflow described in the project
material: upload, process, retrieve, answer, cite and inspect.
fileciteturn1file6

------------------------------------------------------------------------

# 63. Recommended Package Setup

Initialize:

``` bash
npm create vite@latest frontend -- --template react-ts

cd frontend

npm install
```

Install core dependencies:

``` bash
npm install \
react-router-dom \
axios \
react-hook-form \
zod \
@hookform/resolvers \
react-pdf \
pdfjs-dist \
react-markdown \
lucide-react \
sonner
```

Install Tailwind according to the current Vite/Tailwind setup being used
by the team.

For Beautiful UI:

> Use the components/primitives from the Beautiful UI project that are
> compatible with the selected React/Tailwind setup. Because the site
> presents its components as copy-paste-ready primitives, do not assume
> a single npm package or invent package names; take the required
> component implementation from the official Beautiful UI source and
> adapt it into `src/components/ui/beautiful-ui/`.

Reference:

urlBeautiful UI official sitehttps://www.beautifului.dev/

------------------------------------------------------------------------

# 64. Environment

`.env`

``` env
VITE_API_URL=http://localhost:8000/api
```

Production:

``` env
VITE_API_URL=https://your-backend-domain/api
```

No model credentials should be placed here.

------------------------------------------------------------------------

# 65. Final Architecture

``` text
                         Chatbot-drugInfo
                             │
                             ▼
                    React + TypeScript
                             │
             ┌───────────────┼────────────────┐
             │               │                │
             ▼               ▼                ▼
          Sidebar          Chat           Documents
             │               │                │
             │               ▼                ▼
             │          Prompt Bar        Upload
             │               │                │
             │               ▼                │
             │         Assistant Answer       │
             │               │                │
             │               ▼                │
             │        Citation / Evidence     │
             │               │                │
             │               ▼                │
             │          PDF Viewer             │
             │                                │
             └───────────────┬────────────────┘
                             │
                             ▼
                     React Context API
                             │
                             ▼
                           Axios
                             │
                             ▼
                         FastAPI
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
         Documents          RAG          Comparison
                              │
                    ┌─────────┼─────────┐
                    ▼         ▼         ▼
                  BGE-M3    Qdrant   Qwen 3.5 4B
                              │
                              ▼
                         Citations
                              │
                              ▼
                         PDF.js View
```

------------------------------------------------------------------------

# 66. Final Component Relationship

``` text
App
│
└── AppProvider
    │
    ├── ChatProvider
    │
    ├── DocumentProvider
    │
    └── ViewerProvider
        │
        └── AppLayout
            │
            ├── Sidebar
            │
            └── Main
                │
                ├── Chat
                │   ├── ChatWindow
                │   │   ├── UserMessage
                │   │   └── AssistantMessage
                │   │       ├── StreamingAnswer
                │   │       ├── CitationBadge
                │   │       └── ContextCard
                │   │
                │   └── PromptBar
                │
                ├── Documents
                │   ├── UploadDropzone
                │   ├── DocumentList
                │   └── ProcessingStatus
                │
                ├── History
                │   ├── HistorySearch
                │   └── ChatHistory
                │
                └── Compare
                    ├── DrugSelector
                    └── ComparisonTable

ViewerContext
    │
    └── PdfViewer
```

------------------------------------------------------------------------

# 67. Final Recommendation

The frontend should **not become a complicated enterprise dashboard**.

Build one excellent experience:

``` text
ChatGPT-like Chat
        +
Beautiful UI AI interaction patterns
        +
Evidence Context Cards
        +
Citations
        +
Exact PDF Page Viewer
        +
Chat History Sidebar
```

The strongest visual moment should be:

``` text
Assistant Answer
      ↓
📄 Page 12
      ↓
Click
      ↓
Evidence Card
      ↓
View Source
      ↓
PDF automatically opens at Page 12
```

That directly supports the project's evidence-first concept and the
required page-level citation workflow. fileciteturn1file4turn1file6

The frontend remains intentionally simple:

``` text
React
+ TypeScript
+ Tailwind
+ Beautiful UI components/patterns
+ React Context
+ Axios
+ PDF.js
```

No Zustand.\
No Redux.\
No unnecessary state-management framework.\
No direct AI/model logic in the browser.
