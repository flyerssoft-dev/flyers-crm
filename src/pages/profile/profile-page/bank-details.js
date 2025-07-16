import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, Select, InputNumber } from 'antd';
import { SERVER_IP } from 'assets/Config';
import { useDispatch, useSelector } from 'react-redux';
import { ACCOUNT_TYPES, NOTIFICATION_STATUS_TYPES } from 'constants/app-constants';
import { showToast } from 'helpers';
import { sendGetRequest, sendPutRequest } from 'redux/sagas/utils';
import { setSelectedOrganization } from 'redux/reducers/globals/globalActions';
import { getApi } from 'redux/sagas/getApiDataSaga';

const { Option } = Select;

const BankDetails = () => {
	const [form] = Form.useForm();
	const [detailSaving, setDetailSaving] = useState(false);
	const globalRedux = useSelector((state) => state.globalRedux);
	const [organizationDetails, setOrganizationDetails] = useState(null);
	const dispatch = useDispatch();

	const getOrganizationDetails = React.useCallback(async () => {
		const res = await sendGetRequest(null, `${SERVER_IP}organization/${globalRedux.selectedOrganization._id}`);
		setOrganizationDetails(res?.data);
	}, [globalRedux.selectedOrganization._id]);

	React.useEffect(() => {
		getOrganizationDetails();
	}, [getOrganizationDetails]);

	React.useEffect(() => {
		form.setFieldsValue({
			...organizationDetails,
			pincode: organizationDetails?.pincode?.toString(),
		});
	}, [organizationDetails, form]);

	const handleFormSubmit = async (values) => {
		console.log('Submitting Form Values:', values);
		setDetailSaving(true);

		try {
			const res = await sendPutRequest({
				url: `${SERVER_IP}organization`,
				body: {
					...values,
					orgId: globalRedux.selectedOrganization._id,
					orgName: globalRedux.selectedOrganization.orgName,
					gstin: globalRedux.selectedOrganization.gstin,
					accountNumber: values.accountNumber?.toString(),
				},
			});
			const { data } = res;
			const updatedOrganization = data?.data;
			if (!updatedOrganization) {
				throw new Error(res?.error?.response?.data?.message || 'Invalid response data');
			}
			// Update Redux State
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
			console.error('Error updating organization:', err);
			showToast(
				'Error',
				'Failed to update company details. Please try again.' + err?.toString(),
				NOTIFICATION_STATUS_TYPES.ERROR,
				'top-center'
			);
		} finally {
			setDetailSaving(false);
		}
	};

	return (
		<Row>
			<Col span={8}>
				<Form layout="vertical" form={form} onFinish={handleFormSubmit}>
					<Form.Item label="Bank Name" name="bankName" rules={[{ required: true, message: 'Please enter your bank name' }]}>
						<Input placeholder="Enter bank name" />
					</Form.Item>
					<Form.Item label="Account Number" name="accountNumber" rules={[{ required: true, message: 'Please enter the account number' }]}>
						<InputNumber style={{ width: '100%' }} placeholder="Enter account number" />
					</Form.Item>
					<Form.Item
						label="Account Holder"
						name="accountHolder"
						rules={[{ required: true, message: 'Please enter the account holder name' }]}>
						<Input placeholder="Enter account holder name" />
					</Form.Item>
					<Form.Item
						label="IFSC Code"
						name="ifscCode"
						rules={[
							{ required: true, message: 'Please enter the IFSC code' },
							{ len: 11, message: 'IFSC code must be 11 characters' },
						]}>
						<Input placeholder="Enter IFSC code" maxLength={11}/>
					</Form.Item>
					<Form.Item label="Account Type" name="accountType" rules={[{ required: true, message: 'Please select the account type' }]}>
						<Select placeholder="Select account type">
							{ACCOUNT_TYPES.map((type) => (
								<Option key={type.value} value={type.value}>
									{type.label}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item>
						<Button loading={detailSaving} type="primary" htmlType="submit">
							Save Bank Details
						</Button>
					</Form.Item>
				</Form>
			</Col>
		</Row>
	);
};

export default BankDetails;
