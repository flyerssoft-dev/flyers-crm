import React, { useEffect } from 'react';
import { Row, Col, Input, Button, Form, Drawer } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { putApi } from 'redux/sagas/putApiSaga';
import { API_STATUS } from 'constants/app-constants';
import { SERVER_IP } from 'assets/Config';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';

const AddSize = ({ sizeAddModal, width = '40%', editSize, setSizeAddModal, refreshList, handleClose }) => {
	const [form] = Form.useForm();
	const globalRedux = useSelector((state) => state.globalRedux);
	const dispatch = useDispatch();

	useEffect(() => {
		if (editSize) {
			form.setFieldsValue({
				sizeName: editSize?.sizeName,
			});
		} else {
			form?.resetFields();
		}
	}, [editSize, form]);

	const handleSubmit = (values) => {
		let data = {
			orgId: globalRedux?.selectedOrganization?.id,
			sizeName: values?.sizeName,
		};

		if (!editSize) {
			dispatch(postApi(data, 'ADD_UNIT'));
		} else {
			let url = `${SERVER_IP}size/${editSize._id}?orgId=${globalRedux?.selectedOrganization?.id}`;
			dispatch(putApi(data, 'EDIT_UNIT', url));
		}
	};

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_UNIT === 'SUCCESS' || globalRedux.apiStatus.EDIT_UNIT === 'SUCCESS') {
			dispatch(resetApiStatus(editSize ? 'EDIT_UNIT' : 'ADD_UNIT'));
			refreshList?.();
			handleClose?.();
			form?.resetFields();
		}
	}, [globalRedux.apiStatus, editSize, setSizeAddModal, dispatch, refreshList, handleClose, form]);

	const layer1FormCol = {
		labelCol: {
			span: 12,
		},
		wrapperCol: {
			span: 12,
		},
	};

	const loading = globalRedux.apiStatus.ADD_UNIT === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_UNIT === API_STATUS.PENDING;

	return (
		<Drawer
			placement="right"
			title={`${editSize ? 'Edit' : 'New'} Size`}
			width={width || '40%'}
			open={sizeAddModal}
			closable
			onClose={() => setSizeAddModal(false)}
			destroyOnHidden>
			<Row>
				<Col span={24}>
					<Row style={{ marginTop: 0 }}>
						<Form
							name="add-size"
							className="required_in_right"
							style={{ width: '100%' }}
							colon={false}
							labelAlign="left"
							form={form}
							onFinish={handleSubmit}
							initialValues={
								{
									// type: 'Contact',
								}
							}
							{...layer1FormCol}>
							<Form.Item
								label="Size Name"
								name="sizeName"
								rules={[
									{
										required: true,
										message: 'This Field is required!',
									},
								]}>
								<Input placeholder="Enter Size Name" autoFocus />
							</Form.Item>
							<Form.Item
								wrapperCol={{
									offset: 0,
									span: 24,
								}}>
								<Row className="space-between" gutter={[10, 10]} style={{ paddingTop: 20, width: '100%', margin: 0 }}>
									<Col span={12}>
										<Button style={{ width: '100%' }} danger onClick={() => setSizeAddModal(false)}>
											Cancel
										</Button>
									</Col>
									<Col span={12}>
										<Button style={{ width: '100%' }} loading={loading} type="primary" htmlType="submit">
											{editSize ? 'Update' : 'Save'}
										</Button>
									</Col>
								</Row>
							</Form.Item>
						</Form>
					</Row>
				</Col>
			</Row>
		</Drawer>
	);
};

export default AddSize;
