# AGENTS.md — zverskinapalen

## Structure

Next.js 15 App Router project.

- **Entry flow**: `/` (`app/page.jsx`) -> click logo -> `/main` (`app/main/page.jsx`). Idle 11s on landing triggers a dog gif with 50% chance.
- **Background**: `components/AnimatedBackground.jsx` with animated floating dog logos and sky background GIF.
- **SoundCloud Player**: `components/SoundCloudPlayer.jsx` (embeds fixed at the bottom).
- **Game**: `/game` (`app/game/page.jsx`) - Canvas 2D platformer loading sprites from `/game/*.png` via `public/game/`.
- **Discography**: `/diskografiya` (`app/diskografiya/page.jsx`) and dynamic albums at `/album/[slug]` (`app/album/[slug]/page.jsx`).
- **RZT (Reviews creation)**: `/rzt` (`app/rzt/page.jsx`) - Track selection, criteria sliders (rhymes, structure, style, charisma, vibe) and score calculation.
- **Reviews Feed**: `/reviews` (`app/reviews/page.jsx`) - Supabase reviews with avatars, nicknames, scores and review text.
- **Auth**: Supabase Auth + Profiles via `context/AuthContext.jsx` and `lib/supabase.js`.
- **Admin**: `/admin/users` (`app/admin/users/page.jsx`) - User list.
- **Styling**: Global CSS at `app/globals.css` with inline and module styles.

## Conventions

- **Language**: Russian throughout — comments, UI text, variable names. Keep Russian for any new text.
- **No mobile responsiveness** (as per design spec).

## Auth & Database (Supabase)

- Project: `mtunttvfbprvgwdaearu.supabase.co`
- Env variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Tables: `users` (id, nickname, email, photo, about), `reviews` (id, user_id, track_id, track_title, performer, cover, review_text, rhymes, structure, style, charisma, vibe, total_score)
- Storage bucket: `avatars` (Public)
