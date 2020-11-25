import { GeoJsonLayer } from '@deck.gl/layers'
import Layer from './Layer'
import { colorToRGBArray } from './utils'

class Choropleth extends Layer {
    constructor(options) {
        super(options)
    }

    get() {
        const { opacity, isVisible, data } = this.options

        // console.log('choropleth', this.options)

        return new GeoJsonLayer({
            id: this.getId(),
            data,
            opacity: opacity,
            visible: isVisible,
            pickable: true,
            autoHighlight: true,
            filled: true,
            stroked: true,
            lineWidthUnits: 'pixels',
            pointRadiusUnits: 'pixels',
            getFillColor: d => colorToRGBArray(d.properties.color),
            getLineColor: colorToRGBArray('#333333'),
            getLineWidth: 1,
            onClick: (info, event) => console.log('Clicked:', info, event),
            // onHover: console.log,
        })
    }
}

export default Choropleth
