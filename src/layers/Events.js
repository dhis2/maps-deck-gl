import { ScatterplotLayer } from '@deck.gl/layers'
import {
    HeatmapLayer,
    HexagonLayer,
    ScreenGridLayer,
} from '@deck.gl/aggregation-layers'
import Layer from './Layer'
import { colorToRGBArray } from '../utils/colors'

const colorRange = [
    [1, 152, 189],
    [73, 227, 206],
    [216, 254, 181],
    [254, 237, 177],
    [254, 173, 84],
    [209, 55, 78],
]

const gridColorRange = [
    [255, 255, 178, 25],
    [254, 217, 118, 85],
    [254, 178, 76, 127],
    [253, 141, 60, 170],
    [240, 59, 32, 212],
    [189, 0, 38, 255],
]

const mapTypes = {
    dots: ScatterplotLayer,
    heatmap: HeatmapLayer,
    hexagon: HexagonLayer,
    grid: ScreenGridLayer,
}

const mapTypesProps = {
    dots: {
        radiusScale: 30,
        radiusMinPixels: 1,
        getPosition: d => d.geometry.coordinates,
        getFillColor: d => colorToRGBArray(d.properties.color || '#333333'),
        getRadius: 1,
    },
    heatmap: {
        pickable: false,
        getPosition: d => d.geometry.coordinates,
        radiusPixels: 30,
        intensity: 1,
        threshold: 0.03,
    },
    hexagon: {
        colorRange,
        coverage: 1,
        getPosition: d => d.geometry.coordinates,
        radius: 1000,
        upperPercentile: 100,
    },
    grid: {
        getPosition: d => d.geometry.coordinates,
        cellSizePixels: 20,
        colorRange: gridColorRange,
        gpuAggregation: true,
        aggregation: 'SUM',
    },
}

const extrudedProps = {
    extruded: true,
    elevationRange: [0, 500],
    elevationScale: 50,
}

class Events extends Layer {
    constructor(options) {
        super(options)
    }

    get() {
        const {
            mapType = 'hexagon',
            extruded = true,
            opacity,
            isVisible,
            data,
        } = this.options
        const Layer = mapTypes[mapType]
        const props = mapTypesProps[mapType]

        // console.log('events', this.options)

        return new Layer({
            id: this.getId(),
            data,
            opacity: opacity,
            visible: isVisible,
            pickable: true,
            autoHighlight: true,
            ...props,
            ...(extruded && extrudedProps),
        })
    }
}

export default Events
