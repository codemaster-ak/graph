import React, {useEffect, useState} from 'react';
import "./App.css";
import Matrix from "./components/Matrix";
import Canvas from "./components/Canvas";
import getMousePos from "./functions/getMousePos";
import Point from "./components/Point";
import Dijkstra from "./functions/Dijkstra";
import {MAX_INTEGER, MIN_INTEGER} from "./components/consts";
import Connection from "./components/Connection";
import {message} from "antd";

const App = () => {

    /**
     * Матрица смежности
     * Значение - это вес ребра между вершиной и вершиной, 0 означает отсутствие самоконтроля, Infinity означает отсутствие ребра
     * */

    const matrix = [
        [MIN_INTEGER, 9, 2, MAX_INTEGER, 6],
        [9, MIN_INTEGER, 3, MAX_INTEGER, MAX_INTEGER],
        [2, 3, MIN_INTEGER, 5, MAX_INTEGER],
        [MAX_INTEGER, MAX_INTEGER, 5, MIN_INTEGER, 1],
        [6, MAX_INTEGER, MAX_INTEGER, 1, MIN_INTEGER]
    ]

    const [points, setPoints] = useState([])
    const [connections, setConnections] = useState([])

    useEffect(() => {
        try {
            Dijkstra(0, matrix) // [ 0, 5, 2, 7, 6 ]
        } catch (e) {
            console.error(e)
        }
    }, [])

    const addPoint = (event, stageRef) => {
        if (event.target === stageRef?.current) {
            event.evt.preventDefault()
            const mousePos = getMousePos(event)
            if (points.length < 10) {
                setPoints([...points, new Point(mousePos.x, mousePos.y, String(new Date().getTime()))])
            } else message.warn('Достигнуто максимальное количество вершин - 10', 1).then()
        } else {
            /** 600 - размер Stage */
            const x = Math.round(Math.random() * 600)
            const y = Math.round(Math.random() * 600)
            setPoints([...points, new Point(x, y, String(new Date().getTime()))])
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
                    new Connection(point.key, connectionTo.key, 1, 'black')
                ])
            }
        } else {
            const from = points.find(p => p.key === point[0])
            const to = points.find(p => p.key === point[1])
            const isExist = connections.some(connection => {
                return (connection.from === from.key && connection.to === to.key) ||
                    (connection.from === to.key && connection.to === from.key)
            })
            if (!isExist) {
                setConnections([
                    ...connections,
                    new Connection(from.key, to.key, 1, 'black')
                ])
            } else message.warn('Соединение уже существует', 1).then()
        }
    }

    return <div>
        <Canvas
            points={points}
            setPoints={setPoints}
            connections={connections}
            setConnections={setConnections}
            addPoint={addPoint}
            addConnection={addConnection}
        />
        <Matrix
            points={points}
            connections={connections}
            addPoint={addPoint}
            addConnection={addConnection}
        />
    </div>
}

export default App;