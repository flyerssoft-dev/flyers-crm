import React, { useMemo } from 'react';
import { Button, Form, Modal, Select, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { SERVER_IP } from 'assets/Config';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { API_STATUS, ORDER_STATUS_DROPDOWN } from 'constants/app-constants';

const UpdateStatusModal = ({ rowSelection, refreshList }) => {
	const globalRedux = useSelector((state) => state.globalRedux);
	const organizationId = globalRedux.selectedOrganization._id;
	const [statusVisible, setStatusVisible] = React.useState(false);
	const [form] = Form.useForm();
	const dispatch = useDispatch();

	const handleStatusSubmit = (values) => {
		const request = rowSelection?.selectedRowKeys?.map((orderId) => ({ orderId })) ?? [];
		let url = `${SERVER_IP}order/status?orgId=${organizationId}`;
		dispatch(postApi({ selectedOrders: request, orderStatus: values?.status }, 'UPDATE_ORDER_STATUS', url));
	};

	React.useEffect(() => {
		if (globalRedux.apiStatus.UPDATE_ORDER_STATUS === 'SUCCESS') {
			setStatusVisible(false);
			refreshList();
			dispatch(resetApiStatus('UPDATE_ORDER_STATUS'));
		}
	}, [globalRedux.apiStatus, dispatch, refreshList]);

	const loading = useMemo(() => globalRedux.apiStatus.UPDATE_ORDER_STATUS === API_STATUS.PENDING, [globalRedux.apiStatus]);

	if (rowSelection?.selectedRowKeys?.length === 0) return null;

	return (
		<>
			<Col span={8}>
				<Button onClick={() => setStatusVisible(true)} type="primary">
					Update Status
				</Button>
			</Col>
			<Modal
				// okButtonProps={{ form: 'category-editor-form', key: 'submit', htmlType: 'submit' }}
				onOk={form.submit}
				onCancel={() => setStatusVisible(false)}
				open={statusVisible}
				width={'20%'}
				okButtonProps={{
					loading
				}}
				okText="Submit">
				<Form form={form} requiredMark={false} colon={false} id="category-editor-form" layout="vertical" onFinish={handleStatusSubmit}>
					<Form.Item
						label="Ticket Status"
						name="status"
						rules={[
							{
								required: true,
								message: 'Please Select One!',
							},
						]}>
						<Select placeholder="Select Status">
							{ORDER_STATUS_DROPDOWN?.map((value) => (
								<Select.Option key={value} value={value}>
									{value}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default UpdateStatusModal;
