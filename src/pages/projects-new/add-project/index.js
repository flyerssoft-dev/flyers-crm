import React, { useCallback, useEffect } from 'react';
import { Row, Col, Input, Button, Form, Select, Drawer } from 'antd';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { putApi } from 'redux/sagas/putApiSaga';
import { API_STATUS, DATE_FORMAT } from 'constants/app-constants';
import { SERVER_IP } from 'assets/Config';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { getApi } from 'redux/sagas/getApiDataSaga';
import DatePicker from 'components/date-picker';
import TagModal from 'components/tag-modal';
import CategoryModal from 'components/category-modal';

const AddProject = ({ projectAddModal, width = '40%', editProject, setProjectAddModal, refreshList, handleClose }) => {
	const [form] = Form.useForm();
	const dispatch = useDispatch();

	const globalRedux = useSelector((state) => state.globalRedux);
	const customers = useSelector((state) => state.customerRedux?.customers || []);

	const getCustomers = useCallback(() => {
		const url = `${SERVER_IP}customer?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(getApi('GET_CUSTOMERS', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	const getCategories = useCallback(() => {
		const url = `${SERVER_IP}category/?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(getApi('GET_CATEGORIES', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	const getTags = useCallback(() => {
		const url = `${SERVER_IP}tag/?orgId=${globalRedux?.selectedOrganization?.id}&module=Project`;
		dispatch(getApi('GET_TAGS', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	useEffect(() => {
		getCustomers();
		getCategories();
		getTags();
	}, [getCustomers, getCategories, getTags]);

	useEffect(() => {
		if (editProject) {
			form.setFieldsValue({
				startDate: editProject?.startDate ? moment(editProject?.startDate) : null,
				dueDate: editProject?.dueDate ? moment(editProject?.dueDate) : null,
				projectName: editProject?.projectName,
				description: editProject?.description,
				customerId: editProject?.customerId?._id,
				categoryId: editProject?.categoryId?._id,
				referredBy: editProject?.referredBy?._id,
				tags: editProject?.tags?.map((tag) => tag?.tagId?.id) || [],
			});
		} else {
			form.resetFields();
		}
	}, [editProject, form]);

	const handleSubmit = (values) => {
		const data = {
			orgId: globalRedux?.selectedOrganization?.id,
			startDate: values?.startDate,
			dueDate: values?.dueDate,
			projectName: values?.projectName,
			description: values?.description,
			referredBy: values?.referredBy || '',
			categoryId: values?.categoryId || '',
			customerId: values?.customerId || '',
			tags: values?.tags?.map((tagId) => ({ tagId })) || [],
		};

		if (editProject) {
			const url = `${SERVER_IP}project/${editProject._id}?orgId=${globalRedux?.selectedOrganization?.id}`;
			dispatch(putApi(data, 'EDIT_PROJECT', url));
		} else {
			dispatch(postApi(data, 'ADD_PROJECT'));
		}
	};

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_PROJECT === 'SUCCESS' || globalRedux.apiStatus.EDIT_PROJECT === 'SUCCESS') {
			dispatch(resetApiStatus(editProject ? 'EDIT_PROJECT' : 'ADD_PROJECT'));
			refreshList?.();
			handleClose?.();
			form.resetFields();
		}
	}, [globalRedux.apiStatus, editProject, dispatch, refreshList, handleClose, form]);

	useEffect(() => {
		if (!projectAddModal) form.resetFields();
	}, [projectAddModal, form]);

	const loading = globalRedux.apiStatus.ADD_PROJECT === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_PROJECT === API_STATUS.PENDING;

	const layout = {
		labelCol: { span: 12 },
		wrapperCol: { span: 12 },
	};

	return (
		<Drawer placement="right" title={`${editProject ? 'Edit' : 'New'} Project`} width={width} open={projectAddModal} closable onClose={() => setProjectAddModal(false)} destroyOnHidden>
			<Row>
				<Col span={24}>
					<Form form={form} name="add-project" className="required_in_right" labelAlign="left" onFinish={handleSubmit} initialValues={{ startDate: moment() }} {...layout}>
						<Form.Item label="Project Title" name="projectName" rules={[{ required: true, message: 'This Field is required!' }]}>
							<Input placeholder="Enter Title" />
						</Form.Item>

						<Form.Item label="Customer" name="customerId" rules={[{ required: true, message: 'This Field is required!' }]}>
							<Select placeholder="Select Customer" showSearch optionFilterProp="children" filterOption={(input, option) => option.children?.toLowerCase().includes(input.toLowerCase())}>
								{customers.map((customer) => (
									<Select.Option key={customer?._id} value={customer?._id}>
										{customer?.displayName}
									</Select.Option>
								))}
							</Select>
						</Form.Item>

						<Form.Item label="Category" name="categoryId" rules={[{ required: true, message: 'This Field is required!' }]}>
							<CategoryModal />
						</Form.Item>

						<Form.Item label="Tags" name="tags" rules={[{ required: true, message: 'This Field is required!' }]}>
							<TagModal />
						</Form.Item>

						<Form.Item label="Referred By" name="referredBy" rules={[{ required: true, message: 'This Field is required!' }]}>
							<Select placeholder="Select Referred By" showSearch optionFilterProp="children" filterOption={(input, option) => option.children?.toLowerCase().includes(input.toLowerCase())}>
								{customers.map((customer) => (
									<Select.Option key={customer?._id} value={customer?._id}>
										{customer?.displayName}
									</Select.Option>
								))}
							</Select>
						</Form.Item>

						<Form.Item label="Start Date" name="startDate" rules={[{ required: true, message: 'This Field is required!' }]}>
							<DatePicker format={DATE_FORMAT.DD_MM_YYYY} style={{ width: '100%' }} />
						</Form.Item>

						<Form.Item label="Due Date" name="dueDate" rules={[{ required: true, message: 'This Field is required!' }]}>
							<DatePicker format={DATE_FORMAT.DD_MM_YYYY} style={{ width: '100%' }} />
						</Form.Item>

						<Form.Item label="Description" name="description">
							<Input.TextArea placeholder="Enter Description" />
						</Form.Item>

						<Form.Item wrapperCol={{ span: 24 }}>
							<Row justify="space-between" style={{ paddingTop: 20 }}>
								<Button danger style={{ width: '49%' }} onClick={() => setProjectAddModal(false)}>
									Cancel
								</Button>
								<Button loading={loading} type="primary" htmlType="submit" style={{ width: '49%' }}>
									{editProject ? 'Update' : 'Save'}
								</Button>
							</Row>
						</Form.Item>
					</Form>
				</Col>
			</Row>
		</Drawer>
	);
};

export default AddProject;
