# Design System Strategy: The Supportive Canvas

## 1. Overview & Creative North Star
The **Creative North Star** for this design system is **"The Mindful Anchor."** 

In the chaotic world of parenting neurodivergent children, digital interfaces often add to the sensory load. This system is designed to do the opposite: it acts as a steady, grounding presence. We move away from the "industrial" look of standard PWAs by embracing **Organic Editorialism**. 

While many apps rely on rigid boxes and 1px lines to create order, this system achieves organization through **Tonal Sculpting**. By using varying depths of color and generous whitespace, we create a UI that feels like a high-end, tactile planner rather than a database. The Parent View uses a sophisticated, data-rich editorial layout, while the Child View shifts into a "Focus Mode"—stripping away everything but the essential, high-contrast visual anchors.

---

## 2. Colors & Surface Logic
The palette is rooted in a "Low-Arousal" philosophy, using muted but distinct tones to facilitate rapid task categorization without overstimulation.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section off content. 
Boundaries must be defined solely through background color shifts. For example, a task list item (using `surface_container_lowest`) should sit atop a page background of `surface`. This creates a soft, natural edge that is easier on the eyes than a high-contrast line.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of fine, heavy-weight paper.
- **Base Layer:** `surface` (#faf8ff)
- **Content Sections:** `surface_container_low` (#f2f3fd)
- **Interactive Cards:** `surface_container_lowest` (#ffffff) for maximum "pop" and legibility.
- **Deep Inset (e.g., Search Bars):** `surface_container_high` (#e7e7f1)

### The "Glass & Gradient" Rule
To elevate the experience from "standard" to "premium," use **Glassmorphism** for floating navigation bars or modals. Apply a `backdrop-blur` of 20px with a semi-transparent `surface_container` color.
- **Signature Textures:** For primary CTAs and Hero sections, use a subtle linear gradient from `primary` (#2f5c9b) to `primary_container` (#4b75b6) at a 135-degree angle. This adds "soul" and depth to the flat Material palette.

---

## 3. Typography: The Lexend Scale
We have selected **Lexend** as our sole typeface. Specifically designed to reduce visual stress and improve reading speed for neurodivergent users, it provides a clean, friendly, yet authoritative editorial feel.

- **Display & Headline (The Editorial Voice):** Use `display-lg` and `headline-lg` with generous leading (1.4x). In the Parent View, these should be used to create clear entry points and a sense of "calm command."
- **Title (The Guide):** `title-lg` and `title-md` act as the primary anchors for task categories.
- **Body (The Clarity):** `body-lg` is the workhorse. Never go below `body-md` for instructional text to ensure accessibility.
- **Hierarchy through Weight:** Use the `on_surface_variant` (#414751) for secondary body text to create a clear visual distinction from primary headers in `on_surface` (#191b22).

---

## 4. Elevation & Depth
Hierarchy is achieved through **Tonal Layering** rather than traditional structural lines or heavy drop shadows.

### The Layering Principle
Depth is created by "stacking" the surface-container tiers. Place a `surface_container_lowest` card on a `surface_container_low` background to create a soft, natural lift.

### Ambient Shadows
When an element must "float" (like a FAB or a modal):
- **Blur:** 24px - 40px.
- **Opacity:** 4% - 8%.
- **Color:** Use a tinted version of `on_surface` (a deep navy/slate) rather than pure black. This mimics natural ambient light.

### The "Ghost Border" Fallback
If a border is required for WCAG compliance in a high-glare environment, use a **Ghost Border**: `outline_variant` (#c1c7d3) at **15% opacity**. 100% opaque borders are strictly forbidden.

---

## 5. Components

### The "Big-Touch" Button
- **Primary:** `primary` (#2f5c9b) background with `on_primary` (#ffffff) text.
- **Shape:** `xl` (3rem) or `full` (9999px) roundedness for a friendly, approachable feel.
- **Size:** Minimum height of `12` (4rem) for primary actions to ensure high accessibility for parents on the go.

### Semantic Chips (Category Markers)
Use the Tonal Palette for categorization:
- **Health/Medication:** `tertiary_fixed_dim` (#f6be3c)
- **School/Learning:** `primary_fixed_dim` (#a9c8ff)
- **Chore/Routine:** `secondary_fixed_dim` (#87d898)
- **Style:** No borders; use `on_[color]_fixed_variant` for the label text to ensure AA contrast.

### Interactive Cards & Lists
- **Forbid Dividers:** Use vertical white space (Spacing Scale `4` or `5`) to separate items.
- **Child View Cards:** Use `lg` (2rem) rounded corners. These cards should be 90% visual (large icons) and 10% text.
- **Parent View Cards:** Use `DEFAULT` (1rem) rounded corners. These allow for "nested" data like notes or timers without looking cluttered.

### Input Fields
- **Style:** Background-filled using `surface_container_high`. No bottom-line only inputs.
- **Focus State:** Transition the background to `surface_container_lowest` and apply a 2px "Ghost Border" using the `primary` color.

---

## 6. Do's and Don'ts

### Do:
- **DO** use the Spacing Scale religiously. Consistent white space is what makes the "No-Line" rule work.
- **DO** use icons with a "Soft-Line" or "Duotone" aesthetic to match the Lexend font weight.
- **DO** prioritize the Child View's visual simplicity. In this mode, one task = one screen.

### Don't:
- **DON'T** use pure black (#000000) for text. Always use `on_surface` to reduce eye strain.
- **DON'T** use "Standard" Material ripples. Use a soft "Fade-and-Scale" transition for touch feedback.
- **DON'T** pack more than three data points into a single card in the Parent View. If it needs more, use a "Surface Nesting" approach (a sub-card).
- **DON'T** use 1px dividers. If you feel the need for a line, you likely need more white space instead.

---

## 7. View Distinction
- **Parent View:** Utilizes `surface_container_low` backgrounds and `body-md` typography. It is an "Editorial Dashboard"—organized, information-dense but airy.
- **Child View:** Utilizes `surface` (the brightest base) and `display-sm` typography. It uses the `xl` (3rem) roundedness scale exclusively to create a "toy-like," safe, and non-threatening environment. All interactions in Child View should be "Large-Tap" (min 80px height).