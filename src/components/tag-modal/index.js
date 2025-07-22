import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Modal, Row, Col, Divider, Select, Input, Form, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import TableComponent from 'components/table-component';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { API_STATUS } from 'constants/app-constants';
import { SERVER_IP } from 'assets/Config';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { AiOutlineSearch } from 'react-icons/ai';
import { putApi } from 'redux/sagas/putApiSaga';
import { deleteApi } from 'redux/sagas/deleteApiSaga';
import './tag-modal.scss';

const layer1FormCol = {
	labelCol: {
		span: 24,
	},
	wrapperCol: {
		span: 24,
	},
};

const TagModal = ({ value = null, onChange }) => {
	const [tagModal, setTagModal] = useState(false);
	const [searchKey, setSearchKey] = useState('');
	const [addFormVisible, setAddFormVisible] = useState(false);
	const [editData, setEditData] = useState(null);
	const [tableData, setTableData] = useState([]);
	const selectRef = useRef(null);
	const globalRedux = useSelector((state) => state.globalRedux);
	const tags = useSelector((state) => state?.globalRedux.tags);
	const categories = useSelector((state) => state?.globalRedux.categories || []);
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const column = [
		{
			title: 'Tag Name',
			dataIndex: 'tagName',
			key: 'tagName',
			width: '20%',
			align: 'left',
		},
		{
			title: 'Category',
			dataIndex: 'categoryId',
			key: 'categoryId',
			width: '20%',
			align: 'left',
			render: (value) => {
				return value?.categoryName || '';
			},
		},
		{
			title: 'Remarks',
			dataIndex: 'remarks',
			key: 'remarks',
			width: '10%',
			align: 'left',
		},
		{
			title: 'Delete',
			dataIndex: 'tagName',
			key: 'tagName',
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
			setTagModal(true);
		}
	};

	const handleRemove = (id) => {
		let url = `${SERVER_IP}tag/${id}?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(deleteApi('DELETE_TAG', url));
	};

	const handleSubmit = (values) => {
		let data = {
			...values,
			module: 'Project',
			orgId: globalRedux?.selectedOrganization?.id,
		};
		if (editData) {
			let url = `${SERVER_IP}tag/${editData._id}?orgId=${globalRedux?.selectedOrganization?.id}`;
			dispatch(putApi(data, 'EDIT_TAG', url));
		} else {
			dispatch(postApi(data, 'ADD_TAG'));
		}
	};

	const handleEdit = (values) => {
		let data = {
			...values,
			orgId: globalRedux?.selectedOrganization?.id,
			tagName: values?.tagName || '',
			remarks: values?.remarks || '',
			categoryId: values?.categoryId?._id || '',
		};
		setEditData(data);
	};

	const getCategories = useCallback(() => {
		let url = `${SERVER_IP}category/?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(getApi('GET_CATEGORIES', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	const getTags = useCallback(() => {
		let url = `${SERVER_IP}tag/?orgId=${globalRedux?.selectedOrganization?.id}&module=Project`;
		dispatch(getApi('GET_TAGS', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	useEffect(() => {
		getTags();
		getCategories();
	}, [getTags, getCategories]);

	useEffect(() => {
		if ((tags || [])?.length > 0) {
			setTableData(tags);
		}
	}, [tags]);

	useEffect(() => {
		if (editData) {
			form.setFieldsValue({
				tagName: editData?.tagName || '',
				remarks: editData?.remarks || '',
				categoryId: editData?.categoryId || '',
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
		if (globalRedux.apiStatus.ADD_TAG === 'SUCCESS' || globalRedux.apiStatus.EDIT_TAG === 'SUCCESS') {
			dispatch(resetApiStatus(editData ? 'EDIT_TAG' : 'ADD_TAG'));
			setAddFormVisible(false);
			getTags();
		}
	}, [globalRedux.apiStatus, editData, setTagModal, dispatch, getTags]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_TAG === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_TAG'));
			doIt = true;
		}
		if (doIt) {
			getTags();
		}
	}, [globalRedux.apiStatus, dispatch, getTags]);

	const loading = globalRedux.apiStatus.GET_TAGS === API_STATUS.PENDING;
	const buttonLoading = globalRedux.apiStatus.ADD_TAG === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_TAG === API_STATUS.PENDING;

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((tag) => {
			return (
				(tag?.tagName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(tag?.categoryId || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(tag?.outstandingBalance || '')?.toString().toLowerCase().includes(searchKey.toLowerCase())
			);
		});
	}, [tableData, searchKey]);

	return (
		<>
			<Select
				mode="multiple"
				onChange={onChange}
				ref={selectRef}
				{...{
					...(value && { value }),
				}}
				placeholder="Select Tag"
				dropdownRender={(menu) => (
					<div>
						<div
							style={{ display: 'flex', flexWrap: 'nowrap', cursor: 'pointer', background: '#6ebaff' }}
							onClick={() => {
								handleInputKeyDown();
							}}>
							<a href style={{ flex: 'none', color: '#fff', padding: '8px', display: 'block' }}>
								Add Tag
							</a>
						</div>
						<Divider />
						{menu}
					</div>
				)}>
				{tags.map((tag) => (
					<Select.Option key={tag?._id} value={tag?._id}>
						{tag?.tagName}
					</Select.Option>
				))}
			</Select>

			<Modal
				title={
					<Row>
						<Col span={24}>
							<Row>
								<Col span={24}>Tags</Col>
							</Row>
						</Col>
					</Row>
				}
				footer={null}
				onCancel={() => setTagModal(false)}
				cancelButtonProps={{ onPress: () => setTagModal(false) }}
				okText="Save"
				open={tagModal}
				style={{ top: 0 }}
				width={'40%'}>
				<Row className="add-tag">
					<Col span={24}>
						{addFormVisible && (
							<Row className="add-tag-form">
								<Col span={24}>
									<Form
										name="add-staff"
										style={{}}
										// requiredMark={false}
										colon={false}
										labelAlign="left"
										form={form}
										onFinish={handleSubmit}
										{...layer1FormCol}>
										<Row gutter={[10, 0]}>
											<Col span={12}>
												<Form.Item
													label="Tag Name"
													name="tagName"
													initialValue={editData?.tagName}
													rules={[
														{
															required: true,
															message: 'This Field is Required!',
														},
													]}>
													<Input autoFocus placeholder="Tag name" />
												</Form.Item>
												<Form.Item
													label="Remarks"
													name="remarks"
													initialValue={editData?.remarks || ''}
													rules={[
														{
															required: false,
															message: 'This Field is Required!',
														},
													]}>
													<Input.TextArea placeholder="Remarks" />
												</Form.Item>
											</Col>
											<Col span={12}>
												<Form.Item
													label="Category"
													name="categoryId"
													getValueFromEvent={(data) => data}
													rules={[
														{
															required: true,
															message: 'This Field is Required!',
														},
													]}>
													<Select
														placeholder="Select Category"
														showSearch
														optionFilterProp="children"
														filterOption={(input, option) =>
															option.children?.toLowerCase().indexOf(input?.toLowerCase()) >= 0
														}>
														{categories?.map((category) => (
															<Select.Option key={category?._id} value={category?._id}>
																{category?.categoryName}
															</Select.Option>
														))}
													</Select>
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
												placeholder="Search Tag"
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

export default TagModal;
