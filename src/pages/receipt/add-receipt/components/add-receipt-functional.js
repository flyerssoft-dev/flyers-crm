import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { Form, Input, Tooltip } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { SERVER_IP } from 'assets/Config';
import { API_STATUS } from 'constants/app-constants';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { putApi } from 'redux/sagas/putApiSaga';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { getTheRoundOffValue } from 'helpers';
import AddCustomer from 'pages/customers/add-customer';
import { sendGetRequest } from 'redux/sagas/utils';
import AddItem from 'pages/items/add-item';
import AddressEditModal from 'components/address-edit-modal';
import AddReceiptPresentational from './add-receipt-presentational';

const AddReceiptFunctional = ({ state, setState, refreshList }) => {
	const taxes = useSelector((state) => state?.globalRedux?.taxes || []);
	const [totalBalance, setTotalBalance] = useState('');
	const [showAddItemModal, setShowAddItemModal] = useState(false);
	const [showAddressEditModal, setShowAddressEditModal] = useState(false);
	const [selectedData, setSelectedData] = useState(null);
	const idForZeroTax = useMemo(() => taxes.find((tax) => tax.taxValue === 0)?._id, [taxes]);
	const [tableData, setTableData] = useState([]);
	const [invoiceLoading, setInvoiceLoading] = useState(false);
	const [customerAddModal, setCustomerAddModal] = useState(false);
	const globalRedux = useSelector((state) => state.globalRedux);
	const customers = useSelector((state) => state.customerRedux?.customers || []);

	const [form] = Form.useForm();

	const customerIdValue = Form.useWatch('customerId', form);
	const receiptAmountValue = Form.useWatch('receiptAmount', form);
	const paymentModeValue = Form.useWatch('paymentMode', form);
	// const typeValue = Form.useWatch('type', form);

	const isEditMode = Boolean(state?.selectedRow)

	const updatedTableData = useMemo(() => {
		if (tableData.length === 0) return tableData;

		let remainingAmount = parseFloat(receiptAmountValue || 0);
		return tableData.map((invoice) => {
			let payment = 0;

			if (remainingAmount >= invoice.balanceAmount) {
				payment = invoice.balanceAmount;
				remainingAmount -= invoice.balanceAmount;
			} else {
				payment = remainingAmount;
				remainingAmount = 0;
			}

			const balanceAfterPayment = parseFloat(invoice.balanceAmount - payment).toFixed(2);

			return { ...invoice, payment, balanceAfterPayment: balanceAfterPayment || 0 };
		});
	}, [receiptAmountValue]);

	useEffect(() => {
		setTableData(updatedTableData);
	}, [updatedTableData]);

	const getReceiptDetails = async () => {
		try {
			setInvoiceLoading(true)
			const url = `${SERVER_IP}receipt/edit/${state?.selectedRow?._id}?orgId=${globalRedux?.selectedOrganization?.id}`;
			const response = await sendGetRequest(null, url);
			const newData = response?.data;

			if (newData?.receiptId) {
				form.setFieldsValue({
					customerId: newData?.customer?._id,
					receiptAmount: newData?.receiptAmount,
					paymentMode: newData?.paymentMode,
					referenceNumber: newData?.referenceNumber,
					remarks: newData?.remarks,
				});

				if (Array.isArray(newData?.invoices)) {
					const data = newData.invoices.map((item) => {
						const invoice = item;
						const totalAmount = parseFloat(invoice?.totalAmount || 0);
						const balanceAmount = parseFloat(invoice?.balanceAfterPayment || 0);
						const payment = parseFloat(item?.appliedAmount || 0);
						const balanceAfterPayment = parseFloat(balanceAmount - payment).toFixed(2);
						return {
							_id: invoice?._id,
							invoiceId: invoice?._id,
							invoiceNumber: invoice?.invoiceNumber,
							invoiceDate: invoice?.invoiceDate,
							dueDate: invoice?.dueDate,
							totalAmount,
							balanceAmount,
							payment,
							balanceAfterPayment,
							id: uuidv4(),
						};
					});
					console.log('🚀 ~ data ~ item:', data);
					setTableData(data);
					getInvoices(newData?.customer?._id, data);
					setInvoiceLoading(false)
				}
			}
		} catch (error) {
			setInvoiceLoading(false)
			console.error('❌ Error fetching receipt details:', error);
		}
	};

	const dispatch = useDispatch();

	const selectedCustomer = customers.find((customer) => customer._id === customerIdValue);

	useEffect(() => {
		if (selectedCustomer) {
			const placeOfSupply = selectedCustomer?.placeOfSupply || '';
			const gstin = selectedCustomer?.gstin || '';
			const address = [selectedCustomer?.billingDetails?.[0]?.addressLine1, selectedCustomer?.billingDetails?.[0]?.addressLine2, selectedCustomer?.billingDetails?.[0]?.city, selectedCustomer?.billingDetails?.[0]?.pincode]
				.filter(Boolean)
				.join(', ');
			form.setFieldsValue({
				placeOfSupply,
				gstin,
				address,
			});
		} else {
			form.setFieldsValue({
				placeOfSupply: null,
				gstin: '',
				address: '',
			});
		}
	}, [selectedCustomer, form]);

	const getCustomers = useCallback(() => {
		let url = `${SERVER_IP}customer?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(getApi('GET_CUSTOMERS', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	useEffect(() => {
		state?.visible && getCustomers();
	}, [getCustomers, state?.visible]);

	useEffect(() => {
		if (state?.selectedRow) {
			getReceiptDetails();
		}
	}, [state?.selectedRow]);

	useEffect(() => {
		if (!state?.visible) {
			form.resetFields();
			setTableData([]);
		}
	}, [state?.visible, form, idForZeroTax]);

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_RECEIPT === API_STATUS.SUCCESS || globalRedux.apiStatus.EDIT_RECEIPT === API_STATUS.SUCCESS) {
			setState((state) => ({ ...state, visible: false, selectedRow: null }));
			refreshList();
			form.resetFields();
			dispatch(resetApiStatus(state?.selectedRow ? 'EDIT_RECEIPT' : 'ADD_RECEIPT'));
			setTableData([]);
		}
	}, [globalRedux.apiStatus, state?.selectedRow, refreshList, dispatch, setState, form]);

	const getInvoices = async (customerId, dataSource) => {
		try {
			setInvoiceLoading(true)
			const finalTableData = dataSource || tableData;
			// const endpoint = typeValue === 'Retail' ? 'retail' : 'invoice';
			const url = `${SERVER_IP}invoice?orgId=${globalRedux?.selectedOrganization?.id}&customerId=${customerId}`;
			const response = await sendGetRequest(null, url);

			const fetchedData = response?.data?.data || [];

			const newData = fetchedData.map((item) => {
				const matched = finalTableData.find((row) => row._id === item._id); // Match by invoice ID

				const totalAmount = parseFloat(item?.totalAmount || 0);
				const balanceAmount = isEditMode ? (item?.balance + matched?.payment) : parseFloat(item?.balance || 0);

				// Use existing payment and balanceAfterPayment if editing, otherwise default
				const payment = matched?.payment ?? 0;
				const balanceAfterPayment = isEditMode ? (item?.balance) : balanceAmount;

				return {
					_id: item._id || '',
					invoiceNumber: item.invoiceNumber || '',
					invoiceDate: item.invoiceDate || '',
					dueDate: item.dueDate || '',
					totalAmount,
					balanceAmount,
					balanceAfterPayment,
					payment,
					invoiceType: item.invoiceType || '',
				};
			});

			setTableData(newData);
			setInvoiceLoading(false);
		} catch (error) {
			console.error('❌ Error validating invoices:', error);
			setInvoiceLoading(false);
			return null;
		}
	};

	useEffect(() => {
		customerIdValue && !Boolean(state?.selectedRow) && getInvoices(customerIdValue);
	}, [customerIdValue]);

	const loading = globalRedux.apiStatus.ADD_RECEIPT === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_RECEIPT === API_STATUS.PENDING;
	const totalAmount = useMemo(() => tableData.reduce((accum, item) => +accum + +item.totalAmount, 0) || 0, [tableData]);
	const roundOff = getTheRoundOffValue(totalAmount);

	const handleSubmit = (values) => {
		const request = {
			orgId: globalRedux?.selectedOrganization?.id,
			...values,
			// totalAmount: parseFloat(roundOff.value).toFixed(2),
			invoices: tableData
				.filter((data) => data._id && Boolean(data?.payment))
				.map(({ _id, invoiceNumber, invoiceDate, dueDate, totalAmount, payment }) => ({
					invoiceId: _id,
					appliedAmount: payment,
					// ...(_id && {
					// 	_id,
					// }),
					// invoiceNumber,
					// invoiceDate,
					// dueDate,
					// totalAmount,
				})),
		};
		state?.selectedRow ? dispatch(putApi(request, 'EDIT_RECEIPT', `${SERVER_IP}receipt/${state?.selectedRow?._id}`)) : dispatch(postApi(request, 'ADD_RECEIPT'));
	};

	const handleInputChange = useCallback(
		(label, value, rowId) => {
			try {
				const data = tableData.map((data) => {
					if (data._id === rowId) {
						let updatedObj = data;
						updatedObj[label] = value;
						// calculate balanceAfterPayment if payment is changed
						let totalAmount;
						let balanceAmount;
						let payment;
						let balanceAfterPayment;
						if (label === 'payment') {
							totalAmount = parseFloat(data?.totalAmount || 0);
							balanceAmount = parseFloat(data?.balanceAmount || 0);
							payment = parseFloat(value || 0);
							balanceAfterPayment = parseFloat(data?.balanceAmount - payment).toFixed(2);
						}
						updatedObj = {
							...updatedObj,
							totalAmount,
							payment,
							balanceAfterPayment,
						};
						return updatedObj;
					} else {
						return data;
					}
				});
				setTableData([...data]);
			} catch (err) {
				console.log('🚀 ~ AddReceiptFunctional ~ err:', err);
			}
		},
		[tableData]
	);

	const columns = [
		{
			title: 'Invoice Type',
			dataIndex: 'invoiceType',
			key: 'invoiceType',
			width: '10%', // Adjusted width for invoice type
			render: (value) => <span>{value === 'retail_invoice' ? 'Retail Invoice' : 'Tax Invoice'}</span>,
		},
		{
			title: 'Invoice Date',
			dataIndex: 'invoiceDate',
			key: 'invoiceDate',
			width: '15%', // Adjusted width for invoice date
			render: (value, record) => (
				<div>
					<div>{moment(value).format('DD/MM/YYYY')}</div>
					<div style={{ fontSize: '12px', color: '#888' }}>Due Date: {moment(record?.dueDate).format('DD/MM/YYYY')}</div>
				</div>
			),
		},
		{
			title: 'Invoice Number',
			dataIndex: 'invoiceNumber',
			key: 'invoiceNumber',
			width: '14%', // Adjusted width for invoice number
			render: (value) => <div>INV - {value}</div>,
		},
		{
			title: 'Invoice Amount',
			dataIndex: 'totalAmount',
			key: 'totalAmount',
			width: '16%', // Adjusted width for invoice amount
			align: 'right',
			render: (value) => <div>{parseFloat(value || 0).toFixed(2)}</div>,
		},
		{
			title: 'Balance Amount',
			dataIndex: 'balanceAmount',
			key: 'balanceAmount',
			width: '16%', // Adjusted width for balance amount
			align: 'right',
			render: (value) => <div>{parseFloat(value || 0).toFixed(2)}</div>,
		},
		{
			title: 'Payment',
			dataIndex: 'payment',
			key: 'payment',
			width: '18%', // Adjusted width for payment input
			align: 'right',
			render: (value, record) => {
				const isInvalid = parseFloat(value) > parseFloat(record?.actualTotal);
				const Component = isInvalid ? Tooltip : Fragment;
				return (
					<Fragment>
						<Input
							pattern="^-?[0-9]\d*\.?\d*$"
							value={value}
							placeholder="0.00"
							style={{
								width: '60%',
								textAlign: 'right',
								...(parseFloat(value) > parseFloat(record?.totalAmount) ? { border: '1px solid red' } : { border: '1px solid #d9d9d9' }),
							}}
							onChange={({ target: { value } }) => handleInputChange('payment', parseFloat(value), record?._id)}
						/>
					</Fragment>
				);
			},
		},
		{
			title: 'Balance after payment',
			dataIndex: 'balanceAfterPayment',
			key: 'balanceAfterPayment',
			width: '16%', // Adjusted width for balance after payment
			align: 'right',
			render: (value) => <div>{parseFloat(value || 0).toFixed(2)}</div>,
		},
	];

	// Calculate balanceAfterPayment whenever paid or total amount changes
	useEffect(() => {
		const calculatedBalance = parseFloat(roundOff.value - 0).toFixed(2);
		setTotalBalance(calculatedBalance >= 0 ? calculatedBalance : 0);
	}, [roundOff.value]);

	// Calculate payment summaries based on actual payments entered
	const { amountReceived, amountUsedForPayments, amountRefunded, amountInExcess } = useMemo(() => {
		if (!receiptAmountValue) {
			return {
				amountReceived: 0,
				amountUsedForPayments: 0,
				amountRefunded: 0,
				amountInExcess: 0,
			};
		}

		const totalAmount = parseFloat(receiptAmountValue);
		let totalPayments = 0;

		tableData.forEach((item) => {
			const payment = parseFloat(item.payment || 0);
			totalPayments += payment;
		});

		const totalInvoiceAmount = tableData.reduce((sum, item) => sum + parseFloat(item.totalAmount || 0), 0);

		const usedAmount = Math.min(totalPayments, totalInvoiceAmount);
		const excess = Math.max(0, totalAmount - totalPayments);
		const refunded = Math.max(0, totalAmount - totalInvoiceAmount);

		return {
			amountReceived: totalAmount,
			amountUsedForPayments: usedAmount,
			amountRefunded: refunded,
			amountInExcess: excess,
		};
	}, [receiptAmountValue, tableData]);

	const isValid = useMemo(() => {
		const hasError = tableData.some((data) => parseFloat(data?.discountAmount) > parseFloat(data?.totalAmount));
		const filledList = tableData?.map((data) => data._id).filter((data) => data);
		return !hasError;
		// return filledList.length > 0 && !hasError;
	}, [tableData]);

	return (
		<>
			<AddressEditModal
				{...{
					showAddressEditModal,
					setShowAddressEditModal,
					editCustomer: selectedCustomer,
					isAddressOnly: true,
					loadCustomers: getCustomers,
				}}
			/>
			<AddItem {...{ showAddItemModal, setShowAddItemModal }} />
			<AddCustomer
				{...{
					customerAddModal,
					setCustomerAddModal,
					refreshList: getCustomers,
					handleClose: () => setCustomerAddModal(false),
				}}
			/>
			<AddReceiptPresentational
				{...{
					state,
					setState,
					handleSubmit,
					columns,
					loading,
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
					totalBalance,
					selectedCustomer,
					amountReceived,
					amountUsedForPayments,
					amountRefunded,
					amountInExcess,
					paymentModeValue,
					invoiceLoading
				}}
			/>
		</>
	);
};

export default AddReceiptFunctional;
