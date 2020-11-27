import bbox from '@turf/bbox'
import bboxPolygon from '@turf/bbox-polygon'

export const getBBox = (features = []) =>
    features.length ? bbox(featureCollection(features)) : undefined

export const getBoundsFromLayers = (layers = []) => {
    const bboxFeatures = layers
        .map(l => l.getBBox())
        .filter(l => l)
        .map(bboxPolygon)

    /*
    console.log(
        'getBoundsFromLayers',
        layers.map(l => l.getBBox()),
        layers
    )
    */

    return bbox2bounds(getBBox(bboxFeatures))
}

export const featureCollection = (features = []) => ({
    type: 'FeatureCollection',
    features,
})

export const bbox2bounds = bbox => {
    if (bbox) {
        const [x1, y1, x2, y2] = bbox
        return [
            [x1, y1],
            [x2, y2],
        ]
    }
}
