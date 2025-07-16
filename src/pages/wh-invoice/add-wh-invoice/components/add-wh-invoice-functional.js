import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Form, Input, Switch } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { DeleteOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import { SERVER_IP } from 'assets/Config';
import { API_STATUS } from 'constants/app-constants';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { sendGetRequest } from 'redux/sagas/utils';
import { putApi } from 'redux/sagas/putApiSaga';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { getTheRoundOffValue } from 'helpers';
import { inWords } from 'services/Utils';
import AddWHInvoicePresentational from './add-wh-invoice-presentational';

let itemDefaultRecord = {
	isDirect: false,
	hsnSac: null,
	lrNumber: null,
	kgs: null,
	rate: null,
	totalAmount: 0,
	id: uuidv4(),
};

const AddWHInvoiceFunctional = ({ state, setState, refreshList, editData }) => {
	const [form] = Form.useForm();
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

	useEffect(() => {
		if (editData) {
			form.setFieldsValue({
				// ...state?.selectedRow,
				vendorId: editData?.vendorId?._id,
				billingAddress: editData?.billingAddress,
				poNumber: editData?.poNumber,
				gstin: editData?.gstin,
				notes: editData?.notes,
				invoiceDate: moment(editData?.invoiceDate),
			});
			setTableData(editData?.items?.map((data) => ({ ...data, id: uuidv4() })));
			setGstPercentage(parseInt(editData?.gstRate));
			setIsGstPercentageEnabled(editData?.isIgst);
		} else {
			form.resetFields();
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
		if (!state?.visible) {
			setTableData([{ ...itemDefaultRecord, id: uuidv4() }]);
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
			setState({ ...state, visible: false });
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
	}, [globalRedux.apiStatus, editData]);

	const handleRowClick = (data) => {
		form.setFieldsValue({
			customerName: data?.displayName,
			mobile: data?.contact,
		});
	};

	const { subTotal, cgst, sgst, igst, roundOff, totalAmount, amountInWords } = useMemo(() => {
		const subTotal = parseFloat(
			(tableData || [])?.reduce((acc, data) => acc + (data?.isDirect ? data?.totalAmount || 0 : (data?.kgs || 0) * (data?.rate || 0)), 0)
		).toFixed(2);
		const totalGST = parseFloat((subTotal * gstPercentage) / 100).toFixed(2);
		const cgst = isGstPercentageEnabled ? 0 : parseFloat(totalGST / 2).toFixed(2);
		const sgst = isGstPercentageEnabled ? 0 : parseFloat(totalGST / 2).toFixed(2);
		const igst = isGstPercentageEnabled ? totalGST : 0;
		// const igst = isGstPercentageEnabled ? totalGST : 0;
		// const cgst = parseFloat((parseFloat(subTotal) * (gstPercentage / 2)) / 100).toFixed(2);
		// const sgst = parseFloat((parseFloat(subTotal) * (gstPercentage / 2)) / 100).toFixed(2);
		// const igst = parseFloat(parseFloat(subTotal) * (18 / 100)).toFixed(2);
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
			totalAmount,
			amountInWords,
			gstRate: gstPercentage,
			isIgst: isGstPercentageEnabled,
			...values,
			totalAmount,
			invoiceType: 'Warehouse',
			items: tableData
				.filter((data) => data.hsnSac)
				.map((data, sno) => ({
					// ...data,
					sno: sno?.toString(),
					hsnSac: data?.hsnSac?.toString(),
					lrNumber: (data?.lrNumber || '')?.toString(),
					isDirect: data?.isDirect,
					...(data?.kgs && { kgs: (data?.kgs || 0)?.toString() }),
					...(data?.rate && { rate: (data?.rate || 0)?.toString() }),
					totalAmount: parseFloat(data?.isDirect ? data?.totalAmount || 0 : (data?.kgs || 0) * (data?.rate || 0))
						.toFixed(2)
						?.toString(),
					// totalAmount: parseFloat((data?.kgs || 0) * (data?.rate || 0))
					// 	.toFixed(2)
					// 	?.toString(),
				})),
		};
		editData ? dispatch(putApi(request, 'EDIT_INVOICE', `${SERVER_IP}invoice/${editData?._id}`)) : dispatch(postApi(request, 'ADD_INVOICE'));
		// console.log('🚀 ~ file: add-wh-invoice-functional.js ~ line 127 ~ handleSubmit ~ handleSubmit', request);
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
				if (data.id === rowId) {
					return {
						...data,
						[label]: value,
						...(label === 'isDirect' &&
							value && {
								kgs: null,
								rate: null,
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
		[tableData]
	);

	const columns = [
		{
			title: 'Order No',
			dataIndex: 'sno',
			key: 'sno',
			width: '5%',
			// align: 'right',
			render: (value, record, index) => <div>{index + 1}</div>,
		},
		{
			title: 'Is Direct?',
			dataIndex: 'isDirect',
			key: 'isDirect',
			width: '5%',
			// align: 'right',
			render: (value, record, index) => <Switch checked={value} onChange={(checked) => handleInputChange('isDirect', checked, record?.id)} />,
		},
		{
			title: 'HSNSAC',
			dataIndex: 'hsnSac',
			key: 'hsnSac',
			width: '10%',
			// align: 'right',
			render: (value, record) => (
				<Input
					type="number"
					pattern="^-?[0-9]\d*\\d*$"
					value={value}
					// disabled={!record?.hsnSac}
					placeholder="hsnSac"
					className={`${record?.hsnSac && !value ? 'error' : ''}`}
					onChange={({ target: { value } }) => handleInputChange('hsnSac', parseFloat(value), record?.id)}
				/>
			),
		},
		{
			title: 'LR Number',
			dataIndex: 'lrNumber',
			key: 'lrNumber',
			width: '10%',
			// align: 'right',
			render: (value, record) => (
				<Input
					type="number"
					pattern="^-?[0-9]\d*\\d*$"
					value={value}
					placeholder="lrNumber"
					onChange={({ target: { value } }) => handleInputChange('lrNumber', value, record?.id)}
				/>
			),
		},
		{
			title: 'KG',
			dataIndex: 'kgs',
			key: 'kgs',
			width: '10%',
			// align: 'right',
			render: (value, record) => (
				<Input
					type="number"
					pattern="^-?[0-9]\d*\.?\d*$"
					value={value}
					placeholder="kgs"
					disabled={!record?.hsnSac || record?.isDirect}
					className={`${record?.hsnSac && !record?.isDirect && !value ? 'error' : ''}`}
					onChange={({ target: { value } }) => handleInputChange('kgs', parseFloat(value), record?.id)}
				/>
			),
		},
		{
			title: 'Rate',
			dataIndex: 'rate',
			key: 'rate',
			width: '10%',
			render: (value, record) => (
				<Input
					type="number"
					pattern="^-?[0-9]\d*\.?\d*$"
					value={value}
					placeholder="rate"
					disabled={!record?.hsnSac || record?.isDirect}
					className={`${record?.hsnSac && !record?.isDirect && !value ? 'error' : ''}`}
					onChange={({ target: { value } }) => handleInputChange('rate', parseFloat(value), record?.id)}
				/>
			),
		},
		{
			title: 'Total Rs.',
			dataIndex: 'totalAmount',
			key: 'totalAmount',
			align: 'right',
			width: '5%',
			// render: (value, data) => (data?.isDirect ? value : parseFloat((data?.kgs || 0) * (data?.rate || 0)).toFixed(2)),
			render: (value, data) => (
				<Input
					type="number"
					pattern="^-?[0-9]\d*\.?\d*$"
					value={data?.isDirect ? value : parseFloat((data?.kgs || 0) * (data?.rate || 0)).toFixed(2)}
					disabled={!data?.isDirect}
					placeholder="rate"
					onChange={({ target: { value } }) => handleInputChange('totalAmount', parseFloat(value), data?.id)}
				/>
			),
			// render: (value, data) =>
			// 	data?.isDirect ? (
			// 		<Input
			// 			type="number"
			// 			pattern="^-?[0-9]\d*\.?\d*$"
			// 			value={value}
			// 			placeholder="rate"
			// 			onChange={({ target: { value } }) => handleInputChange('rowTotal', parseFloat(value), data?.id)}
			// 		/>
			// 	) : (
			// 		// <span>{tableData?.reduce((acc, data) => acc + data?.whousers + data?.amc + data?.others + data?.lrCharges, 0)}</span>
			// 		// <span>{value}</span>
			// 		<span>{parseFloat((data?.kgs || 0) * (data?.rate || 0)).toFixed(2)}</span>
			// 	),
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
		let data = [...tableData];
		data.push({
			...itemDefaultRecord,
			id: uuidv4(),
		});
		setTableData(data);
	}, [tableData]);

	const {} = useMemo(() => {
		const selectedList = tableData?.map((data) => data.accBookId).filter((data) => data);
		const filledList = tableData?.map((data) => data?.hsnSac && data?.kgs && data?.rate).filter((data) => data);
		if (tableData?.length === filledList.length) {
			handleAddTableData();
		}
		return {
			selectedList,
		};
	}, [tableData]);

	const loading = globalRedux.apiStatus.ADD_INVOICE === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_INVOICE === API_STATUS.PENDING;

	// const keyMap = {
	// 	NEW_ROW: { sequence: 4, action: 'ctrl+n' },
	// };

	// const keyHandlers = {
	// 	NEW_ROW: () => handleAddTableData,
	// };

	return (
		<AddWHInvoicePresentational
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
				isGstPercentageEnabled,
				setIsGstPercentageEnabled,
			}}
		/>
	);
};

export default AddWHInvoiceFunctional;
