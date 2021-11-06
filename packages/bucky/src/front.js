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






  // Clean up
 /* for (let i in paths) {
    if (['frontArmhole', 'frontCollar'].indexOf(i) === -1) delete paths[i]
  }
  for (let i in snippets) delete snippets[i]
*/
  // Paths

/*    paths.saBase = new Path()
    .move(points.psHem)
    .line(points.bustPoint)
    .curve_(points.bustPointCp1, points.armholePitch)
    .join(paths.frontArmhole)
    .line(points.s3CollarSplit)
    .join(paths.frontCollar)
    .line(points.collarTip)
    ._curve(points.lapelStraightEndCp1, points.lapelStraightEnd)
    .line(points.hemEdge)
    .line(points.flbHem)
  paths.seam = paths.saBase.clone().line(points.psHem).close().attr('class', 'fabric')
*/


  if (complete) {

    if (sa) {
    }
  }

  return part
}
