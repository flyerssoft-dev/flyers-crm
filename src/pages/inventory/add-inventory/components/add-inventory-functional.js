import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { Form, Select, Input, Divider, Button, Tooltip } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { SERVER_IP } from 'assets/Config';
import { API_STATUS } from 'constants/app-constants';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { putApi } from 'redux/sagas/putApiSaga';
import moment from 'moment';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { getTheRoundOffValue } from 'helpers';
import AddCustomer from 'pages/customers/add-customer';
import AddItem from 'pages/items/add-item';
import AddInventoryPresentational from './add-inventory-presentational';

const { Option } = Select;

let itemDefaultRecord = {
	itemId: null,
	isSerial: null,
	serials: [],
	qty: null,
	rate: null,
	totalAmount: null,
	id: uuidv4(),
};

export const calculateInventoryValues = (data) => {
	return {
		totalAmount: (data?.rate || 0) * (data?.qty || 0),
	};
};

const AddInventoryFunctional = ({ state, setState, refreshList, editData }) => {
	const [showAddItemModal, setShowAddItemModal] = useState(false);
	const [selectedData, setSelectedData] = useState(null);
	const [form] = Form.useForm();
	const [tableData, setTableData] = useState([{ ...itemDefaultRecord, id: uuidv4() }]);
	const [customerAddModal, setCustomerAddModal] = useState(false);
	const globalRedux = useSelector((state) => state.globalRedux);
	const items = useSelector((state) => state.itemRedux?.items || []);
	const customers = useSelector((state) => state.customerRedux?.customers || []);
	const dispatch = useDispatch();

	const generateTableData = useCallback(
		(editData) => {
			if (editData._id) {
				form.setFieldsValue({
					customerId: editData?.customerId?._id,
					billNumber: editData?.billNumber,
					billDate: moment(editData?.billDate),
					dueDate: moment(editData?.dueDate),
					poNumber: editData?.poNumber,
					dispatchThrough: editData?.dispatchThrough,
					trackingNumber: editData?.trackingNumber,
				});
				if (editData?.items?.length > 0) {
					const data = editData.items.map((item) => ({
						itemId: item?.itemId?.id || '',
						isSerial: item?.isSerial || false,
						rate: item?.rate || '',
						hsnSac: item?.hsnSac || '',
						qty: item?.isSerial ? item?.serials?.length : item?.qty || 0,
						serials: (item?.serials || []).map((serial) => ({ serial })),
						discount: item?.discount || 0,
						taxRate: item?.taxRate || 0,
						...calculateInventoryValues(item),
						id: uuidv4(),
					}));
					setTableData(data);
				}
			}
		},
		[setTableData, form]
	);

	const getItems = useCallback(() => {
		let url = `${SERVER_IP}item?orgId=${globalRedux.selectedOrganization._id}`;
		dispatch(getApi('GET_ITEMS', url));
	}, [dispatch, globalRedux.selectedOrganization._id]);

	useEffect(() => {
		state?.visible && getItems();
	}, [getItems, state?.visible]);

	const getCustomers = useCallback(() => {
		let url = `${SERVER_IP}customer?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(getApi('GET_CUSTOMERS', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	useEffect(() => {
		getCustomers();
	}, [getCustomers]);

	useEffect(() => {
		if (!state?.visible) {
			form.resetFields();
			setTableData([{ ...itemDefaultRecord, id: uuidv4() }]);
		}
	}, [state?.visible, form]);

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_INVENTORY === API_STATUS.SUCCESS || globalRedux.apiStatus.EDIT_INVENTORY === API_STATUS.SUCCESS) {
			setState((state) => ({ ...state, visible: false }));
			refreshList();
			form.resetFields();
			dispatch(resetApiStatus(editData ? 'EDIT_INVENTORY' : 'ADD_INVENTORY'));
		}
		if (editData) {
			generateTableData(editData);
		}
		!editData && setTableData([{ ...itemDefaultRecord, id: uuidv4() }]);
	}, [globalRedux.apiStatus, editData, refreshList, dispatch, setState, form, generateTableData]);

	const loading = globalRedux.apiStatus.ADD_INVENTORY === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_INVENTORY === API_STATUS.PENDING;
	const totalAmount = useMemo(() => tableData.reduce((accum, item) => accum + item.totalAmount, 0) || 0, [tableData]);
	const roundOff = getTheRoundOffValue(totalAmount);

	const handleSubmit = (values) => {
		const request = {
			orgId: globalRedux?.selectedOrganization?.id,
			...values,
			items: tableData
				.filter((data) => data.itemId)
				.map(({ itemId, rate, qty, totalAmount, serials, isSerial }) => ({
					itemId,
					serials: serials?.map((serial) => serial?.serial) || [],
					isSerial: isSerial || false,
					qty,
					rate: rate || 0,
					totalAmount,
				})),
		};
		editData ? dispatch(putApi(request, 'EDIT_INVENTORY', `${SERVER_IP}inventory/${editData?._id}`)) : dispatch(postApi(request, 'ADD_INVENTORY'));
	};

	// const handleSearch = async (searchString) => {
	// 	setSearchList({
	// 		...searchList,
	// 		searchString,
	// 	});
	// 	if (searchString) {
	// 		setSearchList({
	// 			...searchList,
	// 			loading: true,
	// 		});
	// 		const { data } = await sendGetRequest(
	// 			null,
	// 			`${SERVER_IP}student/search?orgId=${globalRedux?.selectedOrganization?.id}&searchText=${searchString}`
	// 		);
	// 		setSearchList({
	// 			...searchList,
	// 			data,
	// 			loading: false,
	// 		});
	// 	}
	// };

	const handleInputChange = useCallback(
		(label, value, rowId) => {
			let item = null;
			let qty = 0;
			if (label === 'itemId') {
				item = items.find((item) => item._id === value);
				qty = item?.isSerial ? 0 : 1;
			}
			const data = tableData.map((data) => {
				if (data.id === rowId) {
					let updatedObj = data;
					updatedObj[label] = value;
					if (item) {
						updatedObj['isSerial'] = item?.isSerial;
						updatedObj['rate'] = item?.sellingPrice;
						updatedObj['qty'] = qty;
						updatedObj['currentStock'] = item?.currentStock;
						updatedObj['totalAmount'] = item?.sellingPrice * qty;
					}
					if (label === 'serials') {
						updatedObj['qty'] = value?.length || 0;
					}
					updatedObj = {
						...updatedObj,
						...calculateInventoryValues(updatedObj),
					};
					return updatedObj;
				} else {
					return data;
				}
			});
			setTableData([...data]);
		},
		[tableData, items]
	);

	const groupData = useMemo(
		() =>
			_.chain(tableData?.filter((data) => data?.itemId))
				// Group the elements of Array based on `tax` property
				.groupBy('taxRate')
				// `key` is group's name (tax), `value` is the array of objects
				.map((value, key) => ({
					taxRate: key,
					data: value,
					taxAmount: value.reduce(function (acc, obj) {
						return +acc + +obj?.taxAmount;
					}, '0.00'),
					hsnSac: value[0]?.hsnSac,
					cgstPer: parseInt(key) / 2,
					cgstValue: parseFloat(
						value.reduce(function (acc, obj) {
							return +acc + +obj?.taxAmount;
						}, '0.00') / 2
					).toFixed(2),
					sgstPer: parseInt(key) / 2,
					sgstValue: parseFloat(
						value.reduce(function (acc, obj) {
							return +acc + +obj?.taxAmount;
						}, '0.00') / 2
					).toFixed(2),
					igstPer: '',
					igstValue: 0,
				}))
				.value(),
		[tableData]
	);

	const columns = [
		{
			title: 'S No',
			dataIndex: 'sno',
			key: 'sno',
			width: '3%',
			render: (value, record, index) => <div>{index + 1}</div>,
		},
		{
			title: 'Item',
			dataIndex: 'itemId',
			key: 'itemId',
			width: '15%',
			render: (value, record) => (
				<Select
					showSearch
					optionFilterProp="children"
					filterOption={(input, option) =>
						option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
						option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
					}
					value={value}
					style={{ width: '100%', textAlign: 'left' }}
					placeholder="Select"
					onChange={(value) => handleInputChange('itemId', value, record?.id)}
					dropdownRender={(menu) => (
						<div>
							{menu}
							<Divider />
							<div style={{ display: 'flex', flexWrap: 'nowrap', cursor: 'pointer' }} onClick={() => setShowAddItemModal(true)}>
								<a href style={{ flex: 'none', color: '#188dfa', padding: '8px', display: 'block' }}>
									<PlusOutlined /> Item
								</a>
							</div>
						</div>
					)}>
					{items?.map((item) => (
						<Option key={item?._id} value={item?._id}>
							{item?.itemName}
						</Option>
					))}
				</Select>
			),
		},
		{
			title: 'Current Stock',
			dataIndex: 'currentStock',
			key: 'currentStock',
			width: '7%',
		},
		{
			title: 'Quantity',
			dataIndex: 'qty',
			key: 'qty',
			width: '5%',
			align: 'right',
			render: (value, record) =>
				record?.isSerial ? (
					<Tooltip style={{ width: '100%' }} title={(record?.serials || [])?.map((serial) => serial?.serial).join(',')}>
						<Button
							style={{ width: '100%', textAlign: 'right' }}
							onClick={() => setSelectedData(record)}
							disabled={!record?.itemId}
							value="default">
							{record?.serials?.length || 0}
						</Button>
					</Tooltip>
				) : (
					<Input
						type="number"
						pattern="^-?[0-9]\d*\.?\d*$"
						value={record?.qty}
						placeholder="qty"
						disabled={!record?.itemId}
						style={{ textAlign: 'right', width: '100%' }}
						className={`${record?.itemId && !value ? 'error' : ''}`}
						onChange={({ target: { value } }) => handleInputChange('qty', parseFloat(value), record?.id)}
					/>
				),
		},
		{
			title: 'Rate',
			dataIndex: 'rate',
			key: 'rate',
			width: '7%',
			align: 'right',
			render: (value, record) => (
				<Input
					type="number"
					pattern="^-?[0-9]\d*\.?\d*$"
					value={value}
					placeholder="rate"
					disabled={!record?.itemId}
					style={{ textAlign: 'right' }}
					className={`${record?.itemId && !value ? 'error' : ''}`}
					onChange={({ target: { value } }) => handleInputChange('rate', parseFloat(value), record?.id)}
				/>
			),
		},
		{
			title: 'Total',
			dataIndex: 'totalAmount',
			key: 'totalAmount',
			width: '7%',
			align: 'right',
			render: (value, record) => parseFloat(value || 0).toFixed(2),
		},
		{
			title: '',
			dataIndex: 'item',
			key: 'item',
			align: 'center',
			width: '5%',
			render: (value, record) =>
				tableData.length > 1 && record?.itemId ? <DeleteOutlined style={{ color: 'red' }} onClick={() => handleRemove(record.id)} /> : null,
		},
	];

	const groupByColumns = [
		{
			title: 'S No',
			dataIndex: 'sno',
			key: 'sno',
			width: '10%',
			render: (value, record, index) => <div>{index + 1}</div>,
		},
		{
			title: 'HSNSAC',
			dataIndex: 'hsnSac',
			key: 'hsnSac',
			render: (value, record) => <span>{value}</span>,
		},
		{
			title: 'cgst%',
			dataIndex: 'cgstPer',
			key: 'cgstPer',
			align: 'right',
			render: (value, record) => <span>{value || 0}%</span>,
		},
		{
			title: 'cgst',
			dataIndex: 'cgstValue',
			key: 'cgstValue',
			align: 'right',
			render: (value, record) => <span>{value || 0}</span>,
		},
		{
			title: 'sgst%',
			dataIndex: 'sgstPer',
			key: 'sgstPer',
			align: 'right',
			render: (value, record) => <span>{value || 0}%</span>,
		},
		{
			title: 'sgst',
			dataIndex: 'sgstValue',
			key: 'sgstValue',
			align: 'right',
			render: (value, record) => <span>{value || 0}</span>,
		},
		{
			title: 'igst%',
			dataIndex: 'igstPer',
			key: 'igstPer',
			align: 'right',
			render: (value, record) => <span>{value || 0}%</span>,
		},
		{
			title: 'igst',
			dataIndex: 'igstValue',
			key: 'igstValue',
			align: 'right',
			render: (value, record) => <span>{value || 0}</span>,
		},
	];

	const handleRemove = (id) => {
		const data = tableData.filter((data) => data.id !== id);
		setTableData([...data]);
	};

	const handleAddTableData = useCallback(() => {
		let data = [...tableData];
		data.push({
			...itemDefaultRecord,
			id: uuidv4(),
		});
		setTableData(data);
	}, [tableData]);

	const { isValid } = useMemo(() => {
		// const selectedList = tableData?.map((data) => data.accBookId).filter((data) => data);
		const filledList = tableData?.map((data) => data.itemId).filter((data) => data);
		if (tableData?.length === filledList?.length) {
			handleAddTableData();
		}
		return {
			isValid: filledList?.length > 0,
		};
	}, [tableData, handleAddTableData]);

	return (
		<>
			<AddInventoryPresentational
				{...{
					state,
					setState,
					handleSubmit,
					columns,
					loading,
					editData,
					form,
					customers,
					isValid,
					totalAmount,
					roundOff,
					setCustomerAddModal,
					handleInputChange,
					selectedData,
					setSelectedData,
					tableData,
					setTableData,
					groupByColumns,
					groupData,
				}}
			/>
			<AddItem {...{ showAddItemModal, setShowAddItemModal }} />
			<AddCustomer {...{ customerAddModal, setCustomerAddModal, refreshList: getCustomers, handleClose: () => setCustomerAddModal(false) }} />
		</>
	);
};

export default AddInventoryFunctional;
