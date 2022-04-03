class Graph {//todo private with typescript
    static computePath(matrix, startPoint, finishPoint, method = 'Dijkstra') {
        let distances
        let paths

        if (method === 'Dijkstra') {
            [distances, paths] = this.dijkstra(matrix, startPoint)
        } else {
            distances = this.floyd(matrix, startPoint)
        }
        const fullPaths = this.computeFullPaths(paths, startPoint)

        if (fullPaths[finishPoint][0] !== undefined) {
            const distance = distances[finishPoint]
            const path = fullPaths[finishPoint]
            return [distance, path]
        } else {
            return [Infinity, []]
        }
    }

    static compareMethods(matrix) {
        const dijkstraStart = new Date().getTime()
        for (let i = 0; i < 10000; i++) {
            this.dijkstra(matrix)
        }
        const dijkstraFinish = new Date().getTime()
        const floydStart = new Date().getTime()
        for (let i = 0; i < 10000; i++) {
            this.floyd(matrix)
        }
        const floydFinish = new Date().getTime()
        return {dijkstra: dijkstraFinish - dijkstraStart, floyd: floydFinish - floydStart}
    }

    static dijkstra(matrix, startPoint) {
        if (startPoint !== undefined) return this.dijkstraPoint(matrix, startPoint)
        else {
            let distances = []
            let paths = []
            for (let i = 0; i < matrix.length; i++) {
                const [result, path] = this.dijkstraPoint(matrix, i)
                distances.push(result)
                paths.push(path)
            }
            return [distances, paths]
        }
    }

    static dijkstraPoint(matrix, startPoint) {
        let i = startPoint

        let viewed = [startPoint]
        let path = new Array(matrix.length).fill(undefined)
        path[startPoint] = startPoint
        let result = new Array(matrix.length).fill(Infinity)
        result[startPoint] = 0

        while (i !== undefined) {
            for (let j = 0; j < matrix.length; j++) {
                if (!viewed.includes(j) && result[i] + matrix[i][j] < result[j]) {
                    result[j] = result[i] + matrix[i][j]
                    path[j] = i
                }
            }
            i = this.minDistance(result, viewed)
            if (i !== undefined) viewed.push(i)
        }

        return [result, path]
    }

    static floyd(matrix) {//todo построение пути
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
        if (startPoint !== undefined) {
            const i = startPoint
            let fullPaths = []

            for (let j = 0; j < paths.length; j++) {
                let start = i
                let finish = j
                let fullPath = []

                if (paths[finish] !== undefined) fullPath = [finish]
                else fullPath = [undefined]

                while (finish !== undefined && start !== finish) {
                    finish = paths[finish]
                    fullPath.unshift(finish)
                }

                if (fullPath[0] !== undefined) fullPaths.push(fullPath)
                else fullPaths.push([fullPath[0]])
            }

            return fullPaths
        } else {
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

            return allFullPaths
        }
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
}

export default Graph;