import React, { useEffect } from 'react';
import { Row, Col, Input, Button, Divider, Form, Select, InputNumber } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { putApi } from 'redux/sagas/putApiSaga';
import { API_STATUS, CATEGORIES, CUSTOMER_TYPE, GST_TREATMENT, PLACE_OF_SUPPLY } from 'constants/app-constants';
import { SERVER_IP } from 'assets/Config';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';

const AddCustomer = ({ handleClose, editCustomer, setCustomerAddModal }) => {
	const [gstTreatment, setGstTreatment] = React.useState(GST_TREATMENT[0]?.value);
	const [form] = Form.useForm();
	const globalRedux = useSelector((state) => state.globalRedux);
	const dispatch = useDispatch();
	// const states = useSelector((state) => state.globalRedux?.states);

	const isConsumer = React.useMemo(() => gstTreatment === GST_TREATMENT[0]?.value, [gstTreatment]);

	useEffect(() => {
		isConsumer &&
			form.setFieldsValue({
				gstin: '',
			});
	}, [gstTreatment, form, isConsumer, editCustomer]);

	useEffect(() => {
		editCustomer &&
			form?.setFieldsValue({
				gstin: editCustomer?.gstin,
			});
		editCustomer && setGstTreatment(editCustomer?.gstTreatment);
	}, [editCustomer, form]);

	const handleSubmit = (values) => {
		let data = {
			orgId: globalRedux?.selectedOrganization?._id,
			customerType: values?.customerType || '',
			displayName: values?.displayName || '',
			email: values?.email || '',
			mobile: values?.mobile || '',
			secondaryMobile: values?.secondaryMobile || '',
			panCard: values?.panCard || '',
			aadharCard: values?.aadharCard || '',
			gstTreatment: values?.gstTreatment || '',
			gstin: values?.gstin || '',
			openingBalance: values?.openingBalance || 0,
			billingDetails: [
				{
					addressLine1: values?.addressLine1 || '',
					addressLine2: values?.addressLine2 || '',
					city: values?.city || '',
					pincode: values?.pincode || '',
				},
			],
			placeOfSupply: values?.placeOfSupply || '',
			remarks: values?.remarks || '',
		};

		if (!editCustomer) {
			dispatch(postApi(data, 'ADD_CUSTOMER'));
		} else {
			let url = `${SERVER_IP}customer/${editCustomer._id}?orgId=${globalRedux?.selectedOrganization?._id}`;
			dispatch(putApi(data, 'EDIT_CUSTOMER', url));
		}
	};

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_CUSTOMER === 'SUCCESS' || globalRedux.apiStatus.EDIT_CUSTOMER === 'SUCCESS') {
			dispatch(resetApiStatus(editCustomer ? 'EDIT_CUSTOMER' : 'ADD_CUSTOMER'));
			setCustomerAddModal(false);
			handleClose();
		}
	}, [globalRedux.apiStatus, editCustomer, handleClose, setCustomerAddModal, dispatch]);

	const layer1FormCol = {
		labelCol: {
			span: 12,
		},
		wrapperCol: {
			span: 12,
		},
	};

	const loading = globalRedux.apiStatus.ADD_CUSTOMER === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_CUSTOMER === API_STATUS.PENDING;

	return (
		<Row>
			<Col span={24}>
				<Row style={{ backgroundColor: '#fff', padding: '10px 0px' }}>
					<Col>
						<h6 style={{ marginBottom: '0px' }}>{editCustomer ? 'Edit' : 'New'} Customer</h6>
					</Col>
				</Row>
				<Divider />
				<Row style={{ marginTop: 0 }}>
					<Form
						name="add-customer"
						className="required_in_right"
						style={{ width: '100%' }}
						colon={false}
						labelAlign="left"
						form={form}
						initialValues={{
							customerType: editCustomer?.customerType || 'Individual',
						}}
						onFinish={handleSubmit}
						{...layer1FormCol}>
						<Form.Item
							label="Customer Type"
							name="customerType"
							initialValue={editCustomer?.customerType}
							rules={[
								{
									required: true,
									message: 'This Field is required!',
								},
							]}>
							<Select placeholder="Select Customer type">
								{CUSTOMER_TYPE.map((type) => (
									<Select.Option key={type} value={type}>
										{type}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item
							label="Category"
							name="type"
							initialValue={editCustomer?.type}
							rules={[
								{
									required: true,
									message: 'This Field is required!',
								},
							]}>
							<Select placeholder="select category">
								{CATEGORIES.map((type) => (
									<Select.Option key={type} value={type}>
										{type}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item
							label="Display Name"
							name="displayName"
							initialValue={editCustomer?.displayName}
							rules={[
								{
									required: true,
									message: 'This Field is required!',
								},
							]}>
							<Input />
						</Form.Item>
						<Form.Item
							label="Primary Mobile"
							name="mobile"
							initialValue={editCustomer?.mobile}
							rules={[
								{
									required: true,
									message: 'This Field is required!',
								},
							]}>
							<Input maxLength={10} placeholder='Primary Mobile' />
						</Form.Item>
						<Form.Item
							label="Secondary Mobile"
							name="secondaryMobile"
							initialValue={editCustomer?.secondaryMobile}
							rules={[
								{
									required: false,
									message: 'This Field is required!',
								},
							]}>
							<Input maxLength={10} placeholder='Secondary Mobile' />
						</Form.Item>
						<Form.Item label="Opening Balance" name="openingBalance" initialValue={editCustomer?.openingBalance}>
							<InputNumber style={{ width: '100%' }} />
						</Form.Item>
						<Form.Item label="Email" name="email" initialValue={editCustomer?.email}>
							<Input />
						</Form.Item>
						{/* <Form.Item label="Pan Card" name="panCard" initialValue={editCustomer?.panCard}>
							<Input />
						</Form.Item>
						<Form.Item label="Aadhar Card" name="aadharCard" initialValue={editCustomer?.aadharCard}>
							<Input />
						</Form.Item> */}
						<Form.Item label="GST Treatments" name="gstTreatment" initialValue={editCustomer?.gstTreatment || gstTreatment}>
							<Select onChange={(e) => setGstTreatment(e)} placeholder="select gst treatment">
								{GST_TREATMENT.map((treatment) => (
									<Select.Option key={treatment?.value} value={treatment?.value}>
										{treatment?.label}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item
							label="GSTIN"
							name="gstin"
							rules={[
								{
									required: !isConsumer,
									message: 'This Field is required!',
								},
							]}
							initialValue={editCustomer?.gstin}>
							<Input disabled={isConsumer} />
						</Form.Item>
						<Form.Item
							label="Place of Supply"
							name="placeOfSupply"
							initialValue={editCustomer?.placeOfSupply || PLACE_OF_SUPPLY[0]}
							rules={[
								{
									required: true,
									message: 'This Field is required!',
								},
							]}>
							<Select placeholder="Place of Supply">
								{PLACE_OF_SUPPLY.map((type) => (
									<Select.Option key={type} value={type}>
										{type}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item
							label="Address Line 1"
							name="addressLine1"
							rules={[
								{
									required: true,
									message: 'This Field is required!',
								},
							]}
							initialValue={editCustomer?.billingDetails?.[0]?.addressLine1}>
							<Input />
						</Form.Item>
						<Form.Item
							label="Address Line 2"
							rules={[
								{
									required: true,
									message: 'This Field is required!',
								},
							]}
							name="addressLine2"
							initialValue={editCustomer?.billingDetails?.[0]?.addressLine2}>
							<Input />
						</Form.Item>
						<Form.Item label="City" name="city" initialValue={editCustomer?.billingDetails?.[0]?.city}>
							<Input />
						</Form.Item>
						<Form.Item label="Pincode" name="pincode" initialValue={editCustomer?.billingDetails?.[0]?.pincode}>
							<Input />
						</Form.Item>
						{/* <Form.Item label="Country" name="country" initialValue={editCustomer?.country}>
						<Input />
					</Form.Item> */}
						<Form.Item label="Remarks" name="remarks" initialValue={editCustomer?.remarks}>
							<Input.TextArea />
						</Form.Item>
						<Form.Item
							wrapperCol={{
								offset: 0,
								span: 24,
							}}>
							<Row className="space-between" style={{ paddingTop: 20, width: '100%', margin: 0 }}>
								<Button danger style={{ width: '49%' }} onClick={() => setCustomerAddModal(false)}>
									Cancel
								</Button>
								<Button loading={loading} style={{ width: '49%' }} type="primary" htmlType="submit">
									{editCustomer ? 'Update' : 'Save'}
								</Button>
							</Row>
						</Form.Item>
					</Form>
				</Row>
			</Col>
		</Row>
	);
};

export default AddCustomer;
