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
import './item-group-model.scss';

const layer1FormCol = {
	labelCol: {
		span: 24,
	},
	wrapperCol: {
		span: 24,
	},
};

const ItemGroupModal = ({ value = null, onChange }) => {
	const [itemGroupModal, setItemGroupModal] = useState(false);
	const [searchKey, setSearchKey] = useState('');
	const [addFormVisible, setAddFormVisible] = useState(false);
	const [editData, setEditData] = useState(null);
	const [tableData, setTableData] = useState([]);
	const selectRef = useRef(null);
	const globalRedux = useSelector((state) => state.globalRedux);
	const itemGroups = useSelector((state) => state?.globalRedux.itemGroups);
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const column = [
		{
			title: 'ITEM GROUP NAME',
			dataIndex: 'itemGroupName',
			key: 'itemGroupName',
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
			dataIndex: 'itemGroupName',
			key: 'itemGroupName',
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
			setItemGroupModal(true);
		}
	};

	const handleRemove = (id) => {
		let url = `${SERVER_IP}itemgroup/${id}?orgId=${globalRedux?.selectedOrganization?._id}`;
		dispatch(deleteApi('DELETE_ITEM_GROUP', url));
	};

	const handleSubmit = (values) => {
		let data = {
			...values,
			orgId: globalRedux?.selectedOrganization?._id,
		};
		if (editData) {
			let url = `${SERVER_IP}itemgroup/${editData._id}?orgId=${globalRedux?.selectedOrganization?._id}`;
			dispatch(putApi(data, 'EDIT_ITEM_GROUP', url));
		} else {
			dispatch(postApi(data, 'ADD_ITEM_GROUP'));
		}
	};

	const handleEdit = (values) => {
		let data = {
			...values,
			orgId: globalRedux?.selectedOrganization?._id,
			itemGroupName: values?.itemGroupName || '',
			remarks: values?.remarks || ''
		};
		setEditData(data);
	};

	const getItemGroups = useCallback(() => {
		let url = `${SERVER_IP}itemgroup/?orgId=${globalRedux?.selectedOrganization?._id}`;
		dispatch(getApi('GET_ITEM_GROUPS', url));
	}, [dispatch, globalRedux?.selectedOrganization?._id]);

	useEffect(() => {
		getItemGroups();
	}, [getItemGroups]);

	useEffect(() => {
		if ((itemGroups || [])?.length > 0) {
			setTableData(itemGroups);
		}
	}, [itemGroups]);

	useEffect(() => {
		if (editData) {
			form.setFieldsValue({
				itemGroupName: editData?.itemGroupName || '',
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
		if (globalRedux.apiStatus.ADD_ITEM_GROUP === 'SUCCESS' || globalRedux.apiStatus.EDIT_ITEM_GROUP === 'SUCCESS') {
			dispatch(resetApiStatus(editData ? 'EDIT_ITEM_GROUP' : 'ADD_ITEM_GROUP'));
			setAddFormVisible(false);
			getItemGroups();
		}
	}, [globalRedux.apiStatus, editData, setItemGroupModal, dispatch, getItemGroups]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_ITEM_GROUP === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_ITEM_GROUP'));
			doIt = true;
		}
		if (doIt) {
			getItemGroups();
		}
	}, [globalRedux.apiStatus, dispatch, getItemGroups]);

	const loading = globalRedux.apiStatus.GET_ITEM_GROUPS === API_STATUS.PENDING;
	const buttonLoading = globalRedux.apiStatus.ADD_ITEM_GROUP === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_ITEM_GROUP === API_STATUS.PENDING;

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((itemGroup) => {
			return (
				(itemGroup?.itemGroupName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(itemGroup?.outstandingBalance || '')?.toString().toLowerCase().includes(searchKey.toLowerCase())
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
				placeholder="Select Item Group"
				dropdownRender={(menu) => (
					<div>
						<div
							style={{ display: 'flex', flexWrap: 'nowrap', cursor: 'pointer', background: '#6ebaff' }}
							onClick={() => {
								handleInputKeyDown();
							}}>
							<a href style={{ flex: 'none', color: '#fff', padding: '8px', display: 'block' }}>
								Add Item Group
							</a>
						</div>
						<Divider />
						{menu}
					</div>
				)}>
				{itemGroups?.map((itemGroup) => (
					<Select.Option key={itemGroup?._id} value={itemGroup?._id}>
						{itemGroup?.itemGroupName}
					</Select.Option>
				))}
			</Select>

			<Modal
				title={
					<Row>
						<Col span={24}>
							<Row>
								<Col span={24}>Item Groups</Col>
							</Row>
						</Col>
					</Row>
				}
				footer={null}
				onCancel={() => setItemGroupModal(false)}
				cancelButtonProps={{ onPress: () => setItemGroupModal(false) }}
				okText="Save"
				open={itemGroupModal}
				style={{ top: 0 }}
				width={'40%'}>
				<Row className="add-itemGroup">
					<Col span={24}>
						{addFormVisible && (
							<Row className="add-itemGroup-form">
								<Col span={24}>
									<Form
										name="add-staff"
										style={{}}
										requiredMark={false}
										colon={false}
										labelAlign="left"
										form={form}
										onFinish={handleSubmit}
										{...layer1FormCol}>
										<Row gutter={[10, 0]}>
											<Col span={15}>
												<Form.Item
													label="Item Group Name"
													name="itemGroupName"
													initialValue={editData?.itemGroupName}
													rules={[
														{
															required: true,
															message: 'This Field is Required!',
														},
													]}>
													<Input autoFocus placeholder="Item Group Name" />
												</Form.Item>
											</Col>
											<Col span={6}>
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
												placeholder="Search Item Group"
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

export default ItemGroupModal;
