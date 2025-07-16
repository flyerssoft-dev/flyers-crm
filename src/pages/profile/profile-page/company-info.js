import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Col, Switch } from 'antd';
import { SERVER_IP } from 'assets/Config';
import { useDispatch, useSelector } from 'react-redux';
import { NOTIFICATION_STATUS_TYPES } from 'constants/app-constants';
import { showToast } from 'helpers';
import { sendGetRequest, sendPutRequest } from 'redux/sagas/utils';
import { setSelectedOrganization } from 'redux/reducers/globals/globalActions';
import { getApi } from 'redux/sagas/getApiDataSaga';

const CompanyInformation = () => {
	const [form] = Form.useForm();
	const [detailSaving, setDetailSaving] = useState(false);
	const globalRedux = useSelector((state) => state.globalRedux);
	const [organizationDetails, setOrganizationDetails] = useState(null);
	const dispatch = useDispatch();

	const getOrganizationDetails = React.useCallback(async () => {
		const res = await sendGetRequest(null, `${SERVER_IP}organization/${globalRedux.selectedOrganization._id}`);
		setOrganizationDetails(res?.data);
	}, [globalRedux.selectedOrganization._id]);

	useEffect(() => {
		getOrganizationDetails();
	}, [getOrganizationDetails]);

	useEffect(() => {
		form.setFieldsValue({
			...organizationDetails,
			pincode: organizationDetails?.pincode?.toString(),
		});
	}, [organizationDetails, form]);

	// const [logoUrl, setLogoUrl] = useState(null);
	// const [signatureUrl, setSignatureUrl] = useState(null);
	// const [logoProgress, setLogoProgress] = useState(0);
	// const [signatureProgress, setSignatureProgress] = useState(0);

	// useEffect(() => {
	// 	// Simulate fetching data with URLs from an API response
	// 	const mockApiResponse = {
	// 		orgName: 'Tech Innovators Ltd.',
	// 		gstin: '29ABCDE1234F2Z5',
	// 		hsncode: '123456',
	// 		logo: 'https://randomuser.me/api/portraits/men/24.jpg',
	// 		signature: 'https://randomuser.me/api/portraits/men/24.jpg',
	// 	};
	// 	form.setFieldsValue(mockApiResponse);
	// 	setLogoUrl(mockApiResponse.logo);
	// 	setSignatureUrl(mockApiResponse.signature);
	// }, [form]);

	const handleFormSubmit = async (values) => {
		setDetailSaving(true);
		try {
			const res = await sendPutRequest({
				url: `${SERVER_IP}organization/${globalRedux.selectedOrganization._id}`,
				body: {
					...values,
				},
			});
			const { data } = res;
			const updatedOrganization = data?.data;
			if (!updatedOrganization) {
				throw new Error(res?.error?.response?.data?.message || 'Invalid response data');
			}

			dispatch(getApi('GET_ALL_ORGANIZATION'));
			dispatch(
				setSelectedOrganization({
					...globalRedux?.selectedOrganization,
					_id: updatedOrganization?._id,
					orgName: updatedOrganization?.orgName,
					gstin: updatedOrganization?.gstin,
					owner: updatedOrganization?.owner,
					createdAt: updatedOrganization?.createdAt,
					orgNumber: updatedOrganization?.orgNumber,
				})
			);

			showToast('Success', 'Company details updated successfully', NOTIFICATION_STATUS_TYPES.SUCCESS, 'top-center');
		} catch (err) {
			showToast('Error', 'Failed to update company details. Please try again.' + err?.toString(), NOTIFICATION_STATUS_TYPES.ERROR, 'top-center');
		} finally {
			setDetailSaving(false);
		}
	};

	// const handleLogoChange = (info) => {
	// 	if (info.file.status === 'uploading') {
	// 		setLogoProgress(Math.round(info.file.percent));
	// 	}
	// 	if (info.file.status === 'uploading') {
	// 		setTimeout(() => {
	// 			info.file.status = 'done';
	// 			const newLogoUrl = URL.createObjectURL(info.file.originFileObj);
	// 			setLogoUrl(newLogoUrl);
	// 			setLogoProgress(0);
	// 			message.success('Logo updated successfully');
	// 		}, 1000); // 1-second delay
	// 	}
	// };

	// const handleSignatureChange = (info) => {
	// 	if (info.file.status === 'uploading') {
	// 		setSignatureProgress(Math.round(info.file.percent));
	// 	}
	// 	if (info.file.status === 'uploading') {
	// 		setTimeout(() => {
	// 			info.file.status = 'done';
	// 			const newSignatureUrl = URL.createObjectURL(info.file.originFileObj);
	// 			setSignatureUrl(newSignatureUrl);
	// 			setSignatureProgress(0);
	// 			message.success('Signature updated successfully');
	// 		}, 1000); // 1-second delay
	// 	}
	// };

	// const uploadProps = {
	// 	beforeUpload: (file) => {
	// 		const isImage = file.type.startsWith('image/');
	// 		const isSmallEnough = file.size / 1024 / 1024 < 2;
	// 		if (!isImage) message.error('You can only upload image files!');
	// 		if (!isSmallEnough) message.error('Image must be smaller than 2MB!');
	// 		return isImage && isSmallEnough;
	// 	},
	// 	showUploadList: false,
	// };

	// Handle orgName changes and update legalName and tradeName
	const handleOrgNameChange = (value) => {
		form.setFieldsValue({
			legalName: value,
			tradeName: value,
		});
	};

	useEffect(() => {
		const orgName = form.getFieldValue('orgName');
		if (orgName) {
			form.setFieldsValue({
				legalName: orgName,
				tradeName: orgName,
			});
		}
	}, [form]);

	return (
		<Row>
			<Col span={18}>
				<Form form={form} layout="vertical" onFinish={handleFormSubmit}>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item label="Company Name" name="orgName" rules={[{ required: true, message: 'Please enter your company name' }]} >
								<Input placeholder="Enter company name" onChange={(e) => handleOrgNameChange(e.target.value)} />
							</Form.Item>
							<Form.Item label="Legal Name" name="legalName" rules={[{ required: true, message: 'Please enter your legal name' }]}>
								<Input placeholder="Enter legal name" />
							</Form.Item>
							<Form.Item label="Trade Name" name="tradeName" rules={[{ required: true, message: 'Please enter your trade name' }]}>
								<Input placeholder="Enter trade name" />
							</Form.Item>
							<Form.Item label="GSTIN" name="gstin" rules={[{ required: true, len: 15, message: 'GSTIN must be 15 characters' }]}>
								<Input placeholder="Enter GSTIN" maxLength={15} />
							</Form.Item>
							<Form.Item label="Mobile" name="contact" rules={[{ required: true, pattern: /^[0-9]{10}$/, message: 'Phone number must be 10 digits' }]}>
								<Input placeholder="Enter phone number" maxLength={10} />
							</Form.Item>
							<Form.Item label="Email Address" name="email" rules={[{ required: true, type: 'email', message: 'Enter valid email' }]}>
								<Input placeholder="Enter email address" />
							</Form.Item>

							{/* New Fields */}
							<Form.Item label="Enable E-Invoice" name="enableEinvoice" valuePropName="checked">
								<Switch />
							</Form.Item>
							<Form.Item label="NIC Username" name="nicUsername">
								<Input placeholder="Enter NIC Username" />
							</Form.Item>
							<Form.Item label="NIC Password" name="nicPassword">
								<Input.Password placeholder="Enter NIC Password" />
							</Form.Item>
						</Col>

						<Col span={12}>
							<Form.Item label="Address Line 1" name="addressLine1" rules={[{ required: true, message: 'Enter Address Line 1' }]}>
								<Input placeholder="Enter Address Line 1" />
							</Form.Item>
							<Form.Item label="Address Line 2" name="addressLine2">
								<Input placeholder="Enter Address Line 2 (Optional)" />
							</Form.Item>
							<Form.Item label="City" name="city" rules={[{ required: true, message: 'Enter city' }]}>
								<Input placeholder="Enter city" />
							</Form.Item>
							<Form.Item label="Pincode" name="pincode" rules={[{ required: true, len: 6, message: 'Pincode must be 6 digits' }]}>
								<Input placeholder="Enter pincode" />
							</Form.Item>
							<Form.Item label="State" name="state" initialValue="Tamilnadu" rules={[{ required: true }]}>
								<Input placeholder="Enter state" />
							</Form.Item>
							<Form.Item label="Country" name="country" initialValue="India" rules={[{ required: true }]}>
								<Input placeholder="Enter country" />
							</Form.Item>

							{/* {logoUrl && <Image src={logoUrl} alt="Company Logo" style={{ marginTop: 16, width: 100, height: 100 }} />}
					<Form.Item label="Company Logo" name="logo">
						<Upload {...uploadProps} onChange={handleLogoChange}>
							<Button icon={<UploadOutlined />}>Upload Logo</Button>
						</Upload>
						{logoProgress > 0 && <Progress percent={logoProgress} size="small" style={{ marginTop: 8 }} />}
					</Form.Item>
					{signatureUrl && <Image src={signatureUrl} alt="Company Signature" style={{ marginTop: 16, width: 100, height: 50 }} />}
					<Form.Item label="Company Signature" name="signature">
						<Upload {...uploadProps} onChange={handleSignatureChange}>
							<Button icon={<UploadOutlined />}>Upload Signature</Button>
						</Upload>
						{signatureProgress > 0 && <Progress percent={signatureProgress} size="small" style={{ marginTop: 8 }} />}
					</Form.Item> */}
							<Form.Item>
								<Button loading={detailSaving} type="primary" htmlType="submit">
									Save Company Details
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Col>
		</Row>
	);
};

export default CompanyInformation;
