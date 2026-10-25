# PRODUCTS.md — the living registry

*What exists, in doctrine terms. Entries describe each product's four
planes (§3 of DOCTRINE.md) and its admission evidence (§5). Products
are instances of the pattern — this file changes; the doctrine doesn't.*

---

## OSINT Sentinal Workstation — flagship  ·  *class: Engine*

**Role:** the world-engine; the runtime spine; the operator cockpit;
the fusion pipeline made tangible.

| Plane | Instance |
|---|---|
| Sovereign core | Electron desktop runtime — Cesium globe, plugin modules, HAL planes (I/O → CPU workers/WASM SIMD → GPU compute → render → orchestration), local AI cognition |
| Integration surface | Live feeds (aircraft, vessels, satellites, weather, seismic, fire, launches, rail, space weather), DEM/terrain services, OSINT providers, Ollama endpoints |
| Operator policy | 4-stage security model (LOCK/AI/FULL/NETWORK), pairing ceremonies, access codes, LAN sharing toggles |
| Hybrid execution | `compute.dispatch` — WebGPU → WASM SIMD → CPU worker fallback; local analysis over remote feeds |

**Admission evidence:** runs fully disconnected; every integration
degrades to data holes, never aborts; 51 modules behind contracts;
single binary also runs headless as a server.

---

## Sentinal Web (hosted globe) — the public playground  ·  *class: Surface*

**Role:** the free tier as product — the world served publicly, the
bait and proof of the platform.

| Plane | Instance |
|---|---|
| Sovereign core | Headless server (`out/server`) on Debian 12 — same codebase, no renderer; persistent world-state, peer store, feed aggregation |
| Integration surface | Anonymous ephemeral sessions (`api` scope, TTL'd, self-pruning), minted access codes (api/admin tiers), public shared-view broadcasts, `/events` WebSocket |
| Operator policy | `sentinel.env` — stage floor, invite codes, TTL knobs, feed credentials; forbidden namespaces sealed for non-admin |
| Hybrid execution | Server carries feeds + state; each browser renders and computes locally — the server never draws a pixel |

**Admission evidence:** two-gate model proven — anonymous browsers get
full modules/compute (Gate A), LAN pairing stays an explicit ceremony
(Gate B); watching is free by design; zero cloud dependency.

---

## Sentinal SDK — the connective tissue  ·  *class: Contract*

**Role:** the contract surface — deterministic interfaces that let
external systems (agents, pipelines, other products) act inside a
Sentinal world-state.

| Plane | Instance |
|---|---|
| Sovereign core | The RPC method table — the same methods the workstation's own plugins call |
| Integration surface | JSON-RPC `/rpc` + `/events` WS; typed-array transport for grids; session/scope auth |
| Operator policy | Scope tiers (api/admin/operator), forbidden namespaces, stage gating |
| Hybrid execution | Consumers render/compute wherever they run; the SDK only moves world-state |

**Admission evidence:** this is the seam a game engine (or any future
product) consumes — Sentinel as world-server, not embedded library.

---

## NameGuard — identity intelligence  ·  *class: Engine*

**Role:** identity scoring, verification, and semantic analysis —
a specialized engine sharing the deterministic, modular principles.

| Plane | Instance |
|---|---|
| Sovereign core | Deterministic scoring pipeline; standalone product AND workstation module |
| Integration surface | External identity/enrichment sources as declared modules |
| Operator policy | Inherits workstation policy when embedded; standalone config when independent |
| Hybrid execution | Local-first scoring; optional cloud enrichment as input, not truth |

**Admission evidence:** runs independently and as a module — the
admission test applied to a non-geospatial domain.

---

## HyperForge — emerging pipeline  ·  *class: Consumer*

**Role:** the game/simulation lane — Sentinel consumed as a
world-server by an engine we also own.

| Plane | Instance |
|---|---|
| Sovereign core | HyperForge's own engine + renderer |
| Integration surface | The SDK contract — RPC methods, `/events`, resident compute |
| Operator policy | Admin-scope session peer; forbidden namespaces apply to it like any consumer |
| Hybrid execution | HyperForge re-renders; Sentinel supplies DEM grids, analysis fields, live actors |

**Status:** pipeline-stage. The doctrine treats it as proof of the
admission test in reverse — a new product enters by consuming the
contract, not by importing internals.

---

## ResonateX — audio analysis engine  ·  *class: Engine*

**Role:** the DSP spine — FFT, 8-band analysis, EBU R128 loudness, THD,
phase correlation, mixer/routing, sniffer taps, validation suite. The
engine every audio product line builds on.

| Plane | Instance |
|---|---|
| Sovereign core | C# DSP library — WASAPI capture, filter chains, analysis meters, mixer engine, self-validation |
| Integration surface | WASAPI devices, block-based audio streams, analysis consumers |
| Operator policy | Validation suite + sniffer taps — the pipeline verifies itself and exposes truth |
| Hybrid execution | CPU-native; sized scratch over stackalloc; vector ops with SIMD headroom |

**Admission evidence:** deterministic signal math, bounded memory
(Prepare-sized scratch), self-checking pipeline. First promoted
candidate from the bridge census — `CascadeProjects/ResonateX`.

---

## Sentinal-Sound — DSP + GPU audiovisual line  ·  *class: Surface*

**Role:** Product Line #4 — the flagship surface is the **RTX Audio
Visualizer**: 55 GPU modes plus a 6-graph generative compute system;
psychoacoustic data made visible. Sentinal Systems UK consumer product.
ResonateX is its engine; the visualizer is its expression.

| Plane | Instance |
|---|---|
| Sovereign core | DX12U renderer — runtime-compiled ps_6_6/cs_6_6 shaders, generative compute graphs, LightingBrain director |
| Integration surface | WASAPI loopback via the engine shim; RDMA shared-memory broadcast (`RTXAudioVisualizer_RDMA`, seqlock protocol); OpenXR runtime; optional local Ollama vision feedback |
| Operator policy | Runtime controls (modes, post-FX, VRS, per-graph weights); quality gate on every shader; DEV/OP/SDK three-lane release model |
| Hybrid execution | GPU-resident everything: pixel shaders, compute graph state, feedback textures; CPU DSP upstream; DX11 path as declared fallback |

**Admission evidence:** ships v1.0.0 (OP repo, self-contained zip +
SHA256SUMS); degrades honestly (no headset → desktop, no Ollama → local);
analysis seam is a real published contract (SDK repo), not internals
leaking out. Spine stabilized in the v2 tree — GPU resource disposal,
seqlock transport, bounded intensity, real-frame dt.

**Lineage:** promoted through the bridge census — `CascadeProjects/
RTXAudioVisualizer`, `sourceDir` preserved. Same doctrine, different
domain: cognitively separate from the workstation by design.

---

## Homelab Tools — homelab toolkit  ·  *class: Surface*  ·  **status: candidate — admission pending**

**Role:** the private machine-fleet lane — monitoring, management, and
LAN resource sharing for a Windows homelab. Predates the doctrine;
onboarded 25 Oct 2026 for productization.

| Plane | Instance |
|---|---|
| Sovereign core | Python service layer — asyncio event bus, JSON config tree, in-memory auth, SQLite persistence — plus ~30 tool windows (monitors, cleaner, assistant, IoT, containers) |
| Integration surface | WireGuard mesh (real `wg`/`netsh`), TCP/ZMQ memory-region services, ImDisk RAM-disk over SMB/iSCSI, Flask REST (~98 routes), PWA mobile front-end |
| Operator policy | Admin auto-config, role-based auth service, firewall setup, per-tool privilege escalation where required |
| Hybrid execution | Local-first, zero cloud dependency; LAN peer negotiation over TCP 30000–31000 — capability advertisement real, compute offload currently simulated |

**Admission evidence (partial):** monitor suite and dashboards verified
running with live data (screenshot audit); five-generation accumulation
leaves `*_fixed`/`*_working` variant sprawl and two broken entry points
(`homelab_portal` init-order, `rest_api` double-registration); 8.1 GB of
runtime dumps committed to LFS. Honest-state doc: `HOMELAB.md` in-repo.
Admission requires: single working entry point, junk untracked, README
claims reconciled to code, supervised validation of the network-mutating
tool class.

---

## Registry rules

- **New product = new entry here.** Describe its four planes; if you
  can't, it isn't designed yet.
- **Never amend DOCTRINE.md to fit a product.** If a product needs a
  doctrine change, one of them is wrong — argue it out first.
- **Sunset entries stay.** A retired product keeps its entry marked
  retired — the registry is history, not just inventory.

*v0.1 — 12 Oct 2026. Two months into the ecosystem; built to outgrow it.*
