export const createCanvas = el => {
    const canvas = document.createElement('canvas')
    canvas.className = 'dhis2-map-canvas'
    el.appendChild(canvas)
    return canvas
}
