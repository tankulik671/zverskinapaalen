# AGENTS.md — zverskinapalen

## Structure

Pure static site (no build, no npm, no bundler). Just open any `.html` in a browser.

- **Entry flow**: `index.html` -> click logo -> `main.html` (main page with nav, SoundCloud player, flying logos). Idle 11s on index triggers a dog gif with 50% chance.
- **Game**: `game.html` -> ES module entry at `game/core/game.js`. Canvas 2D platformer. Loads sprites from `game/*.png` via `assets.js`.
- **Auth**: Two systems coexist in the codebase but **Supabase is active** (`accounts.js`, `js/accounts.js`, `js/supabase-client.js`). Firebase (`firebase.js`) exists but may be legacy. `accounts.js` at root and `js/accounts.js` are identical dupes.
- **Discography**: `diskografiya.html` — very large file (2137 lines), embeds SoundCloud players per track.
- **Styling**: Nearly all CSS is inline or in `<style>` blocks per HTML file. `style.css` at root is vestigial (9 lines, barely used).

## Conventions

- **Language**: Russian throughout — comments, UI text, variable names (sometimes transliterated). Keep Russian for any new text.
- **No mobile responsiveness** (stated explicitly on main page).
- **No tests, no lint, no CI**.
- `huishka.js` is empty — do not create content there unless user asks.

## Auth (Supabase)

- Project: `mtunttvfbprvgwdaearu.supabase.co` (anon key in `accounts.js` and `supabase-client.js`)
- Tables: `users` (id, nickname, email, password, photo, about), `reviews` (track ratings with rhymes/structure/style/charisma/vibe scores)
- Storage bucket: `avatars`
- Auth is imported via `type="module"` script tags using CDN imports (unpkg.com or esm.sh)
