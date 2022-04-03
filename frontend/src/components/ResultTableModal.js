import React from 'react';
import {Modal, Table} from 'antd';

const ResultTableModal = ({visible, setVisible, pathList}) => {

    const columns = [
        {
            title: 'Старт',
            dataIndex: 'from',
        }, {
            title: 'Финиш',
            dataIndex: 'to',
        }, {
            title: 'Путь',
            dataIndex: 'path',
        }, {
            title: 'Длина пути',
            dataIndex: 'distance',
        },
    ]

    return <Modal
        width='65%'
        title="Таблица результатов"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
    >
        <Table
            columns={columns}
            dataSource={pathList}
            rowKey={path => path.key}
        />
    </Modal>
}

export default ResultTableModal;