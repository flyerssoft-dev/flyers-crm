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
import { getTheRoundOffValue } from 'helpers';
import AddEstimatePresentational from './add-estimate-presentational';
import AddCustomer from 'pages/customers/add-customer';
import AddItem from 'pages/items/add-item';

const { Option } = Select;

let itemDefaultRecord = {
	itemId: null,
	itemName: null,
	rate: null,
	qty: null,
	totalAmount: null,
	id: uuidv4(),
};

const AddEstimateFunctional = ({ state, setState, refreshList, editData }) => {
	const [showAddItemModal, setShowAddItemModal] = useState(false);
	const [form] = Form.useForm();
	const [tableData, setTableData] = useState([{ ...itemDefaultRecord, id: uuidv4() }]);
	const [searchList, setSearchList] = useState({
		data: [],
		loading: false,
		searchString: '',
	});
	const [estimateState, setEstimateState] = useState({});
	const [customerAddModal, setCustomerAddModal] = useState(false);
	const globalRedux = useSelector((state) => state.globalRedux);
	const items = useSelector((state) => state.itemRedux?.items || []);
	const customers = useSelector((state) => state.customerRedux?.customers || []);
	const { classes = [] } = globalRedux;
	const dispatch = useDispatch();

	const generateTableData = useCallback(
		(editData) => {
			if (editData._id) {
				form.setFieldsValue({
					customerId: editData?.customerId?._id,
					orderDate: moment(editData?.orderDate),
					dueDate: moment(editData?.dueDate),
					remarks: editData?.remarks,
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
			setTableData([{ ...itemDefaultRecord, id: uuidv4() }]);
		}
	}, [state?.visible, form]);

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_ESTIMATE === API_STATUS.SUCCESS || globalRedux.apiStatus.EDIT_ESTIMATE === API_STATUS.SUCCESS) {
			setState((state) => ({ ...state, visible: false }));
			refreshList();
			form.resetFields();
			dispatch(resetApiStatus(editData ? 'EDIT_ESTIMATE' : 'ADD_ESTIMATE'));
		}
		if (editData) {
			generateTableData(editData);
			setEstimateState({
				studentId: editData?.studentId?._id || '',
				receiptDate: editData?.receiptDate || '',
			});
		}
		!editData && setTableData([{ ...itemDefaultRecord, id: uuidv4() }]);
	}, [globalRedux.apiStatus, editData, refreshList, dispatch, setState, form, generateTableData]);

	const handleRowClick = (data) => {
		form.setFieldsValue({
			customerName: data?.displayName,
			mobile: data?.contact,
		});
	};

	const loading = globalRedux.apiStatus.ADD_ESTIMATE === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_ESTIMATE === API_STATUS.PENDING;
	const totalAmount = useMemo(() => tableData.reduce((accum, item) => accum + item.totalAmount, 0) || 0, [tableData]);
	const roundOff = getTheRoundOffValue(totalAmount);

	const handleSubmit = (values) => {
		const request = {
			orgId: globalRedux?.selectedOrganization?._id,
			...values,
			subTotal: parseFloat(totalAmount).toFixed(2),
			roundOff: roundOff?.remain || 0,
			totalAmount: parseFloat(roundOff.value).toFixed(2),
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
		editData ? dispatch(putApi(request, 'EDIT_ESTIMATE', `${SERVER_IP}order/${editData?._id}`)) : dispatch(postApi(request, 'ADD_ESTIMATE'));
	};

	const handleSearch = async (searchString) => {
		setSearchList({
			...searchList,
			searchString,
		});
		if (searchString) {
			setSearchList({
				...searchList,
				loading: true,
			});
			const { data } = await sendGetRequest(
				null,
				`${SERVER_IP}student/search?orgId=${globalRedux?.selectedOrganization?._id}&searchText=${searchString}`
			);
			setSearchList({
				...searchList,
				data,
				loading: false,
			});
		}
	};

	const debounceFn = debounce(handleSearch, 1000);

	const handleChange = (selectedValue) => {
		setEstimateState({
			...estimateState,
			studentId: selectedValue,
		});
	};

	const handleInputChange = useCallback(
		(label, value, rowId) => {
			let item = null;
			if (label === 'itemId') {
				item = items.find((item) => item._id === value);
			}
			const data = tableData.map((data) => {
				if (data.id === rowId) {
					const taxAmount = item?.sellingPrice * 1 * (item?.taxRate / 100) || 0;
					console.log('🚀 ~ file: add-estimate-functional.js:190 ~ data ~ taxAmount:', typeof item?.sellingPrice, typeof taxAmount);
					return {
						...data,
						[label]: value,
						...(item && {
							itemName: item?.itemName,
							rate: item?.sellingPrice,
							qty: 1,
							taxRate: item?.taxRate || 0,
							taxAmount,
							totalAmount: item?.sellingPrice * 1 + taxAmount,
						}),
						...(label === 'qty' && {
							totalAmount: data?.rate * value + data?.rate * value * (data?.taxRate / 100),
							taxAmount: parseFloat(data?.rate * value * (data?.taxRate / 100) || 0).toFixed(2),
						}),
						...(label === 'rate' && {
							totalAmount: value * data?.qty + value * data?.qty * (data?.taxRate / 100),
							taxAmount: parseFloat(value * data?.qty * (data?.taxRate / 100) || 0).toFixed(2),
						}),
					};
				} else {
					return data;
				}
			});
			setTableData([...data]);
		},
		[tableData, items]
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
			title: 'Quantity',
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
			width: '10%',
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
			render: (value, record) =>
				tableData.length > 1 && record?.itemId ? <DeleteOutlined style={{ color: 'red' }} onClick={() => handleRemove(record.id)} /> : null,
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
			<AddEstimatePresentational
				{...{
					state,
					setState,
					form,
					handleSubmit,
					handleRowClick,
					classes,
					loading,
					columns,
					tableData,
					debounceFn,
					searchList,
					handleChange,
					totalAmount,
					estimateState,
					setEstimateState,
					editData,
					customers,
					isValid,
					roundOff,
					setCustomerAddModal,
				}}
			/>
			<AddItem {...{ showAddItemModal, setShowAddItemModal }} />
			<AddCustomer {...{ customerAddModal, setCustomerAddModal, refreshList: getCustomers, handleClose: () => setCustomerAddModal(false) }} />
		</>
	);
};

export default AddEstimateFunctional;
