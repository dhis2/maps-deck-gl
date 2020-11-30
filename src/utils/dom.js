const classPrefix = `dhis2-map-`

export const createEl = (tagName, className, container) => {
    const el = window.document.createElement(tagName)

    if (className !== undefined) {
        el.className = `${classPrefix}${className}`
    }

    if (container) {
        container.appendChild(el)
    }

    return el
}
