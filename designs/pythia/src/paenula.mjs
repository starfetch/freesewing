function draftPaenula({
  Path,
  Point,
  paths,
  points,
  measurements,
  options,
  macro,
  snippets,
  Snippet,
  store,
  utils,
  part,
}) {
  // Store different lengths of paenula
  let hem_pos
  if (options.length === 'toWaist') {
    hem_pos = 0
  } else if (options.length === 'toCalf') {
    hem_pos = 0.75 * measurements.waistToFloor
  } else if (options.length === 'toAnkle') {
    hem_pos = 0.9 * measurements.waistToFloor
  } else {
    hem_pos = measurements[`waist${utils.capitalize(options.length)}`]
  }

  store.set(
    'length',
    (options.length === 'toBust'
      ? measurements.hpsToBust + (options.draftForUnderbust ? measurements.bustPointToUnderbust : 0)
      : measurements.hpsToWaistBack + hem_pos) * options.lengthBonus
  )

  console.log(store.get('length'))

  let hneck = (measurements.neck / 2) * options.neckRatio * options.closure

  // make points
  points.top = new Point(0, 0)

  // optimise neck opening
  let tweak = 1
  let target = hneck
  let delta

  return part
}

export const paenula = {
  name: 'pythia.paenula',
  draft: draftPaenula,
  measurements: [
    'neck',
    'head',
    'hpsToWaistBack',
    'waistToKnee',
    'waistToHips',
    'waistToFloor',
    'waistToUpperLeg',
    'hpsToBust',
  ],
  options: {
    headRatio: { pct: 100, min: 80, max: 120, menu: 'fit' },
    lengthBonus: { pct: 101, min: 60, max: 140, menu: 'fit' },
    length: {
      list: ['toBust', 'toWaist', 'toHips', 'toUpperLeg', 'toKnee', 'toCalf', 'toAnkle', 'toFloor'],
      dflt: 'toKnee',
      menu: 'style',
    },
    draftForUnderbust: { bool: false, menu: 'fit' },
    neckRatio: { pct: 120, min: 95, max: 130, menu: 'fit' },
    closure: { pct: 150, min: 110, max: 200, menu: 'style' },
    hood: { bool: true, menu: 'style' },
    hoodHeight: { pct: 120, min: 105, max: 150, menu: 'style' },
    hoodDepth: { pct: 115, min: 100, max: 150, menu: 'style' },
  },
}
