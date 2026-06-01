# Quant Navigator User Guide

Quant Navigator is a quick-launch assistant for quantitative research websites. It helps you search, filter, pin, favorite, and open useful Web resources.

It is not a local project manager. It does not open local folders and does not run local commands.

## Web Version

Open the published Quant Navigator URL in your browser.

Common actions:

- Use the search box to find websites by Chinese name, English name, URL, tag, alias, or access label.
- Use Market, Category, and Access filters to narrow the website list.
- Click `Open` / `打开` on a website card to open that site.
- Use Quick Workflows to filter or open groups of research websites.
- Use Pin Board for your fastest home-page launch shortcuts.

## Windows Version

Download the Windows `.exe` from the GitHub Release page.

- Portable version: run directly without installation. Good for quick trial use.
- Setup version: install it like a normal desktop app. Good for long-term use.

The Windows version bundles the Quant Navigator UI. Node.js, Git, and command-line setup are not required for normal users.

Website links open in your system default browser.

## Favorites, Pins, and Workflow Favorites

Quant Navigator has three local saved states:

- Favorites: long-term resources you want to keep watching.
- Pins: home-page quick-launch entries in Pin Board.
- Workflow favorites: saved Quick Workflows.

When Supabase sync is not configured, these are saved in the current browser or Windows desktop app localStorage:

```text
quant_navigator_guest_favorites
quant_navigator_pinned_sites
quant_navigator_workflow_favorites
```

Local data does not automatically sync across different browsers, computers, or Windows users.

## Command Palette

Press:

- `Cmd+K` on macOS.
- `Ctrl+K` on Windows or Linux.

Then type a keyword, alias, market, category, or access label.

Examples:

- `dfcf` finds 东方财富.
- `cninfo` finds 巨潮资讯.
- `tv` finds TradingView.
- `proxy` finds sites marked as likely needing proxy access.

Press `Enter`:

- On a website result: opens the website.
- On a workflow result: filters the site list to that workflow.

Workflow results also include an explicit `Open all` / `打开全部` button when you intentionally want to open every site in that workflow.

## Why Some Sites Need Proxy, Login, or Paid Access

Access Tags are manual hints, not live network tests.

- `可能需要代理` / `Proxy likely`: the site may be difficult to access from some networks.
- `需要登录` / `Login`: the site commonly requires an account for useful access.
- `付费终端` / `Paid`: meaningful use may require a paid product or subscription.
- `机构权限` / `Institutional`: access may depend on an institution or licensed account.

Quant Navigator does not automatically ping sites or detect whether a site is currently reachable. This avoids CORS issues and false conclusions caused by temporary network differences.

## Reset Local Settings

Open `设置 / 帮助` / `Settings / Help` in the top navigation.

You can clear:

- Favorites.
- Pins.
- Workflow favorites.

You can also choose `重置全部本地设置` / `Reset all local settings`. The app asks for confirmation before clearing all local settings.

Reset only affects the current browser or Windows desktop app. It does not affect other computers or a remote synced account.
