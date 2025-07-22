import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { SERVER_IP } from 'assets/Config';
import HighlightComponent from 'components/HighlightComponent';
import { sendGetRequest } from 'redux/sagas/utils';
import moment from 'moment';
import { DATE_FORMAT } from 'constants/app-constants';
import PaymentsListPresentational from './payments-list-presenatational';
import { Input, Form } from 'antd';
// import { getApi } from 'redux/sagas/getApiDataSaga';
const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const PaymentsListFunctional = React.memo(() => {
	const [selectedCustomer, setSelectedCustomer] = useState(null);
	const users = useSelector((state) => state?.userRedux?.users);
	const globalRedux = useSelector((state) => state.globalRedux);
	const classes = globalRedux?.classes || [];
	const [visible, toggleVisible] = useState(false);
	const [searchKey, setSearchKey] = useState('');
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const customers = useSelector((state) => state?.customerRedux?.customers);
	const [tableData, setTableData] = useState([]);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [extraAmount, setExtraAmount] = useState('');
	const [form] = Form.useForm();
	const amountReceivedValue = Form.useWatch('amountReceived', form);
	console.log('🚀 ~ file: payments-list-functional.js:29 ~ PaymentsListFunctional ~ amountReceivedValue:', amountReceivedValue);
	// const payments = useSelector((state) => state?.paymentRedux?.payments);
	// const dispatch = useDispatch();

	// const getPayments = useCallback(() => {
	// 	let url = `${SERVER_IP}invoice?orgId=${globalRedux?.selectedOrganization?.id}&customerId=${selectedCustomer}`;
	// 	dispatch(getApi('GET_PAYMENTS', url));
	// }, [dispatch, globalRedux?.selectedOrganization?.id, selectedCustomer]);

	// useEffect(() => {
	// 	getPayments();
	// }, [getPayments]);

	const handleSelectCustomer = (classId) => {
		setSelectedCustomer(classId);
	};

	useEffect(() => {
		async function fetchData() {
			if (selectedCustomer) {
				await setLoading(true);
				try {
					const {
						data: { data },
					} = await sendGetRequest(
						null,
						`${SERVER_IP}invoice?orgId=${globalRedux?.selectedOrganization?.id}&customerId=${selectedCustomer}`
					);
					setTableData(data);
				} catch (err) {
					setLoading(false);
				}
				await setLoading(false);
			}
		}
		fetchData();
	}, [selectedCustomer, globalRedux?.selectedOrganization?.id]);

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((record) => {
			return (
				(record?.ticketType || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.priority || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.customerName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.mobile || '')?.toLowerCase().includes(searchKey.toLowerCase())
			);
		});
	}, [tableData, searchKey]);

	const column = [
		{
			title: 'Date',
			dataIndex: 'invoiceDate',
			key: 'invoiceDate',
			fixed: 'left',
			width: '20%',
			render: (value) => (
				<HighlightComponent
					highlightClassName="highlightClass"
					searchWords={[searchKey]}
					autoEscape={true}
					textToHighlight={moment(value).format(DATE_FORMAT.DD_MM_YYYY)}
				/>
			),
		},
		{
			title: 'Invoice Number',
			dataIndex: 'invoiceNumber',
			key: 'invoiceNumber',
			fixed: 'left',
			width: '20%',
			render: (value) => (
				<HighlightComponent
					highlightClassName="highlightClass"
					searchWords={[searchKey]}
					autoEscape={true}
					textToHighlight={value?.toString()}
				/>
			),
		},
		{
			title: 'Invoice Amount',
			dataIndex: 'totalAmount',
			key: 'totalAmount',
			fixed: 'left',
			width: '20%',
			render: (value) => (
				<HighlightComponent
					highlightClassName="highlightClass"
					searchWords={[searchKey]}
					autoEscape={true}
					textToHighlight={value?.toString()}
				/>
			),
		},
		{
			title: 'Amount Due',
			dataIndex: 'totalAmount',
			key: 'totalAmount',
			fixed: 'left',
			width: '20%',
			render: (value) => (
				<HighlightComponent
					highlightClassName="highlightClass"
					searchWords={[searchKey]}
					autoEscape={true}
					textToHighlight={value?.toString()}
				/>
			),
		},
		{
			title: 'Payment',
			dataIndex: 'payment',
			key: 'payment',
			align: 'right',
			width: '20%',
			render: (value, record) => (
				<Input
					type="number"
					pattern="^-?[0-9]\d*\.?\d*$"
					value={value}
					placeholder="0.00"
					className={`textAlignRight ${record?.payment && !value ? 'error' : ''}`}
					// onChange={({ target: { value } }) => handleInputChange('payment', parseFloat(value), record?.id)}
				/>
			),
		},
	];

	const handleTableChange = (currentPage, pageSize) => {
		setCurrentPage(currentPage === 0 ? 1 : currentPage);
		setPageSize(pageSize);
	};

	const getStartingValue = () => {
		if (currentPage === 1) return 1;
		else {
			return (currentPage - 1) * pageSize + 1;
		}
	};

	const getEndingValue = () => {
		if (currentPage === 1) return tableData.length < pageSize ? tableData.length : pageSize;
		else {
			let end = currentPage * pageSize;
			return end > tableData.length ? tableData.length : end;
		}
	};

	// const tableLoading = useMemo(() => globalRedux.apiStatus.GET_TICKETS === API_STATUS.PENDING, [globalRedux.apiStatus]);

	const onSelectChange = (selectedRowKeys) => {
		setSelectedRowKeys(selectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const calculateAmount = () => {
		setExtraAmount('')
		// console.log('filteredData', filteredData);
		let amount = amountReceivedValue;
		let modifiedData = filteredData?.map((data, index) => {
			let payment = 0;
			if (amount > 0) {
				payment = amount >= data?.totalAmount ? data?.totalAmount : amount;
				amount = amount - data?.totalAmount;
			}
			return {
				...data,
				payment: payment,
			};
		});

		setTableData(modifiedData);

		console.log("🚀 ~ file: payments-list-functional.js:211 ~ calculateAmount ~ amount:", amount)
		if (amount > 0) {
			setExtraAmount(amount);
		}
	};

	return (
		<PaymentsListPresentational
			{...{
				column,
				filteredData,
				visible,
				toggleVisible,
				handleTableChange,
				getStartingValue,
				getEndingValue,
				pageSize,
				intialPageSizeOptions,
				initialPageSize,
				currentPage,
				setSearchKey,
				tableLoading: loading,
				rowSelection,
				users,
				classes,
				handleSelectCustomer,
				loading,
				customers,
				calculateAmount,
				amountReceivedValue,
				form,
				extraAmount
			}}
		/>
	);
});

export default PaymentsListFunctional;
