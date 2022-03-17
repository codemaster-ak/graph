export default function getConnectionCoords(fromPoint, toPoint) {
    let x, y
    if (toPoint.x > fromPoint.x) {
        x = fromPoint.x + (toPoint.x - fromPoint.x) / 2
    } else {
        x = toPoint.x + (fromPoint.x - toPoint.x) / 2
    }
    if (toPoint.y > fromPoint.y) {
        y = fromPoint.y + (toPoint.y - fromPoint.y) / 2
    } else {
        y = toPoint.y + (fromPoint.y - toPoint.y) / 2
    }
    return [x, y]
}