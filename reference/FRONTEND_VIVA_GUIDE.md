# LabelProof Frontend — Viva & Presentation Guide

A practical, beginner-friendly reference covering everything implemented in the LabelProof frontend so far. Use this to prepare for your hackathon viva and demo presentation.

> **LabelProof in one line:** An evidence-first drug-information RAG chatbot where every answer is grounded in approved drug-label documents and backed by citations.

---

## Table of Contents

1. [Tech Stack & Why](#1-tech-stack--why)
2. [React + TypeScript + Vite Architecture](#2-react--typescript--vite-architecture)
3. [Tailwind CSS & UI Design Approach](#3-tailwind-css--ui-design-approach)
4. [React Context & Why Not Zustand](#4-react-context--why-not-zustand)
5. [Component & Folder Structure](#5-component--folder-structure)
6. [ChatGPT-like Chat UI & Sidebar](#6-chatgpt-like-chat-ui--sidebar)
7. [Chat Interface Deep Dive](#7-chat-interface-deep-dive)
8. [Citations / Source UI](#8-citations--source-ui)
9. [Manage Documents Page](#9-manage-documents-page)
10. [Compare Drugs Page](#10-compare-drugs-page)
11. [Sign In / Sign Up UI](#11-sign-in--sign-up-ui)
12. [Responsive / Mobile Design](#12-responsive--mobile-design)
13. [Important React Concepts Used](#13-important-react-concepts-used)
14. [How the Frontend Talks to the FastAPI Backend](#14-how-the-frontend-talks-to-the-fastapi-backend)
15. [Complete User Flow](#15-complete-user-flow)
16. [Viva Questions with Short Answers](#16-viva-questions-with-short-answers)
17. [2–3 Minute Presentation Script](#17-23-minute-presentation-script)

---

## 1. Tech Stack & Why

| Technology | What it does | Why we chose it |
|---|---|---|
| **React 19** | UI library for building components | Industry standard, large ecosystem, great for component-driven apps like chatbots |
| **TypeScript** | Adds static typing to JavaScript | Catches bugs at compile time, makes props/state self-documenting, better IDE support |
| **Vite** | Dev server + build tool | Extremely fast hot-module reload, modern default for React apps, simple config |
| **Tailwind CSS 3** | Utility-first CSS framework | Lets us style directly in JSX, keeps design consistent via theme tokens, no separate CSS files to maintain |
| **Lucide React** | Icon library | Clean, consistent, tree-shakeable SVG icons. Used everywhere (sidebar, buttons, status badges) |
| **React Markdown** | Renders markdown in chat answers | Assistant answers include **bold**, lists, paragraphs — rendered safely as HTML |
| **React Router DOM** | Client-side routing | Powers `/`, `/chat`, `/signin`, `/signup`, `/documents`, `/compare` routes without page reloads |
| **Sonner** | Toast notifications | Lightweight, polished toasts for upload/delete/sign-in feedback |
| **Web Speech API** | Voice input & text-to-speech | `SpeechRecognition` for dictation in prompt bar; `SpeechSynthesis` for reading AI responses aloud |

> **Note:** We deliberately avoided heavy UI libraries (Material UI, Ant Design) and state libraries (Zustand, Redux). The design stays custom and lightweight.

---

## 2. React + TypeScript + Vite Architecture

### High-level flow

```
index.html
  └── src/main.tsx          → mounts <App /> into #root
        └── src/App.tsx     → sets up Router + all Context Providers
              └── Routes
                    ├── /                  → ChatPage (ProtectedRoute)
                    ├── /chat              → ChatPage (ProtectedRoute)
                    ├── /chat/:conversationId? → ChatPage (ProtectedRoute)
                    ├── /documents         → DocumentsPage (ProtectedRoute)
                    ├── /compare           → ComparePage (ProtectedRoute)
                    ├── /signin            → SignInPage
                    ├── /signup            → SignUpPage
                    └── *                  → ChatPage (fallback)
```

> **Note:** Chat, Documents, and Compare routes are wrapped in `<ProtectedRoute>` which checks authentication state before rendering. Sign-in and sign-up pages are public.

### Provider nesting (in `App.tsx`)

```
BrowserRouter
  └── ThemeProvider        (dark/light theme + colors)
        └── UIProvider     (sidebar open/close, collapse, mobile detection)
              └── ConversationProvider   (recent chats list + rename/delete)
                    └── DocumentProvider (documents list, upload, delete, search)
                          └── ChatProvider (messages, loading, simulated streaming)
                                └── Routes + Toaster (sonner)
```

**Why this order?** Outer providers don't depend on inner ones. Theme and UI are global; chat depends on conversations/documents only conceptually, so they sit inside.

### TypeScript usage

- Every component has an explicit `interface` for its props.
- Shared data shapes live in `src/types/` (`chat.ts`, `document.ts`).
- Theme colors are typed via `src/theme/types.ts` so light and dark themes are interchangeable.
- The build runs `tsc -b` before Vite, so type errors fail the build.

---

## 3. Tailwind CSS & UI Design Approach

### Theme tokens (no hardcoded colors)

All colors come from CSS variables defined in `src/index.css`:

```css
:root {            /* light theme */
  --color-background: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-primary: #0F766E;   /* Trust Teal */
  --color-ai: #06B6D4;        /* AI Cyan */
  ...
}

.dark {            /* dark theme (default) */
  --color-background: #0B1120;
  --color-surface: #111827;
  --color-foreground: #F1F5F9;
  ...
}
```

Tailwind maps these to semantic class names in `tailwind.config.js`:

| Tailwind class | Maps to |
|---|---|
| `bg-background` | app background |
| `bg-surface` | cards / sidebar / inputs |
| `bg-surface-highlight` | hover states, badges |
| `text-fg` | primary text |
| `text-fg-muted` | secondary text |
| `border-line` | subtle borders |
| `bg-primary` / `text-primary` | Trust Teal brand color |
| `text-ai` | AI Cyan accent |
| `text-success` / `text-danger` / `text-warning` | status colors |

**Benefit:** Switching themes just toggles a `.dark` class on `<html>`. Every component automatically picks up the right colors. No hardcoded hex values in components.

### Design language

- **Dark, premium, healthcare-AI feel** — deep navy (`#0B1120`) background, charcoal surfaces, teal/cyan accents.
- **ChatGPT-like spacing** — generous padding, rounded inputs, comfortable max-width (`max-w-3xl`) for chat content.
- **Subtle borders & muted text** — borders use `border-line`, secondary text uses `text-fg-muted`.
- **Restrained animations** — only `transition-colors`, `animate-spin` (loading), `animate-pulse` (streaming cursor), and slide transitions for the mobile sidebar.
- **Inter font** — loaded from Google Fonts, set as the default sans family.

---

## 4. React Context & Why Not Zustand

### Contexts we use

| Context | File | Responsibility |
|---|---|---|
| `ThemeContext` | `contexts/ThemeContext.tsx` | Current theme (`'dark'`/`'light'`), `toggleTheme()`, `colors` object |
| `UIContext` | `contexts/UIContext.tsx` | `sidebarOpen`, `isMobile`, `sidebarCollapsed`, `searchOpen` + toggle functions |
| `ConversationContext` | `contexts/ConversationContext.tsx` | Recent chats list, active conversation, rename/delete/new |
| `DocumentContext` | `contexts/DocumentContext.tsx` | Documents list, filtered list, upload/delete/rename, search query |
| `ChatContext` | `contexts/ChatContext.tsx` | Messages array, `isLoading`, `sendMessage()`, `clearChat()` |

Each context has a matching hook in `src/hooks/` (`useTheme`, `useUI`, `useConversations`, `useDocuments`, `useChat`) that throws a clear error if used outside its provider.

### Why not Zustand or Redux?

1. **Simplicity** — our state is UI-focused and modest in size. Context + `useState` is enough.
2. **No extra dependency** — Context is built into React.
3. **Beginner-friendly** — easier to explain in a viva; no selectors, stores, or middleware concepts.
4. **Project instructions** — `AGENT-INSTRUCTION.md` explicitly says: *"Use React Context for shared UI/chat state"* and *"Do not use Zustand or Redux."*

> **Viva tip:** If asked "When *would* you use Zustand?" → "For high-frequency updates or very large state trees where Context re-renders become a performance problem. Our app doesn't hit that scale."

---

## 5. Component & Folder Structure

```
src/
├── api/                    # API client wrappers used by contexts and services
│   ├── client.ts           # apiFetch() wrapper around fetch()
│   ├── chat.ts, documents.ts, citations.ts, compare.ts
├── components/
│   ├── auth/               # Sign in / Sign up building blocks
│   │   ├── AuthLayout.tsx          # Two-column split (form + brand panel)
│   │   ├── AuthBrandPanel.tsx      # Right-side CSS visual panel
│   │   ├── AuthInput.tsx           # Labeled input with leading icon
│   │   ├── PasswordInput.tsx       # Input with show/hide toggle
│   │   └── AuthDivider.tsx         # "OR" divider
│   ├── chat/               # Chat experience
│   │   ├── ChatWindow.tsx          # Message list + empty state
│   │   ├── ChatMessage.tsx         # User vs assistant bubble + TTS
│   │   ├── PromptBar.tsx           # Composer-style input bar with voice & doc selector
│   │   ├── DocumentSelectorModal.tsx # Modal for selecting saved documents
│   │   ├── StreamingText.tsx       # Typewriter effect
│   │   ├── LoadingState.tsx        # "Searching the document…" spinner
│   │   ├── CitationBadge.tsx       # Clickable page citation chip
│   │   └── FollowUpList.tsx        # Suggested follow-up questions
│   ├── compare/            # Drug comparison interface
│   │   ├── DrugSelector.tsx        # Drug 1 / Drug 2 selection panel
│   │   ├── DrugSelect.tsx          # Accessible custom dropdown
│   │   ├── SwapDrugsButton.tsx     # Swap drugs icon button
│   │   ├── CompareButton.tsx       # Primary compare CTA
│   │   ├── ComparisonTable.tsx     # Side-by-side comparison table
│   │   ├── ComparisonCell.tsx      # Single table cell with citations
│   │   ├── ComparisonSkeleton.tsx  # Loading skeleton
│   │   └── ComparisonError.tsx     # Error / retry state
│   ├── documents/          # Manage Documents page
│   │   ├── DocumentUpload.tsx      # Dropzone + upload button
│   │   ├── DocumentSearch.tsx      # Search input
│   │   ├── DocumentList.tsx        # Responsive grid + empty state
│   │   ├── DocumentCard.tsx        # Single doc card with actions menu
│   │   ├── DocumentStatus.tsx      # Processing/Ready/Failed badge
│   │   └── DeleteDocumentDialog.tsx # Confirmation modal
│   └── layout/             # App shell
│       ├── ChatLayout.tsx          # Sidebar + main area wrapper
│       ├── Sidebar.tsx             # Composes header, nav, recent chats, profile
│       ├── SidebarHeader.tsx       # Logo, search, collapse buttons + GlobalSearchPanel
│       ├── GlobalSearchPanel.tsx   # Portal-based modal search for chats & documents
│       ├── RecentChats.tsx         # Flat recent-chats list with 3-dot menu & delete confirmation
│       ├── UserProfile.tsx         # Bottom user profile + logout confirmation modal
│       └── MobileSidebar.tsx       # Slide-in drawer for mobile
├── contexts/               # All React Context providers
├── hooks/                  # useChat, useUI, useTheme, useDocuments, useConversations
├── pages/                  # Route-level pages
│   ├── ChatPage.tsx, ComparePage.tsx, DocumentsPage.tsx, SignInPage.tsx, SignUpPage.tsx
├── theme/                  # Color tokens, light/dark themes, typography
├── types/                  # TypeScript interfaces (chat.ts, document.ts, comparison.ts)
├── services/               # Business-logic service abstractions
│   └── comparisonService.ts      # Wraps /api/v1/compare, supports mock flag
├── utils/                  # formatters.ts (date/file size), validators.ts
├── App.tsx                 # Router + providers
├── main.tsx                # Entry point
└── index.css               # CSS variables + Tailwind directives
```

**Convention followed (from `AGENT-INSTRUCTION.md`):**
- Components are presentation-focused.
- Business/state logic lives in Context + hooks.
- API calls live in `api/` (not inside components).
- Types live in `types/`.
- Theme values live in `theme/`.

---

## 6. ChatGPT-like Chat UI & Sidebar

### Sidebar (`components/layout/Sidebar.tsx`)

A fixed left sidebar on desktop (`w-64`) with two modes:

- **Expanded:** Logo + name, search icon, collapse icon, "New Chat" button, "Manage Documents" link, recent chats list, user profile at the bottom.
- **Collapsed:** Icon-only narrow strip (`w-14`) — same actions, just icons.

Sub-components:
- **`SidebarHeader`** — LabelProof logo, search button, collapse/expand button, close button (mobile only).
- **`RecentChats`** — flat list of recent conversations (sorted by most recent). Each row shows the title; hovering reveals a **three-dot menu** (⋮). Clicking opens a dropdown with **Rename** and **Delete** options. Delete triggers a **custom confirmation modal** (portal-based) showing the conversation title with Cancel/Delete buttons. Active conversation is highlighted with `bg-surface-highlight`. Inline rename uses a controlled input with Enter to save / Escape to cancel.
- **`UserProfile`** — avatar circle ("MM"), name "Mohanapriyan M", label "LabelProof User", settings icon. Includes a **logout confirmation modal** rendered via React portal with backdrop blur.
- **`GlobalSearchPanel`** — portal-based centered modal with live search across recent chats and documents. Triggered from the search button in `SidebarHeader`. Renders to `document.body` with `z-50`.

### Mobile sidebar (`MobileSidebar.tsx`)

- Only renders below the `1024px` breakpoint.
- Slides in from the left with a dimmed overlay backdrop.
- Closes on overlay click or `Escape` key.
- Uses CSS transform transitions (`translate-x-0` ↔ `-translate-x-full`).

### Chat layout (`ChatLayout.tsx`)

- Flex row: sidebar (desktop) + main content area.
- On mobile: a top header with the LabelProof logo and a menu button that opens the mobile drawer.
- Reused by both `ChatPage` and `DocumentsPage`.

---

## 7. Chat Interface Deep Dive

### ChatWindow (`components/chat/ChatWindow.tsx`)

- Shows an **empty-state welcome** when there are no messages: LabelProof logo, tagline, and suggestion chips ("What is the recommended dosage?", etc.). Clicking a chip sends it as a message.
- Once messages exist, renders them in a centered `max-w-3xl` column.
- Auto-scrolls to the bottom on new messages / loading via `useRef` + `scrollIntoView`.

### ChatMessage (`components/chat/ChatMessage.tsx`)

Two layouts:
- **User message** — right-aligned teal bubble (`bg-primary text-white`), rounded.
- **Assistant message** — left-aligned with a bot avatar, markdown-rendered content, citations, action bar, and follow-ups.

The assistant message has a **streaming phase**: when it's the last message and still streaming, it uses `<StreamingText>`; otherwise it renders the full markdown via `ReactMarkdown`.

**Action bar** (after streaming completes):
- Source count ("1 source" / "2 sources")
- **Speaker icon** (`Volume2` / `Square`) — uses the Web Speech Synthesis API (`window.speechSynthesis`) to read the AI response aloud. Markdown formatting is stripped before passing to the utterance. Clicking again stops the speech. The icon toggles between `Volume2` (not speaking) and `Square` (actively reading).
- Copy button (uses `navigator.clipboard.writeText`, shows a check icon for 2 seconds)

### PromptBar (`components/chat/PromptBar.tsx`)

A composer-style input bar with a grid layout that adapts to content:

- **`+` button** (left) — opens a native file picker for uploading documents. Accepts `.pdf`, `.docx`, and `.doc` files only. Selected files appear as removable chips inside the composer.
- **Auto-growing `<textarea>`** — uses a hidden measuring `<span>` and `useLayoutEffect` to auto-resize. Min height 28px, max height 120px. **Enter** sends the message; **Shift+Enter** inserts a newline.
- **`FolderOpen` button** — opens a `DocumentSelectorModal` to pick from saved (ready) documents. Selected documents appear as chips **above** the prompt bar. When all documents are selected, a single "All documents" chip with primary styling is shown.
- **Mic button** — toggles voice dictation using the Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`). Shows animated equalizer bars while listening. Uses `continuous: true` and `interimResults: true` for real-time transcription. Auto-restarts on `onend` if the user hasn't stopped. Interim results are shown live; finalized segments accumulate in a ref.
- **Send button** — disabled when input is empty or the assistant is loading. Shows a spinner (`Loader2`) during loading.
- The container switches from `rounded-full` to `rounded-2xl` when attachments are present or the textarea is expanded.

### DocumentSelectorModal (`components/chat/DocumentSelectorModal.tsx`)

- Portal-based modal (`createPortal` to `document.body`, `z-50`) for selecting saved documents.
- **Search bar** at the top — filters documents by name or filename in real-time.
- **"Select all" row** — toggles between selecting all ready documents and none.
- **Document list** — scrollable, each row has a checkbox, `FileText` icon, document name, filename, and page count. Only shows documents with `status: 'ready'`.
- **Footer** — shows selection count with Cancel and Confirm buttons. Confirm is disabled when nothing is selected.
- Empty state when no documents match the search.

### StreamingText (`components/chat/StreamingText.tsx`)

- Reveals the answer character-by-character using `setInterval` (20ms per character).
- Shows a blinking cyan cursor (`animate-pulse`) while streaming.
- Calls `onComplete()` when finished so the parent can switch to full markdown rendering.

### LoadingState (`components/chat/LoadingState.tsx`)

- Shown while the assistant is "thinking" (before the simulated answer arrives).
- Spinning `Loader2` icon + "Searching the document" + subtext.

### Simulated streaming (in `ChatContext.tsx`)

Currently mock-only with hardcoded demo responses:
1. User message added immediately.
2. `isLoading` set to `true`.
3. After ~1.5s, a grounded assistant message is added with demo citations and follow-ups.
4. `isLoading` set to `false`.

The mock responses include realistic drug information content (dosage, warnings, contraindications) with citations pointing to specific pages and follow-up questions for a natural chat experience.

> When the backend is ready, this `setTimeout` block becomes a real API call (see Section 14).

---

## 8. Citations / Source UI

### Data shape (`types/chat.ts`)

```ts
interface Citation {
  citationId: string
  documentId: string
  documentName: string
  page: number
  section?: string
  text: string
}
```

### CitationBadge (`components/chat/CitationBadge.tsx`)

- Small pill button showing "Page 12" with a cyan `FileText` icon.
- Hovering highlights the border in teal.
- Clicking currently shows an alert; in production it will open the PDF viewer at that page.

### Where citations appear

- Below the assistant answer, before the action bar.
- The action bar shows the total source count.
- Follow-up question buttons appear below the action bar.

This is the **"Cite"** step of the **Ask → Answer → Cite → Verify** product philosophy.

---

## 9. Manage Documents Page

### Route: `/documents` → `DocumentsPage.tsx`

Wrapped in `ChatLayout` so the sidebar stays consistent.

### Page contents

1. **Header** — "Manage Documents" + description explaining uploaded approved drug-label PDFs are used as chatbot knowledge sources.
2. **DocumentUpload** — drag-and-drop dropzone + "Upload PDF" button. Validates `.pdf` extension. Shows a success toast on upload. Uses a hidden `<input type="file">`.
3. **DocumentSearch** — search input bound to `DocumentContext.searchQuery`. Filters documents by name/filename in real time.
4. **DocumentList** — responsive grid (1 column mobile, 2 tablet, 3 desktop). Shows an empty state when there are no documents or no search matches.
5. **DocumentCard** — each card shows:
   - PDF icon + document name + filename
   - Actions menu (⋮) with **View**, **Rename**, **Delete**
   - Status badge (Processing / Ready / Failed)
   - Page count
   - File size + upload date (formatted via `utils/formatters.ts`)
   - Inline rename with check/cancel buttons
6. **DeleteDocumentDialog** — modal confirmation before deletion. Shows the document name, Cancel + Delete buttons, closes on Escape or backdrop click. On confirm, deletes from context and shows a success toast.

### DocumentContext (mock data)

- Seeds 3 sample documents (Rinvoq, Skyrizi, Humira) with mixed statuses.
- `uploadDocument(file)` adds a new doc with `status: 'processing'`, then after 2.5s flips it to `'ready'` with a random page count — simulating backend processing.
- `deleteDocument(id)`, `renameDocument(id, name)`, and `filteredDocuments` (memoized search results).

### DocumentStatus (`components/documents/DocumentStatus.tsx`)

| Status | Visual |
|---|---|
| `processing` | Cyan spinner (`Loader2 animate-spin`) + "Processing" |
| `ready` | Green check + "Ready" |
| `failed` | Red alert icon + "Failed" |

---

## 10. Compare Drugs Page

### Route: `/compare` → `ComparePage.tsx`

This is a dedicated side-by-side drug-label comparison page. It lets a user pick two approved drug documents and compare clinically relevant attributes.

### Why we added it

Clinicians and pharmacists often compare two drugs on dosage, warnings, interactions, pregnancy guidance, and more. This page surfaces those sections side-by-side with clickable page citations, so users can verify differences against the source PDFs instead of opening two documents manually.

### User flow

1. Select **Drug 1** and **Drug 2** from the dropdown of ready documents.
2. Optionally click the **swap** button to exchange them.
3. Click **Compare**.
4. The UI shows a loading skeleton.
5. A three-column comparison table appears:
   - **Attribute** (e.g., Indications, Warnings, Storage)
   - **Drug 1**
   - **Drug 2**
6. Each cell shows the value and one or more "Page X" citation badges.
7. Clicking a citation badge sets `selectedCitation` in `ChatContext`, reusing the existing source-verification flow.
8. On mobile, the table stacks into sections so it stays readable.

### Components added (`src/components/compare/`)

- `ComparePage.tsx` — route-level page; wraps `ChatLayout` and handles the comparison lifecycle.
- `DrugSelector.tsx` / `DrugSelect.tsx` — accessible custom dropdowns with search, keyboard navigation, and validation state.
- `SwapDrugsButton.tsx` — small icon button with a tooltip to swap the two selected drugs.
- `CompareButton.tsx` — primary call-to-action with loading spinner.
- `ComparisonTable.tsx` — semantic `<table>` on desktop; stacked attribute cards on mobile.
- `ComparisonHeader.tsx` — drug name, generic name, drug class badge, and document info.
- `ComparisonRow.tsx` / `ComparisonCell.tsx` — renders each attribute row, with warning/highlight/unavailable styling.
- `ComparisonCitationBadge.tsx` — clickable page badges wired to `setSelectedCitation`.
- `ComparisonEmptyState.tsx`, `ComparisonSkeleton.tsx`, `ComparisonError.tsx` — empty, loading, and error states.

### Service layer (`src/services/`)

- `comparisonService.ts` — wraps `compareDrugsApi` from `src/api/compare.ts`. If `VITE_USE_MOCK_COMPARE=true` it returns clearly-isolated mock data; otherwise it calls the FastAPI backend. This keeps the API call out of the UI components.

### TypeScript data model (`src/types/comparison.ts`)

```ts
interface ComparisonResult {
  drug1: DrugInfo
  drug2: DrugInfo
  attributes: ComparisonAttribute[]
}
```

Cells support `content`, `citations[]`, and a `status` (`normal`, `warning`, `highlight`, `unavailable`). This lets the table subtly warn about serious safety information and highlight dosage differences without inventing missing data.

### Validation & states

- Empty state shown before any comparison is run.
- Validation messages if Drug 1 or Drug 2 is missing, or if both are the same drug.
- Loading state with shimmer skeleton rows.
- Error state with a "Try again" button.
- "Not available in source document" for any missing attribute.

## 11. Sign In / Sign Up UI

### Routes: `/signin` and `/signup`

### AuthLayout (`components/auth/AuthLayout.tsx`)

- **Desktop:** two-column 50/50 split — form on the left, brand panel on the right.
- **Mobile:** brand panel hidden (`hidden lg:flex`), form takes full width.
- No scrolling on normal desktop screens (`lg:h-screen lg:overflow-hidden`).

### AuthBrandPanel (`components/auth/AuthBrandPanel.tsx`)

A pure-CSS premium visual panel:
- Radial gradient glows (teal top-right, cyan bottom-left)
- Blurred color blobs (`blur-3xl`)
- Geometric shapes (rotated square, circle outline)
- Crosshair gradient lines
- Centered LabelProof logo + tagline: *"Trusted answers from trusted drug information."*
- A small "Evidence-first, always verified" badge with a green dot
- Footer: "© 2026 LabelProof. All rights reserved."

No external images — everything is Tailwind/CSS.

### SignInPage (`pages/SignInPage.tsx`)

- LabelProof logo (mobile only, since the brand panel is hidden)
- Heading: "Welcome back"
- Email input (with mail icon, validation)
- Password input (with show/hide eye toggle)
- "Forgot password?" link
- "Sign in" primary button (shows "Signing in…" while submitting)
- "OR" divider
- Link: "Don't have an account? Sign up"

### SignUpPage (`pages/SignUpPage.tsx`)

- Heading: "Create your account"
- Full name input (with user icon, min 2 characters)
- Email input (with mail icon, email format validation)
- Password input (min 8 characters)
- Confirm password input (must match password)
- "Create account" primary button
- "OR" divider
- Link: "Already have an account? Sign in"

### Validation

- Inline error messages appear below each field (red text + red border).
- Errors clear as soon as the user starts typing in that field.
- On submit, all fields are validated before showing the success toast.

### Reusable auth components

- **`AuthInput`** — labeled input with a leading Lucide icon and optional error text.
- **`PasswordInput`** — extends input with a show/hide toggle button (Eye / EyeOff icons).
- **`AuthDivider`** — horizontal line + "OR" + horizontal line.

> **Note:** Authentication is UI-only right now. No API calls, tokens, or session management. Submitting shows a demo toast.

---

## 12. Responsive / Mobile Design

### Breakpoint strategy

| Breakpoint | Behavior |
|---|---|
| `< 640px` (mobile) | Single column, full-width forms, mobile sidebar drawer, 1-column doc grid |
| `≥ 640px` (sm) | 2-column doc grid, search input gets `max-w-xs` |
| `≥ 768px` (md) | (intermediate) |
| `≥ 1024px` (lg) | Desktop sidebar visible, auth brand panel appears, 3-column doc grid, collapse button shows |

### How mobile detection works

`UIContext` listens to `window.resize` and sets `isMobile = window.innerWidth < 1024`. Components conditionally render based on `isMobile`:
- `ChatLayout` shows the mobile header with menu button only when `isMobile`.
- `MobileSidebar` returns `null` on desktop.
- `SidebarHeader` shows the close button only on mobile (`lg:hidden`).

### Sidebar behavior

- **Desktop:** always visible (expanded or collapsed).
- **Mobile:** hidden by default; menu button opens a slide-in drawer with a dimmed overlay. Closes on overlay click, Escape, or selecting an item.

### Auth pages

- The right brand panel uses `hidden lg:flex`, so it disappears on mobile and the form becomes full-width and centered.

---

## 13. Important React Concepts Used

| Concept | Where it's used |
|---|---|
| **Components & Props** | Every UI piece is a reusable component with typed props |
| **`useState`** | Form fields, sidebar open/closed, menu open, editing state, password visibility, voice listening, speaking state, doc modal open, selected doc IDs |
| **`useEffect`** | Window resize listener (UIContext), theme class on `<html>` (ThemeContext), streaming interval (StreamingText), Escape key handler (MobileSidebar, DeleteDocumentDialog), auto-scroll (ChatWindow), click-outside for dropdown menus (RecentChats), speech recognition cleanup (PromptBar) |
| **`useRef`** | Textarea auto-resize (PromptBar), hidden file input click (DocumentUpload), scroll target (ChatWindow), speech recognition instance (PromptBar), speech synthesis utterance (ChatMessage), measuring span for auto-expand |
| **`useCallback`** | Stable `onComplete` callback in ChatMessage, `startListening`/`stopListening` in PromptBar |
| **`useLayoutEffect`** | Textarea auto-resize measurement (PromptBar) — runs before paint to avoid flicker |
| **`useMemo`** | Filtered documents in DocumentContext (avoids re-filtering on every render) |
| **Context API** | All 5 contexts described in Section 4 |
| **Custom hooks** | `useChat`, `useUI`, `useTheme`, `useDocuments`, `useConversations` — each wraps `useContext` with a guard |
| **Conditional rendering** | User vs assistant message, streaming vs final, empty states, collapsed vs expanded sidebar, mobile vs desktop |
| **List rendering with keys** | Messages, conversations, documents, follow-ups, citations — all use stable `key` props |
| **Controlled inputs** | All form fields are controlled (`value` + `onChange`) |
| **Event handling** | `onSubmit`, `onClick`, `onKeyDown` (Enter/Escape), `onDragOver`/`onDrop` (file upload) |
| **React Router** | `BrowserRouter`, `Routes`, `Route`, `Link` for navigation |
| **Code splitting by route** | Pages are separate modules; Vite handles bundling |
| **TypeScript generics** | `apiFetch<T>`, context value interfaces, component prop interfaces |

---

## 14. How the Frontend Talks to the FastAPI Backend

### Current state

The **documents** and **drug comparison** flows already call the FastAPI backend through `src/api/`. The **chat** flow is currently simulated with `setTimeout` until the RAG pipeline is fully integrated, but it uses the same context shape the real API will return. This keeps the component layer stable while the backend catches up.

### Prepared API layer (`src/api/`)

- **`client.ts`** defines `apiFetch<T>(path, options)`:
  ```ts
  const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
  ```
  It wraps `fetch()`, sets JSON headers, throws on non-OK responses, and returns parsed JSON.
- **`documents.ts`** already declares `fetchDocuments()`, `uploadDocument(file)`, `deleteDocument(id)`.
- **`chat.ts` and `citations.ts`** are stubs for future endpoints; **`compare.ts`** is already used by `comparisonService.ts`.

### How the switch will work

When the FastAPI backend is ready, we replace the mock logic inside the contexts with calls to the `api/` functions. For example, in `ChatContext`:

```ts
// Now (mock):
setTimeout(() => { setMessages(...); setIsLoading(false) }, 1500)

// Later (real):
const res = await askChat(question)
setMessages((prev) => [...prev, res.assistantMessage])
setIsLoading(false)
```

The components **don't change** because they only consume the context — they don't know or care where the data comes from. This separation is intentional and follows `AGENT-INSTRUCTION.md`: *"API calls belong in `api/`, not in UI components."*

### Expected backend endpoints (planned)

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/auth/signin` | Login, returns JWT |
| `POST` | `/api/auth/signup` | Register |
| `GET` | `/api/documents` | List user's documents |
| `POST` | `/api/documents` | Upload PDF (multipart) |
| `DELETE` | `/api/documents/:id` | Delete document |
| `POST` | `/api/v1/compare` | Compare two drug documents side-by-side |
| `POST` | `/api/chat` | Send question, get grounded answer + citations |
| `GET` | `/api/documents/:id/page/:page` | Fetch a specific PDF page (for the viewer) |

---

## 15. Complete User Flow

Here's the full journey a user takes through the frontend:

```
1. LAND ON /signin
   └── Enter email + password → "Sign in" (demo toast)

2. (Or) /signup → Create account
   └── Name + email + password + confirm → "Create account" (demo toast)

3. REDIRECTED TO / (ChatPage)
   └── Sidebar visible with: New Chat, Manage Documents, recent chats, profile
   └── Empty-state welcome with suggestion chips

4. CLICK "Manage Documents" → /documents
   └── See seeded documents (Rinvoq, Skyrizi, Humira)
   └── Upload a PDF → drop or browse → processing badge → ready badge
   └── Search documents by name
   └── Rename a document inline
   └── Delete a document → confirmation dialog → toast

5. CLICK "Compare Drugs" → /compare
   └── Select Drug 1 and Drug 2 from the dropdown of ready documents
   └── Swap them if needed
   └── Click Compare and wait for the skeleton to fill
   └── View side-by-side attributes, warnings, dosage, and page citations

6. CLICK "New Chat" → back to / (empty chat)
   └── Type a question in the prompt bar → Enter
   └── Or click the mic icon to dictate using voice (Web Speech API)
   └── Or click the folder icon to select saved documents as context
   └── Or click the + icon to upload PDF/DOCX/DOC files
   └── User bubble appears immediately
   └── "Searching the document…" loading state
   └── Assistant answer streams in character-by-character
   └── Markdown renders (bold, lists)
   └── Citation badges appear ("Page 12")
   └── Source count shown
   └── Click speaker icon to hear the answer read aloud (text-to-speech)
   └── Copy answer to clipboard
   └── Follow-up question buttons → click to ask next

7. CLICK A CITATION (future)
   └── Opens PDF viewer at the cited page (not yet implemented)

8. SIDEBAR → recent chat appears in the list
   └── Hover to reveal three-dot menu (⋮)
   └── Click → Rename or Delete options in dropdown
   └── Delete → custom confirmation modal → confirm to delete
   └── Click to (future) reload that conversation
   └── Search button in header opens GlobalSearchPanel (search chats & documents)
```

**Ask → Answer → Cite → Verify** — the first three steps are implemented; "Verify" (PDF page navigation) is the next phase.

---

## 16. Viva Questions with Short Answers

### Q: What is LabelProof?
**A:** An evidence-first drug-information chatbot. Users ask questions about approved drugs, and the AI answers with citations pointing to exact pages of official drug-label PDFs.

### Q: Why React + TypeScript?
**A:** React is component-based and great for interactive UIs like chat. TypeScript adds type safety, so we catch prop and state errors at compile time instead of runtime.

### Q: Why Vite and not Create React App?
**A:** Vite is much faster for development (instant hot reload) and produces optimized production builds. Create React App is outdated.

### Q: Why Tailwind CSS?
**A:** It lets us style directly in JSX with utility classes. We defined semantic color tokens (like `bg-surface`, `text-fg`) mapped to CSS variables, so theming is consistent and switchable without touching components.

### Q: Why React Context instead of Zustand/Redux?
**A:** Our state is simple and UI-focused. Context is built into React, needs no extra library, and is easy to understand. The project instructions also explicitly require Context over external state libraries.

### Q: How does the dark theme work?
**A:** CSS variables in `index.css` define colors for `:root` (light) and `.dark`. The `ThemeProvider` toggles a `dark` class on `<html>`. Tailwind classes like `bg-surface` reference those variables, so every component updates automatically.

### Q: How is the chat answer streamed?
**A:** Currently simulated. `StreamingText` uses `setInterval` to reveal one character every 20ms with a blinking cursor. When the backend is ready, this will be replaced with a real streaming response (e.g., Server-Sent Events).

### Q: How does voice input work in the prompt bar?
**A:** We use the Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) with `continuous: true` and `interimResults: true`. When the user clicks the mic button, recognition starts and transcribed text appears in the textarea in real-time. The browser may stop recognition periodically, so we auto-restart it via the `onend` handler using a `shouldListenRef`. Clicking the mic again stops recognition. The button shows animated equalizer bars while listening.

### Q: How does the text-to-speech feature work?
**A:** We use `window.speechSynthesis` with `SpeechSynthesisUtterance`. When the user clicks the speaker icon next to an AI response, we strip markdown formatting and pass the plain text to the utterance. The icon toggles to a `Square` (stop) icon while speaking. Clicking again cancels the speech. The `onend` and `onerror` handlers reset the state automatically.

### Q: What is the Document Selector Modal?
**A:** A portal-based modal that lets users pick from their saved (ready) documents before asking a question. It has a search bar, a "Select all" toggle, and a scrollable list with checkboxes. Selected documents appear as chips above the prompt bar. When all are selected, a single "All documents" chip is shown. This lets users scope their question to specific drug-label documents.

### Q: How does the three-dot menu in recent chats work?
**A:** Each conversation row in the sidebar has a `MoreVertical` (⋮) icon that appears on hover. Clicking opens a small dropdown with Rename and Delete options. The dropdown closes on outside click (via a `mousedown` listener). Delete triggers a custom confirmation modal rendered via React portal, showing the conversation title with Cancel and Delete buttons.

### Q: What is a citation badge?
**A:** A small clickable pill that shows "Page 12" with a document icon. It tells the user exactly where in the source PDF the answer came from. Clicking it will eventually open the PDF viewer at that page.

### Q: How do you validate the sign-up form?
**A:** Each field has rules — email format, password length ≥ 8, confirm password must match. Errors show inline below each field and clear as the user types. Submission is blocked until all fields pass.

### Q: How is the mobile sidebar implemented?
**A:** `UIContext` tracks `isMobile` via a resize listener. On mobile, the sidebar is a fixed overlay that slides in with a CSS transform. It closes on overlay click or Escape. On desktop, it's a permanent fixed column.

### Q: How does the document upload work?
**A:** A drag-and-drop dropzone plus a hidden file input. We validate the file is a PDF, add it to `DocumentContext` with `status: 'processing'`, show a toast, then after 2.5s flip the status to `'ready'` to simulate backend processing.

### Q: How will the frontend connect to the backend?
**A:** There's an `api/client.ts` with an `apiFetch()` wrapper around `fetch()` pointing to `VITE_API_URL` (defaults to `http://localhost:8000`). We'll replace the mock `setTimeout` calls in contexts with real `apiFetch` calls. Components won't change because they only consume context.

### Q: What React hooks do you use the most?
**A:** `useState` for local state, `useEffect` for side effects like resize listeners and intervals, `useRef` for DOM access (textarea, file input, scroll), `useMemo` for filtered lists, `useCallback` for stable callbacks, and `useContext` via custom hooks for global state.

### Q: Why are components separated from contexts and hooks?
**A:** Separation of concerns. Components focus on presentation; contexts hold shared state; hooks expose that state cleanly. This makes components reusable and easy to test, and lets us swap mock data for real APIs without touching the UI.

### Q: What is the "Ask → Answer → Cite → Verify" flow?
**A:** Ask: user types a question. Answer: assistant responds with markdown. Cite: citation badges show the source page. Verify: (next phase) clicking a citation opens the PDF at that page so the user can confirm the evidence.

### Q: Is the app accessible?
**A:** Yes — semantic HTML, `aria-label` on icon-only buttons, `aria-hidden` on decorative icons, keyboard support (Enter to send, Escape to close dialogs/drawers), focus styles on inputs, and `role="status"` on the loading indicator.

### Q: How does the Compare Drugs page work?
**A:** The user selects two ready drug documents from custom dropdowns, optionally swaps them, and clicks Compare. The frontend calls `/api/v1/compare` (with a clearly isolated mock fallback when `VITE_USE_MOCK_COMPARE=true`), then renders a side-by-side table of clinical attributes. Each cell shows the value and clickable page citations. Missing data is shown as "Not available in source document." On mobile, the table stacks into readable sections.

### Q: What would you add next?
**A:** Real backend integration for the chat RAG pipeline, a PDF viewer for citation verification, persistent conversation history, and authentication with JWT tokens.

---

## 17. 2–3 Minute Presentation Script

> Use this as a spoken script for your demo. Keep a relaxed pace — it's about 350 words.

---

"LabelProof is an evidence-first drug-information chatbot. The idea is simple: when a doctor, pharmacist, or researcher asks a question about an approved drug, the answer should be grounded in the official drug-label document — with a citation pointing to the exact page. No hallucinations, no guesswork.

For the frontend, we built a polished, dark, ChatGPT-style interface using **React 19, TypeScript, Vite, and Tailwind CSS**. We chose TypeScript for type safety, Vite for fast development, and Tailwind because it lets us define a semantic theme system using CSS variables — so light and dark modes switch instantly without touching any component.

The app has five main screens. First, a **Sign In and Sign Up** flow with a premium two-column layout — form on the left, an animated CSS brand panel on the right that hides on mobile. Form validation is inline and real-time.

After login, you land on the **Chat page**. On the left is a responsive sidebar with the LabelProof logo, a New Chat button, a Manage Documents link, a Compare Drugs link, a flat recent-chats list with inline rename and delete, and a user profile at the bottom. On mobile, this sidebar becomes a slide-in drawer.

The chat itself supports markdown answers, a typewriter streaming effect, a loading state that says 'Searching the document,' citation badges showing the source page, a **speaker icon for text-to-speech** that reads answers aloud, a copy button, and follow-up question chips. The **prompt bar** is a composer-style input with a **+ button for file upload** (PDF/DOCX/DOC), a **folder icon to select saved documents** via a modal with search and select-all, a **mic button for voice dictation** using the Web Speech API with animated equalizer bars, and an auto-resizing textarea that sends on Enter. Selected documents appear as chips above the bar.

The **Manage Documents** page lets users upload drug-label PDFs via drag-and-drop, search and filter documents, see processing status badges, rename inline, and delete with a confirmation dialog and toast notifications. It's fully responsive — one column on mobile, three on desktop.

The **Compare Drugs** page lets users pick two approved drug documents and compare attributes like indications, dosage, warnings, contraindications, pregnancy guidance, and storage side-by-side, with clickable page citations for verification.

The **sidebar** features a three-dot menu on each recent chat for rename and delete, with a custom confirmation modal for deletion. A global search panel lets users search across chats and documents from the sidebar header.

For state management, we use **React Context** — five contexts for theme, UI, conversations, documents, and chat. No Zustand or Redux, keeping the app lightweight and easy to reason about.

Right now the data is mock, but we've prepared an API layer that points to a FastAPI backend. When the backend is ready, we just swap the mock timeouts for real fetch calls — the components stay the same.

The product philosophy is **Ask, Answer, Cite, Verify** — and the frontend delivers the first three today. Thank you."

---

*End of guide. Good luck with your viva!*
