import { v4 as uuid } from 'uuid'
import { Evented } from '../utils/events'

class Layer extends Evented {
    constructor(options = {}) {
        super()
        this._id = uuid()
        this.options = options
    }

    addTo(map) {
        this._map = map
        map.renderLayers()
    }

    removeFrom(map) {
        map.renderLayers()
        this._map = null
    }

    getId() {
        return this._id
    }

    setIndex(index = 0) {
        this.options.index = index
    }

    setOpacity(opacity) {
        this.options.opacity = opacity
        this._map.renderLayers()
    }

    setVisibility(visible) {
        this.options.visible = visible
    }
}

export default Layer
