# Release Checklist

Use this checklist when preparing a stable Quant Navigator release for Web and Windows users.

## 1. Version

- Confirm `package.json` has the intended version, for example `0.1.0`.
- Use the same version in the GitHub Release tag, for example `v0.1.0`.

## 2. Local Build Check

1. Install dependencies:

```bash
npm install
```

2. Build the Web app:

```bash
npm run build
```

3. Confirm the generated output exists:

```text
dist/index.html
dist/assets/
```

## 3. Windows Build

Preferred path: use GitHub Actions on Windows.

1. Push the release branch or merge to `main`.
2. Run the `Build Windows Desktop App` workflow from GitHub Actions, or let it run automatically if configured.
3. Download the `quant-navigator-windows` artifact from the workflow run.

Local fallback for developers:

```bash
npm run electron:build:win
```

## 4. Deployment Checks

- Check GitHub Pages and confirm the Web version loads.
- Check Vercel and confirm the Web version loads.
- Search for a known site such as `东方财富`.
- Open Command Palette with `Cmd+K` / `Ctrl+K`.
- Confirm Pin Board, favorites, workflow filtering, and access filters behave normally.

## 5. Windows Artifact Checks

1. Extract the downloaded Windows artifact.
2. Test the Portable `.exe`.
3. Test the Setup `.exe` on a Windows machine.
4. Confirm the app opens without Node.js or command-line setup.
5. Confirm website links open in the system default browser.
6. Confirm local favorites, pins, and workflow favorites persist after restart.

## 6. GitHub Release

1. Create a GitHub Release using the version tag, for example `v0.1.0`.
2. Upload the Setup `.exe`.
3. Upload the Portable `.exe`.
4. Write release notes.
5. Include links to the Web version and user guide.

## 7. Release Notes Template

```text
## Quant Navigator v0.1.0

### Highlights
- Web quick-launch assistant for quant research websites.
- Windows offline desktop package.
- Search, filters, Pin Board, Quick Workflows, Command Palette, and Settings / Help.

### Downloads
- Setup exe: recommended for long-term Windows use.
- Portable exe: recommended for no-install trial use.

### Notes
- This is a front-end quick launcher, not a local project manager or command runner.
- Favorites, pins, and workflow favorites are stored locally unless Supabase sync is configured.
```
