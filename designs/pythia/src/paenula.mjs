import { bool } from 'prop-types'

function draftPaenula({
  Path,
  Point,
  paths,
  points,
  measurements,
  options,
  macro,
  sa,
  snippets,
  Snippet,
  store,
  units,
  utils,
  part,
}) {
  // Store different lengths of paenula

  let hem_pos =
    options.length === 'toWaist'
      ? 0
      : options.length === 'toCalf'
        ? 0.75 * measurements.waistToFloor
        : options.length === 'toAnkle'
          ? 0.9 * measurements.waistToFloor
          : options.length === 'toBust'
            ? measurements.hpsToBust +
              (options.draftForUnderbust ? measurements.bustPointToUnderbust : 0)
            : measurements[`waist${utils.capitalize(options.length)}`]

  // check existance of optional measies
  if (
    (!measurements[`waist${utils.capitalize(options.length)}`] &&
      !['toWaist', 'toCalf', 'toAnkle', 'toBust'].includes(options.length)) || // thanks, ChatGPT!
    (['toCalf', 'toAnkle'].includes(options.length) && !measurements.waistToFloor) ||
    (options.length === 'toBust' && !measurements.hpsToBust)
  ) {
    hem_pos = measurements.waistToKnee
    store.flag.note({ title: 'missingMeasure', desc: 'missingMeasureSetToDefault' })
  }

  store.set(
    'length',
    (options.length === 'toBust' && measurements.hpsToBust
      ? hem_pos
      : measurements.hpsToWaistBack + hem_pos) * options.lengthBonus
  )

  // TODO: proper referencable string
  store.flag.info({
    msg: 'Total Length',
    notes: `${units(store.get('length'))}`,
  })

  const hneck = (measurements.neck / 2) * options.neckRatio * options.closure

  // make points
  points.top = new Point(0, 0)

  // draw neck opening
  points.neckLeft = points.top.shift(180, hneck)
  points.neckBottom = points.top.shift(-90, hneck)
  points.neckLeftBottom = points.neckLeft.shift(-90, points.top.dy(points.neckBottom))

  // inner circle
  const ids1 = {
    neckLeft: macro('round', {
      id: 'neckLeft',
      from: points.neckLeft,
      to: points.neckBottom,
      via: points.neckLeftBottom,
      radius: store.get('length'),
      hide: false,
    }),
  }

  /*
   * Create points from them with easy names
   */
  for (const side in ids1) {
    for (const id of ['start', 'cp1', 'cp2', 'end']) {
      points[`${side}${utils.capitalize(id)}`] = points[ids1[side].points[id]].copy()
    }
  }

  // draw neck path
  paths.neck = new Path()
    .move(points.neckLeftEnd)
    .curve(points.neckLeftCp2, points.neckLeftCp1, points.neckLeftStart)

  points.bottom = points.neckLeftEnd.shift(-90, store.get('length'))
  points.topLeft = points.neckLeftStart.shift(180, store.get('length'))
  points.bottomLeft = points.topLeft.shift(-90, points.top.dy(points.bottom))

  // outer circle
  const ids2 = {
    left: macro('round', {
      id: 'left',
      from: points.topLeft,
      to: points.bottom,
      via: points.bottomLeft,
      radius: 2 * store.get('length'),
      hide: false,
    }),
  }

  /*
   * Create points from them with easy names
   */
  for (const side in ids2) {
    for (const id of ['start', 'cp1', 'cp2', 'end']) {
      points[`${side}${utils.capitalize(id)}`] = points[ids2[side].points[id]].copy()
    }
  }

  // draw other paths
  paths.frontseam = new Path().move(points.neckLeftStart).line(points.topLeft).hide()

  store.set('neckOpening', paths.neck.length()) // store neckline seam for hood
  console.log(store.get('neckOpening'))

  paths.foldLine = new Path().move(points.bottom).line(points.neckLeftEnd).attr('class', 'fabric')

  paths.hem = new Path()
    .move(points.leftStart)
    .curve(points.leftCp1, points.leftCp2, points.leftEnd)
    .attr('class', 'fabric')
    .hide()

  paths.seam = paths.neck.join(paths.frontseam).attr('class', 'fabric')

  // cut on fold
  macro('cutonfold', {
    from: points.bottom,
    to: points.neckLeftEnd,
    grainline: true,
  })

  // seam allowance
  if (sa)
    paths.sa = paths.seam
      .offset(sa)
      .join(paths.hem.offset(sa * 2.5))
      .close()
      .addClass('fabric sa')

  /*
   *
   *  Annotations
   *
   */

  /*
   * Cut list
   */
  store.cutlist.addCut({ cut: 1, from: 'fabric', onFold: true })

  /*
   * Add the logo
   */
  points.logo = points.neckLeftStart.shift(45, points.bottom.dy(points.top) / 4)
  snippets.logo = new Snippet('logo', points.logo)

  /*
   * Add the title
   */
  points.title = points.logo.shift(-110, 50)
  macro('title', {
    at: points.title,
    nr: 1,
    title: 'paenula',
    align: 'center',
    scale: 0.8,
  })

  /*
   * Add the scalebox
   */
  points.scalebox = points.title.shift(-90, 65)
  macro('scalebox', { at: points.scalebox })

  /*
   * Add dimensions
   */
  macro('hd', {
    id: 'hd1',
    from: points.leftStart,
    to: points.neckLeftStart,
    y: points.leftStart.y - 10,
  })
  macro('hd', {
    id: 'hd2',
    from: points.neckLeftStart,
    to: points.top,
    y: points.top.y - 10,
  })
  macro('hd', {
    id: 'hd3',
    from: points.leftStart,
    to: points.top,
    y: points.top.y - 20,
  })
  macro('pd', {
    path: paths.hem,
    d: 10,
  })
  macro('pd', {
    id: 'pd1',
    path: paths.neck.reverse(),
    d: 10,
  })

  macro('pd', {
    id: 'pd2',
    path: paths.neck.reverse(),
    d: 10,
  })

  return part
}

export const paenula = {
  name: 'pythia.paenula',
  draft: draftPaenula,
  measurements: ['neck', 'hpsToWaistBack', 'waistToKnee'],
  optionalMeasurements: [
    'hpsToBust',
    'bustPointToUnderbust',
    'waistToHips',
    'waistToUpperLeg',
    'waistToFloor',
  ],
  options: {
    headRatio: { pct: 100, min: 80, max: 120, menu: 'fit' },
    lengthBonus: { pct: 101, min: 60, max: 140, menu: 'fit' },
    length: {
      list: ['toBust', 'toWaist', 'toHips', 'toUpperLeg', 'toKnee', 'toCalf', 'toAnkle', 'toFloor'],
      dflt: 'toKnee',
      menu: 'style',
    },
    draftForUnderbust: {
      bool: false,
      menu: (settings) => (settings?.measurements?.bustPointToUnderbust ? 'fit' : false),
    },
    neckRatio: { pct: 120, min: 95, max: 130, menu: 'fit' },
    closure: { pct: 150, min: 110, max: 200, menu: 'style' },
    hood: { bool: true, menu: 'style' },
    hoodHeight: { pct: 120, min: 105, max: 150, menu: 'style' },
    hoodDepth: { pct: 115, min: 100, max: 150, menu: 'style' },
  },
}
