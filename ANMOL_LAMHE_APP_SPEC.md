# Anmol Lamhe Photography — AI Event Photo Delivery (MVP)
### Freelancer Handover Document (v1.1 — Revised MVP Scope)

> **Brand:** Anmol Lamhe Photography
> **Tagline:** *Every Moment Forever Precious*
> **Product:** AI-powered event photo delivery — MVP
> **Aesthetic:** Luxury, editorial, gold-on-black
> **Logo source of truth:** `/logo/logo-full-dark.svg`

---

## 1. Scope (MVP)

A minimal, deployed, working React web app where the photographer uploads event photos and guests retrieve their own photos by uploading a selfie. AI face matching, Firebase backend, Vercel deployment. **No portfolio site, no admin analytics, no client portal, no print store.**

### 1.1 Tech Stack (fixed)
| Layer | Choice |
|---|---|
| Frontend | **React** (Vite or CRA), responsive |
| Auth | **Firebase Authentication** |
| Storage | **Firebase Storage** |
| Database | **Firebase Firestore** |
| AI | **Face AI API** (e.g. Face++, Luxand, AWS Rekognition, or similar) |
| Hosting | **Vercel** (frontend) |
| Repo | **GitHub** (push regularly) |

### 1.2 Users
| User | What they do |
|---|---|
| **Admin** (photographer) | Log in → create event → upload photos → share event link |
| **Client / Guest** | Open event link → upload selfie → view & download their matched photos |

---

## 2. Feature List

### Admin
- [ ] Admin login (Firebase Auth, email + password)
- [ ] Create event (name, date, optional cover)
- [ ] Upload event photos (multi-file)
- [ ] Generate / copy shareable event link

### Client
- [ ] Open event link (no login)
- [ ] Upload selfie (file picker — gallery or camera on mobile)
- [ ] View matched photos
- [ ] Download photos (single + download all)

### AI Face Matching
- [ ] Run all uploaded event photos through Face AI API to get face embeddings/IDs
- [ ] On selfie upload, match against the event's face set
- [ ] Return matched photo URLs to the client
- [ ] Matching accuracy: MVP-acceptable (tunable threshold, e.g. 75–85%)

### Deliverables
- [ ] Working deployed MVP on Vercel
- [ ] Source code in GitHub
- [ ] Firebase project set up + ownership transferred
- [ ] Basic README / setup instructions
- [ ] Ownership transfer of GitHub repo + Firebase + Vercel to client accounts

---

## 3. Color Palette (Brand)

### 3.1 Primary
| Token | Hex | Usage |
|---|---|---|
| Obsidian Black | `#0B0B0B` | Page background |
| True Black | `#000000` | Logo lockup, hero overlay |
| Champagne Gold | `#C9A961` | Primary accent — buttons, links, dividers |
| Light Gold | `#E8C77A` | Hover state, highlights |
| Deep Gold | `#8C6E2B` | Pressed state, gradient bottom |
| Ivory White | `#F5F0E6` | Body text on dark |
| Pure White | `#FFFFFF` | High-contrast text |

### 3.2 Support
| Token | Hex | Usage |
|---|---|---|
| Charcoal | `#1A1A1A` | Card / surface |
| Graphite | `#2A2A2A` | Borders |
| Mist | `#9A9A9A` | Placeholder / captions |

### 3.3 Semantic
| Token | Hex | Usage |
|---|---|---|
| Success | `#4CAF7B` | Upload complete |
| Warning | `#E0A23C` | Caution states |
| Error | `#D9534F` | Failed upload / no face match |

### 3.4 Gradient
```
linear-gradient(135deg, #E8C77A 0%, #C9A961 50%, #8C6E2B 100%);
```

### 3.5 CSS Tokens (paste into `:root`)
```css
:root {
  --bg-primary: #0B0B0B;
  --bg-surface: #1A1A1A;
  --bg-elevated: #2A2A2A;
  --gold: #C9A961;
  --gold-light: #E8C77A;
  --gold-deep: #8C6E2B;
  --gold-gradient: linear-gradient(135deg, #E8C77A 0%, #C9A961 50%, #8C6E2B 100%);
  --text-primary: #F5F0E6;
  --text-secondary: #9A9A9A;
  --border: #2A2A2A;
  --success: #4CAF7B;
  --warning: #E0A23C;
  --error:   #D9534F;
  --radius-sm: 6px;
  --radius-md: 12px;
  --shadow-soft: 0 10px 40px rgba(0,0,0,0.45);
  --shadow-gold: 0 0 24px rgba(201,169,97,0.25);
}
```

---

## 4. Typography

| Role | Font (Google Fonts) | Weight | Notes |
|---|---|---|---|
| H1 / Brand wordmark | **Cinzel** | 600 | Letter-spacing 0.18em, UPPERCASE |
| Headings H2–H3 | **Cormorant Garamond** or **Playfair Display** | 500–600 | Editorial serif |
| Body / UI | **Montserrat** | 400 / 500 | |
| Labels / Tagline | **Montserrat** | 400 | Letter-spacing 0.3em, UPPERCASE, small |

Type scale (rem): `0.75 · 0.875 · 1 · 1.25 · 1.5 · 2 · 2.5 · 3.5`

---

## 5. Visual Language

- Black backgrounds, gold accents, white/ivory text
- Cards: `#1A1A1A` bg, 12px radius, faint gold border `rgba(201,169,97,0.15)`
- Buttons:
  - **Primary** — gold gradient bg, black text, UPPERCASE, 0.2em tracking
  - **Secondary** — transparent bg, 1px gold border, gold text
- Corner brackets `⌐ ⌐` decorative motif (from logo)
- Slow fades, no bouncy animations
- Imagery: full-bleed photos, no rounded corners on hero

---

## 6. Site Map (MVP — only 7 screens)

```
                       ┌─────────────────────┐
                       │   /  (Home / Entry) │
                       └──────────┬──────────┘
                                  │
                ┌─────────────────┴────────────────┐
                ▼                                  ▼
       /admin/login (Admin)              /event/[id] (Client link)
                │                                  │
                ▼                                  ▼
       /admin (Event list)               Upload Selfie
                │                                  │
                ▼                                  ▼
       /admin/event/new                  Results (matched photos)
                │                                  │
                ▼                                  ▼
       /admin/event/[id] (manage)        Download
       (upload photos + share link)
```

---

## 7. User Flows

### 7.1 Admin Flow
```
1. Open /admin/login → enter email + password (Firebase Auth)
2. Land on /admin → see list of events + "+ New Event"
3. Click New Event → enter name + date → Create
4. Land on /admin/event/[id] → drag/drop photos to upload
5. Photos upload to Firebase Storage; metadata + faces saved in Firestore
6. Copy shareable link: anmollamhe.app/event/[id]
7. Send link to client / share via WhatsApp
```

### 7.2 Client / Guest Flow
```
1. Open event link → see event landing (event name, cover, CTA)
2. Tap "Find My Photos" → upload selfie (file picker / camera)
3. Selfie sent to Face AI API → matched against event face set
4. See grid of matched photos
5. Download individual photos or "Download All" (ZIP)
```

---

## 8. Wireframes (ASCII — all 7 screens)

### 8.1 Admin Login
```
┌──────────────────────────────────────────────┐
│                                              │
│              [LOGO — gold/black]             │
│                                              │
│              ADMIN  LOGIN                    │ ← Cinzel
│           ──────────────────                 │ ← gold rule
│                                              │
│   ┌──────────────────────────────────────┐   │
│   │  Email                               │   │
│   └──────────────────────────────────────┘   │
│                                              │
│   ┌──────────────────────────────────────┐   │
│   │  Password                            │   │
│   └──────────────────────────────────────┘   │
│                                              │
│   ┌──────────────────────────────────────┐   │
│   │           LOG IN                     │   │ ← gold gradient
│   └──────────────────────────────────────┘   │
│                                              │
│              Forgot password?                │ ← ghost link
│                                              │
└──────────────────────────────────────────────┘
```

### 8.2 Admin — Events List
```
┌─────────────────────────────────────────────────────────────┐
│  [LOGO]                                  anmol@..  Log out  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   MY EVENTS                            [ + NEW EVENT ]      │ ← gold btn
│   ───────────                                               │
│                                                             │
│   ┌────────────────────────────────────────────────────┐   │
│   │ ▣  Riya & Arjun                                    │   │
│   │    14 February 2026 · 4,287 photos                 │   │
│   │                                       Manage →     │   │
│   └────────────────────────────────────────────────────┘   │
│   ┌────────────────────────────────────────────────────┐   │
│   │ ▣  Neha & Sahil                                    │   │
│   │    09 February 2026 · 3,102 photos                 │   │
│   │                                       Manage →     │   │
│   └────────────────────────────────────────────────────┘   │
│                                                             │
│   (empty state: "No events yet — create your first")        │
└─────────────────────────────────────────────────────────────┘
```

### 8.3 Admin — Create Event
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to events                                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   CREATE NEW EVENT                                          │ ← Cinzel
│   ───────────────                                           │
│                                                             │
│   Event Name                                                │
│   ┌──────────────────────────────────────────────────┐     │
│   │ e.g. Riya & Arjun Wedding                        │     │
│   └──────────────────────────────────────────────────┘     │
│                                                             │
│   Event Date                                                │
│   ┌──────────────────────────────────────────────────┐     │
│   │ 14 / 02 / 2026                                   │     │
│   └──────────────────────────────────────────────────┘     │
│                                                             │
│   Cover Image (optional)                                    │
│   ┌──────────────────────────────────────────────────┐     │
│   │   ⤒  Click to upload                              │     │
│   └──────────────────────────────────────────────────┘     │
│                                                             │
│   [ CANCEL ]              [ CREATE EVENT ]                  │
└─────────────────────────────────────────────────────────────┘
```

### 8.4 Admin — Event Detail (Upload + Share)
```
┌─────────────────────────────────────────────────────────────┐
│  ← Events                                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   RIYA & ARJUN                                              │ ← Cinzel
│   14 February 2026                                          │
│   ─────────────────                                         │
│                                                             │
│   SHAREABLE LINK                                            │
│   ┌──────────────────────────────────────────────┬───────┐ │
│   │ anmollamhe.app/event/abc123                  │ COPY  │ │
│   └──────────────────────────────────────────────┴───────┘ │
│   [ Share on WhatsApp ]                                     │
│                                                             │
│   UPLOAD PHOTOS                                             │
│   ┌──────────────────────────────────────────────────┐     │
│   │                                                  │     │
│   │      ⤒   Drag photos here or click to browse     │     │
│   │              JPG · PNG · up to 50 MB each        │     │
│   │                                                  │     │
│   └──────────────────────────────────────────────────┘     │
│                                                             │
│   UPLOADED (24)                                             │
│   ┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐                        │
│   │  ││  ││  ││  ││  ││  ││  ││  │  thumbnails + ✕ delete  │
│   └──┘└──┘└──┘└──┘└──┘└──┘└──┘└──┘                        │
│                                                             │
│   PROCESSING                                                │
│   IMG_4421.jpg  ✓ Faces detected (3)                       │
│   IMG_4422.jpg  ▓▓▓▓▓▓▓░░  72% uploading                   │
└─────────────────────────────────────────────────────────────┘
```

### 8.5 Client — Event Landing
```
┌──────────────────────────────────────────────┐
│            [LOGO — small, centered]          │
├──────────────────────────────────────────────┤
│                                              │
│         [ cover image ]                      │
│                                              │
│         RIYA  &  ARJUN                       │ ← Cinzel
│      ─── 14 FEBRUARY 2026 ───                │
│                                              │
│   ⌐  Find your photos in seconds  ⌐          │
│                                              │
│      ┌──────────────────────────┐            │
│      │   FIND MY PHOTOS  →      │            │ ← gold btn
│      └──────────────────────────┘            │
│                                              │
│   Powered by Anmol Lamhe Photography         │
└──────────────────────────────────────────────┘
```

### 8.6 Client — Upload Selfie
```
┌──────────────────────────────────────────────┐
│  ← Back                                      │
├──────────────────────────────────────────────┤
│                                              │
│         UPLOAD YOUR SELFIE                   │ ← Cinzel
│         ─────────────────                    │
│                                              │
│      We'll find every photo of you           │
│                                              │
│      ┌──────────────────────────────┐        │
│      │                              │        │
│      │     ⤒  Tap to upload         │        │
│      │     (or use your camera)     │        │
│      │                              │        │
│      └──────────────────────────────┘        │
│                                              │
│      [ preview thumbnail after pick ]        │
│                                              │
│      ┌──────────────────────────────┐        │
│      │      FIND MY PHOTOS          │        │ ← gold btn
│      └──────────────────────────────┘        │
│                                              │
│   🛈 Your selfie is used only to match.      │
└──────────────────────────────────────────────┘
```

### 8.7 Client — Results
```
┌──────────────────────────────────────────────────────────────┐
│  ← Riya & Arjun                          [ ⤓ DOWNLOAD ALL ] │
├──────────────────────────────────────────────────────────────┤
│   We found 47 photos of you                                  │
│   ──────────────────────                                     │
│                                                              │
│   ┌────┐ ┌────┐ ┌────┐ ┌────┐                                │
│   │img │ │img │ │img │ │img │   responsive grid              │
│   └────┘ └────┘ └────┘ └────┘   tap → lightbox + download    │
│   ┌────┐ ┌────┐ ┌────┐ ┌────┐                                │
│   │img │ │img │ │img │ │img │                                │
│   └────┘ └────┘ └────┘ └────┘                                │
│                                                              │
│   (empty state: "No photos matched — try a clearer selfie")  │
└──────────────────────────────────────────────────────────────┘
```

---

## 9. Components to Build

| Component | Notes |
|---|---|
| `Button` (Primary, Secondary, Ghost) | Gold gradient primary; gold-bordered secondary |
| `Input` | Black bg, gold focus border |
| `Card` | Charcoal bg, faint gold border |
| `PhotoTile` | Lazy-loaded thumb, hover scale, download icon |
| `Uploader` | Drag-drop + file picker, progress bars |
| `Lightbox` | Full-screen photo viewer, swipe / ← → keys, download button |
| `Toast` | Bottom-right, gold for info / red for error |
| `LoadingSpinner` | Gold ring spinner |
| `EmptyState` | Icon + line + CTA |

---

## 10. Firebase Data Model

### 10.1 Firestore Collections

```
users/{uid}
  email: string
  role: "admin"
  createdAt: timestamp

events/{eventId}
  name: string
  date: timestamp
  coverUrl: string | null
  ownerUid: string
  shareSlug: string         // short URL slug
  photoCount: number
  createdAt: timestamp

events/{eventId}/photos/{photoId}
  storagePath: string        // Firebase Storage path
  url: string                // download URL
  thumbUrl: string
  faceIds: string[]          // IDs returned by Face AI API
  uploadedAt: timestamp

events/{eventId}/faces/{faceId}
  photoId: string            // back-reference
  faceToken: string          // token from Face AI API
  boundingBox: { x, y, w, h }
```

### 10.2 Firebase Storage Layout
```
/events/{eventId}/original/{photoId}.jpg
/events/{eventId}/thumbs/{photoId}.jpg
/events/{eventId}/selfies/{sessionId}.jpg     ← auto-delete after 24h
```

### 10.3 Security Rules (high level)
- Only authenticated admins can write to `events/*`
- Public read on `events/{eventId}` (so guests can see name + cover)
- Public read on `events/{eventId}/photos/*` (so matched photos can be displayed)
- Selfies: write-only (no public read), Cloud Function deletes after match

---

## 11. AI Face Matching — How It Works

```
ADMIN UPLOAD PIPELINE
─────────────────────
Photo uploaded → Firebase Storage
   ↓
Cloud Function triggered on upload
   ↓
Send photo to Face AI API → returns face tokens
   ↓
Save faceIds in events/{eventId}/photos/{photoId}.faceIds
Save face docs in events/{eventId}/faces/{faceId}

GUEST SELFIE MATCH
──────────────────
Selfie uploaded → Firebase Storage (selfies/)
   ↓
Cloud Function → send selfie to Face AI API "search" endpoint
   ↓
Pass face set: all faces in events/{eventId}/faces/*
   ↓
API returns matching face tokens (with confidence)
   ↓
Filter by threshold (e.g. 75%)
   ↓
Lookup matching photoIds → return photo URLs to client
```

### Recommended Face AI providers (any works)
| Provider | Pros | Notes |
|---|---|---|
| **Face++** (Megvii) | Cheapest, simple REST API, "search" endpoint built in | Good for MVP |
| **Luxand.cloud** | Free tier, simple | Good for MVP |
| **AWS Rekognition** | Reliable, Indian region available | More setup |
| **Azure Face API** | Reliable | Costlier |

Freelancer picks one and documents the API key handling.

---

## 12. Routes / Pages

### Public
| Path | Page |
|---|---|
| `/` | Landing redirect — to admin login or default event |
| `/event/[id]` | Event landing (client) |
| `/event/[id]/selfie` | Upload selfie |
| `/event/[id]/results?session=xyz` | Matched photos |

### Admin (Firebase Auth required)
| Path | Page |
|---|---|
| `/admin/login` | Login |
| `/admin` | Events list |
| `/admin/event/new` | Create event |
| `/admin/event/[id]` | Upload + share |

---

## 13. Responsive Breakpoints

| Name | Width |
|---|---|
| Mobile | 320–639px |
| Tablet | 640–1023px |
| Desktop | 1024px+ |

**Mobile-first.** Client selfie flow MUST be flawless on iPhone & Android.

---

## 14. Accessibility (basic)

- WCAG 2.1 AA color contrast (gold-on-black `#C9A961` on `#0B0B0B` = 7.1:1 ✓)
- All buttons ≥ 44×44px touch target
- Keyboard navigation on admin pages
- `alt` text on every photo

---

## 15. Deliverables Checklist (final handover)

- [ ] Deployed MVP URL (Vercel)
- [ ] GitHub repo (ownership transferred)
- [ ] Firebase project (ownership transferred — added as Owner role)
- [ ] Face AI API account / key (transferred or documented)
- [ ] README with:
  - Local dev setup (`npm install`, env vars, `npm run dev`)
  - Firebase config keys (in `.env.example`)
  - Deployment steps (Vercel)
  - How to add admin user
  - How to switch Face AI provider if needed
- [ ] At least 1 working test event with sample photos
- [ ] 7-day post-launch bug-fix support

---

## 16. Out of Scope (do NOT build)

- Public marketing site (home / portfolio / about / contact)
- Admin analytics dashboard
- Branding / watermark settings
- Client (couple) review portal
- Print store / payments
- Native mobile apps
- Multi-user / team accounts
- Custom domain setup (post-MVP)

---

## 17. Logo Reference

- `/logo/logo-full-dark.svg` — primary lockup on black
- Minimum clear space: half the cap-height of "ANMOL" on all sides
- Minimum size: 120px wide on screen
- Do **not** rotate, recolor, add drop-shadow, stretch

---

## 18. Sample Button (HTML/CSS reference)

```html
<button class="btn-primary">FIND MY PHOTOS</button>

<style>
.btn-primary {
  background: linear-gradient(135deg, #E8C77A 0%, #C9A961 50%, #8C6E2B 100%);
  color: #0B0B0B;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 16px 36px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 300ms ease;
  box-shadow: 0 0 24px rgba(201,169,97,0.25);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 36px rgba(201,169,97,0.45);
}
</style>
```

---

## 19. Open Questions for the Photographer

1. Which Face AI provider do you prefer (Face++ / Luxand / AWS Rekognition)?
2. Expected events per month + average photos per event (helps freelancer estimate Firebase costs)?
3. Custom domain now or post-MVP?
4. Single admin account (just you) or multiple admins later?
5. Should matched selfies auto-delete after 24h (recommended) or stay forever?
6. Logo PNG / AI / EPS source files available? (Currently only SVG recreation in `/logo/`.)

---

*MVP scope, deliberately minimal. Brand and visual direction fixed; functional details may be refined during sprint 0 kickoff.*
