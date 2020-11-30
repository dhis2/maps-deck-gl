import Control from './Control'
import { createEl } from '../utils/dom'
import './Navigation.css'

// https://github.com/visgl/react-map-gl/blob/master/src/components/navigation-control.js
// https://github.com/mapbox/mapbox-gl-js/blob/main/src/ui/control/navigation_control.js
// https://github.com/mapbox/mapbox-gl-js/blob/main/src/css/mapbox-gl.css

class Navigation extends Control {
    constructor(options) {
        super(options)
    }

    addTo(map) {
        this._map = map
        map.on('viewstatechange', this.onViewStateChange)
        this.setupUi()
    }

    onZoomIn = () => this._map.setZoom(this._map.getZoom() + 1)

    onZoomOut = () => this._map.setZoom(this._map.getZoom() - 1)

    onResetNorth = () =>
        this._map.updateViewState({
            bearing: 0,
            pitch: 0,
        })

    onViewStateChange = ({ viewState }) => {
        const { bearing, pitch } = viewState
        const scale = 1 / Math.pow(Math.cos(pitch * (Math.PI / 180)), 0.5)
        const rotate = `scale(${scale}) rotateX(${pitch}deg) rotateZ(${-bearing}deg)`
        this._compass.style.transform = rotate
    }

    setupUi() {
        const map = this._map
        const container = map.getControlContainer()
        const main = createEl('div', 'ctrl-top-right', container) // TODO
        this._group = createEl('div', 'ctrl-group', main)

        // TODO: i18n
        this.createButton('zoom-in', 'Zoom in', this.onZoomIn)
        this.createButton('zoom-out', 'Zoom out', this.onZoomOut)
        this._compass = this.createButton(
            'compass',
            'Reset north',
            this.onResetNorth
        )
    }

    createButton(type, label, onClick) {
        const button = createEl('button', `ctrl-${type}`, this._group)
        button.title = label
        button.addEventListener('click', onClick)
        return button
    }
}

export default Navigation
