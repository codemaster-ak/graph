import React, {useState} from 'react';
import {InputNumber} from "antd";

const MatrixCell = ({row, col, colValue, title}) => {

    const [inputValue, setInputValue] = useState()

    return col === 0
        ? <div className='matrix-cell' key={row + col + ''}>
            {row > 0 ? colValue.name : ''}
        </div>
        : row === 0
            ? <div className='matrix-cell' key={row + col + ''}>
                {colValue.name}
            </div>
            : <InputNumber
                size='large'
                min={0}
                max={99}
                style={{width: 60, border: '1px solid #000000'}}
                key={String(row) + col}
            />
}

export default MatrixCell;