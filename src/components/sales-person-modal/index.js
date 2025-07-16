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
import './sales-person-model.scss';

const layer1FormCol = {
	labelCol: {
		span: 24,
	},
	wrapperCol: {
		span: 24,
	},
};

const SalesPersonModal = ({ value = null, onChange }) => {
	const [salesPersonModal, setSalesPersonModal] = useState(false);
	const [searchKey, setSearchKey] = useState('');
	const [addFormVisible, setAddFormVisible] = useState(false);
	const [editData, setEditData] = useState(null);
	const [tableData, setTableData] = useState([]);
	const selectRef = useRef(null);
	const globalRedux = useSelector((state) => state.globalRedux);
	const salesPersons = useSelector((state) => state?.globalRedux.salesPersons);
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const column = [
		{
			title: 'Display Name',
			dataIndex: 'displayName',
			key: 'displayName',
			width: '20%',
			align: 'left',
		},
		{
			title: 'Mobile',
			dataIndex: 'mobile',
			key: 'mobile',
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
			setSalesPersonModal(true);
		}
	};

	const handleRemove = (id) => {
		let url = `${SERVER_IP}salesperson/${id}?orgId=${globalRedux?.selectedOrganization?._id}`;
		dispatch(deleteApi('DELETE_SALES_PERSON', url));
	};

	const handleSubmit = (values) => {
		let data = {
			...values,
			orgId: globalRedux?.selectedOrganization?._id,
		};
		if (editData) {
			let url = `${SERVER_IP}salesperson/${editData._id}?orgId=${globalRedux?.selectedOrganization?._id}`;
			dispatch(putApi(data, 'EDIT_SALES_PERSON', url));
		} else {
			dispatch(postApi(data, 'ADD_SALES_PERSON'));
		}
	};

	const handleEdit = (values) => {
		let data = {
			...values,
			orgId: globalRedux?.selectedOrganization?._id,
			displayName: values?.displayName || '',
			mobile: values?.mobile || '',
		};
		setEditData(data);
	};

	const getSalesPersons = useCallback(() => {
		let url = `${SERVER_IP}salesperson/?orgId=${globalRedux?.selectedOrganization?._id}`;
		dispatch(getApi('GET_SALES_PERSONS', url));
	}, [dispatch, globalRedux?.selectedOrganization?._id]);

	useEffect(() => {
		if ((salesPersons || [])?.length > 0) {
			setTableData(salesPersons);
		}
	}, [salesPersons]);

	useEffect(() => {
		if (editData) {
			form.setFieldsValue({
				displayName: editData?.displayName || '',
				mobile: editData?.mobile || '',
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
		if (globalRedux.apiStatus.ADD_SALES_PERSON === 'SUCCESS' || globalRedux.apiStatus.EDIT_SALES_PERSON === 'SUCCESS') {
			dispatch(resetApiStatus(editData ? 'EDIT_SALES_PERSON' : 'ADD_SALES_PERSON'));
			setAddFormVisible(false);
			getSalesPersons();
		}
	}, [globalRedux.apiStatus, editData, setSalesPersonModal, dispatch, getSalesPersons]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_SALES_PERSON === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_SALES_PERSON'));
			doIt = true;
		}
		if (doIt) {
			getSalesPersons();
		}
	}, [globalRedux.apiStatus, dispatch, getSalesPersons]);

	const loading = globalRedux.apiStatus.GET_SALES_PERSONS === API_STATUS.PENDING;
	const buttonLoading = globalRedux.apiStatus.ADD_SALES_PERSON === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_SALES_PERSON === API_STATUS.PENDING;

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((category) => {
			return (category?.displayName || '')?.toLowerCase().includes(searchKey.toLowerCase()) || (category?.outstandingBalance || '')?.toString().toLowerCase().includes(searchKey.toLowerCase());
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
				placeholder="Select Sales Person"
				showSearch
				optionFilterProp="children"
				filterOption={(input, option) => option.children?.toLowerCase().includes(input.toLowerCase())}
				filterSort={(a, b) => a.children?.toLowerCase().localeCompare(b.children?.toLowerCase())}
				dropdownRender={(menu) => (
					<div>
						{menu}
						<Divider />
						<div style={{ display: 'flex', flexWrap: 'nowrap', cursor: 'pointer' }} onClick={() => handleInputKeyDown()}>
							<a style={{ flex: 'none', color: '#188dfa', padding: 8, display: 'block' }}>
								<PlusOutlined /> Sales Person
							</a>
						</div>
					</div>
				)}>
				{salesPersons?.map((salesPerson) => (
					<Select.Option key={salesPerson?._id} value={salesPerson?._id}>
						{salesPerson?.displayName}
					</Select.Option>
				))}
			</Select>
			<Modal
				title={
					<Row>
						<Col span={24}>
							<Row>
								<Col span={24}>Sales Persons</Col>
							</Row>
						</Col>
					</Row>
				}
				footer={null}
				onCancel={() => setSalesPersonModal(false)}
				cancelButtonProps={{ onPress: () => setSalesPersonModal(false) }}
				okText="Save"
				open={salesPersonModal}
				style={{ top: 0 }}
				width={'40%'}>
				<Row className="add-sales-person">
					<Col span={24}>
						{addFormVisible && (
							<Row className="add-sales-person-form">
								<Col span={24}>
									<Form name="add-staff" style={{}} requiredMark={false} colon={false} labelAlign="left" form={form} onFinish={handleSubmit} {...layer1FormCol}>
										<Row gutter={[10, 0]}>
											<Col span={15}>
												<Form.Item
													label="Staff Name"
													name="displayName"
													initialValue={editData?.displayName}
													rules={[
														{
															required: true,
															message: 'This Field is Required!',
														},
													]}>
													<Input autoFocus placeholder="Enter Staff name" />
												</Form.Item>
											</Col>
											<Col span={8}>
												<Form.Item
													label="Mobile"
													name="mobile"
													initialValue={editData?.mobile || ''}
													rules={[
														{
															required: true,
															message: 'This Field is Required!',
														},
													]}>
													<Input pattern="^-?[0-9]\d*\.?\d*$" placeholder="Mobile" type="number" maxLength={10} />
												</Form.Item>
											</Col>
										</Row>
										<Row gutter={[10, 0]}>
											<Col span={12}>
												<Form.Item
													// style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}
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
											<Input placeholder="Search Sales Person" suffix={<AiOutlineSearch />} onChange={({ target: { value } }) => setSearchKey(value)} />
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

export default SalesPersonModal;
