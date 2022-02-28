import React from "react";
import {Circle} from "react-konva";
import Anchor from "./Anchor";
import {SIZE} from "./consts";

const points = [0, 0, SIZE, 0, SIZE, SIZE, 0, SIZE, 0, 0]

const Border = ({
                    point,
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

    const createAnchors = (point) => {
        const anchorPoints = getAnchorPoints(point.x, point.y)

        return anchorPoints.map((position, index) => (
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
    }

    return <>
        {point && <Circle
            x={point.x}
            y={point.y}
            stroke='black'
            strokeWidth={2}
            radius={SIZE}
            perfectDrawEnabled={false}
        />}
        {createAnchors(point)}
    </>
}

export default Border;