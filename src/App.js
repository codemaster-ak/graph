import React, {useState} from 'react';
import {Button} from "antd";
import "./App.css";
import Matrix from "./components/Matrix";
import CanvasTest from "./components/CanvasTest";
import Canvas from "./components/Canvas";

const App = () => {

    const [mode, setMode] = useState('viewing')

    let ctx

    const draw = () => {
        setMode('adding')
    }
    const draw2 = () => {
        ctx.restore()
    }


    return <div>
        {/*<CanvasTest mode={mode}/>*/}
        <Canvas/>
        <Button type='primary' onClick={draw}>add item</Button>
        <Button type='primary' onClick={draw2}>btn2</Button>
        <Matrix/>
    </div>
}

export default App;