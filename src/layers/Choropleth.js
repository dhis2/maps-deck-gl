import { GeoJsonLayer } from '@deck.gl/layers'
import Layer from './Layer'
import { colorToRGBArray } from '../utils/colors'

class Choropleth extends Layer {
    constructor(options) {
        super(options)
    }

    get() {
        const { opacity, isVisible, data } = this.options

        return new GeoJsonLayer({
            id: this.getId(),
            data,
            opacity: opacity,
            visible: isVisible,
            pickable: true,
            autoHighlight: true,
            highlightColor: this.highlightColor,
            filled: true,
            stroked: true,
            lineWidthUnits: 'pixels',
            pointRadiusUnits: 'pixels',
            getFillColor: d => colorToRGBArray(d.properties.color),
            getLineColor: colorToRGBArray('#333333'),
            getLineWidth: 1,
            getTooltip: this.getTooltip,
            onClick: (info, event) => console.log('Clicked:', info, event),
        })
    }

    highlightColor = info => {
        console.log('info', info)

        return [0, 0, 0, 0]
    }
}

export default Choropleth
