## Project
HolidayIn: a Yogyakarta tourism guide, rebuilt from a legacy college project
(HTML/CSS/vanilla JS + PHP/MySQL) into Next.js for portfolio purposes.
Legacy code lives in /legacy and is content reference only.
See legacy/CLAUDE.md for how the old code is structured and its known bugs.
Do not port legacy JS, Bootstrap, or PHP. Rebuild from scratch.
All user facing content stays in Bahasa Indonesia.

## Migration Map
- landingPage.html (video slider) -> / (home, hero with one video or image)
- des1.html + des2.html -> /destinasi (single page, real filter, search, pagination)
- det*.html (12 files) -> /destinasi/[slug] (one template + data)
- event1.html, eventdet1.html -> not migrated in phase 1. Content is already
  extracted into src/data/events.json, but no /event routes are built yet.
- login.html, profile.html, php/* -> not migrated in phase 1
- img/tempat -> public/images/destinasi (all lowercase; bay1.jpg, bay2.webp and
  bay9.jpg were unused in legacy and not copied)
- img/event, src -> public/images/event, public/videos/... (deferred with events)

## Data
Content lives in src/data/*.json, imported as @/src/data/... (tsconfig maps @/* to ./*).
destinations.json holds all 50 destinations plus the region and category lists used
by the /destinasi filters. The first 12 came from legacy; the other 38 were added by
research and have source: null. Legacy had no real descriptions or practical info —
every det*.html shared the same Lorem ipsum and the same copy-pasted hours/prices —
so descriptions were rewritten and hours, prices and coordinates were researched from
the web. Each destination carries sources (URLs) and lastVerified.

Conventions:
- A null value means "not available"; the UI hides that piece of practical info
  rather than showing a placeholder.
- info.ticket.rates is one row per tariff: visitor (local|foreign), day
  (all|weekday|weekend), min, max. min === max is a fixed price, min < max is a
  range. Render every row so weekday/weekend differences are visible. An empty
  array means no price was found — hide the whole price block.
- A price that is not per person (a jeep hire, a village package) does not belong
  in rates; it would render as a per-person ticket. Put the figures in info.notes
  and leave rates empty.
- needsVerification lists fields that hold a value that is not yet trusted (dated
  or conflicting sources). It is not a list of empty fields.
- Jogja Bay Waterpark has rebranded to Waterboom Jogja; it uses the slug
  waterboom-jogja, with "jogja bay" kept in tags so search still finds it.

### Photos
Every image is { src, imageCredit } where imageCredit is { author, sourceUrl,
license, licenseUrl }, or null only for leftover legacy photos of unknown
provenance (gembira-loka, heha-ocean-view, waterboom-jogja).

- Only these sources: Wikimedia Commons, Unsplash, Openverse, Flickr, Pexels.
  check-destinations.mjs enforces the host allowlist on sourceUrl.
- Only CC0, CC BY, CC BY-SA or public domain. NC and ND are rejected by the
  validator. Openverse is the easiest way to search Flickr under those filters;
  Pexels and Flickr both need an API key for direct search, Openverse does not.
- The photo must clearly show the actual place. A generic stock shot that merely
  matches the keyword is worse than no photo — leave it out and set published false.
- Minimum 1600px wide at the source. Files are re-encoded to WebP, max 1600x1200,
  quality 74, named <slug>-<n>.webp. One card plus up to three gallery images.
- images.card may be null when no acceptable photo exists; gallery is then empty
  too, and the UI shows the neutral NoPhoto panel instead of a photo.

### published
published is a boolean on every destination. It must be true exactly when the
destination has a card image — the validator fails on any mismatch.

Unpublished destinations stay in the JSON so the research is not lost, but they
must not appear anywhere on the site. This is enforced in one place:
src/lib/destinations.ts exports `destinations` already filtered to published
entries, and `allDestinations` for tooling that genuinely needs the full list.
Because the list page, filter counts, search, getRelated, the home page stats and
generateStaticParams all read `destinations`, nothing else needs its own filter —
so do not reintroduce reads of allDestinations in app code.

## Data Rules
- Destination data lives in src/data/destinations.json. Never hardcode content in components.
- Any practical info field that is null must be hidden in the UI, not shown as "-" or "N/A".
- Format prices in the view layer as Indonesian rupiah (Rp40.000).
- Show lastVerified as small muted text on detail pages ("Info diperbarui September 2026").
- Run npm run check:data after touching destinations.json; it checks the schema,
  the photo sources and licences, and the published/card invariant.
- Events are out of scope for phase 1.

### Color (Yogyakarta: batik sogan, Merapi andesite stone, kraton gold)
- background: #F7F3EC (warm paper)
- surface: #EFE7DA
- text: #2B211A (dark sogan brown)
- muted: #7A6A5C
- accent: #9C5B2E (sogan), used sparingly
- highlight: #B8893A (kraton gold), for small details only
- stone: #5E6660 (andesite, for tags and secondary UI)
- dark mode background: #1A1612

highlight is for non-text use only: rules, icons, borders, decorative details.
It is #B8893A on #F7F3EC paper, which is 2.84:1 — below AA for body text and
below even the 3:1 large-text floor. Never set it as a text color. Small
uppercase labels (category eyebrows, section kickers, the 404 code) use accent.
The same applies over photos: there is no gold on-scrim token, so labels on a
scrim use on-scrim-muted.

/styleguide renders every color token with its live WCAG contrast ratio against
the background of that mode. Check a new color pairing there before shipping it.