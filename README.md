# Aoraki Creations — website

This is the marketing site for **Aoraki Creations**, a custom website (and ads) business for small businesses across the US.

It's a plain website — HTML, CSS, and a little JavaScript. Nothing to install, no server to run. Open `index.html` in any browser and it works.

---

## See it on your computer

Double-click **`index.html`**. It opens in your browser. That's it.

---

## Where leads go

The whole site points leads to **aorakicreations@gmail.com** — the contact button, the form, and the footer all use it. Since that's a normal Gmail inbox, it works right away: messages land in that inbox with nothing to set up.

Want to use a branded address later (like `hello@aorakicreations.com`)? Tell Claude "change the site email to ___" — it's a 30-second change in two files.

---

## Put it online (free) — when you're ready

This site is built and waiting in a **private** repo so you can look it over first. When you say go, Claude flips it public and turns on free hosting. Or do it yourself:

1. On the repo at github.com → **Settings** → **Pages**.
2. Under "Build and deployment", set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`, Save.
3. Wait ~1 minute. The site is live at `https://buckeyebait.github.io/Aoraki-website/`.

To use your own domain (`aorakicreations.com`) instead, that's a setting on the same Pages screen — tell Claude and it'll walk you through it.

---

## Change the words, prices, or email

Everything you'd want to edit is in **`index.html`**. Search for the text you see on the page and change it. Common edits:

- **Your email** — set to `aorakicreations@gmail.com` in two places (`index.html` and `scripts/main.js`). Change both.
- **Prices** — in `index.html`, find the "PRICING" section.
- **Services / copy** — same file, find the section by its heading.

Easiest path: tell Claude what to change and it handles it.

---

## Get form messages straight to your inbox (optional upgrade)

The form already works — it opens the visitor's email app, pre-filled and addressed to you. No setup needed.

To get submissions delivered to your inbox without the visitor's mail app opening:

1. Make a free form at [formspree.io](https://formspree.io). They give you a URL.
2. In `scripts/main.js`, paste it into `FORM_ENDPOINT`.
3. Re-publish.

---

## Add real projects to the "Work" section

The Work section shows three real site screenshots, each in a little browser frame: one **live** build (Webster's Skyvision) and two **concept** designs (a hunting outfitter and a café). The images live in `assets/work/` (`websters.jpg`, `stonefork.jpg`, `wren.jpg`) and each card carries a "Live site" or "Concept" badge so visitors know which is which.

When you launch a real site, take a screenshot and tell Claude "add this to my Work section." It drops in the new image, sets the badge to "Live site," and writes the caption.

---

## File map

| File | What it is |
|---|---|
| `index.html` | The whole page — all the words live here |
| `styles/main.css` | Colors, fonts, layout, the dark look |
| `scripts/main.js` | Menu, animations, hero particles, the contact form |
| `assets/favicon.svg` | The little mountain icon in the browser tab |
| `README.md` | This file |

The Aoraki logo (mountain mark + AORAKI wordmark) is drawn as sharp vector code right inside `index.html`, so it stays crisp at any size and looks right on the dark background. No image file to manage.
