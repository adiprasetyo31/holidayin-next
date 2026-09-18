# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

HolidayIn — a Yogyakarta tourism info site built as a college assignment (PABW). Static HTML/CSS/vanilla-JS pages plus three procedural PHP scripts backed by MySQL. There is no build step, no package manager, no test suite, and no linter; the repo is the deployable artifact.

Most UI text, comments, and content are in Indonesian. Keep new content in Indonesian to match.

## Running

Needs PHP + MySQL (XAMPP/Laragon). Copy or symlink the repo into `htdocs`/`www`, create a `berwisata` database, import [berwisata.sql](berwisata.sql), then open `http://localhost/Holidayin/landingPage.html`.

Credentials live inline in [php/koneksi.php](php/koneksi.php) (`root`, empty password) — there is no config file or env var.

Opening the HTML with Live Server (see [PABW.code-workspace](PABW.code-workspace)) works for everything except the two form posts, which need the PHP runtime.

## Page families

Entry point is [landingPage.html](landingPage.html) (video slider), not `index.html`.

Four page shapes, each with its own markup conventions:

1. **List pages** — [des1.html](des1.html), [des2.html](des2.html), [event1.html](event1.html): Bootstrap grid of `.pro-container` cards plus a `.pagination` block. Pagination is presentational only — the buttons toggle an `.active` class and never change what is rendered; des1/des2 are hand-split pages.
2. **Detail pages** — `det*.html` (12 destinations) and [eventdet1.html](eventdet1.html): a `#wrapper` image carousel, description/info sections, and a comment section built from `<template class="comment-template">` / `<template class="reply-input-template">`. These files are copy-paste clones of one another — adding a destination means duplicating an existing `det*.html`, swapping images/text, and adding a card to des1/des2.
3. **Auth** — [login.html](login.html): login and register forms in one sliding panel, posting to `php/login.php` and `php/Registrasi.php`.
4. **Profile** — [profile.html](profile.html): static markup, no data binding.

[Kerangka/](Kerangka/) is a frozen early draft of the landing page (`backup.html/.css/.js`) kept for reference; it is not referenced by any live page.

## Shared CSS and the single shared script

[css/style.css](css/style.css) (~950 lines) styles the list, detail, event, and comment pages; it is organized by commented sections (`/*Nav bar atas*/`, `/* Detail Tempat */`, `/*Komen Section */`, `/*Pagination*/`, responsive overrides at the bottom). `landingPage.css`, `login.css`, and `profile.css` are page-specific and each re-declare their own header/nav rules — a nav change usually has to be made in more than one stylesheet.

[Js/index.js](Js/index.js) is loaded by **both** list pages and detail pages, but it is written as one flat top-level script with no guards, so it always throws partway through:

- On list pages, `document.querySelector(".carousel")` is `null`, so the script throws at [Js/index.js:36](Js/index.js#L36) before ever reaching the pagination handlers at the bottom — pagination on des1/des2/event1 is dead code.
- On detail pages, the carousel and comments initialize, then `prevButton.addEventListener` at [Js/index.js:343](Js/index.js#L343) throws because those pages have no `.prev` element.
- `sliderNav` in index.js references a `slides` variable that is never declared there (only in [Js/landingPage.js](Js/landingPage.js)); it is unreachable because no shared page has `.nav-btn`.

If you touch this file, expect that reordering statements changes which features work on which pages. The durable fix is null-guarding each block, not reordering.

Comment data is a hard-coded `data` object at the top of index.js — comments are in-memory only and reset on reload; nothing is persisted to the database.

[Js/profile.js](Js/profile.js) is [Js/login.js](Js/login.js) plus a copy of landingPage.js's nav code; changes to the login panel behavior need to be made in both.

## PHP layer

Three files, no framework, no router, no sessions:

- [php/koneksi.php](php/koneksi.php) opens the mysqli connection **and echoes "Koneksi sukses."** on include. Because that output precedes the `header('Location: ...')` calls in login.php and Registrasi.php, the redirects emit a "headers already sent" warning and do not fire. Removing the echo is the fix; keep it in mind when debugging "login does nothing".
- [php/login.php](php/login.php) verifies with `password_verify` and redirects to `../des1.html`. It sets no session and stores no user identity, so no page is actually gated — profile.html is reachable directly.
- [php/Registrasi.php](php/Registrasi.php) hashes with `password_hash` and redirects to the hard-coded absolute path `/Project/PABW/login.html`, which is wrong for any deploy directory other than that one.

Both queries interpolate `$_POST` directly into SQL (SQL injection). The README acknowledges this as known assignment-scope debt; use prepared statements in any new or modified query.

The only table is `user` (`id_user`, `first_name`, `last_name`, `email`, `password`). There is no table for destinations, events, or comments — all of that content is hard-coded in HTML/JS.

## Assets

`img/tempat/` holds destination photos named by slug (`prambanan5.jpg`, `hehasky1.jpg`, …), `img/event/`, `img/komen/` (comment avatars), `img/icon/` (comment action SVGs). `src/` holds the landing-page videos and app-store badges, duplicated in `Kerangka/src/`. Paths are referenced inconsistently across pages — some `img/tempat/x.jpg`, some `./img/...`, some `./src/...`; match whatever the file you are editing already uses.
