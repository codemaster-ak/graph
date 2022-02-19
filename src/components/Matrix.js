import React, {useState} from 'react';
import {Button, InputNumber, message} from "antd";

const Matrix = () => {

    const [matrix, setMatrix] = useState([[]])
    const [fromPoint, setFromPoint] = useState(undefined)
    const [toPoint, setToPoint] = useState(undefined)

    const addLink = () => {
        const link = fromPoint + '-' + toPoint
        const reverseLink = toPoint + '-' + fromPoint
        if (!matrix[0].includes(link) && !matrix[0].includes(reverseLink)) {
            setMatrix([...matrix.map((row, index) => {
                if (index === 0) return [...row, fromPoint + '-' + toPoint]
                if (index === fromPoint || index === toPoint) return [...row, 1]//todo вес вместо 1
                else return [...row, 0]
            })])
        } else message.warn('already exist', 1).then()
        setToPoint(undefined)
        setFromPoint(undefined)
    }

    const addPoint = () => {
        const newRow = new Array(matrix[0]?.map(_ => 0))
        setMatrix([...matrix, ...newRow])
    }

    return <div>
        <Button
            type='primary'
            onClick={addPoint}
            disabled={matrix.length > 10}
        >
            Add point
        </Button>
        <InputNumber
            min={1}
            max={matrix.length - 1}
            value={fromPoint}
            onChange={value => setFromPoint(value)}
        />
        <InputNumber
            min={1}
            max={matrix.length - 1}
            value={toPoint}
            onChange={value => setToPoint(value)}
        />
        <Button
            type='primary'
            onClick={addLink}
            disabled={!fromPoint || !toPoint || fromPoint === toPoint}
        >
            Add link
        </Button>
        <div className='flex-column' style={{maxWidth: 600, overflowX: 'auto'}}>
            {matrix.map((row, indexRow) => {
                return <div key={indexRow + ''} className='flex-container'>
                    <div className='matrix-cell'>{indexRow > 0 ? indexRow : ''}</div>
                    <div className='flex-container'>
                        {row.map((colValue, indexCol) => {
                            return <div className='matrix-cell' key={indexRow + indexCol + ''}>{colValue}</div>
                        })}
                    </div>
                </div>
            })}
        </div>
    </div>
}

export default Matrix;