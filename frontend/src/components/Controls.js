import React, {useEffect, useState} from 'react';
import {Button, Select} from "antd";
import {BUTTON_WIDTH} from "../consts";
import {getAllFileNames, getFileById, remove, save, update} from "../functions/http";
import Point from "../classes/Point";
import Connection from "../classes/Connection";

const {Option} = Select

const Controls = ({
                      setPoints,
                      setConnections,
                      fromPoint,
                      setFromPoint,
                      toPoint,
                      setToPoint,
                      incMatrix,
                      setIncMatrix,
                      computePath,
                      addPoint,
                      addConnection,
                  }) => {

    const [files, setFiles] = useState([])
    const [selectedFile, setSelectedFile] = useState(undefined)

    // useEffect(() => {
    //     options().then()
    // }, [])

    useEffect(() => {
        loadFiles()
    }, [])

    const loadFiles = () => {
        getAllFileNames().then(data => {
            if (Array.isArray(data)) {
                setFiles([...data])
            }
        })
    }

    const download = () => {
        getFileById(selectedFile).then(data => {
            if (Array.isArray(data)) {
                setIncMatrix([...data])
                parsePointsAndConnections(data)
            }
        })
    }

    const createFile = () => {
        save(incMatrix).then(res => {
            if (!files.some(file => file.title === res.title)) {
                setFiles([...files, {title: res.title}])
            }
        })
    }

    const updateFile = () => {
        update({matrix: incMatrix, fileName: selectedFile}).then()
    }

    const deleteFile = () => {
        remove(selectedFile).then(() => {
            setFiles([...files.filter(file => file.title !== selectedFile)])
            setSelectedFile(undefined)
        })
    }

    const parsePointsAndConnections = (matrix) => {
        matrix[0].shift()
        let pointsTemp = []
        for (let i = 0; i < matrix.length; i++) {
            if (i > 0) {
                delete matrix[i][0].name
                pointsTemp.push(matrix[i][0])
            }
        }
        setPoints(pointsTemp.map(point => {
            return new Point(point.x, point.y, point.key, point.colour, point.key)
        }))
        setConnections(matrix[0].map(connection => {
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

    return <div className='controls'>
        <div className='flex-column margin-right-lg'>
            <div className='space-between'>
                <Select
                    placeholder='От'
                    value={fromPoint}
                    onChange={(value) => setFromPoint(value)}
                    style={{width: 150}}
                >
                    {incMatrix.map((row, index) => {
                        if (index > 0) return <Option value={row[0].key} key={row[0].key}>{row[0].name}</Option>
                        else return null
                    })}
                </Select>
                <Select placeholder='До'
                        value={toPoint}
                        onChange={(value) => setToPoint(value)}
                        style={{width: 150}}
                >
                    {incMatrix.map((row, index) => {
                        if (index > 0) return <Option value={row[0].key} key={row[0].key}>{row[0].name}</Option>
                        else return null
                    })}
                </Select>
            </div>
            <div className='flex-container'>
                <Button
                    type='primary'
                    onClick={computePath}
                    disabled={!fromPoint || !toPoint || fromPoint === toPoint}
                    style={{marginTop: 10, marginRight: 10}}
                >
                    Найти кратчайший путь
                </Button>
                <Button
                    type='primary'
                    onClick={clear}
                    style={{marginTop: 10, width: BUTTON_WIDTH / 2 - 5}}
                >
                    Очистить
                </Button>
            </div>
        </div>
        <div className='flex-column margin-right-lg'>
            <Button
                type='primary'
                onClick={event => addPoint(event)}
                disabled={incMatrix.length > 10}
            >
                Добавить вершину
            </Button>
            <Button
                type='primary'
                onClick={event => addConnection(event, [fromPoint, toPoint])}
                disabled={!fromPoint || !toPoint || fromPoint === toPoint}
                style={{marginTop: 10}}
            >
                Добавить связь
            </Button>
        </div>
        <div className='flex-column' style={{width: BUTTON_WIDTH}}>
            <Select
                placeholder='Выберите матрицу'
                style={{width: BUTTON_WIDTH, marginBottom: 10}}
                value={selectedFile}
                onChange={(value) => setSelectedFile(value)}
                allowClear
            >
                {files.map(file => {
                    return <Option key={file.title} value={file.title}>{file.title}</Option>
                })}
            </Select>
            <div className='space-between'>
                <Button
                    type='primary'
                    onClick={download}
                    style={{width: 100}}
                >
                    Загрузить
                </Button>
                <Button
                    type='primary'
                    onClick={selectedFile ? updateFile : createFile}
                    style={{width: 100}}
                >
                    Сохранить
                </Button>
                <Button
                    type='primary'
                    onClick={deleteFile}
                    style={{width: 100}}
                    disabled={!selectedFile}
                >
                    Удалить
                </Button>
            </div>
        </div>
    </div>
}

export default Controls;