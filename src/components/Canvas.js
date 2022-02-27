import React, {useRef, useState} from 'react';
import {Circle, Layer, Line, Stage} from "react-konva";
import Border from "./Border";
import {SIZE} from "./consts";
import DropDownMenu from "./DropDownMenu";

const Canvas = ({steps, setSteps}) => {

    const stageRef = useRef(undefined)

    const [selectedStep, setSelectedStep] = useState(null)
    const [connectionPreview, setConnectionPreview] = useState(null)
    const [connections, setConnections] = useState([])

    const [menuVisible, setMenuVisible] = useState(false)
    const [menuStyle, setMenuStyle] = useState({})
    const [selectedEntity, setSelectedEntity] = useState(false)

    const createConnectionPoints = (source, destination) => {
        return [source.x, source.y, destination.x, destination.y]
    }

    const hasIntersection = (position, step) => {
        const radius = Math.sqrt(Math.pow(position.x - step.x, 2) + Math.pow(position.x - step.x, 2))
        return SIZE - radius > 0
    }

    const detectConnection = (position, id, steps) => {
        return Object.keys(steps).find(step => {
            return step !== id && hasIntersection(position, steps[step]);
        })
    }

    const deleteConnection = () => {
        setConnections(connections.filter(connection => {
            return connection.from !== selectedEntity.from || connection.to !== selectedEntity.to
        }))
        setMenuVisible(false)
    }

    const changeWeight = (position, id, steps) => {
        console.log('changeWeight')
        setMenuVisible(false)
    }


    const handleOnClick = (id) => {
        if (selectedStep === id) {
            setSelectedStep(null)
        } else {
            setSelectedStep(id)
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

    const handleStepDrag = (event, key) => {
        const position = event.target.position()
        setSteps({
            ...steps,
            [key]: {
                ...steps[key],
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

    const getMousePos = (event) => {
        const position = event.target.position()
        const stage = event.target.getStage()
        const pointerPosition = stage.getPointerPosition()
        return {
            x: pointerPosition.x - position.x,
            y: pointerPosition.y - position.y
        }
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

    const handleAnchorDragEnd = (event, id) => {
        setConnectionPreview(null)
        const stage = event.target.getStage()
        const mousePos = stage.getPointerPosition()
        const connectionTo = detectConnection(mousePos, id, steps)
        if (connectionTo) {
            setConnections([
                ...connections,
                {
                    to: connectionTo,
                    from: id
                }
            ])
        }
    }

    const onContextMenu = (event) => {
        event.evt.preventDefault()
        if (!(event.target === stageRef.current)) setMenuVisible(true)
    }

    const stepObjs = Object.keys(steps).map(step => {
        const {x, y, colour} = steps[step]
        return <Circle
            key={step}
            x={x}
            y={y}
            radius={SIZE}
            fill={colour}
            onClick={() => handleOnClick(step)}
            draggable
            onDragMove={(e) => handleStepDrag(e, step)}
            perfectDrawEnabled={false}
        />

    })

    const connectionObjs = connections.map((connection) => {
        const fromStep = steps[connection.from]
        const toStep = steps[connection.to]
        const lineEnd = {
            x: toStep.x - fromStep.x,
            y: toStep.y - fromStep.y
        }
        const points = createConnectionPoints({x: 0, y: 0}, lineEnd)
        return <Line
            key={connection.from + connection.to}
            x={fromStep.x}
            y={fromStep.y}
            points={points}
            stroke='black'
            strokeWidth={3}
            onContextMenu={() => handleOnContextMenu(connection)}
        />
    })

    const borders =
        selectedStep !== null ? (
            <Border
                id={selectedStep}
                step={steps[selectedStep]}
                onAnchorDragEnd={event => handleAnchorDragEnd(event, selectedStep)}
                onAnchorDragMove={handleAnchorDragMove}
                onAnchorDragStart={handleAnchorDragStart}
            />
        ) : null

    return <div>
        <Stage width={600} height={600} onContextMenu={event => onContextMenu(event)} ref={stageRef}>
            <Layer>
                {/** порядок borders и stepObjs не менять*/}
                {borders && borders}
                {stepObjs && stepObjs}
                {connectionObjs && connectionObjs}
                {connectionPreview && connectionPreview}
            </Layer>
        </Stage>
        {menuVisible &&
        <DropDownMenu deleteConnection={deleteConnection} changeWeight={changeWeight} menuStyle={menuStyle}/>}
    </div>
}

export default Canvas;