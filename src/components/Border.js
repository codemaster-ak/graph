import React from "react";
import {Circle, Line} from "react-konva";
import Anchor from "./Anchor";
import {SIZE} from "./consts";

const points = [0, 0, SIZE, 0, SIZE, SIZE, 0, SIZE, 0, 0];

const Border = ({
                    step,
                    id,
                    onAnchorDragStart,
                    onAnchorDragMove,
                    onAnchorDragEnd
                }) => {

    const getAnchorPoints = (x, y) => {
        return [
            {
                x: x - SIZE - 10,
                y: y
            }, {
                x: x + SIZE + 10,
                y: y
            }, {
                x: x,
                y: y - SIZE - 10
            }, {
                x: x,
                y: y + SIZE + 10
            }
        ]
    }

    const {x, y} = step
    const anchorPoints = getAnchorPoints(x, y)

    const anchors = anchorPoints.map((position, index) => (
        <Anchor
            key={`anchor-${index}`}
            id={id}
            x={position.x}
            y={position.y}
            onDragStart={onAnchorDragStart}
            onDragMove={onAnchorDragMove}
            onDragEnd={onAnchorDragEnd}
        />
    ))

    return <>
        {/*<Line*/}
        {/*    x={x}*/}
        {/*    y={y}*/}
        {/*    points={points}*/}
        {/*    stroke='black'*/}
        {/*    strokeWidth={2}*/}
        {/*    perfectDrawEnabled={false}*/}
        {/*/>*/}
        <Circle x={x}
                y={y} stroke='black' strokeWidth={2} radius={SIZE} perfectDrawEnabled={false}/>
        {anchors}
    </>
}

export default Border;