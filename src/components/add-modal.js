import React, { useState, useCallback } from 'react';
import { Drawer, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const AddModal = ({
    modalTitle = 'Add New Invoice',
    visible = false,
    toggleVisible,
    children,
    width = '80%',
}) => {
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);

    const handleClose = useCallback(() => {
        setShowCloseConfirm(true);
    }, []);

    const handleConfirmOk = () => {
        setShowCloseConfirm(false);
        toggleVisible(false);
    };

    const handleConfirmCancel = () => {
        setShowCloseConfirm(false);
    };

    return (
        <>
            <Drawer
                maskClosable={false}
                title={modalTitle}
                placement="right"
                width={width}
                open={visible}
                destroyOnClose
                onClose={handleClose}
            >
                {children}
            </Drawer>

            <Modal
                open={showCloseConfirm}
                onOk={handleConfirmOk}
                onCancel={handleConfirmCancel}
                title="Do you want to close this window?"
                icon={<ExclamationCircleOutlined />}
                okText="Yes"
                cancelText="No"
            >
                <p>You will lose all the details you have entered here.</p>
            </Modal>
        </>
    );
};

export default AddModal;
