# INTUITION.md
## The Listening Philosophy Behind Sentinal-Sound

**Status:** internal doctrine — Product Line #4 (Sentinal-Sound)
**Applies to:** ResonateX (engine), RTX Audio Visualizer (surface),
and any future product that renders sound.

---

## 1. The claim

Sentinal-Sound is built on one conviction: **the system must hear the
music the way a listener does, before it may show anything.**

Not the signal — the *music*. A raw waveform is data. A listener hears
loudness, weight, texture, tension, release, and shape. The pipeline is
therefore constructed backwards from perception: every analytic it
computes exists because a human ear notices it, and every visual
decision maps to something the ear already decided mattered.

Feeling first. Math second. Pixels last.

---

## 2. What listening means, technically

The DSP does not measure the signal; it measures **what the ear does
with the signal.**

| The ear hears | The pipeline measures |
|---|---|
| Loudness | LUFS — perceptual loudness, not peak amplitude |
| Sharp transients | Kick/transient detection, crest factor |
| Texture | THD — harmonic distortion as grain and edge |
| Width | Phase coherence, stereo balance |
| Weight | 8-band spectrum with psychoacoustic spacing |
| Structure | Section awareness — verse vs. chorus vs. drop |
| Genre & mood | LightingBrain confidence tracking |

None of these are decorative. LUFS exists because the ear is
non-linear. Critical bands exist because the ear smears neighbouring
frequencies. Masking exists because a loud sound hides a quiet one.
The DSP is a model of hearing, not a model of audio.

**Rule:** if an analytic has no perceptual correlate, it does not
enter the contract. If a perceptual phenomenon has no analytic, the
pipeline is incomplete.

---

## 3. From feeling to frame

The visualiser renders **how the music feels**, mapped through a fixed
vocabulary — never raw data thrown at pixels.

- **Loudness → exposure.** LUFS drives global exposure with temporal
  smoothing. Quiet passages are allowed to be *visually* quiet.
- **Transient → event.** A kick is not "more bass" — it is a discrete
  event with attack and decay. Beat flashes decay; they never hold.
- **Crest factor → material.** Dynamic material sharpens edges;
  compressed material softens and saturates.
- **THD → grain.** Distortion reads as film grain and chromatic
  instability — dirt in the lens, not louder colour.
- **Section → palette.** A drop and a verse may share loudness but
  must never share identity.
- **Stereo width → space.** Coherent mono tightens the frame; wide
  stereo opens it.

The translation layer is bounded and deterministic. The same music,
on the same settings, produces the same visuals. Feeling is not
noise — surprise comes from the song, never from a random seed.

---

## 4. The Director has taste

Sentinal-Sound is not a spectrum analyser. A spectrum analyser has no
opinion. This system is built to have one.

The LightingBrain tracks genre, energy trend, and section structure
and *chooses* — mode, palette, intensity, pacing. That is direction,
not automation: the operator can override, observe, or silence it at
any time, but its default is to make a call and commit to it.

A visualiser that merely reacts is a screensaver. A visualiser that
listens, anticipates, and holds a point of view is an instrument.

---

## 5. Restraint is the skill

The ear fatigues; so does the eye. The pipeline treats fatigue as a
first-class failure mode:

- Eased transitions — nothing snaps unless the music snaps
- Bounded intensity — the chain is hard-clamped; a drop cannot spike
  the frame to clipping
- Decay on every flash — energy discharges, never accumulates
- Negative space is load-bearing — a frame that is always full says
  nothing when the music gets loud
- Depth over density — three honest layers, not fifty particles
  screaming

Maximum intensity is not the goal. The goal is that the loud moments
*land*, which is only possible if the quiet moments were allowed to
be quiet.

---

## 6. The system remembers the song

The six generative graphs — dynamics, spectrum, spatial, rhythm, DSP,
section — accumulate state across the track. A song grows a visual
identity; it is not re-rendered fresh each frame.

Two songs with identical spectra produce different visuals, because
the graphs remember *how they got there*. The visualiser listens over
time, not just in the instant.

---

## 7. What this is not

- **Not a VU meter.** Values up and down is telemetry, not feeling.
- **Not a screensaver.** No random fills, no screen-covering noise,
  no motion for motion's sake.
- **Not a light show bolted onto FFT.** The analysis *is* the product;
  the render is its honest expression.
- **Not autonomous decoration.** Operator supremacy holds — every
  automatic choice is inspectable and overridable.

---

## 8. Where each principle lives

| Principle | Implementation |
|---|---|
| Model of hearing | ResonateX DSP — LUFS, THD, crest, bands, phase |
| Feeling → frame | GPU uniforms + `gpu_data_algorithms.hlsl` |
| Director | LightingBrain / VisualDirectorBot |
| Restraint | clamps, easing, decay in smoother + post-FX |
| Memory | 6 generative compute graphs, triple-buffered |
| Sovereignty | WASAPI loopback, local-only, zero cloud, seqlock transport |

---

## 9. The test

The quality gate is not "does it render" but **"does it listen"**:

> Play a track. If the visuals tell you something about the music you
> could not see in a spectrum analyser — the section boundary, the
> weight of the drop, the difference between loud and *important* —
> it passes. If it is merely beautiful noise, it fails, regardless of
> the frame rate.

Goosebumps are the metric. The math exists to serve them.

---

*Sentinal Systems UK — internal. This document governs intent, not
implementation; when the code and this disagree, the code is wrong.*
