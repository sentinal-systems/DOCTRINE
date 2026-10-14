# bridge/ — Research → Production Bridge Layer (RPBL)

The ingestion path between the legacy project ecosystem and the
doctrine. Research projects enter Sentinal through here — never raw.

**Hybrid ingestion** (per the locked model):

1. **Automatic scan** — `scan.mjs` is the wide net. It censuses a
   project, extracts the pipeline (input→transform→output), maps
   evidence onto the four planes (§3), scores the admission test (§5),
   suggests a class (§6), and emits a verdict.
2. **Manual adapters** — `sentinal.adapter.json` in a project root
   overrides any inferred field. Adapter wins; scan fills the gaps.
3. **Classification** — every scan emits `promote-candidate`,
   `reference`, or `dormant`, with reasons.

## Verdicts

| Verdict | Meaning |
|---|---|
| `promote-candidate` | ≥4/6 admission criteria found + honest-degradation evidence — deserves operator review for PRODUCTS.md |
| `reference` | real pipeline but doctrine gaps — useful fragments (transforms, patterns) to mine, not a product |
| `dormant` | no discoverable pipeline or too little code — kept on record, not actively chased |

**Every auto-scan profile is inference, not verdict.** The doctrine's
"measure, then claim" applies to the bridge itself: a profile is a
claim the operator reviews — via adapter or eyeball — before any
registry entry.

## Usage

```bash
node bridge/scan.mjs <project-dir>            # profile one project
node bridge/scan.mjs <dir> --write            # + bridge/profiles/<name>.json
node bridge/scan.mjs --all <root-dir> --write # census + REGISTRY-DRAFT.md
```

## Adapter format — `sentinal.adapter.json` (project root)

Any field declared overrides the scan. Unknown fields pass through.

```json
{
  "verdict": "promote-candidate",
  "classSuggestion": "engine",
  "pipeline": { "input": ["stdin"], "transform": ["scorer.ts"], "output": ["json"] },
  "planes": { "p2_operatorPolicy": { "present": true, "evidence": ["config.json is operator-owned"] } },
  "notes": "v0.3-era scorer — predates doctrine but degrades honestly; promote into NameGuard lineage"
}
```

Useful adapter fields: `verdict`, `classSuggestion`, `pipeline`,
`planes` (per-plane `present`/`evidence`), `degradationEvidence`,
`contracts`, `truthFlags`, `notes`.

## What it detects

- **Surfaces** — electron, web UI, api/server, .NET native, cli, python
- **Pipeline** — input (fetch/argv/stdin/ws/file reads), transform
  (workers/wasm/shaders/inference/map-reduce), output (file writes,
  res.send, DOM/canvas, emit)
- **Planes** — P0 core (code mass + structured types), P1 integration
  (remote calls, deps), P2 policy (env/config/settings), P3 hybrid
  execution (workers/wasm/gpu + remote-input × local-compute)
- **Degradation** — fallback/degraded/offline/stale/last-good/retry/
  timeout/catch signals
- **Contracts** — exports, interfaces/types, IPC handlers, REST routes,
  OpenAPI

Deliberately cheap: bounded walk (400 files), head-reads (64 KB/file,
120 files), regex evidence. Precision comes from adapters, not from
the scanner pretending to be a static analyzer.

*The bridge is itself a pipeline — it should degrade honestly too.
Locked dirs, binary blobs, and parse failures produce partial profiles,
never aborts.*
