# Quant Navigator

Quant Navigator is a React + TypeScript + Vite + Tailwind CSS quick-launch assistant for quantitative research websites. It helps users find, filter, favorite, and open web resources for A-shares, US stocks, Hong Kong stocks, crypto, macro research, factor research, papers, and backtesting tools.

It is intentionally not a local project manager, local code executor, or command runner. The product surface is website navigation and quick workflow launching only.

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

## Windows 离线版

Quant Navigator also supports an Electron desktop build for Windows. This keeps the Web version unchanged, but allows Windows users to download an `.exe` and open the app without Vercel, proxy tools, Node.js, or command-line setup.

### 普通用户

1. Download the Quant Navigator Windows package from GitHub Actions artifacts or a GitHub Release.
2. Installer version: double-click the `.exe` and follow the installer.
3. Portable version: double-click the `.exe` to run directly.
4. Node.js is not required.
5. Command-line usage is not required.
6. Vercel access is not required.
7. The app can start offline because the UI is bundled into the desktop app.
8. Clicking website links opens the system default browser, not an internal Electron browser window.

### 开发者

Run Electron in development mode:

```bash
npm run electron:dev
```

Build Windows installer and portable packages:

```bash
npm run electron:build:win
```

Build only the portable target:

```bash
npm run electron:build:win-portable
```

Recommended path: use GitHub Actions on `windows-latest` to build Windows packages. Cross-building Windows packages locally from macOS can be unstable because Electron Builder may need Windows-specific tooling and signing behavior.

### GitHub Actions 下载 Windows 包

This repository includes `.github/workflows/windows-release.yml`.

To download the package:

1. Push to `main`, or manually run the `Build Windows Desktop App` workflow from GitHub Actions.
2. Open the completed workflow run.
3. Download the artifact named `quant-navigator-windows`.
4. Extract the artifact zip.
5. Run the `.exe`.

### Windows 桌面版收藏说明

If Supabase is not configured, favorites are stored in Electron local storage on the current machine. Different computers do not sync favorites automatically. To sync favorites across machines, configure Supabase and sign in with the same account.

## 中国大陆用户访问方案

Vercel 适合海外用户和快速发布，但在中国大陆访问可能需要代理或出现不稳定。国内用户建议使用腾讯云 EdgeOne Pages、腾讯云 COS 静态网站或阿里云 OSS 静态网站部署 `dist/`。

- 海外用户：优先使用 Vercel。
- 中国大陆用户：建议使用腾讯云或阿里云静态托管。
- 离线 Windows 用户：可以使用本地静态包，后续也可以封装 Electron 桌面版。

未配置 Supabase 时，收藏仍保存在用户自己的浏览器 `localStorage` 中。国内部署和海外部署的数据互不影响；只有当多个部署配置同一个 Supabase 项目时，登录账号收藏才会同步到同一份远程数据。

更多国内部署细节见：

- [中国大陆可访问部署方案](docs/deploy-china.md)
- [Deployment Checklist](docs/deployment-checklist.md)

## Features

- Two-level filtering: market first, then function category.
- Bilingual UI: English and 中文.
- Search across English names, Chinese names, descriptions, categories, tags, and notes.
- Command Palette opens with `Cmd+K` / `Ctrl+K` to search sites and workflows from anywhere in the app.
- Guest favorites persist in `localStorage`.
- Optional Supabase Auth + database sync gives each signed-in user a private favorites list.
- Pin Board gives the home page a compact quick-launch area for the user's most-used websites.
- Pin Board pins persist locally with browser or Electron `localStorage` and are separate from favorites.
- Priority labels: `core`, `useful`, and `optional`.
- Quick Workflows group research paths by scenario, show bilingual names, market, website count, priority, and tags.
- Workflow cards can expand their website list, open all included websites, filter the main resource list to those websites, and save workflow favorites.
- Workflow favorites persist locally with browser or Electron `localStorage`.
- The app remains front-end only. Supabase is optional and configured through environment variables.
- No local folder opening, local project opening, local command execution, or backend service is included.

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
    usePinnedSites.ts
  lib/
    supabaseClient.ts
  components/
    AuthBar.tsx
    CategoryFilter.tsx
    CommandPalette.tsx
    MarketTabs.tsx
    Navbar.tsx
    PinBoard.tsx
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

Workflow favorites are also local-only and saved with this key:

```text
quant_navigator_workflow_favorites
```

Pin Board entries are a separate local quick-launch list and are saved with this key:

```text
quant_navigator_pinned_sites
```

The app will continue to work without Supabase. In this mode the UI shows that it is using local favorites.

Because local favorites use browser `localStorage`, favorites do not sync across different computers, browsers, or operating-system users. This also means different Windows users on different browsers will not affect each other.

### Pin Board vs Favorites

- Favorites are for long-term resources the user wants to track or review later.
- Pins are for the home page's fastest launch area.
- A website can be both favorited and pinned, but the two states are stored and managed independently.
- Pins are local-only in both Web and Electron builds and do not require Supabase.

## Command Palette

Press `Cmd+K` on macOS or `Ctrl+K` on Windows/Linux to open the Command Palette.

- Search websites and workflows in one place.
- Press `Enter` on a site result to open that website.
- Press `Enter` on a workflow result to filter the main website list to that workflow's sites.
- Workflow results include an explicit `Open all` / `打开全部` button for intentionally opening every website in the workflow.
- Aliases make short commands work, such as `dfcf` for 东方财富, `cninfo` for 巨潮资讯, `tv` for TradingView, and `fred` for FRED.
- The palette is front-end only and does not open local folders, local projects, or run shell commands.

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
  aliases: ['example', 'data'],
  priority: 'useful',
  noteZh: '说明它在投研工作流里的具体用途。'
}
```

Keep `id` unique. Use stable lowercase IDs because workflows refer to sites by `id`. Add `aliases` for common abbreviations, pinyin, ticker-style shorthand, or vendor nicknames that users may type into the Command Palette.

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
  group: 'A股每日',
  market: 'A股',
  priority: 'useful',
  tags: ['行情', '数据', 'daily'],
  aliases: ['daily', 'watch'],
  description: 'Open a useful set of research websites.',
  descriptionZh: '打开一组常用投研网站。',
  siteIds: ['eastmoney', 'cninfo', 'joinquant']
}
```

Each `siteIds` value must match an existing `id` in `src/data/sites.ts`. Use one of the existing workflow groups in `src/data/workflows.ts` so the card appears under the right scenario.

## Language Switching

Use the top-right language toggle:

- `中文` switches to the China private-fund research terminal style.
- `English` switches labels, copy, and actions back to English.

The app currently defaults to Chinese.

## Future Extensions

- Add more curated web workflows for specific research routines.
- Improve workflow search and tag filtering.
- Add exportable web resource collections.
- Add more bilingual notes for how each website supports quant research.
