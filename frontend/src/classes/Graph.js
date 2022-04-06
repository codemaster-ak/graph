import {COMPUTE_METHODS} from '../consts';

class Graph {//todo private with typescript
    static computePath(matrix, startPoint, finishPoint, method = COMPUTE_METHODS.Dijkstra) {
        let distances
        let distance

        if (method === COMPUTE_METHODS.Dijkstra) {
            distances = this.dijkstra(matrix, startPoint)
            distance = distances[finishPoint]
        }
        if (method === COMPUTE_METHODS.Floyd) {
            distances = this.floyd(matrix, startPoint)
            distance = distances[startPoint][finishPoint]
        }
        const paths = this.pathsFromMatrix(matrix)
        const fullPaths = this.computeFullPaths(paths, startPoint)

        if (fullPaths[finishPoint][0] !== undefined) {
            // const distance = distances[startPoint][finishPoint]
            const path = fullPaths[finishPoint]
            return [distance, path]
        } else {
            return [Infinity, []]
        }
    }

    static compareMethods(matrix, cyclesCount = 10000) {
        const dijkstraStart = new Date().getTime()
        for (let i = 0; i < cyclesCount; i++) {
            this.dijkstra(matrix)
        }
        const dijkstraFinish = new Date().getTime()
        const floydStart = new Date().getTime()
        for (let i = 0; i < cyclesCount; i++) {
            this.floyd(matrix)
        }
        const floydFinish = new Date().getTime()
        return {dijkstra: dijkstraFinish - dijkstraStart, floyd: floydFinish - floydStart}
    }

    static dijkstra(matrix, startPoint) {
        if (startPoint !== undefined) return this.dijkstraPoint(matrix, startPoint)
        else {
            let distances = []
            // let paths = []
            for (let i = 0; i < matrix.length; i++) {
                // const [result, path] = this.dijkstraPoint(matrix, i)
                const result = this.dijkstraPoint(matrix, i)
                distances.push(result)
                // paths.push(path)
            }

            // return [distances, paths]
            return distances
        }
    }

    static dijkstraPoint(matrix, startPoint) {
        let i = startPoint

        let viewed = [startPoint]
        // let path = new Array(matrix.length).fill(undefined)
        // path[startPoint] = startPoint
        let result = new Array(matrix.length).fill(Infinity)
        result[startPoint] = 0

        while (i !== undefined) {
            for (let j = 0; j < matrix.length; j++) {
                if (!viewed.includes(j) && result[i] + matrix[i][j] < result[j]) {
                    result[j] = result[i] + matrix[i][j]
                    // path[j] = i
                }
            }
            i = this.minDistance(result, viewed)
            if (i !== undefined) viewed.push(i)
        }

        // return [result, path]
        return result
    }

    static floyd(matrix) {
        let matrixCopy = this.copyMatrix(matrix)

        for (let k = 0; k < matrixCopy.length; k++) {
            for (let i = 0; i < matrixCopy.length; i++) {
                for (let j = 0; j < matrixCopy.length; j++) {
                    if ((i !== k && matrixCopy[i][k] !== Infinity) || (j !== k && matrixCopy[k][j] !== Infinity)) {
                        if (matrixCopy[i][j] >= matrixCopy[i][k] + matrixCopy[k][j]) {
                            matrixCopy[i][j] = matrixCopy[i][k] + matrixCopy[k][j]
                        }
                    }
                }
                if (matrixCopy[i][i] < 0) {
                    throw new Error('Нет решения')
                }
            }
        }

        return matrixCopy
    }

    static computeFullPaths(paths, startPoint) {
        let allFullPaths = []

        for (let i = 0; i < paths.length; i++) {
            let fullPaths = []
            for (let j = 0; j < paths[i].length; j++) {
                let start = i
                let finish = j
                let fullPath = []

                if (paths[i][finish] !== undefined) fullPath = [finish]
                else fullPath = [undefined]

                while (finish !== undefined && start !== finish) {
                    finish = paths[i][finish]
                    fullPath.unshift(finish)
                }

                if (fullPath[0] !== undefined) fullPaths.push(fullPath)
                else fullPaths.push([fullPath[0]])
            }
            allFullPaths.push(fullPaths)
        }

        return startPoint !== undefined ? allFullPaths[startPoint] : allFullPaths
    }

    static minDistance(distances, viewed) {
        let nextPoint
        let max = Infinity
        for (let i = 0; i < distances.length; i++) {
            if (distances[i] < max && !viewed.includes(i)) {
                max = distances[i]
                nextPoint = i
            }
        }
        return nextPoint
    }

    static copyMatrix(matrix) {
        let matrixCopy = JSON.parse(JSON.stringify(matrix))
        for (let i = 0; i < matrixCopy.length; i++) {
            for (let j = 0; j < matrixCopy.length; j++) {
                if (matrixCopy[i][j] === null) {
                    matrixCopy[i][j] = Infinity
                }
            }
        }
        return matrixCopy
    }

    static pathsFromMatrix(matrix) {
        let paths = []
        for (let i = 0; i < matrix.length; i++) {
            let j = i
            let viewed = [j]
            let path = new Array(matrix.length).fill(undefined)
            path[j] = j
            let result = new Array(matrix.length).fill(Infinity)
            result[j] = 0

            while (j !== undefined) {
                for (let k = 0; k < matrix.length; k++) {
                    if (!viewed.includes(k) && result[j] + matrix[j][k] < result[k]) {
                        result[k] = result[j] + matrix[j][k]
                        path[k] = j
                    }
                }
                j = this.minDistance(result, viewed)
                if (j !== undefined) viewed.push(j)
            }
            paths.push(path)
        }
        return paths
    }
}

export default Graph;