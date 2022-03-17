import React, {useRef} from 'react';
import {Circle} from 'react-konva';

const Anchor = ({x, y, id, onDragMove, onDragEnd, onDragStart}) => {

    const anchor = useRef(null)

    const dragBounds = (ref) => {
        if (ref.current !== null) {
            return ref.current.getAbsolutePosition()
        }
        return {x: 0, y: 0}
    }

    return <Circle
        x={x}
        y={y}
        radius={5}
        fill='#656565'
        draggable
        onDragStart={event => onDragStart(event, id)}
        onDragMove={event => onDragMove(event, id)}
        onDragEnd={event => onDragEnd(event, id)}
        dragBoundFunc={() => dragBounds(anchor)}
        perfectDrawEnabled={false}
        ref={anchor}
    />
}

export default Anchor;