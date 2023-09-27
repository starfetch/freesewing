import fs_ from 'fs'
import path from 'path'
import allDesigns from '../../../config/software/designs.json' assert { type: 'json' }
import { capitalize } from '../../../sites/shared/utils.mjs'

const fs = fs_.promises

// async import
async function loadDesign(design) {
  let result
  try {
    result = await import(`../../../designs/${design}/src/index.mjs`)
  } catch (err) {
    console.log(`Failed to load design ${design}:`, err)
  }

  return result
}

export const prebuildDesigns = async (store) => {
  const promises = []

  const measurements = {}
  const options = {}
  for (const design in allDesigns) {
    const bundle = await loadDesign(design)
    const Instance = new bundle[capitalize(design)]()
    const config = Instance.getConfig()
    measurements[design] = config.measurements
    options[design] = config.options
  }

  // Update the store
  store.designs = {
    designs: Object.keys(allDesigns),
    options,
    measurements,
  }

  // Write out prebuild files
  const header =
    '// This file is auto-generated by the prebuild script | Any changes will be overwritten\n'
  const nl = '\n'
  const dir = ['..', 'shared', 'prebuild', 'data']
  promises.push(fs.mkdir(path.resolve(...dir), { recursive: true }))
  promises.push(
    fs.writeFile(
      path.resolve(...dir, 'designs.mjs'),
      `${header}export const designs = ${JSON.stringify(Object.keys(allDesigns))}${nl}`
    ),
    fs.writeFile(
      path.resolve(...dir, 'design-measurements.mjs'),
      `${header}export const measurements = ${JSON.stringify(measurements)}${nl}`
    ),
    fs.writeFile(
      path.resolve(...dir, 'design-options.mjs'),
      `${header}export const options = ${JSON.stringify(options)}${nl}`
    )
  )

  return await Promise.all(promises)
}
