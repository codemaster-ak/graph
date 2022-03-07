export default function toConnectionMatrix(matrix) {
    let matrixConnection = []

    for (let i = 0; i < matrix.length; i++) {
        matrixConnection.push([matrix[i][0]])
    }

    for (let i = 0; i < matrix.length; i++) {
        matrixConnection[0].push(matrix[i][0])
        for (let j = 1; j <= matrix.length - 1; j++) {
            if (i > 0) matrixConnection[i].push(Infinity)
        }
    }
    matrixConnection[0].shift()

    const connections = matrix[0].map(row => {
        return row.connection
    })
    connections.shift()

    for (let i = 0; i < connections.length; i++) {
        let j, k
        matrixConnection[0].forEach((point, index) => {
            if (point.key === connections[i].from) j = index
        })
        matrixConnection[0].forEach((point, index) => {
            if (point.key === connections[i].to) k = index
        })
        matrixConnection[j][k] = connections[i].weight
        matrixConnection[k][j] = connections[i].weight
    }

    for (let i = 1; i < matrixConnection.length; i++) {
        matrixConnection[i][i] = 0
    }

    return matrixConnection
}