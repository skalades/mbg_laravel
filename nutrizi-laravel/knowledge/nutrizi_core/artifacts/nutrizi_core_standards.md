# Nutrizi Core Standards & Principles

This document serves as the permanent source of truth for the Nutrizi system's nutritional targets and core development principles.

## 1. Nutritional Standards (Standard Gizi)
All calculations and analyses must strictly adhere to these targets:

| Portion Type  | Energy (kkal) | Protein (g) | Fat (g) | Carbs (g) |
|---------------|---------------|-------------|---------|-----------|
| **Porsi Kecil** | 469.9         | 10.5        | 16.0    | 72.0      |
| **Porsi Besar** | 644.5         | 18.3        | 21.3    | 95.3      |

> [!NOTE]
> **Multiplier**: The Large Portion is precisely **1.37** times the Base (Small) Portion.
> Any new menu item or portion-based calculation must default to this ratio.

## 2. Platform Principles

### A. Scalability & Maintenance
- **Centralized Config**: Avoid hardcoding kkal targets in frontend components. Fetch them dynamically from the database via shared Inertia props.
- **Batch Processing**: Wherever possible, provide batch operations (e.g. Batch Planning, Batch Update) to optimize user workflow.
- **Modular Components**: Build reusable components with clearly defined TypeScript interfaces.

### B. Premium Aesthetic
- **Branding**: Use the "Obsidian & Emerald" theme consistently.
- **Micro-animations**: Incorporate subtle transitions (700ms `duration`, `ease-in-out`).
- **Modern UI**: Replace legacy `<select>` with custom `PremiumSelector` components. Avoid "kaku" browser defaults.

## 3. Implementation Workflow
1. **Plan Phase**: Every major update requires an implementation plan artifact.
2. **Execution Phase**: Use `task.md` to track progress and `knowledge` items for persistence.
3. **Verification Phase**: Confirm UI consistency across all pages and verify calculation accuracy.
