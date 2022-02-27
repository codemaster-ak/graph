import React from 'react';
import {Menu} from "antd";

const DropDownMenu = ({menuStyle, deleteConnection, changeWeight}) => {

    return <Menu style={menuStyle}>
        <Menu.Item key='remove' onClick={deleteConnection}>Remove</Menu.Item>
        <Menu.Item key='changeWeight' onClick={changeWeight}>Change weight</Menu.Item>
    </Menu>
}

export default DropDownMenu;