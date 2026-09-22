# The Four Big Tests

A light, mobile-first assessment app with four top tabs, offline installation, named progress saves, unlimited retakes, dated result history, private notes, and JSON backup import/export. There is no app-imposed save limit; device storage capacity still applies.

## The four assessments

| Test | Length | What the app reports |
| --- | --- | --- |
| Personality | 120 statements, about 15–20 minutes | IPIP-NEO-120: five broad traits and 30 facets |
| IQ & reasoning | 40 questions, five 7-minute sections | Raw accuracy and five reasoning domains; separate untimed practice mode |
| Political preferences | Exactly 101 statements, about 20–25 minutes | Two compass axes and 12 policy areas |
| Dark triad | 28 statements, about 4–6 minutes | SD4 Machiavellianism, narcissism, and psychopathy-related scores; sadism reported separately |

**Accuracy boundary:** A polished questionnaire is not automatically a validated assessment. The personality and SD4 instruments have published research; their implementation, interpretation, and intended population still need study. The revised political questions and original reasoning generator are **not empirically validated**. The reasoning test deliberately does **not invent a standardized IQ score, percentile, or clinical classification**. A culture-free test cannot be promised. This app is for self-reflection, not diagnosis, hiring, educational placement, or another consequential decision.

## Run and build

Node 22 or newer. The web app has no production dependencies and no external fonts, tracking, API keys, or backend.

```sh
npm ci
npm test
npm run dev
# http://localhost:4173

npm run build
node scripts/serve.mjs --dist
```

The production site is in `dist/`. All URLs are relative, including the manifest, modules, and service worker, so it works under the GitHub Pages repository subpath.

## Publish from this repository

1. In **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source. The repository owner must enable this setting once; the workflow's standard token cannot enable Pages for a new repository.
2. The **Deploy installable app** workflow tests, builds, and publishes the app on pushes to `main`. Once Pages is enabled, rerun that workflow if its first run failed during setup.
3. Open the actual deployment URL shown by the workflow or Pages settings. The usual URL for this repository is `https://owningturtle287.github.io/The-Four-Big-Tests/`; availability depends on Pages activation and a successful deployment.

The separate **Verify app** workflow uploads a static web build as an artifact. The repository includes no secrets or saved test responses.

## Install on a phone

- **iPhone/iPad:** Open the deployed app in Safari → Share → Add to Home Screen → Add.
- **Android:** Open it in Chrome → the app's Install control, or Chrome menu → Install app / Add to Home screen.
- The initial successful online load caches the app for offline use. Cache updates activate after older app tabs close, avoiding mixed question versions during an attempt.
- Browser and installed-app storage can differ. Export and import a backup to transfer existing saves. Removing site data or the installation can erase local saves.

## Native Android and iOS

`native/` contains a pinned Capacitor 8 configuration, lockfile, native export/share bridge, platform icon generator, and reproducible project setup. Generated native projects are not checked in; the workflows and commands below recreate them.

```sh
cd native
npm ci
npm run build
npx cap add android
node icons.mjs android
npx cap sync android
npx cap open android

# On macOS with Xcode 26 or later:
npx cap add ios
node icons.mjs ios
npx cap sync ios
npx cap open ios
```

**Android:** The **Build Android app** workflow produces a debug-signed APK in its downloadable artifact. It is a test build, not a Google Play release. For release distribution, select your own permanent signing key and build a signed AAB or APK. Debug keys may differ between CI runs, so later debug builds may require uninstalling an earlier build; export saves first.

**iOS:** The **Prepare iOS app** manual workflow generates a downloadable Xcode project. Choose your Apple development team and signing profile in Xcode. Add the included `PrivacyInfo.xcprivacy` to the App target and review platform declarations before distribution. TestFlight/App Store delivery requires the user's Apple Developer account, signing, and Apple review. An unsigned archive is not presented as an installable iPhone app. The home-screen web app is the immediately available installation route once Pages is enabled.

## Persistence and timing

- IndexedDB stores each complete session independently, including question order, generated puzzle parameters, responses, notes, flags, version, name, and dates.
- Answers save as they are selected. Storage errors are visible and offer export; the app does not falsely report successful persistence.
- A timed reasoning section stores its absolute deadline. Reloading, backgrounding, saving, or copying a draft does not reset it. Expired unanswered items receive zero. The next section does not start until the user begins it, so breaks are possible between sections.
- Completed sessions cannot be edited. Rename, duplicate, export, or retake them instead.
- Imports are validated before writing. They create new IDs rather than overwriting existing saves. Reasoning items are rebuilt from trusted parameters instead of trusting an imported answer key or markup.
- Puzzles already generated on this device are recorded separately from saves. Finite families eventually exhaust; the generator then permits a repeated variant while still preventing duplicates within a form. It does not impose a retake limit or promise infinite uniqueness.
- Scores use the stored responses and a versioned scoring definition. Importing an unknown instrument version is rejected rather than silently rescored.

## Assessment design and provenance

- [Assessment methods and validation plan](docs/ASSESSMENT_DESIGN.md)
- [All 101 original and revised political statements](docs/POLITICAL_REVISIONS.md)
- [Original supplied political package and instrument keys](docs/source/)
- [Third-party notices](THIRD_PARTY_NOTICES.md)

The original political graph's economic/governance structure, 12 facets, and signed weights have been integrated into the new app. The app's new light-theme compass is responsive and includes the same conceptual quadrants. The original package remains in `docs/source/` for auditability.

## Verification

Run `npm test` for reverse-scoring endpoints, incomplete-scale handling, political normalization and coverage, abstract transformations, generated-puzzle structure and solutions, repeat avoidance, timer deadlines, and backup integrity. The generator checks examine 20,000 variants across all 20 task families. These are software correctness tests, **not evidence of psychometric validity**.

## File map

```text
app/               Static app, assessment engines, data, manifest, icons
scripts/           Build, dev server, reproducible political revisions
tests/             Assessment and persistence-contract tests
native/            Reproducible Android/iOS packaging and native backup sharing
docs/              Methodology, validation plan, sources, revision audit
.github/workflows/ Verification, Pages deployment, Android build, iOS preparation
```
