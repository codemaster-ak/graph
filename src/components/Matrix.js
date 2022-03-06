import React, {useEffect, useState} from 'react';
import {Button, Select} from "antd";
import {logDOM} from "@testing-library/react";

const {Option} = Select

const Matrix = ({points, connections, addPoint, addConnection}) => {

    const [matrix, setMatrix] = useState([[]])
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
                    if (j === 0) rows[j].push(from.substring(from.length - 2) + '-' + to.substring(to.length - 2))
                    else rows[j].push(0)
                }
            }
        }
        setMatrix(rows)
    }, [points, connections])

    // const addLink = () => {
    //     const link = fromPoint + '-' + toPoint
    //     const reverseLink = toPoint + '-' + fromPoint
    //     if (!matrix[0].includes(link) && !matrix[0].includes(reverseLink)) {
    //         setMatrix(matrix.map((row, index) => {
    //             if (index === 0) return [...row, fromPoint + '-' + toPoint]
    //             if (index === fromPoint || index === toPoint) return [...row, 1]
    //             else return [...row, 0]
    //         }))
    //     } else message.warn('Путь уже существует', 1).then()
    //     setToPoint(undefined)
    //     setFromPoint(undefined)
    // }

    return <div>
        <div>
            <Button
                type='primary'
                onClick={event => addPoint(event)}
                disabled={matrix.length > 10}
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
            <Select value={fromPoint} onChange={(value) => setFromPoint(value)} style={{width: 100}}>
                {matrix.map((row, index) => {
                    if (index > 0) return <Option value={row[0].key} key={row[0].key}>{row[0].name}</Option>
                    else return null
                })}
            </Select>
            <Select value={toPoint} onChange={(value) => setToPoint(value)} style={{width: 100}}>
                {matrix.map((row, index) => {
                    if (index > 0) return <Option value={row[0].key} key={row[0].key}>{row[0].name}</Option>
                    else return null
                })}
            </Select>
        </div>
        <div>
            <Button
                type='primary'
                onClick={event => console.log('Удалить вершину')}
            >
                Удалить вершину
            </Button>
        </div>
        <div>
            <Button
                type='primary'
                onClick={event => console.log('Удалить соединение')}
            >
                Удалить соединение
            </Button>
        </div>
        <div>
            <Button
                type='primary'
                onClick={event => console.log('Изменить вес')}
            >
                Изменить вес
            </Button>
        </div>
        <div className='flex-column' style={{maxWidth: 600, overflowX: 'auto'}}>
            {matrix.map((row, indexRow) => {
                return <div key={indexRow + ''} className='flex-container'>
                    {/*<div className='matrix-cell'>{indexRow > 0 ? indexRow : ''}</div>*/}
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
                                    : colValue}
                            </div>
                        })}
                    </div>
                </div>
            })}
        </div>
    </div>
}

export default Matrix;