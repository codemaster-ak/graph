import React from 'react';
import {InputNumber} from "antd";

const MatrixCell = ({row, col, colValue, incMatrix, changeWeight}) => {

    return <div className='matrix-cell'>
        {col === 0
            ? <div className='matrix-cell'>
                {row > 0 ? colValue.name : ''}
            </div>
            : row === 0
                ? <div className='matrix-cell'>
                    {colValue.name}
                </div>
                : <InputNumber
                    size='large'
                    min={0}
                    max={99}
                    value={incMatrix[row][col]}
                    readOnly={incMatrix[row][col] === 0}
                    onChange={(value) => changeWeight(value, row, col)}
                    style={{width: "100%", height: "100%", border: "none"}}
                />
        }
    </div>
}

export default MatrixCell;