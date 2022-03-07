import React, {useEffect, useState} from 'react';
import {Button, message, Select} from "antd";
import toConnectionMatrix from "../functions/toConnectionMatrix";
import Dijkstra from "../functions/Dijkstra";
import {DownloadOutlined, SaveOutlined} from "@ant-design/icons";
import Connection from "./Connection";
import Point from "./Point";

const {Option} = Select

const Matrix = ({points, setPoints, connections, setConnections, addPoint, addConnection}) => {

    const baseURL = 'http://127.0.0.1:4000'

    const [incMatrix, setIncMatrix] = useState([[]])
    const [fromPoint, setFromPoint] = useState(undefined)
    const [toPoint, setToPoint] = useState(undefined)
    const [files, setFiles] = useState([])
    const [selectedFile, setSelectedFile] = useState(undefined)

    useEffect(async () => {
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
                            connection: connections[i],
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
            if (paths[finishIndex]) {
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

    const save = async () => {
        const init = {
            mode: 'cors',
            method: 'POST',
            headers: {
                Accept: 'application/json',
                protocol: 'http',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(incMatrix)
        }
        await fetch(baseURL, init).then((response) => {
            if (response.ok) return response.json()
        }).then()
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
                connection.connection.from,
                connection.connection.to,
                connection.connection.weight,
                connection.connection.colour
            )
        }))
    }

    return <div>
        <div>
            <Button
                type='primary'
                onClick={event => addPoint(event)}
                disabled={incMatrix.length > 10}
            >
                Добавить вершину
            </Button>
        </div>
        <div>
            <Button
                type='primary'
                onClick={event => addConnection(event, [fromPoint, toPoint])}
                disabled={!fromPoint || !toPoint || fromPoint === toPoint}
            >
                Добавить связь
            </Button>
            <div>
                <Button
                    type='primary'
                    onClick={computePath}
                    disabled={!fromPoint || !toPoint || fromPoint === toPoint}
                >
                    Найти кратчайший путь
                </Button>
            </div>
            <Select value={fromPoint} onChange={(value) => setFromPoint(value)} style={{width: 100}}>
                {incMatrix.map((row, index) => {
                    if (index > 0) return <Option value={row[0].key} key={row[0].key}>{row[0].name}</Option>
                    else return null
                })}
            </Select>
            <Select value={toPoint} onChange={(value) => setToPoint(value)} style={{width: 100}}>
                {incMatrix.map((row, index) => {
                    if (index > 0) return <Option value={row[0].key} key={row[0].key}>{row[0].name}</Option>
                    else return null
                })}
            </Select>
        </div>
        <div className='flex-container'>
            <Button
                type='primary'
                onClick={download}
                icon={<DownloadOutlined style={{color: 'black'}}/>}
            >
                Загрузить матрицу
            </Button>
            <Select value={selectedFile} onChange={(value) => setSelectedFile(value)} style={{width: 100}}>
                {files.map(file => {
                    return <Option key={file.title} value={file.title}>{file.title}</Option>
                })}
            </Select>
            <Button
                type='primary'
                onClick={save}
                icon={<SaveOutlined style={{color: 'black'}}/>}
            >
                Сохранить матрицу
            </Button>
        </div>
        <div className='flex-column' style={{maxWidth: 600, overflowX: 'auto'}}>
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
}

export default Matrix;