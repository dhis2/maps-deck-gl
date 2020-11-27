import { Deck, MapView } from '@deck.gl/core'
import debounce from 'lodash.debounce'
import { fitBounds } from '@math.gl/web-mercator'
import { Evented } from './utils/events'
import layerTypes from './layers/layerTypes'
import controlTypes from './controls/controlTypes'
import { createCanvas } from './utils/map'
import { getViewFromBounds, getBoundsFromLayers } from './utils/geometry'
import './Map.css'

// https://github.com/visgl/deck.gl/blob/master/modules/core/bundle/deckgl.js
// https://github.com/visgl/deck.gl/blob/master/modules/core/src/lib/deck.js
export class Map extends Evented {
    constructor(el, options = {}) {
        super()

        this._container = el
        this._layers = []
        this._controls = {}
        this._view = new MapView()

        this._mapgl = new Deck({
            canvas: createCanvas(el),
            controller: true,
            views: [this._view],
            layers: this.getLayers(),
            onLoad: this.onLoad,
            onViewStateChange: this.onViewStateChange,
            onAfterRender: this.onAfterRender,
        })

        if (options.attributionControl !== false) {
            this.addControl({ type: 'attribution' })
        }
    }

    onLoad = evt => {
        if (this._bounds) {
            this.fitBounds(this._bounds)
            this._bounds = null
        }

        this.fire('ready', this)
    }

    onViewStateChange = ({ viewState }) => {
        // console.log('onViewStateChange', viewState)
    }

    getContainer() {
        return this._container
    }

    getSize() {
        const { offsetWidth: width, offsetHeight: height } = this._container
        return { width, height }
    }

    getLayers() {
        return this._layers
    }

    // https://github.com/visgl/deck.gl/blob/master/modules/core/src/viewports/web-mercator-viewport.js
    fitBounds(bounds) {
        const { width, height } = this.getSize()

        if (width && height) {
            // https://github.com/uber-web/math.gl/blob/master/modules/web-mercator/src/fit-bounds.js
            this._mapgl.setProps({
                viewState: fitBounds({ width, height, bounds }),
            })
        } else {
            // Map not yet ready
            this._bounds = bounds
        }
    }

    fitWorld() {
        this.fitBounds([
            [-180, -90],
            [180, 90],
        ])
    }

    getLayersBounds() {
        const bounds = getBoundsFromLayers(this.getLayers())

        // console.log('Map, getLayersBounds', bounds, this.getLayers())

        return bounds
    }

    resize() {}
    addControl() {}
    remove() {}

    addLayer(layer) {
        this.getLayers().push(layer)
        layer.addTo(this)
    }

    hasLayer(layer) {
        return !!this.getLayers().find(l => l === layer)
    }

    removeLayer(layer) {
        this._layers = this.getLayers().filter(l => l !== layer)
        layer.removeFrom(this)
    }

    createLayer(config) {
        if (layerTypes[config.type]) {
            return new layerTypes[config.type](config)
        } else {
            console.log('Unknown layer type', config.type)
        }
    }

    renderLayers = debounce(() => {
        const layers = this.getLayers()

        layers.sort((a, b) => a.getIndex() - b.getIndex())

        this._mapgl.setProps({
            layers: layers.map(l => l.get()),
        })
    }, 100)

    addControl(config) {
        const { type } = config

        if (controlTypes[type]) {
            const control = new controlTypes[type](config)
            this._controls[type] = control
            control.addTo(this)
        }
    }

    removeControl(control) {
        // console.log('removeControl', control)
    }

    onAfterRender(gl) {
        // console.log('onAfterRender', gl)
    }
}

export default Map
