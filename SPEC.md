# AI Roadmap Learning Platform — Product Specification

> **Ngôn ngữ giao diện:** Tiếng Việt (vi)
> **Xác minh SMS:** Đã tắt (được quản lý qua Clerk Dashboard)

## 1. Concept & Vision

**GoalPlan AI** is a modern AI-powered learning platform that transforms vague learning goals into structured, actionable roadmaps. Users simply state what they want to learn — "I want to learn frontend" — and the AI generates a complete personalized learning journey with monthly phases, weekly tasks, hands-on projects, and progress tracking. The experience feels like having a personal AI career mentor: intelligent, encouraging, and beautifully organized.

The platform embodies the best of modern SaaS: dark-first design with glassmorphism accents, smooth micro-animations, and a startup-grade polish that builds trust from the first impression.

---

## 2. Design Language

### Aesthetic Direction
"Deep Space Minimalism" — Inspired by Linear's precision, Notion's clarity, and Duolingo's gamification warmth. Dark mode as the primary canvas with carefully tuned violet/indigo accents that feel intelligent rather than aggressive.

### Color Palette
| Role | Token | Hex |
|---|---|---|
| Background | `--bg-primary` | `#09090b` |
| Surface | `--bg-surface` | `#18181b` |
| Surface Elevated | `--bg-elevated` | `#27272a` |
| Border | `--border` | `#3f3f46` |
| Text Primary | `--text-primary` | `#fafafa` |
| Text Secondary | `--text-secondary` | `#a1a1aa` |
| Text Muted | `--text-muted` | `#71717a` |
| Accent Primary | `--accent` | `#8b5cf6` |
| Accent Hover | `--accent-hover` | `#7c3aed` |
| Accent Light | `--accent-light` | `#a78bfa` |
| Success | `--success` | `#22c55e` |
| Warning | `--warning` | `#f59e0b` |
| Error | `--error` | `#ef4444` |
| Glass | `--glass-bg` | `rgba(139, 92, 246, 0.08)` |
| Glass Border | `--glass-border` | `rgba(139, 92, 246, 0.15)` |

### Typography
- **Primary Font**: `Inter` (Google Fonts) — weights 400, 500, 600, 700, 800
- **Mono Font**: `JetBrains Mono` — for code snippets and technical content
- **Scale**: 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48 / 60 / 72px
- **Line Heights**: 1.2 for headings, 1.6 for body

### Spatial System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px
- Border radius: sm(6px), md(8px), lg(12px), xl(16px), 2xl(24px), full(9999px)
- Container max-width: 1280px

### Motion Philosophy
- **Entrance**: Fade-up with 20px translate, 400ms ease-out, staggered 80ms between items
- **Hover**: Scale 1.02, 150ms ease-out
- **Page Transitions**: 300ms fade
- **Loading**: Pulse skeleton at 1.5s cycle
- **No janky transforms** — all animations use `will-change: transform, opacity`

### Visual Assets
- **Icons**: Lucide React (consistent 1.5px stroke)
- **Images**: Unsplash contextual photography via direct URLs
- **Decorative**: CSS gradient orbs, grid patterns, subtle noise texture

---

## 3. Layout & Structure

### Public Routes
- `/` — Landing page (hero → features → how-it-works → CTA → footer)
- `/sign-in` — Clerk sign-in page
- `/sign-up` — Clerk sign-up page

### Protected Dashboard Routes
- `/dashboard` — User main dashboard
- `/dashboard/roadmaps` — User's saved roadmaps
- `/dashboard/progress` — Progress overview
- `/dashboard/settings` — Profile settings

### Admin Routes
- `/admin` — Admin dashboard overview
- `/admin/users` — User management table
- `/admin/analytics` — Analytics & charts

### Roadmap Routes
- `/roadmap/[id]` — Public/shared roadmap view (protected by roadmap ownership or admin)

### Page Rhythm
- Landing: Expansive hero → compact features → narrative how-it-works → punchy CTA
- Dashboard: Sidebar (collapsed on mobile) + scrollable main content
- Admin: Same sidebar + dense data tables + chart area

---

## 4. Features & Interactions

### Landing Page
- **Hero Input**: Large input field with placeholder "Vd: Tôi muốn học frontend Developer". On submit → `/sign-in` if not authenticated, else redirect to AI generation flow
- **Background**: Animated gradient mesh with floating orbs (CSS only, no canvas)
- **Feature Cards**: Hover lifts card with subtle glow
- **How It Works**: 3 numbered steps with connecting line
- **CTA**: Full-width gradient banner

### Authentication (Clerk)
- Google OAuth + Email/Password
- Protected routes redirect to `/sign-in?redirect_url=...`
- Role stored in Turso `users` table, synced on first sign-in
- `ADMIN_EMAILS` env var grants ADMIN role to matching email addresses
- Middleware enforces `ADMIN` role for `/admin/*`

### AI Roadmap Generation
1. User enters goal on landing → redirected to sign-in
2. After auth, shows generation page with animated loading state
3. Backend calls Gemini 2.5 Flash API with structured prompt
4. AI returns JSON matching schema → stored in Turso
5. User redirected to `/roadmap/[id]`

### Roadmap Display
- **Timeline View**: Months as vertical nodes on a timeline
- **Skill Cards**: Per-skill cards with checkboxes
- **Project Section**: Highlighted cards for hands-on projects
- **Progress Bar**: Top bar showing completion percentage
- **Interactive Checklist**: Click to toggle task completion → saved to Turso

### User Dashboard
- **Stats Cards**: Total roadmaps, avg completion %, streak days, total tasks done
- **Recent Activity**: Last 5 generated roadmaps
- **Quick Actions**: Generate new roadmap, continue last roadmap
- **Learning Streak**: Visual flame indicator

### Admin Dashboard
- **Stats Cards**: Total users, total roadmaps, active users (7d), AI requests (today)
- **User Table**: Paginated, sortable, searchable — avatar, name, email, role badge, joined date, action buttons (delete)
- **Analytics Charts**: Roadmap categories pie chart, weekly signups bar chart, top goals word cloud

### Progress Tracking
- Per-roadmap task completion stored in `Progress` model
- Completion % = (completed tasks / total tasks) × 100
- Streak = consecutive days with at least one task completed
- Dashboard aggregates across all roadmaps

---

## 5. Component Inventory

### Shared UI
- `Button` — variants: primary, secondary, ghost, destructive, outline. Sizes: sm, md, lg. States: default, hover (scale + glow), active (press down), disabled (opacity 0.5), loading (spinner)
- `Input` — dark glassmorphic, focus ring accent, error state with red border + message
- `Card` — elevated surface, glassmorphic variant for hero/feature sections
- `Badge` — variants: default, success, warning, error, outline
- `Progress` — animated fill bar, percentage label
- `Skeleton` — pulse animation, matches component shapes
- `Avatar` — circular, fallback initials
- `Tooltip` — dark with arrow
- `DropdownMenu` — glassmorphic panel
- `Dialog` — centered modal with backdrop blur
- `Separator` — subtle horizontal rule
- `Switch` — animated toggle for settings

### Layout
- `Navbar` — Logo, nav links, auth buttons, mobile hamburger
- `Sidebar` — Dashboard navigation, collapsible, active state highlight
- `Footer` — Links, copyright, social icons

### Landing
- `HeroSection` — Headline, subtitle, input + button, floating orbs background
- `FeatureCard` — Icon, title, description, hover glow
- `HowItWorksStep` — Number badge, title, description, connector line
- `CTASection` — Gradient banner, headline, button

### Dashboard
- `StatsCard` — Icon, label, value, trend indicator
- `RoadmapCard` — Title, progress bar, date, continue button
- `ActivityItem` — Icon, description, timestamp
- `StreakDisplay` — Flame icon, day count

### Roadmap
- `RoadmapTimeline` — Vertical timeline with month nodes
- `MonthNode` — Month card with skills, tasks, projects
- `SkillCard` — Skill name, checkbox, completion state
- `ProjectCard` — Project title, description, difficulty badge
- `TaskCheckbox` — Checkbox with label, saves on toggle
- `RoadmapProgressBar` — Top bar with % and task count

### Admin
- `AdminStatsCard` — Large number, label, icon, trend
- `UserTable` — Columns as described, pagination controls
- `AnalyticsChart` — Recharts wrapper for pie/bar/line charts

---

## 6. Technical Approach

### Framework
- **Next.js 15** with App Router, React Server Components
- **TypeScript** strict mode
- **Tailwind CSS** for styling
- **Shadcn UI** component patterns (built from scratch, no CLI)

### Database
- **Turso (libSQL)** via `@libsql/client` + `drizzle-orm`
- Drizzle ORM for type-safe queries
- Connection via `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`
- Deployed globally on Turso edge network (no server required)

### Authentication
- **Clerk** v6 for auth: `@clerk/nextjs` package
- `clerkMiddleware()` protects `/dashboard/*`, `/admin/*`, `/generate/*`, `/roadmap/*`
- Role stored in Turso `users` table, synced on first sign-in
- Google OAuth + Email/Password support
- `ADMIN_EMAILS` env var grants admin role

### AI Integration
- **Gemini 2.5 Flash** via `@google/generative-ai`
- Structured JSON prompt with Zod schema validation
- 3 retry attempts with exponential backoff

### API Design
All APIs return `{ data, error, message }` envelope.

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/generate-roadmap` | POST | User | Generate AI roadmap |
| `/api/roadmaps` | GET | User | List user's roadmaps |
| `/api/roadmaps/[id]` | GET | User | Get roadmap by ID |
| `/api/roadmaps/[id]` | DELETE | User | Delete own roadmap |
| `/api/progress` | GET | User | Get progress for roadmap |
| `/api/progress` | POST | User | Update task completion |
| `/api/user` | GET | User | Get current user |
| `/api/user` | PATCH | User | Update profile |
| `/api/admin/users` | GET | Admin | List all users |
| `/api/admin/users` | DELETE | Admin | Delete user |
| `/api/admin/stats` | GET | Admin | Dashboard statistics |
| `/api/admin/roadmaps` | GET | Admin | All roadmaps with filters |

### Data Models

**User**
```ts
{
  id: string;            // UUID
  clerkId: string;       // unique, from Clerk
  name: string;
  email: string;
  image: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}
```

**Roadmap**
```ts
{
  id: string;            // UUID
  userId: string;        // foreign key to User
  goal: string;          // Original user input
  title: string;         // AI-generated title
  description: string;
  duration: string;
  content: {
    months: MonthData[];
    projects: ProjectData[];
    goals: GoalData[];
  };
  createdAt: Date;
  updatedAt: Date;
}
```

**Progress**
```ts
{
  id: string;
  userId: string;
  roadmapId: string;
  completedTasks: string[];  // Task IDs completed
  createdAt: Date;
  updatedAt: Date;
}
```

### Performance
- Server Components by default, `"use client"` only where needed
- `force-dynamic` on all protected routes for Clerk compatibility
- Dynamic imports for heavy components (charts, roadmap viewer)
- Image optimization via `next/image`
- Route-based code splitting (automatic with App Router)
- Turso connection pooled and reused via singleton

### SEO
- `generateMetadata()` on all public pages
- Open Graph images
- Semantic HTML
- Clean URL slugs for roadmaps

---

*This spec is the source of truth. All implementation must match it.*
