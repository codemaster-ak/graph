import Graph from '../classes/Graph';

export default function getMatrixValues(matrix) {
    let matrixCopy = Graph.copyMatrix(matrix)

    matrixCopy.shift()
    return matrixCopy.map(row => {
        row.shift()
        return row
    })
}