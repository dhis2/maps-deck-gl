import Map from './Map'
import supportedLayers from './layers/layerTypes'

/**
 *  Wrapper around deck.gl for DHIS2 Maps
 */

export const layerTypes = Object.keys(supportedLayers)

export const controlTypes = []

export const loadEarthEngineApi = () => {}

export const poleOfInaccessibility = () => {}

export default Map
