import { Evented } from '../utils/events'
import './Controls.css'

class Control extends Evented {
    constructor(options = {}) {
        super()
        this.options = options
    }

    addTo(map) {
        this._map = map
    }

    remove() {
        this._map = null
    }
}

export default Control
