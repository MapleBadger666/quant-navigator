# Quant Navigator

[Live demo](https://quant-navigator-two.vercel.app) ·
[User guide](docs/user-guide.md) ·
[Deployment checklist](docs/deployment-checklist.md)

Quant Navigator is a bilingual React/TypeScript research-resource navigator for
market data, factor research, academic papers, backtesting tools, and
quantitative-research workflows. It combines structured market/category
filtering, full-text search, customizable shortcuts, saved resources, and
workflow-based navigation in deployable web and desktop interfaces.

The project is a productivity application for organizing research resources. It
does not run local code, manage local projects, execute commands, or implement a
trading/backtesting engine.

## Highlights

- Bilingual English/Chinese UI with a Chinese-first default.
- Market tabs for A-shares, US equities, Hong Kong equities, crypto, and general tools.
- Category and access filters for market data, filings, macro, papers, factors, backtesting, vendors, and more.
- Full-text search across names, Chinese names, descriptions, tags, aliases, notes, categories, markets, and access hints.
- Quick Workflows for common research paths, with open-all, filter, expand, and save actions.
- Command Palette via `Cmd+K` / `Ctrl+K` for site and workflow search from anywhere in the app.
- Favorites, Favorite Sites, Pin Board, workflow favorites, and custom web shortcuts.
- Optional Supabase account sync for favorites, with local guest mode when Supabase is not configured.
- Static web deployment plus Electron packaging for Windows desktop builds.

## Research Coverage

Quant Navigator organizes curated website resources across verified markets and
categories from `src/data/markets.ts` and `src/data/sites.ts`.

| Coverage | Examples |
| --- | --- |
| Markets | A-shares, US stocks, Hong Kong, crypto, general tools |
| Data and filings | Market data, data vendors, exchange/regulatory filings |
| Research | Academic papers, factor research, macro/news resources |
| Tools | Backtesting platforms, visualization tools, AI/ML-for-finance resources |
| Access context | Mainland CN, global, proxy-likely, login, paid, institutional, free |

## Product Workflow

```text
Choose market
  -> filter research category or access condition
  -> search resources
  -> launch a Quick Workflow or Command Palette result
  -> save favorites, pins, workflows, or custom shortcuts
```

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS, PostCSS |
| Desktop | Electron, electron-builder |
| Optional sync | Supabase Auth and `user_favorites` table |
| Build/release | npm scripts, GitHub Pages workflow, Windows build workflow |

## Key Features

### Search and Filtering

Users can narrow the resource library by market, category, access tag, favorites
status, workflow selection, or free-text query. Search includes English and
Chinese names, descriptions, tags, aliases, notes, categories, markets, and
access labels.

### Quick Workflows

Workflow cards group sites into common research paths such as A-share daily
monitoring, filings research, US market intelligence, macro research, factor
research, backtesting tools, academic-paper scanning, fund/private-fund
research, and crypto market intelligence.

### Command Palette

The Command Palette searches sites and workflows in one modal. Site results open
external URLs; workflow results can filter the main resource list or open the
workflow's sites intentionally.

### Favorites and Pin Board

Favorites create a longer-term resource library and appear in a compact Favorite
Sites section. Pins are separate local quick-launch entries for the home page's
Pin Board.

### Custom Shortcuts

Users can add, edit, delete, export, and import their own web shortcuts. Custom
shortcuts participate in search, filters, favorites, pins, the Command Palette,
and result counts alongside built-in resources.

### Optional Sync

Without Supabase, favorites, pins, workflow favorites, custom shortcuts, and
preferences are stored in the current browser or Electron local storage. When
Supabase is configured and a user signs in, site favorites can sync through the
`user_favorites` table; pins, workflow favorites, custom shortcuts, and backup
files remain local.

## Architecture

Quant Navigator is primarily a frontend application. Static TypeScript data
defines markets, categories, resources, and workflows. React components combine
that data with local state and hooks for filtering, search, favorites, pinned
sites, workflow favorites, custom shortcuts, onboarding, settings, and optional
Supabase-backed favorite sync.

Electron packages the built web app for desktop use. External resource links
open in the user's default browser.

## Quick Start

```bash
npm install
npm run dev
npm run build
```

Useful optional commands:

```bash
npm run preview
npm run electron:dev
npm run electron:build:win
```

## Deployment

The app builds to static files in `dist/`, so it can be deployed on Vercel,
GitHub Pages, Netlify, or another static host. The repository also includes:

- `.github/workflows/deploy.yml` for GitHub Pages.
- `.github/workflows/windows-release.yml` for Windows Electron artifacts.
- Electron Builder targets for NSIS installer and portable Windows executables.

Detailed deployment and regional hosting notes live in the docs rather than the
root README.

## Delivery Channels

| Channel | Status |
| --- | --- |
| Vercel demo | Public demo is configured in the GitHub repository homepage metadata. |
| Static hosting | `npm run build` outputs a Vite static bundle in `dist/`. |
| GitHub Pages | Automated workflow is included for the `main` branch. |
| Windows desktop | Electron Builder configuration supports NSIS and portable `.exe` targets. |

## Privacy and Data

Quant Navigator is frontend-first. In guest mode, settings and saved resources
stay in the current browser or Electron local storage. If Supabase environment
variables are configured and the user signs in, site favorites can be stored
remotely per user. The app does not probe website availability in real time and
does not run local shell commands.

## Project Structure

```text
src/
  data/          Markets, categories, sites, and workflows
  components/    Filters, cards, workflows, command palette, settings, onboarding
  hooks/         Auth, favorites, pins, workflow favorites, custom shortcuts
  lib/           Supabase client
  utils/         Local storage, backup, and import/export helpers
electron/        Desktop main and preload scripts
docs/            User, deployment, China hosting, and release documentation
```

## Documentation

- [User Guide](docs/user-guide.md) - product usage, workflows, shortcuts, and settings.
- [Deployment Checklist](docs/deployment-checklist.md) - static deployment checks.
- [China Deployment Guide](docs/deploy-china.md) - mainland-accessible hosting notes.
- [Release Checklist](docs/release-checklist.md) - web and Windows release flow.

## Limitations

- Resource access tags are manually curated hints, not live network or paywall checks.
- The app launches websites; it does not ingest market data or backtest strategies.
- Guest-mode data is local to the current browser, computer, or Electron profile.
- Supabase sync covers site favorites only in the current implementation.
- Windows desktop packages are built through Electron and GitHub Actions; no macOS/Linux desktop packaging is documented here.
- The repository does not currently include a license file.
