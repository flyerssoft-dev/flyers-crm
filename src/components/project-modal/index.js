import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Modal, Row, Col, Divider, Select, Input, Form, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import TableComponent from 'components/table-component';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { API_STATUS } from 'constants/app-constants';
import { SERVER_IP } from 'assets/Config';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { AiOutlineSearch } from 'react-icons/ai';
import { putApi } from 'redux/sagas/putApiSaga';
import { deleteApi } from 'redux/sagas/deleteApiSaga';
import './project-modal.scss';

const layer1FormCol = {
	labelCol: {
		span: 24,
	},
	wrapperCol: {
		span: 24,
	},
};

const ProjectModal = ({ value = null, onChange }) => {
	const [projectModal, setProjectModal] = useState(false);
	const [searchKey, setSearchKey] = useState('');
	const [addFormVisible, setAddFormVisible] = useState(false);
	const [editData, setEditData] = useState(null);
	const [tableData, setTableData] = useState([]);
	const selectRef = useRef(null);
	const globalRedux = useSelector((state) => state.globalRedux);
	const projects = useSelector((state) => state?.projectRedux?.projects);
	const customers = useSelector((state) => state.customerRedux?.customers || []);
	const [form] = Form.useForm();
	const dispatch = useDispatch();

	const column = [
		{
			title: 'Customer Name',
			dataIndex: 'customerId',
			key: 'customerId',
			width: '10%',
			align: 'left',
			render: (value) => <span>{value?.displayName}</span>,
		},
		{
			title: 'Title',
			dataIndex: 'title',
			key: 'title',
			width: '10%',
			align: 'left',
		},
		{
			title: 'Description',
			dataIndex: 'description',
			key: 'description',
			width: '10%',
			align: 'left',
		},
		{
			title: 'Delete',
			dataIndex: 'displayName',
			key: 'displayName',
			width: '10%',
			align: 'center',
			render: (value, record) => (
				<Row className="show-on-hover" justify="center">
					<Col span={6} onClick={() => handleEdit(record)}>
						<EditOutlined />
					</Col>
					<Col span={6} className="delete" onClick={() => handleRemove(record?._id)}>
						<DeleteOutlined />
					</Col>
				</Row>
			),
		},
	];

	const handleInputKeyDown = () => {
		if (selectRef.current) {
			selectRef.current.blur();
			setProjectModal(true);
		}
	};

	const handleRemove = (id) => {
		let url = `${SERVER_IP}project/${id}?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(deleteApi('DELETE_PROJECT', url));
	};

	const handleSubmit = (values) => {
		let data = {
			...values,
			orgId: globalRedux?.selectedOrganization?.id,
		};
		if (editData) {
			let url = `${SERVER_IP}project/${editData._id}?orgId=${globalRedux?.selectedOrganization?.id}`;
			dispatch(putApi(data, 'EDIT_PROJECT', url));
		} else {
			dispatch(postApi(data, 'ADD_PROJECT'));
		}
	};

	const handleEdit = (values) => {
		let data = {
			...values,
			orgId: globalRedux?.selectedOrganization?.id,
			displayName: values?.displayName || '',
			title: values?.title || '',
			description: values?.description || '',
		};
		setEditData(data);
	};

	const getProjects = useCallback(() => {
		let url = `${SERVER_IP}project/?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(getApi('GET_PROJECTS', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	useEffect(() => {
		if ((projects || [])?.length > 0) {
			setTableData(projects);
		}
	}, [projects]);

	useEffect(() => {
		if (editData) {
			form.setFieldsValue({
				customerId: editData?.customerId?._id || '',
				title: editData?.title || '',
				description: editData?.description || '',
			});
			setAddFormVisible(true);
		}
	}, [editData, form]);

	useEffect(() => {
		if (!addFormVisible) {
			form.resetFields();
			setEditData(null);
		}
	}, [addFormVisible, form]);

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_PROJECT === 'SUCCESS' || globalRedux.apiStatus.EDIT_PROJECT === 'SUCCESS') {
			dispatch(resetApiStatus(editData ? 'EDIT_PROJECT' : 'ADD_PROJECT'));
			setAddFormVisible(false);
			getProjects();
		}
	}, [globalRedux.apiStatus, editData, setProjectModal, dispatch, getProjects]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_PROJECT === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_PROJECT'));
			doIt = true;
		}
		if (doIt) {
			getProjects();
		}
	}, [globalRedux.apiStatus, dispatch, getProjects]);

	const loading = globalRedux.apiStatus.GET_PROJECTS === API_STATUS.PENDING;
	const buttonLoading = globalRedux.apiStatus.ADD_PROJECT === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_PROJECT === API_STATUS.PENDING;

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((category) => {
			return (
				(category?.displayName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(category?.outstandingBalance || '')?.toString().toLowerCase().includes(searchKey.toLowerCase())
			);
		});
	}, [tableData, searchKey]);

	return (
		<>
			<Select
				onChange={onChange}
				ref={selectRef}
				{...{
					...(value && { value }),
				}}
				placeholder="Select Project"
				showSearch
				optionFilterProp="children"
				filterOption={(input, option) => option.children?.toLowerCase().includes(input.toLowerCase())}
				// filterSort={(a, b) => a.children?.toLowerCase().localeCompare(b.children?.toLowerCase())}
				dropdownRender={(menu) => (
					<div>
						{menu}
						<Divider />
						<div style={{ display: 'flex', flexWrap: 'nowrap', cursor: 'pointer' }} onClick={() => handleInputKeyDown()}>
							<a style={{ flex: 'none', color: '#188dfa', padding: 8, display: 'block' }}>
								<PlusOutlined /> Project
							</a>
						</div>
					</div>
				)}>
				{projects.map((project) => (
					<Select.Option key={project?._id} value={project?._id}>
						{project?.projectName}
					</Select.Option>
				))}
			</Select>

			<Modal
				title={
					<Row>
						<Col span={24}>
							<Row>
								<Col span={24}>Projects</Col>
							</Row>
						</Col>
					</Row>
				}
				footer={null}
				onCancel={() => setProjectModal(false)}
				cancelButtonProps={{ onPress: () => setProjectModal(false) }}
				okText="Save"
				open={projectModal}
				style={{ top: 0 }}
				width={'40%'}>
				<Row className="add-project">
					<Col span={24}>
						{addFormVisible && (
							<Row className="add-project-form">
								<Col span={24}>
									<Form
										name="add-project"
										style={{}}
										requiredMark={false}
										colon={false}
										labelAlign="left"
										form={form}
										onFinish={handleSubmit}
										{...layer1FormCol}>
										<Row gutter={[10, 0]}>
											<Col span={8}>
												<Form.Item
													label="Customer Name"
													name="customerId"
													initialValue={editData?.displayName}
													rules={[
														{
															required: true,
															message: 'This Field is Required!',
														},
													]}>
													<Select
														showSearch
														optionFilterProp="children"
														filterOption={(input, option) =>
															option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
															option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
														}
														placeholder="Select Customer">
														{customers?.map((customer) => (
															<Select.Option value={customer._id}>{customer?.displayName}</Select.Option>
														))}
													</Select>
												</Form.Item>
											</Col>
											<Col span={8}>
												<Form.Item
													label="Title"
													name="title"
													initialValue={editData?.title || ''}
													rules={[
														{
															required: true,
															message: 'This Field is Required!',
														},
													]}>
													<Input
														// pattern="^-?[0-9]\d*\.?\d*$"
														placeholder="Title"
														// type="number"
														maxLength={10}
													/>
												</Form.Item>
											</Col>
											<Col span={8}>
												<Form.Item
													label="Description"
													name="description"
													initialValue={editData?.description || ''}
													rules={[
														{
															required: true,
															message: 'This Field is Required!',
														},
													]}>
													<Input placeholder="Description" maxLength={10} />
												</Form.Item>
											</Col>
										</Row>
										<Row gutter={[10, 0]}>
											<Col span={12}>
												<Form.Item
													style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}
													wrapperCol={{
														span: 24,
													}}>
													<Row>
														<Button loading={buttonLoading} type="primary" style={{ marginRight: 5 }} htmlType="submit">
															{editData ? 'Update' : 'Save'}
														</Button>
														<Button onClick={() => setAddFormVisible(false)} style={{}} danger>
															Cancel
														</Button>
													</Row>
												</Form.Item>
											</Col>
										</Row>
									</Form>
								</Col>
							</Row>
						)}
						<TableComponent
							className="add-table"
							style={{ width: '100%' }}
							rowKey={(record) => record._id}
							dataSource={filteredData}
							columns={column}
							pagination={false}
							loading={loading}
							title={() =>
								addFormVisible ? null : (
									<Row gutter={[10, 0]} style={{ justifyContent: 'space-between' }}>
										<Col span={15}>
											<Input
												placeholder="Search Project"
												suffix={<AiOutlineSearch />}
												onChange={({ target: { value } }) => setSearchKey(value)}
											/>
										</Col>
										<Col span={9} style={{ textAlign: 'right' }}>
											<Button type="primary" onClick={() => setAddFormVisible(true)}>
												Create New
											</Button>
										</Col>
									</Row>
								)
							}
						/>
					</Col>
				</Row>
			</Modal>
		</>
	);
};

export default ProjectModal;
