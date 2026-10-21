# THE SENTINAL SYSTEMS UK DOCTRINE

*Architecture • Principles • Fusion Pipeline • Product Identity • Agent Alignment*

This document is the constitution. It defines what is invariant about
Sentinal — the principles, the layers, the vocabulary — and treats
products as instances of the pattern, not the pattern itself. New
projects enter the ecosystem by satisfying the admission test in §5,
never by amending this file.

The product registry (what exists today) lives in `PRODUCTS.md`.
What we believe (this file) changes slowly; what we build changes often.

---

## 1. Umbrella Identity — Sentinal Systems UK

### 1.1 What Sentinal Systems UK is

A sovereign engineering house focused on:

- world-model engines
- operator-first intelligence
- privacy-aligned cognition
- modular, deterministic software systems
- industrial-grade reliability

### 1.2 What Sentinal Systems UK builds

Deterministic runtimes and the intelligence surfaces that ride them.
Every product — present and future — is an instance of the same
pattern: a sovereign core, an explicit integration surface, operator
policy above both.

### 1.3 The Visentrix lineage

Sentinal Systems UK inherits the modular imagination, sovereign design
ethos, and world-model focus originally conceived under Visentrix.
The name changed; the philosophy matured.

---

## 2. The Sentinal Principles (The Laws)

These are the rules every product and every agent inherits.

1. **Determinism over guesswork** — systems produce the same output for
   the same world-state, or say so when they can't.
2. **Modularity over monoliths** — capabilities are atomic, contracted,
   and composable.
3. **Local-first over cloud-first** — the core runs without permission;
   remote capability is opt-in, never assumed.
4. **Operator supremacy** — the human's policy outranks every agent,
   feed, model, and remote service.
5. **World-model fidelity** — the scene is reality; every layer exists
   to make it truer.
6. **Memory throughput is sacred** — hardware exists to be used:
   GPU before CPU, SIMD before scalar, parallelism before serial,
   bounded caches before re-fetch.
7. **No hidden state** — every meaningful mutation is inspectable and
   attributable.
8. **Explicit reasoning, explicit action** — agents say what they
   concluded and do what they said.
9. **Industrial reliability over convenience** — boring correctness
   beats clever fragility. Releases are checklists, not vibes.
10. **Sovereign interoperability** — cloud, APIs, distributed compute,
    and external systems are optional extensions — never dependencies.
    Sentinal does not need the cloud, does not assume the cloud, does
    not trust the cloud — but it can use the cloud when the operator
    chooses.

Cloud is a tool. Sovereignty is the identity.

---

## 3. The Layered Model (Architecture)

Every Sentinal system decomposes into the same four planes. A product
that can't name its four planes isn't finished designing.

### Plane 0 — Sovereign Core (the runtime spine)

The part that must remain pure: world-model, fusion pipeline, memory,
module runtime, operator cockpit, deterministic reasoning. This is the
substrate — the real world, as far as the system is concerned. It
functions fully disconnected.

### Plane 1 — Integration Surface (the door)

Where external capability *connects* — always as a *module*, never as a
foundation: OSINT APIs, cloud inference endpoints, distributed compute,
enrichment feeds, hosted services, third-party data. This plane owns
**admission**: how a capability is declared, wired, authenticated, and
deregistered. It answers *"what is allowed to knock."* Integrations are
bounded, declared, and degradable — when one dies, the core degrades
honestly instead of aborting.

### Plane 2 — Operator Policy (the control plane)

Defines what integrations are allowed, what compute is permitted, what
data may leave the core, which endpoints are trusted, and what fallback
exists. Policy is configuration the operator owns — not a preference
the system negotiates.

### Plane 3 — Hybrid Execution (the dance floor)

Where each unit of work actually *runs* — local world-model, remote
capability bursts, external feeds, hybrid pipelines. This plane owns
**placement**: the decision of what executes locally versus what is
dispatched outward, moment to moment. It answers *"where does this
work happen."* Remote results enter the world-model as *inputs* —
subject to the same validation as any feed — never as truth by origin.

> **The Integration Surface defines capability; Hybrid Execution
> defines behavior.** Plane 1 admits; Plane 3 places. A system can hold
> a rich integration surface while executing entirely locally — feeds
> unplugged, every result computed in-house — and a healthy hybrid
> system may still only ever use what Plane 1 admitted. Integration
> without execution is dormant; execution without admission is
> impossible.
>
> **What hybrid execution looks like:** a browser runs `compute.dispatch`
> — the DEM grid arrives via a Plane 1 feed, the kernel executes on the
> client's own WebGPU, and the result enters world-state through a
> module contract. A flood analysis pulls remote weather feeds (Plane
> 1), runs the runoff model on local workers (Plane 3: local
> placement), and fuses both into one scene. A NameGuard score runs
> locally while an enrichment endpoint contributes optional inputs —
> remote answers fuse as data, local policy decides weight.

> **The rule that binds the planes:** capability may arrive from
> anywhere; trust is earned in exactly one place — the operator's.

---

## 4. The Fusion Pipeline (Data Spine)

Every Sentinal product moves data the same way.

1. **Ingestion** — feeds, sensors, operator commands, integration
   outputs, agent requests.
2. **Normalization** — everything becomes structured world-state:
   typed objects, resident buffers, scene layers, identity vectors,
   bounded caches.
3. **Fusion** — normalized inputs merge into one coherent world-state.
4. **Cognition** — agents and analysis operate *on* fused state, never
   on raw feeds.
5. **Action** — module calls, feed deltas, scoring requests,
   world-model updates, operator-visible outputs.
6. **Logging & Memory** — deterministic, inspectable, non-polluting.
   Every action is traceable to a decision; every decision to a state.

### The degradation contract

Every stage degrades the same way: *reduced capability plus an honest
signal — never fabricated data, never silent failure, never a locked
core.* Concretely:

- A DEM tile fails to fetch → the analysis returns with marked data
  holes, not interpolated fiction.
- A live feed dies → its module shows last-good data stamped stale,
  not a frozen pretense of live.
- No WebGPU adapter → compute falls back WASM SIMD → CPU workers:
  same result, slower — stated, not hidden.
- The local model endpoint is unreachable → cognition tooling works;
  the LLM-backed surface says it's offline.
- A cloud scoring endpoint fails → NameGuard continues operating
  locally and reports *"remote enrichment unavailable"* — the score
  stands, flagged, instead of failing silently.
- An ephemeral token expires → silent re-pair; an upstream provider
  500s → that provider is marked dead while siblings continue.
- Everything disconnected at once → the core plus cached world-state
  still runs. That is the definition of local-first.

---

## 5. The Product Admission Test

The registry (`PRODUCTS.md`) lists what exists. This section defines
what may join it. A Sentinal product must:

- **Decompose into the four planes** — sovereign core, integration
  surface, operator policy, hybrid execution. In any proportion, but
  all four must be nameable.
- **Degrade honestly** — missing integration degrades capability; it
  never bricks the core and never errors silently.
- **Expose contracts, not internals** — other products and agents
  consume it through deterministic interfaces.
- **Respect operator policy** — it inherits the policy layer; it does
  not define its own trust.
- **Run standalone before it runs connected** — local-first is a
  behavior, not a marketing claim.
- **Use the vocabulary** — world-state, fusion, residentKey, module
  contract, feed delta, operator intent.

A product that satisfies the test is Sentinal regardless of domain —
geospatial, identity, simulation, games, anything. The doctrine does
not enumerate markets; it enumerates properties.

---

## 6. Product Classes

Every Sentinal product belongs to exactly one class. The class decides
which planes dominate — the admission test (§5) still applies in full.

| Class | Definition | Plane signature | Examples |
|---|---|---|---|
| **Engine** | Owns a sovereign core — a runtime spine other things plug into | All four planes, fully realized | Workstation, NameGuard |
| **Surface** | A public face of an engine — serves world-state outward | Thin core; rich integration surface; execution mostly client-side | Sentinal Web |
| **Contract** | Connective tissue — pure interface, no core of its own | Integration surface only; policy inherited | Sentinal SDK, module contracts |
| **Module** | Atomic capability plugged into an engine's runtime | Executes inside a host's planes; owns none | Plugins, mission packs |
| **Consumer** | A foreign sovereign — owns its own reality, consumes an engine via contract | Own core + its own integration surface pointed *at* a Sentinal engine | HyperForge, agents, external pipelines |

Class rules:

- **Classes are architectural, not domain.** An "intelligence product"
  isn't a class — NameGuard is an Engine that happens to do identity.
  Class describes how a product composes; domain describes what it's
  about. Any domain fits any class.
- **Engines host; everything else attaches.** A module, surface, or
  consumer never silently becomes the spine.
- **Consumers are peers, not parasites** — they hold their own
  sovereign core and treat Sentinal capability as Plane 1 input, same
  as any integration.
- **A product's class is stated in its registry entry** — ambiguity
  about class means the product isn't designed yet.

---

## 7. Trust & Access Model

Trust in a Sentinal system is *earned scope*, not *paid capability*.

- **Watching is free.** Public surfaces — hosted globes, shared views,
  feeds — are open by default. The playground is the product's own
  proof.
- **Capability follows policy.** Anonymous capability grants are
  ephemeral by design: short-lived, self-expiring, revocable,
  non-accumulating. Nothing becomes trusted by surviving.
- **Elevation is explicit.** Codes, pairing ceremonies, and operator
  approvals exist to *grant reach* — admin scope, device trust,
  persistent identity — never to unlock what the doctrine says is free.
- **Pairing is a ceremony.** Two devices on a network trust each other
  only through an explicit, human-visible act. Nothing pairs by
  proximity alone.
- **The operator tier is sovereign.** Exactly one trust root exists —
  the operator credential. Everything else is derived, scoped, and
  revocable.

This is the two-gate model generalized: **open where the operator
chooses openness, sealed where trust must be earned — and never the
reverse.**

### 7.5 Fair Billing (RULE: FAIR-BILLING)

The customer must be able to predict renewal dates without calculation.

- **Free tiers may use rolling usage windows.** 14-day or 28-day quota
  resets are acceptable for free-tier operation and evaluation periods.
- **Paid subscriptions renew on a fixed calendar date.** A customer who
  subscribes on the 17th is billed on the 17th of each month — April 17,
  May 17, June 17 — not on a rolling day-count that drifts the renewal
  earlier across the calendar (17th → 14th → 12th → 9th).
- **Billing models must not obscure renewal timing.** No cycle drift,
  no disguised acceleration of charges, no "monthly" that means 28 days.
- **Trust outranks billing optimisation.** If a billing shortcut would
  make the customer pay more often than they reasonably expect, the
  shortcut is wrong — not the customer.

This survives every payment processor — Stripe, Paddle, our own
implementation: the customer understands when they are billed.

---

## 8. Agent Alignment Charter

### 7.1 How agents think

- World-state first, operator intent second, probabilistic inference third.
- No hallucination — unknowns are stated as unknowns.
- No hidden state — reasoning artifacts are inspectable.
- No cloud assumptions — remote capability is verified before use.

### 7.2 How agents act

- Explicit reasoning before action; deterministic outputs.
- Actions are module calls — atomic, contracted, logged.
- Respect module contracts; never reach past an interface.
- Maintain world-model integrity — update state, don't fork it.

### 7.3 How agents communicate

- Structured, grounded, context-aware, operator-aligned.
- Use Sentinal vocabulary.
- Report drift — the agent that finds divergence names it rather
  than working around it.

### 7.4 How agents treat products

- The runtime spine is reality; products are capability surfaces.
- Remote results are inputs to be fused, not truth to be trusted.
- Operator policy is the only authority.

---

## 9. The Sentinal Vocabulary

Agents and engineers share one vocabulary:

- **world-state** — the fused, coherent model; the single reality
- **fusion layer** — where normalized inputs merge into world-state
- **residentKey** — data kept resident (VRAM/cache) instead of re-derived
- **module contract** — the deterministic interface a capability exposes
- **feed delta** — a normalized change arriving from a source
- **runtime spine** — the sovereign core that hosts everything
- **operator intent** — the human's declared goal; outranks inference
- **memory throughput** — the hardware budget treated as sacred
- **deterministic action** — an action traceable to a decision to a state
- **integration surface** — where external capability enters as modules
- **operator policy** — the control plane the human owns
- **ephemeral session** — capability granted briefly, expiring cleanly
- **identity vector** — normalized identity input (NameGuard-family)
- **scene context** — the shared view state across agents and clients
- **sovereign substrate** — the whole system as a self-owned platform

---

## 10. The Engineering Mindset (The Posture)

The principles say *what* we build. This section says *how we think* —
and it is load-bearing, because the doctrine would otherwise read as
conservative. It isn't.

### 9.1 Push known constraints

The stated goal is not "a good map" — it is *the best world-engine ever
built on consumer hardware*. Goals like that are chosen deliberately:
an impossible-sounding ceiling forces the architecture to be honest.
Every plane exists because "normal web tech" was the constraint we
refused to accept — so we built workers, WASM SIMD kernels, GPU compute
paths, VRAM-resident data, and bounded caches instead of accepting the
budget the browser gave us.

The posture generalizes: **name the constraint, then treat it as the
thing to break — not the wall to design around.**

### 9.2 Experiment is a duty, not a risk

Sentinal is two months old and already spans a desktop runtime, a
hosted world-server, an SDK, a fusion pipeline, and a trust model.
That pace only exists because experimenting is *expected* — new planes,
new modules, new execution paths, new products. A Sentinal system that
isn't growing a new capability is one that's being maintained, not
built.

The doctrine deliberately leaves room: it constrains *how* systems
behave, never *what* they may attempt. A capability nobody has imagined
yet has a place here by default — the admission test (§5) is the door,
not the fence.

### 9.3 Experiments are disciplined

Bold targets, boring method. The release machinery is the expression:
an experiment earns release by walking the checklist — gate, build,
verify, ship, document — and a failed experiment degrades honestly or
gets rolled back, never hidden. DEV is the beta lane where ambition
lives; the public lane only sees what's proven.

**Breakthrough and reliability are not a tradeoff here — reliability is
what lets us afford breakthroughs continuously.**

### 9.4 Measure, then claim

Engineering realism applies to ambition too: we push hardware until it
tells us the truth, and we publish the number — not the hope. A
capability that can't be measured hasn't been built yet — and a gate
that can't observe a shipped change isn't measuring. Verification
grows *with* the product, never before it.

### 9.5 The platform compounds

Every experiment lands as a module, a plane, a contract, or a doc —
something the next experiment can stand on. The workstation becomes a
platform precisely because each breakthrough becomes *reusable
substrate* instead of a demo that dies in a branch.

---

## 11. Cultural Ethos

- **Sovereignty** — independence from cloud ecosystems as a default,
  not a refusal of them.
- **Operator-first** — the human is the mission.
- **Engineering realism** — no magical thinking; measure, then claim.
- **Modular imagination** — creativity expressed through architecture.
- **Field reliability** — behave like industrial machinery.
- **World-engine mindset** — treat the scene as reality.
- **Constraint-breaker posture** — known limits are invitations, not
  walls; the audacious target is the design brief.
- **Boring releases** — a clean, repeatable, checklist-driven ship is
  the mark of maturity, not of slowness.

---

## 12. The Unified Definition

> **Sentinal Systems UK is a sovereign engineering house building
> deterministic world-engines, intelligence systems, and
> operator-aligned cognition substrates.**
>
> **Every Sentinal product shares one architecture: a sovereign runtime
> spine, a declared integration surface, operator policy above both,
> and hybrid execution between them. Local-first in identity,
> integration-native in capability.**
>
> **Sentinal agents inherit a strict ethos: determinism over guesswork,
> modularity over monoliths, locality over externality, and operator
> supremacy above all else — while treating external compute, APIs, and
> distributed systems as tools to be used, never foundations to need.**
>
> **Sentinal is built by people who treat known constraints as the
> thing to break. Every breakthrough becomes substrate; every release
> is boring; every experiment is allowed to be audacious because the
> method never is.**
>
> **Sentinal is not a chatbot, not a cloud service, and not a generic
> AI personality. Sentinal is a system — a sovereign substrate for
> engineered cognition that extends wherever the operator points it.**

---

*v0.1 — drafted 12 Oct 2026. The constitution changes slowly by design;
propose amendments as proposals, not edits.*
