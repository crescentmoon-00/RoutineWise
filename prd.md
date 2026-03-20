Product Requirements Document (PRD)
Project Name: RoutineWise (MVP)Version: 1.0Status: Final DraftDate: October 26, 2023Platform: Responsive Web Application (PWA)Target Audience: Parents of young neurodivergent children (Ages 2-8)

1. Executive Summary
RoutineWise is a responsive web application designed to reduce anxiety for neurodivergent children and cognitive load for parents. It functions as a dynamic "Daily Routine Architect" that adapts to a child's daily state (e.g., mood, sleep quality).

The core differentiator is the AI-Powered "Smart Rule Builder", which allows parents to describe routine logic in plain English (e.g., "If he slept poorly, cancel the park trip"). The system translates this into executable logic, ensuring the schedule adapts to the child's needs in real-time.

2. Technical Stack
Frontend: React.js (Mobile-First Responsive Design).
Backend: Node.js with Express.js.
Database: MongoDB (NoSQL) for flexible, nested routine data.
AI Integration: OpenAI API (or similar LLM) for Natural Language Logic parsing.
Testing: Jest (Backend), React Testing Library (Frontend).
Infrastructure: PWA (Progressive Web App) standards for offline capability.
3. User Personas
"The Manager Parent" (Primary User): Overwhelmed, juggling multiple therapies and tasks. Needs quick data entry and tools to advocate for their child (PDF reports).
"The Child" (Secondary User): Age 2-8. Requires visual structure to feel safe. Interacts with the app via a simplified, high-contrast "Child View."
4. Functional Requirements
4.1 User Management & Profiles
Multi-Child Support: Parents can toggle between multiple child profiles from a central dashboard.
Role-Based Views:
Parent View: Dashboard, Quick Log, Rule Builder, Settings.
Child View: Full-screen visual timeline (locks scrolling to prevent accidental exits).
4.2 The Visual Schedule (Child View)
Visual Assets: Pre-loaded library of free, open-source SVG icons (e.g., OpenMoji) covering common activities (eating, sleeping, hygiene, school).
Customization: Parents can upload personal photos for specific items to aid recognition.
Interaction: Large touch targets. Tapping a task marks it "Complete," triggering positive visual feedback (confetti or stars).
Dynamic Updates: The schedule updates instantly when the parent modifies rules or logs an event.
4.3 The "Smart Rule Builder" (AI Core)
Natural Language Input: A text input field where parents type instructions.
Input Example: "If he has a meltdown before 10 AM, switch the morning routine to 'Quiet Time'."
AI Processing: Node.js backend sends the prompt to an LLM API; receives structured JSON logic mapping to app variables.
Validation & Confirmation: The system presents the interpreted logic to the parent for verification before saving.
Display: "Rule Created: IF Meltdown logged < 10 AM, THEN Replace Morning Routine with Quiet Time. [Save] [Edit]"
Pre-Built Templates: A library of common "If/Then" scenarios for parents who prefer not to type.
4.4 Quick Log & Tracking
One-Tap Logging: Large buttons on the Parent Dashboard for frequent events (Medication, Meltdown, Snack, Mood Shift).
Context Tags: Optional ability to tag a log with a specific trigger (e.g., "Loud Noise").
Timestamping: All logs auto-capture time/date, editable by the parent.
4.5 Reporting & Export
PDF Generator: Backend compiles logs, schedule adherence, and notes into a clean, professional PDF.
Use Case: Designed for printing or emailing to doctors, therapists, or IEP meetings.
5. Non-Functional Requirements
5.1 Performance & Accessibility
Load Time: Initial load under 2 seconds on 4G networks.
Offline Mode: Service Workers cache the schedule for offline viewing (critical for meltdowns in dead zones).
Accessibility: WCAG 2.1 AA compliance (High contrast, screen reader compatibility, minimal animations option).
5.2 Quality Assurance & Unit Testing
Backend Logic: Unit tests (Jest) required for all Rules Engine functions to ensure logic triggers execute correctly.
AI Validation: Tests to ensure LLM JSON output matches database schemas.
Frontend: Component tests for the Visual Schedule and input validation.
Coverage Goal: >80% coverage on critical business logic.
6. Data Structure (MongoDB)
Collection: children

{  "_id": "unique_id",  "parent_id": "user_id",  "name": "Alex",  "age_mode": "explorer",   "sensory_profile": "high_alert",  "routines": [    {      "name": "Morning Routine",      "steps": [        { "task": "Brush Teeth", "icon": "toothbrush.svg", "status": "pending" },        { "task": "Eat Breakfast", "icon": "cereal.svg", "status": "pending" }      ]    }  ],  "custom_rules": [    {      "trigger_variable": "sleep_quality",      "trigger_condition": "low",      "action_type": "suggest_activity",      "action_value": "Quiet Time",      "active": true    }  ]}
Note: age_mode field included to support future expansion to older age groups.

7. Monetization Strategy (Freemium)
Feature
Free Tier
Premium Tier ($9.99/mo)
Children Profiles	1 Child Profile	Unlimited Children
Visual Schedule	Basic Timeline & Pre-loaded Icons	Unlimited Custom Photo Uploads
Smart Rules	Manual Rules Only	AI-Powered Natural Language Rules
Tracking	Manual Logging	Weekly Correlation Insights
Export	View on Screen Only	PDF Reports for Doctors/IEP

8. Development Roadmap
Sprint 1: Core Infrastructure
Node.js/Express setup with MongoDB connection.
Implementation of Unit Testing Framework (Jest).
Basic Auth & Multi-Child Profile CRUD.
Sprint 2: The Routine Engine
Visual Schedule UI (Web).
Logic Engine development (The "Rules" code).
Writing Unit Tests for Logic Engine.
Sprint 3: AI & Intelligence
Integration with OpenAI API for rule parsing.
"Smart Rule Builder" UI implementation.
Validation layers for AI output.
Sprint 4: Reporting & Polish
PDF Report generation.
PWA Offline capabilities implementation.
Final QA & User Acceptance Testing.
9. Future Roadmap (Post-MVP)
Navigator Mode (Ages 9-18+): A separate UI mode focusing on independence, list views, and executive function coaching rather than visual/icon-based schedules.
