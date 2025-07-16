import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Col, Select, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import InputMask from 'react-input-mask';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useDispatch, useSelector } from 'react-redux';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { postApi } from 'redux/sagas/postApiDataSaga';

const { Option } = Select;
const CACHE_EXPIRY = 1000 * 60 * 60 * 24; // 24 hours

const gstinStateCodes = {
	'Tamil Nadu': '33',
	Kerala: '32',
	Karnataka: '29',
	'Andhra Pradesh': '37',
	Telangana: '36',
	Maharashtra: '27',
	Delhi: '07',
	Gujarat: '24',
	Rajasthan: '08',
	'Uttar Pradesh': '09',
	'Madhya Pradesh': '23',
	Punjab: '03',
	Haryana: '06',
	Bihar: '10',
	'West Bengal': '19',
};

const getCache = (key) => {
	try {
		const cached = JSON.parse(localStorage.getItem(key));
		if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
			return cached.data;
		}
	} catch (e) {}
	return null;
};

const setCache = (key, data) => {
	localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
};

const AddOrganization = ({ refreshList, closeModal }) => {
	const dispatch = useDispatch();
	const globalRedux = useSelector((state) => state.globalRedux);
	const [form] = Form.useForm();

	const [countries, setCountries] = useState([]);
	const [states, setStates] = useState([]);
	const [loadingUI, setLoadingUI] = useState(true);
	const [loadingStates, setLoadingStates] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				let countryList = getCache('countryList');
				if (!countryList) {
					const res = await axios.get('https://countriesnow.space/api/v0.1/countries/positions');
					countryList = res.data.data.map((item) => item.name);
					setCache('countryList', countryList);
				}
				setCountries(countryList);

				if (countryList.includes('India')) {
					form.setFieldsValue({ country: 'India' });

					let stateList = getCache('India_states');
					if (!stateList) {
						const res = await axios.post('https://countriesnow.space/api/v0.1/countries/states', {
							country: 'India',
						});
						stateList = res.data.data.states.map((s) => s.name);
						setCache('India_states', stateList);
					}
					setStates(stateList);

					if (stateList.includes('Tamil Nadu')) {
						form.setFieldsValue({ state: 'Tamil Nadu' });
						const gstin = form.getFieldValue('gstin') || '';
						const code = gstinStateCodes['Tamil Nadu'];
						const newGstin = gstin.length > 2 ? code + gstin.slice(2) : code;
						form.setFieldsValue({ gstin: newGstin.toUpperCase() });
					}
				}
			} catch (err) {
				console.error('Failed to fetch countries/states', err);
			} finally {
				setLoadingUI(false);
			}
		};
		fetchData();
	}, [form]);

	const fetchStates = async (country) => {
		setLoadingStates(true);
		try {
			let stateList = getCache(`${country}_states`);
			if (!stateList) {
				const res = await axios.post('https://countriesnow.space/api/v0.1/countries/states', {
					country,
				});
				stateList = res.data.data.states.map((s) => s.name);
				setCache(`${country}_states`, stateList);
			}
			setStates(stateList);
			form.setFieldsValue({ state: '' });
		} catch (err) {
			console.error('Failed to fetch states', err);
			setStates([]);
		} finally {
			setLoadingStates(false);
		}
	};

	const onCountryChange = (country) => {
		form.setFieldsValue({ country });
		fetchStates(country);
	};

	const onStateChange = (state) => {
		form.setFieldsValue({ state });

		const gstin = form.getFieldValue('gstin') || '';
		const code = gstinStateCodes[state];

		if (code && form.getFieldValue('country') === 'India') {
			const newGstin = gstin.length > 2 ? code + gstin.slice(2) : code;
			form.setFieldsValue({ gstin: newGstin.toUpperCase() });
		}
	};

	const onSubmit = (values) => {
		values.gstin = values.gstin.toUpperCase();
		values.contact = values.contact.replace(/[^0-9]/g, '');
		dispatch(postApi(values, 'ADD_ORGANIZATION'));
	};

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_ORGANIZATION === 'SUCCESS') {
			form.resetFields();
			refreshList();
			dispatch(resetApiStatus('ADD_ORGANIZATION'));
		}
	}, [globalRedux.apiStatus, dispatch, form, refreshList]);

	if (loadingUI) {
		return (
			<div style={{ padding: 0 }}>
				<Skeleton height={40} style={{ marginBottom: 20 }} count={6} />
				<Row gutter={16}>
					<Col span={12}>
						<Skeleton height={40} />
					</Col>
					<Col span={12}>
						<Skeleton height={40} />
					</Col>
				</Row>
			</div>
		);
	}

	// Handle orgName changes and update legalName and tradeName
	const handleOrgNameChange = (value) => {
		form.setFieldsValue({
			legalName: value,
			tradeName: value,
		});
	};

	return (
		<Form form={form} layout="vertical" onFinish={onSubmit}>
			<Form.Item label="Company Name" name="orgName" rules={[{ required: true, message: 'Please enter your company name' }]} onChange={(e) => handleOrgNameChange(e.target.value)}>
				<Input placeholder="Enter company name" />
			</Form.Item>

			<Form.Item label="Legal Name" name="legalName" rules={[{ required: true, message: 'Please enter your legal name' }]}>
				<Input placeholder="Enter legal name" />
			</Form.Item>

			<Form.Item label="Trade Name" name="tradeName" rules={[{ required: true, message: 'Please enter your trade name' }]}>
				<Input placeholder="Enter trade name" />
			</Form.Item>

			<Form.Item
				label={
					<span>
						GSTIN&nbsp;
						<Tooltip title="Format: 33ABCDE1234F1Z5 → 33=StateCode, ABCDE1234F=PAN, 1=Entity, Z=Default, 5=Check">
							<InfoCircleOutlined />
						</Tooltip>
					</span>
				}
				name="gstin"
				rules={[
					{ required: true, message: 'Please enter GSTIN' },
					{ pattern: /^[0-9A-Z]{15}$/, message: 'GSTIN must be 15 uppercase alphanumeric characters' },
				]}>
				<Input placeholder="Enter GSTIN (e.g., 33ABCDE1234F1Z5)" maxLength={15} onChange={(e) => form.setFieldsValue({ gstin: e.target.value.toUpperCase() })} />
			</Form.Item>

			<Form.Item
				label="Email Address"
				name="email"
				rules={[
					{ required: true, message: 'Please enter the email address' },
					{ type: 'email', message: 'Please enter a valid email address' },
				]}>
				<Input placeholder="Enter email address" />
			</Form.Item>

			<Row gutter={16}>
				<Col span={12}>
					<Form.Item label="Address Line 1" name="addressLine1" rules={[{ required: true, message: 'Please enter address line 1' }]}>
						<Input placeholder="Enter address line 1" />
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item label="Address Line 2" name="addressLine2">
						<Input placeholder="Enter address line 2 (optional)" />
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={16}>
				<Col span={8}>
					<Form.Item label="City" name="city" rules={[{ required: true, message: 'Please enter city' }]}>
						<Input placeholder="Enter city" />
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item
						label="Pincode"
						name="pincode"
						rules={[
							{ required: true, message: 'Please enter pincode' },
							{ pattern: /^\d{6}$/, message: 'Pincode must be 6 digits' },
						]}>
						<Input placeholder="Enter pincode" maxLength={6} />
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item label="State" name="state" rules={[{ required: true, message: 'Please select state' }]}>
						<Select showSearch placeholder="Select state" loading={loadingStates} onChange={onStateChange}>
							{states.map((state) => (
								<Option key={state} value={state}>
									{state}
								</Option>
							))}
						</Select>
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={16}>
				<Col span={12}>
					<Form.Item label="Country" name="country" rules={[{ required: true, message: 'Please select country' }]}>
						<Select showSearch placeholder="Select country" onChange={onCountryChange}>
							{countries.map((country) => (
								<Option key={country} value={country}>
									{country}
								</Option>
							))}
						</Select>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item
						label="Contact Number"
						name="contact"
						rules={[
							{ required: true, message: 'Please enter contact number' },
							// {
							// 	validator: (_, value) => {
							// 		const regex = /^[6-9]\d{4}-\d{5}$/;
							// 		if (value && !regex.test(value)) {
							// 			return Promise.reject('Enter valid format like 98765-43210');
							// 		}
							// 		return Promise.resolve();
							// 	},
							// },
						]}>
						<InputMask
							mask="99999-99999" // This mask ensures 5 digits followed by a hyphen and 5 digits
							value={form.getFieldValue('contact')} // Bind value to form
							onChange={(e) => form.setFieldsValue({ contact: e.target.value })} // Update value on change
						>
							{(inputProps) => <Input {...inputProps} placeholder="Enter contact number (e.g., 98765-43210)" />}
						</InputMask>
					</Form.Item>
				</Col>
			</Row>

			<Form.Item>
				<Row gutter={10}>
					<Col span={12}>
						<Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={globalRedux.apiStatus.ADD_ORGANIZATION === 'PENDING'}>
							Create
						</Button>
					</Col>
					<Col span={12}>
						<Button
							style={{ width: '100%' }}
							onClick={() => {
								closeModal();
								form.resetFields();
							}}
							danger>
							Cancel
						</Button>
					</Col>
				</Row>
			</Form.Item>
		</Form>
	);
};

export default AddOrganization;
