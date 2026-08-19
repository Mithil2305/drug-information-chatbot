# MediMei Frontend — Complete Reference

## Stack

| Category | Technology |
|---|---|
| Framework | React 19 + Vite 6 |
| Language | TypeScript 5.7 |
| Styling | TailwindCSS 3.4 (custom theme tokens via CSS variables) |
| Routing | React Router DOM 7 |
| Icons | Lucide React |
| Toasts | Sonner |
| Markdown | react-markdown + remark-gfm |
| PDF/Word | mammoth (docx → text in viewer) |
| Build | `vite build` (tsc -b && vite build) |
| Lint | ESLint 9 + typescript-eslint + react-hooks + react-refresh plugins |

## Project Structure

```
frontend/
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── .env                    (VITE_API_URL, VITE_USE_MOCK_COMPARE)
└── src/
    ├── main.tsx            (entry: ReactDOM.createRoot)
    ├── App.tsx             (router + provider tree)
    ├── index.css           (Tailwind directives + global styles)
    ├── api/                (HTTP client + endpoint functions)
    ├── contexts/           (7 React Context providers)
    ├── stores/             (3 lightweight context stores)
    ├── hooks/              (12 custom hooks)
    ├── types/              (5 TypeScript type files)
    ├── theme/              (design tokens, colors, typography)
    ├── utils/              (validation, formatters, scroll, mock data)
    ├── services/           (comparisonService with mock fallback)
    ├── components/         (8 folders, 75 components)
    └── pages/              (7 page components)
```

---

## Provider Hierarchy (App.tsx)

```
BrowserRouter
└── ThemeProvider          (light/dark, persisted in localStorage)
    └── AuthProvider       (JWT token, user profile, login/register/logout)
        └── UIProvider     (sidebar, mobile, search panel state)
            └── TaskProvider        (single global task with abort + cancel API)
                └── ConversationProvider    (chat session list, CRUD)
                    └── DocumentProvider    (document list, upload, poll, rename)
                        └── ChatProvider    (messages, send, citations, loading)
```

---

## Routes

| Path | Component | Protected |
|---|---|---|
| `/home` | HomePage | No |
| `/` | ChatPage | Yes |
| `/:conversationId?` | ChatPage | Yes |
| `/chat` | ChatPage | Yes |
| `/chat/:conversationId?` | ChatPage | Yes |
| `/documents` | DocumentsPage | Yes |
| `/compare` | ComparePage | Yes |
| `/memories` | MemoryPage | Yes |
| `/signin`, `/login` | SignInPage | No |
| `/signup`, `/register` | SignUpPage | No |
| `*` | HomePage | No |

---

## API Layer (`src/api/`)

### `client.ts` — `apiFetch<T>(path, options)`
- Base URL from `VITE_API_URL` (default `http://localhost:8000`)
- Auto-attaches `Authorization: Bearer <token>` from `localStorage('labelproof_token')`
- Attaches `X-Task-Id` header if a global task is running
- Auto JSON `Content-Type` for body requests (skipped for FormData)
- 401 → removes token, dispatches `MediMei:auth-logout` event
- Parses JSON response; returns `undefined` for 204 or empty body

### Endpoint Functions

| File | Functions | Backend Endpoints |
|---|---|---|
| `auth.ts` | `loginRequest`, `registerRequest`, `getMeRequest` | `POST /auth/login`, `POST /auth/register`, `GET /auth/me` |
| `chat.ts` | `sendMessage` | `POST /chat` |
| `sessions.ts` | `listSessions`, `createSession`, `getSession`, `updateSession`, `deleteSession`, `toConversation`, `toConversationSummary` | `GET/POST /sessions`, `GET/PATCH/DELETE /sessions/:id` |
| `documents.ts` | `fetchDocuments`, `uploadDocument`, `deleteDocument`, `updateDocument`, `getDocumentStatus`, `viewDocumentUrl` | `GET /documents`, `POST /documents/upload`, `DELETE/PATCH /documents/:id`, `GET /documents/:id/status`, `GET /documents/:id/view` |
| `memories.ts` | `getMemoriesRequest`, `createMemoryRequest`, `deleteMemoryRequest`, `clearMemoriesRequest`, `toggleMemoryRequest` | `GET/POST /memories`, `DELETE /memories/:id`, `POST /memories/clear`, `POST /memories/toggle` |
| `compare.ts` | `compareDrugsApi`, `compareDrugs` | `POST /compare` |
| `citations.ts` | `getCitation` | `GET /citations/:id` |
| `viewer.ts` | `getDocumentViewUrl`, `fetchDocumentFile`, `fetchDocumentChunks` | `GET /documents/:id/view`, `GET /documents/:id/chunks` |

---

## Contexts (`src/contexts/`)

### AuthContext
- **State**: `user: UserProfile`, `token: string`, `loading: boolean`
- **Actions**: `login(email, password)`, `register(email, password)`, `logout()`, `updateUser(fields)`
- **Persistence**: token in `localStorage('labelproof_token')`, user in `localStorage('medimei-user')`
- **Auto-logout**: listens for `MediMei:auth-logout` custom event
- **UserProfile**: `{ user_id, email, role, created_at, name?, memory_enabled? }`

### ChatContext
- **State**: `messages: ChatMessage[]`, `isLoading`, `selectedCitation`, `selectedMessageId`, `activeCitations`
- **Actions**: `sendMessage(content, documentIds?)`, `clearChat()`, `setSelectedCitation()`, `setSelectedMessageId()`
- **Flow**: Creates session if none active → sends message → maps response to ChatMessage → sets citations
- **Message loading**: fetches session messages on `activeConversationId` change
- **Lowercases** all user input before sending

### ConversationContext
- **State**: `conversations: ConversationSummary[]`, `activeConversationId`
- **Actions**: `selectConversation(id)`, `renameConversation(id, title)`, `deleteConversation(id)`, `newConversation()`
- **Loads** sessions on user change

### DocumentContext
- **State**: `documents: Document[]`, `filteredDocuments`, `searchQuery`
- **Actions**: `uploadDocument(file)`, `deleteDocument(id)`, `renameDocument(id, name)`
- **Upload flow**: optimistic temp doc → upload → poll status every 3s → replace with real doc on completion
- **Processing poll**: refetches all docs every 4s while any doc is `processing`
- **Maps** backend doc fields to frontend `Document` type

### TaskContext
- **State**: `currentTask: TaskState` (type, status, payload, result, error)
- **Actions**: `startTask(type, payload, runner)`, `cancelTask()`, `completeTask()`, `failTask()`, `resetTask()`
- **Single-task model**: only one task runs at a time; rejects if already running
- **Abort**: uses `AbortController`, sends `POST /tasks/:id/cancel` to backend
- **Persistence**: task state in `localStorage('medimei-current-task')`; interrupted tasks marked as error on reload
- **Task types**: `'chat' | 'compare' | 'document' | null`

### ThemeContext
- **State**: `theme: 'light' | 'dark'`, `colors: ThemeColors`
- **Actions**: `toggleTheme()`
- **Persistence**: `localStorage('MediMei-theme')`, toggles `light`/`dark` class on `<html>`

### UIContext
- **State**: `sidebarOpen`, `isMobile`, `sidebarCollapsed`, `searchOpen`
- **Actions**: `openSidebar`, `closeSidebar`, `toggleSidebar`, `toggleCollapse`, `collapseSidebar`, `expandSidebar`, `toggleSearch`, `closeSearch`
- **Mobile breakpoint**: 1024px

---

## Stores (`src/stores/`)

Lightweight alternative contexts (not used in main provider tree):

| Store | State | Hook |
|---|---|---|
| `chatStore.tsx` | `messages`, `isLoading`, `addMessage`, `clear` | `useChatStore()` |
| `documentStore.tsx` | `documents`, `selectedId`, `select` | `useDocumentStore()` |
| `viewerStore.tsx` | `currentPage`, `totalPages`, `scale` | `useViewerStore()` |

---

## Hooks (`src/hooks/`)

| Hook | Wraps | Returns |
|---|---|---|
| `useAuth` | AuthContext | user, token, loading, login, register, logout, updateUser |
| `useChat` | ChatContext | messages, isLoading, sendMessage, clearChat, citations |
| `useConversations` | ConversationContext | conversations, activeId, select, rename, delete, new |
| `useDocuments` | DocumentContext | documents, filtered, searchQuery, upload, delete, rename |
| `useTask` | TaskContext | currentTask, startTask, cancelTask, completeTask, failTask, resetTask |
| `useTheme` | ThemeContext | theme, toggleTheme, colors |
| `useUI` | UIContext | sidebarOpen, isMobile, collapsed, searchOpen, toggles |
| `useUpload` | — | `uploadFile(file)` helper |
| `usePdfViewer` | — | PDF viewer state (page navigation, zoom) |
| `useVoiceInput` | Web Speech API | `isListening`, `transcript`, `startListening`, `stopListening` |
| `useSavedComparisons` | localStorage | `comparisons`, `saveComparison`, `deleteComparison`, `loadComparison` |
| `useSectionNavigation` | — | section scroll helpers for home page |

---

## Types (`src/types/`)

### `chat.ts`
- `AnswerStatus = 'grounded' | 'insufficient_evidence'`
- `Citation`: `{ citationId, documentId, documentName, page, section?, text?, score? }`
- `ChatMessage`: `{ id, role, content, thinking?, citations?, followUps?, status?, memoriesUpdated?, memoriesUsed? }`
- `ChatResponse`: `{ message_id, session_id, answer, thinking?, grounded, evidence_count?, citations, followUps?, memories_updated?, memories_used? }`
- `ChatRequest`: `{ message, session_id, document_ids? }`
- `Conversation`: `{ id, title, updatedAt, messages }`
- `ConversationSummary`: `{ id, title, updatedAt }`

### `comparison.ts`
- `ComparisonCellStatus = 'normal' | 'warning' | 'highlight' | 'unavailable'`
- `ComparisonCell`: `{ content, citations, status? }`
- `ComparisonAttribute`: `{ key, label, drug1: ComparisonCell, drug2: ComparisonCell }`
- `DrugInfo`: `{ id, name, genericName?, drugClass?, documentName?, pageCount? }`
- `ComparisonSummary`: `{ totalAttributes, warningCount, highlightCount, unavailableCount, bothUnavailableCount }`
- `ComparisonResult`: `{ drug1, drug2, attributes, summary? }`
- `SavedComparison`: `{ id, title, drug1Id, drug2Id, drug1Name, drug2Name, savedAt, notes?, result }`
- **13 attribute keys**: indications, dosage_administration, warnings, contraindications, drug_interactions, adverse_reactions, use_in_specific_populations, pregnancy, pediatric_use, geriatric_use, renal_impairment, hepatic_impairment, storage

### `document.ts`
- `DocumentStatus = 'processing' | 'ready' | 'failed'`
- `Document`: `{ id, name, filename, status, fileSize, uploadedAt, pageCount?, source?, version?, isActive?, stage?, progress?, progressDetail? }`

### `evidence.ts`
- `Evidence`: `{ id, documentId, page, text, score }`

### `task.ts`
- `TaskType = 'chat' | 'compare' | 'document' | null`
- `TaskStatus = 'idle' | 'running' | 'success' | 'error'`
- `TaskState`: `{ type, status, payload?, result?, error? }`
- Payload types: `ChatTaskPayload`, `CompareTaskPayload`, `DocumentTaskPayload`

---

## Theme System (`src/theme/`)

### Colors (`colors.ts`)
- **Primary palette**: `#0E3A3A` (primary), `#115150` (hover), `#0F7772` (accent/AI)
- **Semantic**: success `#2F7D65`, warning `#B87925`, danger `#B64A4A`, info `#347A82`
- **Light**: bg `#F7F6F2`, surface `#FFFFFF`, text `#021D1D` / `#52605F`
- **Dark**: bg `#060f12`, surface `#0f171a`, text `#f4f8f7` / `#c5d5d2`

### Typography (`typography.ts`)
- **Sans**: Manrope, Inter, system-ui fallbacks
- **Serif (editorial)**: Cormorant Garamond, Playfair Display, Georgia
- **Weights**: 400, 500, 600, 700, 800

### ThemeColors interface (`types.ts`)
20 properties: mode, background, surface, surfaceElevated, surfaceHover, surfaceHighlight, foreground, foregroundMuted, border, primary, primaryHover, primaryMuted, ai, success, warning, danger

---

## Components (`src/components/`)

### `auth/` (7 components)
- **AuthBrandPanel** — left-side branding for auth pages
- **AuthDivider** — "or" divider between sections
- **AuthInput** — labeled input with error display
- **AuthLayout** — two-column layout wrapper
- **PasswordInput** — input with show/hide toggle
- **PasswordStrength** — 5-check strength meter (min 8, lower, upper, number, special)
- **ProtectedRoute** — redirects to `/signin` if no token

### `chat/` (9 components)
- **ChatMessage** — renders user/assistant bubbles, citations, thinking, memory badges, follow-ups, markdown
- **ChatWindow** — scrollable message list with auto-scroll
- **CitationBadge** — inline `[S1]` citation chip with hover tooltip
- **DocumentSelectorModal** — checkbox list of documents to scope chat
- **FollowUpList** — clickable follow-up question suggestions
- **LoadingState** — animated dots while waiting for response
- **PromptBar** — textarea input with send, voice input, document selector, chips
- **PromptBarChips** — quick-suggestion chips above prompt bar
- **StreamingText** — typewriter effect for streaming responses

### `common/` (15 components)
- **Accordion** — collapsible sections (used in FAQ)
- **Button** — variant button (primary, secondary, ghost, danger)
- **Card** — surface container with border/shadow
- **DeleteConfirmModal** — reusable delete confirmation dialog
- **ErrorMessage** — inline error text
- **Footer** — landing page footer with links
- **GlobalTaskIndicator** — fixed banner showing active task with cancel button
- **MarkdownResponse** — renders markdown with code highlighting, tables, links
- **Modal** — base modal wrapper
- **Navbar** — top nav for landing page with scroll-based styling
- **ProtectedRoute** — duplicate guard (in common)
- **Spinner** — loading spinner
- **ThemeToggle** — light/dark switch button
- **Tooltip** — hover tooltip wrapper
- **WarningCard** — alert banner for insufficient evidence

### `compare/` (15 components)
- **CompareButton** — triggers comparison
- **ComparisonCell** — single cell in comparison table with status styling
- **ComparisonCitationBadge** — citation chip for comparison cells
- **ComparisonEmptyState** — placeholder when no drugs selected
- **ComparisonError** — error display
- **ComparisonHeader** — drug names + swap button
- **ComparisonRow** — single attribute row
- **ComparisonSaveBar** — save/load comparison with title + notes
- **ComparisonSkeleton** — loading skeleton
- **ComparisonSummary** — stats summary (warnings, highlights, unavailable)
- **ComparisonTable** — full comparison grid
- **DrugSelect** — searchable drug dropdown
- **DrugSelector** — two drug selectors side by side
- **SavedComparisonsPanel** — list of saved comparisons with load/delete
- **SwapDrugsButton** — swaps drug1 ↔ drug2

### `documents/` (7 components)
- **DeleteDocumentDialog** — delete confirmation
- **DocumentCard** — document tile with status, progress, actions
- **DocumentList** — grid of document cards
- **DocumentSearch** — search input for filtering
- **DocumentStatus** — status badge (processing/ready/failed) with progress bar
- **DocumentUpload** — drag-and-drop upload zone
- **DocumentViewerModal** — PDF viewer with page navigation, zoom, chunk overlay

### `evidence/` (4 components)
- **EvidenceCard** — single evidence source with text, page, score
- **EvidencePanel** — right sidebar listing all citations for active message
- **SourceDrawer** — slide-out source viewer (stub)
- **SourceViewerModal** — full document viewer with highlighted evidence

### `home/` (9 components)
- **DrugCategoriesSection** — grid of drug category cards
- **FaqSection** — accordion FAQ
- **FinalCtaSection** — call-to-action banner
- **HeroSection** — hero with headline + search
- **HowItWorksSection** — 3-step process
- **KnowledgeBaseSection** — stats + features
- **TrustSection** — trust indicators
- **VerificationSection** — evidence verification showcase
- **homeData.ts** — static data for home sections

### `layout/` (9 components)
- **ChatLayout** — main app shell (sidebar + content area)
- **GlobalSearchPanel** — slide-out search across conversations
- **MobileSidebar** — drawer sidebar for mobile
- **RecentChats** — conversation list with rename, delete, active state
- **Sidebar** — navigation sidebar with New Chat, links, recent chats
- **SidebarHeader** — logo + app name
- **ThemeToggle** — dark mode toggle in sidebar
- **TopHeader** — top bar with menu toggle, search, profile
- **UserProfile** — dropdown with user info, theme toggle, logout

---

## Pages (`src/pages/`)

| Page | Description |
|---|---|
| **ChatPage** | Main chat interface: ChatWindow + PromptBar + EvidencePanel. Uses `useChat`. |
| **DocumentsPage** | Document management: upload, list, search, view, delete, rename. Uses `useDocuments`. |
| **ComparePage** | Drug comparison: select 2 drugs → comparison table with citations. Save/load comparisons. |
| **MemoryPage** | AI memory management: view, add, delete, clear memories. Toggle memory on/off. |
| **HomePage** | Landing page with hero, features, FAQ, CTA. Public. |
| **SignInPage** | Login form with email/password validation. |
| **SignUpPage** | Registration form with name/email/password/confirm + strength meter. |

---

## Services (`src/services/`)

### `comparisonService.ts`
- `compareDrugs(drug1Id, drug2Id, signal)` — calls backend `POST /compare` or returns mock if `VITE_USE_MOCK_COMPARE=true`
- Mock includes realistic data for Rinvoq vs Skyrizi with all 13 attributes

---

## Utils (`src/utils/`)

| File | Functions |
|---|---|
| `authValidation.ts` | `isValidEmail`, `getPasswordStrength`, `validateSignInField`, `validateSignIn`, `validateSignUpField`, `validateSignUp`, `getErrorMessage` |
| `formatters.ts` | `formatDate(iso)`, `formatFileSize(bytes)` |
| `validators.ts` | `isValidPdf(file)`, `isValidEmail(email)` |
| `scrollToSection.ts` | `scrollToSection(id)`, `parseSectionIdFromPath(path)`, `scrollToSectionWhenReady(id)` |
| `mockChatData.ts` | Mock chat messages and responses for development |

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | Backend API base URL |
| `VITE_USE_MOCK_COMPARE` | `false` | Use mock comparison data instead of API |

---

## Key Patterns

- **Single global task**: Only one async task (chat/compare/document) runs at a time. `TaskContext` prevents concurrent tasks and shows a global indicator.
- **Optimistic UI**: Document upload creates a temp card immediately, replaced when backend responds.
- **AbortSignal propagation**: All API calls accept `AbortSignal` for user-initiated cancellation.
- **Token management**: JWT stored in `localStorage('labelproof_token')`, auto-removed on 401.
- **Citation mapping**: Backend citation objects mapped to frontend `Citation` type via `mapCitations()` in ChatContext.
- **Message lowercasing**: All user messages are lowercased before sending to backend.
- **Session auto-creation**: First message in a new chat auto-creates a session and updates URL to `/chat/:sessionId`.
- **Theme persistence**: Theme stored in localStorage, applied via `light`/`dark` class on `<html>`.
