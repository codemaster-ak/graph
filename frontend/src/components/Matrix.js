import React, {useEffect, useState} from 'react';
import {InputNumber, message} from "antd";
import toConnectionMatrix from "../functions/toConnectionMatrix";
import Dijkstra from "../functions/Dijkstra";
import Connection from "../classes/Connection";
import Point from "../classes/Point";
import Controls from "./Controls";
import {getAllFileNames, getFileById} from "../functions/http";
import Highlighter from "./Highlighter";

const Matrix = ({points, setPoints, connections, setConnections, addPoint, addConnection}) => {

    const [incMatrix, setIncMatrix] = useState([[]])
    const [fromPoint, setFromPoint] = useState(undefined)
    const [toPoint, setToPoint] = useState(undefined)
    const [files, setFiles] = useState([])
    const [selectedFile, setSelectedFile] = useState(undefined)
    const [path, setPath] = useState([])
    const [distance, setDistance] = useState(undefined)

    useEffect(() => {
        loadFiles()
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
            // const nameFrom = fromPoint.substring(fromPoint.length - 2)
            // const nameTo = toPoint.substring(toPoint.length - 2)
            points.forEach((point, index) => {
                if (point.key === fromPoint) startIndex = index
                if (point.key === toPoint) finishIndex = index
            })
            const [distances, paths] = Dijkstra(connectionMatrix, startIndex)
            // message.success(`Расстояние от ${nameFrom} до ${nameTo} = ${distances[finishIndex]}`, 1).then()
            // let path = ''
            if (paths[finishIndex][0] !== undefined) {
                setPath(paths[finishIndex])
                setDistance(distances[finishIndex])
                // for (let i = 0; i < paths[finishIndex].length; i++) {
                //     let key = points[paths[finishIndex][i]].key
                //     path += key.substring(key.length - 2) + ' -> '
                // }
                // path = path.substring(0, path.length - 4)
                // message.success(`Путь от ${nameFrom} до ${nameTo}:  ${path}`, 1).then()
            } else {
                setDistance(Infinity)
                // message.warn('Путь не существует').then()
            }
        } catch (e) {
            message.error(e).then()
        }
    }

    const loadFiles = () => {
        getAllFileNames().then(data => {
            if (Array.isArray(data)) {
                setFiles([...data])
            }
        })
    }

    const download = () => {
        getFileById(selectedFile).then(data => {
            console.log(data)
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
            return new Point(point.x, point.y, point.key, point.colour, point.key)
        }))
        setConnections(incMatrix[0].map(connection => {
            return new Connection(
                connection.from,
                connection.to,
                connection.weight,
                connection.colour,
                connection.key
            )
        }))
    }

    const clear = () => {
        setConnections([])
        setPoints([])
    }

    return <div className='flex-grow-1 flex-center'>
        <Highlighter
            points={points}
            setPoints={setPoints}
            connections={connections}
            setConnections={setConnections}
            path={path}
            distance={distance}
        />
        <div className='matrix'>
            <div className='flex-column' style={{height: 570, overflowX: 'auto'}}>
                {incMatrix.map((row, indexRow) => {
                    return <div key={String(indexRow)} className='flex-container no-margin no-padding'>
                        <div className='flex-container'>
                            {row.map((colValue, indexCol) => {
                                return indexCol === 0
                                    ? <div className='matrix-cell' key={indexRow + indexCol + ''}>
                                        {indexRow > 0 ? colValue.name : ''}
                                    </div>
                                    : indexRow === 0
                                        ? <div className='matrix-cell' key={indexRow + indexCol + ''}>
                                            {colValue.name}
                                        </div>
                                        : <InputNumber
                                            size='large'
                                            min={0}
                                            max={99}
                                            style={{width: 60, border: '1px solid #000000'}}
                                            key={String(indexRow) + indexCol}
                                        />
                                // return <div
                                //     className='matrix-cell'
                                //     key={indexRow + indexCol + ''}
                                // >
                                //     {indexCol === 0
                                //         ? indexRow > 0
                                //             ? colValue.name
                                //             : ''
                                //         : indexRow > 0
                                //             ? colValue
                                //             : colValue.name}
                                // </div>
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
            clear={clear}
        />
    </div>
}

export default Matrix;