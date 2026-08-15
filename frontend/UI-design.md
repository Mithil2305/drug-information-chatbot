# Drug Information Chatbot — Frontend UI Design System

> **Purpose:** This file is the frontend UI source-of-truth for the Cognizant NPN Drug Information Chatbot.
>
> **For developers and AI coding agents:** Read this file before creating or modifying frontend UI. Follow these rules unless a developer explicitly asks for a change.
>
> **Scope:** Frontend UI/UX only. Do NOT change backend APIs, database logic, RAG logic, authentication logic, Qdrant configuration, or existing business logic unless explicitly requested.

---

## 1. Product Identity

### Product type

A professional healthcare AI application that lets users ask questions about drug information contained in trusted pharmaceutical documentation.

### UI personality

The interface must feel:

- Professional
- Trustworthy
- Calm
- Premium
- Modern
- Clinical
- Human
- Easy to understand
- Evidence-focused

It must **not** feel like:

- A generic ChatGPT clone
- A gaming dashboard
- A crypto/fintech dashboard
- A neon AI interface
- An overly colorful SaaS template
- A crowded hospital management system

### Core visual idea

Use a **premium healthcare + modern AI SaaS** visual language.

The interface should communicate:

> "This is a reliable medical information product where AI answers can be verified against source documents."

---

# 2. Design Principles

## 2.1 Trust first

Medical information must be visually easy to read and verify.

Every important AI response should have a clear source area.

Example:

```text
AI ANSWER

Rinvoq may be associated with ...

────────────────────────────────────

SOURCE
Rinvoq Prescribing Information
Page 12
Warnings and Precautions

[ View Source ]
```

## 2.2 Minimalism

Do not add UI elements just because there is empty space.

Prefer:

- whitespace
- typography
- hierarchy
- subtle borders
- restrained color

over:

- excessive cards
- gradients everywhere
- decorative icons
- excessive animations

## 2.3 Information hierarchy

The user should immediately understand:

1. What the application does
2. Where to ask a question
3. What the AI answered
4. Where the answer came from
5. What document/page supports the answer

---

# 3. Color System

Use a small, consistent palette.

## Primary

```css
--primary: #0E3A3A;
--primary-light: #115150;
--teal: #1C5959;
--accent: #0F7772;
```

## Text

```css
--text-primary: #021D1D;
--text-secondary: #52605F;
--text-muted: #7B8583;
--text-on-dark: #FFFFFF;
```

## Backgrounds

```css
--background: #F7F6F2;
--surface: #FFFFFF;
--surface-warm: #F5F3E6;
--surface-dark: #0E3A3A;
```

## Borders

```css
--border: #E4E5E1;
--border-dark: rgba(255, 255, 255, 0.14);
```

## Status colors

Use status colors only when necessary.

```css
--success: #2F7D65;
--warning: #B87925;
--danger: #B64A4A;
--info: #347A82;
```

### Color rules

- Deep teal is the main brand color.
- Warm off-white is the primary page background.
- White is used for content surfaces.
- Teal should provide emphasis, not cover the entire application.
- Status colors must be used semantically.
- Never use neon colors.
- Avoid purple/pink AI gradients.
- Avoid rainbow gradients.

---

# 4. Typography

## Primary font

Use:

```text
Manrope
```

Fallback:

```css
font-family: "Manrope", "Inter", sans-serif;
```

Use the primary sans-serif font for:

- navigation
- headings
- body
- buttons
- labels
- cards
- chat
- forms

## Optional editorial accent

Use an elegant serif italic font only for selected marketing headings.

Preferred:

```text
Cormorant Garamond
```

Alternatives:

```text
Playfair Display
DM Serif Display
```

Example:

```text
Trusted by Patients
```

where `Patients` may use the serif italic accent.

Do NOT use the serif font for:

- body text
- chat messages
- medical information
- tables
- buttons
- navigation

---

# 5. Typography Scale

## Desktop

```text
Hero heading:       64–80px
Page heading:       44–56px
Section heading:    40–52px
Card heading:       20–26px
Body:               16–18px
Small text:         13–14px
Button:             14–16px
Navigation:         14–15px
```

## Mobile

```text
Hero heading:       40–48px
Page heading:       32–40px
Section heading:    30–36px
Card heading:       19–22px
Body:               15–17px
Small text:         12–14px
```

## Heading rules

Large headings should be:

```css
font-weight: 600;
letter-spacing: -0.03em;
line-height: 1.05;
```

Body:

```css
line-height: 1.6;
```

Do not use excessively bold text throughout the UI.

---

# 6. Spacing System

Use a consistent spacing scale.

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-7: 32px;
--space-8: 40px;
--space-9: 48px;
--space-10: 64px;
--space-11: 80px;
--space-12: 96px;
--space-13: 120px;
```

### General rule

Use generous spacing.

The UI should breathe.

---

# 7. Container

Desktop:

```css
max-width: 1280px;
margin: 0 auto;
padding: 0 32px;
```

Large desktop:

```css
max-width: 1320px;
```

Mobile:

```css
padding: 0 20px;
```

Never allow important content to stretch indefinitely across a huge screen.

---

# 8. Border Radius

```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 18px;
--radius-xl: 24px;
--radius-pill: 999px;
```

Use:

```text
Inputs:       12px
Cards:        18px
Large cards:  20–24px
Hero:         20px
Buttons:      999px
Badges:       999px
```

The interface should have soft rounded geometry.

---

# 9. Shadows

Keep shadows subtle.

```css
--shadow-card: 0 8px 30px rgba(2, 29, 29, 0.06);
--shadow-hover: 0 14px 40px rgba(2, 29, 29, 0.10);
```

Do not use:

- heavy black shadows
- glowing shadows
- neon shadows

Borders and whitespace should do most of the visual work.

---

# 10. Navbar

## Desktop structure

```text
[LOGO]       Home   Drug Library   How It Works   About       [Login] [Ask AI]
```

### Style

- Warm white / cream background
- Dark teal text
- Minimal layout
- Generous horizontal padding
- Pill-shaped primary CTA
- No unnecessary icons

### Dimensions

```text
Height:          68–76px
Horizontal pad:  24–40px
Navigation gap:  24–32px
Button height:   42–48px
```

### Primary CTA

```css
background: var(--primary);
color: white;
border-radius: 999px;
```

### Mobile

Use a compact hamburger menu.

Do not force desktop navigation onto mobile.

---

# 11. Home Page

The home page should be a marketing/entry point for the application.

## Recommended structure

```text
Navbar

Hero
  ├── Headline
  ├── Description
  ├── Primary CTA
  └── Healthcare / pharmaceutical visual

Trust / Value Proposition

Drug Information Categories

How It Works

Source Verification

Supported Documents / Real Metrics

FAQ

Footer
```

---

# 12. Hero Section

## Goal

Immediately explain what the application does.

Example direction:

```text
Trusted Drug Information,
Powered by AI.

Ask questions about pharmaceutical
documentation and get clear answers
with verifiable sources.

[ Ask the AI ]
```

### Visual style

- Deep teal
- Warm off-white
- Large rounded hero container
- Professional medical/pharmaceutical image
- White heading
- Subtle image overlay
- Large whitespace

### Hero rules

- Do not overcrowd.
- One main CTA.
- One secondary action maximum.
- Keep the headline short.
- Do not put large paragraphs inside the hero.

---

# 13. Drug Information Categories

Use clean cards for common information types.

Example:

```text
┌────────────────────┐
│ Indications        │
│                    │
│ What the medicine  │
│ is used for        │
└────────────────────┘

┌────────────────────┐
│ Dosage             │
│                    │
│ Administration and │
│ dosing information │
└────────────────────┘

┌────────────────────┐
│ Warnings           │
│                    │
│ Important safety   │
│ information        │
└────────────────────┘

┌────────────────────┐
│ Adverse Reactions  │
│                    │
│ Reported reactions │
└────────────────────┘
```

### Card style

```css
background: var(--surface);
border: 1px solid var(--border);
border-radius: 18px;
padding: 24px;
```

---

# 14. How It Works

Show the actual RAG flow clearly.

```text
01
User asks a question

↓

02
Question is processed

↓

03
Relevant document sections are retrieved

↓

04
AI generates a grounded answer

↓

05
Sources are shown with the answer
```

The UI should make the process understandable to a non-technical user.

Avoid unnecessarily technical terms on the main marketing page.

Technical details can appear in an architecture/about section.

---

# 15. Chat Page

The chat page is the most important application screen.

## Desktop layout

```text
┌────────────────┬────────────────────────────────┬─────────────────┐
│                │                                │                 │
│  DRUG LIBRARY  │        AI ASSISTANT            │    SOURCES      │
│                │                                │                 │
│  Rinvoq        │  User question                │  Document       │
│                │                                │                 │
│  Humira        │  AI response                  │  Page 12        │
│                │                                │                 │
│  Skyrizi       │  AI response                  │  Section        │
│                │                                │                 │
│                │  Ask a question...        ➜   │  View source    │
└────────────────┴────────────────────────────────┴─────────────────┘
```

### Three areas

#### Left

Drug/document navigation.

#### Center

Conversation.

#### Right

Evidence/source panel.

---

# 16. Chat Background

Use:

```css
background: var(--background);
```

Do not use pure black.

Do not use a full-screen gradient.

---

# 17. User Message

```css
background: var(--primary);
color: white;
border-radius: 18px;
padding: 14px 18px;
```

User messages should visually stand apart from AI messages.

---

# 18. AI Message

Use a white surface.

```css
background: white;
border: 1px solid var(--border);
border-radius: 18px;
padding: 18px 20px;
```

AI answers should prioritize readability.

---

# 19. Chat Input

The input should be one of the most polished components.

Example:

```text
┌───────────────────────────────────────────────┐
│ Ask about this medication...                 ➤│
└───────────────────────────────────────────────┘
```

### Style

```css
background: white;
border: 1px solid var(--border);
border-radius: 18px;
min-height: 56px;
```

The send button should be a circular or pill-shaped teal control.

---

# 20. Source Panel

This is a major product differentiator.

## Every grounded answer should support:

```text
Source
Document name
Page number
Section name
Relevant snippet
View source
```

Example:

```text
SOURCES

┌──────────────────────────────┐
│ 📄 Rinvoq Prescribing Info   │
│                              │
│ Page 12                      │
│ Warnings and Precautions     │
│                              │
│ [ View Source ]              │
└──────────────────────────────┘
```

### Source card

```css
background: var(--background);
border: 1px solid var(--border);
border-radius: 14px;
padding: 16px;
```

Source information should never be hidden unnecessarily.

---

# 21. Drug Information Page

Use a clean clinical information layout.

```text
Drug Name
Short description

Overview
────────────────────────────

Indications
────────────────────────────

Dosage & Administration
────────────────────────────

Contraindications
────────────────────────────

Warnings & Precautions
────────────────────────────

Adverse Reactions
────────────────────────────

Drug Interactions
────────────────────────────

References
────────────────────────────
```

### Important

Medical information must remain readable.

Do not use:

- tiny text
- excessive animations
- complex charts unless useful
- decorative UI around important warnings

---

# 22. Warnings / Safety UI

Warnings need stronger visual hierarchy.

Example:

```text
⚠ Important Safety Information

Some medicines may have serious risks.
Review the official prescribing information
for complete details.

[ View source ]
```

Use the semantic warning color sparingly.

Do not make the entire page yellow/red.

---

# 23. FAQ

Use a clean accordion.

```text
Frequently Asked Questions

01  How does the chatbot answer questions?
    +

02  What documents are used?
    +

03  Can I verify an answer?
    +

04  How are sources displayed?
    +
```

Active accordion:

- deep teal background
- white text
- smooth height transition

---

# 24. Footer

Use a deep teal footer.

```text
LOGO

Drug information powered by
trusted documentation and AI.

Explore
  Home
  Drug Library
  How It Works

Resources
  Documentation
  FAQ

Legal
  Privacy
  Terms
```

Use:

```css
background: var(--primary);
color: white;
```

Secondary text:

```css
color: rgba(255,255,255,0.70);
```

---

# 25. Icons

Preferred:

```text
Lucide React
```

Alternative:

```text
Phosphor Icons
```

Use simple outline icons.

Recommended stroke:

```text
1.5–2px
```

Do not mix multiple icon styles.

Do not use emoji as primary UI icons.

---

# 26. Images

Use images only when they support the healthcare identity.

Good:

- pharmaceutical research
- medicine/document imagery
- laboratory environments
- healthcare professionals
- clinical research

Avoid:

- generic smiling stock-photo people everywhere
- unrelated hospital imagery
- excessive photos inside application screens

Marketing pages can use imagery.

The actual chat application should prioritize information.

---

# 27. Animation

Use subtle animation.

```text
Duration: 200–300ms
Easing: ease-out
```

Allowed:

- hover transitions
- button transitions
- accordion expansion
- source panel opening
- chat message appearance
- subtle page transitions

Avoid:

- bouncing everything
- excessive particles
- glowing borders
- constant floating animations
- distracting 3D effects

---

# 28. Responsive Rules

## Desktop

```text
>= 1200px
```

Use:

- full navigation
- 3-column chat layout
- large hero
- source sidebar
- multi-column cards

## Tablet

```text
768px–1199px
```

Use:

- 2-column layouts where possible
- collapsible source panel
- reduced spacing
- reduced heading sizes

## Mobile

```text
< 768px
```

Use:

- hamburger navigation
- one-column content
- full-width chat
- source panel as drawer/collapsible section
- 20px horizontal padding
- full-width CTA where appropriate

Never allow:

- horizontal page scrolling
- clipped text
- tiny buttons
- unreadable medical content

---

# 29. Accessibility

The UI must be accessible.

Requirements:

- keyboard-accessible buttons
- visible focus states
- readable contrast
- semantic HTML
- labels for form controls
- alt text for meaningful images
- buttons must have clear text or accessible labels
- do not communicate important information by color alone

---

# 30. Component Rules

Build reusable components instead of repeating styles.

Recommended:

```text
Button
Card
Badge
Input
Textarea
Modal
Accordion
Navbar
Footer
ChatMessage
ChatInput
SourceCard
DrugCard
WarningCard
LoadingState
EmptyState
```

Do not create slightly different versions of the same component without a reason.

---

# 31. Suggested React Structure

```text
src/
├── components/
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── SourceCard.jsx
│   ├── ChatMessage.jsx
│   ├── ChatInput.jsx
│   ├── DrugCard.jsx
│   └── WarningCard.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Chat.jsx
│   ├── DrugInformation.jsx
│   └── About.jsx
│
├── styles/
│   ├── variables.css
│   ├── globals.css
│   └── components.css
│
└── App.jsx
```

Adapt this to the existing project instead of restructuring the entire application unnecessarily.

---

# 32. Tailwind Design Tokens

If Tailwind is being used, map the design system approximately as:

```text
primary       #0E3A3A
primary-light #115150
teal          #1C5959
accent        #0F7772

background    #F7F6F2
surface       #FFFFFF
cream         #F5F3E6

text          #021D1D
muted         #52605F
border        #E4E5E1

success       #2F7D65
warning       #B87925
danger        #B64A4A
```

Do not introduce arbitrary colors for individual components.

---

# 33. Do / Don't

## DO

- Use deep teal as the visual identity.
- Use warm off-white backgrounds.
- Use large, clean typography.
- Use rounded cards.
- Use pill-shaped primary buttons.
- Keep plenty of whitespace.
- Make source citations highly visible.
- Keep medical information readable.
- Use subtle animations.
- Make the interface responsive.
- Reuse components.
- Preserve existing API behavior.

## DON'T

- Don't redesign the backend.
- Don't change API endpoints unless explicitly requested.
- Don't change RAG logic during a UI task.
- Don't replace Qdrant.
- Don't introduce random colors.
- Don't create a generic ChatGPT clone.
- Don't use excessive glassmorphism.
- Don't use neon gradients.
- Don't fill every area with cards.
- Don't use fake statistics.
- Don't hide document sources.
- Don't use tiny medical text.
- Don't add unnecessary dependencies.
- Don't rewrite working functionality just to change styling.

---

# 34. AI Coding Agent Instructions

When an AI coding agent such as Antigravity/Cursor/Copilot works on this frontend:

### Before editing

1. Inspect the existing project structure.
2. Identify the current frontend framework.
3. Identify the existing routes.
4. Identify existing API calls.
5. Identify reusable components.
6. Identify the current CSS/Tailwind setup.
7. Preserve existing functionality.

### During implementation

1. Implement the design system in reusable components.
2. Use the color tokens from this document.
3. Use the typography rules from this document.
4. Keep the UI responsive.
5. Avoid unnecessary package installation.
6. Do not replace working functionality.
7. Do not modify backend code for a frontend-only task.
8. Keep source/document information visible.
9. Maintain clean component structure.
10. Test the application after changes.

### After implementation

Check:

```text
[ ] Desktop layout
[ ] Tablet layout
[ ] Mobile layout
[ ] Navigation
[ ] Chat functionality
[ ] Chat input
[ ] Source panel
[ ] Document information
[ ] Buttons
[ ] Loading states
[ ] Error states
[ ] Empty states
[ ] Accessibility
[ ] Existing API functionality
```

---

# 35. Design Priority

When making a design decision, follow this priority:

```text
1. Functionality
2. Readability
3. Medical information clarity
4. Source verification
5. Accessibility
6. Visual hierarchy
7. Responsiveness
8. Premium aesthetics
9. Animation
```

Never sacrifice information clarity for visual decoration.

---

# 36. Final Visual Direction

The target visual balance is:

```text
Healthcare identity        30%
Premium editorial design   20%
Modern SaaS UX             25%
Medical information UX     15%
AI interaction              10%
```

The finished product should feel like:

> **A premium healthcare information platform powered by AI and grounded in trusted pharmaceutical documentation.**

It should NOT feel like:

> "A normal chatbot with a healthcare color scheme."

---

# 37. Single Source of Truth

This file is the **frontend UI design source-of-truth**.

When implementing new UI:

1. Check this document first.
2. Reuse existing components.
3. Follow the existing color tokens.
4. Follow the spacing and typography system.
5. Preserve backend/API functionality.
6. Keep the source-verification experience prominent.
7. If a new design requirement conflicts with this document, update this document intentionally rather than silently introducing a new style.
