import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { Form, Select, Input, Divider } from 'antd';
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
import AddCompositePresentational from './add-composite-presentational';

const { Option } = Select;

let itemDefaultRecord = {
	itemId: null,
	qty: null,
	id: uuidv4(),
};

export const calculatePurchaseValues = (data) => {
	// const discount = data?.discount || '';
	const discountAmount = (data?.discount || 0) > 0 && (data?.discount || 0) !== '' ? ((data?.rate || 0) * data?.qty || 0) * ((data?.discount || 0) / 100) : data?.discountAmount || 0;
	const actualTotal = (data?.qty || 0) * (data?.rate || 0);
	const taxableValue = parseFloat(actualTotal - discountAmount).toFixed(2);
	const taxAmount = parseFloat((actualTotal - discountAmount) * (data?.taxRate / 100) || 0).toFixed(2);
	return {
		actualTotal,
		discountAmount: discountAmount,
		taxableValue,
		taxAmount,
		totalAmount: +taxableValue + +taxAmount,
	};
};

const AddCompositeFunctional = ({ state, setState, refreshList, editData }) => {
	const [showAddItemModal, setShowAddItemModal] = useState(false);
	const [selectedData, setSelectedData] = useState(null);
	const [form] = Form.useForm();
	const itemIdValue = Form.useWatch('itemId', form);
	const [tableData, setTableData] = useState([{ ...itemDefaultRecord, id: uuidv4() }]);
	// const [searchList, setSearchList] = useState({
	// 	data: [],
	// 	loading: false,
	// 	searchString: '',
	// });
	const [customerAddModal, setCustomerAddModal] = useState(false);
	const globalRedux = useSelector((state) => state.globalRedux);
	const items = useSelector((state) => state.itemRedux?.items || []);
	const customers = useSelector((state) => state.customerRedux?.customers || []);
	const dispatch = useDispatch();

	const generateTableData = useCallback(
		(editData) => {
			if (editData._id) {
				form.setFieldsValue({
					itemId: editData?.itemId?._id,
					date: moment(editData?.date),
					remarks: editData?.remarks,
				});
				if (editData?.items?.length > 0) {
					const data = editData.items.map((item) => ({
						itemId: item?.itemId?.id || '',
						qty: item?.isSerial ? item?.serials?.length : item?.qty || 0,
						// isSerial: item?.isSerial || false,
						// rate: item?.rate || '',
						// hsnSac: item?.hsnSac || '',
						// serials: (item?.serials || []).map((serial) => ({ serial })),
						// discount: item?.discount || 0,
						// taxRate: item?.taxRate || 0,
						// ...calculatePurchaseValues(item),
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

	const getCustomers = useCallback(() => {
		let url = `${SERVER_IP}customer?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(getApi('GET_CUSTOMERS', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	useEffect(() => {
		if (state?.visible) {
			getItems();
			getCustomers();
		}
	}, [getItems, getCustomers, state?.visible]);

	useEffect(() => {
		if (!state?.visible) {
			form.resetFields();
			setTableData([{ ...itemDefaultRecord, id: uuidv4() }]);
		}
	}, [state?.visible, form]);

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_COMPOSITE === API_STATUS.SUCCESS || globalRedux.apiStatus.EDIT_COMPOSITE === API_STATUS.SUCCESS) {
			setState((state) => ({ ...state, visible: false }));
			refreshList();
			form.resetFields();
			dispatch(resetApiStatus(editData ? 'EDIT_COMPOSITE' : 'ADD_COMPOSITE'));
		}
		if (editData) {
			generateTableData(editData);
		}
		!editData && setTableData([{ ...itemDefaultRecord, id: uuidv4() }]);
	}, [globalRedux.apiStatus, editData, refreshList, dispatch, setState, form, generateTableData]);

	const loading = globalRedux.apiStatus.ADD_COMPOSITE === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_COMPOSITE === API_STATUS.PENDING;
	const totalAmount = useMemo(() => tableData.reduce((accum, item) => accum + item.totalAmount, 0) || 0, [tableData]);
	const roundOff = getTheRoundOffValue(totalAmount);

	const handleSubmit = (values) => {
		const request = {
			orgId: globalRedux?.selectedOrganization?.id,
			...values,
			// subTotal: parseFloat(totalAmount).toFixed(2),
			// roundOff: roundOff?.remain || 0,
			// totalAmount: parseFloat(roundOff.value).toFixed(2),
			items: tableData
				.filter((data) => data.itemId)
				.map(({ itemId, hsnSac, rate, qty, discount, discountAmount, totalAmount, taxRate, taxAmount, serials, isSerial }) => ({
					itemId,
					qty,
					// serials: serials?.map((serial) => serial?.serial) || [],
					// hsnSac,
					// isSerial: isSerial || false,
					// rate: rate || 0,
					// discount: discount || 0,
					// discountAmount: discountAmount || 0,
					// taxRate: taxRate || 0,
					// taxAmount: taxAmount || 0,
					// totalAmount,
				})),
		};
		editData ? dispatch(putApi(request, 'EDIT_COMPOSITE', `${SERVER_IP}composite/${editData?._id}`)) : dispatch(postApi(request, 'ADD_COMPOSITE'));
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
					const taxAmount = item?.sellingPrice * qty * (item?.taxRate / 100) || 0;
					let updatedObj = data;
					updatedObj[label] = value;
					if (item) {
						updatedObj['isSerial'] = item?.isSerial;
						updatedObj['itemName'] = item?.itemName;
						updatedObj['hsnSac'] = item?.hsnSac;
						updatedObj['rate'] = item?.sellingPrice;
						updatedObj['qty'] = qty;
						updatedObj['taxRate'] = item?.taxRate || 0;
						updatedObj['totalAmount'] = item?.sellingPrice * qty + taxAmount;
						updatedObj['taxAmount'] = taxAmount;
					}
					// console.log(
					// 	"🚀 ~ file: add-purchase-functional.js:229 ~ data ~ label === 'discount' :",
					// 	label === 'discount',
					// 	value,
					// 	value === NaN,
					// 	value === 'NaN'
					// );
					if (label === 'discount' && isNaN(value)) {
						updatedObj['discountAmount'] = '';
					}
					if (label === 'serials') {
						updatedObj['qty'] = value?.length || 0;
					}
					updatedObj = {
						...updatedObj,
						...calculatePurchaseValues(updatedObj),
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

	useEffect(() => {
		itemIdValue && !editData?._id && handleResetTable();
	}, [itemIdValue, editData?._id]);

	const handleResetTable = () => {
		setTableData([{ ...itemDefaultRecord, id: uuidv4() }]);
	};

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
			align: 'left',
			render: (value, record) => (
				<Select
					showSearch
					optionFilterProp="children"
					filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
					{items
						?.filter((item) => item._id !== itemIdValue)
						?.map((item) => (
							<Option key={item?._id} value={item?._id}>
								{item?.itemName}
							</Option>
						))}
				</Select>
			),
		},
		{
			title: 'Quantity',
			dataIndex: 'qty',
			key: 'qty',
			width: '5%',
			align: 'right',
			render: (value, record) => (
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
		// {
		// 	title: 'Total',
		// 	dataIndex: 'totalAmount',
		// 	key: 'totalAmount',
		// 	width: '7%',
		// 	align: 'right',
		// 	render: (value, record) => parseFloat(value || 0).toFixed(2),
		// },
		{
			title: '',
			dataIndex: 'item',
			key: 'item',
			align: 'center',
			width: '5%',
			render: (value, record) => (tableData.length > 1 && record?.itemId ? <DeleteOutlined style={{ color: 'red' }} onClick={() => handleRemove(record.id)} /> : null),
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
			<AddCompositePresentational
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
					items,
				}}
			/>
			<AddItem {...{ showAddItemModal, setShowAddItemModal }} />
			<AddCustomer {...{ customerAddModal, setCustomerAddModal, refreshList: getCustomers, handleClose: () => setCustomerAddModal(false) }} />
		</>
	);
};

export default AddCompositeFunctional;
