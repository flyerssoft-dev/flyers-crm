import React, { useEffect, useMemo, useState } from 'react';
import { Row, Input, Button, Form, Select, InputNumber, Drawer, Checkbox, Col, Skeleton } from 'antd';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { putApi } from 'redux/sagas/putApiSaga';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { API_STATUS, CATEGORIES, CUSTOMER_TYPE, GST_TREATMENT, PLACE_OF_SUPPLY } from 'constants/app-constants';
import { SERVER_IP } from 'assets/Config';
import './AddCustomer.scss';

const AddCustomer = ({ customerAddModal, width = '60%', editCustomer, setCustomerAddModal, refreshList, handleClose }) => {
	const [gstTreatment, setGstTreatment] = useState(GST_TREATMENT[0]?.value);
	const [copyBillingToShipping, setCopyBillingToShipping] = useState(false); // Default set to false
	const [form] = Form.useForm();
	const globalRedux = useSelector((state) => state.globalRedux);
	const dispatch = useDispatch();
	const [countries, setCountries] = useState([]);
	const [billingStates, setBillingStates] = useState([]);
	const [shippingStates, setShippingStates] = useState([]);
	const [loadingCountries, setLoadingCountries] = useState(false);
	const [loadingStates, setLoadingStates] = useState(false);
	const billingAddress1 = Form.useWatch('addressLine1', form);
	const billingAddress2 = Form.useWatch('addressLine2', form);
	const billingCity = Form.useWatch('city', form);
	const billingPincode = Form.useWatch('pincode', form);

	const isConsumer = useMemo(() => gstTreatment === GST_TREATMENT[0]?.value, [gstTreatment]);

	useEffect(() => {
		const fetchCountries = async () => {
			setLoadingCountries(true);
			try {
				const res = await axios.get('https://countriesnow.space/api/v0.1/countries/positions');
				const countryList = res.data.data.map((item) => item.name);
				setCountries(countryList);
			} catch (err) {
				console.error('Failed to fetch countries', err);
			} finally {
				setLoadingCountries(false);
			}
		};

		fetchCountries();
	}, []);

	// Fetch states based on selected country
	const fetchStates = async (country, type = 'billing') => {
		setLoadingStates(true);
		try {
			const res = await axios.post('https://countriesnow.space/api/v0.1/countries/states', {
				country,
			});
			const stateList = res.data.data.states.map((s) => s.name);
			if (type === 'billing') {
				setBillingStates(stateList);
			} else {
				setShippingStates(stateList);
			}
		} catch (err) {
			console.error('Failed to fetch states', err);
		} finally {
			setLoadingStates(false);
		}
	};

	const handleCountryChange = (value, addressType) => {
		form.setFieldsValue({ [`${addressType}Country`]: value });
		fetchStates(value, addressType);
		form.setFieldsValue({
			[`${addressType}State`]: '', // Reset state when country changes
		});
	};

	useEffect(() => {
		if (customerAddModal) {
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
					gstTreatment: editCustomer?.gstTreatment || GST_TREATMENT[0]?.value,
					gstin: editCustomer?.gstin,
					placeOfSupply: editCustomer?.placeOfSupply || PLACE_OF_SUPPLY[0],
					addressLine1: editCustomer?.billingDetails?.[0]?.addressLine1,
					addressLine2: editCustomer?.billingDetails?.[0]?.addressLine2,
					city: editCustomer?.billingDetails?.[0]?.city,
					pincode: editCustomer?.billingDetails?.[0]?.pincode,
					shippingAddressLine1: editCustomer?.shippingDetails?.[0]?.addressLine1,
					shippingAddressLine2: editCustomer?.shippingDetails?.[0]?.addressLine2,
					shippingCity: editCustomer?.shippingDetails?.[0]?.city,
					shippingPincode: editCustomer?.shippingDetails?.[0]?.pincode,
					remarks: editCustomer?.remarks || '',
					billingState: editCustomer?.billingDetails?.[0]?.state || 'Tamil Nadu',
					shippingState: editCustomer?.shippingDetails?.[0]?.state || 'Tamil Nadu',
					billingCountry: 'India', // Default for India
					shippingCountry: 'India', // Default for India
				});
				setGstTreatment(editCustomer?.gstTreatment);
				fetchStates('India', 'billing');
				fetchStates('India', 'shipping');
			} else {
				form.resetFields();
				form.setFieldsValue({
					category: 'Individual',
					gstTreatment: GST_TREATMENT[0]?.value,
					placeOfSupply: PLACE_OF_SUPPLY[0],
					billingDetails: {},
					shippingDetails: {},
					billingCountry: 'India',
					billingState: 'Tamil Nadu',
					shippingCountry: 'India',
					shippingState: 'Tamil Nadu',
				});
				setGstTreatment(GST_TREATMENT[0]?.value);
				setCopyBillingToShipping(false);
				fetchStates('India', 'billing');
				fetchStates('India', 'shipping');
			}
		}
	}, [customerAddModal, editCustomer]);

	useEffect(() => {
		if (isConsumer) {
			form.setFieldsValue({ gstin: '' });
		}
	}, [isConsumer, form]);

	const handleSubmit = (values) => {
		const data = {
			orgId: globalRedux?.selectedOrganization?.id,
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
			billingDetails: [
				{
					addressLine1: values?.addressLine1 || '',
					addressLine2: values?.addressLine2 || '',
					city: values?.city || '',
					pincode: values?.pincode || '',
					country: values?.billingCountry || '',
					state: values?.billingState || '',
				},
			],
			shippingDetails: [
				{
					addressLine1: values?.shippingAddressLine1 || '',
					addressLine2: values?.shippingAddressLine2 || '',
					city: values?.shippingCity || '',
					pincode: values?.shippingPincode || '',
					country: values?.shippingCountry || '',
					state: values?.shippingState || '',
				},
			],
			placeOfSupply: values?.placeOfSupply || '',
			remarks: values?.remarks || '',
		};

		if (editCustomer) {
			const url = `${SERVER_IP}customer/${editCustomer._id}?orgId=${globalRedux?.selectedOrganization?.id}`;
			dispatch(putApi(data, 'EDIT_CUSTOMER', url));
		} else {
			dispatch(postApi(data, 'ADD_CUSTOMER'));
		}
	};

	useEffect(() => {
		const { ADD_CUSTOMER, EDIT_CUSTOMER } = globalRedux.apiStatus;

		if (ADD_CUSTOMER === 'SUCCESS' || EDIT_CUSTOMER === 'SUCCESS') {
			dispatch(resetApiStatus(editCustomer ? 'EDIT_CUSTOMER' : 'ADD_CUSTOMER'));
			refreshList?.();
			handleClose?.();
			form.resetFields();
		}
	}, [globalRedux.apiStatus, dispatch, form, refreshList]);

	const layer1FormCol = {
		labelCol: { span: 12 },
		wrapperCol: { span: 12 },
	};

	const loading = globalRedux.apiStatus.ADD_CUSTOMER === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_CUSTOMER === API_STATUS.PENDING;

	useEffect(() => {
		if (copyBillingToShipping) {
			const billingDetails = form.getFieldValue('billingDetails') || {};
			form.setFieldsValue({
				shippingAddressLine1: form.getFieldValue('addressLine1') || billingDetails.addressLine1,
				shippingAddressLine2: form.getFieldValue('addressLine2') || billingDetails.addressLine2,
				shippingCity: form.getFieldValue('city') || billingDetails.city,
				shippingPincode: form.getFieldValue('pincode') || billingDetails.pincode,
			});
		} else {
			form.setFieldsValue({
				shippingAddressLine1: '',
				shippingAddressLine2: '',
				shippingCity: '',
				shippingPincode: '',
			});
		}
	}, [copyBillingToShipping, form]);

	const hasBillingAddress = billingAddress1 && billingAddress2 && billingCity && billingPincode;

	return (
		<Drawer
			placement="right"
			title={`${editCustomer ? 'Edit' : 'New'} Customer`}
			width={width}
			open={customerAddModal}
			closable
			destroyOnHidden
			onClose={() => {
				form.resetFields();
				setCustomerAddModal(false);
				setCopyBillingToShipping(false); // Keep default as false
			}}>
			<Row>
				<Form form={form} name="add-customer" className="required_in_right" style={{ width: '100%' }} labelAlign="left" onFinish={handleSubmit} {...layer1FormCol} scrollToFirstError={{ behavior: 'smooth', block: 'center', inline: 'center' }}>
					<Row gutter={24} style={{ marginTop: 20 }}>
						<Col span={12}>
							<Form.Item label="Category" name="category" rules={[{ required: true, message: 'This Field is required!' }]}>
								<Select placeholder="Select category">
									{CATEGORIES.map((type) => (
										<Select.Option key={type} value={type}>
											{type}
										</Select.Option>
									))}
								</Select>
							</Form.Item>

							<Form.Item label="Customer Name" name="displayName" rules={[{ required: true, message: 'This Field is required!' }]}>
								<Input placeholder="Enter customer name" />
							</Form.Item>

							<Form.Item label="Primary Mobile" name="mobile" rules={[{ required: true, message: 'This Field is required!' }]}>
								<Input maxLength={10} placeholder="Enter primary mobile" />
							</Form.Item>

							<Form.Item label="Secondary Mobile" name="secondaryMobile">
								<Input maxLength={10} placeholder="Enter secondary mobile (Optional)" />
							</Form.Item>

							<Form.Item label="Opening Balance" name="openingBalance">
								<InputNumber style={{ width: '100%' }} placeholder="Enter opening balance" />
							</Form.Item>

							<Form.Item
								label="Email"
								name="email"
								rules={[
									{ required: true, message: 'This Field is required!' },
									{ type: 'email', message: 'Please enter a valid email address!' },
								]}>
								<Input placeholder="Enter email address" />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item label="GST Treatments" name="gstTreatment">
								<Select onChange={(value) => setGstTreatment(value)} placeholder="Select GST treatment">
									{GST_TREATMENT.map((t) => (
										<Select.Option key={t.value} value={t.value}>
											{t.label}
										</Select.Option>
									))}
								</Select>
							</Form.Item>

							<Form.Item
								label="GSTIN"
								name="gstin"
								rules={[
									{ required: true, message: 'Please enter your GSTIN' },
									{ len: 15, message: 'GSTIN must be 15 characters' },
								]}>
								<Input disabled={isConsumer} placeholder="Enter GSTIN" maxLength={15} />
							</Form.Item>

							<Form.Item label="Place of Supply" name="placeOfSupply" rules={[{ required: true, message: 'This Field is required!' }]}>
								<Select placeholder="Select place of supply">
									{PLACE_OF_SUPPLY.map((type) => (
										<Select.Option key={type} value={type}>
											{type}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={24} style={{ marginTop: 20 }}>
						{/* Billing Address */}
						<Col span={12}>
							<div className="address-section">
								<h4>Billing Address</h4>
								<Form.Item label="Address Line 1" name="addressLine1" rules={[{ required: true, message: 'This Field is required!' }]}>
									<Input.TextArea placeholder="Enter address line 1" />
								</Form.Item>

								<Form.Item label="Address Line 2" name="addressLine2" rules={[{ required: true, message: 'This Field is required!' }]}>
									<Input.TextArea placeholder="Enter address line 2" />
								</Form.Item>

								<Form.Item label="City" name="city">
									<Input placeholder="Enter city" />
								</Form.Item>

								<Form.Item label="Pincode" name="pincode">
									<Input placeholder="Enter pincode" />
								</Form.Item>

								<Form.Item label="State" name="billingState" rules={[{ required: true, message: 'Please select state' }]}>
									<Select showSearch loading={loadingStates} placeholder="Select state" onChange={(value) => form.setFieldsValue({ billingState: value })}>
										{billingStates.map((state) => (
											<Select.Option key={state} value={state}>
												{state}
											</Select.Option>
										))}
									</Select>
								</Form.Item>

								<Form.Item label="Country" name="billingCountry" rules={[{ required: true, message: 'Please select country' }]}>
									<Select showSearch loading={loadingCountries} placeholder="Select country" onChange={(value) => handleCountryChange(value, 'billing')}>
										{countries.map((country) => (
											<Select.Option key={country} value={country}>
												{country}
											</Select.Option>
										))}
									</Select>
								</Form.Item>
							</div>
						</Col>

						{/* Shipping Address */}
						<Col span={12}>
							<div className="address-section">
								<h4>
									Shipping Address{' '}
									{hasBillingAddress && (
										<Checkbox style={{ float: 'right' }} checked={copyBillingToShipping} onChange={() => setCopyBillingToShipping(!copyBillingToShipping)}>
											Copy billing address
										</Checkbox>
									)}
								</h4>

								<Form.Item label="Shipping Address Line 1" name="shippingAddressLine1" rules={[{ required: true, message: 'This Field is required!' }]}>
									<Input.TextArea placeholder="Enter shipping address line 1" />
								</Form.Item>

								<Form.Item label="Shipping Address Line 2" name="shippingAddressLine2" rules={[{ required: true, message: 'This Field is required!' }]}>
									<Input.TextArea placeholder="Enter shipping address line 2" />
								</Form.Item>

								<Form.Item label="Shipping City" name="shippingCity">
									<Input placeholder="Enter shipping city" />
								</Form.Item>

								<Form.Item label="Shipping Pincode" name="shippingPincode">
									<Input placeholder="Enter shipping pincode" />
								</Form.Item>

								<Form.Item label="State" name="shippingState" rules={[{ required: true, message: 'Please select state' }]}>
									<Select showSearch loading={loadingStates} placeholder="Select state" onChange={(value) => form.setFieldsValue({ shippingState: value })}>
										{shippingStates.map((state) => (
											<Select.Option key={state} value={state}>
												{state}
											</Select.Option>
										))}
									</Select>
								</Form.Item>

								<Form.Item label="Country" name="shippingCountry" rules={[{ required: true, message: 'Please select country' }]}>
									<Select showSearch loading={loadingCountries} placeholder="Select country" onChange={(value) => handleCountryChange(value, 'shipping')}>
										{countries.map((country) => (
											<Select.Option key={country} value={country}>
												{country}
											</Select.Option>
										))}
									</Select>
								</Form.Item>
							</div>
						</Col>
					</Row>

					<Row gutter={24} style={{ marginTop: 20 }}>
						<Col span={12}>
							<Form.Item label="Remarks" name="remarks" style={{ marginTop: 10 }}>
								<Input.TextArea placeholder="Enter remarks (Optional)" />
							</Form.Item>
						</Col>
					</Row>

					<Form.Item wrapperCol={{ offset: 0, span: 24 }}>
						<Row className="space-between" style={{ paddingTop: 20, width: '100%', margin: 0 }}>
							<Button
								danger
								style={{ width: '49%' }}
								onClick={() => {
									form.resetFields();
									setCustomerAddModal(false);
								}}>
								Cancel
							</Button>
							<Button loading={loading} style={{ width: '49%' }} type="primary" htmlType="submit">
								{editCustomer ? 'Update' : 'Save'}
							</Button>
						</Row>
					</Form.Item>
				</Form>
			</Row>
		</Drawer>
	);
};

export default AddCustomer;
