import { TileLayer } from '@deck.gl/geo-layers'

const getQuadkey = (z, x, y) => {
    let quadkey = '',
        mask
    for (let i = z; i > 0; i--) {
        mask = 1 << (i - 1)
        quadkey += (x & mask ? 1 : 0) + (y & mask ? 2 : 0)
    }
    return quadkey
}

const getURLFromTemplate = (template, properties) => {
    console.log('getURLFromTemplate', template, properties)

    if (!template || !template.length) {
        return null
    }
    if (Array.isArray(template)) {
        const index = Math.abs(properties.x + properties.y) % template.length
        template = template[index]
    }

    const { x, y, z } = properties
    return template
        .replace('{x}', x)
        .replace('{y}', y)
        .replace('{z}', z)
        .replace('{-y}', Math.pow(2, z) - y - 1)
}

class DeckBingLayer extends TileLayer {
    /*
    getTileData(tile) {
        const { data } = this.props
        const { getTileData, fetch } = this.getCurrentLayer().props
        const { signal } = tile

        tile.url = getURLFromTemplate(data, tile)

        console.log('tile.url', tile.url)

        if (getTileData) {
            return getTileData(tile)
        }
        if (tile.url) {
            return fetch(tile.url, { layer: this, signal })
        }
        return null
    }
    */
}

export default DeckBingLayer
