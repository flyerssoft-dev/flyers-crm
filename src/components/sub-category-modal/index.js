import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Modal, Row, Col, Divider, Select, Input, Form, Button, Popconfirm } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteOutlined, EditOutlined, PlusCircleFilled } from '@ant-design/icons';
import TableComponent from 'components/table-component';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { API_STATUS } from 'constants/app-constants';
import { SERVER_IP } from 'assets/Config';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { AiOutlineSearch } from 'react-icons/ai';
import { putApi } from 'redux/sagas/putApiSaga';
import { deleteApi } from 'redux/sagas/deleteApiSaga';
import './sub-category-model.scss';

const layer1FormCol = {
	labelCol: {
		span: 24,
	},
	wrapperCol: {
		span: 24,
	},
};

const SubCategoryModal = ({ value = null, onChange, categoryIdValue }) => {
	const [subCategoryModal, setSubCategoryModal] = useState(false);
	const [searchKey, setSearchKey] = useState('');
	const [addFormVisible, setAddFormVisible] = useState(true);
	const [editData, setEditData] = useState(null);
	const [tableData, setTableData] = useState([]);
	const selectRef = useRef(null);
	const inputRef = useRef(null);
	const globalRedux = useSelector((state) => state.globalRedux);
	const categories = useSelector((state) => state?.globalRedux.categories);
	const subCategories = useSelector((state) => state?.globalRedux.subCategories);
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const column = [
		{
			title: 'CATEGORY NAME',
			dataIndex: 'category',
			key: 'type',
			width: '10%',
			align: 'left',
			render: (value) => {
				return <span>{value?.categoryName}</span>;
			},
		},
		{
			title: 'SUB CATEGORY NAME',
			dataIndex: 'subcategoryName',
			key: 'subcategoryName',
			width: '20%',
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
			dataIndex: 'subcategoryName',
			key: 'subcategoryName',
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
			setSubCategoryModal(true);
		}
	};

	const handleRemove = (id) => {
		let url = `${SERVER_IP}subcategory/${id}?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(deleteApi('DELETE_CATEGORY', url));
	};

	const handleSubmit = (values) => {
		let data = {
			...values,
			orgId: globalRedux?.selectedOrganization?.id,
		};
		if (editData) {
			let url = `${SERVER_IP}subcategory/${editData?._id}?orgId=${globalRedux?.selectedOrganization?.id}`;
			dispatch(putApi(data, 'EDIT_SUB_CATEGORY', url));
		} else {
			dispatch(postApi(data, 'ADD_SUB_CATEGORY'));
		}
	};

	const handleEdit = (values) => {
		let data = {
			...values,
			orgId: globalRedux?.selectedOrganization?.id,
			subcategoryName: values?.subcategoryName || '',
			remarks: values?.remarks || '',
		};
		setEditData(data);
	};

	const getSubCategories = useCallback(() => {
		let url = `${SERVER_IP}subcategory/?orgId=${globalRedux?.selectedOrganization?.id}&categoryId=${categoryIdValue}`;
		dispatch(getApi('GET_SUB_CATEGORIES', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id, categoryIdValue]);

	const getCategories = useCallback(() => {
		let url = `${SERVER_IP}category/?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(getApi('GET_CATEGORIES', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	useEffect(() => {
		categoryIdValue && subCategoryModal && getSubCategories();
	}, [getSubCategories, categoryIdValue, subCategoryModal]);

	useEffect(() => {
		editData?._id && getCategories();
	}, [getCategories, editData?._id]);

	useEffect(() => {
		if ((subCategories || [])?.length > 0) {
			setTableData(subCategories);
		}
	}, [subCategories]);

	useEffect(() => {
		if (editData) {
			form.setFieldsValue({
				categoryId: editData?.category?._id || '',
				subcategoryName: editData?.subcategoryName || '',
				remarks: editData?.remarks || '',
			});
			setAddFormVisible(true);
		}
	}, [editData, form]);

	useEffect(() => {
		if (!subCategoryModal) {
			form.resetFields();
			setEditData(null);
		}
	}, [subCategoryModal, form]);

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_SUB_CATEGORY === 'SUCCESS' || globalRedux.apiStatus.EDIT_SUB_CATEGORY === 'SUCCESS') {
			dispatch(resetApiStatus(editData ? 'EDIT_SUB_CATEGORY' : 'ADD_SUB_CATEGORY'));
			// setAddFormVisible(false);
			getSubCategories();
			setEditData(null);
			form.resetFields();
		}
	}, [globalRedux.apiStatus, editData, setSubCategoryModal, dispatch, getSubCategories]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_CATEGORY === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_CATEGORY'));
			doIt = true;
		}
		if (doIt) {
			getSubCategories();
		}
	}, [globalRedux.apiStatus, dispatch, getSubCategories]);

	const loading = globalRedux.apiStatus.GET_CATEGORIES === API_STATUS.PENDING || globalRedux.apiStatus.GET_SUB_CATEGORIES === API_STATUS.PENDING;
	const buttonLoading =
		globalRedux.apiStatus.ADD_SUB_CATEGORY === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_SUB_CATEGORY === API_STATUS.PENDING;

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((category) => {
			return (
				(category?.subcategoryName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(category?.outstandingBalance || '')?.toString().toLowerCase().includes(searchKey.toLowerCase())
			);
		});
	}, [tableData, searchKey]);

	const subCategoriesLoading = useMemo(() => globalRedux.apiStatus.GET_SUB_CATEGORIES === API_STATUS.PENDING, [globalRedux.apiStatus]);

	useEffect(() => {
		if (subCategoryModal) {
			setTimeout(() => {
				inputRef.current?.focus();
			}, 200); // Delay is needed to wait for modal DOM render
		}
	}, [subCategoryModal, addFormVisible]);

	return (
		<>
			<Select
				onChange={onChange}
				ref={selectRef}
				showSearch
				allowClear
				disabled={subCategoriesLoading || categoryIdValue === undefined}
				filterOption={(input, option) => {
					return (option?.children ?? '').toLowerCase().includes(input.toLowerCase());
				}}
				{...{
					...(value && !subCategoriesLoading && { value }),
				}}
				loading={subCategoriesLoading}
				placeholder="Select Sub Category"
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
				{subCategories?.map((subCategory) => (
					<Select.Option key={subCategory?._id} value={subCategory?._id}>
						{subCategory?.subcategoryName}
					</Select.Option>
				))}
			</Select>

			<Modal
				destroyOnHidden
				title={
					<Row>
						<Col span={24}>
							<Row>
								<Col span={24}>Sub Categories</Col>
							</Row>
						</Col>
					</Row>
				}
				footer={null}
				onCancel={() => setSubCategoryModal(false)}
				cancelButtonProps={{ onPress: () => setSubCategoryModal(false) }}
				okText="Save"
				open={subCategoryModal}
				style={{ top: 0 }}
				width={'50%'}>
				<Row className="add-sub-category">
					<Col span={24}>
						{addFormVisible && (
							<Row className="add-sub-category-form">
								<Col span={24}>
									<Form
										name="add-sub-category"
										style={{}}
										requiredMark={false}
										colon={false}
										labelAlign="left"
										form={form}
										onFinish={handleSubmit}
										{...layer1FormCol}>
										<Row gutter={[10, 0]}>
											<Col span={7}>
												<Form.Item
													label="Category"
													rules={[{ required: true }]}
													initialValue={categoryIdValue}
													name="categoryId">
													<Select
														placeholder="Select Category"
														disabled
														showSearch
														allowClear
														filterOption={(input, option) => {
															return (option?.children ?? '').toLowerCase().includes(input.toLowerCase());
														}}>
														{categories?.map((category) => (
															<Select.Option key={category?._id} value={category?._id}>
																{category?.categoryName}
															</Select.Option>
														))}
													</Select>
												</Form.Item>
											</Col>
											<Col span={10}>
												<Form.Item
													label="Sub Category Name"
													name="subcategoryName"
													rules={[
														{
															required: true,
															message: 'This Field is Required!',
														},
													]}>
													<Input ref={inputRef} placeholder="Sub Category name" autoFocus />
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
														<Button loading={buttonLoading} type="primary" style={{}} htmlType="submit">
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
												placeholder="Search Sub Category"
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

export default SubCategoryModal;
