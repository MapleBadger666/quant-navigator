# Quant Navigator

Quant Navigator is a local React + TypeScript + Vite + Tailwind CSS navigation workstation for quantitative research. Stage 3 adds a bilingual China-focused research terminal layout with market tabs for A-shares, US stocks, Hong Kong stocks, crypto, and shared tools.

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 部署给 Windows 用户使用

Quant Navigator can be deployed as a static website. After deployment, Windows users do not need Node.js, Git, or command-line setup. They only open the published URL in a browser.

The production build command is:

```bash
npm run build
```

The generated `dist/` directory is the static site output for Vercel, Netlify, GitHub Pages, or any static hosting service.

### 方式一：Vercel 部署

1. Push this project to a GitHub repository.
2. Open Vercel and choose `Import Git Repository`.
3. Select the repository.
4. Framework Preset: `Vite`.
5. Build Command: `npm run build`.
6. Output Directory: `dist`.
7. Add Supabase environment variables only if you want account-based favorites:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
8. Click `Deploy`.

After deployment, Windows users can open the generated Vercel URL directly.

### 方式二：Netlify 部署

1. Open Netlify and choose `New site from Git`.
2. Select the GitHub repository.
3. Build command: `npm run build`.
4. Publish directory: `dist`.
5. Add Supabase environment variables only if needed:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy the site.

Windows users can then access the generated Netlify URL in their browser.

### 方式三：GitHub Pages 部署

This repository includes `.github/workflows/deploy.yml`.

When code is pushed to the `main` branch, GitHub Actions will:

1. Use Node.js 22.
2. Run `npm ci`.
3. Run `npm run build`.
4. Upload the `dist/` directory.
5. Deploy it with `actions/deploy-pages`.

In the GitHub repository settings, enable GitHub Pages with `GitHub Actions` as the source. If you want Supabase account sync on GitHub Pages, add repository secrets:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

If these secrets are not configured, the app still works in local favorites mode.

### 方式四：本地源码运行

Windows users who want to run the source code locally can:

1. Install Node.js LTS.
2. Download the project ZIP or run `git clone`.
3. Open PowerShell in the project folder.
4. Run:

```powershell
npm install
npm run dev
```

5. Open this URL in a browser:

```text
http://localhost:5173/
```

## Features

- Two-level filtering: market first, then function category.
- Bilingual UI: English and 中文.
- Search across English names, Chinese names, descriptions, categories, tags, and notes.
- Guest favorites persist in `localStorage`.
- Optional Supabase Auth + database sync gives each signed-in user a private favorites list.
- Priority labels: `core`, `useful`, and `optional`.
- Quick Workflows open a group of research websites in new tabs.
- The app remains front-end only. Supabase is optional and configured through environment variables.

## Project Structure

```text
src/
  main.tsx
  App.tsx
  data/
    markets.ts
    sites.ts
    workflows.ts
  hooks/
    useAuth.ts
    useFavorites.ts
  lib/
    supabaseClient.ts
  components/
    AuthBar.tsx
    CategoryFilter.tsx
    MarketTabs.tsx
    Navbar.tsx
    QuickWorkflows.tsx
    SearchBar.tsx
    SiteCard.tsx
  utils/
    storage.ts
```

## Favorites Modes

### Local Guest Favorites

If Supabase is not configured, or the user is not signed in, favorites are saved locally in the browser with this key:

```text
quant_navigator_guest_favorites
```

The app will continue to work without Supabase. In this mode the UI shows that it is using local favorites.

Because local favorites use browser `localStorage`, favorites do not sync across different computers, browsers, or operating-system users. This also means different Windows users on different browsers will not affect each other.

### Multi-User Favorites

When Supabase is configured and a user signs in with email magic link, favorites are loaded from the `user_favorites` table. Each row is scoped by `user_id`, and Supabase Row Level Security ensures users can only view, insert, and delete their own favorites.

Signed-in users can click `导入本机收藏到账号` / `Import local favorites` to copy guest favorites into the current account. Duplicate `site_id` values are ignored by the database constraint.

## Supabase Setup

Install the Supabase client:

```bash
npm install @supabase/supabase-js
```

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Set these values:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Restart `npm run dev` after changing `.env`.

Do not commit `.env`. Commit `.env.example` only. On Vercel, Netlify, or GitHub Pages, configure these values in the platform's Environment Variables or repository secrets:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

If these variables are missing, the deployed app will not crash. It will automatically show local favorites mode and hide the unavailable login form.

### Supabase SQL

Run this SQL in the Supabase SQL editor:

```sql
create table if not exists user_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  site_id text not null,
  created_at timestamptz default now(),
  unique(user_id, site_id)
);

alter table user_favorites enable row level security;

create policy "Users can view their own favorites"
on user_favorites for select
using (auth.uid() = user_id);

create policy "Users can insert their own favorites"
on user_favorites for insert
with check (auth.uid() = user_id);

create policy "Users can delete their own favorites"
on user_favorites for delete
using (auth.uid() = user_id);
```

### Auth Settings

In Supabase Auth, enable email magic link sign-in. Add your local development URL, usually `http://localhost:5173` or `http://127.0.0.1:5173`, to the allowed redirect URLs if needed.

## Testing Favorites

1. Start with no `.env` file and run `npm run dev`.
2. Favorite a few sites while signed out. Confirm the app shows local favorites mode and the favorite count changes.
3. Configure Supabase, restart the dev server, and send a magic link to user A.
4. After signing in as user A, favorite and unfavorite sites. Confirm rows appear in `user_favorites` with user A's `user_id`.
5. Click `导入本机收藏到账号` / `Import local favorites` and confirm guest favorites are copied into user A's account.
6. Sign out. Confirm user A's remote favorites disappear and the app returns to guest local favorites.
7. Sign in as user B. Confirm user B does not see user A's favorites.
8. Favorite different sites as user B and confirm both users' rows remain isolated by `user_id`.

## Add a New Website

Open `src/data/sites.ts` and add a `Site` object:

```ts
{
  id: 'example-data-tool',
  name: 'Example Data Tool',
  nameZh: '示例数据工具',
  url: 'https://example.com',
  description: 'Short English description.',
  descriptionZh: '简短中文说明。',
  market: 'A股',
  category: 'Market Data / 行情数据',
  tags: ['行情', '数据', 'api'],
  priority: 'useful',
  noteZh: '说明它在投研工作流里的具体用途。'
}
```

Keep `id` unique. Use stable lowercase IDs because workflows refer to sites by `id`.

## Add an A-Share Website

For A-share resources, set:

- `market: 'A股'`
- `descriptionZh` with a clear Chinese explanation
- `noteZh` with the practical use case
- `priority: 'core'` for daily high-frequency or authoritative sources

Good categories for A-share additions include `Market Data / 行情数据`, `Filings / 公告披露`, `Regulatory / 监管交易所`, `Backtesting / 回测平台`, and `Data Vendor / 数据供应商`.

## Add a Market

Markets are defined in `src/data/markets.ts`.

1. Add the new market to the `Market` type.
2. Add it to the `markets` array.
3. Add display labels in `marketLabels`.
4. Use the new market value in `src/data/sites.ts`.

## Add a Category

Categories are also defined in `src/data/markets.ts`.

1. Add the new category to the `Category` type.
2. Add it to the `categories` array.
3. Add English and Chinese labels in `categoryLabels`.

## Add a Workflow

Open `src/data/workflows.ts` and add a workflow:

```ts
{
  id: 'a-share-example-workflow',
  title: 'A-Share Example Workflow',
  titleZh: 'A股示例工作流',
  market: 'A股',
  description: 'Open a useful set of research websites.',
  descriptionZh: '打开一组常用投研网站。',
  siteIds: ['eastmoney', 'cninfo', 'joinquant']
}
```

Each `siteIds` value must match an existing `id` in `src/data/sites.ts`.

## Language Switching

Use the top-right language toggle:

- `中文` switches to the China private-fund research terminal style.
- `English` switches labels, copy, and actions back to English.

The app currently defaults to Chinese.

## Future Extensions

- Connect local backtesting reports.
- Connect a local factor library.
- Add research report parsing.
- Add A-share data download scripts.
- Evolve into a personal quantitative research workstation.
