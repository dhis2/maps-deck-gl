import { rgb } from 'd3-color'

export const colorToRGBArray = color => {
    if (!color) {
        return [255, 255, 255, 0]
    }
    if (Array.isArray(color)) {
        return color.slice(0, 4)
    }
    const c = rgb(color)
    return [c.r, c.g, c.b, 255]
}
