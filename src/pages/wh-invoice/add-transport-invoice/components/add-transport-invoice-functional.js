import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Form, Input } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { DeleteOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import { SERVER_IP } from 'assets/Config';
import { API_STATUS, DATE_FORMAT } from 'constants/app-constants';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { sendGetRequest } from 'redux/sagas/utils';
import { putApi } from 'redux/sagas/putApiSaga';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { getTheRoundOffValue } from 'helpers';
import { inWords } from 'services/Utils';
import DatePicker from 'components/date-picker';
import AddTransportInvoicePresentational from './add-transport-invoice-presentational';

let itemDefaultRecord = {
	isDirect: false,
	lrNumber: null,
	hsnSac: null,
	date: moment(),
	frightRs: null,
	frightKG: null,
	amcAmount: null,
	others: null,
	lrCharges: null,
	totalAmount: null,
	id: uuidv4(),
};

const AddTransportInvoiceFunctional = ({ state, setState, refreshList, editData }) => {
	const [form] = Form.useForm();
	const vendorIdValue = Form.useWatch('vendorId', form);
	const rateTypeValue = Form.useWatch('rateType', form);
	const [gstPercentage, setGstPercentage] = useState(0);
	const [isGstPercentageEnabled, setIsGstPercentageEnabled] = useState(false);
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
	const vendors = globalRedux?.vendors;
	const { classes = [] } = globalRedux;
	const dispatch = useDispatch();

	const updateRowValues = useCallback(
		(vendorDetails) => {
			const data = tableData.map((data) => {
				const isTransport = rateTypeValue === 'Transport';
				const ratePerKG = rateTypeValue === 'Transport' ? vendorDetails?.transportRate : vendorDetails?.warehouseRate;
				return {
					...data,
					frightRs: (data?.frightKG || 0) * ratePerKG || 0,
					hsnSac: isTransport ? '9965' : '996729',
				};
			});
			setTableData([...data]);
		},// eslint-disable-next-line
		[rateTypeValue]
	);

	const vendorDetails = useMemo(() => {
		const vendorDetails = vendors?.find((vendor) => vendor?._id === vendorIdValue);
		updateRowValues(vendorDetails);
		return vendorDetails;
	}, [vendorIdValue, updateRowValues, vendors]);

	const resetTableData = () => setTableData([{ ...itemDefaultRecord, id: uuidv4() }]);

	useEffect(() => {
		if (rateTypeValue) {
			if (rateTypeValue === 'Transport') {
				setGstPercentage(12);
			}
			if (rateTypeValue === 'Warehouse') {
				setGstPercentage(18);
			}
		}
	}, [rateTypeValue]);

	useEffect(() => {
		if (!state?.visible) {
			form.resetFields();
			resetTableData();
		}
	}, [state?.visible, form]);

	useEffect(() => {
		if (editData) {
			form.setFieldsValue({
				vendorId: editData?.vendorId?._id,
				billingAddress: editData?.billingAddress,
				poNumber: editData?.poNumber,
				gstin: editData?.gstin,
				notes: editData?.notes,
				invoiceDate: moment(editData?.invoiceDate),
				department: editData?.department,
				rateType: editData?.rateType,
			});
			setTableData(editData?.transportItems?.map((data) => ({ ...data, date: moment(data?.date), id: uuidv4() })));
			setGstPercentage(parseInt(editData?.gstRate));
			setIsGstPercentageEnabled(editData?.isIgst);
		} else {
			form.resetFields();
			resetTableData();
		}
	}, [editData, form]);

	const getVendor = useCallback(() => {
		let url = `${SERVER_IP}vendor?orgId=${globalRedux.selectedOrganization._id}`;
		dispatch(getApi('GET_VENDORS', url));
	}, [dispatch, globalRedux.selectedOrganization._id]);

	useEffect(() => {
		getVendor();
	}, [getVendor]);

	useEffect(() => {
		if(!state?.visible) {
			setTableData([{ ...itemDefaultRecord, id: uuidv4() }])
		}
	}, [state?.visible]);

	const generateTableData = (editData) => {
		if (editData?.receiptDetails?.length > 0) {
			const data = editData.receiptDetails.map((item) => ({
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

	const handleVendorSelect = (vendorId) => {
		const vendor = vendors?.find((vendor) => {
			return vendor?._id === vendorId;
		});
		form.setFieldsValue({
			billingAddress: vendor?.billingAddress || '',
			gstin: vendor?.gstin,
		});
	};

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_INVOICE === API_STATUS.SUCCESS || globalRedux.apiStatus.EDIT_INVOICE === API_STATUS.SUCCESS) {
			setState(state=>({ ...state, visible: false }));
			form.resetFields();
			refreshList();
			dispatch(resetApiStatus(editData ? 'EDIT_INVOICE' : 'ADD_INVOICE'));
		}
		if (editData) {
			generateTableData(editData);
			setReceiptState({
				studentId: editData?.studentId?._id || '',
				receiptDate: editData?.receiptDate || '',
			});
		}
		// !editData && setTableData([{ ...itemDefaultRecord, id: uuidv4() }]);
	}, [globalRedux.apiStatus, editData, refreshList, setState, dispatch, form]);

	const handleRowClick = (data) => {
		form.setFieldsValue({
			customerName: data?.displayName,
			mobile: data?.contact,
		});
	};

	const { subTotal, cgst, sgst, igst, roundOff, totalAmount, amountInWords } = useMemo(() => {
		const subTotal = parseFloat(
			(tableData || [])?.reduce(
				(acc, data) => acc + parseFloat((data?.frightRs || 0) + (data?.amcAmount || 0) + (data?.others || 0) + (data?.lrCharges || 0)),
				0
			)
		).toFixed(2);
		const totalGST = parseFloat((subTotal * gstPercentage) / 100).toFixed(2);
		const cgst = isGstPercentageEnabled ? 0 : parseFloat(totalGST / 2).toFixed(2);
		const sgst = isGstPercentageEnabled ? 0 : parseFloat(totalGST / 2).toFixed(2);
		const igst = isGstPercentageEnabled ? totalGST : 0;
		const grandTotal = parseFloat(subTotal) + parseFloat(igst) + parseFloat(sgst) + parseFloat(cgst);
		const roundOff = getTheRoundOffValue(grandTotal || 0);
		const amountInWords = inWords(roundOff.value);

		return {
			subTotal,
			cgst,
			sgst,
			igst,
			roundOff: roundOff?.remain || 0,
			totalAmount: parseFloat(roundOff.value).toFixed(2),
			amountInWords,
		};
	}, [tableData, gstPercentage, isGstPercentageEnabled]);

	const handleSubmit = (values) => {
		const request = {
			orgId: globalRedux.selectedOrganization._id,
			placeOfSupply: 'TamilNadu',
			subTotal,
			cgst,
			sgst,
			igst,
			roundOff,
			amountInWords,
			gstRate: gstPercentage,
			isIgst: isGstPercentageEnabled,
			...values,
			totalAmount,
			items: [],
			invoiceType: 'Transport',
			transportItems: tableData
				.filter((data) => data.lrNumber)
				.map((data, sno) => ({
					sno: sno?.toString(),
					lrNumber: data?.lrNumber?.toString(),
					hsnSac: data?.hsnSac?.toString(),
					date: data?.date?.toString(),
					frightRs: data?.frightRs?.toString(),
					frightKG: data?.frightKG?.toString(),
					amcAmount: (data?.amcAmount || 0)?.toString(),
					others: data?.others?.toString(),
					lrCharges: data?.lrCharges?.toString(),
					totalAmount: parseFloat((data?.frightRs || 0) + (data?.amcAmount || 0) + (data?.others || 0) + (data?.lrCharges || 0))
						.toFixed(2)
						?.toString(),
				})),
		};
		editData ? dispatch(putApi(request, 'EDIT_INVOICE', `${SERVER_IP}invoice/${editData?._id}`)) : dispatch(postApi(request, 'ADD_INVOICE'));
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
				`${SERVER_IP}student/search?orgId=${globalRedux.selectedOrganization._id}&searchText=${searchString}`
			);
			setSearchList({
				...searchList,
				data,
				loading: false,
			});
		}
	};

	// eslint-disable-next-line
	const debounceFn = useCallback(debounce(handleSearch, 1000), []);
	
	const handleChange = (selectedValue) => {
		setReceiptState({
			...receiptState,
			studentId: selectedValue,
		});
	};

	const handleInputChange = useCallback(
		(label, value, rowId) => {
			const data = tableData.map((data) => {
				const ratePerKG = rateTypeValue === 'Transport' ? vendorDetails?.transportRate : vendorDetails?.warehouseRate;
				if (data.id === rowId) {
					return {
						...data,
						[label]: value,
						...(label === 'frightKG' && {
							frightRs: value * ratePerKG,
						}),
						// rowTotal: parseFloat((data?.kgs || 0) * (data?.rate || 0)).toFixed(2),
						// ...(label !== 'isDirect' && {
						// 	rowTotal: parseFloat((data?.kgs || 0) * (data?.rate || 0)).toFixed(2),
						// }),
					};
				} else {
					return data;
				}
			});
			setTableData([...data]);
		},
		[tableData, vendorDetails, rateTypeValue]
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
			title: 'LR Number',
			dataIndex: 'lrNumber',
			key: 'lrNumber',
			width: '8%',
			render: (value, record, index) => (
				<Input
					// type="number"
					// pattern="^-?[0-9]\d*\\d*$"
					// disabled={!record?.hsnSac}
					value={value}
					placeholder="lrNumber"
					className={`${!value ? 'error' : ''}`}
					onChange={({ target: { value } }) => handleInputChange('lrNumber', value, record?.id)}
				/>
			),
		},
		{
			title: 'HSNSAC',
			dataIndex: 'hsnSac',
			key: 'hsnSac',
			width: '10%',
			render: (value, record) => (
				<Input
					value={value}
					// disabled
					placeholder="hsnSac"
					// className={`${!value ? 'error' : ''}`}
					onChange={({ target: { value } }) => handleInputChange('hsnSac', value, record?.id)}
				/>
			),
		},
		{
			title: 'Date',
			dataIndex: 'date',
			key: 'date',
			width: '10%',
			render: (value, record) => (
				<DatePicker
					value={value}
					className={`${!value ? 'error' : ''}`}
					style={{ width: '100%' }}
					format={DATE_FORMAT.DD_MM_YYYY}
					onChange={(value) => handleInputChange('date', value === 'Invalid date' ? '' : value, record?.id)}
				/>
			),
		},
		{
			title: 'Fright Rs',
			dataIndex: 'frightRs',
			key: 'frightRs',
			width: '7%',
			// align: 'right',
			render: (value, record) => (
				<Input
					type="number"
					pattern="^-?[0-9]\d*\.?\d*$"
					value={value}
					disabled
					placeholder="frightRs"
					onChange={({ target: { value } }) => handleInputChange('frightRs', parseFloat(value), record?.id)}
				/>
			),
		},
		{
			title: 'Fright KG',
			dataIndex: 'frightKG',
			key: 'frightKG',
			width: '7%',
			// align: 'right',
			render: (value, record) => (
				<Input
					type="number"
					pattern="^-?[0-9]\d*\.?\d*$"
					value={value}
					placeholder="frightKG"
					// className={`${!value ? 'error' : ''}`}
					onChange={({ target: { value } }) => handleInputChange('frightKG', parseFloat(value), record?.id)}
				/>
			),
		},
		{
			title: 'Amc Amount',
			dataIndex: 'amcAmount',
			key: 'amcAmount',
			width: '10%',
			// align: 'right',
			render: (value, record) => (
				<Input
					type="number"
					pattern="^-?[0-9]\d*\.?\d*$"
					value={value}
					placeholder="amcAmount"
					// className={`${!value ? 'error' : ''}`}
					onChange={({ target: { value } }) => handleInputChange('amcAmount', parseFloat(value), record?.id)}
				/>
			),
		},
		{
			title: 'Others',
			dataIndex: 'others',
			key: 'others',
			width: '10%',
			// align: 'right',
			render: (value, record) => (
				<Input
					type="number"
					pattern="^-?[0-9]\d*\.?\d*$"
					value={value}
					placeholder="others"
					// className={`${!value ? 'error' : ''}`}
					onChange={({ target: { value } }) => handleInputChange('others', parseFloat(value), record?.id)}
				/>
			),
		},
		{
			title: 'LR Charges',
			dataIndex: 'lrCharges',
			key: 'lrCharges',
			width: '10%',
			// align: 'right',
			render: (value, record) => (
				<Input
					type="number"
					pattern="^-?[0-9]\d*\.?\d*$"
					value={value}
					placeholder="lrCharges"
					// className={`${!value ? 'error' : ''}`}
					onChange={({ target: { value } }) => handleInputChange('lrCharges', parseFloat(value), record?.id)}
				/>
			),
		},
		{
			title: 'Total Rs.',
			dataIndex: 'totalAmount',
			key: 'totalAmount',
			align: 'right',
			width: '5%',
			render: (value, data) =>
				parseFloat((data?.frightRs || 0) + (data?.amcAmount || 0) + (data?.others || 0) + (data?.lrCharges || 0)).toFixed(2),
		},
		{
			title: '',
			dataIndex: 'item',
			key: 'item',
			align: 'center',
			width: '3%',
			render: (value, record) =>
				tableData.length > 1 ? <DeleteOutlined style={{ color: 'red' }} onClick={() => handleRemove(record.id)} /> : null,
		},
	];

	const handleRemove = (id) => {
		const data = tableData.filter((data) => data.id !== id);
		setTableData([...data]);
	};

	const handleAddTableData = useCallback(() => {
		const isTransport = rateTypeValue === 'Transport';
		let data = [...tableData];
		data.push({
			...itemDefaultRecord,
			hsnSac: isTransport ? '9965' : '996729',
			id: uuidv4(),
		});
		setTableData(data);
	}, [tableData, rateTypeValue]);

	useMemo(() => {
		const filledList = tableData
			// ?.map((data) => data?.lrNumber && data?.hsnSac && data?.frightRs && data?.frightKG && data?.amcAmount)
			?.map((data) => data?.lrNumber)
			.filter((data) => data);
		if (tableData?.length === filledList.length) {
			handleAddTableData();
		}
	}, [tableData, handleAddTableData]);

	const loading = globalRedux.apiStatus.ADD_INVOICE === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_INVOICE === API_STATUS.PENDING;

	// const keyMap = {
	// 	NEW_ROW: { sequence: 4, action: 'ctrl+n' },
	// };

	// const keyHandlers = {
	// 	NEW_ROW: () => handleAddTableData,
	// };

	return (
		<AddTransportInvoicePresentational
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
				receiptState,
				setReceiptState,
				editData,
				vendors,
				handleVendorSelect,
				subTotal,
				cgst,
				sgst,
				igst,
				roundOff,
				totalAmount,
				amountInWords,
				gstPercentage,
				setGstPercentage,
				vendorDetails,
				rateTypeValue,
				isGstPercentageEnabled,
				setIsGstPercentageEnabled,
			}}
		/>
	);
};

export default AddTransportInvoiceFunctional;
