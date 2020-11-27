import Map from './Map'
import supportedLayers from './layers/layerTypes'
import supportedControls from './controls/controlTypes'

/**
 *  Wrapper around deck.gl for DHIS2 Maps
 */

export const layerTypes = Object.keys(supportedLayers)

export const controlTypes = Object.keys(supportedControls)

export const loadEarthEngineApi = () => {}

export const poleOfInaccessibility = () => {}

export default Map
