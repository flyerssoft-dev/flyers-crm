import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Modal, Row, Col, Divider, Select, Input, Form, Button, Popconfirm } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteOutlined, EditOutlined, PlusCircleFilled } from '@ant-design/icons';
import TableComponent from 'components/table-component';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { API_STATUS, VOUCHER_TYPE } from 'constants/app-constants';
import { SERVER_IP } from 'assets/Config';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { AiOutlineSearch } from 'react-icons/ai';
import { putApi } from 'redux/sagas/putApiSaga';
import { deleteApi } from 'redux/sagas/deleteApiSaga';
import './category-model.scss';

const layer1FormCol = {
	labelCol: {
		span: 24,
	},
	wrapperCol: {
		span: 24,
	},
};

const CategoryModal = ({ value = null, onChange, handleCategoryChange }) => {
	const [categoryModal, setCategoryModal] = useState(false);
	const [searchKey, setSearchKey] = useState('');
	const [addFormVisible, setAddFormVisible] = useState(true);
	const [editData, setEditData] = useState(null);
	const [tableData, setTableData] = useState([]);
	const selectRef = useRef(null);
	const inputRef = useRef(null);
	const globalRedux = useSelector((state) => state.globalRedux);
	const categories = useSelector((state) => state?.globalRedux.categories);
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const column = [
		{
			title: 'CATEGORY NAME',
			dataIndex: 'categoryName',
			key: 'categoryName',
			width: '20%',
			align: 'left',
		},
		{
			title: 'TYPE',
			dataIndex: 'type',
			key: 'type',
			width: '10%',
			align: 'left',
		},
		{
			title: 'REMARKS',
			dataIndex: 'remarks',
			key: 'remarks',
			width: '10%',
			align: 'left',
		},
		{
			title: 'Delete',
			dataIndex: 'categoryName',
			key: 'categoryName',
			width: '10%',
			align: 'center',
			render: (value, record) => (
				<Row className="show-on-hover" justify="center">
					<Col span={6} onClick={() => handleEdit(record)}>
						<EditOutlined />
					</Col>
					<Col span={6} className="delete">
						<Popconfirm
							title={`Are You Sure to Delete ${value}?`}
							okText="Delete"
							cancelText="No"
							onConfirm={() => handleRemove(record?._id)}>
							<DeleteOutlined />
						</Popconfirm>
					</Col>
				</Row>
			),
		},
	];

	const handleInputKeyDown = () => {
		if (selectRef.current) {
			selectRef.current.blur();
			setCategoryModal(true);
		}
	};

	const handleRemove = (id) => {
		let url = `${SERVER_IP}category/${id}?orgId=${globalRedux?.selectedOrganization?._id}`;
		dispatch(deleteApi('DELETE_CATEGORY', url));
	};

	const handleSubmit = (values) => {
		let data = {
			...values,
			orgId: globalRedux?.selectedOrganization?._id,
		};
		if (editData) {
			let url = `${SERVER_IP}category/${editData._id}?orgId=${globalRedux?.selectedOrganization?._id}`;
			dispatch(putApi(data, 'EDIT_CATEGORY', url));
		} else {
			dispatch(postApi(data, 'ADD_CATEGORY'));
		}
	};

	const handleEdit = (values) => {
		let data = {
			...values,
			orgId: globalRedux?.selectedOrganization?._id,
			categoryName: values?.categoryName || '',
			type: values?.type || '',
			remarks: values?.remarks || '',
		};
		setEditData(data);
	};

	const getCategories = useCallback(() => {
		let url = `${SERVER_IP}category/?orgId=${globalRedux?.selectedOrganization?._id}`;
		dispatch(getApi('GET_CATEGORIES', url));
	}, [dispatch, globalRedux?.selectedOrganization?._id]);

	useEffect(() => {
		categoryModal && getCategories();
	}, [getCategories, categoryModal]);

	useEffect(() => {
		if ((categories || [])?.length > 0) {
			setTableData(categories);
		}
	}, [categories]);

	useEffect(() => {
		if (editData) {
			form.setFieldsValue({
				categoryName: editData?.categoryName || '',
				remarks: editData?.remarks || '',
				type: editData?.type || '',
			});
			// setAddFormVisible(true);
		}
	}, [editData, form]);

	useEffect(() => {
		if (!categoryModal) {
			form.resetFields();
			setEditData(null);
		}
	}, [categoryModal, form]);

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_CATEGORY === 'SUCCESS' || globalRedux.apiStatus.EDIT_CATEGORY === 'SUCCESS') {
			dispatch(resetApiStatus(editData ? 'EDIT_CATEGORY' : 'ADD_CATEGORY'));
			// setAddFormVisible(false);
			getCategories();
			setEditData(null);
			form.resetFields();
		}
	}, [globalRedux.apiStatus, editData, setCategoryModal, dispatch, getCategories]);

	useEffect(() => {
		console.log("🚀 ~ useEffect ~ globalRedux.apiStatus.DELETE_CATEGORY:", globalRedux.apiStatus.DELETE_CATEGORY)
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_CATEGORY === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_CATEGORY'));
			doIt = true;
		}
		if (doIt) {
			getCategories();
		}
	}, [globalRedux.apiStatus, dispatch, getCategories]);

	const loading = globalRedux.apiStatus.GET_CATEGORIES === API_STATUS.PENDING || globalRedux.apiStatus.DELETE_CATEGORY === API_STATUS.PENDING;
	const buttonLoading = globalRedux.apiStatus.ADD_CATEGORY === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_CATEGORY === API_STATUS.PENDING;

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((category) => {
			return (
				(category?.categoryName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(category?.outstandingBalance || '')?.toString().toLowerCase().includes(searchKey.toLowerCase())
			);
		});
	}, [tableData, searchKey]);

	const categoriesLoading = useMemo(() => globalRedux.apiStatus.GET_CATEGORIES === API_STATUS.PENDING, [globalRedux.apiStatus]);

	useEffect(() => {
		if (categoryModal) {
			setTimeout(() => {
				inputRef.current?.focus();
			}, 200); // Delay is needed to wait for modal DOM render
		}
	}, [categoryModal, addFormVisible]);
	
	return (
		<>
			<Select
				showSearch
				allowClear
				filterOption={(input, option) => {
					return (option?.children ?? '').toLowerCase().includes(input.toLowerCase());
				}}
				onChange={(e) => {
					onChange(e);
					handleCategoryChange(e)
				}}
				ref={selectRef}
				{...{
					...(value && { value }),
				}}
				placeholder="Select Category"
				loading={categoriesLoading}
				dropdownRender={(menu) => (
					<div>
						{menu}
						<Divider />
						<div
							style={{ display: 'flex', flexWrap: 'nowrap', cursor: 'pointer' }}
							onClick={() => {
								handleInputKeyDown();
							}}>
							<a href style={{ flex: 'none', color: '#188dfa', padding: '8px', display: 'block' }}>
							<PlusCircleFilled /> Add New
							</a>
						</div>
					</div>
				)}>
				{categories?.map((category) => (
					<Select.Option key={category?._id} value={category?._id}>
						{category?.categoryName}
					</Select.Option>
				))}
			</Select>

			<Modal
				destroyOnHidden
				title={
					<Row>
						<Col span={24}>
							<Row>
								<Col span={24}>Categories</Col>
							</Row>
						</Col>
					</Row>
				}
				footer={null}
				onCancel={() => setCategoryModal(false)}
				cancelButtonProps={{ onPress: () => setCategoryModal(false) }}
				okText="Save"
				open={categoryModal}
				style={{ top: 0 }}
				width={'40%'}>
				<Row className="add-category">
					<Col span={24}>
						{addFormVisible && (
							<Row className="add-category-form">
								<Col span={24}>
									<Form
										name="add-category"
										style={{}}
										requiredMark={false}
										colon={false}
										labelAlign="left"
										form={form}
										onFinish={handleSubmit}
										{...layer1FormCol}>
										<Row gutter={[10, 0]}>
											<Col span={10}>
												<Form.Item
													label="Category Name"
													name="categoryName"
													rules={[
														{
															required: true,
															message: 'This Field is Required!',
														},
													]}>
													<Input ref={inputRef} placeholder="Category name" />
												</Form.Item>
											</Col>
											<Col span={7}>
												<Form.Item label="Type" rules={[{ required: true }]} name="type">
													<Select
														placeholder="Select Type"
														showSearch
														allowClear
														filterOption={(input, option) => {
															return (option?.children ?? '').toLowerCase().includes(input.toLowerCase());
														}}>
														{VOUCHER_TYPE?.map((type) => (
															<Select.Option key={type?.value} value={type?.value}>
																{type?.label}
															</Select.Option>
														))}
													</Select>
												</Form.Item>
											</Col>
											<Col span={7}>
												<Form.Item
													label="Remarks"
													name="remarks"
													rules={[
														{
															required: false,
															message: 'This Field is Required!',
														},
													]}>
													<Input placeholder="Remarks" />
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
														<Button onClick={() => setAddFormVisible(false)} style={{ marginRight: 5 }} danger>
															Cancel
														</Button>
														<Button loading={buttonLoading} type="primary" style={{ }} htmlType="submit">
															{editData ? 'Update' : 'Save'}
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
												placeholder="Search Category"
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

export default CategoryModal;
