//

import { Design } from '@freesewing/core'
import { i18n } from '../i18n/index.mjs'
import { data } from '../data.mjs'
// Parts
import { paenula } from './paenula.mjs'
import { hood } from './hood.mjs'

// Create new design
const Pythia = new Design({
  data,
  parts: [paenula, hood],
})

// Named exports
export { paenula, hood, i18n, Pythia }
