import { version } from '../package.json'

// ?? 🤔 ?? --> https://en.freesewing.dev/packages/core/config

export default {
    name: 'pythia',
    version,
    design: 'Rika Tamaike',
    code: 'Rika Tamaike',
    department: 'tops',
    type: 'pattern',
    difficulty: 1,
    tags: [
	'freesewing',
	'design',
	'diy',
	'fashion',
	'made to measure',
	'parametric design',
	'pattern',
	'sewing',
	'sewing pattern',
    ],
    optionGroups: {
	fit:
	['headRatio','neckRatio']
	,
	style: ['lengthBonus',
		'length',
		'draftForUnderbust',
		'closure',
		{hood: [
		    'hood',
		    'hoodHeight',
		    'hoodDepth',
		]}
	       ],
	
    },
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
    optionalMeasurements: ['bustPointToUnderbust'],
    dependencies: {hood: 'paenula'},
    inject: {},
    hide: [],
    parts: [
	'paenula',
	'hood',
    ],
    options: {
	headRatio: {pct: 100, min: 80, max: 120},
	lengthBonus:{ pct: 101, min: 60, max: 140 },
	length: {
	    list: ['ToBust',
		   'ToWaist',
		   'ToHips',
		   'ToUpperLeg',
		   'ToKnee',
		   'ToAnkle',
		   'ToFloor'],
	    dflt: 'ToKnee'
	},
	draftForUnderbust: { bool: false },
	neckRatio: {pct: 120, min: 95, max: 130},
	closure: {pct: 150, min: 110, max: 200},
	hood: {bool: true},
	hoodHeight: { pct: 120, min: 105, max: 150 },
	hoodDepth: { pct: 115, min: 100, max: 150 },
    },
}
