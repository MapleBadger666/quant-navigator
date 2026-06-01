# Deployment Checklist

Use this checklist before publishing Quant Navigator to Vercel, Netlify, GitHub Pages, Tencent Cloud, Alibaba Cloud, or any static hosting platform.

## Build Check

1. Install dependencies:

```bash
npm install
```

2. Build the static site:

```bash
npm run build
```

3. Confirm the output exists:

```text
dist/index.html
dist/assets/
```

4. Confirm `dist/index.html` references assets with relative paths such as:

```text
./assets/...
```

## Upload Check

1. Upload the contents of `dist/` to the static hosting root.
2. Make sure `index.html` is at the root of the deployed site.
3. Make sure `assets/` is deployed next to `index.html`.
4. If using CDN, refresh or purge cache after uploading a new version.

## Runtime Check

Open the deployed URL and test:

- Page loads without a blank screen.
- Search works with English and Chinese keywords.
- Market tabs work: A股, 美股, 港股, 加密, 通用工具.
- Category filters work.
- Favorite and unfavorite work.
- `只看收藏` / `Favorites only` works.
- Quick Workflows button shows a request confirmation and opens target websites.
- Language switch works.
- If Supabase is not configured, the local favorites mode notice appears and no disabled login form is shown.
- If Supabase is configured, email magic link login appears and account favorites sync works.

## Environment Variables

Only configure these if multi-user synced favorites are needed:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

If they are missing, Quant Navigator still runs in local browser favorites mode.
