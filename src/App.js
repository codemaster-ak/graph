import React, {useState} from 'react';
import {Button} from "antd";
import "./App.css";
import Matrix from "./components/Matrix";
import Canvas from "./components/Canvas";
import {INITIAL_STATE} from "./components/consts";
import getMousePos from "./functions/functions";
import Point from "./components/Point";

const App = () => {

    const [mode, setMode] = useState('viewing')
    const [points, setPoints] = useState(INITIAL_STATE)

    const add = (event, stageRef) => {
        event.evt.preventDefault()
        if (event.target === stageRef.current) {
            const mousePos = getMousePos(event)
            const new_point = String(new Date().getTime())
            setPoints({
                ...points,
                [new_point]: new Point(mousePos.x, mousePos.y)
            })
        }
    }

    return <div>
        <Canvas add={add} points={points} setPoints={setPoints}/>
        <Button type='primary' onClick={add}>add item</Button>
        <Matrix/>
    </div>
}

export default App;