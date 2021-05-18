import Control from './Control'
import { createEl } from '../utils/dom'
import './Attribution.css'

class Attribution extends Control {
    constructor(options) {
        super(options)
        console.log('Attribution control')
    }

    addTo(map) {
        this._map = map // TODO: Call super
        this.setupUi()
        this.updateAttributions()
    }

    setupUi() {
        const map = this._map
        const container = map.getControlContainer()
        this._el = createEl('div', 'ctrl-attrib', container)
    }

    updateAttributions() {
        const attribution = this._map
            .getLayers()
            .filter(l => l.options.attribution)
            .map(l => l.options.attribution)
            .join(' / ')

        this._el.innerHTML = attribution
    }
}

export default Attribution
