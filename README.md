# Oniromancy AI

Oniromancy is a mystical AI-powered application for dream interpretation, tarot reading, and daily horoscopes. It combines ancient wisdom with modern generative AI (Google Gemini & Imagen) to provide personalized spiritual insights in an immersive, atmospheric interface.

## ✨ Features

### 🕯 The Opening Rite
- **Narrated Intro Scene**: A moderator-led night scene (in the spirit of a social-deduction night phase) plays before the dream is spoken — the Oracle narrates, the dreamer answers.
- **Four Watches**: Each watch asks one question with 2–4 choices (how you woke, whether the dream recurs, who else was in it, what you want named).
- **Your Seat**: The answers decide which seat you take for the night — The Seer, The Witch, The Hunter, The Warden, or The Wanderer.
- **Feeds the Reading**: The rite's answers are rebuilt server-side and sent with the dream, so the interpretation is grounded in what you said. Skippable, and remembered for 12 hours.

### 🌙 Dream Analysis
- **AI Interpretation**: Decode your dreams using Jungian psychology and mystical symbolism.
- **Visual Generation**: Creates unique, surreal visualizations of your dreamscapes using Google Imagen.
- **Deep Insights**: Provides analysis on mood, psyche score, elemental associations, and actionable advice.

### 🔮 Tarot Reading
- **Multiple Spreads**:
  - **Single Card**: For daily guidance and quick answers.
  - **Past / Present / Future**: A 3-card spread for deeper contextual understanding.
- **Mystical Experience**: Immersive 3D card flip animations, shuffling rituals, and atmospheric soundscapes.
- **AI Interpretation**: Context-aware readings that consider card positions (upright/reversed) and your recent dream history.

### 🌟 Horoscope & Daily Fortune
- **Daily Ritual**: A unique "drawing" mechanic to reveal your daily fortune.
- **Dimensional Analysis**: Granular scores and advice for **Love, Career, Health, Creativity, and Social** aspects.
- **Recast Fate**: Unhappy with your result? Recast your fate for a better outcome (uses credits).
- **Engagement Stats**: Lucky Number, Power Color, Peak Time, and Soul Match.

### 📜 Grimoire & History
- **Dream Journal**: A searchable history of all your past dream analyses.
- **Tarot Archive**: Review past readings and spreads.
- **Horoscope Log**: Track your daily fortune trends over time.
- **Order History**: Track your credit purchases and usage with a paginated view.

### 💎 Credit & Tier System
- **Economy**: Users spend credits to perform rituals.
  - Dreams: 5 Credits
  - Tarot 3-Card: 5 Credits
  - Tarot Single: 2 Credits
  - Horoscope: 1 Credit (Recast: 2 Credits)
- **Credit Packs**:
  - **Starter Pack**: $0.99 for 30 Credits (One-time offer).
  - **Handful of Dust**: $4.99 for 50 Credits.
  - **Bag of Stardust**: $9.99 for 200 Credits.
  - **Chest of Ether**: $29.99 for 500 Credits.
- **Referral Program**:
  - **Invite Friends**: Share your unique link from the profile page.
  - **Rewards**: Both you and your friend get **20 Credits** when they sign up.
  - **Dashboard**: Track your invites and total earned credits.
- **Daily Bonus**: Login daily to claim free credits.
- **Subscription**: 'Mystic Plan' (Monthly/Yearly) for unlimited journals, advanced trends, and monthly allowances.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, clsx, Lucide React
- **Animations**: Framer Motion (3D flips, layout transitions, particles)
- **Backend & Auth**: Supabase (PostgreSQL, Row Level Security, Auth)
- **Payments**: Stripe (Checkout Sessions, Webhooks)
- **AI Models**:
  - **Text**: Google Gemini 2.5 Flash
  - **Image**: Google Imagen 4.0
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- Google AI Studio API Key (Gemini & Imagen)
- Supabase Project
- Stripe Account

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Installation

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Start the development server:**
    ```bash
    npm run dev
    ```

3.  **Open the app:**
    Navigate to `http://localhost:3000` in your browser.

## 🗄️ Database Schema (Supabase)

Run the following SQL in your Supabase SQL Editor to set up the necessary tables and policies.

```sql
-- 1. Profiles (User Data)
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null unique,
  name text,
  tier text default 'NOVICE',
  credits integer default 3,
  birth_date text,
  birth_time text,
  birth_place text,
  zodiac text,
  timezone text,
  notification_opt_in boolean default false,
  last_bonus_date text,
  subscription_end_date timestamptz,
  inserted_at timestamptz default now()
);

-- 2. Dreams (Analysis & Images)
create table if not exists public.dreams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  dream_input text,
  analysis jsonb not null,
  image_url text not null,
  timestamp bigint not null,
  created_at timestamptz default now()
);

-- 3. Daily Fortunes (Horoscope)
create table if not exists public.daily_fortunes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  zodiac text,
  oracle_message text not null,
  lucky_color text not null,
  lucky_number int not null,
  dimensions jsonb not null,
  unique(user_id, date)
);

-- 4. Tarot Draws
create table if not exists public.tarot_draws (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  question text,
  persona_id text,
  spread_type text not null check (spread_type in ('SINGLE','THREE')),
  cards jsonb not null,
  interpretation text not null,
  created_at timestamptz default now()
);

-- 5. Transactions (Credits History)
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  amount numeric,
  currency text,
  credits_change integer not null,
  description text,
  created_at timestamptz default now()
);

-- 6. Newsletter Subscribers
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  subscribed_at timestamptz default now()
);

-- 7. Partners (Affiliate Program)
create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  platform text not null,
  handle text not null,
  ref_code text not null unique,
  status text default 'active',
  created_at timestamptz default now()
);

-- 8. Referrals
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  inviter_id uuid references public.profiles(id) not null,
  invitee_id uuid references public.profiles(id) not null unique,
  created_at timestamptz default now(),
  status text default 'completed'
);

create index if not exists referrals_inviter_id_idx on public.referrals(inviter_id);
create index if not exists referrals_invitee_id_idx on public.referrals(invitee_id);


-- 9. Contact Messages
create table if not exists public.contact_messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text default 'new'
);

-- 10. Partner Commissions
create table if not exists public.partner_commissions (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references public.partners(id) not null,
  transaction_id uuid references public.transactions(id), -- Optional link to user transaction
  stripe_session_id text,
  amount numeric not null, -- Commission amount in currency
  currency text not null default 'usd',
  status text default 'pending', -- pending, paid, rejected
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.dreams enable row level security;
alter table public.daily_fortunes enable row level security;
alter table public.tarot_draws enable row level security;
alter table public.transactions enable row level security;
alter table public.subscribers enable row level security;
alter table public.partners enable row level security;
alter table public.referrals enable row level security;
alter table public.contact_messages enable row level security;
alter table public.partner_commissions enable row level security;

-- RLS Policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users can view own dreams" on public.dreams for select using (auth.uid() = user_id);
create policy "Users can insert own dreams" on public.dreams for insert with check (auth.uid() = user_id);

create policy "Users can view own fortunes" on public.daily_fortunes for select using (auth.uid() = user_id);
create policy "Users can insert own fortunes" on public.daily_fortunes for insert with check (auth.uid() = user_id);
create policy "Users can update own fortunes" on public.daily_fortunes for update using (auth.uid() = user_id);

create policy "Users can view own tarot draws" on public.tarot_draws for select using (auth.uid() = user_id);
create policy "Users can insert own tarot draws" on public.tarot_draws for insert with check (auth.uid() = user_id);

create policy "Users can view own transactions" on public.transactions for select using (auth.uid() = user_id);
create policy "Users can insert own transactions" on public.transactions for insert with check (auth.uid() = user_id);

-- Referrals Policies
create policy "Users can view their referrals" on public.referrals for select using (auth.uid() = inviter_id);
create policy "Users can insert their own referral" on public.referrals for insert with check (auth.uid() = invitee_id);
```

## 🎨 UI/UX Philosophy

Oniromancy aims for a **"Digital Mysticism"** aesthetic:
- **Glassmorphism**: Translucent layers representing the veil between worlds.
- **Deep Palettes**: Indigo, Violet, and Deep Slate backgrounds with Mystic Gold accents.
- **Slow Tech**: Intentional delays and animations (shuffling, revealing) to mimic ritualistic pacing rather than instant gratification.
