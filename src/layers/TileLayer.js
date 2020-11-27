import { TileLayer as DeckTileLayer } from '@deck.gl/geo-layers'
import { BitmapLayer } from '@deck.gl/layers'
import Layer from './Layer'

class TileLayer extends Layer {
    constructor(options) {
        super(options)
    }

    get() {
        const { opacity, isVisible, url } = this.options
        let tiles

        if (url.includes('{s}')) {
            tiles = ['a', 'b', 'c'].map(letter => url.replace('{s}', letter))
        } else {
            tiles = [url]
        }

        return new DeckTileLayer({
            id: this.getId(),
            data: tiles,
            // minZoom: 0,
            // maxZoom: 19,
            tileSize: 256,
            opacity: opacity,
            visible: isVisible,
            wrapLongitude: true,
            renderSubLayers: this.renderSubLayers,
            onViewportLoad: this.onViewportLoad,
            onDataLoad: this.onDataLoad,
        })
    }

    renderSubLayers = props => {
        const {
            bbox: { west, south, east, north },
        } = props.tile

        return new BitmapLayer(props, {
            data: null,
            image: props.data,
            bounds: [west, south, east, north],
        })
    }

    onDataLoad = (a, b, c) => {
        // console.log('onDataLoad', a, b, c)
    }

    onViewportLoad = images => {
        // console.log('onViewportLoad', images)
    }
}

export default TileLayer
