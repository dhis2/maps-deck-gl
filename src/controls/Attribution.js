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
    }

    setupUi() {
        const map = this._map
        const container = map.getControlContainer()
        this._el = createEl('div', 'ctrl-attrib', container)
    }

    _updateAttributions() {
        const attribution = this._map
            .getLayers()
            .filter(l => l.options.attribution)
            .map(l => l.attribution)
            .join(' ')

        this._el.innerText = attribution
    }
}

export default Attribution
