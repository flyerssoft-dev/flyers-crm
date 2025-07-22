import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { Form, Select, Input, Divider, Button, Tooltip } from 'antd';
import { message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { DeleteOutlined } from '@ant-design/icons';
import { SERVER_IP } from 'assets/Config';
import { API_STATUS, NOTIFICATION_STATUS_TYPES } from 'constants/app-constants';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { putApi } from 'redux/sagas/putApiSaga';
import moment from 'moment';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { getTheRoundOffValue, showToast } from 'helpers';
import AddCustomer from 'pages/customers/add-customer';
import { sendGetRequest } from 'redux/sagas/utils';
import AddItem from 'pages/items/add-item';
import AddressEditModal from 'components/address-edit-modal';
import { calculatePurchaseValues, groupByColumns, itemDefaultRecord, validateItemStock } from '..';
import AddTaxInvoicePresentational from './add-tax-invoice-presentational';

const { Option } = Select;

const AddTaxInvoiceFunctional = ({ state, setState, refreshList, editData }) => {
	const taxes = useSelector((state) => state?.globalRedux?.taxes || []);
	const [balance, setBalance] = useState('');
	const [paid, setPaid] = useState('');
	const [fileList, setFileList] = useState([]);
	const [showAddItemModal, setShowAddItemModal] = useState(false);
	const [showAddressEditModal, setShowAddressEditModal] = useState(false);
	const [selectedData, setSelectedData] = useState(null);
	const idForZeroTax = useMemo(() => taxes.find((tax) => tax.taxValue === 0)?._id, [taxes]);
	const [tableData, setTableData] = useState([{ ...itemDefaultRecord, id: uuidv4(), taxId: idForZeroTax }]);
	const [customerAddModal, setCustomerAddModal] = useState(false);
	const globalRedux = useSelector((state) => state.globalRedux);
	const items = useSelector((state) => state.itemRedux?.items || []);
	const customers = useSelector((state) => state.customerRedux?.customers || []);

	const [form] = Form.useForm();
	const [taxDD] = Form.useForm();

	const customerIdValue = Form.useWatch('customerId', form);
	const itemTaxPreferenceValue = Form.useWatch('itemTaxPreference', form);
	const placeOfSupplyValue = Form.useWatch('placeOfSupply', form);

	const getPurchaseDetails = async () => {
		try {
			const url = `${SERVER_IP}purchase/${editData?._id}?orgId=${globalRedux?.selectedOrganization?.id}`;
			const response = await sendGetRequest(null, url);
			const newData = response?.data;
			if (newData._id) {
				form.setFieldsValue({
					customerId: newData?.customerId?._id,
					billNumber: newData?.billNumber,
					billDate: moment(newData?.billDate),
					dueDate: moment(newData?.dueDate),
					poNumber: newData?.poNumber,
					dispatchThrough: newData?.dispatchThrough,
					trackingNumber: newData?.trackingNumber,
					shippingCharges: newData?.shippingCharges,
				});
				if (newData?.items?.length > 0) {
					const data = newData.items.map((item) => {
						const taxRate = taxes.find((tax) => tax._id === item?.taxId)?.taxValue || 0;
						return {
							_id: item?._id || '',
							itemId: item?.itemId?._id || '',
							purchaseItemId: item?._id || '',
							itemName: item?.itemId?.itemName || '',
							description: item?.description || '',
							isSerial: item?.isSerial || false,
							rate: item?.rate || '',
							hsnSac: item?.hsnSac || '',
							qty: item?.isSerial ? item?.serials?.length : item?.qty || 0,
							serials: (item?.serials || []).map((serial) => ({ serial: serial?.serialNumber })),
							discount: item?.discount || 0,
							taxRate: taxRate || 0,
							taxId: item?.taxId || null,
							...calculatePurchaseValues(
								{
									...item,
									taxRate,
								},
								itemTaxPreferenceValue
							),
							id: uuidv4(),
						};
					});
					setTableData(data);
				}
			}
		} catch (error) {
			console.error('Error validating stock:', error);
			return null;
		}
	};

	useEffect(() => {
		if (editData) {
			getPurchaseDetails();
		}
	}, [editData]);

	const handleSelectFile = (updatedFileList) => {
		setFileList(updatedFileList);
		uploadFiles(updatedFileList);
	};

	const uploadFiles = (files) => {
		// Implement your file upload logic here
		// console.log('Uploading files:', files);
		message.success('Files uploaded successfully!');
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
			setTableData([{ ...itemDefaultRecord, id: uuidv4(), taxId: idForZeroTax }]);
		}
	}, [state?.visible, form, idForZeroTax]);

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_TAX_INVOICE === API_STATUS.SUCCESS || globalRedux.apiStatus.EDIT_PURCHASE === API_STATUS.SUCCESS) {
			setState((state) => ({ ...state, visible: false }));
			refreshList();
			setPaid('');
			form.resetFields();
			dispatch(resetApiStatus(editData ? 'EDIT_TAX_INVOICE' : 'ADD_TAX_INVOICE'));
			setTableData([{ ...itemDefaultRecord, id: uuidv4(), taxId: idForZeroTax }]);
		}
	}, [globalRedux.apiStatus, editData, refreshList, dispatch, setState, form]);

	const loading = globalRedux.apiStatus.ADD_PURCHASE === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_PURCHASE === API_STATUS.PENDING;
	const totalAmount = useMemo(() => tableData.reduce((accum, item) => +accum + +item.totalAmount, 0) || 0, [tableData]);
	const roundOff = getTheRoundOffValue(totalAmount);

	const handleSubmit = (values) => {
		const request = {
			orgId: globalRedux?.selectedOrganization?.id,
			...values,
			billingDetails: {
				addressLine1: selectedCustomer?.billingDetails?.[0]?.addressLine1,
				addressLine2: selectedCustomer?.billingDetails?.[0]?.addressLine2,
				city: selectedCustomer?.billingDetails?.[0]?.city,
				pincode: selectedCustomer?.billingDetails?.[0]?.pincode,
			},
			shippingDetails: {},
			subTotal: parseFloat(totalAmount).toFixed(2),
			roundOff: roundOff?.remain || 0,
			totalAmount: parseFloat(roundOff.value).toFixed(2),
			items: tableData
				.filter((data) => data.itemId)
				.map(({ itemId, itemName, description, hsnSac, rate, qty, discount, discountAmount, totalAmount, taxRate, taxId, taxAmount, serials, isSerial, _id }) => ({
					...(_id && {
						_id,
					}),
					itemId,
					itemName,
					description,
					serials: serials?.map((serial) => serial?.serial) || [],
					hsnSac,
					isSerial: isSerial || false,
					qty,
					rate: rate || 0,
					discount: discount || 0,
					discountAmount: discountAmount || 0,
					// taxRate: taxRate || 0,
					taxId: taxId || null,
					taxAmount: taxAmount || 0,
					totalAmount,
				})),
		};
		editData ? dispatch(putApi(request, 'EDIT_TAX_INVOICE', `${SERVER_IP}purchase/${editData?._id}`)) : dispatch(postApi(request, 'ADD_TAX_INVOICE'));
	};

	const handleInputChange = useCallback(
		(label, value, rowId) => {
			try {
				let item = null;
				let qty = 0;

				if (label === 'itemTaxPreference') {
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
							...calculatePurchaseValues(updatedObj, itemTaxPreferenceValue),
						};
						return updatedObj;
					} else {
						return data;
					}
				});
				setTableData([...data]);
			} catch (err) {
				console.log('🚀 ~ AddTaxInvoiceFunctional ~ err:', err);
			}
		},
		[tableData, items, itemTaxPreferenceValue, taxes, idForZeroTax]
	);

	const groupData = useMemo(
		() =>
			_.chain(tableData?.filter((data) => data?.itemId))
				.groupBy('hsnSac')
				.map((value, key) => {
					const taxRate = value[0]?.taxRate;
					const totalTaxableAmount = value.reduce((acc, obj) => +acc + +obj?.taxableValue, '0.00');
					const totalTaxAmount = value.reduce((acc, obj) => +acc + +obj?.taxAmount, '0.00');

					if (placeOfSupplyValue === 'others') {
						// Only calculate IGST
						return {
							taxRate: taxRate,
							data: value,
							taxableAmount: totalTaxableAmount,
							taxAmount: totalTaxAmount,
							hsnSac: value[0]?.hsnSac,
							cgstPer: 0,
							cgstValue: '0.00',
							sgstPer: 0,
							sgstValue: '0.00',
							igstPer: parseInt(taxRate),
							igstValue: parseFloat(totalTaxAmount).toFixed(2),
						};
					} else {
						// Calculate CGST and SGST
						return {
							taxRate: taxRate,
							data: value,
							taxableAmount: totalTaxableAmount,
							taxAmount: totalTaxAmount,
							hsnSac: value[0]?.hsnSac,
							cgstPer: parseInt(taxRate) / 2,
							cgstValue: parseFloat(totalTaxAmount / 2).toFixed(2),
							sgstPer: parseInt(taxRate) / 2,
							sgstValue: parseFloat(totalTaxAmount / 2).toFixed(2),
							igstPer: 0,
							igstValue: '0.00',
						};
					}
				})
				.value(),
		[tableData, placeOfSupplyValue]
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
			align: 'left',
			render: (value, record) => (
				<div>
					<Select
						showSearch
						optionFilterProp="children"
						filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
						value={value}
						style={{ width: '100%', textAlign: 'left' }}
						placeholder="Select Item"
						onChange={(value) => handleInputChange('itemId', value, record?.id)}
						dropdownRender={(menu) => (
							<div>
								{menu}
								<Divider />
								<div style={{ display: 'flex', flexWrap: 'nowrap', cursor: 'pointer' }} onClick={() => setShowAddItemModal(true)}>
									<a href style={{ flex: 'none', color: '#188dfa', padding: '8px', display: 'block' }}>
										Add New Item
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
					<Input.TextArea placeholder="Description" disabled={!!!value} value={record?.description} style={{ width: '100%', marginTop: '5px' }} onChange={({ target: { value } }) => handleInputChange('description', value, record?.id)} />
				</div>
			),
		},
		{
			title: 'HSNSAC',
			dataIndex: 'hsnSac',
			key: 'hsnSac',
			width: '7%',
			align: 'center',
			// render: (value, record) => <span>{parseFloat((record?.qty || 0) * (record?.rate || 0)).toFixed(2)}</span>,
		},
		{
			title: 'Quantity',
			dataIndex: 'qty',
			key: 'qty',
			width: '5%',
			align: 'right',
			render: (value, record) => {
				const hasValue = Boolean(record?.serials?.length);
				const Component = hasValue ? Tooltip : Fragment;
				return record?.isSerial ? (
					<Component
						{...{
							...(hasValue && {
								style: {
									width: '100%',
								},
							}),
						}}
						// style={{ width: '100%' }}
						title={
							<div>
								{(record?.serials || [])?.map((serial) => (
									<div>{serial?.serial}</div>
								))}
							</div>
						}>
						<Button style={{ width: '100%', textAlign: 'right' }} onClick={() => setSelectedData(record)} disabled={!record?.itemId} value="default">
							{record?.serials?.length || 0}
						</Button>
					</Component>
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
				);
			},
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
			title: 'Actual Total',
			dataIndex: 'actualTotal',
			key: 'actualTotal',
			width: '7%',
			render: (value, record) => {
				const isInvalid = parseFloat(record?.actualTotal) < parseFloat(record?.discountAmount) && parseFloat(record?.discountAmount) > 0;
				const Component = isInvalid ? Tooltip : Fragment;
				return (
					<Component
						style={{ width: '100%' }}
						title={
							<div>
								<div>Discount Amount should be less than Actual Total</div>
							</div>
						}>
						<span
							style={{
								...(parseFloat(record?.actualTotal) < parseFloat(record?.discountAmount) && parseFloat(record?.discountAmount) > 0 ? { color: 'red' } : {}),
							}}>
							{parseFloat((record?.qty || 0) * (record?.rate || 0)).toFixed(2)}
						</span>
					</Component>
				);
			},
		},
		{
			title: 'Dis %',
			dataIndex: 'discount',
			key: 'discount',
			width: '6%',
			align: 'right',
			render: (value, record) => (
				<Input
					type="number"
					pattern="^-?[0-9]\d*\.?\d*$"
					value={value}
					placeholder="dis %"
					disabled={!record?.itemId}
					style={{ textAlign: 'right' }}
					// className={`${record?.itemId && !value ? 'error' : ''}`}
					onChange={({ target: { value } }) => handleInputChange('discount', parseFloat(value || ''), record?.id)}
				/>
			),
		},
		{
			title: 'Disount Amt.',
			dataIndex: 'discountAmount',
			key: 'discountAmount',
			width: '6%',
			align: 'right',
			render: (value, record) => {
				const isInvalid = parseFloat(value) > parseFloat(record?.actualTotal);
				const Component = isInvalid ? Tooltip : Fragment;
				return (
					<Fragment
						title={
							<div>
								<div>Discount Amount should be less than Actual Total</div>
							</div>
						}>
						<Input
							type="number"
							pattern="^-?[0-9]\d*\.?\d*$"
							value={value}
							placeholder="discount amt"
							disabled={!record?.itemId || (record?.discount || 0) > 0}
							style={{
								textAlign: 'right',
								...(parseFloat(value) > parseFloat(record?.actualTotal) ? { border: '1px solid red' } : { border: '1px solid #d9d9d9' }),
							}}
							onChange={({ target: { value } }) => handleInputChange('discountAmount', parseFloat(value), record?.id)}
						/>
						{/* show warning if the discountAmount is greater than actualTotal */}
						{/* {parseFloat(value) > parseFloat(record?.actualTotal) && <span style={{ color: 'red', fontSize: '12px' }}>Invalid</span>} */}
					</Fragment>
				);
			},
		},
		{
			title: 'Taxable',
			dataIndex: 'taxableValue',
			key: 'taxableValue',
			width: '7%',
			align: 'right',
			render: (value, record) => <span>{parseFloat(value || 0).toFixed(2)}</span>,
		},
		{
			title: 'Tax',
			dataIndex: 'taxId',
			key: 'taxId',
			width: '10%',
			align: 'right',
			render: (value, record) => (
				<Select value={value} style={{ width: 80 }} onChange={(newTaxRate) => handleInputChange('taxId', newTaxRate, record?.id)}>
					{taxes?.map((tax) => (
						<Select.Option key={tax._id} value={tax._id}>
							{tax.taxName}
						</Select.Option>
					))}
				</Select>
			),
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
			render: (value, record) => (tableData.length > 1 && record?.itemId ? <DeleteOutlined style={{ color: 'red' }} onClick={() => handleRemove(record.id, record)} /> : null),
		},
	];

	const handleRemove = async (id, record) => {
		const res = await validateItemStock(globalRedux?.selectedOrganization?.id, editData?._id, record?.purchaseItemId);
		if (res?.data) {
			const data = tableData.filter((data) => data.id !== id);
			setTableData([...data]);
		} else {
			showToast('Item Removal Failed.', 'Item cannot be removed as it is already used in some other transactions!', NOTIFICATION_STATUS_TYPES.ERROR, 'top-center');
		}
	};

	const handleAddTableData = useCallback(() => {
		let data = [...tableData];
		data.push({
			...itemDefaultRecord,
			taxId: idForZeroTax,
			id: uuidv4(),
		});
		setTableData(data);
	}, [tableData, idForZeroTax]);

	// Calculate balance whenever paid or total amount changes
	useEffect(() => {
		const calculatedBalance = parseFloat(roundOff.value - paid).toFixed(2);
		setBalance(calculatedBalance >= 0 ? calculatedBalance : 0);
	}, [roundOff.value, paid]);

	const isValid = useMemo(() => {
		const hasError = tableData.some((data) => parseFloat(data?.discountAmount) > parseFloat(data?.actualTotal));
		const filledList = tableData?.map((data) => data.itemId).filter((data) => data);

		if (tableData?.length === filledList?.length) {
			handleAddTableData();
		}

		return filledList.length > 0 && !hasError;
	}, [tableData, handleAddTableData]);

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
			<AddTaxInvoicePresentational
				fileList={fileList}
				handleSelectFile={handleSelectFile}
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
					taxDD,
					paid,
					setPaid,
					balance,
					setShowAddressEditModal,
					selectedCustomer,
				}}
			/>
		</>
	);
};

export default AddTaxInvoiceFunctional;
