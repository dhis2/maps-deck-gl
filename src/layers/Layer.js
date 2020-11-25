import { v4 as uuid } from 'uuid'
import { Evented } from '../utils/events'
import { bbox2bounds, getBBox } from '../utils/geometry'

class Layer extends Evented {
    constructor(options = {}) {
        super()
        this._id = uuid()
        this.options = options
        this.setFeatures(options.data)
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

    getIndex() {
        return this.options.index || 0
    }

    getBBox() {
        console.log('layer getBBox', getBBox(this.getFeatures()))

        return getBBox(this.getFeatures())
    }

    getBounds() {
        return bbox2bounds(this.getBBox())
    }

    getFeatures() {
        return this._features || []
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

    setFeatures(data = []) {
        this._features = data
    }
}

export default Layer
