// Based on: https://github.com/mapbox/mapbox-gl-js/blob/main/src/util/evented.js

const extend = (dest, ...sources) => {
    for (const src of sources) {
        for (const k in src) {
            dest[k] = src[k]
        }
    }
    return dest
}

const _addEventListener = (type, listener, listenerList) => {
    const listenerExists =
        listenerList[type] && listenerList[type].indexOf(listener) !== -1
    if (!listenerExists) {
        listenerList[type] = listenerList[type] || []
        listenerList[type].push(listener)
    }
}

const _removeEventListener = (type, listener, listenerList) => {
    if (listenerList && listenerList[type]) {
        const index = listenerList[type].indexOf(listener)
        if (index !== -1) {
            listenerList[type].splice(index, 1)
        }
    }
}

export class Event {
    constructor(type, data = {}) {
        extend(this, data)
        this.type = type
    }
}

export class ErrorEvent extends Event {
    constructor(error, data = {}) {
        super('error', extend({ error }, data))
    }
}

export class Evented {
    on(type, listener) {
        this._listeners = this._listeners || {}
        _addEventListener(type, listener, this._listeners)
        return this
    }

    off(type, listener) {
        _removeEventListener(type, listener, this._listeners)
        _removeEventListener(type, listener, this._oneTimeListeners)

        return this
    }

    once(type, listener) {
        this._oneTimeListeners = this._oneTimeListeners || {}
        _addEventListener(type, listener, this._oneTimeListeners)

        return this
    }

    fire(event, properties) {
        if (typeof event === 'string') {
            event = new Event(event, properties || {})
        }

        const type = event.type

        if (this.listens(type)) {
            event.target = this

            const listeners =
                this._listeners && this._listeners[type]
                    ? this._listeners[type].slice()
                    : []
            for (const listener of listeners) {
                listener.call(this, event)
            }

            const oneTimeListeners =
                this._oneTimeListeners && this._oneTimeListeners[type]
                    ? this._oneTimeListeners[type].slice()
                    : []
            for (const listener of oneTimeListeners) {
                _removeEventListener(type, listener, this._oneTimeListeners)
                listener.call(this, event)
            }

            const parent = this._eventedParent
            if (parent) {
                extend(
                    event,
                    typeof this._eventedParentData === 'function'
                        ? this._eventedParentData()
                        : this._eventedParentData
                )
                parent.fire(event)
            }
        } else if (event instanceof ErrorEvent) {
            console.error(event.error)
        }

        return this
    }

    listens(type) {
        return (
            (this._listeners &&
                this._listeners[type] &&
                this._listeners[type].length > 0) ||
            (this._oneTimeListeners &&
                this._oneTimeListeners[type] &&
                this._oneTimeListeners[type].length > 0) ||
            (this._eventedParent && this._eventedParent.listens(type))
        )
    }

    setEventedParent(parent, data) {
        this._eventedParent = parent
        this._eventedParentData = data

        return this
    }
}
