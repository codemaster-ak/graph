import React, {useEffect, useState} from 'react';
import {message} from "antd";
import toConnectionMatrix from "../functions/toConnectionMatrix";
import Dijkstra from "../functions/Dijkstra";
import Connection from "./Connection";
import Point from "./Point";
import Controls from "./Controls";
import {baseURL} from "./consts";

const Matrix = ({points, setPoints, connections, setConnections, addPoint, addConnection}) => {

    const [incMatrix, setIncMatrix] = useState([[]])
    const [fromPoint, setFromPoint] = useState(undefined)
    const [toPoint, setToPoint] = useState(undefined)
    const [files, setFiles] = useState([])
    const [selectedFile, setSelectedFile] = useState(undefined)

    useEffect(() => {
        loadFiles().then()
    }, [])

    useEffect(() => {
        let rows = [[{name: ''}], ...points.map(point => {
            let p = {...point}
            p.name = point.key.substring(point.key.length - 2)
            return [p]
        })]
        for (let i = 0; i < connections.length; i++) {
            const from = connections[i].from
            const to = connections[i].to
            for (let j = 0; j < rows.length; j++) {
                if (rows[j][0].key === from || rows[j][0].key === to) {
                    rows[j].push(connections[i].weight)
                } else {
                    if (j === 0) {
                        rows[j].push({
                            ...connections[i],
                            name: from.substring(from.length - 2) + '-' + to.substring(to.length - 2)
                        })
                    } else rows[j].push(0)
                }
            }
        }
        setIncMatrix(rows)
    }, [points, connections])

    const computePath = () => {
        let connectionMatrix = toConnectionMatrix(incMatrix)
        connectionMatrix.shift()
        connectionMatrix = connectionMatrix.map(row => {
            row.shift()
            return row
        })
        try {
            let startIndex = 0, finishIndex = 0
            const nameFrom = fromPoint.substring(fromPoint.length - 2)
            const nameTo = toPoint.substring(toPoint.length - 2)
            points.forEach((point, index) => {
                if (point.key === fromPoint) startIndex = index
                if (point.key === toPoint) finishIndex = index
            })
            const [distances, paths] = Dijkstra(connectionMatrix, startIndex) // [ 0, 5, 2, 7, 6 ]
            message.success(`Расстояние от ${nameFrom} до ${nameTo} = ${distances[finishIndex]}`, 5).then()
            let path = ''
            if (paths[finishIndex][0]) {
                for (let i = 0; i < paths[finishIndex].length; i++) {
                    let key = points[paths[finishIndex][i]].key
                    path += key.substring(key.length - 2) + ' -> '
                }
                path = path.substring(0, path.length - 4)
                message.success(`Путь от ${nameFrom} до ${nameTo}:  ${path}`, 5).then()
            } else message.warn('Путь не существует').then()
        } catch (e) {
            message.error(e).then()
        }
    }

    const loadFiles = async () => {
        const init = {
            mode: 'cors',
            method: 'GET',
            headers: {
                Accept: 'application/json',
                protocol: 'http',
                'Content-Type': 'application/json'
            }
        }
        await fetch(baseURL, init).then((response) => {
            if (response.ok) return response.json()
        }).then(data => {
            setFiles([...data])
        })
    }

    const download = async () => {
        const init = {
            mode: 'cors',
            method: 'GET',
            headers: {
                Accept: 'application/json',
                protocol: 'http',
                'Content-Type': 'application/json'
            }
        }
        await fetch(baseURL + '/' + selectedFile, init).then((response) => {
            if (response.ok) return response.json()
        }).then(data => {
            if (Array.isArray(data)) {
                setIncMatrix([...data])
                parsePointsAndConnections(data)
            }
        })
    }

    const parsePointsAndConnections = (incMatrix) => {
        incMatrix[0].shift()
        let pointsTemp = []
        for (let i = 0; i < incMatrix.length; i++) {
            if (i > 0) {
                delete incMatrix[i][0].name
                pointsTemp.push(incMatrix[i][0])
            }
        }
        setPoints(pointsTemp.map(point => {
            return new Point(point.x, point.y, point.key, point.colour)
        }))
        setConnections(incMatrix[0].map(connection => {
            return new Connection(
                connection.from,
                connection.to,
                connection.weight,
                connection.colour
            )
        }))
    }

    return <div className='flex-grow-1 flex-center'>
        <div className='matrix'>
            <div className='flex-column' style={{height: 570, overflowX: 'auto'}}>
                {incMatrix.map((row, indexRow) => {
                    return <div key={indexRow + ''} className='flex-container'>
                        <div className='flex-container'>
                            {row.map((colValue, indexCol) => {
                                return <div
                                    className='matrix-cell'
                                    key={indexRow + indexCol + ''}
                                >
                                    {indexCol === 0
                                        ? indexRow > 0
                                            ? colValue.name
                                            : ''
                                        : indexRow > 0
                                            ? colValue
                                            : colValue.name}
                                </div>
                            })}
                        </div>
                    </div>
                })}
            </div>
        </div>
        <Controls
            addConnection={addConnection}
            addPoint={addPoint}
            toPoint={toPoint}
            fromPoint={fromPoint}
            incMatrix={incMatrix}
            files={files}
            setFiles={setFiles}
            setFromPoint={setFromPoint}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            setToPoint={setToPoint}
            computePath={computePath}
            download={download}
        />
    </div>
}

export default Matrix;