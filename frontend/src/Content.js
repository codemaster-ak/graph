import React, {useState} from 'react';
import './App.css';
import Matrix from './components/Matrix';
import Canvas from './components/Canvas';
import Point from './classes/Point';
import Connection from './classes/Connection';
import {message} from 'antd';
import {getMousePos} from './functions/canvasFunctions';
import {BASE_CONNECTION_COLOR, STAGE_SIZE} from './consts';
import DropDownMenu from './components/DropDownMenu';

const Content = ({
                     points,
                     setPoints,
                     connections,
                     setConnections,
                     incMatrix,
                     setIncMatrix,
                     menuVisible,
                     setMenuVisible,
                     inputVisible,
                     setInputVisible,
                     menuStyle,
                     setMenuStyle,
                     selectedEntity,
                     setSelectedEntity,
                 }) => {

    const addPoint = (event, stageRef) => {
        if (event.target === stageRef?.current) {
            event.evt.preventDefault()
            const mousePos = getMousePos(event)
            if (points.length < 10) {
                setPoints([...points, new Point(mousePos.x, mousePos.y, new Date().getTime())])
            } else message.warn('Достигнуто максимальное количество вершин - 10', 1).then()
        } else {
            const x = Math.round(Math.random() * STAGE_SIZE)
            const y = Math.round(Math.random() * STAGE_SIZE)
            setPoints([...points, new Point(x, y, new Date().getTime())])
        }
    }

    const addConnection = (event, point, setConnectionPreview, detectConnection) => {
        if (event && point && setConnectionPreview && detectConnection) {
            setConnectionPreview(null)
            const stage = event.target.getStage()
            const mousePos = stage.getPointerPosition()
            const connectionTo = detectConnection(mousePos, point)
            const isExist = connections.some(connection => {
                return (connection.from === point.key && connection.to === connectionTo.key) ||
                    (connection.from === connectionTo.key && connection.to === point.key)
            })
            if (connectionTo && !isExist) {
                setConnections([
                    ...connections,
                    new Connection(point.key, connectionTo.key, 1, BASE_CONNECTION_COLOR, new Date().getTime()),
                ])
            }
        } else {
            if (setConnectionPreview instanceof Function) setConnectionPreview(null)
            const from = points.find(p => p.key === point[0])
            const to = points.find(p => p.key === point[1])
            const isExist = connections.some(connection => {
                return (connection.from === from.key && connection.to === to.key) ||
                    (connection.from === to.key && connection.to === from.key)
            })
            if (!isExist) {
                setConnections([
                    ...connections,
                    new Connection(from.key, to.key, 1, BASE_CONNECTION_COLOR, new Date().getTime()),
                ])
            } else message.warn('Соединение уже существует', 1).then()
        }
    }

    const deleteConnection = () => {
        setConnections(connections.filter(connection => {
            return connection.from !== selectedEntity.from || connection.to !== selectedEntity.to
        }))
        setMenuVisible(false)
    }

    const changeWeight = (weight) => {
        setConnections(connections.map(connection => {
            if (connection.from === selectedEntity.from && connection.to === selectedEntity.to) {
                connection.weight = weight
            }
            return connection
        }))
        setInputVisible(false)
        setMenuVisible(false)
    }

    return <div className="flex-column-center align-content-space-between">
        <div className="flex-container space-around" style={{margin: '8% 0 8% 0'}}>
            <Matrix
                points={points}
                connections={connections}
                setConnections={setConnections}
                incMatrix={incMatrix}
                setIncMatrix={setIncMatrix}
            />
            <Canvas
                points={points}
                setPoints={setPoints}
                connections={connections}
                setConnections={setConnections}
                addPoint={addPoint}
                addConnection={addConnection}
                setMenuStyle={setMenuStyle}
                setInputVisible={setInputVisible}
                menuVisible={menuVisible}
                setMenuVisible={setMenuVisible}
                selectedEntity={selectedEntity}
                setSelectedEntity={setSelectedEntity}
            />
            {menuVisible && <DropDownMenu
                deleteConnection={deleteConnection}
                changeWeight={changeWeight}
                menuStyle={menuStyle}
                inputVisible={inputVisible}
                setInputVisible={setInputVisible}
                selectedEntity={selectedEntity}
            />}
        </div>
        {menuVisible && <DropDownMenu
            deleteConnection={deleteConnection}
            changeWeight={changeWeight}
            menuStyle={menuStyle}
            inputVisible={inputVisible}
            setInputVisible={setInputVisible}
            selectedEntity={selectedEntity}
        />}
    </div>
}

export default Content;