import React, {useEffect} from 'react';
import Connection from "../classes/Connection";
import MatrixCell from "./MatrixCell";

const Matrix = ({points, connections, setConnections, incMatrix, setIncMatrix}) => {

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

    const changeWeight = (value, row, col) => {
        if (value > 0) {
            setConnections(connections.map((connection, index) => {
                if (index + 1 === col) {
                    return new Connection(connection.from, connection.to, value, connection.colour, connection.key)
                } else return connection
            }))
        }
    }

    return <div className='flex-grow-1 flex-center'>
        <div className='matrix'>
            <div className='flex-column' style={{height: 570, overflowX: 'auto'}}>
                {incMatrix.map((row, indexRow) => {
                    return <div key={String(indexRow)} className='flex-container no-margin no-padding'>
                        {row.map((colValue, indexCol) => {
                            return <MatrixCell
                                key={String(indexRow) + indexCol}
                                col={indexCol}
                                row={indexRow}
                                colValue={colValue}
                                connections={connections}
                                setConnections={setConnections}
                                incMatrix={incMatrix}
                                changeWeight={changeWeight}
                            />
                        })}
                    </div>
                })}
            </div>
        </div>
    </div>
}

export default Matrix;