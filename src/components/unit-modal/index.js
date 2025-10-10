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
import './unit-model.scss';

const layer1FormCol = {
	labelCol: {
		span: 24,
	},
	wrapperCol: {
		span: 24,
	},
};

const UnitModal = ({ value = null, onChange }) => {
	const [unitModal, setUnitModal] = useState(false);
	const [searchKey, setSearchKey] = useState('');
	const [addFormVisible, setAddFormVisible] = useState(false);
	const [editData, setEditData] = useState(null);
	const [tableData, setTableData] = useState([]);
	const selectRef = useRef(null);
	const globalRedux = useSelector((state) => state.globalRedux);
	const units = useSelector((state) => state.globalRedux?.units);
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const column = [
		{
			title: 'UNIT NAME',
			dataIndex: 'unitName',
			key: 'unitName',
			width: '20%',
			align: 'left',
		},
		{
			title: 'Delete',
			dataIndex: 'unitName',
			key: 'unitName',
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
			setUnitModal(true);
		}
	};

	const handleRemove = (id) => {
		let url = `${SERVER_IP}unit/${id}?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(deleteApi('DELETE_UNIT', url));
	};

	const handleSubmit = (values) => {
		let data = {
			...values,
			orgId: globalRedux?.selectedOrganization?.id,
		};
		if (editData) {
			let url = `${SERVER_IP}unit/${editData._id}?orgId=${globalRedux?.selectedOrganization?.id}`;
			dispatch(putApi(data, 'EDIT_UNIT', url));
		} else {
			dispatch(postApi(data, 'ADD_UNIT'));
		}
	};

	const handleEdit = (values) => {
		let data = {
			...values,
			orgId: globalRedux?.selectedOrganization?.id,
			unitName: values?.unitName || '',
		};
		setEditData(data);
	};

	const getUnits = useCallback(() => {
		let url = `${SERVER_IP}unit?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(getApi('GET_UNITS', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	useEffect(() => {
		if ((units || [])?.length > 0) {
			setTableData(units);
		}
	}, [units]);

	useEffect(() => {
		if (editData) {
			form.setFieldsValue({
				unitName: editData?.unitName || '',
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
		if (globalRedux.apiStatus.ADD_UNIT === 'SUCCESS' || globalRedux.apiStatus.EDIT_UNIT === 'SUCCESS') {
			dispatch(resetApiStatus(editData ? 'EDIT_UNIT' : 'ADD_UNIT'));
			setAddFormVisible(false);
			getUnits();
		}
	}, [globalRedux.apiStatus, editData, setUnitModal, dispatch, getUnits]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_UNIT === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_UNIT'));
			doIt = true;
		}
		if (doIt) {
			getUnits();
		}
	}, [globalRedux.apiStatus, dispatch, getUnits]);

	const loading = globalRedux.apiStatus.GET_UNITS === API_STATUS.PENDING;
	const buttonLoading = globalRedux.apiStatus.ADD_UNIT === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_UNIT === API_STATUS.PENDING;

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((unit) => {
			return (
				(unit?.unitName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(unit?.outstandingBalance || '')?.toString().toLowerCase().includes(searchKey.toLowerCase())
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
				placeholder="Select unit"
				dropdownRender={(menu) => (
					<div>
						<div
							style={{ display: 'flex', flexWrap: 'nowrap', cursor: 'pointer', background: '#6ebaff' }}
							onClick={() => {
								handleInputKeyDown();
							}}>
							<a href style={{ flex: 'none', color: '#fff', padding: '8px', display: 'block' }}>
								Add Unit
							</a>
						</div>
						<Divider />
						{menu}
					</div>
				)}>
				{units.map((unit) => (
					<Select.Option key={unit?._id} value={unit?._id}>
						{unit?.unitName}
					</Select.Option>
				))}
			</Select>

			<Modal
				title={
					<Row>
						<Col span={24}>
							<Row>
								<Col span={24}>Units</Col>
							</Row>
						</Col>
					</Row>
				}
				footer={null}
				onCancel={() => setUnitModal(false)}
				cancelButtonProps={{ onPress: () => setUnitModal(false) }}
				okText="Save"
				open={unitModal}
				style={{ top: 0 }}
				width={'40%'}>
				<Row className="add-unit">
					<Col span={24}>
						{addFormVisible && (
							<Row className="add-unit-form">
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
													label="Unit Name"
													name="unitName"
													initialValue={editData?.unitName}
													rules={[
														{
															required: true,
															message: 'This Field is Required!',
														},
													]}>
													<Input autoFocus placeholder="Unit name" />
												</Form.Item>
											</Col>
											<Col span={6}></Col>
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
												placeholder="Search Unit"
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

export default UnitModal;
