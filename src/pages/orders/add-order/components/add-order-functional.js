import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Select, Input, Divider } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import { SERVER_IP } from 'assets/Config';
import { API_STATUS } from 'constants/app-constants';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { sendGetRequest } from 'redux/sagas/utils';
import { putApi } from 'redux/sagas/putApiSaga';
import moment from 'moment';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { calculatePurchaseValues, getTheRoundOffValue } from 'helpers';
import AddOrderPresentational from './add-order-presentational';
import AddCustomer from 'pages/customers/add-customer';
import AddItem from 'pages/items/add-item';

const { Option } = Select;

let itemDefaultRecord = {
	itemId: null,
	itemName: null,
	rate: 0,
	qty: 0,
	totalAmount: null,
	id: uuidv4(),
};

const AddOrderFunctional = ({ state, setState, refreshList, editData }) => {
	const [showAddItemModal, setShowAddItemModal] = useState(false);
	const [form] = Form.useForm();
	const [tableData, setTableData] = useState([{ ...itemDefaultRecord, id: uuidv4() }]);
	const [orderInputDetails, setOrderInputDetails] = useState({
		shipping: 0,
		discount: 0,
	});
	const [customerAddModal, setCustomerAddModal] = useState(false);
	const globalRedux = useSelector((state) => state.globalRedux);
	const items = useSelector((state) => state.itemRedux?.items || []);
	const customers = useSelector((state) => state.customerRedux?.customers || []);
	const taxes = useSelector((state) => state?.globalRedux?.taxes || []);
	const dispatch = useDispatch();
	const taxPreferenceValue = Form.useWatch('taxPreference', form);
	const idForZeroTax = useMemo(() => taxes.find((tax) => tax.taxValue === 0)?._id, [taxes]);

	const generateTableData = useCallback(
		(editData) => {
			if (editData._id) {
				form.setFieldsValue({
					customerId: editData?.customerId?._id,
					orderDate: moment(editData?.orderDate),
					dueDate: moment(editData?.dueDate),
					remarks: editData?.remarks,
					taxPreference: editData?.taxPreference,
				});
				setOrderInputDetails({
					shipping: editData?.shipping ?? 0,
					discount: editData?.discount ?? 0,
				});
				if (editData?.items?.length > 0) {
					const data = editData.items.map((item) => ({
						itemId: item?.itemId?.id || '',
						itemName: item?.itemId?.itemName || '',
						rate: item?.rate || '',
						qty: item?.qty || '',
						taxRate: item?.taxRate || '',
						taxAmount: item?.taxAmount || '',
						totalAmount: item?.totalAmount || '',
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
		let url = `${SERVER_IP}customer?orgId=${globalRedux?.selectedOrganization?._id}`;
		dispatch(getApi('GET_CUSTOMERS', url));
	}, [dispatch, globalRedux?.selectedOrganization?._id]);

	useEffect(() => {
		if (state?.visible) {
			getItems();
			getCustomers();
		}
	}, [getItems, getCustomers, state?.visible]);

	useEffect(() => {
		if (!state?.visible) {
			form.resetFields();
			setOrderInputDetails({
				shipping: 0,
				discount: 0,
			});
			setTableData([{ ...itemDefaultRecord, id: uuidv4() }]);
		}
	}, [state?.visible, form]);

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_ORDER === API_STATUS.SUCCESS || globalRedux.apiStatus.EDIT_ORDER === API_STATUS.SUCCESS) {
			setState((state) => ({ ...state, visible: false }));
			refreshList();
			form.resetFields();
			setOrderInputDetails({
				shipping: 0,
				discount: 0,
			});
			dispatch(resetApiStatus(editData ? 'EDIT_ORDER' : 'ADD_ORDER'));
		}
		if (editData) {
			generateTableData(editData);
		}
	}, [globalRedux.apiStatus, editData, refreshList, dispatch, setState, form, generateTableData]);

	const loading = globalRedux.apiStatus.ADD_ORDER === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_ORDER === API_STATUS.PENDING;
	const totalAmount = useMemo(() => tableData.reduce((accum, item) => +accum + +item.totalAmount, 0) || 0, [tableData]);
	const roundOff = getTheRoundOffValue(totalAmount + Number(orderInputDetails?.shipping || 0) - (orderInputDetails?.discount ?? 0));

	const handleSubmit = (values) => {
		const request = {
			orgId: globalRedux?.selectedOrganization?._id,
			...values,
			subTotal: parseFloat(totalAmount).toFixed(2),
			roundOff: roundOff?.remain || 0,
			totalAmount: parseFloat(roundOff.value).toFixed(2),
			shipping: orderInputDetails?.shipping || 0,
			discount: orderInputDetails?.discount,
			items: tableData
				.filter((data) => data.itemId)
				.map(({ itemId, itemName, rate, qty, totalAmount, taxRate, taxAmount }) => ({
					itemId,
					itemName,
					rate: rate || 0,
					qty,
					totalAmount,
					taxRate: taxRate || 0,
					taxAmount: taxAmount || 0,
				})),
		};
		editData ? dispatch(putApi(request, 'EDIT_ORDER', `${SERVER_IP}order/${editData?._id}`)) : dispatch(postApi(request, 'ADD_ORDER'));
	};

	const handleInputChange = useCallback(
		(label, value, rowId) => {
			try {
				let item = null;
				let qty = 0;

				if (label === 'taxPreference') {
					const updatedTableData = tableData.map((data) => {
						return {
							...data,
							...calculatePurchaseValues(data, value),
						};
					});
					setTableData(updatedTableData);
					return;
				}
				if (label === 'itemId') {
					item = items.find((item) => item._id === value);
					qty = item?.isSerial ? 0 : 1;
				}
				const data = tableData.map((data) => {
					if (data.id === rowId) {
						console.log('🚀 ~ data item~ rowId:', item);
						const taxRateFromId = taxes.find((tax) => tax._id === item?.taxId?._id)?.taxValue || null;
						const sellingPrice = taxRateFromId ? item?.sellingPrice : 0; // if there is no taxPercentage don’t fill item rate, user will fill
						const taxAmount = sellingPrice * qty * (taxRateFromId / 100) || 0;
						let updatedObj = data;
						updatedObj[label] = value;
						if (item) {
							updatedObj['isSerial'] = item?.isSerial;
							updatedObj['itemName'] = item?.itemName;
							updatedObj['hsnSac'] = item?.hsnSac;
							updatedObj['rate'] = sellingPrice;
							updatedObj['qty'] = qty;
							updatedObj['taxRate'] = taxRateFromId || 0;
							updatedObj['taxId'] = item?.taxId?._id || idForZeroTax;
							updatedObj['totalAmount'] = sellingPrice * qty + taxAmount;
							updatedObj['taxAmount'] = taxAmount;
						}
						if (label === 'discount' && isNaN(value)) {
							updatedObj['discountAmount'] = '';
						}
						if (label === 'serials') {
							updatedObj['qty'] = value?.length || 0;
						}
						if (label === 'taxId') {
							const taxRate = taxes.find((tax) => tax._id === value)?.taxValue || 0;
							updatedObj['taxRate'] = taxRate;
							updatedObj['taxAmount'] = (updatedObj?.rate || 0) * (updatedObj?.qty || 0) * (taxRate / 100);
							updatedObj['totalAmount'] = (updatedObj?.rate || 0) * (updatedObj?.qty || 0) + updatedObj?.taxAmount;
						}
						updatedObj = {
							...updatedObj,
							...calculatePurchaseValues(updatedObj, taxPreferenceValue),
						};
						return updatedObj;
					} else {
						return data;
					}
				});
				setTableData([...data]);
			} catch (err) {
				console.log('🚀 ~ AddPurchaseFunctional ~ err:', err);
			}
		},
		[tableData, items, taxPreferenceValue, taxes, idForZeroTax]
	);

	const columns = [
		{
			title: 'S No',
			dataIndex: 'sno',
			key: 'sno',
			width: '5%',
			render: (value, record, index) => <div>{index + 1}</div>,
		},
		{
			title: 'Item',
			dataIndex: 'itemId',
			key: 'itemId',
			width: '20%',
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
					{items?.map((item) => (
						<Option key={item?._id} value={item?._id}>
							{item?.itemName}
						</Option>
					))}
				</Select>
			),
		},
		{
			title: 'Qty',
			dataIndex: 'qty',
			key: 'qty',
			width: '10%',
			align: 'right',
			render: (value, record) => (
				<Input
					autoFocus
					type="number"
					pattern="^-?[0-9]\d*\.?\d*$"
					value={value}
					placeholder="qty"
					disabled={!record?.itemId}
					style={{ textAlign: 'right' }}
					className={`${record?.itemId && !value ? 'error' : ''}`}
					onChange={({ target: { value } }) => handleInputChange('qty', parseFloat(value), record?.id)}
				/>
			),
		},
		{
			title: 'Rate',
			dataIndex: 'rate',
			key: 'rate',
			width: '15%',
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
			title: 'Tax',
			dataIndex: 'taxRate',
			key: 'taxRate',
			width: '5%',
			align: 'right',
			render: (value, record) => <span>{value || 0}%</span>,
		},
		{
			title: 'Tax Value',
			dataIndex: 'taxAmount',
			key: 'taxAmount',
			width: '5%',
			align: 'right',
			render: (value, record) => <span>{parseFloat(value || 0).toFixed(2)}</span>,
		},
		{
			title: 'Total',
			dataIndex: 'totalAmount',
			key: 'totalAmount',
			width: '10%',
			align: 'right',
			render: (value, record) => parseFloat(value || 0).toFixed(2),
		},
		{
			title: '',
			dataIndex: 'item',
			key: 'item',
			align: 'center',
			width: '5%',
			render: (value, record) => (tableData.length > 1 && record?.itemId ? <DeleteOutlined style={{ color: 'red' }} onClick={() => handleRemove(record.id)} /> : null),
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
			<AddOrderPresentational
				{...{
					state,
					setState,
					handleSubmit,
					columns,
					loading,
					tableData,
					editData,
					form,
					customers,
					isValid,
					totalAmount,
					roundOff,
					setCustomerAddModal,
					handleInputChange,
					orderInputDetails,
					setOrderInputDetails,
				}}
			/>
			<AddItem {...{ showAddItemModal, setShowAddItemModal }} />
			<AddCustomer {...{ customerAddModal, setCustomerAddModal, refreshList: getCustomers, handleClose: () => setCustomerAddModal(false) }} />
		</>
	);
};

export default AddOrderFunctional;
