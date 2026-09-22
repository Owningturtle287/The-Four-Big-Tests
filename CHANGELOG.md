# Changelog

App versions are semantic and stored in each save. A new form receives the current instrument version; older saved or imported forms retain the question wording and scoring that produced them.

## 2.0.0 — 2026-09-22

### Reasoning `reasoning-2.0`

- Increased the timed form from 40 to 50 questions: five sections of ten, 12 minutes per section. Practice remains untimed.
- Increased answer choices from four to six, with new letter labels A–F and six distinct alternatives per generated question.
- Added ten advanced task families, two per domain: rotated pattern combinations, multi-operation sequences, two-axis paper folding, transformations, group deductions, rankings, simultaneous equations, and composite row rules. Increased the difficulty of several original families, including alternating steps, six-object order, and multi-term numeric matrices.
- Added a **provisional IQ-style numeric estimate** to timed results. Formula: round to nearest five points of `100 + 15 × (correct − 25) / 8`. The assumed midpoint and spread are author-set, not measured; this number is not a standardized IQ or a comparison with anyone else. Raw accuracy and all five domain results remain visible.
- `reasoning-1.0` saves retain all 40 original questions, old options and deadlines, and raw-only reporting. Imports reconstruct original questions from their seeds.

### Dark profile `dark-behavior-2.0`

- Reworded all 28 prompts as first-person behavior, reactions, or motives; replaced generic agreement labels with self-description labels.
- Retained separate seven-item profiles for Machiavellianism, narcissism-related attitudes, psychopathy-related behaviors, and supplementary sadism.
- The new wording is an **unvalidated adaptation**. See [paired item revisions](docs/DARK_ITEM_REVISIONS.md). Original `sd4-paulhus-2020` saves still use the published items and scoring.

### App and compatibility

- Bumped web and native package versions to 2.0.0, updated methodology and result explanations.
- Old completed saves and in-progress sessions open with their own version's wording, timers, and question counts; version 1 backups remain importable.
- Added tests for six-choice generation, advanced solution integrity, provisional score endpoints, section timing, and legacy save imports.

## 1.0.0 — 2026-09-22

- Initial four-test release: IPIP-NEO-120, 40-question original reasoning battery, 101 revised political questions, and the original 28-item SD4.
- Local progress and result history, backups, offline install, Android build, and iOS project generation.
