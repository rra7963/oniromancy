# Divination suite (ported from chatgpt-tarot-divination)

Every reading type from [dreamhunter2333/chatgpt-tarot-divination](https://github.com/dreamhunter2333/chatgpt-tarot-divination)
now exists in Oniromancy, rebuilt on this app's own stack (Next.js server
actions + Gemini + Supabase credits) instead of the upstream FastAPI backend.

| Upstream type | Oniromancy route | Credits |
| --- | --- | --- |
| `tarot` 塔罗牌占卜 | `/tarot` (already existed) | 2 / 5 |
| `dream` 周公解梦 | `/` (already existed) | 5 |
| `birthday` 生辰八字 | `/bazi` | 4 |
| `name` 姓名五格 | `/name-analysis` | 2 |
| `new_name` 起名取名 | `/name-generator` | 4 |
| `plum_flower` 梅花易数 | `/i-ching` | 2 |
| `fate` 姻缘占卜 | `/love-match` | 1 |

`/divination` is a hub page listing all of them alongside the existing dream,
tarot and horoscope readings.

## What changed versus upstream

- **Prompts** were rewritten in English in the app's voice, with an explicit
  section structure so every reading ends with practical next steps.
- **Charts are cast in code, not by the model.** Upstream leaned on
  `lunar_python` for BaZi and asked the model to cast the hexagram itself.
  - `lib/bazi.ts` computes the Four Pillars (sexagenary day count anchored on
    2000-01-07 = Jia Zi, solar-term month boundaries from the sun's ecliptic
    longitude, Li Chun year boundary, 23:00 day rollover), the Day Master, the
    zodiac animal and the five-element balance.
  - `lib/iching.ts` casts the Plum Blossom hexagram (first number → upper
    trigram, second → lower, sum → moving line), looks up the King Wen number
    and derives the relating hexagram.
  The model is told the chart is already cast and must not recompute it, and
  the chart is rendered above the interpretation.
- **Credits** replace upstream's rate limiting: each reading deducts via the
  same optimistic-concurrency + refund-on-failure pattern as tarot and
  horoscope, and logs a `SPEND_DIVINATION` transaction.
- **History**: readings are stored in a new `divinations` table (best effort —
  a failed insert never costs the reading) and, like upstream, the last 10
  readings per type are also kept in `localStorage`.
- Upstream's own API-key settings page, login page and prompt market are not
  ported: Oniromancy already has auth, billing and a server-held API key.

## Setup

Run `supabase/divinations.sql` once against the Supabase project to create the
`divinations` table and its row-level security policy. Nothing else is needed —
the routes use the existing `GEMINI_API_KEY`.

## Files

- `lib/divination.ts` — catalogue, form fields, shared validation (client-safe)
- `lib/bazi.ts`, `lib/iching.ts` — deterministic chart casting
- `app/actions/divination.ts` — one server action for all five types
- `components/DivinationView.tsx`, `DivinationChart.tsx`, `DivinationPageClient.tsx`
- `services/divinationHistory.ts` — local history store
- `app/{bazi,name-analysis,name-generator,i-ching,love-match,divination}/`
