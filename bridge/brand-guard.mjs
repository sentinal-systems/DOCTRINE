#!/usr/bin/env node
/**
 * BRAND-GUARD — catches stale entity branding before it ships.
 *
 * Single source of truth: bridge/brand.json declares the current legal
 * entity, the current license-key prefix, and the legacy terms that
 * must not appear in live branding. Point it at a repo; it walks every
 * text file, flags legacy hits, and verifies the entity is named in
 * public-facing docs.
 *
 * Intentional legacy references (backward-compat salts, legacy key
 * prefixes, historical notes) are allowed — but ONLY via an explicit
 * .sentinal-brand.json allowlist in the repo root. Anything flagged
 * that isn't allowlisted is a release blocker: exit 1.
 *
 * Usage:
 *   node bridge/brand-guard.mjs <repo-dir> [<repo-dir> ...]
 *   node bridge/brand-guard.mjs --all <root-dir>          (scan every child dir)
 */
import { readdirSync, readFileSync, existsSync } from 'fs'
import { join, dirname, basename, resolve } from 'path'
import { fileURLToPath } from 'url'

const HERE = dirname(fileURLToPath(import.meta.url))
const CONFIG = JSON.parse(readFileSync(join(HERE, 'brand.json'), 'utf8'))
for (const term of CONFIG.legacy) term.re = new RegExp(term.re, 'i')

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'out', '.next', 'bin', 'obj', '__pycache__', '.venv', 'venv', 'target', 'coverage', 'tools'])
const TEXT_EXTS = new Set(['.md', '.txt', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.cs', '.py', '.ps1', '.json', '.yml', '.yaml', '.toml', '.html', '.css', '.hlsl', '.glsl', '.wgsl', 'LICENSE', ''])
const SKIP_FILES = new Set(['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'])
const MAX_BYTES = 512 * 1024

function walk(dir, files = []) {
  let entries
  try { entries = readdirSync(dir, { withFileTypes: true }) } catch { return files }
  for (const e of entries) {
    if (e.name.startsWith('.') && e.name !== '.sentinal-brand.json') continue
    const full = join(dir, e.name)
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) walk(full, files)
    } else {
      const ext = e.name.includes('.') ? e.name.slice(e.name.lastIndexOf('.')) : ''
      if (TEXT_EXTS.has(ext) || e.name === 'LICENSE') files.push(full)
    }
  }
  return files
}

function loadAllowlist(root) {
  const p = join(root, '.sentinal-brand.json')
  if (!existsSync(p)) return []
  try {
    const data = JSON.parse(readFileSync(p, 'utf8'))
    return data.allow ?? []
  } catch {
    return []
  }
}

function isAllowed(rel, line, allow) {
  return allow.some((a) => {
    const want = a.file.split('\\').join('/')
    const fileMatch = want === '*' || rel === want || rel.endsWith('/' + want)
    if (!fileMatch) return false
    if (!a.match) return true
    return line.toLowerCase().includes(a.match.toLowerCase())
  })
}

function guard(root) {
  root = resolve(root)   // relative roots (e.g. '.') would slice rel paths wrong below
  const files = walk(root)
  const allow = loadAllowlist(root)
  const findings = []   // unallowlisted legacy hits — blockers
  const allowed = []    // intentional legacy references
  const publicDocsSeen = new Set()

  for (const file of files) {
    const rel = file.slice(root.length + 1).split('\\').join('/')
    const base = basename(file)
    if (SKIP_FILES.has(base) || base === '.sentinal-brand.json') continue
    if (CONFIG.publicDocs.includes(base) && dirname(rel) === '.') publicDocsSeen.add(base)

    let text
    try { text = readFileSync(file, 'utf8') } catch { continue }
    if (text.length > MAX_BYTES) text = text.slice(0, MAX_BYTES)

    const lines = text.split(/\r?\n/)
    lines.forEach((line, i) => {
      for (const term of CONFIG.legacy) {
        if (term.re.test(line)) {
          const hit = { file: rel, line: i + 1, term: term.name, text: line.trim().slice(0, 120) }
          if (isAllowed(rel, line, allow)) allowed.push(hit)
          else findings.push(hit)
        }
      }
    })
  }

  // Positive check: root-level public docs must name the current entity
  const missing = []
  for (const doc of publicDocsSeen) {
    const p = join(root, doc)
    if (!existsSync(p)) continue
    const text = readFileSync(p, 'utf8')
    if (!text.toLowerCase().includes(CONFIG.entity.toLowerCase())) {
      missing.push(doc)
    }
  }

  return { root, findings, allowed, missing, fileCount: files.length }
}

function report(r) {
  console.log(`\n=== ${r.root} — ${r.fileCount} files scanned ===`)
  if (r.allowed.length) {
    console.log(`  allowlisted (intentional legacy): ${r.allowed.length}`)
    for (const a of r.allowed) console.log(`    ~ ${a.file}:${a.line}  [${a.term}]`)
  }
  if (r.missing.length) {
    for (const doc of r.missing) console.log(`  ! ${doc} does not name "${CONFIG.entity}"`)
  }
  if (r.findings.length) {
    for (const f of r.findings) console.log(`  ✗ ${f.file}:${f.line}  [${f.term}]  ${f.text}`)
    console.log(`  ${r.findings.length} unallowlisted legacy hit(s) — RELEASE BLOCKER`)
  } else if (!r.missing.length) {
    console.log('  clean')
  }
  return r.findings.length + r.missing.length
}

const args = process.argv.slice(2)
if (!args.length) {
  console.error('usage: node brand-guard.mjs <repo-dir> [...] | --all <root-dir>')
  process.exit(2)
}

let roots = []
if (args[0] === '--all') {
  const rootDir = args[1]
  roots = readdirSync(rootDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.') && !SKIP_DIRS.has(e.name))
    .map((e) => join(rootDir, e.name))
} else {
  roots = args
}

let blockers = 0
for (const root of roots) blockers += report(guard(root))

console.log(`\n${blockers === 0 ? 'BRAND-GUARD PASS' : `BRAND-GUARD FAIL — ${blockers} blocker(s)`}`)
process.exit(blockers === 0 ? 0 : 1)
