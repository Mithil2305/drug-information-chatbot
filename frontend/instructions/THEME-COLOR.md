# 🎨   THEME SYSTEM

Goal:

Create a premium healthcare AI experience that conveys:

- Trust
- Safety
- Intelligence
- Evidence
- Professionalism

---

# THEME ARCHITECTURE

Rules:

- No hardcoded colors
- Use ThemeContext
- Support:
  - Light
  - Dark
- Colors only from theme files

---

# FILE STRUCTURE

src/

├── theme/
│   ├── colors.ts
│   ├── light.ts
│   ├── dark.ts
│   ├── typography.ts
│   └── index.ts
│
├── contexts/
│   └── ThemeContext.tsx
│
└── hooks/
    └── useTheme.ts

---

# BRAND COLORS

Trust Teal:
#0F766E

AI Cyan:
#06B6D4

Deep Slate:
#0F172A

Success Green:
#16A34A

Warning Amber:
#D97706

Danger Red:
#DC2626

White:
#FFFFFF

---

# COLORS

export const BaseColors = {

primary: '#0F766E',

primaryHover: '#115E59',

ai: '#06B6D4',

success: '#16A34A',

warning: '#D97706',

danger: '#DC2626',

backgroundLight: '#F8FAFC',

surfaceLight: '#FFFFFF',

backgroundDark: '#0B1120',

surfaceDark: '#111827',

textPrimaryLight: '#0F172A',

textSecondaryLight: '#475569',

textPrimaryDark: '#F1F5F9',

textSecondaryDark: '#CBD5E1',

borderLight: '#E2E8F0',

borderDark: '#263449',

};

---

# LIGHT THEME

Focus:

- Clinical
- Clean
- Trustworthy
- High Readability

Characteristics:

- Soft slate background
- White surfaces
- Teal primary actions
- Cyan AI states
- Subtle borders

---

# DARK THEME

Focus:

- Modern AI
- Premium Healthcare
- Comfortable Long Reading

Characteristics:

- Deep navy background
- Slate surfaces
- Teal primary actions
- Cyan AI indicators
- High contrast text

---

# AI COLORS

Thinking:
#06B6D4

Streaming:
#06B6D4

Retrieval:
#22D3EE

Evidence:
#0F766E

Citation:
#0F766E

---

# STATUS COLORS

Ready:
#16A34A

Processing:
#06B6D4

Warning:
#D97706

Error:
#DC2626

---

# TYPOGRAPHY

Primary Font:

Inter

Fallback:

System UI

Font Weights:

400 Regular
500 Medium
600 SemiBold
700 Bold

---

# UI DESIGN RULES

Chat:

- Minimal
- ChatGPT-like
- Answer-focused

Evidence:

- Subtle teal background
- Clickable citations
- Clear source hierarchy

Cards:

- Rounded LG
- Subtle borders
- Minimal shadows

PDF:

- Neutral document viewer
- Exact page navigation

---

# ACCESSIBILITY

Maintain:

- WCAG AA Contrast
- Keyboard Navigation
- Screen Reader Labels

Minimum Touch Target:

44x44

---

# THEME HOOK

Always use:

const { colors } = useTheme();

Never:

style={{
  color: '#0F766E'
}}

Always:

style={{
  color: colors.primary
}}

---

*Made with [Markdown Studio](https://markdownstudio-ai.vercel.app/)*
