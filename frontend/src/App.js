import {Button, Layout, message} from 'antd';
import React, {useState} from 'react';
import Content from './Content';
import ResultTableModal from './components/ResultTableModal';
import {getMousePos} from './functions/canvasFunctions';
import Point from './classes/Point';
import {BASE_CONNECTION_COLOR, BUTTON_WIDTH, COMPUTE_METHODS, STAGE_SIZE} from './consts';
import Connection from './classes/Connection';
import toConnectionMatrix from './functions/toConnectionMatrix';
import getMatrixValues from './functions/getMatrixValues';
import Graph from './classes/Graph';
import Highlighter from './components/Highlighter';
import Controls from './components/Controls';

const App = () => {

    const [points, setPoints] = useState([])
    const [connections, setConnections] = useState([])
    const [incMatrix, setIncMatrix] = useState([[]])
    const [path, setPath] = useState([])
    const [distance, setDistance] = useState(undefined)
    const [fromPoint, setFromPoint] = useState(undefined)
    const [toPoint, setToPoint] = useState(undefined)
    const [compareResult, setCompareResult] = useState('')

    const [menuVisible, setMenuVisible] = useState(false)
    const [inputVisible, setInputVisible] = useState(false)
    const [menuStyle, setMenuStyle] = useState({})
    const [selectedEntity, setSelectedEntity] = useState(undefined)

    const [resultModalVisible, setResultModalVisible] = useState(false)
    const [pathList, setPathList] = useState([])

    const [collapsed, setCollapsed] = useState(false)
    const [selectedMethod, setSelectedMethod] = useState(COMPUTE_METHODS.Dijkstra)

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
        connectionMatrix = getMatrixValues(connectionMatrix)

        try {
            let startIndex = 0, finishIndex = 0
            points.forEach((point, index) => {
                if (point.key === fromPoint) startIndex = index
                if (point.key === toPoint) finishIndex = index
            })

            const [distance, path] = Graph.computePath(connectionMatrix, startIndex, finishIndex, selectedMethod)
            setDistance(distance)
            setPath(path)
        } catch (e) {
            message.error(e).then()
        }
    }

    const showResult = () => {
        setResultModalVisible(true)

        let connectionMatrix = toConnectionMatrix(incMatrix)
        connectionMatrix = getMatrixValues(connectionMatrix)

        const distances = Graph.dijkstra(connectionMatrix)
        const paths = Graph.pathsFromMatrix(connectionMatrix)
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

    const compareMethods = () => {
        let connectionMatrix = toConnectionMatrix(incMatrix)
        connectionMatrix = getMatrixValues(connectionMatrix)
        const comparedTime = Graph.compareMethods(connectionMatrix)
        setCompareResult(`dijkstra: ${comparedTime.dijkstra}; floyd: ${comparedTime.floyd}`)
    }

    const onCollapse = (collapsed) => {
        setCollapsed(collapsed)
    }

    return <Layout className="flex-row-space-between" style={{minHeight: '100vh'}}>
        <div className="flex-column-center" style={{minHeight: '100vh'}}>
            <div className="padding rounded" style={{background: '#fff', width: "fit-content"}}>
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
                    selectedMethod={selectedMethod}
                    setSelectedMethod={setSelectedMethod}
                />
                <div className="flex-column margin-bottom-lg">
                    <Button
                        type="primary"
                        onClick={showResult}
                        style={{width: BUTTON_WIDTH}}
                        className="margin-bottom-xs"
                    >
                        Вывести таблицу
                    </Button>
                    <Button
                        type="primary"
                        onClick={compareMethods}
                        style={{width: BUTTON_WIDTH}}
                        className="margin-bottom-xs"
                    >
                        Сравнить методы
                    </Button>
                </div>
                <Highlighter
                    points={points}
                    setPoints={setPoints}
                    connections={connections}
                    setConnections={setConnections}
                    path={path}
                    distance={distance}
                    compareResult={compareResult}
                />
            </div>
        </div>
        {/*<Layout.Sider theme="dark" collapsible collapsed={collapsed} onCollapse={onCollapse}>*/}
        {/*    <Menu theme="dark" mode="inline">*/}
        {/*        <Menu.Item key="showTable" onClick={showResult}>*/}
        {/*            Вывести таблицу*/}
        {/*        </Menu.Item>*/}
        {/*        <Menu.Item key="compareMethod" onClick={compareMethods}>*/}
        {/*            Сравнить методы*/}
        {/*        </Menu.Item>*/}
        {/*        /!*<Menu.Item onClick={() => {console.log('files')}} key="9" icon={<FileOutlined/>}>*!/*/}
        {/*        /!*    Файлы*!/*/}
        {/*        /!*</Menu.Item>*!/*/}
        {/*    </Menu>*/}
        {/*</Layout.Sider>*/}
        {/*<Layout className="site-layout">*/}

            <div className="flex-center full-width">
                <Content
                    points={points}
                    setPoints={setPoints}
                    connections={connections}
                    setConnections={setConnections}
                    incMatrix={incMatrix}
                    setIncMatrix={setIncMatrix}
                    menuVisible={menuVisible}
                    setMenuVisible={setMenuVisible}
                    inputVisible={inputVisible}
                    setInputVisible={setInputVisible}
                    menuStyle={menuStyle}
                    setMenuStyle={setMenuStyle}
                    selectedEntity={selectedEntity}
                    setSelectedEntity={setSelectedEntity}
                />
            </div>

        {/*</Layout>*/}
        <ResultTableModal
            visible={resultModalVisible}
            setVisible={setResultModalVisible}
            pathList={pathList}
        />
    </Layout>
}

export default App;