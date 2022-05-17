import React, {useEffect, useState} from 'react';
import {Button, Radio, Select} from 'antd';
import {BUTTON_WIDTH, COMPUTE_METHODS} from '../consts';
import {
    getAllFileNames,
    getFileById,
    getPage,
    options,
    optionsPlaceholder,
    remove,
    save,
    update
} from '../functions/http';
import Point from '../classes/Point';
import Connection from '../classes/Connection';

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
                      selectedMethod,
                      setSelectedMethod,
                  }) => {

    const [files, setFiles] = useState([])
    const [selectedFile, setSelectedFile] = useState(undefined)

    useEffect(() => {
        loadFiles()
    }, [])

    useEffect(() => {
        // getPage().then()
        // options().then()
        // optionsPlaceholder().then()
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

    const updateFile = async () => {
        await update(incMatrix, selectedFile)
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
                connection.key,
            )
        }))
    }

    const clear = () => {
        setConnections([])
        setPoints([])
    }

    return <div>
        <div className="margin-bottom-lg">
            <Radio.Group className="item space-between" buttonStyle="solid" value={selectedMethod}
                         onChange={event => setSelectedMethod(event.target.value)}>
                <Radio.Button value={COMPUTE_METHODS.Dijkstra}
                              style={{width: BUTTON_WIDTH / 2 - 2, textAlign: "center"}}>Дейкстра</Radio.Button>
                <Radio.Button value={COMPUTE_METHODS.Floyd}
                              style={{width: BUTTON_WIDTH / 2 - 2, textAlign: "center"}}>Флойд</Radio.Button>
            </Radio.Group>
        </div>
        <div className="flex-column margin-bottom-lg">
            <div className="space-between">
                <Select
                    placeholder="От"
                    value={fromPoint}
                    onChange={(value) => setFromPoint(value)}
                    style={{width: BUTTON_WIDTH / 2 - 2}}
                    className="margin-bottom-xs"
                >
                    {incMatrix.map((row, index) => {
                        if (index > 0) return <Option value={row[0].key} key={row[0].key}>{row[0].name}</Option>
                        else return null
                    })}
                </Select>
                <Select placeholder="До"
                        value={toPoint}
                        onChange={(value) => setToPoint(value)}
                        style={{width: BUTTON_WIDTH / 2 - 2}}
                        className="margin-bottom-xs"
                >
                    {incMatrix.map((row, index) => {
                        if (index > 0) return <Option value={row[0].key} key={row[0].key}>{row[0].name}</Option>
                        else return null
                    })}
                </Select>
            </div>
            <Button
                type="primary"
                onClick={computePath}
                disabled={!fromPoint || !toPoint || fromPoint === toPoint}
                style={{width: BUTTON_WIDTH}}
                className="margin-bottom-xs"
            >
                Найти кратчайший путь
            </Button>
            <Button
                type="primary"
                onClick={event => addPoint(event)}
                disabled={incMatrix.length > 10}
                style={{width: BUTTON_WIDTH}}
                className="margin-bottom-xs"
            >
                Добавить вершину
            </Button>
            <Button
                type="primary"
                onClick={event => addConnection(event, [fromPoint, toPoint])}
                disabled={!fromPoint || !toPoint || fromPoint === toPoint}
                style={{width: BUTTON_WIDTH}}
                className="margin-bottom-xs"
            >
                Добавить связь
            </Button>
        </div>
        <div className="flex-column margin-bottom-lg">
            <Select
                placeholder="Выберите матрицу"
                style={{width: BUTTON_WIDTH, marginBottom: 10}}
                value={selectedFile}
                onChange={(value) => setSelectedFile(value)}
                allowClear
                className="margin-bottom-xs"
            >
                {files.map(file => {
                    return <Option key={file.title} value={file.title}>{file.title}</Option>
                })}
            </Select>
            <div className="flex-column">
                <Button
                    type="primary"
                    onClick={download}
                    style={{width: BUTTON_WIDTH}}
                    disabled={!selectedFile}
                    className="margin-bottom-xs"
                >
                    Загрузить
                </Button>
                <Button
                    type="primary"
                    onClick={selectedFile ? updateFile : createFile}
                    style={{width: BUTTON_WIDTH}}
                    className="margin-bottom-xs"
                >
                    Сохранить
                </Button>
                <div className="space-between">
                    <Button
                        type="primary"
                        onClick={clear}
                        style={{width: BUTTON_WIDTH / 2 - 2}}
                    >
                        Очистить
                    </Button>
                    <Button
                        type="primary"
                        onClick={deleteFile}
                        style={{width: BUTTON_WIDTH / 2 - 2}}
                        disabled={!selectedFile}
                    >
                        Удалить
                    </Button>
                </div>

            </div>
        </div>
    </div>
}

export default Controls;
