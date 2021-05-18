import fetchJsonp from 'fetch-jsonp'
import { Viewport } from '@deck.gl/core'
import { TileLayer as DeckTileLayer } from '@deck.gl/geo-layers'
import { BitmapLayer } from '@deck.gl/layers'
// import DeckBingLayer from './Layer'

import Layer from './Layer'

const getQuadkey = (x, y, z) => {
    let quadkey = '',
        mask
    for (let i = z; i > 0; i--) {
        mask = 1 << (i - 1)
        quadkey += (x & mask ? 1 : 0) + (y & mask ? 2 : 0)
    }
    return quadkey
}

// Returns true if two bbox'es intersects
const bboxIntersect = (bing, map) =>
    !(
        map[0] > bing[2] ||
        map[2] < bing[0] ||
        map[3] < bing[1] ||
        map[1] > bing[3]
    )

class BingLayer extends Layer {
    constructor(options) {
        super(options)
    }

    async get() {
        const { opacity, isVisible, url } = this.options

        const { imageUrl, imageUrlSubdomains, imageryProviders, brandLogoUri } =
            this._metaData || (await this.loadMetaData())

        // TODO: Only do once
        this._brandLogoUri = brandLogoUri.replace('http:', 'https:')
        this._imageryProviders = imageryProviders
        const tiles = imageUrlSubdomains.map(
            subdomain => imageUrl.replace('{subdomain}', subdomain) //  + '&dpi=d2&device=mobile' // TODO
        )

        // console.log('tiles', tiles)

        this._deckLayer = new DeckTileLayer({
            id: this.getId(),
            data: tiles,
            // minZoom: 0,
            // maxZoom: 19,
            tileSize: 256,
            opacity: opacity,
            visible: isVisible,
            wrapLongitude: true,
            getTileData: this.getTileData,
            renderSubLayers: this.renderSubLayers,
            onViewportLoad: this.onViewportLoad,
            onDataLoad: this.onDataLoad,
        })

        return this._deckLayer
    }

    getAttribution(viewState) {
        const zoom = viewState.zoom < 1 ? 1 : viewState.zoom
        const viewport = new Viewport(viewState)
        const bounds = viewport.getBounds()

        return this._imageryProviders
            .filter(({ coverageAreas }) =>
                coverageAreas.some(
                    ({ bbox, zoomMin, zoomMax }) =>
                        bboxIntersect(bbox, bounds) &&
                        zoom >= zoomMin &&
                        zoom <= zoomMax
                )
            )
            .map(p => p.attribution)
            .join(', ')
    }

    getTileData = tile => {
        const layer = this._deckLayer.getCurrentLayer()
        const { fetch } = layer.props
        const { x, y, z, url, signal } = tile

        tile.url = url.replace('{quadkey}', getQuadkey(x, y, z))

        return fetch(tile.url, { layer, signal })
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

    async loadMetaData() {
        const { apiKey, style = 'Road' } = this.options

        // https://docs.microsoft.com/en-us/bingmaps/rest-services/common-parameters-and-types/supported-culture-codes
        const culture = 'en-GB'

        // https://docs.microsoft.com/en-us/bingmaps/rest-services/imagery/get-imagery-metadata
        const metaDataUrl = `https://dev.virtualearth.net/REST/V1/Imagery/Metadata/${style}?output=json&include=ImageryProviders&culture=${culture}&key=${apiKey}&uriScheme=https`

        return fetchJsonp(metaDataUrl, { jsonpCallback: 'jsonp' })
            .then(response => response.json())
            .then(this.onMetaDataLoad)
    }

    onMetaDataLoad = metaData => {
        if (metaData.statusCode !== 200) {
            throw new Error(
                'Bing Imagery Metadata error: \n' +
                    JSON.stringify(metaData, null, '  ')
            )
        }

        const { brandLogoUri, resourceSets } = metaData

        this._metaData = {
            brandLogoUri,
            ...resourceSets[0].resources[0],
        }

        return this._metaData
    }

    onDataLoad = (a, b, c) => {
        // console.log('onDataLoad', a, b, c)
    }

    onViewportLoad = images => {
        // console.log('onViewportLoad', images)
    }

    onAdd = () => {
        this._map.on('viewstatechange', this.onViewStateChange)
    }

    onViewStateChange = ({ viewState }) => {
        this.options.attribution = this.getAttribution(viewState)
        this._map._updateAttributions()
    }
}

export default BingLayer
