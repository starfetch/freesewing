function draftHood({ part }) {
  return part
}

export const hood = {
  name: 'pythia.hood',
  draft: draftHood,
  measurements: ['neck', 'head'],
}
