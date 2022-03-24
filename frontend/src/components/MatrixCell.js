import React, {useEffect, useState} from 'react';
import {InputNumber} from "antd";
import Connection from "../classes/Connection";

const MatrixCell = ({row, col, colValue,connections,setConnections,incMatrix}) => {

    const [inputValue, setInputValue] = useState(colValue)

    useEffect(()=>{
        console.log(incMatrix[row])
    },[connections])

    const changeWeight = (value,row,col) => {
        setConnections(connections.map((connection,index)=>{
            if (index===col){
                return new Connection(connection.from, connection.to,value,connection.colour,connection.key)
            }
            else return connection
        }))
        // console.log(row,col,incMatrix[0][col])
        // setInputValue(value)
    }

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
                    value={inputValue}
                    readOnly={inputValue===0}
                    onChange={(value)=>changeWeight(value,row,col)}
                    style={{width: 60, border: '1px solid #000000'}}
                    key={String(row) + col}
                />
        }
    </div>
}

export default MatrixCell;