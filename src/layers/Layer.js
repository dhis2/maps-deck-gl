import { v4 as uuid } from 'uuid'
import { Evented } from '../utils/events'
import { bbox2bounds, getBBox } from '../utils/geometry'
import { template } from '../utils/misc'
import './Layer.css'

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

        this.onAdd()
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

    getTooltip = feature => {
        const { label, hoverLabel } = this.options
        const str = label || hoverLabel
        return str && feature
            ? {
                  text: template(str, feature.properties),
                  className: 'dhis2-map-tooltip',
              }
            : null
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

    onAdd() {}
}

export default Layer
