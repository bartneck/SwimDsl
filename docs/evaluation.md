# Generator evaluation

After completing the [local installation](../README.md#what-about-running-it-locally), use Node.js 22.18.0 or later
and run this command from the repository root:

```bash
npx --no-install jiti scripts/runEvaluation.ts
```

The command uses the TypeScript runner available in the installed dependencies.
It runs independently of the web app, so you do not need to start the Vite
server or open a browser. The evaluation runner is
[`scripts/runEvaluation.ts`](../scripts/runEvaluation.ts), with metric calculations
in [`src/evaluation`](../src/evaluation).

The baseline configuration generates 20 training plans, each containing four
weeks of five sessions (400 baseline sessions in total). It uses a 25-metre
pool, a target session distance of 3000 metres, a 1:40 baseline 100m Freestyle
time, the Base phase, Mixed focus, and 6% weekly progression. The start date
is fixed at 2026-09-28. Additional plans are generated for responsiveness and
periodisation comparisons.

The evaluation measures:

- **Volume:** actual distance and error against the target distance summed
  across the sessions in each plan.
- **Intensity:** distance and percentage distribution across intensity zones.
- **Progression:** weekly volume changes compared with the configured progression.
- **Variation:** differences within and between generated plans.
- **Training load:** estimated session and weekly load based on volume and
  intensity.
- **Responsiveness:** changes in output when target distance, training days,
  phase, number of weeks, or focus changes.
- **Periodisation:** average session volume across Base, Build, Peak, and Taper,
  using 20 generated plans per phase, compared with the expected volume order.

Results are written to `evaluation-results/baseline-evaluation.json`. The
script can finish without printing a console message. Open the JSON file to
inspect `experiment` for the baseline settings, `results` for individual plan
metrics and generated SwimDSL source, and `summary` for aggregate results and
the responsiveness and periodisation comparisons.

To change the experiment, edit `settings`, `NUMBER_OF_PROGRAMMES`, or
`PERIODISATION_REPEATS` in the runner and execute the command again. The load
evaluator uses fixed intensity weights, which should also be reviewed if you
change the pace definitions. Each run overwrites the same output file, so copy
it elsewhere before rerunning if you want to preserve a result. Generation
uses unseeded randomness, so repeating the same configuration produces
different sessions and metrics. These measurements evaluate generator
behaviour; they do not establish the effectiveness of a training plan for
swimmers.
