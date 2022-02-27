import React, {useState} from 'react';
import {Button} from "antd";
import "./App.css";
import Matrix from "./components/Matrix";
import CanvasTest from "./components/CanvasTest";
import Canvas from "./components/Canvas";
import {INITIAL_STATE} from "./components/consts";

const App = () => {

    const [mode, setMode] = useState('viewing')

    const [steps, setSteps] = useState(INITIAL_STATE)
    let ctx

    const draw = () => {
        setMode('adding')
    }
    const draw2 = () => {
        ctx.restore()
    }

    const add = () => {
        const new_step = Object.values(steps).length + 1 + ''
        setSteps({
            ...steps, [new_step]: {
                x: 350,
                y: 250,
                colour: 'green'
            }
        })
    }

    return <div>
        {/*<CanvasTest mode={mode}/>*/}
        <Canvas add={add} steps={steps} setSteps={setSteps}/>
        <Button type='primary' onClick={add}>add item</Button>
        <Button type='primary' onClick={draw2}>btn2</Button>
        <Matrix/>
    </div>
}

export default App;