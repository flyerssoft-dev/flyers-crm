import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Modal, Row, Col, Input, Form, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteOutlined } from '@ant-design/icons';
import TableComponent from 'components/table-component';
import { API_STATUS, NOTIFICATION_STATUS_TYPES, SERIAL_TYPE } from 'constants/app-constants';
import { SERVER_IP } from 'assets/Config';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { sendGetRequest } from 'redux/sagas/utils';
import { showToast } from 'helpers';
import './add-serial-modal.scss';

const layer1FormCol = {
	labelCol: {
		span: 24,
	},
	wrapperCol: {
		span: 24,
	},
};

const AddSerialModal = ({ visible, handleInputChange, selectedData, setSelectedData, serialType = SERIAL_TYPE.ADD }) => {
	const [, setAddSerialModal] = useState(false);
	const [searchKey] = useState('');
	const [checkingStock, setCheckingStock] = useState(false);
	const [addFormVisible, setAddFormVisible] = useState(false);
	const [editData, setEditData] = useState(null);
	const [tableData, setTableData] = useState(selectedData?.serials || []);
	const globalRedux = useSelector((state) => state.globalRedux);
	const units = useSelector((state) => state.globalRedux?.units);
	const [form] = Form.useForm();
	const inputRef = useRef(null);
	const dispatch = useDispatch();
	const column = [
		{
			title: 'Serial',
			dataIndex: 'serial',
			key: 'serial',
			width: '20%',
			align: 'left',
		},
		{
			title: 'Delete',
			dataIndex: 'serial',
			key: 'serial',
			width: '10%',
			align: 'center',
			render: (value, record) => (
				<Row className="show-on-hover" justify="center">
					{/* <Col span={6} onClick={() => handleEdit(record)}>
						<EditOutlined />
					</Col> */}
					<Col span={6} className="delete" style={{ cursor: 'pointer' }} onClick={() => handleRemove(value)}>
						<DeleteOutlined />
					</Col>
				</Row>
			),
		},
	];

	useEffect(() => {
		if (inputRef?.current && visible) {
			setTimeout(() => {
				inputRef?.current?.focus();
			}, 100);
		}
	}, [visible]);

	const handleRemove = async (value) => {
		try {
			const res = await validateStock(globalRedux?.selectedOrganization?._id, selectedData?.itemId, value);

			if (!res?.data?.stockExist) {
				const filteredData = tableData?.filter((data) => data?.serial !== value);
				setTableData([...filteredData]);
				handleInputChange('serials', [...filteredData], selectedData?.id);
			} else if (res?.data?.stockExist && res?.data?.status === 'InStock') {
				const filteredData = tableData?.filter((data) => data?.serial !== value);
				setTableData([...filteredData]);
				handleInputChange('serials', [...filteredData], selectedData?.id);
			} else if (res?.data?.stockExist && res?.data?.status !== 'InStock') {
				showToast('Stock Removal Failed.', 'Stock does not exist!', NOTIFICATION_STATUS_TYPES.ERROR, 'top-center');
			} else {
				showToast('Stock Removal Failed.', res?.data?.status, NOTIFICATION_STATUS_TYPES.ERROR, 'top-center');
			}
		} catch (error) {
			console.error('Error removing serial:', error);
			showToast('Error', 'Something went wrong while checking stock!', NOTIFICATION_STATUS_TYPES.ERROR, 'top-center');
		}
	};

	const validateStock = async (orgId, itemId, serial) => {
		try {
			const url = `${SERVER_IP}stock/validate?orgId=${orgId}&itemId=${itemId}&serial=${serial}`;
			return await sendGetRequest(null, url);
		} catch (error) {
			console.error('Error validating stock:', error);
			return null;
		}
	};

	const handleSubmit = async (values) => {
		console.log('🚀 ~ handleSubmit ~ values:', selectedData, values);

		try {
			setCheckingStock(true);
			const res = await validateStock(globalRedux?.selectedOrganization?._id, selectedData?.itemId, values?.serial);
			setCheckingStock(false);

			const allowAdd = serialType === SERIAL_TYPE.ADD ? !res?.data?.stockExist : res?.data?.stockExist;

			if (allowAdd) {
				handleInputChange('serials', [...tableData, values], selectedData?.id);
				setTableData([...tableData, values]);
				form.resetFields();
			} else {
				showToast(
					'Adding Failed.',
					serialType === SERIAL_TYPE.ADD ? 'Stock already exists!!' : 'Stock not found!!',
					NOTIFICATION_STATUS_TYPES.ERROR,
					'top-center'
				);
			}
			inputRef?.current?.focus();
		} catch (err) {
			setCheckingStock(false);
		}
	};

	// console.log('🚀 ~ file: index.js:84 ~ handleSubmit ~ tableData:', tableData);

	const getUnits = useCallback(() => {
		let url = `${SERVER_IP}unit?orgId=${globalRedux?.selectedOrganization?._id}`;
		dispatch(getApi('GET_UNITS', url));
	}, [dispatch, globalRedux?.selectedOrganization?._id]);

	// const handleModifySerials = () => {
	// const newData = tableDataProps?.map((data) => ({
	// 	...data,
	// 	...(data?.id === selectedData?.id && {
	// 		serials: tableData,
	// 	}),
	// }));
	// setSelectedData(null);
	// };

	useEffect(() => {
		if ((units || [])?.length > 0) {
			setTableData(units);
		}
	}, [units]);

	useEffect(() => {
		if (!visible) {
			setTableData([]);
		} else {
			setTableData(selectedData?.serials);
		}
	}, [visible]);

	useEffect(() => {
		if (editData) {
			form.setFieldsValue({
				serial: editData?.serial || '',
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
	}, [globalRedux.apiStatus, editData, setAddSerialModal, dispatch, getUnits]);

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
	// const buttonLoading = globalRedux.apiStatus.ADD_UNIT === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_UNIT === API_STATUS.PENDING;

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((unit) => {
			return (unit?.serial || '')?.toLowerCase().includes(searchKey.toLowerCase());
		});
	}, [tableData, searchKey]);

	const serialNos = useMemo(() => (tableData || []).map((data) => data?.serial), [tableData]);
	// console.log('🚀 ~ file: index.js:197 ~ serialNos:', serialNos);

	return (
		<Modal
			className='add-serial-modal'
			title={
				<Row>
					<Col span={24}>
						<Row>
							<Col span={24}>Add Serials</Col>
						</Row>
					</Col>
				</Row>
			}
			// centered
			// footer={null}
			// onOk={handleModifySerials}
			onOk={() => {
				setSelectedData(null);
				setAddSerialModal(false);
			}}
			onCancel={() => {
				setSelectedData(null);
				setAddSerialModal(false);
			}}
			cancelButtonProps={{
				onPress: () => setSelectedData(null),
				style: {
					opacity: 0,
				},
			}}
			okText="Save & Close"
			open={visible}
			style={{ top: 0 }}
			width={'40%'}>
			<Row className="add-serials">
				<Col span={24}>
					<TableComponent
						className="custom-table"
						style={{ width: '100%' }}
						rowKey={(record) => record._id}
						dataSource={filteredData}
						columns={column}
						pagination={false}
						loading={loading}
						title={() => (
							<Row className="add-serials-form">
								<Col span={24}>
									<Form
										name="add-serials"
										style={{}}
										requiredMark={false}
										colon={false}
										labelAlign="left"
										form={form}
										onFinish={handleSubmit}
										{...layer1FormCol}>
										<Row gutter={[10, 0]}>
											<Col span={16}>
												<Form.Item
													// label="Unit Name"
													name="serial"
													initialValue={editData?.serial}
													rules={[
														{
															required: true,
															message: 'This Field is Required!',
														},
														() => ({
															validator(_, value) {
																// console.log(
																// 	'🚀 ~ file: text-modal.js:109 ~ validator ~ value > fieldToCheckWith[selectedData?.data?.field:',
																// 	 value,
																// 	 selectedData?.data?.record[fieldToCheckWith[selectedData?.data?.field]][selectedData?.data?.dataIndex]?.value
																// );
																if (serialNos.includes(value)) {
																	return Promise.reject(`Serial Numbers should not be same.`);
																}
																return Promise.resolve();
															},
														}),
													]}>
													<Input disabled={checkingStock} ref={inputRef} autoFocus placeholder="serial no" />
												</Form.Item>
											</Col>
											<Col span={8}>
												<Form.Item
													style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}
													wrapperCol={{
														span: 24,
													}}>
													<Row>
														<Button
															loading={checkingStock}
															disabled={checkingStock}
															type="primary"
															style={{ marginRight: 5, width: '100%' }}
															htmlType="submit">
															{editData ? 'Update' : 'Add'}
														</Button>
													</Row>
												</Form.Item>
											</Col>
										</Row>
									</Form>
								</Col>
							</Row>
						)}
					/>
				</Col>
			</Row>
		</Modal>
	);
};

export default AddSerialModal;
