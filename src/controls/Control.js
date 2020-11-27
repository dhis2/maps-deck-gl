import { Evented } from '../utils/events'

class Control extends Evented {
    constructor(options = {}) {
        super()
    }

    addTo(map) {
        this._map = map
    }

    remove() {
        this._map = null
    }
}

export default Control
