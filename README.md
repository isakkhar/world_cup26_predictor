# 🏆 World Cup 2026 Predictor & Simulator

An ultra-premium, interactive tournament simulator and social prediction platform designed for the expanded **48-team FIFA World Cup 2026** in USA, Mexico, and Canada. Experience cinematic dark aesthetics, instant client-side tournament processing, real-time cloud database synchronization, and community rankings.

🌐 **Live Site:** [world-cup26-predictor.vercel.app](https://world-cup26-predictor.vercel.app/)

---

## ⚡ Key Highlights & Features

### 🌟 48-Team Tournament Logic
* **Expanded Group Stage:** Implements the official 12-group format (Groups A through L) with 4 teams each.
* **3rd-Place Math Engine:** Automatically computes all 495 possible third-place advancing team combinations instantly using FIFA tiebreaker logic (Points ➔ Goal Difference ➔ Goals Scored).
* **Round of 32 Transition:** Automatically allocates the 8 best 3rd-placed nations to their designated knockout bracket slots based on the group combinations.

### 💾 Seamless Cloud Sync & Guest Session
* **Autosave Engine:** Debounced (1s delay) saving indicator badge visually alerts the user when predictions are synchronized.
* **Database Persistence:** Real-time synchronization to Supabase Cloud for authenticated profiles.
* **Guest-to-Cloud Migration:** Allows guest users to predict locally. Upon registration/login, predictions automatically migrate from `localStorage` to the database.
* **Multiple Auth Methods:** Fully supports Email Magic Links and Google OAuth with secure redirection.

### 📊 Global Leaderboard System
* **Global Rankings:** Compete with predictions enthusiasts from around the world.
* **Weekly Leaderboards:** Dynamic rankings resetting weekly to track active predictors.
* **Country-based Filters:** Filter by country to see localized ranking groups.
* **Point System:** Earn points based on real match accuracy (10 pts for correct Group Rank, 20 pts for advancing knockout teams, 100 pts for the correct champion).

### 🎨 High-End Cinematic Aesthetics
* **Glassmorphism Theme:** Beautiful translucent card boundaries with glowing mouse-tracking radial borders.
* **Dynamic Countdown:** A high-precision live countdown timer tracking the exact days, hours, minutes, and seconds remaining until kickoff at **Estadio Azteca, Mexico City** on **June 11, 2026**.
* **High-Res Bracket Export:** One-click custom PNG render engine utilizing `html-to-image` for download and social sharing.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| **Frontend Framework** | React 18+ (TypeScript) | Fast, modular component structure with type-safe bracket logic. |
| **Build Tool** | Vite | Ultra-fast client-side hot reloading and optimal bundles. |
| **Styling** | Vanilla CSS (Modern CSS variables) | Fully custom glassmorphism, responsive grid design, and dark theme support. |
| **Database & Auth** | Supabase | Cloud storage for user profiles, real-time prediction synchronization, and secure OAuth. |
| **Icons** | Lucide React | High-contrast vector iconography. |

---

## 🚀 Local Installation & Setup

Follow these steps to run the project locally on your machine:

### 1. Clone the Repository
```bash
git clone https://github.com/isakkhar/world-cup26-predictor.git
cd world-cup26-predictor
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key
```

### 4. Setup Supabase Database Schema
Run the following SQL script inside the **Supabase SQL Editor** to create the necessary tables, indices, and RLS (Row Level Security) rules:

```sql
-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  avatar_url text,
  updated_at timestamp with time zone default now(),
  points integer default 0,
  weekly_points integer default 0,
  country text,
  rank integer
);

-- RLS Configuration
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- 2. User Predictions Table
create table if not exists public.user_predictions (
  user_id uuid references auth.users on delete cascade not null primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default now()
);

alter table public.user_predictions enable row level security;

create policy "Users can view their own predictions" on public.user_predictions
  for select using (auth.uid() = user_id);

create policy "Users can insert their own predictions" on public.user_predictions
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own predictions" on public.user_predictions
  for update using (auth.uid() = user_id);
```

### 5. Run the Application
* **Development Server:**
  ```bash
  npm run dev
  ```
* **Production Build:**
  ```bash
  npm run build
  ```

---

## 📂 Project Structure

```filepath
world_cup26_predictor/
├── public/                 # Static assets (favicons, manifest, etc.)
├── src/
│   ├── assets/             # Images and global styles
│   ├── components/         # Reusable modal and loading components
│   ├── context/            # Global React Contexts (AuthContext, PredictorContext)
│   ├── data/               # Tournament groups, teams list, and bracket mapping
│   ├── hooks/              # Custom SEO and utility React Hooks
│   ├── lib/                # Database clients (Supabase configuration)
│   ├── pages/              # Primary pages
│   │   ├── auth/           # Login and Authentication routes
│   │   ├── predictor/      # Group Stage, Third-Place selection, Knockout UI
│   │   ├── LandingPage.tsx # Ultra-premium landing page with live countdown
│   │   ├── ProfilePage.tsx # Account configuration, Country selection, stats
│   │   └── LeaderboardPage.tsx # Global, Weekly, and Country-based user rankings
│   ├── App.tsx             # Root router configuration
│   ├── index.css           # Global design system variables
│   └── main.tsx            # Application entrypoint
├── .env.example            # Environment variables example template
└── README.md               # Extensive project documentation
```

---

## 👥 Authors & Collaborations

Developed and Maintained by **Sakkhar Saha**
* 📧 **Email:** [isakkhar@gmail.com](mailto:isakkhar@gmail.com)
* 📞 **Phone:** +8801911725944
* 🐙 **GitHub:** [isakkhar](https://github.com/isakkhar)

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.  
© 2026 Designed and Engineered by **Sakkhar Saha**. All Rights Reserved.
