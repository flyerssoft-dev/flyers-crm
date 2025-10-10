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
import './account-book-model.scss';

const layer1FormCol = {
	labelCol: {
		span: 24,
	},
	wrapperCol: {
		span: 24,
	},
};

const AccountBookModal = ({ value = null, onChange, categoryIdValue }) => {
	console.log("🚀 ~ AccountBookModal ~ categoryIdValue:", categoryIdValue)
	const [accountBookModal, setAccountBookModal] = useState(false);
	const [searchKey, setSearchKey] = useState('');
	const [addFormVisible, setAddFormVisible] = useState(false);
	const [editData, setEditData] = useState(null);
	const [tableData, setTableData] = useState([]);
	const selectRef = useRef(null);
	const globalRedux = useSelector((state) => state.globalRedux);
	const categories = useSelector((state) => state?.globalRedux.categories);
	const accountBooks = useSelector((state) => state?.globalRedux.accountBooks);
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
			setAccountBookModal(true);
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
			let url = `${SERVER_IP}subcategory/${editData._id}?orgId=${globalRedux?.selectedOrganization?.id}`;
			dispatch(putApi(data, 'EDIT_ACCOUNT_BOOK', url));
		} else {
			dispatch(postApi(data, 'ADD_ACCOUNT_BOOK'));
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

	const getAccountBooks = useCallback(() => {
		let url = `${SERVER_IP}accbook/?orgId=${globalRedux?.selectedOrganization?.id}&categoryId=${categoryIdValue}`;
		dispatch(getApi('GET_ACCOUNT_BOOKS', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id, categoryIdValue]);

	useEffect(() => {
		getAccountBooks();
	}, [getAccountBooks]);

	useEffect(() => {
		if ((accountBooks || [])?.length > 0) {
			setTableData(accountBooks);
		}
	}, [accountBooks]);

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
		if (!addFormVisible) {
			form.resetFields();
			setEditData(null);
		}
	}, [addFormVisible, form]);

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_ACCOUNT_BOOK === 'SUCCESS' || globalRedux.apiStatus.EDIT_ACCOUNT_BOOK === 'SUCCESS') {
			dispatch(resetApiStatus(editData ? 'EDIT_ACCOUNT_BOOK' : 'ADD_ACCOUNT_BOOK'));
			setAddFormVisible(false);
			getAccountBooks();
		}
	}, [globalRedux.apiStatus, editData, setAccountBookModal, dispatch, getAccountBooks]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_CATEGORY === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_CATEGORY'));
			doIt = true;
		}
		if (doIt) {
			getAccountBooks();
		}
	}, [globalRedux.apiStatus, dispatch, getAccountBooks]);

	const loading = globalRedux.apiStatus.GET_CATEGORIES === API_STATUS.PENDING;
	const buttonLoading =
		globalRedux.apiStatus.ADD_ACCOUNT_BOOK === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_ACCOUNT_BOOK === API_STATUS.PENDING;

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

	return (
		<>
			<Select
				onChange={onChange}
				ref={selectRef}
				{...{
					...(value && { value }),
				}}
				placeholder="Select Account Book"
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
								<PlusOutlined /> Account Book
							</a>
						</div>
					</div>
				)}>
				{accountBooks?.map((accbook) => (
					<Select.Option key={accbook?._id} value={accbook?._id}>
						{accbook?.accbookName}
					</Select.Option>
				))}
			</Select>

			<Modal
				title={
					<Row>
						<Col span={24}>
							<Row>
								<Col span={24}>Sub Account Books</Col>
							</Row>
						</Col>
					</Row>
				}
				footer={null}
				onCancel={() => setAccountBookModal(false)}
				cancelButtonProps={{ onPress: () => setAccountBookModal(false) }}
				okText="Save"
				open={accountBookModal}
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
													name="categoryId"
													initialValue={editData?.type}>
													<Select
														placeholder="Select Category"
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
													label="Account Book Name"
													name="subcategoryName"
													initialValue={editData?.subcategoryName}
													rules={[
														{
															required: true,
															message: 'This Field is Required!',
														},
													]}>
													<Input placeholder="Account Book name" />
												</Form.Item>
											</Col>
											<Col span={7}>
												<Form.Item
													label="Remarks"
													name="remarks"
													initialValue={editData?.remarks || ''}
													rules={[
														{
															required: true,
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
												placeholder="Search Account Book"
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

export default AccountBookModal;
