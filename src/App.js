import React, {useEffect, useRef} from 'react';
import {Button} from "antd";
import "./App.css";
import Matrix from "./components/Matrix";

const App = () => {

    const canvas = useRef(undefined)

    let ctx
    useEffect(() => {
        ctx = canvas.current.getContext('2d')
        // ctx.save();
        // ctx.fillStyle = 'green';
        // ctx.fillRect(10, 10, 100, 100);
        // ctx.restore();
        // ctx.fillRect(150, 40, 100, 100);
    }, [])

    const draw = () => {
        drawCircle([50, 50, 15], 'green', 2)
        // ctx.save();
        // ctx.fillStyle = 'green'
        // ctx.fillRect(10, 10, 100, 100)
        // ctx.restore();
    }
    const draw2 = () => {
        ctx.restore()
    }

    const drawCircle = (coords, fillCol, lineWidth, strokeColor) => {
        let ctx = canvas.current.getContext('2d');
        ctx.fillStyle = fillCol;
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeColor;
        ctx.arc(coords[0], coords[1], coords[2], 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }

    return <div>
        <canvas ref={canvas} width={350} height={200}/>
        <Button type='primary' onClick={draw}>btn</Button>
        <Button type='primary' onClick={draw2}>btn2</Button>
        <Matrix/>
    </div>
}

export default App;