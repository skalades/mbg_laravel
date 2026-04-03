# Design System Strategy: The Botanical Editorial

## 1. Overview & Creative North Star
The "Botanical Editorial" is the Creative North Star of this design system. It moves away from the sterile, boxy nature of traditional SaaS dashboards toward an experience that feels organic, authoritative, and intentionally curated. 

By leveraging a deep, sophisticated palette of botanical greens (`primary: #00342b`) and expansive whites, we create a "Digital Conservatory"—a space that feels breathable yet dense with data. We break the "template" look through **Tonal Layering** and **Intentional Asymmetry**. Instead of rigid grids, we use varied card widths and overlapping "glass" elements to guide the eye. Typography is treated with editorial weight, using high-contrast scales to distinguish between "at-a-glance" data and deep-dive insights.

## 2. Colors
Our palette balances the grounding weight of deep forest tones with the lightness of a high-end wellness publication.

*   **Primary Hierarchy:** Use `primary` (#00342b) for high-impact brand moments and `primary_container` (#004d40) for structural depth. CTAs should feel substantial, not neon.
*   **The "No-Line" Rule:** This system prohibits the use of 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts. For example, a `surface_container_low` sidebar sitting against a `surface` background creates a clean, sophisticated break without visual noise.
*   **Surface Hierarchy & Nesting:** Treat the UI as physical layers of fine paper. 
    *   **Level 0:** `background` (#f8f9fa)
    *   **Level 1:** `surface_container_low` (for main content areas)
    *   **Level 2:** `surface_container_lowest` (#ffffff) for the cards themselves, creating a soft, natural lift.
*   **The "Glass & Gradient" Rule:** For floating headers or mobile navigation, use a 70% opacity `surface` with a 20px backdrop-blur. 
*   **Signature Textures:** Apply a subtle linear gradient (from `primary` to `primary_container`) on primary action buttons to give them a "pill-like" tactile quality.

## 3. Typography
We utilize a dual-typeface system to balance character with utility.

*   **Display & Headlines (Manrope):** Chosen for its geometric modernism and warmth. Use `display-lg` for daily caloric goals or macro summaries to provide a "magazine" feel.
*   **Body & UI (Inter):** The workhorse for high-readability. Used for all data tables, meal descriptions, and labels.
*   **Hierarchy as Identity:** By pairing a large `headline-lg` (Manrope) with a small, tracked-out `label-sm` (Inter) in all-caps, we create an authoritative information hierarchy that feels professional and clinical yet accessible.

## 4. Elevation & Depth
In this design system, depth is a result of light and shadow, not lines and boxes.

*   **The Layering Principle:** Place a `surface_container_lowest` card on a `surface_container_low` background. This creates a "Paper-on-Stone" effect that is easier on the eyes than high-contrast borders.
*   **Ambient Shadows:** When an element must float (like a dropdown or a modal), use an ultra-diffused shadow: `box-shadow: 0 20px 40px rgba(0, 52, 43, 0.06)`. Note the use of a tinted shadow (using the primary green) to keep the depth feeling natural.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use `outline_variant` at 15% opacity. It should be felt, not seen.
*   **Glassmorphism:** Use for secondary insights or "snackable" data overlays to allow the brand colors to bleed through, maintaining a cohesive visual field.

## 5. Components
### Buttons & Chips
*   **Primary Button:** Uses the `xl` roundedness (1.5rem) or `full` for a pill shape. Background is a subtle gradient of `primary`.
*   **Secondary/Tertiary:** No background; use `on_surface_variant` for text. Focus on vertical padding from the spacing scale (e.g., `spacing.2.5`) to maintain "breathability."
*   **Filter Chips:** Use `secondary_container` with `on_secondary_container` text. When active, transition to `primary_fixed` to signify a "growth" or "active" state.

### Cards & Lists
*   **The Card Rule:** All cards must use `roundedness.lg` (1rem). 
*   **No Dividers:** Lists within cards must not use horizontal rules. Use `spacing.4` to separate list items. For visual separation, use a subtle background shift to `surface_container_highest` on hover.

### Input Fields
*   **Styling:** Inputs should use `surface_container_low` as a background rather than a white box with a border. This makes the "active" white background (`surface_container_lowest`) pop during interaction.

### Contextual Components (Nutrition Specific)
*   **Macro-Progress Rings:** Use `primary` for protein, `tertiary_container` for fats, and `on_tertiary_container` for carbs. Avoid "traffic light" colors unless it's a critical error.
*   **Meal Timeline:** A vertical line-less list where the "current meal" is elevated using the Glassmorphism rule.

## 6. Do's and Don'ts

### Do
*   **Do** use `spacing.16` (5.5rem) for major section breathing room.
*   **Do** use `on_surface_variant` for secondary text to maintain a soft, sophisticated contrast.
*   **Do** rely on the `surface` tokens to create hierarchy before considering a shadow.
*   **Do** use `roundedness.full` for iconography containers to mimic organic shapes.

### Don't
*   **Don't** use `#000000` for text; always use `on_surface` (#191c1d) for a softer, premium feel.
*   **Don't** use 1px solid dividers to separate dashboard sections. Use a `surface` shift.
*   **Don't** use "Alert Red" for everything. Use the `error_container` for a more muted, professional warning that doesn't cause user anxiety.
*   **Don't** overcrowd the viewport. If the data is dense, use a `surface_container_highest` background to group it and provide a visual "nest."