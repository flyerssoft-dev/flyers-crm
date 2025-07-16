import React, { useEffect } from 'react';
import { Row, Col, Input, Button, Form, Select, InputNumber, Drawer } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { putApi } from 'redux/sagas/putApiSaga';
import { API_STATUS, CATEGORIES, CUSTOMER_TYPE, GST_TREATMENT, PLACE_OF_SUPPLY } from 'constants/app-constants';
import { SERVER_IP } from 'assets/Config';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';

const AddSupplier = ({ supplierAddModal, width = '40%', editSupplier, setSupplierAddModal, refreshList, handleClose }) => {
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
		if (editSupplier) {
			form.setFieldsValue({
				// type: editSupplier?.type || 'Contact',
				category: editSupplier?.category || 'Individual',
				displayName: editSupplier?.displayName,
				mobile: editSupplier?.mobile,
				secondaryMobile: editSupplier?.secondaryMobile,
				openingBalance: editSupplier?.openingBalance,
				email: editSupplier?.email,
				panCard: editSupplier?.panCard,
				aadharCard: editSupplier?.aadharCard,
				gstTreatment: editSupplier?.gstTreatment || GST_TREATMENT[0]?.value,
				gstin: editSupplier?.gstin,
				placeOfSupply: editSupplier?.placeOfSupply || PLACE_OF_SUPPLY[0],
				addressLine1: editSupplier?.billingDetails?.[0]?.addressLine1,
				addressLine2: editSupplier?.billingDetails?.[0]?.addressLine2,
				city: editSupplier?.billingDetails?.[0]?.city,
				pincode: editSupplier?.billingDetails?.[0]?.pincode,
			});
		} else {
			form?.resetFields();
		}
	}, [editSupplier, form]);

	useEffect(() => {
		if (editSupplier) {
			form?.setFieldsValue({
				gstin: editSupplier?.gstin,
			});
			setGstTreatment(editSupplier?.gstTreatment);
		}
	}, [editSupplier, form]);

	// useEffect(() => {
	// 	!supplierAddModal && form?.resetFields();
	// }, [supplierAddModal, form]);

	const handleSubmit = (values) => {
		let data = {
			orgId: globalRedux?.selectedOrganization?._id,
			type: CUSTOMER_TYPE[1] || '',
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

		if (!editSupplier) {
			dispatch(postApi(data, 'ADD_CUSTOMER'));
		} else {
			let url = `${SERVER_IP}customer/${editSupplier._id}?orgId=${globalRedux?.selectedOrganization?._id}`;
			dispatch(putApi(data, 'EDIT_CUSTOMER', url));
		}
	};

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_CUSTOMER === 'SUCCESS' || globalRedux.apiStatus.EDIT_CUSTOMER === 'SUCCESS') {
			dispatch(resetApiStatus(editSupplier ? 'EDIT_CUSTOMER' : 'ADD_CUSTOMER'));
			refreshList?.();
			handleClose?.();
			form?.resetFields();
		}
	}, [globalRedux.apiStatus, editSupplier, setSupplierAddModal, dispatch, refreshList, handleClose, form]);

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
			title={`${editSupplier ? 'Edit' : 'New'} Supplier`}
			width={width || '40%'}
			open={supplierAddModal}
			closable
			onClose={() => setSupplierAddModal(false)}
			destroyOnHidden={true}>
			<Row>
				<Col span={24}>
					{/* <Row style={{ backgroundColor: '#fff', padding: '10px 0px' }}>
						<Col>
							<h6 style={{ marginBottom: '0px' }}>{editSupplier ? 'Edit' : 'New'} Supplier</h6>
						</Col>
					</Row>
					<Divider /> */}
					<Row style={{ marginTop: 0 }}>
						<Form
							name="add-supplier"
							className="required_in_right"
							style={{ width: '100%' }}
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
								initialValue={editSupplier?.type}
								rules={[
									{
										required: true,
										message: 'This Field is required!',
									},
								]}>
								<Select placeholder="select supplier type">
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
								initialValue={editSupplier?.category}
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
									<Button danger style={{ width: '49%' }} onClick={() => setSupplierAddModal(false)}>
										Cancel
									</Button>
									<Button loading={loading} style={{ width: '49%' }} type="primary" htmlType="submit">
										{editSupplier ? 'Update' : 'Save'}
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

export default AddSupplier;
