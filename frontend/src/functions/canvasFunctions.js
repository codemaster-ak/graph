import {SIZE} from "../consts";

export function createConnectionPoints(source, destination) {
    return [source.x, source.y, destination.x, destination.y]
}

export function hasIntersection(position, point) {
    const radius = Math.sqrt(Math.pow(position.x - point.x, 2) + Math.pow(position.x - point.x, 2))
    return SIZE - radius > 0
}

export function getConnectionCoords(fromPoint, toPoint) {
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

export function getMousePos(event) {
    const position = event.target.position()
    const stage = event.target.getStage()
    const pointerPosition = stage.getPointerPosition()
    return {
        x: pointerPosition.x - position.x,
        y: pointerPosition.y - position.y
    }
}