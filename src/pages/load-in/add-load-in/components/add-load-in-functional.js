import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Select, Input, InputNumber } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { DeleteOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import { SERVER_IP } from 'assets/Config';
import DatePicker from 'components/date-picker';
import { API_STATUS, DATE_FORMAT } from 'constants/app-constants';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { sendGetRequest } from 'redux/sagas/utils';
import { putApi } from 'redux/sagas/putApiSaga';
import AddLoadInPresentational from './add-load-in-presentational';

const { TextArea } = Input;

let itemDefaultRecord = {
	vendorId: null,
	partNumberId: null,
	invoiceDate: null,
	invoiceQty: null,
	invoiceWeight: null,
	taxableValue: null,
	taxValue: null,
	totalValue: null,
	remarks: '',
	id: uuidv4(),
};

const AddLoadInFunctional = ({ state, setState, refreshList, editData }) => {
	const [form] = Form.useForm();
	const [tableData, setTableData] = useState([{ ...itemDefaultRecord, id: uuidv4() }]);
	const [searchList, setSearchList] = useState({
		data: [],
		loading: false,
		searchString: '',
	});
	const [receiptState, setReceiptState] = useState({
		studentId: null,
		receiptDate: moment(),
	});
	const globalRedux = useSelector((state) => state.globalRedux);
	const vendors = useSelector((state) => globalRedux?.vendors);
	const partNumbers = useSelector((state) => globalRedux?.partNumbers);
	const { classes = [] } = globalRedux;
	const dispatch = useDispatch();

	const generateTableData = (editData) => {
		if (editData?.receiptDetails?.length > 0) {
			const data = editData?.receiptDetails.map((item) => ({
				categoryId: item?.categoryId?.id || '',
				transactionType: item?.transactionType || '',
				accbookId: item?.accbookId?.id || '',
				amount: item?.amount || '',
				particulars: item?.particulars || '',
				id: uuidv4(),
			}));
			setTableData(data);
		}
	};

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_LOAD_IN === API_STATUS.SUCCESS || globalRedux.apiStatus.EDIT_RECEIPT === API_STATUS.SUCCESS) {
			setState((state) => ({ ...state, visible: false }));
			refreshList();
			dispatch(resetApiStatus(editData ? 'EDIT_RECEIPT' : 'ADD_LOAD_IN'));
		}
		if (editData) {
			generateTableData(editData);
			form.setFieldsValue({
				vehicleId: editData?.vehicleId,
				loadDate: editData?.loadDate,
				driverName: editData?.driverName,
				driverMobile: editData?.driverMobile,
			});
		}
		!editData && setTableData([{ ...itemDefaultRecord, id: uuidv4() }]);
	}, [globalRedux.apiStatus, editData, dispatch, form, refreshList, setState]);

	const handleRowClick = (data) => {
		form.setFieldsValue({
			customerName: data?.displayName,
			mobile: data?.contact,
		});
	};

	const handleSubmit = (values) => {
		const request = {
			orgId: globalRedux?.selectedOrganization?._id,
			...values,
			driverMobile: values.driverMobile.toString(),
			loadDetails: tableData
				.filter((data) => data.vendorId)
				.map(({ vendorId, partNumberId, invoiceDate, invoiceQty, invoiceWeight, taxableValue, taxValue, totalValue, remarks }) => ({
					vendorId,
					partNumberId,
					invoiceDate,
					invoiceQty: invoiceQty ?? 0,
					invoiceWeight: invoiceWeight ?? 0,
					taxValue: taxValue ?? 0,
					taxableValue: taxableValue ?? 0,
					totalValue: parseFloat(taxValue ?? 0) + parseFloat(taxableValue ?? 0),
					remarks,
				})),
		};

		editData ? dispatch(putApi(request, 'EDIT_RECEIPT', `${SERVER_IP}load/${editData?._id}`)) : dispatch(postApi(request, 'ADD_LOAD_IN'));
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
		setReceiptState({
			...receiptState,
			studentId: selectedValue,
		});
	};

	const handleInputChange = useCallback(
		(label, value, rowId) => {
			const data = tableData.map((data) => {
				if (data.id === rowId) {
					return {
						...data,
						[label]: value,
					};
				} else {
					return data;
				}
			});
			setTableData([...data]);
		},
		[tableData]
	);

	const columns = [
		{
			title: 'Vendor',
			dataIndex: 'vendorId',
			key: 'vendorId',
			width: '10%',
			align: 'center',
			render: (value, record) => (
				<Select value={value} style={{ width: '100%' }} onChange={(value) => handleInputChange('vendorId', value, record?.id)}>
					{vendors?.map((vendor) => (
						<Select.Option value={vendor._id}>{vendor?.vendorName}</Select.Option>
					))}
				</Select>
			),
		},
		{
			title: 'Part Number',
			dataIndex: 'partNumberId',
			key: 'partNumberId',
			width: '10%',
			align: 'center',
			render: (value, record) => (
				<Select value={value} style={{ width: '100%' }} onChange={(value) => handleInputChange('partNumberId', value, record?.id)}>
					{partNumbers?.map((partNumber) => (
						<Select.Option value={partNumber._id}>{partNumber?.partNumber}</Select.Option>
					))}
				</Select>
			),
		},
		{
			title: 'Invoice Date',
			dataIndex: 'invoiceDate',
			key: 'invoiceDate',
			align: 'center',
			width: '10%',
			render: (value, record) => (
				<DatePicker
					style={{ width: '100%' }}
					onChange={(value) => handleInputChange('invoiceDate', value, record?.id)}
					value={value}
					format={DATE_FORMAT.DD_MM_YYYY}
				/>
			),
		},
		{
			title: 'Invoice Qty',
			dataIndex: 'invoiceQty',
			key: 'invoiceQty',
			width: '10%',
			render: (value, record) => (
				<InputNumber
					style={{ width: '100%' }}
					pattern="^-?[0-9]\d*\.?\d*$"
					value={value}
					className={`${record?.vendorId && !value ? 'error' : ''}`}
					onChange={(value) => handleInputChange('invoiceQty', parseFloat(value), record?.id)}
				/>
			),
		},
		{
			title: 'Invoice Weight',
			dataIndex: 'invoiceWeight',
			key: 'invoiceWeight',
			width: '10%',
			render: (value, record) => (
				<InputNumber
					style={{ width: '100%' }}
					pattern="^-?[0-9]\d*\.?\d*$"
					value={value}
					className={`${record?.vendorId && !value ? 'error' : ''}`}
					onChange={(value) => handleInputChange('invoiceWeight', parseFloat(value), record?.id)}
				/>
			),
		},
		{
			title: 'Taxable Value',
			dataIndex: 'taxableValue',
			key: 'taxableValue',
			width: '10%',
			render: (value, record) => (
				<InputNumber
					style={{ width: '100%' }}
					pattern="^-?[0-9]\d*\.?\d*$"
					value={value}
					className={`${record?.vendorId && !value ? 'error' : ''}`}
					onChange={(value) => handleInputChange('taxableValue', parseFloat(value), record?.id)}
				/>
			),
		},
		{
			title: 'Tax Value',
			dataIndex: 'taxValue',
			key: 'taxValue',
			width: '10%',
			render: (value, record) => (
				<InputNumber
					style={{ width: '100%' }}
					pattern="^-?[0-9]\d*\.?\d*$"
					value={value}
					className={`${record?.vendorId && !value ? 'error' : ''}`}
					onChange={(value) => handleInputChange('taxValue', parseFloat(value), record?.id)}
				/>
			),
		},
		{
			title: 'Total Value',
			dataIndex: 'totalValue',
			key: 'totalValue',
			width: '10%',
			align: 'right',
			render: (value, record) => <span>{parseFloat(record?.taxValue ?? 0) + parseFloat(record?.taxableValue ?? 0)}</span>,
		},
		{
			title: 'Remarks',
			dataIndex: 'particulars',
			key: 'particulars',
			width: '15%',
			align: 'center',
			render: (value, record) => (
				<TextArea
					value={value}
					placeholder="particulars"
					onChange={({ target: { value } }) => handleInputChange('particulars', value, record?.id)}
				/>
			),
		},
		{
			title: '',
			dataIndex: 'item',
			key: 'item',
			align: 'center',
			width: '3%',
			render: (value, record) =>
				tableData.length > 1 && record?.vendorId ? <DeleteOutlined style={{ color: 'red' }} onClick={() => handleRemove(record.id)} /> : null,
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
	}, [tableData, setTableData]);

	useEffect(() => {
		const selectedList = tableData?.map((data) => data.accBookId).filter((data) => data);
		const filledList = tableData?.map((data) => data.vendorId).filter((data) => data);
		if (tableData?.length === filledList.length) {
			handleAddTableData();
		}
		return {
			selectedList,
		};
	}, [tableData, handleAddTableData]);

	const loading = globalRedux.apiStatus.ADD_LOAD_IN === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_RECEIPT === API_STATUS.PENDING;
	const totalAmount = useMemo(() => tableData.reduce((accum, item) => accum + item.amount, 0) || 0, [tableData]);

	return (
		<AddLoadInPresentational
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
				receiptState,
				setReceiptState,
				editData,
			}}
		/>
	);
};

export default AddLoadInFunctional;
