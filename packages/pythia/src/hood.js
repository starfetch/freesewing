export default function (part) {
  let {
    store,
    macro,
    Point,
    Path,
    points,
    paths,
    complete,
    paperless,
    snippets,
    Snippet,
    sa,
    options,
      measurements,
      utils,
  } = part.shorthand()

    // only create part if option is set
    if (!options.hood) return part

    // get stored values
    let neck = store.get('neckOpening')

    // create some variables
    let head = 0.65*measurements.head * options.headRatio

    
    // check if neck seam is bigger than head depth
    let depth
    if (neck > head){
	depth = neck
    }
    else{
	depth = head
    }
	
    let hoodDepth = depth * options.hoodDepth
    let hoodHeight = head * options.hoodHeight
    
    // make points
    points.top = new Point(0,0)
    points.bottom = points.top.shift(-90,hoodHeight)
    points.backBottom = points.bottom.shift(0,neck)
    points.backTop = points.backBottom.shift(-90,points.bottom.dy(points.top))

    points.backTemp = points.top.shiftFractionTowards(points.bottom,.4)


    points.depth = points.backTemp.shift(0,hoodDepth)
    
    
    points.topBack = utils.beamsIntersect(points.backBottom, points.depth, points.top, points.backTop)

    paths.back = new Path()
	.move(points.backBottom)
	.line(points.topBack)

    paths.top = new Path()
	.move(points.topBack)
	.line(points.top)


    paths.front = new Path()
	.move(points.top)
	.line(points.bottom)
	.line(points.backBottom)

    // full seam path
    paths.seam = paths.back.join(paths.top).join(paths.front)
    
    // Complete?
    if (complete) {
	// logo & title
	points.logo = points.top.shift(135,points.bottom.dy(points.top)/3)
	snippets.logo = new Snippet("logo", points.logo)
	points.title = points.logo.shift(90, points.bottom.dy(points.top)/4)
	macro("title", {
	    at: points.title,
	    nr: 2,
	    title: "hood"
	})
	points.__titleNr.attr('data-text-class', 'center')
	points.__titleName.attr('data-text-class', 'center')
	points.__titlePattern.attr('data-text-class', 'center')

	// scalebox
	//points.scalebox = points.title.shift(90, points.bottom.dy(points.top)/5)
	//macro("scalebox", { at: points.scalebox })

	// seam allowance
	if (sa){}
	    paths.sa = paths.seam.offset(sa)
		.close()
		.attr('class', 'fabric sa')
	    }
    
  // Paperless?
    if (paperless) {
	macro("hd", {
	    from: points.bottom,
	    to: points.backBottom,
	    y: points.bottom.y +10
	});
//	macro("hd", {
//	    from: points.bottom,
//	    to: points.depth,
//	    y: points.bottom.y +20
//	});
//	macro("hd", {
//	    from: points.backBottom,
//	    to: points.depth,
//	    y: points.bottom.y +10
//	});
	macro("hd", {
	    from: points.top,
	    to: points.topBack,
	    y: points.top.y -10
	});
	macro("vd", {
	    from: points.bottom,
	    to: points.top,
	    x: points.top.x -10
	});
	macro("hd", {
	    from: points.backTemp,
	    to: points.depth,
	    d:  0
	});
	macro("ld", {
	    from: points.backBottom,
	    to: points.topBack,
	    d:  -10
	});
    }
    return part
}
