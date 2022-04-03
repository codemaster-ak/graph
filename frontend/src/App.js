import React, {useState} from 'react';
import './App.css';
import Matrix from './components/Matrix';
import Canvas from './components/Canvas';
import Point from './classes/Point';
import Connection from './classes/Connection';
import {Button, message} from 'antd';
import {getMousePos} from './functions/canvasFunctions';
import {BASE_CONNECTION_COLOR, STAGE_SIZE} from './consts';
import Controls from './components/Controls';
import Highlighter from './components/Highlighter';
import toConnectionMatrix from './functions/toConnectionMatrix';
import DropDownMenu from './components/DropDownMenu';
import Graph from './classes/Graph';
import ResultTableModal from './components/ResultTableModal';

const App = () => {

    /**
     * Матрица смежности
     * Значение - это вес ребра между вершиной и вершиной, 0 означает отсутствие самоконтроля, Infinity означает
     * отсутствие ребра
     * */

    const [points, setPoints] = useState([])
    const [connections, setConnections] = useState([])
    const [incMatrix, setIncMatrix] = useState([[]])
    const [path, setPath] = useState([])
    const [distance, setDistance] = useState(undefined)
    const [fromPoint, setFromPoint] = useState(undefined)
    const [toPoint, setToPoint] = useState(undefined)

    const [menuVisible, setMenuVisible] = useState(false)
    const [inputVisible, setInputVisible] = useState(false)
    const [menuStyle, setMenuStyle] = useState({})
    const [selectedEntity, setSelectedEntity] = useState(undefined)

    const [resultModalVisible, setResultModalVisible] = useState(false)
    const [pathList, setPathList] = useState([])

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

    const computePath = () => {
        let connectionMatrix = toConnectionMatrix(incMatrix)
        connectionMatrix.shift()
        connectionMatrix = connectionMatrix.map(row => {
            row.shift()
            return row
        })

        try {
            let startIndex = 0, finishIndex = 0
            points.forEach((point, index) => {
                if (point.key === fromPoint) startIndex = index
                if (point.key === toPoint) finishIndex = index
            })

            const [distance, path] = Graph.computePath(connectionMatrix, startIndex, finishIndex)
            setDistance(distance)
            setPath(path)
        } catch (e) {
            message.error(e).then()
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

    const showResult = () => {
        setResultModalVisible(true)
        // todo фикс
        let connectionMatrix = toConnectionMatrix(incMatrix)
        connectionMatrix.shift()
        connectionMatrix = connectionMatrix.map(row => {
            row.shift()
            return row
        })
        //
        const [distances, paths] = Graph.dijkstra(connectionMatrix)
        const fullPaths = Graph.computeFullPaths(paths)

        let tablePaths = []
        for (let i = 0; i < fullPaths.length; i++) {
            for (let j = 0; j < fullPaths[i].length; j++) {
                if (fullPaths[i][j].length > 1) {
                    let path = ''
                    for (let k = 0; k < fullPaths[i][j].length; k++) {
                        path += fullPaths[i][j][k] + '->'
                    }
                    path = path.substring(0, path.length - 2)
                    tablePaths.push({
                        key: String(Math.random()),
                        from: fullPaths[i][j][0],
                        to: fullPaths[i][j].at(-1),
                        path: path,
                        distance: distances[i][j],
                    })
                }
            }
        }

        setPathList(tablePaths)
    }

    const compareMethods = async () => {
        // todo фикс
        let connectionMatrix = toConnectionMatrix(incMatrix)
        connectionMatrix.shift()
        connectionMatrix = connectionMatrix.map(row => {
            row.shift()
            return row
        })
        //
        const comparedTime = Graph.compareMethods(connectionMatrix)
        await message.success(`dijkstra: ${comparedTime.dijkstra}; floyd: ${comparedTime.floyd}`, 5)
    }

    return <div className="full-height">
        <Button style={{position: 'absolute'}} onClick={showResult}>show result</Button>
        <Button style={{position: 'absolute', top: 33}} onClick={compareMethods}>compare methods</Button>
        <div className="flex-column-center align-content-space-between">
            <Highlighter
                points={points}
                setPoints={setPoints}
                connections={connections}
                setConnections={setConnections}
                path={path}
                distance={distance}
            />
            <div className="flex-container space-around" style={{marginBottom: '8%'}}>
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
            </div>
            <Controls
                setPoints={setPoints}
                setConnections={setConnections}
                incMatrix={incMatrix}
                setIncMatrix={setIncMatrix}
                toPoint={toPoint}
                fromPoint={fromPoint}
                setFromPoint={setFromPoint}
                setToPoint={setToPoint}
                computePath={computePath}
                addPoint={addPoint}
                addConnection={addConnection}
            />
        </div>
        {menuVisible && <DropDownMenu
            deleteConnection={deleteConnection}
            changeWeight={changeWeight}
            menuStyle={menuStyle}
            inputVisible={inputVisible}
            setInputVisible={setInputVisible}
            selectedEntity={selectedEntity}
        />}
        <ResultTableModal
            visible={resultModalVisible}
            setVisible={setResultModalVisible}
            pathList={pathList}
        />
    </div>
}

export default App;