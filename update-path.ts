import { parse, stringify } from 'yaml'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const [,, input, output] = process.argv

if (!input || !output) {
  console.error("Usage: bun update-path.ts <input-yaml> <output-yaml>")
  process.exit(1)
}

try {
  const options = {
    indent: 2,
    lineWidth: 0,
    keepSourceTokens: true,
    keepCstNodes: true,
    keepNodeMap: true,
    keepBlobsInJSON: true,
  }
  const source = readFileSync(input, "utf8")
  const data = parse(source, options)

  function updateHostPaths(obj: any, currentDir: string) {
    if (typeof obj !== 'object' || obj === null) return

    for (const key in obj) {
      if (key === 'hostPath') {
        const hostPath = resolve(currentDir, obj[key])
        if (!existsSync(hostPath)) {
          console.warn(`Warning: path does not exist: ${hostPath}`)
        }
        obj[key] = hostPath
      } else if (typeof obj[key] === 'object') {
        updateHostPaths(obj[key], currentDir)
      }
    }
  }

  const currentDir = resolve(input, '..')
  updateHostPaths(data, currentDir)


  const updated = stringify(data, options)
  writeFileSync(output, updated, "utf8")

  console.log(`updated and wrote to ${output}`)
} catch (error) {
  console.error("Error processing YAML file:", error)
  process.exit(1)
}
