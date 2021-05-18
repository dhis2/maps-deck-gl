import Control from './Control'
import { createEl } from '../utils/dom'
import './Attribution.css'

class Attribution extends Control {
    addTo(map) {
        super.addTo(map)
        this.setupUi()
        this.updateAttributions()
    }

    setupUi() {
        const map = this._map
        const container = map.getControlContainer()
        this._el = createEl('div', 'ctrl-attrib', container)
    }

    updateAttributions() {
        this._el.innerHTML = this._map
            .getLayers()
            .filter(l => l.options.attribution)
            .map(l => l.options.attribution)
            .join(' / ')
    }
}

export default Attribution
