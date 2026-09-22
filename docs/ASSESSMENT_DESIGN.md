# Assessment design and validation status

## What “best” can responsibly mean here

The implementation favors transparent scoring, published instruments where reuse is permitted, enough questions to represent different facets, clear response instructions, item-version tracking, and honest feedback. It does not claim that an invented hybrid is more accurate than established measures. More questions, more polished graphics, and mathematically correct scoring do not establish reliability or validity.

## Personality: IPIP-NEO-120

Use Johnson's 120-item public-domain representation of the NEO facet structure, with its original English wording and key. Four items represent each of 30 facets; 24 items represent each broad domain. This provides substantially more facet detail than a very short Big Five questionnaire without imposing 300 items. The broad domains are not discrete personality types. A generated descriptive phrase is a reading aid, not a new validated typology.

Responses 1–5; negative keys use 6−response. Domain and facet means are transformed using (mean−1)×25. All items of a scale must be answered to report that scale. No percentiles are reported because the app has not implemented and justified population-matched norms. “Emotional sensitivity” is the UI label for Neuroticism. Original facet names remain in detail; Depression is not diagnosed and Intellect is not tested intelligence. Liberalism contains political/cultural wording and must not be confused with the separate policy test.

The four items in each facet are distributed through the assessment. This UI/order and interpretation still need app-level validation. Do not claim research reliability values apply automatically to this app or to each individual result.

Primary sources:

- https://ipip.ori.org/30FacetNEO-PI-RItems.htm
- https://ipip.ori.org/newScoringInstructions.htm
- https://ipip.ori.org/ (public-domain reuse statement)
- Johnson, J. A. (2014). Measuring thirty facets of the Five Factor Model with a 120-item public domain inventory. *Journal of Research in Personality*, 51, 78–89.

## IQ & reasoning: original culture-reduced battery

Version 2 has 50 questions in five sections, ten per section, six options per question. Each section samples eight questions from four task families at two authored complexity levels plus two questions from new advanced families. The timed mode allows 12 minutes per section (60 minutes total); practice is untimed. Timing and difficulty are design choices awaiting pilot testing, not measured norms or calibrated item parameters.

| Domain | Families |
| --- | --- |
| Visual patterns | Exclusive-OR and overlay matrices; rotations; numeric row patterns; rotated XOR; subtract then rotate |
| Number sequences | Alternating steps; multiplication with offset; changing differences; interleaved series; quadratic differences; alternating operations |
| Spatial | Mental rotation; reflection; paper folding; cube nets; two-axis folding; composite transforms |
| Logic | Ordering; categorical deduction; symbol-value inference; balances; multistep group deductions; weight ranking |
| Quantitative | Numeric rule tables; proportions; input/output rules; missing-value equations; simultaneous equations; composite row formulas |

Each generated item stores its family, seed, authored level, stimulus, shuffled alternatives, correct key, and explanation. The generator checks unique answer choices and avoids repeated stimuli within a form; past locally exposed patterns are avoided when possible. Some finite visual families exhaust sooner than others and may repeat on extensive retakes. Family diversity is 30; parameterized variants are not calibrated psychometric items.

Correct = 1, incorrect or omitted = 0. Timed version-2 results display an experimental IQ-style number using `round_to_nearest_5(100 + 15 × (raw_correct − 25) / 8)`. The hypothetical midpoint of 25/50 and spread of eight items were chosen by design. They **are not measured norms**; the number cannot indicate standing relative to the general population, and a five-point rounding does not make it reliable. Practice and earlier 40-item results report raw accuracy without this conversion. No percentile, speed bonus, or clinical label is reported. Different generated forms have not been equated. Even if an arbitrary web sample averages 25/50, it cannot define 100 IQ. Age-appropriate representative norms, calibration, reliability, practice effects, fairness, and validity must be studied before a standardized IQ can be claimed.

Why not “no culture”: spatial conventions, schooling, numeric literacy, English instructions, visual acuity, dexterity, device format, and prior puzzle exposure affect results. The battery reduces vocabulary/trivia content but cannot eliminate cultural influences. It is also not a full clinical cognitive battery: there is no standardized verbal-comprehension, processing-speed, or working-memory assessment. Color is not needed to solve the puzzles; tile descriptions are exposed to assistive technology, but alternative modalities are not assumed equivalent.

Design background only: Condon & Revelle (2014), *The International Cognitive Ability Resource: Development and initial validation of a public-domain measure*. https://www.personality-project.org/revelle/publications/condon.icar.14.pdf . No ICAR validation statistics or norms are transferred to these new tasks.

## Politics: revised 101-item instrument

The supplied version is preserved in `source/`. Every item was reviewed. Rewrites replace broad abstractions with named actors and actions, specify scope/exception, and make selected tradeoffs explicit. The full paired original/revised audit is `POLITICAL_REVISIONS.md`. The original IDs, weights, and facet assignments are retained for traceability, but some new scenarios narrow the original concept; **this is a revised, unvalidated instrument**.

Response choices are Strongly disagree, Disagree, Neither agree nor disagree, Agree, Strongly agree, and a separate Need more context/cannot decide. Neutral is a real zero contribution. Context-needed is missing, never centrist. Optional notes are retained but do not affect scoring. Avoid live compass feedback during answering to reduce answer-shaping.

For axis x or y:

`score = 10 × Σ((answer−3) × coefficient) / (2 × Σ(abs(coefficient)))`

Only valid scored responses contribute to either sum. At least 70% of each axis's total absolute weight is required for a reported overall placement. Facets require at least four of their eight responses. These are conservative display rules, not estimated confidence or accuracy. There is no response-coherence reliability score, since supporting one policy and rejecting a differently scoped counterpart need not be inconsistent. Six economic facets, six governance facets, and five cross-axis items remain.

Do not infer party membership or predict voting: party systems differ across jurisdictions, and economic ownership, redistribution, trade, civil liberties, institutional checks, localism, and social inclusion do not perfectly reduce to two axes. Distinguish a mix of extremes from consistent moderate preferences by inspecting facets and saved responses. The axis coefficients and weights are interpretive assumptions awaiting empirical evaluation.

## Dark triad: SD4

The author's measures page places the 28-item Short Dark Tetrad (SD4) in the public domain. Version 1 retains its exact original text and scoring in `app/data/dark-v1.js`. Version 2 replaces each statement with a concrete self-report of behavior, reaction, or interpersonal motivation. See `DARK_ITEM_REVISIONS.md` for a paired audit. The adapted items retain a four-domain, seven-items-per-domain structure, but **they are not the published or validated SD4 instrument**. Interpretation and cutoffs cannot be transferred from SD4; scoring means of 1–5 are descriptive only. Old saved and imported sessions keep their original wording and results.

The three main scores cover Machiavellianism, narcissism-related attitudes, and psychopathy-related behaviors. A fourth, sadism, is separate. Avoid a combined darkness or evil score. Examples ask what the person has done or enjoyed, rather than whether they agree with a broad fact or a socially acceptable maxim. The statements still depend on self-report, memory, willingness to answer candidly, and individual context; none can diagnose a disorder or predict harmful behavior. Adults should consider a typical pattern over the past year, with response labels from “Very unlike me” to “Very like me.”

“Lower endorsement” = mean below 2.5; “higher endorsement” = above 3.5; otherwise “mixed endorsement.” These are response-scale descriptions, not diagnostic cutoffs or normative classifications. The new wording requires cognitive interviews, item analysis, reliability, factor structure, and convergent validation before quantitative interpretation beyond the observed response pattern.

Sources:

- https://www2.psych.ubc.ca/~dpaulhus/Paulhus_measures/
- https://www2.psych.ubc.ca/~dpaulhus/Paulhus_measures/SD4.docx
- Paulhus, Buckels, Trapnell, & Jones. *Screening for Dark Personalities: The Short Dark Tetrad (SD4)*. https://doi.org/10.1027/1015-5759/a000602

## Validation required before stronger accuracy claims

1. Cognitive interviews with diverse adults to find misunderstood, loaded, or double-barreled items; revise and version changes.
2. Pilot item analysis with preregistered rules; examine missing/context responses, distributions, completion time, fatigue, and device effects.
3. Estimate test–retest and internal reliability, factor structure, and convergent/discriminant validity against established measures, with uncertainty.
4. For reasoning, calibrate item families and individual variants, establish form equivalence, check differential item functioning, and collect age-representative normative samples.
5. For political placement, test whether the proposed axes and facet weights are supported; study variation across countries rather than assigning universal party labels.
6. Independently evaluate accessibility, translation, measurement invariance, response bias, and fairness. Publish limitations and do not transfer validation across materially changed versions.

The app collects no telemetry for this purpose. A future validation study needs a separate, explicitly consented research process; it must not silently upload users' answers.
