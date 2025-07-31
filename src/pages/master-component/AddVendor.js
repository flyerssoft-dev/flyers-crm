import React, { useEffect } from 'react';
import { Input, Button, Divider, Form, Select, InputNumber } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { putApi } from 'redux/sagas/putApiSaga';
import { postApi } from '../../redux/sagas/postApiDataSaga';
import { API_STATUS } from 'constants/app-constants';
import { SERVER_IP } from 'assets/Config';
import { resetApiStatus } from '../../redux/reducers/globals/globalActions';

const { TextArea } = Input;

const AddVendor = ({ handleClose, editVendor, setVendorAddModal }) => {
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const globalRedux = useSelector((state) => state.globalRedux);

	const addVendor = (values) => {
		const data = {
			...values,
			orgId: globalRedux?.selectedOrganization?.id,
		};
		dispatch(postApi(data, 'ADD_VENDOR'));
	};

	const handleEdit = (values) => {
		const data = {
			...values,
			orgId: globalRedux?.selectedOrganization?.id,
		};
		const url = `${SERVER_IP}vendor/${editVendor._id}?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(putApi(data, 'EDIT_VENDOR', url));
	};

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_VENDOR === 'SUCCESS' || globalRedux.apiStatus.EDIT_VENDOR === 'SUCCESS') {
			dispatch(resetApiStatus(editVendor ? 'EDIT_VENDOR' : 'ADD_VENDOR'));
			form.resetFields(); // ✅ Reset form after success
			setVendorAddModal(false);
			handleClose();
		}
	}, [globalRedux.apiStatus, editVendor, handleClose, setVendorAddModal, dispatch, form]);

	const layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 18 },
	};

	const loading = globalRedux.apiStatus.ADD_VENDOR === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_VENDOR === API_STATUS.PENDING;

	return (
		<div style={{ backgroundColor: '#fff', padding: '20px' }}>
			<h3 style={{ marginBottom: '10px' }}>{editVendor ? 'Edit' : 'New'} Vendor</h3>
			<Divider />

			<Form form={form} name="add-vendor" colon={false} labelAlign="left" onFinish={editVendor ? handleEdit : addVendor} {...layout}>
				<Form.Item label="Vendor Name" name="vendorName" initialValue={editVendor?.vendorName} rules={[{ required: true, message: 'This Field is required!' }]}>
					<Input placeholder="Enter vendor name" />
				</Form.Item>

				<Form.Item label="Vendor Type" name="vendorType" initialValue={editVendor?.vendorType} rules={[{ required: true, message: 'This Field is required!' }]}>
					<Select placeholder="Select vendor type">
						<Select.Option value="Supplier">Supplier</Select.Option>
					</Select>
				</Form.Item>

				<Form.Item label="Place of Supply" name="placeOfSupply" initialValue={editVendor?.placeOfSupply} rules={[{ required: true, message: 'This Field is required!' }]}>
					<Select placeholder="Select place of supply">
						<Select.Option value="Tamilnadu">Tamilnadu</Select.Option>
					</Select>
				</Form.Item>

				<Form.Item
					label="Contact"
					name="mobile"
					initialValue={editVendor?.mobile}
					rules={[
						{ required: true, message: 'This Field is required!' },
						{
							pattern: /^[6-9]\d{9}$/,
							message: 'Enter a valid 10-digit mobile number',
						},
					]}>
					<Input placeholder="Enter mobile number" />
				</Form.Item>

				<Form.Item label="Email" name="email" initialValue={editVendor?.email} rules={[{ type: 'email', message: 'Enter a valid email address' }]}>
					<Input placeholder="Enter email address" />
				</Form.Item>

				<Form.Item label="GSTIN" name="gstin" initialValue={editVendor?.gstin}>
					<Input placeholder="Enter GSTIN number" />
				</Form.Item>

				<Form.Item label="Opening Balance" name="openingBalance" initialValue={editVendor?.openingBalance}>
					<InputNumber placeholder="Enter opening balance" style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item label="Billing Address" name="billingAddress" initialValue={editVendor?.billingAddress}>
					<TextArea placeholder="Enter billing address" rows={3} />
				</Form.Item>

				<Form.Item label="Shipping Address" name="shippingAddress" initialValue={editVendor?.shippingAddress}>
					<TextArea placeholder="Enter shipping address" rows={3} />
				</Form.Item>

				<Form.Item label="Remarks" name="remarks" initialValue={editVendor?.remarks}>
					<TextArea placeholder="Enter remarks or notes" rows={2} />
				</Form.Item>

				<Form.Item wrapperCol={{ offset: 6, span: 18 }}>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<Button danger style={{ width: '48%' }} onClick={() => setVendorAddModal(false)}>
							Cancel
						</Button>
						<Button type="primary" htmlType="submit" style={{ width: '48%' }} loading={loading}>
							{editVendor ? 'Update' : 'Save'}
						</Button>
					</div>
				</Form.Item>
			</Form>
		</div>
	);
};

export default AddVendor;
