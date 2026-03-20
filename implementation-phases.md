# RoutineWise - Implementation Phases

**Project Overview**
RoutineWise is a responsive web application (PWA) designed to reduce anxiety for neurodivergent children (ages 2-8) and cognitive load for parents. Features include a visual schedule, AI-powered smart rule builder, quick logging, and PDF reporting.

**Tech Stack**
- Frontend: React.js (Mobile-First)
- Backend: Node.js + Express.js
- Database: MongoDB (NoSQL)
- AI: OpenAI API for natural language logic parsing
- Testing: Jest (Backend), React Testing Library (Frontend)
- PWA: Service Workers for offline capability

---

## Phase 1: Project Foundation & Infrastructure

### 1.1 Project Setup
- Initialize React project with Vite or Create React App
- Set up Node.js + Express backend structure
- Configure MongoDB connection and schemas
- Set up development environment with hot reload
- Configure ESLint and Prettier

### 1.2 Design System Implementation
Based on the "Supportive Canvas" design philosophy from stitch/DESIGN.md

#### 1.2.1 Foundation Setup
- Install Lexend font (Google Fonts)
- Configure Tailwind CSS with custom design tokens
- Set up Material Symbols Outlined icon library
- Implement "No-Line Rule" design principle (use tonal shifts, no 1px borders)

#### 1.2.2 Color Palette (Surface-Based Hierarchy)
```javascript
// Base Surface Layers
surface: "#faf8ff"                    // Base layer
surface_container_low: "#f2f3fd"      // Content sections
surface_container_lowest: "#ffffff"   // Interactive cards (max pop)
surface_container_high: "#e7e7f1"     // Deep inset (search bars)

// Primary Colors
primary: "#2f5c9b"
primary_container: "#4b75b6"
primary_fixed: "#d6e3ff"
primary_fixed_dim: "#a9c8ff"

// Secondary Colors
secondary: "#186c37"
secondary_container: "#a0f2af"
secondary_fixed: "#a3f5b2"
secondary_fixed_dim: "#87d898"

// Tertiary Colors
tertiary: "#775700"
tertiary_container: "#966e00"
tertiary_fixed: "#ffdea2"
tertiary_fixed_dim: "#f6be3c"

// Text Colors
on_surface: "#191b22"
on_surface_variant: "#414751"
on_background: "#191b22"

// Semantic Colors (for chips/categories)
error: "#ba1a1a"
error_container: "#ffdad6"
outline_variant: "#c1c7d3"
```

#### 1.2.3 Typography Scale (Lexend)
```javascript
display-lg: "32px / 700 weight / 1.2 line-height"
headline-lg: "24px / 600 weight / 1.3 line-height"
title-lg: "20px / 600 weight / 1.4 line-height"
body-lg: "18px / 400 weight / 1.5 line-height"
body: "16px / 400 weight / 1.5 line-height"
small: "14px / 500 weight / 1.4 line-height"
```

#### 1.2.4 Border Radius System
```javascript
borderRadius: {
  DEFAULT: "1rem",    // Parent View cards
  lg: "2rem",        // Child View cards
  xl: "3rem",        // Child View (toy-like feel)
  full: "9999px"     // Buttons, pills
}
```

#### 1.2.5 Spacing System
- Base unit: 8px
- Layout spacing: "airy"
- Use spacing scale religiously (4, 5, 6, 8 for vertical gaps)
- No dividers - use white space instead

#### 1.2.6 Glassmorphism Effects
```css
/* Floating navigation/modals */
backdrop-blur: 20px;
background: rgba(250, 248, 255, 0.8);  /* semi-transparent surface */

/* Primary CTA gradient */
background: linear-gradient(135deg, #2f5c9b 0%, #4b75b6 100%);
```

#### 1.2.7 Ambient Shadows
```css
/* Floating elements */
box-shadow: 0 20px 50px rgba(47, 92, 155, 0.1);  /* Tinted, not pure black */
```

#### 1.2.8 Reusable UI Components
**Button Component:**
- Primary: Pill-shaped (full: 9999px), 48px height minimum
- Colors: primary background, on_primary text
- Interaction: Fade-and-Scale transition (no standard Material ripples)

**Card Component:**
- Parent View: 1rem radius, data-rich
- Child View: 2rem radius, 90% visual (large icons)
- No borders - use surface tonal shifts
- Shadow: soft, tinted ambient shadows

**Input Component:**
- Background: surface_container_high
- No bottom-line only inputs
- Focus state: surface_container_lowest with 2px primary "Ghost Border"

**Semantic Chips (Category Markers):**
- Health/Medication: tertiary_fixed_dim (#f6be3c)
- School/Learning: primary_fixed_dim (#a9c8ff)
- Chore/Routine: secondary_fixed_dim (#87d898)
- Style: No borders, on_[color]_fixed_variant text

**Navigation Components:**
- Desktop SideNav: Fixed left, 64px width, surface background
- Mobile BottomNav: Fixed bottom, glassmorphism, rounded-t-[3rem]
- Profile Switcher: Inset style with surface_container_high background

### 1.3 State Management Setup
- Set up React Context or Redux for global state
- Define state structure:
  - `currentChild` (selected child profile)
  - `routines` (list of routines)
  - `logs` (activity logs)
  - `rules` (custom rules)
- Set up API service layer for backend communication

### 1.4 Testing Infrastructure
- Configure Jest for backend
- Configure React Testing Library for frontend
- Set up test coverage reporting
- Create test utilities and mocks

**Deliverables:**
- Working dev environment
- Design system components library
- State management structure
- Testing framework ready

---

## Phase 2: Backend API & Core Data Structures

### 2.1 MongoDB Schemas
Create Mongoose schemas:
- `User` schema (parent accounts)
- `Child` schema (child profiles with routines, rules, logs)
- `Routine` schema (routine templates)
- `ActivityLog` schema (quick log entries)
- `Rule` schema (smart rules)

### 2.2 Authentication API
- User registration endpoint
- User login/logout with JWT
- Session management
- Password reset flow

### 2.3 Child Profile CRUD API
- Create child profile
- Get all children for parent
- Get single child profile
- Update child profile
- Delete child profile
- Switch between children

### 2.4 Routine Management API
- Create routine
- Get routines for child
- Update routine steps
- Delete routine
- Reorder routine steps

### 2.5 Activity Logging API
- Quick log entry creation
- Get logs by date range
- Update log entry
- Delete log entry
- Get logs with filters (type, trigger)

**Deliverables:**
- Complete REST API with endpoints
- Database models with validation
- API documentation
- Unit tests for all endpoints (80%+ coverage)

---

## Phase 3: Frontend - Authentication & Child Management

### 3.0 Parent Navigation Structure
Based on all stitch parent views:

**Desktop SideNav (64px fixed):**
- Left fixed navigation with:
  - RoutineWise logo + "Parent Portal" subtitle
  - Navigation items (rounded-full pills):
    - Dashboard
    - Schedules (Calendar icon)
    - Child Profiles
    - Settings
  - "Add Child" CTA button (bottom, before help/logout)
  - Help and Logout links (border-top separator)

**Mobile BottomNav (80px with rounded corners):**
- Fixed bottom navigation with:
  - 4-item layout (no side nav on mobile)
  - Center button elevated (-mt-6 or -mt-10)
  - Glassmorphism effect (backdrop-blur-xl)
  - Rounded-t-[3rem] top corners
  - Shadow: [0_-4px_24px_rgba(25,27,34,0.06)]

**TopAppBar (64px fixed):**
- Fixed header with:
  - RoutineWise logo/title (left)
  - Profile switcher (center, inset style)
  - Notifications and profile avatar (right)
  - Glassmorphism backdrop-blur-xl
  - Surface background with 80% opacity

### 3.1 Authentication Flow
- Login page with email/password
- Registration page
- Password reset page
- Protected route wrapper
- Logout functionality

### 3.2 Parent Dashboard
Based on `stitch/stitch/parent_dashboard/code.html`

**Layout Structure:**
- Desktop: Left side nav (64px fixed width) + main content area
- Mobile: Top app bar (64px height) + bottom nav (80px height with rounded corners)
- Profile selector: Inset style in top bar (surface_container_high, rounded-full)

**Bento Grid Layout Components:**
- **Schedule Adherence Card** (8 cols): Progress bars, circular progress indicator
- **Current Task Focus** (4 cols): Active task with timer, gradient background (primary)
- **Recent Logs Section** (12 cols, 3 columns grid):
  - Sleep Log: Sleep quality, mini bar chart
  - Mood Tracker: Current mood, focus/energy tags
  - Quick Logs CTA: Dashed border, add entry prompt
- **Next Events Section** (12 cols): Timeline items with time markers

**Navigation Items:**
- Dashboard (active state)
- Calendar/Schedule
- Rules
- Tracker
- Settings
- Add New Activity (CTA button in sidebar)

**Design Details:**
- Cards use surface_container_lowest background
- No dividers between items (use white space)
- Soft hover shadows on interactive cards
- Semantic chips for categories (primary_fixed, secondary_fixed, tertiary_fixed)

### 3.3 Child Profile Management
Based on `stitch/stitch/profile_management/code.html`

**Profile Card Grid:**
- Responsive grid (1 col mobile, 2 cols tablet, 3 cols desktop)
- Profile cards with:
  - Circular profile photo (24px / 6rem) in colored border
  - Child name (text-2xl font-bold)
  - Age (on-surface-variant)
  - Status badge (secondary_container or tertiary_fixed for transitioning)
  - "View Schedule" button (surface_container_high hover to primary_fixed)
  - Hover effect: shadow-xl and -translate-y-1

**Profile Card Status Badges:**
- Active: secondary_container background, on-secondary-container text
- Transitioning: tertiary_fixed background, on-tertiary-fixed-variant text
- Icons: check_circle (filled) or hourglass_empty

**Add New Profile Card:**
- Dashed border (outline-variant/30)
- surface_container_low background
- Centered content with add icon (text-4xl primary)
- Hover: surface_container background

**Stats Section (Editorial Dashboard):**
- Weekly Engagement (primary background, on-primary text):
  - Large percentage display (text-5xl)
  - Insight text
  - Abstract background decoration (blurred circle)
- Quick Insights (surface_container_high):
  - List items with colored bullets
  - Child-specific patterns

**Navigation Integration:**
- Child Profiles active state in side nav
- "Add Child" button in sidebar bottom
- Mobile bottom nav with center "Profiles" button

### 3.4 Responsive Design
- Mobile-first layout optimization
- Tablet and desktop breakpoints
- Touch-friendly targets (minimum 44px)
- Accessible navigation patterns

**Deliverables:**
- Working authentication system
- Parent dashboard with child switching
- Child profile CRUD UI
- Mobile-responsive layouts

---

## Phase 3.5: Schedule Editor (Parent View)
Based on `stitch/stitch/detailed_schedule_editor/code.html`

### 3.5.1 Layout Structure
- **Left Panel** (4 cols): AI insights + active rules
  - AI Smart Adjustment card (secondary_container background)
  - Active Schedule Rules list (surface_container_low background)
- **Right Panel** (8 cols): Interactive timeline
  - Daily Timeline header with Today/Week toggle
  - Scrollable timeline (max-h-[600px])
  - Hour-based slots with time markers

### 3.5.2 Timeline Components
- **Hour Slots:**
  - Time marker (w-16, right-aligned)
  - Timeline border (border-l-2, outline-variant/20)
  - Task cards with:
    - Colored left border (4px) by category
    - Icon circle (w-10, h-10)
    - Task name and duration
    - Drag indicator icon
    - Hover effect on entire card

- **AI Suggested Gaps:**
  - Dashed border (border-dashed, primary/40)
  - AI icon with "AI Buffer" label
  - Semi-transparent display

- **Task Card Categories:**
  - Primary/Wake: primary_container/10 background
  - Secondary/Breakfast: secondary_fixed/20 background
  - Tertiary/Brushing: tertiary_fixed/30 background
  - "Edited" badge for modified tasks

### 3.5.3 AI Insights Panel
- **Smart Adjustment Card:**
  - Auto_awesome icon
  - AI-generated suggestions
  - Constraint status bar (secondary progress)
  - Glassmorphism effect

- **Active Rules List:**
  - Rule items with:
    - Icon (primary or tertiary)
    - Rule title and description
    - Surface nesting (surface_container_lowest on surface_container_low)
    - Hover shadow

### 3.5.4 Editor Controls
- "Revert" button (surface_container_high)
- "Save Changes" button (primary, shadow-lg)
- "Edit All Rules" link
- "Add New Task" button (dashed border, full width)

### 3.5.5 Interactive Features
- Drag-and-drop task reordering
- Edit task button (per task)
- Time-based slot system
- Real-time AI preview updates

---

## Phase 4: Visual Schedule (Child View)

### 4.1 Visual Schedule Component
Based on `stitch/stitch/child_s_visual_schedule/code.html`

**Layout Structure:**
- Horizontal scrolling timeline (snap-x, snap-mandatory)
- Hidden scrollbar with overflow control
- Three task states: Current (active), Next, Future (progressive opacity)

**Task Card Design:**
- **Current Task** (85vw mobile / 600px desktop, 665px height):
  - Full shadow (0 20px 50px rgba(47,92,155,0.1))
  - surface_container_lowest background
  - Large icon circle (120px-160px) in primary_fixed background
  - "Current Task" badge floating at top (primary background, pill-shaped)
  - Large text (4xl-6xl font-black)
  - "I'm Done!" button (secondary background, 2xl font-bold, 6xl py)

- **Next Task** (75vw / 450px, 563px height):
  - 60% opacity, 95% scale, slight grayscale
  - Dashed border (outline-variant)
  - "Next" badge in background

- **Future Tasks** (75vw / 450px, 563px height):
  - 40% opacity, 90% scale, full grayscale
  - Dashed border (outline-variant)

### 4.2 Task Interaction
- Tap to mark complete
- Confetti or stars animation (celebration feedback)
- Progress path at bottom (solid primary for completed, dots for future)
- Locked scrolling (prevent accidental exits)
- Parent-only unlock mechanism via settings button

### 4.3 Routine Display
- Morning routine view
- Afternoon routine view
- Evening routine view
- Custom routine support
- Real-time updates when rules trigger

### 4.4 Child-Specific Features
- High contrast mode toggle (in settings)
- Minimal animations option (fade-and-scale, not ripples)
- Large text mode (display-lg scale)
- Simplified navigation (4-item bottom nav)
- Visual timer for current task
- Surface background (brightest base, no sidebar)
- Rounded corners: xl (3rem) for "toy-like" feel
- Large tap targets (minimum 80px height)

### 4.5 Dynamic Schedule Updates
- WebSocket or polling for real-time updates
- Automatic schedule refresh on rule changes
- Smooth transition animations for schedule changes
- Horizontal snap scrolling for task progression

### 4.6 Navigation (Child View)
Based on child-specific navigation pattern:
- **Bottom Nav Items:**
  - Home (scale-90, muted)
  - Schedule (center, primary background, full circle, -mt-10)
  - Log (scale-90, muted)
  - Parent (scale-90, muted, lock icon)
- Glassmorphism: backdrop-blur-2xl, 80% opacity
- Rounded corners: rounded-t-[3rem]
- Shadow: soft upward shadow

**Deliverables:**
- Fully functional visual schedule
- Child view with locked navigation
- Real-time schedule updates
- Accessibility features for neurodivergent users

---

## Phase 5: Rules Engine (Without AI)

### 5.1 Rules Data Model
- Rule trigger conditions
- Rule actions
- Rule templates library
- Rule status (active/inactive)

### 5.2 Manual Rule Builder UI
- Dropdown-based rule creation
- Trigger condition selectors
- Action type selectors
- Rule preview/confirmation
- Rule editing interface

### 5.3 Rules Engine Logic
- Rule evaluation system
- Trigger checking on each log entry
- Action execution system
- Rule chaining support

### 5.4 Pre-Built Rule Templates
- Template library UI
- Template categories (morning, evening, behavior-based)
- One-click template application
- Template customization

### 5.5 Rules Management
- Active rules list
- Rule toggle (activate/deactivate)
- Rule deletion
- Rule testing/dry-run mode

**Deliverables:**
- Manual rule builder interface
- Working rules engine
- Template library
- Rule management UI

---

## Phase 6: AI-Powered Smart Rule Builder

### 6.1 OpenAI API Integration
- Set up OpenAI API client
- Create prompt engineering templates
- Implement rate limiting and error handling
- Add API key configuration

### 6.2 Natural Language Parser
- Create LLM endpoint for rule parsing
- Parse natural language inputs into structured JSON
- Handle edge cases and ambiguous inputs
- Add fallback to manual builder if parsing fails

### 6.3 Smart Rule Builder UI
Based on `stitch/stitch/smart_rule_builder/code.html`

**Layout Structure:**
- Desktop: Side nav + main content area with AI preview panel
- Mobile: Bottom nav with center button for rules

**Natural Language Input Section:**
- Large textarea (h-40) with surface_container_high background
- Placeholder: "e.g., 'If Leo finishes his homework before 5pm, he gets 20 minutes of tablet time.'"
- "Generate Rule" button with auto_awesome icon
- Example prompt chips (pills with surface_container_low hover)

**AI Logic Preview Panel:**
- Glassmorphism effect (primary/5 background, primary/10 border)
- Blurred circle decoration (primary/10, blur-3xl)
- Three parsed sections:
  - Trigger (white/60, backdrop-blur-md)
  - Condition (white/60, backdrop-blur-md)
  - Action (primary background, white text, shadow-md)

**Active Rules List:**
- Grid layout (1 col mobile, 2 cols desktop)
- Rule cards with:
  - Category icon (colored backgrounds: secondary_container, tertiary_fixed_dim, primary_fixed_dim)
  - Rule title and description
  - Toggle switch (active/inactive)
  - Semantic chips for categories
  - Hover shadow transition
- Empty state card with dashed border

**Rule Card Color Coding:**
- Chore/Routine: secondary_fixed_dim (#87d898) - green
- Health/Medication: tertiary_fixed_dim (#f6be3c) - amber
- School/Learning: primary_fixed_dim (#a9c8ff) - blue

### 6.4 Rule Validation
- Validate LLM output against schema
- Check for logical consistency
- Prevent circular dependencies
- Rule conflict detection

### 6.5 AI Quality Assurance
- Test suite for common rule patterns
- LLM output consistency tests
- Performance optimization
- Cost tracking and limits

**Deliverables:**
- Working AI rule parser
- Natural language rule builder UI
- Validation and error handling
- Comprehensive AI testing

---

## Phase 7: Quick Logging & Tracking

### 7.1 Quick Log Dashboard
Based on `stitch/stitch/quick_log_activity_tracker/code.html`

**Quick Action Bento Grid (2x2):**
- **Meltdown** (emergency icon, error_container hover): Red emergency button
- **Mood** (sentiment_satisfied, tertiary_fixed hover): Yellow/amber mood tracking
- **Sleep** (bedtime, primary_fixed hover): Blue sleep tracking
- **Food** (restaurant, secondary_container hover): Green meal/snack logging

**Design Details:**
- Large square buttons (aspect-square) with 16px rounded icon circles
- Hover effects: Change background to corresponding container color
- Group transitions for scale and color
- No borders (tonal shifts only)

### 7.2 Log Types
- Predefined log types with color coding:
  - Medication: error_container / error
  - Meltdown: error_container / error (emergency icon)
  - Snack/Meal: secondary_container / secondary (restaurant icon)
  - Mood shift: tertiary_fixed / tertiary (sentiment_satisfied icon)
  - Sleep quality: primary_fixed / primary (bedtime icon)
- Custom log type creation

### 7.3 Log Entry Details
- Timestamp capture (auto + manual edit)
- Duration tracking
- Trigger/context tags
- Notes field
- Severity/intensity rating

### 7.4 Log Management
- **Timeline Display:**
  - Today's timeline in surface_container_low background
  - Log items in surface_container_lowest cards
  - Left-aligned icon circles (colored by category)
  - Time display in surface_container_high badge
  - Hover shadow transition
  - No dividers (white space separation)
- View logs by date
- Filter by type
- Edit log entries (small button)
- Delete log entries
- Bulk actions

### 7.5 Advanced Features (Premium)
- Weekly correlation insights
- Pattern detection
- Trend visualization
- Export to CSV

**Deliverables:**
- Quick log dashboard with one-tap entry
- Comprehensive log management
- Context tagging system
- Basic insights (free tier)

---

## Phase 8: Reporting & Export

### 8.1 Report Generation
- PDF report creation backend
- Report template design
- Data aggregation logic
- Report scheduling (optional)

### 8.2 Report Content
- Child profile summary
- Routine adherence statistics
- Activity log timeline
- Patterns and insights
- Notes and observations

### 8.3 Report UI
- Report generation interface
- Date range selector
- Report preview
- Download button
- Email report option

### 8.4 Export Formats
- PDF download
- Print view
- Email attachment
- Share link (future)

### 8.5 Report Templates
- Doctor/therapist template
- IEP meeting template
- Parent summary template
- Custom report builder (premium)

**Deliverables:**
- Working PDF report generation
- Report UI with date filtering
- Multiple report templates
- Download and email functionality

---

## Phase 9: PWA & Offline Capability

### 9.1 PWA Configuration
- Web app manifest
- Service worker registration
- App icons generation
- Splash screen
- App shortcuts

### 9.2 Offline Caching
- Cache current schedule
- Cache activity icons
- Cache critical JavaScript
- Offline indicator UI
- Sync queue for offline actions

### 9.3 Background Sync
- Sync queued logs when online
- Resolve conflicts
- Sync status indicator
- Manual sync button

### 9.4 Performance Optimization
- Lazy loading
- Code splitting
- Image optimization
- Bundle size optimization
- 2-second load time target

**Deliverables:**
- Installable PWA
- Offline schedule viewing
- Background sync
- Performance metrics met

---

## Phase 10: Accessibility & Polish

### 10.0 Settings & Accessibility UI
Based on `stitch/stitch/app_settings/code.html`

**Settings Layout:**
- Desktop: Side nav + main content area
- Mobile: Bottom nav with center settings button

**Accessibility Bento Grid:**
- **High Contrast Mode Toggle:**
  - Toggle switch (w-14, h-8)
  - surface_container-highest background, peer-checked:bg-primary
- **Minimal Animations Toggle:**
  - Toggle switch (checked by default)
  - Reduces sensory load
- **Interface Scale Slider:**
  - Range input (accent-primary)
  - Labels: Compact, Default, Accessible
  - Current value display (primary, font-bold)

**Notification Preferences:**
- Nested layout (surface_container-low outer, surface_container-lowest inner)
- Notification items with:
  - Icon circle (colored backgrounds)
  - Label and description
  - Toggle switch (w-11, h-6)
  - Hover effect (surface_container-low)
- Categories:
  - Routine Completions (secondary_container)
  - Medication Reminders (tertiary_fixed_dim)
  - Community Updates (primary_fixed)

**Account Management:**
- **Profile Section:**
  - User profile photo (16px / 4rem circle)
  - Name and email
  - Edit button
  - Subscription plan display (active badge)
- **Security Card:**
  - Security icon (error color)
  - "Manage Security" link

**Support Footer:**
- Primary-container/10 background
- "Need more help?" text
- "Contact Support" button (primary, shadow-lg)

### 10.1 Accessibility Compliance
- WCAG 2.1 AA audit
- Screen reader optimization
- Keyboard navigation
- Focus indicators
- ARIA labels

### 10.2 Accessibility Features
- High contrast mode
- Reduced motion option
- Text scaling support
- Color blind safe design
- Closed captions (if video)

### 10.3 UI Polish
- Micro-animations
- Loading states
- Error boundaries
- Success confirmations
- Empty states

### 10.4 User Onboarding
- Welcome tour
- Feature tooltips
- Tutorial videos
- Help documentation
- FAQ section

### 10.5 Quality Assurance
- End-to-end testing
- Cross-browser testing
- Mobile device testing
- Performance testing
- Security audit

**Deliverables:**
- WCAG 2.1 AA compliant
- Comprehensive accessibility features
- Polished UI with animations
- User onboarding flow
- QA test suite passed

---

## Phase 11: Monetization Features (Optional)

### 11.1 Tier System Implementation
- User tier tracking
- Feature flagging system
- Upgrade prompts
- Payment integration (Stripe)

### 11.2 Free Tier
- 1 child profile
- Basic timeline
- Pre-loaded icons only
- Manual rules
- View-only reports

### 11.3 Premium Tier ($9.99/mo)
- Unlimited children
- Custom photo uploads
- AI-powered rules
- Weekly insights
- PDF reports

### 11.4 Upgrade Flow
- Upgrade prompts in UI
- Feature comparison page
- Payment form
- Subscription management
- Downgrade handling

**Deliverables:**
- Working tier system
- Payment integration
- Upgrade/downgrade flows
- Feature gating implementation

---

## Phase 12: Deployment & DevOps

### 12.1 Production Setup
- Frontend deployment (Vercel/Netlify)
- Backend deployment (Railway/Heroku)
- MongoDB Atlas configuration
- Environment variables management
- CI/CD pipeline setup

### 12.2 Monitoring
- Error tracking (Sentry)
- Performance monitoring
- API analytics
- User analytics (GA4)
- Uptime monitoring

### 12.3 Backup & Security
- Database backups
- API rate limiting
- CORS configuration
- Security headers
- SSL/HTTPS

### 12.4 Documentation
- API documentation
- Deployment guide
- Troubleshooting guide
- Contributor guide (if open source)

**Deliverables:**
- Production deployment
- Monitoring and analytics
- Automated backups
- Complete documentation

---

## Future Roadmap (Post-MVP)

### Navigator Mode (Ages 9-18+)
- Independence-focused UI
- List view schedules
- Executive function coaching
- Self-management tools

### Advanced AI Features
- Predictive scheduling
- Behavioral pattern recognition
- Automated routine suggestions
- Chat-based rule creation

### Community Features
- Shared routine templates
- Parent forums
- Expert Q&A
- Success stories

### Integrations
- Calendar sync (Google, Apple)
- Smart home devices
- Wearable devices
- School/therapist portals

---

## Implementation Notes

### Design System Reference (from stitch/DESIGN.md)

**Creative North Star:** "The Mindful Anchor"
- Acts as a grounding presence for parents of neurodivergent children
- Moves away from "industrial" PWA look to "Organic Editorialism"
- Uses tonal sculpting instead of rigid boxes and 1px lines

**Surface Hierarchy (The "No-Line" Rule):**
- **Explicit Instruction:** No 1px solid borders allowed
- Boundaries defined through background color shifts
- Treat UI as stacked sheets of heavy-weight paper:
  - Base Layer: surface (#faf8ff)
  - Content Sections: surface_container_low (#f2f3fd)
  - Interactive Cards: surface_container_lowest (#ffffff)
  - Deep Inset: surface_container_high (#e7e7f1)

**Color Palette (Complete):**
```javascript
// Primary
primary: "#2f5c9b"
primary_container: "#4b75b6"
primary_fixed: "#d6e3ff"
primary_fixed_dim: "#a9c8ff"

// Secondary
secondary: "#186c37"
secondary_container: "#a0f2af"
secondary_fixed: "#a3f5b2"
secondary_fixed_dim: "#87d898"

// Tertiary
tertiary: "#775700"
tertiary_container: "#966e00"
tertiary_fixed: "#ffdea2"
tertiary_fixed_dim: "#f6be3c"

// Surfaces
surface: "#faf8ff"
surface_container_low: "#f2f3fd"
surface_container_lowest: "#ffffff"
surface_container_high: "#e7e7f1"

// Text
on_surface: "#191b22"
on_surface_variant: "#414751"
on_background: "#191b22"

// Semantic
error: "#ba1a1a"
error_container: "#ffdad6"
outline_variant: "#c1c7d3"
```

**Typography (Lexend Scale):**
- Display & Headline: display-lg, headline-lg (generous leading 1.4x)
- Title: title-lg, title-md
- Body: body-lg (workhorse), body-md (instructional minimum)
- Secondary text: on_surface_variant

**Elevation & Depth:**
- Layering through tonal surface-container tiers
- Ambient shadows for floating elements:
  - Blur: 24px - 40px
  - Opacity: 4% - 8%
  - Color: Tinted on_surface (not pure black)
- Ghost Border fallback: outline_variant at 15% opacity (WCAG only)

**Border Radius:**
- DEFAULT: 1rem (16px) - Parent View cards
- lg: 2rem (32px) - Child View cards
- xl: 3rem (48px) - Child View (toy-like)
- full: 9999px - Buttons, pills

**Spacing:**
- Base unit: 8px
- Layout spacing: "airy"
- Use spacing scale religiously (4, 5, 6, 8)
- No dividers - use white space instead

**Effects:**
- **Glassmorphism:** backdrop-blur 20px with semi-transparent surface
- **Gradient:** Linear gradient from primary to primary_container at 135°
- **Ambient Shadows:** Soft, tinted shadows (not pure black)
- **Micro-animations:** Fade-and-scale (no standard Material ripples)

**Components:**
- **Big-Touch Buttons:** Minimum 48px height, pill-shaped (full radius)
- **Semantic Chips:** No borders, tonal backgrounds (health, school, chore)
- **Interactive Cards:** Surface nesting, no dividers
- **Input Fields:** Background-filled (surface_container_high), no bottom-line

**Icons:**
- Material Symbols Outlined (Google Fonts)
- Soft-Line or Duotone aesthetic
- Filled variants for active states (font-variation-settings: 'FILL' 1)

**View Distinction:**
- **Parent View:** "Editorial Dashboard" - data-dense but airy
- **Child View:** "Focus Mode" - one task per screen, large icons, xl roundedness

**Responsive Breakpoints:**
- Mobile: Bottom nav (no side nav), 80px height with rounded corners
- Tablet/Mobile: Top app bar with profile switcher
- Desktop: Left side nav (64px fixed), main content area

**Navigation Patterns:**
- **Desktop:** Side nav with 4 items + Add Child CTA
- **Mobile:** Bottom nav with center elevated button
- **Profile Switcher:** Inset style (surface_container_high, rounded-full)
- **Child View:** 4-item bottom nav (Home, Schedule, Log, Parent)

### Design Philosophy - Do's and Don'ts

**Do:**
- Use the Spacing Scale religiously
- Use icons with Soft-Line/Duotone aesthetic
- Prioritize Child View's visual simplicity (one task = one screen)
- Use tonal sculpting for hierarchy
- Create soft, natural edges (no 1px borders)
- Use surface nesting for complex data
- Implement glassmorphism for floating elements

**Don't:**
- Use pure black (#000000) for text (use on_surface)
- Use "Standard" Material ripples (use fade-and-scale)
- Pack more than 3 data points in a single card (use surface nesting)
- Use 1px dividers (use white space instead)
- Use high-contrast lines (use tonal shifts)
- Ignore the "No-Line" rule

**Original styles.json Reference:**
- **Primary Color:** #2F5C9B
- **Secondary Color:** #4A90E2
- **Accent:** #1B5E20
- **Surface:** #FAF8FF
- **Tonal:** #F2F3FD
- **Font:** Lexend, sans-serif
- **Border Radius:** 8px/16px/24px/9999px
- **Spacing:** 8px base unit, airy layout
- **Buttons:** Pill-shaped, 4rem min height, primary background
- **Inputs:** Surface_container_high background, 12px radius
- **Cards:** White background, 24px radius, soft shadow

### Key Principles
- Mobile-first responsive design
- Large touch targets (minimum 44px)
- Minimal cognitive load for parents
- Visual structure for children
- Offline-first architecture
- Accessibility-first approach

### Testing Requirements
- Unit tests for all business logic (80%+ coverage)
- Component tests for UI
- Integration tests for API
- E2E tests for critical flows
- Accessibility testing with screen readers

### Performance Targets
- Initial load < 2 seconds on 4G
- First contentful paint < 1 second
- Time to interactive < 3 seconds
- Lighthouse score > 90

---

## Design Reference Files

All design specifications and component implementations are based on the following files in the `stitch/` directory:

1. **stitch/stitch/serene_path/DESIGN.md**
   - Complete design system philosophy
   - Creative North Star: "The Mindful Anchor"
   - Surface hierarchy and "No-Line" rule
   - Typography, elevation, and component guidelines
   - Do's and Don'ts

2. **stitch/stitch/parent_dashboard/code.html**
   - Parent dashboard layout with bento grid
   - Schedule adherence visualization
   - Quick stats and recent logs
   - Desktop side nav and mobile bottom nav

3. **stitch/stitch/child_s_visual_schedule/code.html**
   - Child view with horizontal scrolling timeline
   - Task cards with progressive opacity
   - Child-specific navigation
   - Large touch targets and toy-like design

4. **stitch/stitch/smart_rule_builder/code.html**
   - Natural language input interface
   - AI logic preview with glassmorphism
   - Active rules list with color coding
   - Toggle switches and semantic chips

5. **stitch/stitch/quick_log_activity_tracker/code.html**
   - Quick action bento grid (2x2)
   - Timeline display with color-coded log items
   - Emergency, mood, sleep, and food logging
   - No-divider design with white space

6. **stitch/stitch/profile_management/code.html**
   - Profile card grid with status badges
   - Weekly engagement stats
   - Quick insights display
   - Add profile functionality

7. **stitch/stitch/detailed_schedule_editor/code.html**
   - Interactive timeline with drag-and-drop
   - AI insights panel
   - Hour-based slot system
   - Smart adjustment suggestions

8. **stitch/stitch/app_settings/code.html**
   - Accessibility controls (contrast, animations, scale)
   - Notification preferences
   - Account management
   - Support and security options

**Additional Reference Files:**
- `stitch/routinewise_styles_styles.json` - Original color and style tokens
- `stitch/routinewise_prd_mvp.html` - Product requirements document

---

**Next Steps:**
1. Review and approve this implementation plan
2. Set up project repository and team access
3. Begin Phase 1: Project Foundation & Infrastructure
4. Schedule regular sprint reviews and demos
