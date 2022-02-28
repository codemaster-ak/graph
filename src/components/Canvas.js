import React, {useRef, useState} from 'react';
import {Circle, Layer, Line, Stage} from "react-konva";
import Border from "./Border";
import {SIZE} from "./consts";
import DropDownMenu from "./DropDownMenu";
import getMousePos from "../functions/functions";

const Canvas = ({points, setPoints, add}) => {

    const stageRef = useRef(undefined)

    const [selectedPoint, setSelectedPoint] = useState(null)
    const [connectionPreview, setConnectionPreview] = useState(null)
    const [connections, setConnections] = useState([])

    const [menuVisible, setMenuVisible] = useState(false)
    const [menuStyle, setMenuStyle] = useState({})
    const [selectedEntity, setSelectedEntity] = useState(false)

    const createConnectionPoints = (source, destination) => {
        return [source.x, source.y, destination.x, destination.y]
    }

    const hasIntersection = (position, point) => {
        const radius = Math.sqrt(Math.pow(position.x - point.x, 2) + Math.pow(position.x - point.x, 2))
        return SIZE - radius > 0
    }

    const detectConnection = (position, id, points) => {
        return Object.keys(points).find(point => {
            return point !== id && hasIntersection(position, points[point]);
        })
    }

    const deleteConnection = () => {
        setConnections(connections.filter(connection => {
            return connection.from !== selectedEntity.from || connection.to !== selectedEntity.to
        }))
        setMenuVisible(false)
    }

    const deletePoint = (point) => {
        let copyPoints = JSON.parse(JSON.stringify(points))
        setConnections(connections.filter(connection => {
            return connection.from !== point && connection.to !== point
        }))
        delete copyPoints[point]
        setPoints(copyPoints)
    }

    const changeWeight = () => {
        console.log('changeWeight')
        setMenuVisible(false)
    }

    const handleOnClick = (id) => {
        if (selectedPoint === id) {
            setSelectedPoint(null)
        } else {
            setSelectedPoint(id)
        }
    }

    const handleOnContextMenu = (id) => {
        if (selectedEntity === id) {
            setSelectedEntity(undefined)
        } else {
            const positionX = stageRef.current.getPointerPosition().x
            const positionY = stageRef.current.getPointerPosition().y
            setMenuStyle({position: 'absolute', top: positionY.valueOf(), left: positionX.valueOf()})
            setSelectedEntity(id)
        }
    }

    const handlePointDrag = (event, key) => {
        const position = event.target.position()
        setPoints({
            ...points,
            [key]: {
                ...points[key],
                ...position
            }
        })
    }

    const handleAnchorDragStart = (event) => {
        const position = event.target.position()
        setConnectionPreview(
            <Line
                x={position.x}
                y={position.y}
                points={createConnectionPoints(position, position)}
                stroke='black'
                strokeWidth={2}
            />
        )
    }

    // const getMousePos = (event) => {
    //     const position = event.target.position()
    //     const stage = event.target.getStage()
    //     const pointerPosition = stage.getPointerPosition()
    //     return {
    //         x: pointerPosition.x - position.x,
    //         y: pointerPosition.y - position.y
    //     }
    // }

    const handleAnchorDragMove = (event) => {
        const position = event.target.position()
        const mousePos = getMousePos(event)
        setConnectionPreview(
            <Line
                x={position.x}
                y={position.y}
                points={createConnectionPoints({x: 0, y: 0}, mousePos)}
                stroke='gray'
                strokeWidth={3}
            />
        )
    }

    const handleAnchorDragEnd = (event, id) => {
        setConnectionPreview(null)
        const stage = event.target.getStage()
        const mousePos = stage.getPointerPosition()
        const connectionTo = detectConnection(mousePos, id, points)
        if (connectionTo) {
            setConnections([
                ...connections,
                {
                    to: connectionTo,
                    from: id,
                    weight: 1
                }
            ])
        }
    }

    const onContextMenu = (event) => {
        event.evt.preventDefault()
        if (!(event.target === stageRef.current)) {
            setMenuVisible(true)
        }
        if (menuVisible) setMenuVisible(false)
    }

    const pointObjs = Object.keys(points).map(point => {
        const {x, y, colour} = points[point]
        return <Circle
            key={point}
            x={x}
            y={y}
            radius={SIZE}
            fill={colour}
            onClick={() => handleOnClick(point)}
            onDblClick={() => deletePoint(point)}
            onContextMenu={() => handleOnContextMenu(point)}
            draggable
            onDragMove={(e) => handlePointDrag(e, point)}
            perfectDrawEnabled={false}
        />
    })

    const connectionObjs = connections.map((connection) => {
        const fromPoint = points[connection.from]
        const toPoint = points[connection.to]
        const lineEnd = {
            x: toPoint.x - fromPoint.x,
            y: toPoint.y - fromPoint.y
        }
        const connectionPoints = createConnectionPoints({x: 0, y: 0}, lineEnd)
        return <Line
            key={connection.from + connection.to + Math.random()}
            x={fromPoint.x}
            y={fromPoint.y}
            points={connectionPoints}
            stroke='black'
            strokeWidth={3}
            onContextMenu={() => handleOnContextMenu(connection)}
        />
    })

    const borders =
        selectedPoint !== null ? (
            <Border
                id={selectedPoint}
                point={points[selectedPoint]}
                onAnchorDragEnd={event => handleAnchorDragEnd(event, selectedPoint)}
                onAnchorDragMove={handleAnchorDragMove}
                onAnchorDragStart={handleAnchorDragStart}
            />
        ) : null

    return <>
        <Stage
            width={600}
            height={600}
            onDblClick={event => add(event, stageRef)}
            onContextMenu={event => onContextMenu(event)}
            ref={stageRef}
        >
            <Layer>
                {/** порядок borders и pointObjs не менять*/}
                {borders && borders}
                {pointObjs && pointObjs}
                {connectionObjs && connectionObjs}
                {connectionPreview && connectionPreview}
            </Layer>
        </Stage>
        {menuVisible && <DropDownMenu
            deleteConnection={deleteConnection}
            changeWeight={changeWeight}
            menuStyle={menuStyle}
        />}
    </>
}

export default Canvas;