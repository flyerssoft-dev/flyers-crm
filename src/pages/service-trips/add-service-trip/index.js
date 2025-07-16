import React, { useEffect } from 'react';
import { Row, Col, Input, Button, Form, Select, InputNumber, Drawer } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { putApi } from 'redux/sagas/putApiSaga';
import { API_STATUS, CATEGORIES, CUSTOMER_TYPE, GST_TREATMENT, PLACE_OF_SUPPLY } from 'constants/app-constants';
import { SERVER_IP } from 'assets/Config';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';

const AddCustomer = ({ customerAddModal, width = '40%', editCustomer, setCustomerAddModal, refreshList, handleClose }) => {
	const [gstTreatment, setGstTreatment] = React.useState(GST_TREATMENT[0]?.value);
	const [form] = Form.useForm();
	const globalRedux = useSelector((state) => state.globalRedux);
	const dispatch = useDispatch();

	const isConsumer = React.useMemo(() => gstTreatment === GST_TREATMENT[0]?.value, [gstTreatment]);

	useEffect(() => {
		isConsumer &&
			form.setFieldsValue({
				gstin: '',
			});
	}, [gstTreatment, form, isConsumer]);

	useEffect(() => {
		if (editCustomer) {
			form.setFieldsValue({
				// type: editCustomer?.type || 'Contact',
				category: editCustomer?.category || 'Individual',
				displayName: editCustomer?.displayName,
				mobile: editCustomer?.mobile,
				secondaryMobile: editCustomer?.secondaryMobile,
				openingBalance: editCustomer?.openingBalance,
				email: editCustomer?.email,
				panCard: editCustomer?.panCard,
				aadharCard: editCustomer?.aadharCard,
				gstTreatment: editCustomer?.gstTreatment || GST_TREATMENT[0]?.value,
				gstin: editCustomer?.gstin,
				placeOfSupply: editCustomer?.placeOfSupply || PLACE_OF_SUPPLY[0],
				addressLine1: editCustomer?.billingDetails?.[0]?.addressLine1,
				addressLine2: editCustomer?.billingDetails?.[0]?.addressLine2,
				city: editCustomer?.billingDetails?.[0]?.city,
				pincode: editCustomer?.billingDetails?.[0]?.pincode,
			});
		} else {
			form?.resetFields();
		}
	}, [editCustomer, form]);

	useEffect(() => {
		if (editCustomer) {
			form?.setFieldsValue({
				gstin: editCustomer?.gstin,
			});
			setGstTreatment(editCustomer?.gstTreatment);
		}
	}, [editCustomer, form]);

	// useEffect(() => {
	// 	!customerAddModal && form?.resetFields();
	// }, [customerAddModal, form]);

	const handleSubmit = (values) => {
		let data = {
			orgId: globalRedux?.selectedOrganization?._id,
			type: CUSTOMER_TYPE[0] || '',
			// type: values?.type || '',
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
			refreshList?.();
			handleClose?.();
			form?.resetFields();
		}
	}, [globalRedux.apiStatus, editCustomer, setCustomerAddModal, dispatch, refreshList, handleClose, form]);

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
		<Drawer
			placement="right"
			title={`${editCustomer ? 'Edit' : 'New'} Customer`}
			width={width || '40%'}
			open={customerAddModal}
			closable
			onClose={() => setCustomerAddModal(false)}
			destroyOnHidden={true}>
			<Row>
				<Col span={24}>
					{/* <Row style={{ backgroundColor: '#fff', padding: '10px 0px' }}>
						<Col>
							<h6 style={{ marginBottom: '0px' }}>{editCustomer ? 'Edit' : 'New'} Customer</h6>
						</Col>
					</Row>
					<Divider /> */}
					<Row style={{ marginTop: 0 }}>
						<Form
							name="add-customer"
							className="required_in_right"
							style={{ width: '100%' }}
							colon={false}
							labelAlign="left"
							form={form}
							onFinish={handleSubmit}
							initialValues={{
								// type: 'Contact',
								category: 'Individual',
								gstTreatment,
								placeOfSupply: PLACE_OF_SUPPLY[0],
							}}
							{...layer1FormCol}>
							{/* <Form.Item
								label="Contact Type"
								name="type"
								initialValue={editCustomer?.type}
								rules={[
									{
										required: true,
										message: 'This Field is required!',
									},
								]}>
								<Select placeholder="select customer type">
									{CUSTOMER_TYPE.map((type) => (
										<Select.Option key={type} value={type}>
											{type}
										</Select.Option>
									))}
								</Select>
							</Form.Item> */}
							<Form.Item
								label="Category"
								name="category"
								initialValue={editCustomer?.category}
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
								rules={[
									{
										required: false,
										message: 'This Field is required!',
									},
								]}>
								<Input maxLength={10} placeholder='Secondary Mobile' />
							</Form.Item>
							<Form.Item label="Opening Balance" name="openingBalance">
								<InputNumber style={{ width: '100%' }} />
							</Form.Item>
							<Form.Item label="Email" name="email">
								<Input />
							</Form.Item>
							<Form.Item label="Pan Card" name="panCard">
								<Input />
							</Form.Item>
							<Form.Item label="Aadhar Card" name="aadharCard">
								<Input />
							</Form.Item>
							<Form.Item label="GST Treatments" name="gstTreatment">
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
								]}>
								<Input disabled={isConsumer} />
							</Form.Item>
							<Form.Item
								label="Place of Supply"
								name="placeOfSupply"
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
										required: false,
										message: 'This Field is required!',
									},
								]}>
								<Input />
							</Form.Item>
							<Form.Item
								label="Address Line 2"
								rules={[
									{
										required: false,
										message: 'This Field is required!',
									},
								]}
								name="addressLine2">
								<Input />
							</Form.Item>
							<Form.Item label="City" name="city">
								<Input />
							</Form.Item>
							<Form.Item label="Pincode" name="pincode">
								<Input />
							</Form.Item>
							<Form.Item label="Remarks" name="remarks">
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
		</Drawer>
	);
};

export default AddCustomer;
