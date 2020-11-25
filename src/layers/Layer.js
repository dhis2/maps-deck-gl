import { v4 as uuid } from 'uuid'
import { Evented } from 'mapbox-gl'

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
        // console.log('setIndex', index)
    }

    setOpacity(opacity) {
        this.options.opacity = opacity
        this._map.renderLayers()
        // console.log('setOpacity', opacity, this._layer)
        // this._layer.setProps({ opacity })
    }

    setVisibility(visible) {
        this.options.visible = visible
        // console.log('setVisibility', isVisible, this._layer)
        // this._layer.setProps({ visible })
    }
}

export default Layer
