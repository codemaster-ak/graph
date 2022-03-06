import React, {useEffect, useState} from 'react';
import {Button, InputNumber, Menu} from "antd";

const DropDownMenu = ({menuStyle, deleteConnection, changeWeight, inputVisible, setInputVisible, selectedEntity}) => {

    const [weight, setWeight] = useState(selectedEntity?.weight)

    useEffect(() => {
        setWeight(selectedEntity?.weight)
    }, [selectedEntity])

    return <Menu style={menuStyle}>
        <Menu.Item key='remove' onClick={deleteConnection}>Удалить</Menu.Item>
        <Menu.Item key='changeWeight' onClick={() => setInputVisible(true)}>
            <div className='flex-container'>
                <p style={{marginRight: 8}}>Изменить вес</p>
                {inputVisible && <>
                    <InputNumber
                        value={weight}
                        onChange={(value) => setWeight(value)}
                        style={{marginTop: 5, height: 30}}
                    />
                    <Button
                        onClick={() => changeWeight(weight)}
                        style={{margin: '5px 10px', height: 30}}
                    >
                        Применить
                    </Button>
                </>}
            </div>
        </Menu.Item>
    </Menu>
}

export default DropDownMenu;