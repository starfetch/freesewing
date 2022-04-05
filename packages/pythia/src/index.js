import freesewing from '@freesewing/core'
import plugins from '@freesewing/plugin-bundle'
import config from '../config'
import draftPaenula from './paenula'
import draftHood from './hood'

// Create new design
const Pattern = new freesewing.Design(config, plugins)

Pattern.prototype.draftPaenula = draftPaenula
Pattern.prototype.draftHood = draftHood

export default Pattern
