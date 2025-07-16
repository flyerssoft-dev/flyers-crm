import React, { useCallback } from 'react';
import { Drawer, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Invoices from '../add-student';

const { confirm } = Modal;

const AddInvoiceModal = ({ visible = false, toggleVisible, form, onSubmit, loading = false, disabled = false, refreshList }) => {
	const showConfirm = useCallback(() => {
		confirm({
			title: 'Do you want to close this window?',
			icon: <ExclamationCircleOutlined />,
			content: 'You will be lost all the details you have entered here.',
			onOk() {
				toggleVisible(false);
			},
			onCancel() {
				 
			},
		});
	}, []);

	// const handleFinish = (values) => {
	// 	toggleVisible(false);
	// 	onSubmit(values);
	// };

	return (
		<Drawer maskClosable={false} title="Add New Invoice" placement="right" width={'80%'} open={visible} destroyOnHidden onClose={showConfirm}>
			<Invoices {...{ toggleVisible, refreshList }} />
		</Drawer>
	);
};

export default AddInvoiceModal;
