export default function(part) {
    let {
	Point,
	points,
	Path,
	paths,
	measurements,
	options,
	macro,
	complete,
	snippets,
	Snippet,
	sa,
	paperless,
	store
    } = part.shorthand();
    

    // set different lengths of paenula
    let ref_point = measurements.hpsToWaistBack
    let hem_pos
    if (options.length === 'ToBust'){ref_point = measurements.hpsToBust,
				     hem_pos = 0}
    if (options.length === 'ToWaist'){hem_pos = 0}
    if (options.length === 'ToKnee'){hem_pos = measurements.waistToKnee}
    if (options.length === 'ToHips'){hem_pos = measurements.waistToHips}
    if (options.length === 'ToUpperLeg'){hem_pos = measurements.waistToUpperLeg}
    if (options.length === 'ToFloor'){hem_pos = measurements.waistToFloor}
    // define some variables
//    let hwidth = (measurements.shoulderToShoulder/2 + measurements.shoulderToElbow) * options.widthBonus
    let length = (ref_point + hem_pos) * options.lengthBonus
    let hneck = (measurements.neck/2)*options.neckRatio*options.closure

    // make points
    points.top = new Point(0,0)

    // optimise neck opening
    let tweak = 1
    let target = hneck
    let delta
    do {
	points.neckLeft = points.top.shift(180,hneck*tweak)
	points.neckBottom = points.top.shift(-90,hneck*tweak)
	points.neckLeftBottom = points.neckLeft.shift(-90,points.top.dy(points.neckBottom))	

	// inner circle
    macro("round", {
	from: points.neckLeft,
	to: points.neckBottom,
	via: points.neckLeftBottom,
	radius: length,
	prefix: "neckLeft",
	//render: true
    })

	// draw neck path
	paths.neck = new Path()
	    .move(points.neckLeftEnd)
	    .curve(points.neckLeftCp2, points.neckLeftCp1, points.neckLeftStart)
	    .setRender(false)
	
	delta = paths.neck.length() - target;
	if (delta > 0) tweak = tweak * 0.99;
	else tweak = tweak * 1.02;
    } while (Math.abs(delta) > 1);

    points.bottom = points.neckLeftEnd.shift(-90,length)
    points.topLeft = points.neckLeftStart.shift(180,length)
    points.bottomLeft = points.topLeft.shift(-90,points.top.dy(points.bottom))
 //   points.topRight = points.topLeft.flipX()
//    points.bottomRight = points.bottomLeft.flipX()

    // outer circle
    macro("round", {
	from: points.topLeft,
	to: points.bottom,
	via: points.bottomLeft,
	radius: 2*length,
	prefix: "left",
	render: true
    })

    
    // draw other paths
    paths.frontseam = new Path()
	.move(points.neckLeftStart)
	.line(points.topLeft)
	.setRender(false)
    
  store.set('neckOpening', paths.neck.length()) // store neckline seam for hood

    paths.foldLine = new Path()
	.move(points.bottom)
	.line(points.neckLeftEnd)
	.attr('class', 'fabric')

    paths.hem = new Path()
	.move(points.leftStart)
	.curve(points.leftCp1,points.leftCp2,points.leftEnd)
	.attr('class', 'fabric')
	.setRender(false)
    
    paths.seam = paths.neck.join(paths.frontseam)
    .attr('class', 'fabric')
	
    // Complete?
    
    if (complete) {

	// cut on fold
	macro('cutonfold', {
	    from: points.bottom,
	    to: points.neckLeftEnd,
	    grainline: true,
	})

	// logo & title
	points.logo = points.neckLeftStart.shift(45,points.bottom.dy(points.top)/4);
	snippets.logo = new Snippet("logo", points.logo);
	points.title = points.logo.shift(90, points.bottom.dy(points.top)/4);
	macro("title", {
	    at: points.title,
	    nr: 1,
	    title: "paenula"
	})
	points.__titleNr.attr('data-text-class', 'center')
	points.__titleName.attr('data-text-class', 'center')
	points.__titlePattern.attr('data-text-class', 'center')

	// scalebox
	points.scalebox = points.title.shift(90, points.bottom.dy(points.top)/5)
	macro("scalebox", { at: points.scalebox })

	// seam allowance
	if (sa) {
	    paths.sa = paths.seam.offset(sa)
		.join(paths.hem.offset(sa * 2.5))
		.close()
		.attr('class', 'fabric sa')
	}
    }
	
    // Paperless?
    if (paperless) {    	    
	macro("hd", {
	    from: points.leftStart,
	    to: points.neckLeftStart,
	    y: points.leftStart.y -10
	});
	macro("hd", {
	    from: points.neckLeftStart,
		to: points.top,
	    y: points.top.y -10
	});
	macro("hd", {
	    from: points.leftStart,
	    to: points.top,
	    y: points.top.y - 20
	});
	macro('pd', {
	    path: paths.hem,
	    d: 10
	})
	macro('pd', {
	    path: paths.neck.reverse(),
	    d: 10
	})
    }
    
    return part;
}
