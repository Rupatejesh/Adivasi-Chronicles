# 🌿 ADIVASI CHRONICLES

### Roots • History • Rights • Ideas • Future

A colourful, cinematic, multi-page MERN Stack Personal Blog and Knowledge Platform
focused on tribal history, social reform, constitutional awareness, tribal rights,
books and ideas, ITDA and tribal development, personal writing, culture, photography,
and a curated music library.

---

# 1. PROJECT TYPE

Full Stack MERN Web Application

MERN:

- MongoDB — Database
- Express.js — Backend framework
- React.js — Frontend
- Node.js — Server runtime

Additional technologies:

- Vite
- React Router
- Axios
- Mongoose
- JWT Authentication
- bcrypt
- CSS
- REST APIs
- Git
- GitHub

## Development environment and local database

The application will use a local MongoDB Community Server installation.
MongoDB Atlas is not used for development.

- Database name: `adivasi_chronicles`
- Development URI: `mongodb://127.0.0.1:27017/adivasi_chronicles`
- MongoDB Compass will be used to inspect and manage local database data.

The frontend will use React with Vite. The backend will use Node.js and
Express.js with Mongoose, Axios, JWT authentication, bcrypt, and REST APIs.

During local development, the backend will use open CORS:

```js
app.use(cors());
```

Development CORS must not be restricted to a specific client URL.

---

# 2. PROJECT VISION

Adivasi Chronicles is not intended to be only a normal personal blog.

It will combine:

1. Personal Blog
2. Tribal History Archive
3. Tribal Heroes and Resistance History
4. Books and Ideas
5. Constitution and Tribal Rights
6. ITDA and Tribal Development Information
7. Schemes and Funds
8. Music Library
9. Photography and Gallery
10. Personal Learning and Research

The future My Journey & Interests section must be extensible for additional
interests and should initially include:

- Horses / Horse Riding
- Football
- Archery

The application should present these topics through a modern,
colourful and cinematic user experience.

---

# 3. CORE DEVELOPMENT RULE

IMPORTANT FOR AI CODING ASSISTANT:

Before generating or modifying code:

1. Read README.md and understand the project.
2. Work only on the phase requested by the user.
3. Never generate the entire project at once.
4. Never delete already working code unnecessarily.
5. Explain important files before or after creating them.
6. Keep code beginner-friendly.
7. Keep frontend and backend separated.
8. Use reusable React components.
9. Use REST API architecture.
10. Keep secrets inside .env.
11. Never expose database credentials, passwords, JWT secrets or API keys.
12. Validate user input.
13. Add proper error handling.
14. Maintain responsive design.
15. Provide exact terminal commands when packages must be installed.
16. Explain how to test every completed phase.
17. Fix errors in the current phase before proceeding.
18. Do not invent historical facts, quotations, laws, statistics or government data.
19. Historical and legal information should support sources/references.
20. Do not redistribute copyrighted commercial music.
21. Preserve all completed features while implementing new phases.

---

# 4. USER ROLES

## Visitor

A visitor can:

- View Home
- Read published articles
- Browse Tribal History
- Browse biographies
- Explore Books & Ideas
- Read Constitution and Rights information
- Explore ITDA information
- Browse Music Library
- View Gallery
- Search public content

## Registered User

A registered user can additionally:

- Login
- Like posts
- Comment on posts
- Manage their own comments
- Save favourites where implemented

## Admin / Author

Admin can:

- Create articles
- Edit articles
- Delete articles
- Save drafts
- Publish articles
- Manage categories
- Manage biographies
- Manage book entries
- Manage music metadata
- Manage gallery entries
- Moderate comments

---

# 5. MULTI-PAGE WEBSITE ARCHITECTURE

Adivasi Chronicles must be a genuine multi-page-feeling React application.

React Router will provide separate routes.

Main routes:

Home
/

Personal Blog
/blog

Tribal History
/tribal-history

Heroes & Rebels
/heroes

Books & Ideas
/books

Constitution
/constitution

Tribal Rights
/rights

ITDA
/itda

Schemes & Funds
/schemes

Music Library
/music

Gallery
/gallery

My Journey
/my-journey

About
/about

Contact
/contact

Login
/login

Register
/register

Admin Dashboard
/admin

---

# 6. DYNAMIC PAGES

Individual content must have separate URLs.

Examples:

/heroes/birsa-munda

/heroes/komaram-bheem

/heroes/peddabayalodu

/heroes/appalanarasa

/heroes/marri-kammayya

/heroes/gantam-dora

/heroes/mallu-dora


Books:

/books/gulamgiri

/books/why-i-am-an-atheist

/books/annihilation-of-caste

/books/girijana-vidhvamsam

/books/basavanna

/books/nehru-tribal-policy


Rights:

/rights/pesa

/rights/forest-rights-act

/rights/sc-st-prevention-of-atrocities-act


Constitution:

/constitution/fifth-schedule

/constitution/sixth-schedule

/constitution/article-244


Blog:

/blog/:slug

Additional dynamic route patterns:

- `/heroes/:slug`
- `/books/:slug`
- `/constitution/:slug`
- `/rights/:slug`

---

# 7. CINEMATIC WEBSITE LAUNCH

The Home page should have an optional cinematic introduction.

The intro must not make navigation difficult.

A Skip Intro option must always be available.

---

## TITLE CARD 1 — DARK FOREST

Visual concept:

Dark night.

Forest silhouette.

Subtle Eastern Ghats-inspired landscape.

Moving clouds.

Slow-moving mist.

A tiger silhouette walks calmly through the dark landscape.

The tiger gradually disappears into the mist.

The animation should feel majestic rather than violent.

Main title slowly appears:

ADIVASI CHRONICLES

Subtitle:

ROOTS • HISTORY • RIGHTS • IDEAS • FUTURE

The title should have cinematic typography and subtle light effects.

---

## TITLE CARD 2 — MIST AND FLOWERS

Transition from darkness into a colourful landscape.

White fog moves outward like curtains opening.

Flower petals move gently across the screen.

Eastern Ghats-inspired landscape becomes visible.

Display:

"Stories that survived.
Ideas that transformed society.
Rights that empower generations."

Then display:

ENTER ADIVASI CHRONICLES

After clicking Enter, open the Home page.

Requirements:

- Skip Intro
- Responsive
- Mobile friendly
- Lightweight animation
- prefers-reduced-motion accessibility
- Do not use unnecessary large video files

---

# 8. HOME PAGE

The Home page should contain:

1. Navbar
2. Hero
3. Featured Story
4. Explore Categories
5. Tribal History Preview
6. Heroes & Rebels Preview
7. Books & Ideas Preview
8. Constitution & Rights Preview
9. ITDA & Development Preview
10. Latest Blog Articles
11. Music Library Preview
12. Gallery Preview
13. About Preview
14. Footer

The Home page should guide users to separate pages instead of displaying
all information on one page.

---

# 9. VISUAL DESIGN SYSTEM

The website should be colourful but professional.

Primary visual inspiration:

- Forest
- Earth
- Eastern Ghats
- Tribal heritage
- Books
- Historical archives
- Constitutional knowledge
- Photography

Suggested category identities:

Tribal History:
Forest and earth inspired

Heroes:
Dark cinematic / heritage inspired

Books:
Warm library-inspired interface

Constitution:
Deep blue and document-inspired interface

Tribal Rights:
Green and earth inspired

ITDA:
Clean informational interface

Music:
Colourful modern player

Gallery:
Photography-focused interface

Animations must enhance the website rather than distract users.

---

## 9.1 GLOBAL VISUAL IDENTITY — PERMANENT DESIGN SYSTEM

### ADIVASI CHRONICLES

**Global visual identity:**  
**Eastern Ghats × Adivasi Heritage × Modern Editorial**

The entire application should feel unique and recognizable rather than like a
generic government portal or generic tourism template. This section is the
permanent design source of truth for future page and feature work.

#### 1. Color language

Use a grounded, natural palette:

- **Primary:** Deep Forest Green, Dark Evergreen
- **Background:** Warm Ivory, Mist White
- **Accent:** Earthy Terracotta, Turmeric Gold
- **Supporting:** Mountain Blue-Green, Natural Leaf Green

Avoid neon colors, excessive gradients, random colors, and overly corporate
blue UI.

#### 2. Visual character

The design should combine:

- Eastern Ghats atmosphere
- Adivasi heritage
- Nature
- History
- Modern editorial layouts
- Premium tourism-style photography
- Subtle cinematic presentation

Tribal-inspired geometric patterns may be used only as subtle decorative
elements. Never make tribal culture look cartoonish or stereotypical.

#### 3. Global UI language

Maintain consistency across the application in:

- Typography and heading hierarchy
- Spacing and section spacing
- Buttons
- Cards
- Border radius
- Shadows
- Image treatment
- Navigation
- Responsive behavior

Cards should feel premium and image-led, not like generic dashboard cards.

#### 4. Page personalities

Individual pages may have distinct personalities while remaining part of the
same visual family:

- **Home:** A premium visual showcase with a large photographic hero,
  high-quality ASR / Eastern Ghats imagery, destination-style image cards, and
  previews for culture, history, rights, nature, and the gallery. Home should
  be one of the most visually impressive pages.
- **Blog:** Modern editorial / magazine style.
- **Tribal History + Heroes:** Historical editorial presentation with strong
  photography.
- **Constitution + Rights:** Clean, authoritative, highly readable knowledge
  design.
- **ITDA + Schemes:** Structured informational design; do not impersonate an
  official government portal.
- **Gallery:** Photography-first immersive layout.
- **My Journey:** More personal and expressive while remaining inside the
  global theme.
- **Music:** Immersive media design while preserving the same visual identity.

#### 5. Home and Login must be different

`/` and `/login` are separate pages and must not share the same page design.

- **Home:** Rich, immersive, tourism/editorial-style experience.
- **Login:** Minimal, elegant, focused authentication experience.

Login must not look like a smaller copy of Home. Navbar and global brand
consistency may remain where appropriate.

#### 6. Photography

Future image-based sections should prioritize authentic, high-quality images
relevant to:

- ASR district
- Eastern Ghats
- Tribal culture
- Landscapes
- Historical locations
- Community life

Use consistent aspect ratios, overlays, captions where needed, and responsive
cropping. Do not use misleading images merely for decoration.

#### 7. Cinematic intro continuity

Preserve the established cinematic identity from Phase 05 and Phase 06:

**dark history / memory → mist → morning / nature / hope**

The main website should feel visually connected to this transition.

#### 8. Responsiveness and accessibility

The visual identity must work at:

- 1440px desktop
- 768px tablet
- 390px mobile

Maintain readable contrast, visible focus states, keyboard accessibility,
reduced-motion support, and no horizontal overflow.

#### 9. Future implementation rule

Before implementing a new page, check this Global Visual Identity section. Do
not randomly introduce a completely different theme on each page. Individual
pages may have their own personality while remaining part of the same ADIVASI
CHRONICLES visual family.

---

# 10. TRIBAL HISTORY HUB

The Tribal History section should support research-based articles about:

- Gondwana history
- Tribal societies
- Tribal culture
- Tribal resistance movements
- Alluri Sitarama Raju district tribal history
- Local histories
- Oral histories where clearly identified
- Historical movements
- Important locations
- Timelines

Every historical article should support:

- Title
- Summary
- Main content
- Timeline
- Location
- Related people
- Movement
- Images
- Tags
- Sources / References
- Last updated date

IMPORTANT:

Never invent historical information.

If verified information is unavailable, use a clearly marked placeholder.

---

# 11. HEROES, REBELS AND SOCIAL REFORMERS

Initial biography topics may include:

- Peddabayalodu
- Appalanarasa
- Marri Kammayya
- Gantam Dora
- Mallu Dora
- Komaram Bheem
- Birsa Munda
- B. R. Ambedkar
- Jyotirao Phule
- Bhagat Singh
- Alluri Sitarama Raju
- Basavanna
- Other relevant historical personalities

This section must remain expandable for additional people.

Reusable biography structure:

Name

Portrait

Introduction

Early Life

Historical Context

Major Events

Movement / Work

Ideas

Timeline

Legacy

Sources & References

Related Articles

Historical claims must be sourced.

---

# 12. BOOKS & IDEAS

Create a digital Books & Ideas section.

Initial topics:

- Gulamgiri
- Why I Am an Atheist
- Annihilation of Caste
- Girijana Vidhvamsam
- Basavanna: Historical Life and Social Thought
- Tribal policy ideas
- Nehru's tribal Panchsheel / tribal policy

Book/article pages should support:

- Title
- Author
- Publication context
- Overview
- Historical context
- Important themes
- Personal notes
- Related articles
- References

Do not reproduce copyrighted books in full.

---

# 13. CONSTITUTION KNOWLEDGE HUB

Topics may include:

- Constitution of India
- Fundamental Rights
- Directive Principles
- Fundamental Duties
- Scheduled Tribes
- Fifth Schedule
- Sixth Schedule
- Article 244
- Constitutional institutions
- Relevant constitutional provisions
- Important judgments where appropriate

Every legal information page should support:

- Title
- Provision / Article
- Plain-language explanation
- Historical context
- Official source
- Related topics
- Last verified date

Legal information is educational and not individual legal advice.

---

# 14. TRIBAL RIGHTS HUB

Topics:

- PESA
- Forest Rights Act
- SC/ST (Prevention of Atrocities) Act
- Land-related protections
- Gram Sabha
- Forest rights
- Community rights
- Tribal governance
- Relevant government resources

Do not invent sections, legal rights or judgments.

Official sources should be used when substantive content is added.

---

# 15. ITDA & TRIBAL DEVELOPMENT

Create an educational ITDA knowledge section.

Topics:

- What is ITDA?
- History of ITDAs
- Administrative structure
- Tribal development
- Education
- Health
- Livelihood
- Infrastructure
- Development programmes
- Funding concepts
- ASR district / Paderu-related information

Changing information such as:

- officials
- budgets
- scheme amounts
- statistics

must include:

- Source
- Relevant year / financial year
- Last verified date

The website must not impersonate an official government portal.

---

# 16. SCHEMES & FUNDS

Create a searchable section for tribal development programmes.

Potential categories:

- Education
- Scholarships
- Livelihood
- Agriculture
- Housing
- Health
- Skill Development
- Entrepreneurship
- TRICOR-related information
- Tribal development funds

Each entry should support:

- Scheme name
- Department
- Purpose
- Eligibility
- Benefits
- Application information
- Official source
- Relevant year
- Last verified date

Do not hard-code unverified current amounts.

---

# 17. PERSONAL BLOG

The Personal Blog is a core part of the application.

Features:

- Create post
- Read post
- Update post
- Delete post
- Slug URLs
- Categories
- Tags
- Search
- Author information
- Likes
- Comments
- Cover images
- Sources / References
- Draft / Published status
- Created date
- Updated date

---

# 18. MUSIC LIBRARY

Create a separate Music Library page.

Initial categories:

- Ambedkar Telugu Songs
- Tribal / Folk Music
- Kesari Songs
- Prabhas Songs
- Allu Arjun Songs
- Favourite Songs

Music Library features:

- Search
- Category filters
- Song cards
- Artist
- Cover image
- Favourite
- Playlist interface
- Play / Pause
- Previous
- Next
- Progress bar
- Volume
- Now Playing panel

IMPORTANT COPYRIGHT RULE:

Do not scrape, download or redistribute copyrighted commercial music.

Commercial music should use metadata and lawful / authorised external
listening links.

The built-in audio player should only directly play:

- Original audio owned by the project owner
- Audio with permission
- Properly licensed audio
- Public-domain audio where applicable

---

# 19. GALLERY

Gallery categories may include:

- Tribal Culture
- Landscapes
- Eastern Ghats
- Personal Photography
- Historical Places
- Events
- Social Activities

Features:

- Responsive image grid
- Category filters
- Image detail view
- Captions
- Date
- Location field where appropriate
- Photographer credit
- Image description

---

# 20. SEARCH

Global Search should search public content across:

- Blog
- Tribal History
- Biographies
- Books
- Constitution
- Rights
- ITDA
- Schemes

Search results should display:

- Title
- Content type
- Short description
- Link

Unpublished content must never appear publicly.

---

# 21. DATABASE MODELS

Initial MongoDB / Mongoose models:

User

Post

Comment

Category

Song

Biography is implemented in Phase 11F-1; the other additional models below remain future work:

Biography

BookEntry

KnowledgeArticle

GalleryItem

Scheme

---

# 22. USER MODEL

Suggested fields:

name

email

password

role

avatar

bio

createdAt

updatedAt

Passwords must be hashed.

Never store plain-text passwords.

---

# 23. POST MODEL

Implemented in Phase 11C: `server/models/Post.js`.
Fields and relationships are documented in the Phase 11C completion record below.

---

# 24. COMMENT MODEL

Implemented in Phase 11D: `server/models/Comment.js`.
Fields and relationships are documented in the Phase 11D completion record below.

---

# 25. CATEGORY MODEL

Implemented in Phase 11B: `server/models/Category.js`.
Fields: name, slug, description, type, isActive, createdAt and updatedAt.
See the Phase 11B completion record below for validation and QA details.

---

# 26. SONG MODEL

Implemented in Phase 11E: `server/models/Song.js`.
Fields and the audio policy are documented in the Phase 11E completion record below.
User-specific favourites are deferred and are not stored directly in Song.

---

# 27. BASIC AUTHENTICATION APIs

POST /api/auth/register

POST /api/auth/login

GET /api/auth/me

Authentication:

JWT

Password security:

bcrypt

---

# 28. BLOG APIs

POST /api/posts

GET /api/posts

GET /api/posts/:id

PUT /api/posts/:id

DELETE /api/posts/:id

GET /api/posts/slug/:slug

POST /api/posts/:id/like

GET /api/posts/search?q=

GET /api/posts/author/:userId

---

# 29. COMMENT APIs

POST /api/comments

GET /api/comments/post/:postId

PUT /api/comments/:id

DELETE /api/comments/:id

---

# 30. PLANNED REST API GROUPS

Future REST API groups must be planned for:

- Categories
- Biographies
- Books
- Knowledge articles
- Songs
- Gallery
- Schemes
- Global search
- Admin functionality

These groups are documented for future phases and must not be implemented
during documentation-only or earlier frontend phases.

---

# 31. SECURITY REQUIREMENTS

The application must follow these security rules:

- Hash passwords with bcrypt.
- Use JWT authentication.
- Protect authenticated routes.
- Enforce authorization for role-specific actions.
- Store secrets and credentials in environment variables.
- Validate user input.
- Use centralized error handling.
- Never commit `.env` files.
- Never return password hashes in API responses.

---

# 32. CONTENT INTEGRITY REQUIREMENTS

These are permanent project rules:

- Never invent historical facts.
- Never invent quotations.
- Never invent legal provisions.
- Never invent government statistics, budgets, or current officials.
- Historical, legal, and government articles must support sources/references.
- Changing government information must include the relevant year and last
  verified date.
- The website must not impersonate an official government portal.

---

# 33. HIGH-LEVEL ARCHITECTURE

User
↓
React Frontend
↓
Axios
↓
Express REST API
↓
Controllers
↓
Mongoose
↓
MongoDB

Response:

MongoDB
↓
Express
↓
JSON
↓
Axios
↓
React
↓
User Interface

---

# 34. PLANNED PROJECT STRUCTURE

Adivasi-Chronicles/

client/

    src/

        assets/

            images/

            audio/

            icons/

        components/

            common/

            intro/

            blog/

            music/

            history/

        pages/

            Home/

            Blog/

            TribalHistory/

            Heroes/

            Books/

            Constitution/

            Rights/

            ITDA/

            Schemes/

            Music/

            Gallery/

            About/

            Auth/

            Admin/

        services/

        context/

        hooks/

        utils/

        App.jsx

        main.jsx


server/

    config/

    models/

    controllers/

    routes/

    middleware/

    utils/

    server.js


README.md

.gitignore

---

# 35. DEVELOPMENT ROADMAP

The application must be developed phase by phase.

PHASE 01
Project foundation and environment check

PHASE 02
React + Vite frontend setup

PHASE 03
Multi-page routing architecture

PHASE 04
Global design system + Navbar + Footer

PHASE 05
Cinematic Intro — Title Card 1

PHASE 06
Cinematic Intro — Title Card 2

PHASE 07
Home page

Status: COMPLETE — Phases 07A–07H. The Home page has passed final integration,
responsive, navigation, accessibility and reduced-motion QA. Prepared local
image paths use CSS fallbacks until genuine photography is supplied; no
photographs were fabricated or downloaded.

PHASE 08
Static content pages and reusable layouts

Status: COMPLETE — static frontend scope; ready for final user visual QA
- Phase 08A — Reusable Inner Page Foundation: COMPLETE.
- Phase 08B — Tribal History Page: COMPLETE.
- Phase 08C — Heroes & Biographical Archive: COMPLETE.
- Phase 08D — Books & Ideas Page: COMPLETE.
- Phase 08E — Constitution & Rights Pages: COMPLETE.
- Phase 08F — ITDA & Schemes Pages: COMPLETE.
- Phase 08G — Music, Gallery & My Journey: COMPLETE.
- Phase 08H — Immersive Experience & Voice Guide: COMPLETE.
- Final Blog, About and Contact static pages: COMPLETE (automated QA passed).

Phase 08G provides static listening categories and a disabled future-player
preview, a filterable gallery of clearly labelled photographic placeholders,
and personal-interest sections with an empty reusable journal timeline.
No music metadata, documentary captions, personal events or media were invented.
Future genuine gallery assets may use `/images/gallery/landscapes/`, `culture/`,
`history/`, `events/` and `personal/`; absent or failed images retain CSS fallbacks.
Playback, uploads, backend integration and authentication remain unimplemented.

Phase 08G passed lint, production build and browser checks at 1440px, 768px and
390px: related navigation, breadcrumbs, mobile navigation, browser Back,
keyboard focus/activation, reduced motion, image fallback and overflow checks.
Home, ITDA and Schemes were regression-checked; locked source files are unchanged.
Existing Home future-image references and the unrelated favicon 404 remain.
Ready for user visual QA. Phase 08 remains IN PROGRESS; no subsequent phase
has been started by Phase 08G work.

Phase 08F targeted frontend fixes passed lint, production build and browser checks
at 1440px, 768px and 390px, including navigation, browser Back, keyboard focus,
reduced motion and image fallbacks. Verified content remains pending research;
no government records or photography were fabricated. Ready for user visual QA.
The existing Home future-image build warning remains unchanged.

PHASE 09
Node + Express backend
Status: COMPLETE / LOCKED

PHASE 10A
Local MongoDB + Mongoose connection
Status: COMPLETE / LOCKED

PHASE 10B
Local database configuration & final verification
Status: COMPLETE / LOCKED

PHASE 11
Mongoose models
Status: IN PROGRESS — Phases 11A–11E COMPLETE / LOCKED; Phase 11F-1 COMPLETE; Phase 11F-2 NOT STARTED

PHASE 12
Authentication
Status: NOT STARTED

PHASE 13
Blog CRUD REST APIs

PHASE 14
React Blog UI + Backend integration

PHASE 15
Comments + Likes

PHASE 16
Tribal History and Biography system

PHASE 17
Books & Ideas

PHASE 18
Constitution + Rights

PHASE 19
ITDA + Schemes/Funds

PHASE 20
Music Library

PHASE 21
Gallery

PHASE 22
Global Search

PHASE 23
Admin Dashboard

PHASE 24
Responsive design + Accessibility

PHASE 25
Security + Error Handling

PHASE 26
Testing

PHASE 27
Git + GitHub

PHASE 28
Deployment

---

# 36. DEVELOPMENT PRINCIPLE

DO NOT SKIP PHASES.

After every phase:

1. Run the project.
2. Check the browser.
3. Check the terminal for errors.
4. Test the new functionality.
5. Fix errors.
6. Save files.
7. Only then proceed to the next phase.

---

# 37. CURRENT STATUS

Project folder created:

Adivasi-Chronicles

README.md created.

Current Development Phase:

PHASE 11F-1 — BIOGRAPHY MODEL FOUNDATION ONLY

Status:

Phases 01–07 and the Phase 08 static frontend scope are complete.
Phase 08 is ready for final user visual QA, including the intro and Blog/About/Contact.
Phase 09 — COMPLETE / LOCKED. Phase 10A — COMPLETE / LOCKED.
Phase 10B — COMPLETE / LOCKED. Phase 11A — COMPLETE / LOCKED.
Phase 11B — COMPLETE / LOCKED.
Phase 11C — COMPLETE / LOCKED.
Phase 11D — COMPLETE / LOCKED.
Phase 11E — COMPLETE / LOCKED.
Phase 11F-1 — COMPLETE; ready for user QA.
Phase 11F-2 — NOT STARTED. Phase 12 — NOT STARTED.
Earlier phase entries below are historical and superseded by this status.

> The following Phase 08H entries record earlier iterations. The final Phase 08 completion record below supersedes their timing, asset and IN PROGRESS notes.

## Phase 08H — Immersive Experience & Voice Guide

Status: COMPLETE. Phase 08 remains IN PROGRESS; the roadmap does not establish
08H as its final requirement. Phase 09 has not started.

- `client/src/components/voice/VoiceGuide.jsx` provides browser SpeechSynthesis
  with explicit **Enable Voice Guide**, Mute/Unmute, Replay, Stop and live status.
  Every fresh document starts silent. Activation persists during frontend
  navigation; mute preference uses sessionStorage when available. Stop disables
  subsequent automatic narration until another explicit activation.
- IntersectionObserver watches major visible headings, waits 650ms, and narrates
  each introduction once per mounted application. New speech cancels old speech;
  navigation, mute, stop and hidden tabs cancel speech. No card-by-card narration.
  Integration covers the entrance, Home, Tribal History, Heroes, Books,
  Constitution, Rights, ITDA, Schemes, Music, Gallery and My Journey.
- Narration uses short visible introductions, falling back to visible headings.
  `data-voice-en` supports reviewed editorial overrides. Language codes reserve
  English (`en-IN`) and Telugu (`te-IN`); Telugu translations and a language
  selector are future work, not implemented functionality.
- Unsupported speech shows a readable fallback. Speech errors show a status
  message. Without IntersectionObserver, manual replay uses the first introduction.
  The ordinary website remains usable with voice off or unsupported.
- The entrance now moves from midnight forest green through mist to warm dawn,
  using decorative CSS ridges inspired by the Eastern Ghats. Reduced motion
  shows a still dawn. Enter and Skip preserve the current route; entrance does
  not time out or move keyboard focus automatically.
- `/images/intro/eastern-ghats-cover.jpg` is a future local target only. No genuine
  landscape photograph was present. The verified flag stays false until a genuine
  user-provided photograph is reviewed. Failed images retain the CSS fallback.
- `client/src/data/biographies.js` centralizes seven documented portrait previews, including Basavanna.
  Portraits require a local `/images/heroes/` path, availability, verified status
  and provenance. No portrait files were present; typographic placeholders remain.
  Failed portrait loads remove the image. Existing `/heroes/:slug` routes remain
  available, with graceful pending entries for subjects without preview records.
- `VerifiedQuotation.jsx` supports `quoteText`, `quoteAuthor`, `quoteSource`,
  optional `quoteSourceUrl` and `verificationStatus`. It displays quotations only
  after verified status, matching author and nonempty wording/reference; this
  gate records editorial review and does not itself prove source accuracy.
  No quotations were added. Pending entries say “Quotation pending source verification.”
  Sources use semantic citations and safe HTTP(S) links when provided.

### Validation and user QA

`npm run lint` passes without warnings. `npm run build` passes; the pre-existing
Home `/images/home/asr-eastern-ghats-hero.jpg` warning remains.

The dependency-free headless Edge/CDP script `client/qa/phase08h.mjs` checks the
production build at 1440px, 768px and 390px. It exercises all eleven integrated
page routes plus biography detail, horizontal overflow, visible broken-image
fallbacks, Navbar/Footer presence, activation/mute/unmute/replay/stop, default
silence, no repeated narration on slight scrolling, preserved routes, browser
Back, keyboard Enter on Skip, reduced-motion dawn, unsupported speech and
uncaught browser exceptions. Results and representative screenshots are under
`client/qa/`. Existing missing background asset requests are not treated as new
JavaScript exceptions. No packages were installed.

Run from `client/`:

```sh
npm run lint
npm run build
node qa/phase08h.mjs
```

The QA runner uses the installed Windows Edge executable, local port 5188 for
preview and port 9333 for browser debugging. Speech is mocked to verify lifecycle
behavior: audible OS voices, assistive-technology announcements, visual taste,
all keyboard paths and other browsers still require manual user QA. Enable voice,
scroll through introductions, try Mute/Unmute and Replay, then Stop and confirm
silence. Test Enter/Skip and a direct biography URL with reduced motion enabled.

Still required from the user: a genuine Eastern Ghats cover and verified portraits
for existing subjects, with provenance/usage permission and accurate credits;
reliable exact quotation references before any quotations can be published.
No historical imagery, quotations, audio or personal claims were fabricated.

### Phase 08H final media polish — COMPLETE

The Three Generations concept expresses **Memory → Present → Future** through
three small symbolic figures: a grandmother on the darker side and a girl and
boy toward the dawn. Plain CSS silhouettes avoid stereotypical costume or
ornament. A visible caption identifies them as symbolic, not real people or
historical portraits. The landscape remains dominant. Three short editorial
lines introduce stories, knowledge and the future; no extra timed sequence or
waiting period was added. Reduced-motion dawn and route-preserving Skip/Enter remain.

Optional local targets:

- `/images/intro/eastern-ghats-cover.jpg` — genuine Eastern Ghats photograph.
- `/images/intro/tribal-grandmother.png` — approved symbolic grandmother artwork.
- `/images/intro/tribal-girl.png` — approved symbolic girl artwork.
- `/images/intro/tribal-boy.png` — approved symbolic boy artwork.

None of these assets was present during inspection. No imagery was downloaded,
hotlinked or generated. `src/data/introMedia.js` records the optional character
paths, approval flags and future alt text. Approved artwork replaces the CSS
silhouette only after loading successfully; failure retains the fallback.
Decorative silhouettes are hidden from screen readers, with visible role labels
and a figure caption providing equivalent context. Meaningful approved images
must receive useful alt text. Any genuine photographs later supplied require
provenance, usage permission and a caption appropriate to the actual media;
never describe illustrative characters as documentary Adivasi individuals.
The cover retains its existing verification gate and CSS landscape fallback.

Heroes retains its existing portrait/quotation presentation. Basavanna now uses
the same pending record structure and `/images/heroes/basavanna.jpg` target as
the six other documented subjects. All portraits still require verified local
media and provenance; quotations still require exact verified wording, matching
author and a reliable source. Pending quotations remain explicitly labelled.

The approved compact Voice Guide component and styles were not modified. Its
existing intro hook now reads the three visible editorial sentences only after
explicit activation. Voice remains OFF on initial load, with unchanged mute,
replay, stop, cancellation and section detection.

Final checks: lint passed without warnings; production build passed with the
existing missing Home hero image warning. Headless Edge regression checks passed
at 1440px, 768px and 390px, covering the three silhouettes without image files,
Home and Heroes, direct biography entrance, default silence, voice controls,
Skip/route preservation, browser Back, dynamic biography routes, Navbar/Footer,
no horizontal overflow or visible broken images, pending quotations, keyboard
Skip and reduced motion. Desktop/mobile intro screenshots were reviewed.
Speech is mocked in automation; actual voice quality and assistive-technology
behavior remain manual QA. Results/screenshots are in `client/qa/`.

Phase 08H remains COMPLETE; Phase 08 remains IN PROGRESS. Phase 09 has not started.

### Phase 08H final user-asset intro integration — COMPLETE

This final integration supersedes the temporary Three Generations intro described
above. The original silhouette components remain unused; no figures are placed
over the supplied media. Locked pages, Heroes, Navbar/Footer and compact Voice
Guide styling were not changed. Phase 08 remains IN PROGRESS; Phase 09 is NOT STARTED.

Exact current user-selected local assets:

- `/images/adivasi-jeevana-vidhvamsam.png` — opening photograph.
- `/images/asr-launch.png` — main launch composition.

Directory inspection found PNG filenames for both assets, rather than the
JPG/PNG pair described in the request. The launch file initially appeared as
`asr-launch.png.png` and changed to `asr-launch.png` during integration; the
implementation uses the current exact filename. No original was renamed,
deleted, replaced, generated or edited by this work.

The sequence follows **People → Memory → Land → Future**: forest-green and soft
light reveal the photograph with “Stories carried across generations” and
“Roots • Memory • People”; mist cross-fades into the supplied launch composition
after about 4.2 seconds of the opening asset loading (or failing). The artwork
remains until the visitor enters or skips. A real **ENTER THE ARCHIVE** button
uses a short warm-light fade before revealing the existing route without a
browser reload. **Skip Intro** immediately cancels intro speech and exits.
No identities, dates, documentary claims or new historical facts were assigned
to the people shown.

The launch image uses object-fit cover with its natural proportions. Desktop
preserves the broad composition; tablet/mobile use a central crop that retains
the main title. A subdued blurred extension uses the same cached image URL.
The small HTML title, tagline and CTA sit below the artwork. Embedded logos and
lettering remain part of the original flattened artwork; they are not extracted
or adopted as site branding. **ADIVASI CHRONICLES is an independent editorial
archive, not an official government portal.** Embedded statistics and visual
claims in supplied artwork are not independently verified archive content.

Both assets have load/error states. Failed photographs retain the forest-green
opening; failed launch artwork uses a CSS/text fallback. Broken image elements
are removed. Reduced motion uses short cross-fades with no animated mist or
parallax; the opening lasts about 2.2 seconds. Voice Guide remains opt-in and
unchanged in design. The existing heading hook offers two neutral sentences,
with existing replay/mute/stop controls and speech cancellation; there is no
continuous narration.

Validation: `npm run lint` passed without warnings. `npm run build` passed with
the pre-existing missing Home hero image warning. `node qa/user-assets.mjs`
(from `client/`, after build) checks the final intro against a local production
preview using installed headless Edge. Checks passed on `/`, `/heroes` and
`/itda` at 1440px, 768px and 390px: exact media loads and order, absent silhouettes,
default silence, enabled speech, exit cancellation, Enter/Skip, preserved routes,
Navbar/Footer presence, browser Back, reduced motion, keyboard Skip, blocked-image
fallback and horizontal overflow. No uncaught JavaScript exceptions were found.
Responsive screenshots and `user-assets-results.json` are under `client/qa/`.
Actual OS voice sound and screen-reader announcements remain manual QA; speech
is mocked in automated checks. Earlier `phase08h.mjs` results describe the prior
silhouette entrance; use `user-assets.mjs` for this final media sequence.

### Phase 08H cinematic launch effects polish

The supplied photograph → mist → launch artwork sequence now includes a 1.9-second
forest-green split curtain with muted gold edges and centre mist/light. Sixteen
CSS petals begin once the curtain is mostly open; ten small gold/orange embers
briefly rise at the lower edges. These are one-time decorative effects, not fire
in the depicted landscape. Mobile shows eight petals and five embers. No media
files, Voice Guide design, page designs, narration content or routes were changed.

Enter the Archive appears after 2.25 seconds of the reveal, once the curtain and
ember burst settle, with a restrained fade/upward motion. Effect elements are
removed after 4.6 seconds or immediately on intro exit; all decorative layers
ignore pointer input. Reduced motion renders no curtain, petals or embers and
retains the simple cross-fade. No sound, packages or generated assets were added.

`node qa/launch-effects.mjs` (from `client/`, after build) passed at 1440px, 768px
and 390px: delayed CTA, silence before opt-in, Enter, Skip during the curtain,
route preservation, timer/effect cleanup, reduced motion and no horizontal
overflow or uncaught JavaScript exceptions. Desktop/mobile curtain screenshots
were reviewed. Speech is mocked for regression checks; audible QA remains manual.
Use this effects-aware runner for reveal timing; the earlier user-assets runner
predates the delayed CTA. Lint passed without warnings and build passed with only
the pre-existing missing Home hero image warning. Phase 08H remains COMPLETE;
Phase 08 remains IN PROGRESS and Phase 09 remains NOT STARTED.

## Phase 08 final completion — static frontend COMPLETE

Ready for final user visual QA. Phase 09/backend is NOT STARTED. No packages were
installed. Previously locked pages, Navbar/Footer and Login/Register/Admin were
not redesigned. This record supersedes earlier intro iterations above.

### Final entrance and local assets

Roots / People → Eastern Ghats → Alluri Sitarama Raju → ASR District artwork
→ ITDA Paderu → curtain / petals / controlled golden embers → final launch
composition → Enter the Archive. A normal run reaches the launch artwork in
about 12 seconds after the opening image resolves; Enter appears after its
2.25-second reveal. Skip exits immediately at every stage and preserves the
requested React Router path. All stage/effect timers clean up on exit.

Exact discovered image paths (original files were not modified):

- `/images/adivasi-jeevana-vidhvamsam.png`: full-viewport opening photograph.
- `/images/image2.jpg.png`: newly supplied Eastern Ghats/project composition,
  used for the district journey and labelled project artwork on Blog/About.
- `/images/image3.jpg.png`: newly supplied district/map composition containing
  the embedded “11 Mandals” heading, used as a full-viewport scene.
- `/images/asr-launch.png`: full-viewport final launch artwork.

Intro scene containers fill the viewport. Landscape screens use a central cover
crop; portrait screens preserve the wide compositions and embedded titles with
a contain-style foreground over an edge-to-edge blurred extension of the same
image. This deliberate portrait adaptation avoids distortion and destructive
cropping; embedded small print is naturally limited by phone screen size.
The opening photograph uses a restrained zoom, disabled for reduced motion.

No separate approved Alluri portrait or ITDA logo was present. The Alluri moment
therefore uses golden typography and the requested caption “A Legacy of
Resistance • Courage • Freedom”, with “The Eastern Ghats • Manyam”. It is not
an attributed quotation. The separate ITDA Paderu moment uses “Integrated Tribal
Development Agency” and the thematic line “Community • Education • Health •
Livelihoods • Development”. It explicitly identifies this as an independent
educational and cultural project, not an official government website.

Embedded people, logos, place names, maps and figures in supplied compositions
remain flattened artwork, not verified documentary or government evidence.
No identities, historical quotations or government statistics were invented or
extracted as independent site claims. Nothing was downloaded or generated.
Future genuine place-photo slots and additional place names are prepared in
`src/data/journeyPlaces.js`; `public/images/places/README.md` explains approval.
No individual place photographs are currently supplied.

`IntroArtwork.jsx` and `ProjectArtwork.jsx` provide local-image loading/error
states, meaningful alt text and CSS/text fallbacks. Broken image elements are
removed. Decorative same-image background extensions are hidden from screen
readers. Curtains, petals and embers remain pointer-transparent and transient.
Reduced motion uses brief cross-fades, no moving curtain/particles or image zoom.
The compact Voice Guide is unchanged, remains OFF initially, and offers short
neutral opt-in narration rather than narrating each place. Enter and Skip cancel
intro speech. Actual audible voices remain user QA.

### Blog, About and Contact

- `/blog`: forest/ivory journal hero, featured-story placeholder, three clearly
  unpublished recent-story slots, category links to existing archives, disabled
  search and tags placeholder text, references-ready presentation and archive
  CTA. `src/data/journal.js` includes author, date, slug, tags and references
  fields without fake articles or attribution. `/blog/:slug` remains the existing
  dynamic-route scaffold for later integration.
- `/about`: project purpose, people/land/memory, history/heroes, rights, books,
  Eastern Ghats, development, editorial principles, integrity, verification and
  future vision. The page identifies the independent nature of the project.
- `/contact`: labelled Name, Email, Subject and Message fields; all seven requested
  subject choices; responsible-contribution guidance; explicit frontend-preview
  notice. Submit is disabled and form submission is prevented. No messages are
  transmitted or saved, no fake success response or invented contact address.

Shared new styles are scoped to `.editorial-page` in `EditorialPages.css`; the
existing shared foundation and locked page styles were not changed.

### Final validation

`npm run lint`: PASS, no warnings. `npm run build`: PASS. The pre-existing missing
Home `/images/home/asr-eastern-ghats-hero.jpg` build warning remains.

From `client/`, after building, run `node qa/final08.mjs` using the installed
Windows Edge browser. It uses local preview port 5188 and debugging port 9333.
Results are in `qa/final08-results.json` and screenshots in `qa/final08-*.png`.

Automated checks passed at 1440px, 768px and 390px for:

- Full entrance stage order, viewport sizing, four local images, Alluri and ITDA
  captions, curtain/particles and delayed Enter.
- Home, Blog, About, Contact, Heroes, ITDA and `/blog/future-entry`, with route
  preservation, Navbar/Footer presence and no horizontal overflow.
- Keyboard Skip at every stage, contact labels and visible focus using Tab,
  disabled contact delivery, browser Back and reduced motion.
- Default silence, explicit voice activation and Enter speech cancellation
  (SpeechSynthesis mocked; actual audio and screen-reader announcements need
  manual testing).
- Blocked-image fallback for the new intro/editorial images, no broken image
  elements, and no uncaught JavaScript exceptions introduced by the task.

Desktop and mobile screenshots were inspected. Existing missing Home/background
assets and legacy favicon requests are outside this task. The earlier QA scripts
capture prior intro timings; use `final08.mjs` for the current sequence.

Remaining intentionally deferred work: researched Blog articles and metadata,
verified portrait/quotation sources, optional genuine place photography and
approved standalone Alluri/ITDA assets, plus contact delivery and all backend,
authentication and publishing behavior in later phases. These are not represented
as functioning Phase 08 features. Phase 09 has not started.

### Phase 08H image asset display update

Exact currently used intro paths:

- `/images/adivasi-jeevana-vidhvamsam.png` — opening photograph (unchanged).
- `/images/image2.jpg.png` — Eastern Ghats journey; the user replaced this file's
  content in place with the newer Alluri/people/ITDA composition.
- `/images/image3.jpg.png` — district map and mandal-card scene. This reference
  remains unchanged: no distinct resized version of this composition could be
  identified from the current files. Replacement awaits the exact filename.
- `/images/image4.jpg.png` — new rights/community/ITDA composition, shown once
  after ITDA Paderu and before the final curtain reveal.
- `/images/asr-launch.png` — existing final launch composition (unchanged).

All information-heavy intro artwork now uses centered `object-fit: contain`
with width and height 100% over a full-screen, softly blurred/darkened extension
of the same image. This supersedes the earlier desktop cover crop. The complete
image bounds remain visible at 1440px, 768px and 390px without distortion or
horizontal overflow. Small embedded text naturally requires zoom on phones;
this update preserves it rather than claiming desktop-size legibility.

No original image files were modified. The duplicate newly supplied composition
was not added as a second scene. The existing real HTML Enter button, Skip,
opt-in Voice Guide and reduced-motion behavior remain intact. Lint and build
passed; the existing Home image warning remains. `node qa/asset-update.mjs`
checks contained district/new/final artwork, image loading, overflow, Enter/Skip,
route preservation, default silence, opt-in voice and reduced motion. Checks
passed at all three widths; speech was mocked. Phase 09 remains NOT STARTED.

## Login & Register UI foundation — COMPLETE

Login UI foundation complete. Register UI foundation complete.
Authentication/backend NOT implemented yet; JWT/authentication is not complete.
Phase 09 has NOT STARTED. No packages were installed.

- `/login`: full-width 57/43 desktop split with a decorative Eastern Ghats inspired
  CSS landscape, sunrise, layered hills and slow mist; quiet ivory login panel.
- `/register`: approved local `/images/adivasi-jeevana-vidhvamsam.png` community
  photograph, warm editorial typography and a secondary Rights & Knowledge panel.
  No identities or location claims are assigned to the pictured people.
- Inspected `public/images`: the community photograph, `asr-launch.png` and
  `image2.jpg.png` through `image5.jpg.png` are present. The latter compositions
  are project artwork, not standalone genuine landscape photographs. No suitable
  genuine landscape exists in the documented place/intro slots; Login uses CSS.
  Original assets are unchanged. Failed Register images are removed and expose
  the landscape illustration with an updated caption.
- Rights labels only: Fifth Schedule, PESA, Forest Rights, Land Protections,
  SC/ST Legal Protections and Gram Sabha. No legal provisions or claims added.
- Reusable `src/components/auth/AuthPage.jsx` and scoped `AuthPage.css` serve the
  existing `Login.jsx` and `Register.jsx` routes. Required fields, email format,
  nonblank name, password matching (including edits to the original password),
  password visibility and a required Terms-preview acknowledgement are included.
  Remember me is UI-only; password recovery explains its pending state.
- Valid submit displays “Authentication will be connected in the upcoming backend
  phase.” No request, storage, user creation, token or success redirect occurs.
- Real labels, autocomplete, keyboard controls, visible gold focus, image alt text,
  live status/error messages and reduced-motion mist support are provided.
- At 390px, a short visual leads into the form; the rights panel follows it.
  All fields remain available. Tablet uses a compressed split.

Validation: `npm run lint` PASS; `npm run build` PASS. The existing missing Home
`/images/home/asr-eastern-ghats-hero.jpg` build warning remains.

Run from `client/` after building:

```sh
node qa/auth.mjs
```

The dependency-free installed-Edge/CDP runner uses preview port 5188 and browser
port 9333. Results: `qa/auth-results.json`; screenshots: `qa/auth-*.png`.
At 1440px, 768px and 390px, checks passed for both routes, cross-navigation,
browser Back, required fields, email validation, password visibility/matching,
Terms preview, honest submit messages, keyboard focus, labelled inputs, loaded
community imagery and no horizontal overflow. Blocked-image fallback and reduced
motion passed; no uncaught JavaScript exceptions occurred. Desktop and mobile
screenshots were inspected. Screen-reader announcements, other browsers and final
visual approval remain manual QA.

CinematicIntro, LaunchEffects, VoiceGuide, all completed content pages, Navbar,
Footer, routing and `/admin` source files were not modified.

### Auth form green visual polish

The Login/Register form panels now use a subtle deep forest gradient, warm ivory
text, dark green inputs, antique-gold buttons/links and gold focus outlines.
Validation errors use a light warm accent for readability. Existing forest and
cream tokens are reused; the new accent tokens are local to the form panel.
This supersedes the ivory form-panel styling described above. Landscape/community
imagery, rights panels, layout, form behavior and all other pages are unchanged.

Existing browser QA passed for both routes at 1440px, 768px and 390px, including
no horizontal overflow, password controls, validation and keyboard focus.
Desktop/tablet/mobile screenshots were reviewed. Build passed with the existing
Home image warning. Lint exited successfully with the pre-existing unused
`waitFor` warning in `qa/auth.mjs`. No packages or backend work were added.

## Phase 09 — Express backend foundation — COMPLETE / LOCKED

The implementation uses ES modules, matching the frontend convention. Frontend
source files remain unchanged. Phase 10A now provides the MongoDB connection.
Authentication, JWT and frontend API integration are not implemented. Phase 11A adds only the User model.

```text
server/
  src/
    config/db.js
    controllers/healthController.js
    middleware/errorHandler.js
    middleware/notFound.js
    routes/healthRoutes.js
    utils/.gitkeep
    app.js
  test/app.test.js
  .env                 (local, ignored)
  .env.example
  .gitignore
  package.json
  package-lock.json
  server.js
```

`src/app.js` configures Express and routes without opening a port, so it can be
imported for tests. The health route delegates to its controller. The config/db.js
module connects MongoDB; utils reserves space for later work. Phase 11A adds server/models/User.js.
`server.js` loads dotenv, validates PORT, awaits MongoDB, starts HTTP and handles shutdown signals.

Runtime dependencies: `express`, `cors`, `dotenv`, `mongoose`. Development dependency:
`nodemon`. Tests use Node's built-in test runner and fetch; no test packages.

Installation commands (from the project root):

```sh
cd server
npm install express cors dotenv
npm install mongoose
npm install --save-dev nodemon
```

For subsequent installs using the committed lockfile, run `npm ci` in `server/`.
Copy `.env.example` to `.env` if needed. Both initial files contain only safe defaults:

```dotenv
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/adivasi_chronicles
```

`.env` and `.env.*` are ignored, except `.env.example`. No credentials or fake
secrets are included. Existing environment variables take priority over dotenv.

Run from `server/`:

```sh
npm run dev
# Or run without the development watcher:
npm start
# Automated API checks:
npm test
```

The default URL is `http://localhost:5000`. Press Ctrl+C to stop the server.

| Request | Status | JSON |
| --- | --- | --- |
| `GET /` | 200 | `{"success":true,"message":"Adivasi Chronicles API"}` |
| `GET /api/health` | 200 | `{"success":true,"message":"Adivasi Chronicles API is running"}` |
| `GET /api/not-found` | 404 | `{"success":false,"message":"Route not found"}` |

Middleware order is `cors()`, `express.json()`,
`express.urlencoded({ extended: true })`, routes, JSON 404, then the centralized
four-argument error handler. Development CORS is open with `app.use(cors());`:
there is no client-origin whitelist. This is the requested local-development policy.

Malformed JSON returns 400 with `Invalid JSON request body`. Unexpected failures
return 500 with `Internal server error`. Responses never include exception stacks,
internal exception messages or submitted request bodies, including in production.
The test suite checks production errors through a test-only Express application;
no fake error endpoint is added to the real API.

Manual checks: open each URL above, confirm JSON and inspect the 404 HTTP status.
The automated checks also cover an arbitrary-origin CORS preflight and malformed
JSON. From `client/`, run `npm run lint` and `npm run build` for frontend safety.

## Phase 10A — Local MongoDB + Mongoose connection — COMPLETE / LOCKED

Phase 09 and Phase 10A are COMPLETE / LOCKED. Phase 10B verification is recorded
below. Phase 11 is NOT STARTED.
No models, schemas, authentication, JWT, bcrypt or frontend integration were added.

Mongoose 9.10.3 is the only new direct dependency, installed from `server/` with
`npm install mongoose`. Its required transitive dependencies are recorded in the
lockfile. Installation audit reported zero vulnerabilities.

### Local database architecture

The API uses local MongoDB Community Server, database `adivasi_chronicles`.
`server/.env` and the safe `server/.env.example` define `PORT=5000`,
`NODE_ENV=development` and
`MONGODB_URI=mongodb://127.0.0.1:27017/adivasi_chronicles`.
No Atlas configuration is used. Keep the real `.env` out of version control.

`server/src/config/db.js` reads MONGODB_URI when `connectDatabase()` is called and
awaits `mongoose.connect()`. Startup order: load environment, validate PORT,
connect MongoDB, then start Express. Initial connection failure times out after
five seconds and exits with code 1 without starting HTTP. Logs omit driver errors
and connection strings. Connected/disconnected/error listeners register once at
module scope per process, including fresh nodemon processes. Shutdown closes HTTP
and disconnects Mongoose with a bounded deadline. No custom retry system is added.
The health JSON contract and `app.use(cors())` remain unchanged.

Reference: [Mongoose connection documentation](https://mongoosejs.com/docs/connections.html).

### Verification and MongoDB Compass

1. Confirm the Windows service is running: `Get-Service MongoDB` in PowerShell.
2. From `server/`, run `npm run dev`.
3. Confirm `MongoDB connected` appears before `Adivasi Chronicles API running on port 5000`.
4. Open `http://localhost:5000/api/health`; check the root and 404 routes listed above.
5. Open Compass and connect to `mongodb://127.0.0.1:27017`.

The `adivasi_chronicles` database may not appear in Compass until its first stored
document. Phase 10A creates no models, documents or dummy collections. Do not
create fake data merely to make the database visible.

Verified locally: MongoDB service running; `npm run dev` connected before
listening on port 5000; live root and health returned their existing 200 JSON;
unknown API route returned its existing 404 JSON. `npm test` passed both tests,
including open CORS, malformed JSON and safe production errors. A read-only
Mongoose check confirmed connected state, the database name and zero collections.
An isolated child process using a temporary non-MongoDB local port exited 1 with
understandable connection errors, no API readiness message and no leaked URI.
That failure test did not change `.env` or the MongoDB service configuration.
The development process was stopped after verification.

Compass GUI inspection was subsequently confirmed by the user in Phase 10B below.
No `client/` files were modified.
`server/.gitignore` excludes `.env` and `.env.*`, except `.env.example`.
This workspace has no Git metadata, so tracked-file status cannot be checked;
never add the real `.env` when initializing version control.

## Phase 10B — Local database configuration & final verification — COMPLETE / LOCKED

Phase 09 — COMPLETE / LOCKED.
Phase 10A — COMPLETE / LOCKED.
Phase 10B — COMPLETE / LOCKED.
Phase 11 — NOT STARTED.

Verified on 2026-09-30: `server/.env`, `server/.env.example` and the effective
environment use `MONGODB_URI=mongodb://127.0.0.1:27017/adivasi_chronicles`.
The URI is read from the environment in `src/config/db.js`, not hardcoded in
application source. Both environment files contain only the safe local defaults
documented above, without credentials or secrets. Normal and failure logs omit
database URIs. No Atlas configuration was introduced.

MongoDB Community Server is running. A read-only Mongoose connection confirmed
the database name `adivasi_chronicles`, connected state and zero collections.
No models, authentication, bcrypt, JWT, documents or collections were created.

Startup verification passed: load environment → connect to MongoDB → start
Express. The existing API on port 5000 returned the expected 200 JSON for `GET /`
and `GET /api/health`, and the expected JSON 404 for an unknown API route.
`app.use(cors());` remains unchanged; responses allow origin `*`.
`npm test` passed both existing tests, including CORS preflight, malformed JSON
and safe production errors.

An isolated server on a temporary free port confirmed connection-before-listen
ordering and graceful database disconnect. A second startup on occupied port
5000 exited with code 1, a safe port-conflict message and database disconnect.
An isolated connection-failure check exited with code 1 without reporting API
startup. Captured logs exposed no database URI. Temporary verification processes
were stopped; the existing port-5000 API and MongoDB service were left running.

MongoDB Compass manual verification:
SUCCESS — connected to 127.0.0.1:27017 (confirmed by the user).

`adivasi_chronicles` may remain invisible in Compass while empty, until the first
real application document is written to a collection in a later phase. Do not
create dummy documents or fake collections merely to make it visible.

`server/.gitignore` excludes `.env` and `.env.*` while allowing `.env.example`.
This project folder has no Git metadata, so Git tracking status cannot yet be
independently verified. Git was not initialized.

Only the root README was changed for this audit. Backend code, dependencies and
`client/` were unchanged. Phase 11 has not started; models and authentication
remain unimplemented.

## Phase 11A — User model foundation — COMPLETE / LOCKED

Phase 09 — COMPLETE / LOCKED.
Phase 10A — COMPLETE / LOCKED.
Phase 10B — COMPLETE / LOCKED.
Phase 11A — COMPLETE / LOCKED.
Phase 11B — NOT STARTED.
Phase 12 — NOT STARTED.

`server/models/User.js` defines the User model using the existing ES module
convention and reuses an already compiled model when present.

| Field | Definition |
| --- | --- |
| name | Required String, trimmed |
| email | Required String, trimmed, lowercase, unique index declaration |
| password | Required String, excluded from normal queries with `select: false` |
| role | String: user, author or admin; defaults to user |
| avatar | String; defaults to empty string |
| bio | String; defaults to empty string; maximum 500 characters |
| isActive | Boolean; defaults to true |
| createdAt / updatedAt | Date fields managed by Mongoose timestamps |

The unique email option declares a database index, not a validation rule;
index creation and duplicate-email handling must be verified when real writes
are introduced. `select: false` controls normal query projection; it does not
remove passwords from newly constructed documents or explicitly selected queries.
Future API responses must deliberately omit passwords. No passwords are logged.
Hashing, JWT, registration/login APIs, authorization, password reset, email
verification and OAuth remain Phase 12 work. No real users may be saved until
password hashing is implemented. This phase adds no application import of the
model, no routes, dependencies or changes to database connection behavior.

### Verification and user QA

Run from `server/` with the local MongoDB service running:

```sh
npm test
node qa/user-model.mjs
npm run dev
```

If the API already runs on port 5000, use that instance for manual URL checks
instead of starting a second process on the same port.

- `server/test/user.test.js`: four in-memory model tests cover normalization,
  defaults, required fields, all allowed roles, invalid roles, bio boundaries,
  timestamp configuration, unique index declaration and repeated compilation.
- `server/qa/user-model.mjs`: connects through the existing database helper,
  disables automatic collection/index creation only inside this QA process,
  and executes a read-only User query with an impossible identifier filter.
  It verifies that the query sent to MongoDB excludes password and that the
  collection list is unchanged. No user data is retrieved or printed.
- Verified on 2026-09-30: all six backend tests passed without warnings, including
  existing API, open CORS, malformed JSON and safe production error checks.
  The read-only User query passed against local `adivasi_chronicles`.
- A fresh server on a temporary port connected to MongoDB before listening.
  Both it and the existing port-5000 API returned the exact expected JSON for
  `GET /` (200), `GET /api/health` (200), and `GET /api/not-found` (404), with
  open CORS. The temporary process was stopped; the existing API was preserved.

For manual QA, open the three port-5000 URLs documented in Phase 09 and confirm
those status codes and JSON. `app.use(cors());` and all Phase 09/10 source files
remain unchanged. No frontend files or assets were modified.

No test documents were inserted, so no permanent test data or cleanup is needed.
The verification script creates no collections or indexes. In Compass, connect
to `mongodb://127.0.0.1:27017` and refresh after the first real user is created in
a future phase: the `adivasi_chronicles` database will contain the `users`
collection. An empty database may remain invisible; do not create dummy users
merely to display it.

### Future community/social roadmap — documentation only

These features will receive dedicated phases after core MERN functionality is stable:

- **TribalLoops:** a unique short-form video/reel experience with likes, comments,
  save, share and creator collaboration.
- **Kaburu:** direct/private messaging with conversations and future real-time messaging.
- **Gumpu:** communities/groups with group conversations and community discussions.

No TribalLoop, Message, Conversation or Gumpu models, Socket.IO, APIs, routes or
frontend pages are implemented. Phase 11E adds only the Song model foundation; music functionality remains deferred.
Phase 11B adds Category below; authentication has not started.

## Phase 11B — Category model — COMPLETE / LOCKED

Phase 09 — COMPLETE / LOCKED.
Phase 10A — COMPLETE / LOCKED.
Phase 10B — COMPLETE / LOCKED.
Phase 11A — COMPLETE / LOCKED.
Phase 11B — COMPLETE / LOCKED.
Phase 11C — NOT STARTED.
Phase 12 — NOT STARTED.

`server/models/Category.js` uses the existing ES module convention and reuses
an already compiled Category model. It is not yet imported by the application.

| Field | Definition |
| --- | --- |
| name | Required String, trimmed, unique index declaration |
| slug | Required String, trimmed, lowercase, unique index declaration |
| description | Trimmed String, defaults to empty string, maximum 1000 characters |
| type | String enum; defaults to general |
| isActive | Boolean; defaults to true |
| createdAt / updatedAt | Date fields managed by Mongoose timestamps |

Allowed types: blog, history, biography, books, constitution, rights, itda,
schemes, music, gallery, journey and general. Slugs must be supplied explicitly;
this model trims and lowercases them but does not generate them from names.
Name and slug each declare a separate unique index. Uniqueness is enforced by
MongoDB indexes, not in-memory validation. Actual duplicate-write enforcement
was intentionally not exercised; index creation and duplicate error handling
belong with future persistence work.

### Verification and user QA

Run from `server/`:

```sh
npm test
node qa/category-model.mjs
node qa/user-model.mjs
```

Verified on 2026-09-30:

- All 12 backend tests passed without warnings: six Category tests, four unchanged
  User tests and two existing API tests. Category checks cover missing/null/blank
  name and slug, trimming/lowercasing, unique index declarations, all twelve types,
  invalid types, defaults, description length boundaries, timestamp configuration
  and repeated model compilation.
- Both read-only model QA scripts connected to local MongoDB and completed their
  queries. User password exclusion remains valid. The Category script disables
  automatic collection/index creation only for its own process and confirms the
  collection list is unchanged. It retrieves no real documents.
- A fresh server on a temporary port connected to MongoDB before listening.
  Both that server and the existing API on port 5000 returned the expected JSON
  for GET / (200), GET /api/health (200), and GET /api/not-found (404), with open
  CORS. The temporary process was stopped; the existing API was preserved.
- `app.use(cors());`, User.js, connection/startup code, existing tests, dependencies,
  all frontend files and assets remain unchanged.

For manual API QA, use the three port-5000 URLs above. If the API is not running,
start it from `server/` with `npm run dev` and confirm connection-before-listen logs.
No documents were inserted, and no permanent test data, collections or indexes
were created by these checks. Compass may continue to show an empty database;
the future collection is named `categories` and will contain real categories
when persistence is implemented. Do not create dummy categories for visibility.

Files created: `server/models/Category.js`, `server/test/category.test.js`, and
`server/qa/category-model.mjs`. Only the root README was modified.
No additional models, APIs, routes, controllers, authentication, JWT or bcrypt
were implemented. TribalLoops, Kaburu and Gumpu remain documented future features
only. Phase 11B stops here; Phase 11C and Phase 12 have not started.

## Phase 11C — Post model foundation — COMPLETE / LOCKED

Phase 09 — COMPLETE / LOCKED.
Phase 10A — COMPLETE / LOCKED.
Phase 10B — COMPLETE / LOCKED.
Phase 11A — COMPLETE / LOCKED.
Phase 11B — COMPLETE / LOCKED.
Phase 11C — COMPLETE / LOCKED.
Phase 11D — NOT STARTED.
Phase 12 — NOT STARTED.

`server/models/Post.js` uses ES modules and safely reuses the compiled Post model.
It defines only schema structure and is not imported into application startup.

| Field | Definition |
| --- | --- |
| title | Required trimmed String; maximum 200 characters |
| slug | Required trimmed lowercase String; unique index declaration |
| excerpt | Trimmed String; defaults to empty string; maximum 500 characters |
| content | Required String |
| coverImage | String; defaults to empty string |
| author | Required ObjectId reference to User |
| category | Required ObjectId reference to Category |
| tags | Array of trimmed strings; defaults to empty array |
| status | draft or published; defaults to draft |
| sources | Embedded reference array; defaults to empty array |
| likes | Array of User ObjectId references; defaults to empty array |
| publishedAt | Date; defaults to null |
| isFeatured | Boolean; defaults to false |
| createdAt / updatedAt | Date fields managed by Mongoose timestamps |

Each embedded source has optional trimmed String fields `title`, `url`, and
`publisher`, plus optional Date `accessedAt`; source entries have no separate
_id. No source data or seed content was added. These fields support research
metadata but do not verify claims, URLs or source quality.

Post.author references User, Post.category references Category, and Post.likes
reserves User references for future likes. ObjectId validation does not verify
that referenced documents exist. No relationship lookup, like deduplication,
publishing logic or automatic publishedAt assignment is implemented. Slugs are
supplied explicitly. The unique slug declaration already creates an index;
duplicate-write enforcement depends on that database index and was not tested
with persistent data in this phase.

### Verification and user QA

From `server/`, with local MongoDB running:

```sh
npm test
node qa/post-model.mjs
node qa/user-model.mjs
node qa/category-model.mjs
```

Verified on 2026-09-30: all 19 tests passed without warnings, including seven
Post tests, four unchanged User tests, six unchanged Category tests and two API
tests. Post QA covers required fields, text normalization and length boundaries,
status enum/defaults, tags, embedded source field types and invalid dates,
likes defaults/ObjectIds, author/category references, isFeatured, publishedAt,
timestamp configuration, unique index configuration and repeated compilation.

All three read-only model queries passed against local `adivasi_chronicles`.
The Post QA script disables automatic collection/index creation in its own
process and confirms the collection list is unchanged. No real documents are
retrieved. No test posts, users, categories, collections or indexes were created.
Timestamp configuration was checked without saving documents.

The existing backend on port 5000 passed GET / (200), GET /api/health (200),
and GET /api/not-found (404), with the exact JSON documented in Phase 09 and
open CORS. Fresh startup was checked on a temporary free port to preserve the
running port-5000 API: MongoDB connected before HTTP began listening, and all
three endpoints passed there too. The temporary process was stopped.
`app.use(cors());` remains unchanged. Existing API tests also passed malformed
JSON, CORS preflight and safe production error checks.

For manual QA, open the three port-5000 URLs above. If the backend is stopped,
run `npm run dev` from `server/`; confirm MongoDB connects before listening on
port 5000. Compass may remain empty until real documents are saved in a later
phase; the future Post collection is `posts`. Do not insert dummy content.

Created: `server/models/Post.js`, `server/test/post.test.js`, and
`server/qa/post-model.mjs`. Modified: root `README.md` only. User/Category models,
existing tests, startup/connection code, dependencies and frontend remain unchanged.
No APIs, controllers, authentication, additional models or community features
were added. TribalLoops, Kaburu and Gumpu remain FUTURE features only.
Phase 11C stops here; Phase 11D and Phase 12 have not started.
## Phase 11D — Comment model foundation — COMPLETE / LOCKED

Phase 09 — COMPLETE / LOCKED.
Phase 10A — COMPLETE / LOCKED.
Phase 10B — COMPLETE / LOCKED.
Phase 11A — COMPLETE / LOCKED.
Phase 11B — COMPLETE / LOCKED.
Phase 11C — COMPLETE / LOCKED.
Phase 11D — COMPLETE / LOCKED.
Phase 11E — NOT STARTED.
Phase 12 — NOT STARTED.

`server/models/Comment.js` uses the existing ES module style and reuses an already
compiled Comment model. It defines schema structure only, without an application
startup import or new routes.

| Field | Definition |
| --- | --- |
| post | Required ObjectId reference to Post |
| author | Required ObjectId reference to User |
| content | Required trimmed String; maximum 2000 characters |
| parentComment | Optional ObjectId reference to Comment; defaults to null |
| likes | Array of User ObjectId references; defaults to empty array |
| isEdited | Boolean; defaults to false |
| isActive | Boolean; defaults to true |
| createdAt / updatedAt | Date fields managed by Mongoose timestamps |

Each Comment belongs to a Post and has a User author. A reply can reference a
parent Comment. Likes reserve User references for later functionality. ObjectId
validation does not check whether referenced documents exist. Same-post reply
checks, cycle prevention, permissions, like deduplication and automatic isEdited
updates belong to later business logic; none is implemented in this phase.

### Verification and user QA

Run from `server/` with local MongoDB running:

```sh
npm test
node qa/comment-model.mjs
node qa/user-model.mjs
node qa/category-model.mjs
node qa/post-model.mjs
```

Verified on 2026-09-30: all 24 tests passed without warnings. Five Comment tests
cover required fields, blank content rejection, trimming, the 2000-character
boundary, defaults, explicit reply/like values, invalid ObjectIds, all reference
names, timestamp configuration and safe repeated model compilation. The existing
four User, six Category, seven Post and two API tests also passed unchanged.
Timestamp Date paths and Mongoose timestamps configuration were checked without
saving documents; persisted timestamp updates were not exercised.

All four read-only model QA scripts connected to local `adivasi_chronicles` and
completed their queries. The Comment script disables automatic collection/index
creation only in its own process, uses an impossible identifier filter, and
confirms the collection list is unchanged. No real document data is retrieved.
No dummy comments, users, posts or categories were inserted; no permanent test
data, collections or indexes were created by these checks.

A fresh server on a temporary free port connected to MongoDB before listening.
Both it and the existing port-5000 backend returned the exact Phase 09 JSON for
GET / (200), GET /api/health (200), and GET /api/not-found (404), with open CORS.
The temporary process was stopped and the existing API was preserved.
`app.use(cors());` remains unchanged. Existing tests also passed CORS preflight,
malformed JSON and safe production error checks.

For manual API QA, open those three URLs at `http://localhost:5000`. If the API
is stopped, run `npm run dev` from `server/` and confirm connection-before-listen
logs. Compass may remain empty until real documents are saved in a later phase;
the future collection is `comments`. Do not insert dummy data for visibility.

Created: `server/models/Comment.js`, `server/test/comment.test.js`, and
`server/qa/comment-model.mjs`. Modified: root `README.md` only. Existing models,
tests, backend startup/connection code, packages and locked frontend are unchanged.
No APIs, controllers, authentication, additional models, or Socket.IO were added.
TribalLoops, Kaburu and Gumpu remain documented FUTURE features only.
Phase 11D stops here; Phase 11E and Phase 12 have not started.
## Phase 11E — Song model foundation — COMPLETE / LOCKED

Phase 09 — COMPLETE / LOCKED.
Phase 10A — COMPLETE / LOCKED.
Phase 10B — COMPLETE / LOCKED.
Phase 11A — COMPLETE / LOCKED.
Phase 11B — COMPLETE / LOCKED.
Phase 11C — COMPLETE / LOCKED.
Phase 11D — COMPLETE / LOCKED.
Phase 11E — COMPLETE / LOCKED.
Phase 11F — NOT STARTED.
Phase 12 — NOT STARTED.

`server/models/Song.js` uses ES modules and reuses an already compiled Song model.
It defines schema structure only and is not imported into application startup.

| Field | Definition |
| --- | --- |
| title / artist | Required trimmed Strings; maximum 200 characters each |
| category | String enum: ambedkar, tribal-folk, kesari, prabhas, allu-arjun, other; defaults to other |
| language | Trimmed String; defaults to empty string |
| artwork / audioUrl / externalUrl | Strings; each defaults to empty string |
| sourceType | String enum: owned, licensed, external, metadata-only; defaults to metadata-only |
| duration | Number in seconds; defaults to null; minimum 0 when provided |
| tags | Array of trimmed strings; defaults to empty array |
| isFeatured | Boolean; defaults to false |
| isActive | Boolean; defaults to true |
| addedBy | ObjectId reference to User; defaults to null |
| createdAt / updatedAt | Date fields managed by Mongoose timestamps |

Song categories are the music-specific enum, not references to Category documents.
The addedBy reference prepares attribution but does not verify that a User exists.
No per-user favourites field is included. Favourites require future relationships
and business logic.

### Copyright-safe audio policy

`audioUrl` is reserved for audio the application owner owns, has permission to
play, or holds a valid playback licence for. Commercial music should use lawful
external destinations through `externalUrl` instead of hosting or copying audio.
No audio was downloaded, scraped, copied, bundled, proxied or redistributed in
this phase. No real songs or dummy commercial metadata were added.

`sourceType` records metadata; it does not establish permission or validate a
licence. Rights review and enforcement before playback belong to future work.
No playback, streaming, proxy, upload or music API behavior is implemented.

### Verification and user QA

From `server/`, with local MongoDB running:

```sh
npm test
node qa/song-model.mjs
node qa/user-model.mjs
node qa/category-model.mjs
node qa/post-model.mjs
node qa/comment-model.mjs
```

Verified on 2026-09-30: all 30 backend tests passed without warnings. Six Song
tests cover required/nonblank title and artist, trimming and length boundaries,
all category/sourceType values and invalid enums, duration defaults/minimum,
tags, language, empty media fields, flags, addedBy default/reference/casting,
timestamp configuration, absence of favourites and repeated model compilation.
The existing User, Category, Post, Comment and API tests passed unchanged.
Timestamp configuration was checked without exercising persisted timestamp updates.

All five read-only model QA scripts connected to local `adivasi_chronicles` and
completed their queries. The Song script disables automatic collection/index
creation only in its own process, uses an impossible identifier filter, and
confirms the collection list is unchanged. No real document data is retrieved.
No permanent test songs, users, categories, posts or comments were created;
these checks created no collections or indexes.

Fresh startup on a temporary free port connected to MongoDB before listening.
Both that server and the existing port-5000 API returned the exact Phase 09 JSON
for GET / (200), GET /api/health (200), and GET /api/not-found (404), with open
CORS. The temporary process was stopped; the existing API was preserved.
`app.use(cors());` remains unchanged. Existing tests also passed CORS preflight,
malformed JSON and safe production error checks.

For manual QA, open the three URLs at `http://localhost:5000`. If the backend is
stopped, run `npm run dev` from `server/` and confirm connection-before-listen
logs. Compass may remain empty until real documents are saved in a future phase;
the future collection is `songs`. Do not create dummy songs for visibility.

Created: `server/models/Song.js`, `server/test/song.test.js`, and
`server/qa/song-model.mjs`. Modified: root `README.md` only. Locked models,
existing tests, frontend/assets, dependencies and connection/startup code are
unchanged. No APIs, controllers, authentication or other models were added.
TribalLoops, Kaburu and Gumpu remain FUTURE features only; Socket.IO is not added.
Phase 11E stops here; Phase 11F and Phase 12 have not started.
## Phase 11F-1 — Biography model foundation — COMPLETE

Phase 09 — COMPLETE / LOCKED.
Phase 10A — COMPLETE / LOCKED.
Phase 10B — COMPLETE / LOCKED.
Phase 11A — COMPLETE / LOCKED.
Phase 11B — COMPLETE / LOCKED.
Phase 11C — COMPLETE / LOCKED.
Phase 11D — COMPLETE / LOCKED.
Phase 11E — COMPLETE / LOCKED.
Phase 11F-1 — COMPLETE; ready for user QA.
Phase 11F-2 — NOT STARTED.
Phase 12 — NOT STARTED.

`server/models/Biography.js` prepares the Heroes & Biographical Archive using
ES modules and safe reuse of an already compiled model. It defines only schema
structure and is not imported into application startup.

| Field | Definition |
| --- | --- |
| name | Required trimmed String; maximum 150 characters |
| slug | Required trimmed lowercase String; maximum 180; unique index declaration |
| alternateNames | Array of trimmed strings; defaults to empty array |
| summary | Required trimmed String; maximum 1000 characters |
| biography / portrait | Strings; each defaults to empty string |
| birthDate / deathDate | Dates; each defaults to null |
| region / community | Trimmed Strings; each defaults to empty string |
| categories / keyContributions | String arrays; each defaults to empty array |
| sources | Embedded reference array; defaults to empty array |
| quotations | Embedded quotation array; defaults to empty array |
| verificationStatus | pending, reviewed or verified; defaults to pending |
| lastVerifiedAt | Date; defaults to null |
| isFeatured / isPublished | Booleans; each defaults to false |
| author | ObjectId reference to User; defaults to null |
| createdAt / updatedAt | Date fields managed by Mongoose timestamps |

Embedded sources contain optional trimmed String fields title, publisher and url,
plus optional Date accessedAt. Embedded quotations contain optional trimmed
String fields text, sourceTitle, sourceUrl and verificationNote, plus Boolean
verified defaulting to false. Neither embedded structure has a separate _id.
The author reference does not check that a User exists. Categories are strings,
not Category references. Slugs must be supplied explicitly; unique configuration
declares a database index rather than an in-memory uniqueness validator.

### Historical-content integrity

Never invent historical facts, quotations, dates or sources. Unknown birth/death
dates remain null. Historical content requires references; verified quotations
require matching source evidence. Merely storing a quotation never verifies it.
Even a biography marked verified leaves new quotations unverified by default.
Editorial verificationStatus alone is not proof of accuracy, does not publish a
biography, and does not automatically set lastVerifiedAt.

These fields record editorial decisions; this foundation does not authenticate
source evidence or enforce a publication review workflow. Future publishing and
quotation display must apply those rules. No real person, real quotation, source
citation, historical claim or seed content was inserted during this phase.

### Verification and user QA

From `server/`, with local MongoDB running:

```sh
npm test
node qa/biography-model.mjs
node qa/user-model.mjs
node qa/category-model.mjs
node qa/post-model.mjs
node qa/comment-model.mjs
node qa/song-model.mjs
```

Verified on 2026-09-30: all 36 tests passed without warnings. Six Biography tests
cover required fields and whitespace rejection, exact length boundaries,
normalization, array/string/date/flag defaults, unique slug configuration, all
editorial statuses and invalid status rejection, quotation verified=false even
under a verified biography, embedded metadata structure, invalid dates, optional
User author/casting, timestamps configuration and repeated model compilation.
All locked User, Category, Post, Comment and Song tests and existing API tests
passed unchanged. No persistent writes were used to test uniqueness or timestamps.

All six read-only model QA scripts connected to local `adivasi_chronicles` and
completed their queries. The Biography script disables automatic collection/index
creation only in its own process, uses an impossible identifier filter and checks
that collection names are unchanged. No real document data is retrieved, and no
permanent test documents, collections or indexes were created by these checks.

A fresh backend on a temporary free port connected to MongoDB before listening.
Both it and the existing port-5000 API returned the expected Phase 09 JSON for
GET / (200), GET /api/health (200), and GET /api/not-found (404), with open CORS.
The temporary process was stopped; the existing API was preserved.
`app.use(cors());` remains unchanged. Existing API tests also passed malformed
JSON, CORS preflight and safe production errors.

For manual API QA, open those three URLs at `http://localhost:5000`. If the backend
is stopped, run `npm run dev` from `server/`. Compass may remain empty until real
content is saved in a future phase; the future collection is `biographies`.
Do not create dummy biographies to make the collection visible.

Created: `server/models/Biography.js`, `server/test/biography.test.js`, and
`server/qa/biography-model.mjs`. Modified: root `README.md` only. Locked models,
existing tests, frontend/assets, dependencies and startup/connection code remain
unchanged. No APIs, frontend integration, authentication or other models were added.
TribalLoops, Kaburu and Gumpu remain FUTURE features only; Socket.IO is not added.
Phase 11F-1 stops here; Phase 11F-2 and Phase 12 have not started.


---

## Full-Stack MERN Completion (Phases 11F-2 through 26)

Status: COMPLETE (Backend REST API + MongoDB integration + React frontend integration + tests).

### Added Backend Capabilities (`server/`)

- **Models (`server/models/`):**
  - Preserved locked models (`User`, `Category`, `Post`, `Comment`, `Song`, `Biography`).
  - Added `BookEntry`, `KnowledgeArticle`, `GalleryItem`, `Scheme`, `JourneyEntry`, `Favourite`, and `ContactMessage`.
- **Authentication & Security (`server/src/middleware/authMiddleware.js`, `authController.js`):**
  - Password hashing with `bcryptjs`, JWT authentication (`POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `PUT /api/auth/me`), role-based access (`user`, `author`, `admin`), and centralized safe error handling.
- **REST APIs (`server/src/routes/`):**
  - `/api/categories`, `/api/posts` (including slug, author, search, and like toggle), `/api/comments` (with replies and admin moderation), `/api/biographies`, `/api/books`, `/api/knowledge`, `/api/schemes`, `/api/songs` (enforcing copyright-safe direct audio vs external links), `/api/gallery`, `/api/journey`, `/api/favourites`, `/api/contact`, `/api/search` (published-only global search), and `/api/admin`.
- **Category Seed (`server/src/utils/seed.js`):**
  - Run `npm run seed` in `server/` to initialize default structural categories. Optional `ADMIN_SEED_EMAIL` and `ADMIN_SEED_PASSWORD` environment variables create an initial admin user locally without hardcoding credentials.

### Added Frontend Capabilities (`client/`)

- **Axios API Client & Auth Context:** `client/src/services/api.js`, `client/src/context/AuthContext.jsx`, `client/src/hooks/useFavourite.js`.
- **Connected Pages:** Live Login & Register (`AuthPage.jsx`), Blog & BlogDetail (search, filters, likes, comments & replies, favourites), Dynamic Archive Details (`HeroDetail`, `BookDetail`, `ConstitutionDetail`, `RightDetail`), Knowledge Hubs (`TribalHistory`, `Constitution`, `Rights`, `ITDA`, `Schemes`), Music Library with HTML5 audio player for owned/licensed tracks & lawful external links, Gallery with collection filter & detail lightbox, My Journey with interest filters (`horses`, `football`, `archery`), Global Search (`/search`), live Contact form (`/contact`), and full Admin & User Account Dashboard (`/admin`).

### Running Locally

1. Ensure local MongoDB Community Server is running (`mongodb://127.0.0.1:27017/adivasi_chronicles`).
2. Configure `server/.env` (from `server/.env.example`) and optionally `client/.env` (from `client/.env.example`).
3. Start backend:
   ```sh
   cd server
   npm install
   npm run seed
   npm test
   npm run dev
   ```
4. Start frontend:
   ```sh
   cd client
   npm install
   npm run lint
   npm run build
   npm run dev
   ```
