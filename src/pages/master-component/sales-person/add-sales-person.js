import React, { useEffect } from 'react';
import { Input, Button, Divider, Form, Row, Col } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { putApi } from 'redux/sagas/putApiSaga';
import { SERVER_IP } from 'assets/Config';
import { API_STATUS } from 'constants/app-constants';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { postApi } from 'redux/sagas/postApiDataSaga';

// let contactPersonData = {
// 	id: null,
// 	salutation: null,
// 	firstName: null,
// 	lastName: null,
// 	email: null,
// 	designation: null,
// 	mobile: null,
// };

const AddSalesPerson = ({ handleClose, editSalesPerson, setSalesPersonAddModal }) => {
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const globalRedux = useSelector((state) => state.globalRedux);

	const addAccBook = (values) => {
		let data = {
			...values,

			displayName: values.displayName,
			email: values.email,
			mobile: values.mobile,
			orgId: globalRedux?.selectedOrganization?.id,
		};

		dispatch(postApi(data, 'ADD_SALES_PERSON'));
	};
	const handleEdit = (values) => {
		let data = {
			...values,
			orgId: globalRedux?.selectedOrganization?.id,
		};
		let url = `${SERVER_IP}salesperson/${editSalesPerson._id}?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(putApi(data, 'EDIT_SALES_PERSON', url));
	};

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_SALES_PERSON === 'SUCCESS' || globalRedux.apiStatus.EDIT_SALES_PERSON === 'SUCCESS') {
			dispatch(resetApiStatus(editSalesPerson ? 'EDIT_SALES_PERSON' : 'ADD_SALES_PERSON'));
			setSalesPersonAddModal(false);
			handleClose();
		}
	}, [globalRedux.apiStatus, editSalesPerson, setSalesPersonAddModal, handleClose, dispatch]);

	const layer1FormCol = {
		labelCol: {
			span: 12,
		},
		wrapperCol: {
			span: 12,
		},
	};

	const loading = globalRedux.apiStatus.ADD_SALES_PERSON === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_SALES_PERSON === API_STATUS.PENDING;

	return (
		<Row>
			<Col span={24}>
				<Row style={{ backgroundColor: '#fff', padding: '10px 0px' }}>
					<Col>
						<h6 style={{ marginBottom: '0px' }}>{editSalesPerson ? 'Edit' : 'New'} Sales Person</h6>
					</Col>
				</Row>
				<Divider />
				<Row style={{ paddingTop: 20 }}>
					<Col span={24}>
						<Form
							name="add-staff"
							requiredMark={false}
							labelAlign="left"
							form={form}
							onFinish={!editSalesPerson ? addAccBook : handleEdit}
							{...layer1FormCol}>
							<Form.Item
								label="Display Name"
								name="displayName"
								initialValue={editSalesPerson?.displayName}
								rules={[
									{
										required: true,
										message: 'This Field is Required!',
									},
								]}>
								<Input placeholder="Display name" />
							</Form.Item>
							<Form.Item
								label="Email"
								name="email"
								initialValue={editSalesPerson?.email}
								rules={[
									{
										required: true,
										message: 'This Field is Required!',
									},
								]}>
								<Input placeholder="Email" />
							</Form.Item>
							<Form.Item
								label="Mobile"
								name="mobile"
								initialValue={editSalesPerson?.mobile}
								rules={[
									{
										required: true,
										message: 'This Field is Required!',
									},
								]}>
								<Input placeholder="Mobile" />
							</Form.Item>
							<Form.Item
								// style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}
								wrapperCol={{
									span: 24,
								}}>
								<Row justify="space-between">
									<Button onClick={() => setSalesPersonAddModal(false)} style={{ width: '49%' }} danger>
										Cancel
									</Button>
									<Button loading={loading} type="primary" style={{ width: '49%', marginRight: 5 }} htmlType="submit">
										{editSalesPerson ? 'Update' : 'Save'}
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

export default AddSalesPerson;
