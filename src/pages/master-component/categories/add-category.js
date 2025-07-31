import React, { useEffect } from 'react';
import { Input, Button, Form, Row, Col, Select, Drawer } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { putApi } from 'redux/sagas/putApiSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { SERVER_IP } from 'assets/Config';
import { API_STATUS, VOUCHER_TYPE } from 'constants/app-constants';

const { TextArea } = Input;

const AddCategory = ({ categoryAddModal, setCategoryAddModal, editCategories, handleClose, refreshList, width = '40%' }) => {
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const globalRedux = useSelector((state) => state.globalRedux);

	useEffect(() => {
		if (editCategories) {
			form.setFieldsValue({
				categoryName: editCategories?.categoryName,
				type: editCategories?.type,
				remarks: editCategories?.remarks,
			});
		} else {
			form.resetFields();
		}
	}, [editCategories, form]);

	const handleSubmit = (values) => {
		const data = {
			...values,
			orgId: globalRedux?.selectedOrganization?.id,
		};

		if (!editCategories) {
			dispatch(postApi(data, 'ADD_CATEGORY'));
		} else {
			const url = `${SERVER_IP}category/${editCategories._id}?orgId=${globalRedux?.selectedOrganization?.id}`;
			dispatch(putApi(data, 'EDIT_CATEGORY', url));
		}
	};

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_CATEGORY === 'SUCCESS' || globalRedux.apiStatus.EDIT_CATEGORY === 'SUCCESS') {
			dispatch(resetApiStatus(editCategories ? 'EDIT_CATEGORY' : 'ADD_CATEGORY'));
			refreshList?.();
			handleClose?.();
			setCategoryAddModal(false);
			form.resetFields();
		}
	}, [globalRedux.apiStatus, editCategories, dispatch, refreshList, handleClose, setCategoryAddModal, form]);

	const layer1FormCol = {
		labelCol: { span: 12 },
		wrapperCol: { span: 12 },
	};

	const loading = globalRedux.apiStatus.ADD_CATEGORY === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_CATEGORY === API_STATUS.PENDING;

	return (
		<Drawer title={`${editCategories ? 'Edit' : 'New'} Category`} placement="right" open={categoryAddModal} onClose={() => setCategoryAddModal(false)} width={width} destroyOnHidden>
			<Row>
				<Col span={24}>
					<Form form={form} name="add-category" onFinish={handleSubmit} colon={false} labelAlign="left" requiredMark={false} style={{ width: '100%' }} className="required_in_right" {...layer1FormCol}>
						<Form.Item label="Category Name" name="categoryName" rules={[{ required: true, message: 'This Field is Required!' }]}>
							<Input placeholder="Category Name" />
						</Form.Item>

						<Form.Item label="Type" name="type" rules={[{ required: true, message: 'This Field is Required!' }]}>
							<Select placeholder="Select Type" showSearch allowClear optionFilterProp="children" filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}>
								{VOUCHER_TYPE?.map((type) => (
									<Select.Option key={type?.value} value={type?.value}>
										{type?.label}
									</Select.Option>
								))}
							</Select>
						</Form.Item>

						<Form.Item label="Remarks" name="remarks">
							<TextArea placeholder="Remarks" />
						</Form.Item>

						<Form.Item wrapperCol={{ span: 24 }}>
							<Row gutter={10} style={{ paddingTop: 20 }}>
								<Col span={12}>
									<Button danger onClick={() => setCategoryAddModal(false)} style={{ width: '100%' }}>
										Cancel
									</Button>
								</Col>
								<Col span={12}>
									<Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
										{editCategories?._id ? 'Update' : 'Create'}
									</Button>
								</Col>
							</Row>
						</Form.Item>
					</Form>
				</Col>
			</Row>
		</Drawer>
	);
};

export default AddCategory;
