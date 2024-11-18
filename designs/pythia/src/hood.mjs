function draftHood({
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
  utils,
  part,
}) {
  // only create part if option is set
  if (!options.hood) return part

  // get stored values
  let neck = store.get('neckOpening')

  // create some variables
  let head = 0.65 * measurements.head * options.headRatio

  // check if neck seam is bigger than head depth
  let depth
  if (neck > head) {
    depth = neck
  } else {
    depth = head
  }

  let hoodDepth = depth * options.hoodDepth
  let hoodHeight = head * options.hoodHeight

  // make points
  points.top = new Point(0, 0)
  points.bottom = points.top.shift(-90, hoodHeight)
  points.backBottom = points.bottom.shift(0, neck)
  points.backTop = points.backBottom.shift(-90, points.bottom.dy(points.top))

  points.backTemp = points.top.shiftFractionTowards(points.bottom, 0.4)

  points.depth = points.backTemp.shift(0, hoodDepth)

  points.topBack = utils.beamsIntersect(points.backBottom, points.depth, points.top, points.backTop)

  paths.back = new Path().move(points.backBottom).line(points.topBack)

  paths.top = new Path().move(points.topBack).line(points.top)

  paths.front = new Path().move(points.top).line(points.bottom).line(points.backBottom)

  // full seam path
  paths.seam = paths.back.join(paths.top).join(paths.front)

  // annotations

  // cut on fold
  macro('cutonfold', {
    from: points.topBack,
    to: points.top,
    grainline: true,
  })

  /*
   * Cut list
   */
  store.cutlist.addCut({ cut: 1, from: 'fabric', onFold: true })

  // seam allowance
  if (sa) paths.sa = paths.front.join(paths.back).offset(sa).close().addClass('fabric sa')

  points.logo = points.top.shift(135, points.bottom.dy(points.top) / 3)
  snippets.logo = new Snippet('logo', points.logo)
  points.title = points.logo.shift(-110, 30)
  macro('title', {
    at: points.title,
    nr: 2,
    title: 'hood',
    align: 'center',
    scale: 0.8,
  })
  points.scalebox = points.title.shift(-90, 65)
  macro('scalebox', { at: points.scalebox })

  /*
   * Add dimensions
   */

  macro('hd', {
    id: 'hd1',
    from: points.bottom,
    to: points.backBottom,
    y: points.bottom.y + 10,
  })

  macro('hd', {
    id: 'hd2',
    from: points.top,
    to: points.topBack,
    y: points.top.y - 10,
  })
  macro('vd', {
    id: 'vd1',
    from: points.bottom,
    to: points.top,
    x: points.top.x - 10,
  })
  macro('hd', {
    id: 'hd3',
    from: points.backTemp,
    to: points.depth,
    d: 0,
  })
  macro('vd', {
    id: 'vd2',
    from: points.backTemp,
    to: points.top,
    x: 10,
  })
  macro('ld', {
    id: 'ld1',
    from: points.backBottom,
    to: points.topBack,
    d: -10,
  })

  return part
}

export const hood = {
  name: 'pythia.hood',
  draft: draftHood,
  measurements: ['neck', 'head'],
}
