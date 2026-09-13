# UX / Design language

## Two audiences, two design targets

- **Admin/Staff**: office users on desktop, dense data, tables, filters,
  charts. Standard modern enterprise SaaS density is appropriate here.
- **Labour/Driver**: often on a personal phone, in daylight, with gloves on,
  possibly lower digital literacy and mixed language comfort. This surface
  prioritizes large touch targets, minimal typing, and unambiguous icons +
  text together (never icon-only for a primary action).

## Driver login — visual direction

Aesthetic: **premium dark industrial transportation** — asphalt, graphite,
brushed metal, a single restrained amber accent for operational/active
states, cool white typography, thin structural grid lines evoking a road,
controlled directional lighting. Explicitly not: cyberpunk neon, gaming UI,
cartoon illustration, generic purple SaaS gradients, stock photography,
heavy glassmorphism.

### Desktop composition (asymmetric, not centered)

```
┌──────────────────────────────────────────────────────────────────┐
│  LEFT — brand/industrial panel     RIGHT — auth panel             │
│                                                                    │
│  Logo                              Welcome back                   │
│  "Move. Manage. Deliver."          Labour / Driver Access          │
│                                                                    │
│  [animated inline SVG truck,       Labour ID   [ LAB001         ] │
│   idle micro-animation]            Login Key   [ ••••••••• 👁 ]   │
│                                                                    │
│                                     [        SIGN IN        ]     │
└──────────────────────────────────────────────────────────────────┘
```

Left panel carries the brand and motion; right panel is a restrained glass
card on the graphite ground. Balance comes from typography scale and the
truck's motion line, not from mirrored symmetry.

### Mobile

Stacked, in this order: logo → heading → Labour ID → Login Key → Sign In →
truck visual beneath (decorative, not pushed above the fold). Touch targets
48–56px minimum. No hover-only affordances.

### Truck SVG + animation states

Custom inline SVG (cab, windshield, cargo body, headlights, tail lights,
wheels + hubs, ground shadow) — no raster/stock assets. CSS-only animation:

- **Idle**: subtle body float, faint engine-vibration jitter, breathing
  headlight glow, soft shadow pulse. Always running, always subtle — this is
  a login screen, not a hero animation.
- **Authenticating**: button enters a loading state → on success, headlights
  brighten, vibration intensifies briefly, wheels spin up, truck drives off
  the right edge → page transitions to the driver dashboard. On failure, a
  short shake on the auth card, no truck animation (don't punish the visual
  element for a credential typo).

Implementation lives in `components/auth/DriverLoginTruck.tsx` (SVG) with
keyframes in `app/globals.css` (or a colocated CSS module) — kept CSS-only so
it degrades gracefully and stays cheap on low-end phones.

## Admin dashboard

Standard: left nav (module list, permission-filtered), top bar (org switcher
if ever multi-entity, user menu), main content = KPI tiles + charts above,
recent-activity/exception lists below (expiring documents, overdue
invoices, open exceptions). Currency always ₹, Indian digit grouping
(`₹1,23,456.00`), dates in `DD MMM YYYY`.

## Shared component inventory (`components/`)

```
components/
├── ui/            buttons, inputs, cards, tables, badges, modals (design system primitives)
├── auth/           DriverLoginTruck, LoginForm variants
├── layout/         AdminShell (nav+topbar), DriverShell
├── charts/         thin Recharts wrappers with the app's theme tokens
└── domain/         TruckCard, TripRow, InvoiceStatusBadge, etc.
```
