import Point from "../classes/Point";
import Connection from "../classes/Connection";

export function highlightPoints(path, points) {
    return points.map((point, index) => {
        if (path.includes(index)) return new Point(point.x, point.y, point.key, 'red')
        return point
    })
}

export function highlightConnections(path, points, connections) {
    let connectionsCopy = JSON.parse(JSON.stringify(connections))
    for (let i = 0; i < path.length - 1; i++) {
        const fromPoint = points[path[i]]
        const toPoint = points[path[i + 1]]
        for (let j = 0; j < connectionsCopy.length; j++) {
            if ((connectionsCopy[j].from === fromPoint.key && connectionsCopy[j].to === toPoint.key) ||
                (connectionsCopy[j].from === toPoint.key && connectionsCopy[j].to === fromPoint.key)) {
                connectionsCopy[j].colour = 'red'
            }
        }
    }
    return connectionsCopy.map(connection => new Connection(
        connection.from,
        connection.to,
        connection.weight,
        connection.colour,
        connection.key
    ))
}