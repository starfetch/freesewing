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


    points.test = points.hps.shift(-90,20)
    points.cbNeckHem = points.cfSeat.shift(-90,points.seat.dy(points.hem))
    points.closureHem = points.cbNeckHem.shift(0,points.cfNeck.dx(points.hps)/2)
    points.closureWaist = points.closureHem.shift(90,points.waist.dy(points.hem)*0.8)

    paths.side = new Path()
	.move(points.hps)
	.line(points.closureWaist)
    
    
  if (complete) {

    if (sa) {
    }
  }

  return part
}
