Build the first frontend module of our LabelProof drug-information RAG chatbot using React + TypeScript + Tailwind CSS.

Implement ONLY the Chat Space + responsive slide Sidebar for now. Do not implement backend/API integration, PDF viewer, document management, history, comparison, or authentication yet.

UI goal: create a polished ChatGPT-like dark interface inspired by the attached reference images and Beautiful UI's Chat, Prompt Bar, Streaming Text, and Loading State components. Do not copy the reference code literally; adapt the visual style to LabelProof.

Requirements:
- Full-height dark chat layout.
- Responsive left sidebar with smooth slide open/close behavior on mobile.
- Sidebar contains LabelProof branding, New Chat button, recent conversations, Documents, History, and Compare navigation placeholders.
- Main chat area centered with a comfortable max-width.
- Empty-state welcome screen when there are no messages.
- Chat message layout for user and assistant messages.
- Assistant response should support Markdown-style text, inline citation badges, source count, action buttons (copy, regenerate, thumbs up/down), and follow-up question buttons.
- Add a ChatGPT/Beautiful-UI-inspired Prompt Bar fixed at the bottom: plus button, textarea, model selector placeholder, microphone icon, and send button.
- Add a polished loading/thinking state inspired by the provided Loading State component, but keep it simple.
- Add a simulated streaming assistant response using React state/effects so the UI can be tested without a backend.
- Use Lucide React for icons.
- Use React Context for UI/chat state where needed; NO Zustand or Redux.
- Keep components reusable and reasonably simple. Do not over-engineer.
- Use Tailwind CSS for styling; avoid unnecessary custom CSS.
- Use semantic HTML, keyboard accessibility, responsive behavior, and clean TypeScript types.
- Keep the visual language minimal: dark charcoal background, subtle borders, muted text, rounded controls, restrained animations, and ChatGPT-like spacing.
- Do not introduce unnecessary UI libraries.

Suggested structure:

src/
  components/
    layout/
      Sidebar.tsx
      MobileSidebar.tsx
      ChatLayout.tsx
    chat/
      ChatWindow.tsx
      ChatMessage.tsx
      PromptBar.tsx
      StreamingText.tsx
      LoadingState.tsx
      CitationBadge.tsx
      FollowUpList.tsx
  context/
    ChatContext.tsx
    UIContext.tsx
  pages/
    ChatPage.tsx
  types/
    chat.ts

Make the implementation production-quality but medium-complexity. Prioritize clean component separation, responsive ChatGPT-like UX, and a visually polished first screen.