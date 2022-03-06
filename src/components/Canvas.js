import React, {useRef, useState} from 'react';
import {Circle, Layer, Line, Stage} from "react-konva";
import Border from "./Border";
import {SIZE} from "./consts";
import DropDownMenu from "./DropDownMenu";
import getMousePos from "../functions/getMousePos";
import Connection from "./Connection";

const Canvas = ({points, setPoints, connections, setConnections, addPoint, addConnection}) => {

    const stageRef = useRef(undefined)

    const [selectedPoint, setSelectedPoint] = useState(undefined)
    const [connectionPreview, setConnectionPreview] = useState(null)

    const [menuVisible, setMenuVisible] = useState(false)
    const [inputVisible, setInputVisible] = useState(false)
    const [menuStyle, setMenuStyle] = useState({})
    const [selectedEntity, setSelectedEntity] = useState(undefined)

    const createConnectionPoints = (source, destination) => {
        return [source.x, source.y, destination.x, destination.y]
    }

    const hasIntersection = (position, point) => {
        const radius = Math.sqrt(Math.pow(position.x - point.x, 2) + Math.pow(position.x - point.x, 2))
        return SIZE - radius > 0
    }

    const detectConnection = (position, point) => {
        return points.find(p => {
            return p.key !== point.key && hasIntersection(position, p)
        })
    }

    const deleteConnection = () => {
        setConnections(connections.filter(connection => {
            return connection.from !== selectedEntity.from || connection.to !== selectedEntity.to
        }))
        setMenuVisible(false)
    }

    const deletePoint = (key) => {
        setConnections(connections.filter(connection => {
            return connection.from !== key && connection.to !== key
        }))
        setPoints(points.filter(point => {
            return point.key !== key
        }))
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

    const handleOnClick = (point) => {
        if (selectedPoint?.key === point.key) {
            setSelectedPoint(undefined)
        } else {
            setSelectedPoint(point)
        }
    }

    const handleOnContextMenu = (event, entity) => {
        event.evt.preventDefault()
        if (entity instanceof Connection) {
            if (selectedEntity === entity) {
                setMenuVisible(false)
                setInputVisible(false)
                setSelectedEntity(undefined)
            } else {
                const positionX = stageRef.current.getPointerPosition().x
                const positionY = stageRef.current.getPointerPosition().y
                setMenuVisible(true)
                setMenuStyle({position: 'absolute', top: positionY.valueOf(), left: positionX.valueOf()})
                setSelectedEntity(entity)
            }
        }
    }

    const handlePointDrag = (event, key) => {
        const position = event.target.position()
        setPoints(points.map(point => {
            if (point.key === key) {
                point.x = position.x
                point.y = position.y
            }
            return point
        }))
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


    const onContextMenu = (event) => {
        event.evt.preventDefault()
        // if (event.target !== stageRef.current) {
        //     setMenuVisible(true)
        // }
        if (menuVisible) {
            setInputVisible(false)
            setMenuVisible(false)
        }
    }

    const pointObjs = points.map(point => {
        return <Circle
            key={point.key}
            x={point.x}
            y={point.y}
            radius={SIZE}
            fill={point.colour}
            onClick={() => handleOnClick(point)}
            onDblClick={() => deletePoint(point.key)}
            onContextMenu={event => handleOnContextMenu(event, point)}
            draggable
            onDragMove={event => handlePointDrag(event, point.key)}
            perfectDrawEnabled={false}
        />
    })

    const connectionObjs = connections.map((connection) => {
        const fromPoint = points.find(point => point.key === connection.from)
        const toPoint = points.find(point => point.key === connection.to)
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
            stroke={connection.colour}
            strokeWidth={3}
            onContextMenu={event => handleOnContextMenu(event, connection)}
        />
    })

    const borders = selectedPoint
        ? <Border
            id={selectedPoint.key}
            point={selectedPoint}
            onAnchorDragEnd={event => addConnection(event, selectedPoint, setConnectionPreview, detectConnection)}
            onAnchorDragMove={handleAnchorDragMove}
            onAnchorDragStart={handleAnchorDragStart}
        />
        : null

    return <>
        <Stage
            width={600}
            height={600}
            onDblClick={event => addPoint(event, stageRef)}
            onContextMenu={event => onContextMenu(event)}
            ref={stageRef}
        >
            <Layer>
                {/** порядок borders и pointObjs не менять */}
                {borders && borders}
                {pointObjs && pointObjs}
                {connectionObjs && connectionObjs}
                {connectionPreview}
            </Layer>
        </Stage>
        {menuVisible && <DropDownMenu
            deleteConnection={deleteConnection}
            changeWeight={changeWeight}
            menuStyle={menuStyle}
            inputVisible={inputVisible}
            setInputVisible={setInputVisible}
            selectedEntity={selectedEntity}
        />}
    </>
}

export default Canvas;