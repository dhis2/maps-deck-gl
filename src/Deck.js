import { Evented } from 'mapbox-gl'
import { Deck, MapView } from '@deck.gl/core'
import layerTypes from './deck/layerTypes'

const CANVAS_STYLE = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
}

// https://github.com/visgl/deck.gl/blob/master/modules/core/bundle/deckgl.js
// https://github.com/visgl/deck.gl/blob/master/modules/core/src/lib/deck.js
export class DeckGL extends Evented {
    constructor(el, options = {}) {
        super()

        const deckCanvas = document.createElement('canvas')
        el.appendChild(deckCanvas)
        Object.assign(deckCanvas.style, CANVAS_STYLE)

        const mapgl = new Deck({
            canvas: deckCanvas,
            controller: true,
            views: new MapView(),
            initialViewState: {
                longitude: -11.852915,
                latitude: 8.584133,
                zoom: 7,
            },
            layers: [],
            onLoad: this.onLoad,
        })

        this._layers = []
        this._container = el
        this._mapgl = mapgl
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
