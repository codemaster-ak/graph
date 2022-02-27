import React, {useRef, useState} from 'react';
import {Select} from "antd";
import CommonModal from "./CommonModal";

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


    return <CommonModal
        visible={modalVisible}
        setVisible={setModalVisible}
        onOk={onFinish}
        title={<div>Операции с графом</div>}
    >
        <Select
            style={{width: 250}}
            value={selectedOption}
            onChange={setSelectedOption}
            defaultValue={'addPoint'}
        >
            <Select.Option value={'addPoint'}>Добавить вершину в граф</Select.Option>
            <Select.Option value={'addLine'}>Добавить дугу</Select.Option>
            <Select.Option value={'deletePoint'}>Удалить вершину</Select.Option>
            <Select.Option value={'deleteLine'}>Удалить дугу</Select.Option>
            <Select.Option value={'changeLineWeight'}>Изменить вес дуги</Select.Option>
        </Select>
    </CommonModal>

}

export default CanvasTest;