import { Deck, MapView } from '@deck.gl/core'
import debounce from 'lodash.debounce'
import { Evented } from './utils/events'
import layerTypes from './layers/layerTypes'
import { createCanvas } from './utils/map'
import { getBoundsFromLayers } from './utils/geometry'
import './Map.css'

// https://github.com/visgl/deck.gl/blob/master/modules/core/bundle/deckgl.js
// https://github.com/visgl/deck.gl/blob/master/modules/core/src/lib/deck.js
export class Map extends Evented {
    constructor(el, options = {}) {
        super()

        this._layers = []
        this._container = el

        this._view = new MapView()

        this._mapgl = new Deck({
            canvas: createCanvas(el),
            controller: true,
            views: [this._view],
            initialViewState: {
                longitude: -11.852915,
                latitude: 8.584133,
                zoom: 7,
            },
            layers: this.getLayers(),
            onLoad: this.onLoad,
            onViewStateChange: this.onViewStateChange,
        })
    }

    onLoad = evt => {
        // console.log('onLoad', evt, this._view, this._mapgl)

        this.fire('ready', this)
    }

    onViewStateChange = ({ viewState }) => {
        // console.log('onViewStateChange', viewState)
    }

    getContainer() {
        return this._container
    }

    getLayers() {
        return this._layers
    }

    fitBounds(bounds) {
        console.log('view', this._view, this._mapgl, bounds)
    }

    fitWorld() {
        this.fitBounds([
            [-180, -90],
            [180, 90],
        ])
    }

    getLayersBounds() {
        const bounds = getBoundsFromLayers(this.getLayers())

        console.log('Map, getLayersBounds', bounds, this.getLayers())

        return bounds
    }

    resize() {}
    addControl() {}
    remove() {}

    addLayer(layer) {
        console.log('addLayer', layer)
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
}

export default Map
