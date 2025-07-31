import React, { useEffect } from 'react';
import { Row, Col, Input, Button, Divider, Form, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { putApi } from 'redux/sagas/putApiSaga';
import { API_STATUS, GST_TREATMENT } from 'constants/app-constants';
import { SERVER_IP } from 'assets/Config';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';

const AddItem = ({ handleClose, editItem, setItemAddModal }) => {
	const [gstTreatment, setGstTreatment] = React.useState(GST_TREATMENT[0]?.value);
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const globalRedux = useSelector((state) => state.globalRedux);
	// const states = useSelector((state) => state.globalRedux?.states);

	const isConsumer = React.useMemo(() => gstTreatment === GST_TREATMENT[0]?.value, [gstTreatment]);

	useEffect(() => {
		isConsumer &&
			form.setFieldsValue({
				gstin: '',
			});

		editItem && setGstTreatment(editItem?.gstTreatment);
	}, [gstTreatment, form, isConsumer, editItem]);

	useEffect(() => {
		editItem &&
			form?.setFieldsValue({
				gstin: editItem?.gstin,
			});
	}, [editItem, form]);

	const handleSubmit = (values) => {
		let data = {
			orgId: globalRedux?.selectedOrganization?.id,
			customerType: values?.customerType || '',
			displayName: values?.displayName || '',
			email: values?.email || '',
			mobile: values?.mobile || '',
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

		if (!editItem) {
			dispatch(postApi(data, 'ADD_CUSTOMER'));
		} else {
			let url = `${SERVER_IP}customer/${editItem._id}?orgId=${globalRedux?.selectedOrganization?.id}`;
			dispatch(putApi(data, 'EDIT_CUSTOMER', url));
		}
	};

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_CUSTOMER === 'SUCCESS' || globalRedux.apiStatus.EDIT_CUSTOMER === 'SUCCESS') {
			dispatch(resetApiStatus(editItem ? 'EDIT_CUSTOMER' : 'ADD_CUSTOMER'));
			setItemAddModal(false);
			handleClose();
		}
	}, [globalRedux.apiStatus, editItem, handleClose, setItemAddModal, dispatch]);

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
						<h6 style={{ marginBottom: '0px' }}>{editItem ? 'Edit' : 'New'} Item</h6>
					</Col>
				</Row>
				<Divider />
				<Row style={{ marginTop: 0 }}>
					<Col span={24}>
						<Form
							name="add-customer"
							className="required_in_right"
							style={{ width: '100%' }}
							colon={false}
							labelAlign="left"
							form={form}
							initialValues={{
								customerType: editItem?.customerType || 'Individual',
							}}
							onFinish={handleSubmit}
							{...layer1FormCol}>
							<Form.Item
								label="Goods/Service"
								name="itemType"
								rules={[
									{
										required: true,
										message: 'This Field is Required!',
									},
								]}>
								<Select placeholder="Select">
									<Select.Option value="Goods">Goods</Select.Option>
									<Select.Option value="Services">Service</Select.Option>
								</Select>
							</Form.Item>
							<Form.Item
								label="Item Code"
								name="itemCode"
								rules={[
									{
										required: true,
										message: 'This Field is Required!',
									},
								]}>
								<Input />
							</Form.Item>
							<Form.Item
								label="Item Name"
								name="itemName"
								rules={[
									{
										required: true,
										message: 'This Field is Required!',
									},
								]}>
								<Input />
							</Form.Item>
							<Form.Item
								label="Print Name"
								name="printName"
								rules={[
									{
										required: true,
										message: 'This Field is Required!',
									},
								]}>
								<Input />
							</Form.Item>
							<Form.Item
								label="Hsn/Sac Code"
								name="hsnSac"
								rules={[
									{
										required: true,
										message: 'This Field is Required!',
									},
								]}>
								<Input />
							</Form.Item>

							<Form.Item
								label="MRP"
								name="mrp"
								rules={[
									{
										required: true,
										message: 'This Field is Required!',
									},
								]}>
								<Input />
							</Form.Item>
							<Form.Item
								label="Selling Price"
								name="sellingPrice"
								rules={[
									{
										required: true,
										message: 'This Field is Required!',
									},
								]}>
								<Input />
							</Form.Item>
							<Form.Item
								label="Unit"
								name="unitName"
								rules={[
									{
										required: true,
										message: 'This Field is Required!',
									},
								]}>
								<Select placeholder="Select">
									<Select.Option value="nos">Nos</Select.Option>
									<Select.Option value="m3">M3</Select.Option>
									<Select.Option value="pcs">Pcs</Select.Option>
								</Select>
							</Form.Item>
							<Form.Item
								label="GST"
								name="taxRate"
								rules={[
									{
										required: true,
										message: 'This Field is Required!',
									},
								]}>
								<Select placeholder="Select">
									<Select.Option value="0">GST 0%</Select.Option>
									<Select.Option value="5">GST 5%</Select.Option>
									<Select.Option value="12">GST 12%</Select.Option>
									<Select.Option value="18">GST 18%</Select.Option>
									<Select.Option value="28">GST 28%</Select.Option>
								</Select>
							</Form.Item>
							<Form.Item
								label="Serial"
								name="isSerial"
								rules={[
									{
										required: true,
										message: 'This Field is Required!',
									},
								]}>
								<Select placeholder="Select">
									<Select.Option value={true}>Yes</Select.Option>
									<Select.Option value={false}>No</Select.Option>
								</Select>
							</Form.Item>
							<Form.Item
								wrapperCol={{
									offset: 0,
									span: 16,
								}}>
								<Row className="space-between" style={{ paddingTop: 20, width: '100%', margin: 0 }}>
									<Button danger style={{ width: '49%' }} onClick={() => setItemAddModal(false)}>
										Cancel
									</Button>
									<Button loading={loading} style={{ width: '49%' }} type="primary" htmlType="submit">
										{editItem ? 'Update' : 'Save'}
									</Button>
								</Row>
							</Form.Item>
						</Form>
					</Col>
				</Row>
			</Col>
		</Row>
	);
};

export default AddItem;
