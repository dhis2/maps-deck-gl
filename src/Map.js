import { Evented } from 'mapbox-gl'
import { Deck, MapView } from '@deck.gl/core'
import layerTypes from './layers/layerTypes'
import { createCanvas } from './utils/map'
import './Map.css'

// https://github.com/visgl/deck.gl/blob/master/modules/core/bundle/deckgl.js
// https://github.com/visgl/deck.gl/blob/master/modules/core/src/lib/deck.js
export class DeckGL extends Evented {
    constructor(el, options = {}) {
        super()

        this._layers = []
        this._container = el

        this._mapgl = new Deck({
            canvas: createCanvas(el),
            controller: true,
            views: new MapView(),
            initialViewState: {
                longitude: -11.852915,
                latitude: 8.584133,
                zoom: 7,
            },
            layers: this._layers,
            onLoad: this.onLoad,
        })
    }

    onLoad = () => {
        this.fire('ready', this)
    }

    getContainer() {
        return this._container
    }
    resize() {}
    addControl() {}
    remove() {}
    getLayersBounds() {}
    fitBounds(bounds) {
        // console.log('fitBounds', bounds)
    }

    addLayer(layer) {
        this._layers.push(layer)
        layer.addTo(this)
    }

    hasLayer(layer) {
        return !!this._layers.find(l => l === layer)
    }

    removeLayer(layer) {
        this._layers = this._layers.filter(l => l !== layer)
        layer.removeFrom(this)
    }

    createLayer(config) {
        if (layerTypes[config.type]) {
            return new layerTypes[config.type](config)
        } else {
            console.log('Unknown layer type', config.type)
        }
    }

    renderLayers() {
        this._mapgl.setProps({
            layers: this._layers.map(l => l.get()),
        })
    }
}

export default DeckGL
