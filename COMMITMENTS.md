# Sentinal Systems — Customer Commitments

*What we promise in plain language. These are the public faces of our
internal doctrine — the rules we hold ourselves to, written so you can
hold us to them too. Each commitment names the canon it derives from;
the doctrine is the law, this page is the promise.*

---

## Commitment 1 — Fair Billing

**You will always know when you're billed.**

If you pay us monthly, you get billed monthly — on the same calendar
date every time. Subscribe on the 17th, and your renewal lands on the
17th of each month. Not a 28-day cycle that quietly creeps earlier and
earlier through the year.

- Free tiers may reset usage on a rolling window (for example every 14
  or 28 days) — that's how the free quota works, and we'll say so.
- Paid subscriptions renew on a **fixed calendar date**.
- We will never use billing drift, obscured renewal timing, or a
  "month" that means 28 days to charge you more often than you
  reasonably expect.

*Canon: DOCTRINE.md §7.5 — RULE: FAIR-BILLING*

---

## Commitment 2 — Works Without Us

**Our software doesn't phone home to function.**

The core of every Sentinal product runs on your hardware, disconnected
by design. Cloud services, remote feeds, and hosted endpoints are
optional extras you switch on — never load-bearing walls you can't
remove. If every Sentinal server disappeared tomorrow, what you
installed keeps working.

- The product runs standalone before it ever runs connected.
- Remote capability is opt-in, declared, and removable.
- No feature gates that exist only to force a connection.

*Canon: DOCTRINE.md §2 Laws 3 & 10, §4 degradation contract*

---

## Commitment 3 — Honest When Things Break

**We show you the hole, never the fiction.**

When something fails in a Sentinal product, you get reduced capability
with an honest signal — never fabricated data dressed up as real,
never a silent failure, never a locked-up app pretending everything is
fine.

- Missing data appears as missing data — marked, stamped, flagged.
- Stale feeds say they're stale. Offline features say they're offline.
- Fallbacks (GPU → CPU, remote → local) are stated, not hidden.

*Canon: DOCTRINE.md §4 — the degradation contract*

---

## Commitment 4 — You Own the Controls

**You outrank every algorithm in our products.**

The operator's policy decides what runs, what connects, and what data
leaves your machine — not our defaults, not our preferences, not an
AI's guess. Where our systems make decisions, those decisions are
inspectable and traceable.

- Every meaningful action in the system is attributable.
- Remote results are treated as inputs to be checked, never truth by
  origin.
- Your explicit intent outranks every inference we make.

*Canon: DOCTRINE.md §2 Laws 4 & 7, §8 Agent Alignment Charter*

---

## Commitment 5 — Watching Is Free

**Our free surfaces are products, not traps.**

Public views and playground access are open by design — they are our
proof, not our funnel. Paying unlocks capability, not basic respect.
Free means free; we don't nag, throttle artificially, or cripple the
experience into an upgrade prompt.

*Canon: DOCTRINE.md §7 — Trust & Access Model, "Watching is free"*

---

## Commitment 6 — Numbers, Not Marketing

**We publish what we measured, not what we hoped.**

Performance claims in Sentinal products come from measurement on real
hardware, and we show the number — not the aspiration. Where a
capability can't be measured yet, we say it's unbuilt rather than
selling the roadmap.

- Claims carry the conditions they were measured under.
- Honest limits are disclosed alongside honest capabilities.
- A feature that can't be verified isn't advertised.

*Canon: DOCTRINE.md §9.4 — measure, then claim; §2 Law 1*

---

## Commitment 7 — Boring, Reliable Releases

**Shipping is a checklist, not a vibe.**

Sentinal releases are built, verified, and documented the same way
every time. What reaches you has walked the gate — and if a release
fails in the field, it degrades honestly or rolls back; it doesn't
get hidden.

*Canon: DOCTRINE.md §2 Law 9, §9.3; BIBLE RELEASE-PIPELINE.md*

---

## Commitment 8 — No Lock-In Architecture

**We build doors, not cages.**

Our products expose contracts — stable, documented interfaces — so
your data and workflows stay portable. You can consume a Sentinal
engine from your own systems, leave our integrations for third-party
ones, or run entirely without them. Staying is a choice you make
repeatedly, not a trap you fell into once.

*Canon: DOCTRINE.md §2 Law 10, §5 admission test, §6 product classes*

---

*These commitments are the visible layer of the Sentinal doctrine.
If we ever break one, it's a bug and a breach — not a feature.*

*Internal canon: `DOCTRINE.md` (constitution) ·
`sentinal-systems-BIBLE` (engineering conventions).*
