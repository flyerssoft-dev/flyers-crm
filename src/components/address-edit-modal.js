import React, { useEffect, useMemo } from 'react';
import { Row, Col, Input, Button, Form, Select, InputNumber, Modal } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { putApi } from 'redux/sagas/putApiSaga';
import { API_STATUS, CATEGORIES, CUSTOMER_TYPE, GST_TREATMENT, PLACE_OF_SUPPLY } from 'constants/app-constants';
import { SERVER_IP } from 'assets/Config';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';

const AddressEditModal = ({ showAddressEditModal, setShowAddressEditModal, editCustomer, isAddressOnly, loadCustomers }) => {
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const globalRedux = useSelector((state) => state.globalRedux);

	const initialGstTreatment = useMemo(() => editCustomer?.gstTreatment || GST_TREATMENT[0]?.value, [editCustomer]);
	const [gstTreatment, setGstTreatment] = React.useState(initialGstTreatment);
	const isConsumer = useMemo(() => gstTreatment === GST_TREATMENT[0]?.value, [gstTreatment]);

	useEffect(() => {
		if (editCustomer) {
			form.setFieldsValue({
				category: editCustomer?.category || 'Individual',
				displayName: editCustomer?.displayName,
				mobile: editCustomer?.mobile,
				secondaryMobile: editCustomer?.secondaryMobile,
				openingBalance: editCustomer?.openingBalance,
				email: editCustomer?.email,
				panCard: editCustomer?.panCard,
				aadharCard: editCustomer?.aadharCard,
				gstTreatment: initialGstTreatment,
				gstin: editCustomer?.gstin,
				placeOfSupply: editCustomer?.placeOfSupply || PLACE_OF_SUPPLY[0],
				addressLine1: editCustomer?.billingDetails?.[0]?.addressLine1,
				addressLine2: editCustomer?.billingDetails?.[0]?.addressLine2,
				city: editCustomer?.billingDetails?.[0]?.city,
				pincode: editCustomer?.billingDetails?.[0]?.pincode,
			});
			setGstTreatment(initialGstTreatment);
		} else {
			form.resetFields();
		}
	}, [editCustomer, form, initialGstTreatment]);

	const handleSubmit = (values) => {
		const data = {
			orgId: globalRedux?.selectedOrganization?.id,
			billingDetails: [
				{
					addressLine1: values?.addressLine1 || '',
					addressLine2: values?.addressLine2 || '',
					city: values?.city || '',
					pincode: values?.pincode || '',
				},
			],
		};

		if (!isAddressOnly) {
			Object.assign(data, {
				type: CUSTOMER_TYPE[0] || '',
				category: values?.category,
				displayName: values?.displayName || '',
				email: values?.email || '',
				mobile: values?.mobile || '',
				secondaryMobile: values?.secondaryMobile || '',
				panCard: values?.panCard || '',
				aadharCard: values?.aadharCard || '',
				gstTreatment: values?.gstTreatment || '',
				gstin: values?.gstin || '',
				openingBalance: values?.openingBalance || 0,
				placeOfSupply: values?.placeOfSupply || '',
			});
		}

		const url = `${SERVER_IP}customer/${editCustomer._id}?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(putApi(data, 'EDIT_CUSTOMER', url));
	};

	useEffect(() => {
		if (globalRedux.apiStatus.EDIT_CUSTOMER === API_STATUS.SUCCESS) {
			console.log("🚀 ~ useEffect ~ globalRedux.apiStatus.EDIT_CUSTOMER:", globalRedux.apiStatus.EDIT_CUSTOMER)
			loadCustomers();
			setShowAddressEditModal(false);
			dispatch(resetApiStatus('EDIT_CUSTOMER'));
		}
	}, [globalRedux.apiStatus.EDIT_CUSTOMER, loadCustomers, setShowAddressEditModal, dispatch]);

	const loading = globalRedux.apiStatus.EDIT_CUSTOMER === API_STATUS.PENDING;

	return (
		<Modal open={showAddressEditModal} onCancel={() => setShowAddressEditModal(false)} title="Modify Address" footer={null}>
			<Form
				form={form}
				name="edit-customer"
				labelAlign="left"
				onFinish={handleSubmit}
				initialValues={{
					category: 'Individual',
					gstTreatment: initialGstTreatment,
					placeOfSupply: PLACE_OF_SUPPLY[0],
				}}
				labelCol={{ span: 12 }}
				wrapperCol={{ span: 12 }}>
				{!isAddressOnly && (
					<>
						{/* Category */}
						<Form.Item label="Category" name="category" rules={[{ required: true, message: 'This Field is required!' }]}>
							<Select placeholder="Select category">
								{CATEGORIES.map((type) => (
									<Select.Option key={type} value={type}>
										{type}
									</Select.Option>
								))}
							</Select>
						</Form.Item>

						{/* Customer Details */}
						<Form.Item label="Customer Name" name="displayName" rules={[{ required: true, message: 'This Field is required!' }]}>
							<Input />
						</Form.Item>
						<Form.Item label="Primary Mobile" name="mobile" rules={[{ required: true, message: 'This Field is required!' }]}>
							<Input maxLength={10} placeholder="Primary Mobile" />
						</Form.Item>
						<Form.Item label="Secondary Mobile" name="secondaryMobile">
							<Input maxLength={10} placeholder="Secondary Mobile" />
						</Form.Item>
						<Form.Item label="Opening Balance" name="openingBalance">
							<InputNumber style={{ width: '100%' }} />
						</Form.Item>
						<Form.Item label="Email" name="email">
							<Input />
						</Form.Item>

						{/* GST Details */}
						<Form.Item label="GST Treatments" name="gstTreatment">
							<Select onChange={setGstTreatment} placeholder="Select GST treatment">
								{GST_TREATMENT.map((treatment) => (
									<Select.Option key={treatment.value} value={treatment.value}>
										{treatment.label}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item label="GSTIN" name="gstin" rules={[{ required: !isConsumer, message: 'This Field is required!' }]}>
							<Input disabled={isConsumer} />
						</Form.Item>

						{/* Location Details */}
						<Form.Item label="Place of Supply" name="placeOfSupply" rules={[{ required: true, message: 'This Field is required!' }]}>
							<Select placeholder="Place of Supply">
								{PLACE_OF_SUPPLY.map((type) => (
									<Select.Option key={type} value={type}>
										{type}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
					</>
				)}

				{/* Address Fields */}
				<Form.Item label="Address Line 1" name="addressLine1">
					<Input />
				</Form.Item>
				<Form.Item label="Address Line 2" name="addressLine2">
					<Input />
				</Form.Item>
				<Form.Item label="City" name="city">
					<Input />
				</Form.Item>
				<Form.Item label="Pincode" name="pincode">
					<Input />
				</Form.Item>

				{/* Actions */}
				<Form.Item
					wrapperCol={{
						offset: 0,
						span: 24,
					}}>
					<Row gutter={[10]}>
						<Col span={12}>
							<Button danger style={{ width: '100%' }} onClick={() => setShowAddressEditModal(false)}>
								Cancel
							</Button>
						</Col>
						<Col span={12}>
							<Button loading={loading} style={{ width: '100%' }} type="primary" htmlType="submit">
								{editCustomer ? 'Update' : 'Save'}
							</Button>
						</Col>
					</Row>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default AddressEditModal;
