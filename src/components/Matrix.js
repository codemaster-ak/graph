import React, {useEffect, useState} from 'react';
import {Button, message, Select} from "antd";
import toConnectionMatrix from "../functions/toConnectionMatrix";
import Dijkstra from "../functions/Dijkstra";

const {Option} = Select

const Matrix = ({points, connections, addPoint, addConnection}) => {

    const [incMatrix, setIncMatrix] = useState([[]])
    const [fromPoint, setFromPoint] = useState(undefined)
    const [toPoint, setToPoint] = useState(undefined)

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
        toConnectionMatrix(rows)
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