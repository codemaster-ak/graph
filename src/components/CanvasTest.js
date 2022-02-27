import React, {createRef, useRef, useState} from 'react';
import {Circle, Layer, Line, Stage} from "react-konva";
import {Menu, Select} from "antd";
import CommonModal from "./CommonModal";
import Konva from "konva";

const CanvasTest = ({mode}) => {

    const layerRef = useRef(undefined)

    const [modalVisible, setModalVisible] = useState(false)
    const [selectedOption, setSelectedOption] = useState()
    const [coords, setCoords] = useState([
        {key: '1', x: 10, y: 10},
        {key: '2', x: 30, y: 30},
        {key: '3', x: 10, y: 30},
        {key: '4', x: 30, y: 10},
        {key: '5', x: 50, y: 50},
    ])


    const onClick = (event) => {
        setModalVisible(true)
        // console.log(mode, event.target)
        console.log(coords)
    }

    const onFinish = (formValues) => {
        console.log(formValues)
    }


    // const menu = (
    //     <Menu>
    //         <Menu.Item key="1">1st menu item</Menu.Item>
    //         <Menu.Item key="2">2nd menu item</Menu.Item>
    //         <Menu.Item key="3">3rd menu item</Menu.Item>
    //     </Menu>
    // )


    // const generateTargets = () => {
    //     const number = 10
    //     const result = []
    //     while (result.length < number) {
    //         result.push({
    //             id: 'target-' + result.length,
    //             key: 'target-' + result.length,
    //             x: stageRef.current.width() * Math.random(),
    //             y: stageRef.current.height() * Math.random(),
    //         })
    //     }
    //     return result
    // }
    //
    // const targets = generateTargets()
    //
    // // function to generate arrows between targets
    // const generateConnectors = () => {
    //     const number = 10;
    //     const result = [];
    //     while (result.length < number) {
    //         const from = 'target-' + Math.floor(Math.random() * targets.length)
    //         const to = 'target-' + Math.floor(Math.random() * targets.length)
    //         if (from === to) {
    //             continue;
    //         }
    //         result.push({
    //             id: 'connector-' + result.length,
    //             from: from,
    //             to: to,
    //         })
    //     }
    //     console.log(result)
    //     return result
    // }
    //
    // function getConnectorPoints(from, to) {
    //     const dx = to.x - from.x;
    //     const dy = to.y - from.y;
    //     let angle = Math.atan2(-dy, dx);
    //
    //     const radius = 50;
    //
    //     return [
    //         from.x + -radius * Math.cos(angle + Math.PI),
    //         from.y + radius * Math.sin(angle + Math.PI),
    //         to.x + -radius * Math.cos(angle),
    //         to.y + radius * Math.sin(angle),
    //     ];
    // }
    //
    // var connectors = generateConnectors();
    //
    // // update all objects on the canvas from the state of the app
    // function updateObjects() {
    //     targets.forEach((target) => {
    //         var node = layerRef.current.findOne('#' + target.id);
    //         node.x(target.x);
    //         node.y(target.y);
    //     });
    //     connectors.forEach((connect) => {
    //         var line = layerRef.current.findOne('#' + connect.id);
    //         var fromNode = layerRef.current.findOne('#' + connect.from);
    //         var toNode = layerRef.current.findOne('#' + connect.to);
    //
    //         const points = getConnectorPoints(
    //             fromNode.position(),
    //             toNode.position()
    //         );
    //         line.points(points);
    //     });
    // }
    //
    // // generate nodes for the app
    // connectors.forEach((connect) => {
    //     const line = new Konva.Arrow({
    //         stroke: 'black',
    //         id: connect.id,
    //         fill: 'black',
    //     });
    //     layerRef.current.add(line);
    // });
    //
    // targets.forEach((target) => {
    //     const node = new Konva.Circle({
    //         id: target.id,
    //         fill: Konva.Util.getRandomColor(),
    //         radius: 20 + Math.random() * 20,
    //         shadowBlur: 10,
    //         draggable: true,
    //     });
    //     layerRef.current.add(node);
    //
    //     node.on('dragmove', () => {
    //         // mutate the state
    //         target.x = node.x();
    //         target.y = node.y();
    //
    //         // update nodes from the new state
    //         updateObjects();
    //     });
    // });
    //
    // updateObjects();

    const c1 = useRef(undefined)
    const c2 = useRef(undefined)
    const l1 = useRef(undefined)

    const updateLine = (e) => {
        console.log(e)
        l1.current.points(
            [c1.current.x(),
                c1.current.y(),
                c2.current.x(),
                c2.current.y()
            ])
        layerRef.current.batchDraw()
    }

    return <>
        <Stage
            width={600}
            height={600}
            onClick={onClick}
        >
            <Layer ref={layerRef}>
                {/*{coords.map(cd => {*/}
                {/*    return <Circle x={cd.x} y={cd.y} key={cd.key} stroke='black' radius={8} draggable/>*/}
                {/*})}*/}
                <Circle ref={c1} x={10} y={10} stroke='black' radius={8} draggable onDragMove={updateLine}/>
                <Circle ref={c2} x={50} y={50} stroke='black' radius={8} draggable onDragMove={updateLine}/>
                <Line ref={l1} tension={2} stroke='black' points={[10, 10, 50, 50]}/>
            </Layer>
        </Stage>
        {/*<CommonModal*/}
        {/*    visible={modalVisible}*/}
        {/*    setVisible={setModalVisible}*/}
        {/*    onOk={onFinish}*/}
        {/*    title={<div>Операции с графом</div>}*/}
        {/*>*/}
        {/*    <Select*/}
        {/*        style={{width: 250}}*/}
        {/*        value={selectedOption}*/}
        {/*        onChange={setSelectedOption}*/}
        {/*        defaultValue={'addPoint'}*/}
        {/*    >*/}
        {/*        <Select.Option value={'addPoint'}>Добавить вершину в граф</Select.Option>*/}
        {/*        <Select.Option value={'addLine'}>Добавить дугу</Select.Option>*/}
        {/*        <Select.Option value={'deletePoint'}>Удалить вершину</Select.Option>*/}
        {/*        <Select.Option value={'deleteLine'}>Удалить дугу</Select.Option>*/}
        {/*        <Select.Option value={'changeLineWeight'}>Изменить вес дуги</Select.Option>*/}
        {/*    </Select>*/}
        {/*</CommonModal>*/}
    </>
}

export default CanvasTest;