export default function (part) {
  let {
    paperless,
    sa,
    snippets,
    Snippet,
    utils,
    store,
    complete,
    points,
    measurements,
    options,
    macro,
    Point,
    paths,
    Path,
  } = part.shorthand()

    /*
some notes: 
useful points:
point.cfNeck
point.cbHps
point.seat
point.waist
point.hemEdge

*/

    const upperLeg = measurements.waistToUpperLeg * options.length

    points.upperLeg = points.waist.shift(-90,upperLeg)
    points.hem = points.seat.shift(-90,points.seat.dy(points.upperLeg))
    points.hemEdge = points.hem.shift(0,points.hem.dx(points.hemEdge)) // interesting, dynamic variable renaming


  // Clean up
  for (let i in paths) {
      if (['frontArmhole', 'frontCollar'].indexOf(i) === -1) delete paths[i]
  }
  //for (let i in snippets) delete snippets[i]

  // Paths

     paths.saBase = new Path()
    .move(points.hem)
    .line(points.seat)
    .curve(points.seatCp2, points.waistCp1, points.waist)
    .curve_(points.waistCp2, points.armhole)
    .curve(points.armholeCp2, points.armholeHollowCp1, points.armholeHollow)
    .curve(points.armholeHollowCp2, points.armholePitchCp1, points.armholePitch)
    .join(paths.frontArmhole)
    .line(points.s3CollarSplit)
    .join(paths.frontCollar)
    .line(points.collarTip)
    ._curve(points.lapelStraightEndCp1, points.lapelStraightEnd)
    .line(points.hemEdge)
//    .line(points.flbHem)
  paths.hemBase = new Path().move(points.hem).line(points.hemEdge)
  paths.saBase.render = false
  paths.hemBase.render = false
  paths.seam = paths.saBase.join(paths.hemBase).close().attr('class', 'fabric')


  if (complete) {

    if (sa) {
    }
  }

  return part
}
