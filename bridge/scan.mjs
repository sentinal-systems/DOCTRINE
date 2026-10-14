#!/usr/bin/env node
/**
 * RPBL — Research → Production Bridge Layer (auto-scan half).
 *
 * Scans a legacy project and emits a doctrinal profile in DOCTRINE.md
 * vocabulary: four planes (§3), fusion pipeline (§4), admission test
 * criteria (§5), class suggestion (§6), degradation evidence (§4
 * contract), truth flags. Output is INFERENCE, not verdict — every
 * profile is labeled auto-scan until an adapter or operator confirms.
 *
 * Hybrid model: a `sentinal.adapter.json` in the project root overrides
 * any field the scanner inferred. Adapter wins; scan fills the gaps.
 *
 * Usage:
 *   node bridge/scan.mjs <project-dir> [--write]
 *   node bridge/scan.mjs --all <root-dir> [--write]   (writes profiles/ + REGISTRY-DRAFT.md)
 */
import { readdirSync, statSync, readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs'
import { join, basename, extname, resolve } from 'path'

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'out', '.next', 'bin', 'obj', '__pycache__', '.venv', 'venv', 'target', 'coverage'])
const CODE_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.py', '.cs', '.cpp', '.cc', '.h', '.hpp', '.rs', '.go', '.java', '.fs', '.vue', '.svelte', '.gd', '.gdscript', '.lua', '.ino', '.ps1', '.bat', '.sh', '.html'])
const SHADER_EXTS = new Set(['.wgsl', '.glsl', '.vert', '.frag', '.hlsl', '.shader'])
const MAX_FILES = 400        // census cap — enough signal, bounded walk
const MAX_READ = 120         // content-sample cap
const MAX_BYTES = 64 * 1024  // read head per file

const PATTERNS = {
  input:    [/\bfetch\s*\(/, /\baxios\b/, /https?\.get|https?\.request/, /readFile|createReadStream|File\.Read|ifstream|fopen|fread|(?<![\w.])open\(|glob\.|input\(|Image\.open|pd\.read|np\.load|os\.(listdir|walk)|Path\(|winreg|ReadProcessMemory|OpenProcess/, /process\.argv|commander|yargs|argparse|args\[|sys\.argv/, /process\.stdin|std::cin|Console\.Read/, /WebSocket|ws:\/\/|HttpClient|TcpClient|UdpClient|requests\.(get|post)|urlopen/, /serialport|SerialPort|waveIn|Wasapi|WASAPI|IMMDevice|GetAsyncKeyState|cv2\.|VideoCapture/],
  transform:[/worker_threads|new Worker\(|std::thread|Task\.Run|Parallel\.|#pragma omp/, /onnxruntime|tensorflow|tesseract|ollama|openai|transformers|torch|opencv/i, /\.map\(|\.filter\(|\.reduce\(|foreach|std::transform/, /score|scor|inference|infer|predict|analy[sz]e|fft|FFT/i],
  output:   [/writeFile|createWriteStream|File\.Write|ofstream|fwrite|(?<![\w.])write\(|json\.dump|\.save\(|imwrite/, /res\.(send|json|end)/, /console\.(log|table)|std::cout|printf|Console\.Write|(?<![\w.])print\(/, /document\.|getElementById|canvas|getContext|Render|Draw|SwapBuffers|glDraw|Invalidate|plt\.|imshow/, /emit\(|broadcast|Send\(|SendAsync/],
  gpu:      [/wgsl|webgpu|getContext\(['"]webgl/, /glsl|shader|hlsl|cuda|opencl|d3d11|directx/i],
  wasm:     [/\.wasm|\.wat|WebAssembly/],
  remote:   [/https?:\/\/(?!localhost|127\.)/, /api\.|endpoint|\/v\d\//],
  degrade:  [/fallback/i, /degrad/i, /unavailable/i, /offline/i, /stale/i, /last[- ]?good/i, /retry|backoff/i, /catch\s*\(|try\s*\{|FAILED\(/, /timeout/i, /unreachable|return nullptr|return false/i],
  contract: [/module\.exports|export (default|function|class|const|interface)/, /interface \w+|type \w+ =|public (class|interface|struct)/, /openapi|swagger/i, /ipcMain\.handle|app\.(get|post|put|delete)\(|__declspec|namespace \w+/],
  policy:   [/\.env|config\.(json|yaml|yml|toml|ini)/i, /settings\.|Settings\.|appsettings/i, /--config|getenv|process\.env|GetEnvironmentVariable/],
  truth:    [/version/i, /health|status/i, /uptime/i, /error|errorHandler|HRESULT/i],
}

function census(root) {
  const files = []
  const walk = (dir) => {
    if (files.length >= MAX_FILES) return
    let entries
    try { entries = readdirSync(dir, { withFileTypes: true }) } catch { return }
    for (const e of entries) {
      if (files.length >= MAX_FILES) return
      if (e.name.startsWith('.')) continue
      const full = join(dir, e.name)
      if (e.isDirectory()) {
        if (!SKIP_DIRS.has(e.name)) walk(full)
      } else files.push(full)
    }
  }
  walk(root)
  return files
}

function sampleContents(files) {
  let text = ''
  let read = 0
  // Entry points and configs carry the most signal — read them first.
  const priority = files.filter(f => /index|main|app|server|program|cli|engine|pipeline/i.test(basename(f)))
  for (const f of [...priority, ...files]) {
    if (read >= MAX_READ || text.length > 2 * 1024 * 1024) break
    const ext = extname(f).toLowerCase()
    if (!CODE_EXTS.has(ext) && !SHADER_EXTS.has(ext) && ext !== '.json' && ext !== '.md') continue
    try {
      const s = statSync(f)
      if (s.size > 2 * 1024 * 1024) continue
      text += readFileSync(f, 'utf8').slice(0, MAX_BYTES) + '\n'
      read++
    } catch { /* locked/binary — skip */ }
  }
  return { text, filesRead: read }
}

function hits(text, pats) {
  return pats.filter(p => p.test(text)).map(p => p.source.slice(0, 42))
}

function loadAdapter(root) {
  const p = join(root, 'sentinal.adapter.json')
  if (!existsSync(p)) return null
  try { return JSON.parse(readFileSync(p, 'utf8')) } catch (e) {
    return { _error: `adapter parse failed: ${e.message}` }
  }
}

function scan(root, source = null, singleton = null) {
  const files = singleton ? [root] : census(root)
  const exts = {}
  for (const f of files) { const e = extname(f).toLowerCase() || '(none)'; exts[e] = (exts[e] || 0) + 1 }
  const codeFiles = files.filter(f => CODE_EXTS.has(extname(f).toLowerCase()))

  let pkg = null
  const pkgPath = join(root, 'package.json')
  if (existsSync(pkgPath)) try { pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) } catch { /* malformed */ }
  const deps = pkg ? Object.keys(pkg.dependencies || {}).concat(Object.keys(pkg.devDependencies || {})) : []

  const { text, filesRead } = sampleContents(files)
  const sig = Object.fromEntries(Object.entries(PATTERNS).map(([k, v]) => [k, hits(text, v)]))

  // Surfaces — how the project presents itself
  const surfaces = []
  if (deps.some(d => d === 'electron') || /from ['"]electron['"]|require\(['"]electron['"]/.test(text)) surfaces.push('desktop (electron)')
  if (files.some(f => basename(f) === 'index.html') || deps.some(d => /react|vue|svelte|vite/.test(d))) surfaces.push('web UI')
  if (/app\.(listen|get\()|express|fastify|createServer/.test(text) || deps.some(d => /express|fastify|ws/.test(d))) surfaces.push('api/server')
  if (files.some(f => /\.csproj$|\.sln$/.test(f)) || deps.length === 0 && codeFiles.some(f => f.endsWith('.cs'))) surfaces.push('native (.NET)')
  if (files.some(f => basename(f) === 'CMakeLists.txt' || f.endsWith('.cpp') || f.endsWith('.cc'))) surfaces.push('native (C/C++)')
  if (/process\.argv|commander|yargs|argparse|click\./.test(text) || pkg?.bin) surfaces.push('cli')
  if (files.some(f => extname(f).toLowerCase() === '.py')) surfaces.push('python')

  // Pipeline extraction — input → transform → output from evidence
  const pipeline = {
    input: sig.input.length ? sig.input : null,
    transform: [...sig.transform, ...sig.gpu, ...sig.wasm].length ? [...new Set([...sig.transform, ...sig.gpu, ...sig.wasm])] : null,
    output: sig.output.length ? sig.output : null,
  }
  const hasPipeline = !!(pipeline.input && pipeline.transform && pipeline.output)

  // Four planes — evidence per plane, doctrine §3 vocabulary
  const planes = {
    p0_sovereignCore: {
      evidence: [codeFiles.length ? `${codeFiles.length} code files` : null,
                 surfaces.length ? `surfaces: ${surfaces.join(', ')}` : null,
                 /class |struct |namespace /.test(text) ? 'structured core types' : null].filter(Boolean),
      present: codeFiles.length >= 3,
    },
    p1_integrationSurface: {
      evidence: [sig.remote.length ? `remote calls: ${sig.remote.slice(0, 3).join(', ')}` : null,
                 deps.length ? `deps: ${deps.slice(0, 6).join(', ')}` : null].filter(Boolean),
      present: sig.remote.length > 0 || deps.some(d => /express|ws|axios|node-fetch/.test(d)),
    },
    p2_operatorPolicy: {
      evidence: sig.policy,
      present: sig.policy.length > 0,
    },
    p3_hybridExecution: {
      evidence: [sig.wasm.length ? 'wasm' : null, sig.gpu.length ? 'gpu/shaders' : null,
                 /worker_threads|new Worker\(/.test(text) ? 'workers' : null,
                 sig.remote.length && sig.transform.length ? 'local compute + remote input' : null].filter(Boolean),
      present: sig.wasm.length + sig.gpu.length > 0 || /worker_threads|new Worker\(/.test(text) || (sig.remote.length > 0 && sig.transform.length > 0),
    },
  }

  // Admission test — §5 criteria, each judged found/partial/absent
  const degrades = sig.degrade.length >= 2
  const admission = {
    'four-planes-nameable': Object.values(planes).filter(p => p.present).length >= 3 ? 'found' : 'partial',
    'degrades-honestly': degrades ? 'found' : sig.degrade.length === 1 ? 'partial' : 'absent',
    'contracts-not-internals': sig.contract.length >= 2 ? 'found' : sig.contract.length === 1 ? 'partial' : 'absent',
    'respects-operator-policy': planes.p2_operatorPolicy.present ? 'found' : 'absent',
    'standalone-before-connected': planes.p0_sovereignCore.present && codeFiles.length >= 3 ? 'found' : 'partial',
    'pipeline-discoverable': hasPipeline ? 'found' : 'absent',
  }
  const found = Object.values(admission).filter(v => v === 'found').length
  const partial = Object.values(admission).filter(v => v === 'partial').length

  // Class suggestion — §6. "Engines host; everything else attaches" —
  // an engine needs a contract seam to host through, so contracts gate
  // the engine hint.
  const contractsFound = admission['contracts-not-internals'] !== 'absent'
  let classSuggestion = null
  if (planes.p0_sovereignCore.present && hasPipeline && planes.p3_hybridExecution.present && contractsFound) classSuggestion = 'engine'
  else if (planes.p0_sovereignCore.present && hasPipeline && planes.p3_hybridExecution.present) classSuggestion = 'engine? (no contract seam detected)'
  else if (surfaces.includes('api/server') || sig.contract.length >= 3) classSuggestion = 'contract/surface'
  else if (hasPipeline && !planes.p0_sovereignCore.present) classSuggestion = 'module'
  else if (codeFiles.length) classSuggestion = 'unclear — review'

  // Verdict — promote / reference / dormant. Host-extensions (mods,
  // plugins, hook libs, SDK shims) legitimately lack a standalone
  // pipeline — they attach to a host. They're modules, not dormant.
  const hostExtension = /ModBehaviour|IPlugin|Harmony|DllExport|__declspec\(dllexport\)|minhook|detour|registerPlugin|extends Plugin|BepInEx/i.test(text)
  let verdict, reasons = []
  if (!hasPipeline) {
    if (hostExtension && codeFiles.length > 0) {
      verdict = 'reference'
      reasons.push('host-extension shape (mod/plugin/hook lib) — attaches to a foreign host; judged on contracts, not standalone pipeline')
      if (!classSuggestion || classSuggestion === 'unclear — review') classSuggestion = 'module (host-extension)'
    } else {
      verdict = 'dormant'
      reasons.push('no discoverable input→transform→output')
      if (codeFiles.length < 3) reasons.push('too little code to carry a pipeline')
    }
  } else if (found >= 4 && degrades) {
    verdict = 'promote-candidate'
    reasons.push(`${found}/6 admission criteria found`, 'degradation evidence present', `class hint: ${classSuggestion}`)
  } else {
    verdict = 'reference'
    reasons.push(`${found} found / ${partial} partial / ${6 - found - partial} absent on admission test`,
                 'real pipeline but doctrine gaps — useful fragments, not a product yet')
  }

  return {
    project: basename(root),
    sourceDir: source,
    path: resolve(root),
    scannedAt: new Date().toISOString(),
    census: { files: files.length, codeFiles: codeFiles.length, filesRead, exts },
    package: pkg ? { name: pkg.name, version: pkg.version, deps: deps.length } : null,
    surfaces,
    pipeline,
    planes,
    degradationEvidence: sig.degrade.slice(0, 8),
    contracts: sig.contract.slice(0, 8),
    truthFlags: sig.truth.slice(0, 8),
    admission,
    classSuggestion,
    verdict,
    reasons,
    confidence: 'auto-scan inference — adapter or operator review required before registry',
  }
}

function applyAdapter(profile, adapter) {
  if (!adapter) return profile
  if (adapter._error) { profile.adapterError = adapter._error; return profile }
  // Adapter wins on every field it declares; scan fills the rest.
  const merged = { ...profile, adapter: adapter }
  for (const k of ['pipeline', 'planes', 'degradationEvidence', 'contracts', 'truthFlags', 'classSuggestion', 'verdict', 'notes']) {
    if (adapter[k] !== undefined) merged[k] = adapter[k]
  }
  if (adapter.verdict) merged.confidence = 'operator-declared via adapter'
  return merged
}

function printProfile(p) {
  const planeMark = (pl) => pl.present ? '✓' : '·'
  console.log(`\n═══ ${p.project} ═══`)
  console.log(`  verdict: ${p.verdict}   class hint: ${p.classSuggestion ?? '—'}`)
  console.log(`  surfaces: ${p.surfaces.join(', ') || 'none detected'}`)
  console.log(`  planes: P0${planeMark(p.planes.p0_sovereignCore)} P1${planeMark(p.planes.p1_integrationSurface)} P2${planeMark(p.planes.p2_operatorPolicy)} P3${planeMark(p.planes.p3_hybridExecution)}`)
  console.log(`  pipeline: ${p.pipeline.input ? 'input✓' : 'input·'} → ${p.pipeline.transform ? 'transform✓' : 'transform·'} → ${p.pipeline.output ? 'output✓' : 'output·'}`)
  console.log(`  admission: ${Object.entries(p.admission).map(([k, v]) => `${v === 'found' ? '✓' : v === 'partial' ? '~' : '✗'} ${k}`).join('  ')}`)
  console.log(`  reasons: ${p.reasons.join(' | ')}`)
  console.log(`  confidence: ${p.confidence}`)
}

// ── CLI ──
const args = process.argv.slice(2)
const write = args.includes('--write')
const positional = args.filter(a => !a.startsWith('--'))

if (positional[0] === '--all' || args[0] === '--all') {
  const roots = (positional[0] === '--all' ? positional.slice(1) : args.slice(1)).map(r => resolve(r)).filter(existsSync)
  if (!roots.length) { console.error('usage: scan.mjs --all <root-dir> [<root2> ...]'); process.exit(1) }
  const subs = roots.flatMap(root => {
    const entries = readdirSync(root, { withFileTypes: true }).filter(e => !e.name.startsWith('.'))
    const eco = basename(root)
    const dirs = entries.filter(e => e.isDirectory()).map(e => ({ dir: join(root, e.name), eco }))
    // Loose code files are singleton projects — zips/screenshots skipped
    const loose = entries.filter(e => e.isFile() && CODE_EXTS.has(extname(e.name).toLowerCase()))
      .map(e => ({ dir: join(root, e.name), eco, singleton: true }))
    return [...dirs, ...loose]
  })
  const profiles = []
  for (const { dir, eco, singleton } of subs) {
    const p = applyAdapter(scan(dir, eco, singleton), loadAdapter(dir))
    profiles.push(p)
    printProfile(p)
    if (write) {
      const dir2 = join(import.meta.dirname, 'profiles')
      mkdirSync(dir2, { recursive: true })
      writeFileSync(join(dir2, `${p.project}.profile.json`), JSON.stringify(p, null, 2))
    }
  }
  // Registry draft — sorted by verdict, doctrine vocabulary
  const order = { 'promote-candidate': 0, 'reference': 1, 'dormant': 2 }
  profiles.sort((a, b) => order[a.verdict] - order[b.verdict] || a.project.localeCompare(b.project))
  const draft = ['# REGISTRY-DRAFT — bridge scan (auto-inferred, unreviewed)', '',
    '| project | sourceDir | verdict | class hint | planes | admission | reasons |', '|---|---|---|---|---|---|---|',
    ...profiles.map(p => `| ${p.project} | ${p.sourceDir ?? '—'} | ${p.verdict} | ${p.classSuggestion ?? '—'} | ${['P0','P1','P2','P3'].map((n,i)=>Object.values(p.planes)[i].present?n:'·').join('')} | ${Object.values(p.admission).filter(v=>v==='found').length}/6 | ${p.reasons.join('; ')} |`),
    '', '*Generated by bridge/scan.mjs — profiles in bridge/profiles/*.json.*']
  if (write) writeFileSync(join(import.meta.dirname, 'REGISTRY-DRAFT.md'), draft.join('\n'))
  console.log(`\n${profiles.length} projects scanned — promote: ${profiles.filter(p=>p.verdict==='promote-candidate').length}, reference: ${profiles.filter(p=>p.verdict==='reference').length}, dormant: ${profiles.filter(p=>p.verdict==='dormant').length}`)
} else {
  const dir = resolve(positional[0] || '.')
  if (!existsSync(dir)) { console.error('usage: scan.mjs <project-dir> [--write] | --all <root> [--write]'); process.exit(1) }
  const p = applyAdapter(scan(dir), loadAdapter(dir))
  printProfile(p)
  console.log(JSON.stringify(p, null, 2))
  if (write) {
    const dir2 = join(import.meta.dirname, 'profiles')
    mkdirSync(dir2, { recursive: true })
    writeFileSync(join(dir2, `${p.project}.profile.json`), JSON.stringify(p, null, 2))
    console.log(`\nprofile → bridge/profiles/${p.project}.profile.json`)
  }
}
