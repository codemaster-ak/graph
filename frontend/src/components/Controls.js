import React from 'react';
import {Button, Select} from "antd";
import {baseURL} from "./consts";

const {Option} = Select

const Controls = ({
                      fromPoint,
                      setFromPoint,
                      toPoint,
                      setToPoint,
                      incMatrix,
                      computePath,
                      addPoint,
                      selectedFile,
                      setSelectedFile,
                      addConnection,
                      files,
                      setFiles,
                      download
                  }) => {

    const BUTTON_WIDTH = 310

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
        }).then((res) => {
            if (!files.some(file => file.title === res.title)) {
                setFiles([...files, {title: res.title}])
            }
        })
    }

    const updateFile = async () => {
        const init = {
            mode: 'cors',
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                protocol: 'http',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({matrix: incMatrix, fileName: selectedFile})
        }
        await fetch(baseURL, init).then((response) => {
            if (response.ok) return response.json()
        }).then()
    }

    const deleteFile = async () => {
        const init = {
            mode: 'cors',
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                protocol: 'http',
                'Content-Type': 'application/json'
            }
        }
        await fetch(baseURL + '/' + selectedFile, init).then((response) => {
            if (response.ok) return response.json()
        }).then(() => {
            setFiles([...files.filter(file => file.title !== selectedFile)])
            setSelectedFile(undefined)
        })
    }

    return <div className='controls'>
        <div className='flex-column divider' style={{width: BUTTON_WIDTH}}>
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
            <Button
                type='primary'
                onClick={computePath}
                disabled={!fromPoint || !toPoint || fromPoint === toPoint}
                style={{marginTop: 10, width: BUTTON_WIDTH}}
            >
                Найти кратчайший путь
            </Button>
        </div>
        <div className='flex-column divider'>
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
                    // icon={<DownloadOutlined style={{color: 'white'}}/>}
                    style={{width: 100}}
                >
                    Загрузить
                </Button>
                <Button
                    type='primary'
                    onClick={selectedFile ? updateFile : save}
                    // icon={<SaveOutlined style={{color: 'white'}}/>}
                    style={{width: 100}}
                >
                    Сохранить
                </Button>
                <Button
                    type='primary'
                    onClick={deleteFile}
                    // icon={<DeleteOutlined style={{color: 'white'}}/>}
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