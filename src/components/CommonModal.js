import {Button, Modal} from "antd";
import React from "react";

const CommonModal = ({
                         bodyStyle,
                         width,
                         visible,
                         title,
                         setVisible,
                         onCancel,
                         confirmLoading,
                         onOk,
                         zIndex,
                         footer,
                         children,
                         form
                     }) => {

    return <Modal
        bodyStyle={bodyStyle ?? null}
        width={width ? width : '80%'}
        visible={visible}
        title={title ? title : null}
        onCancel={onCancel ? onCancel : () => setVisible?.(false)}
        confirmLoading={confirmLoading}
        onOk={onOk}
        zIndex={zIndex}
        footer={footer
            ? footer
            : footer === null
                ? null
                : <div>
                    <Button type='primary' key='back' onCancel={onCancel ? onCancel : () => setVisible?.(false)}>
                        Cancel
                    </Button>
                    <Button
                        type='primary'
                        key='submit'
                        form={form}
                        onClick={() => onOk?.()}
                        htmlType='submit'
                    >
                        Save
                    </Button>
                </div>
        }
    >
        {children}
    </Modal>
}

export default CommonModal;