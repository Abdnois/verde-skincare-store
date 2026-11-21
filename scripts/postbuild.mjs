// Strips files the Sites uploader refuses (hidden files and source maps)
// from the build output, so `deploy.json` can point straight at dist/.
import { existsSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

// A bundle that still ends with `//# sourceMappingURL=index.js.map` breaks once
// the map is deleted: `wrangler deploy` rejects a missing source map. Strip the
// reference together with the map so the two cannot disagree.
const MAP_REFERENCE = /(?:\/\/# sourceMappingURL=\S+|\/\*# sourceMappingURL=\S+?\*\/)\s*$/

function stripMapReference(path) {
  if (!/\.(?:js|mjs|css)$/.test(path)) return
  const source = readFileSync(path, 'utf8')
  const stripped = source.replace(MAP_REFERENCE, '')
  if (stripped === source) return
  writeFileSync(path, `${stripped.trimEnd()}\n`)
}

function clean(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (name.startsWith('.') || name.endsWith('.map')) {
      rmSync(path, { recursive: true, force: true })
      continue
    }
    if (statSync(path).isDirectory()) clean(path)
    else stripMapReference(path)
  }
}

// fileURLToPath keeps this correct on Windows, where URL#pathname yields
// "/C:/..." and would otherwise resolve to a bogus "C:\C:\..." path.
const dist = fileURLToPath(new URL('../dist/', import.meta.url))

if (existsSync(dist)) clean(dist)
else console.warn(`postbuild: no build output at ${dist}, nothing to strip`)
