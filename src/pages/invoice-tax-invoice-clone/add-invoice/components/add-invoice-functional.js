import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
	Col,
	// Divider,
	Input,
	Row,
	Select,
	Form,
	Divider,
	Button,
	Tooltip,
} from 'antd';
import moment from 'moment';
import { arrayMoveImmutable } from 'array-move';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { useDispatch, useSelector } from 'react-redux';
import { SERVER_IP } from 'assets/Config';
import { getApi } from 'redux/sagas/getApiDataSaga';
import AddInvoicePresentational from './add-invoice-presentational';
import { DeleteOutlined, MenuOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { getTheRoundOffValue } from 'helpers';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { API_STATUS } from 'constants/app-constants';
import AddItem from 'pages/items/add-item';
import { sendGetRequest } from 'redux/sagas/utils';

const itemDefaultRecord = {
	itemId: '',
	qty: 0,
	rate: 0,
	discount: 0,
	discountType: 'PERCENT',
	taxRate: null,
	taxId: null,
	description: '',
	totalAmount: 0,
	id: uuidv4(),
	// index: 0,
};
// eslint-disable-next-line
const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);

const calculateTaxRateTotalAmount = (record, taxPreference) => {
	const qty = parseFloat(record?.qty || 0);
	const rate = parseFloat(record?.rate || 0);
	const discount = parseFloat(record?.discount || 0);
	const taxRate = parseFloat(record?.taxRate || 0);

	const total = qty * rate;

	// Apply discount
	let discountedAmount = total;
	if (record?.discountType === 'PERCENT') {
		discountedAmount = total - total * (discount / 100);
	} else if (record?.discountType === 'AMOUNT') {
		discountedAmount = total - discount;
	}

	let taxableAmount = discountedAmount;
	let taxAmount = 0;
	let totalAmount = discountedAmount;

	if (taxPreference === 'Exclusive') {
		taxAmount = discountedAmount * (taxRate / 100);
		totalAmount = discountedAmount + taxAmount;
	} else if (taxPreference === 'Inclusive') {
		taxableAmount = (100 * discountedAmount) / (100 + taxRate);
		taxAmount = discountedAmount - taxableAmount;
		totalAmount = discountedAmount; // already includes tax
	} else if (taxPreference === 'None') {
		taxAmount = 0;
		totalAmount = discountedAmount;
	}

	return {
		taxRate,
		taxAmount: taxAmount.toFixed(2),
		cgstRate: taxPreference !== 'None' ? taxRate / 2 : 0,
		cgstAmount: taxPreference !== 'None' ? (taxAmount / 2).toFixed(2) : 0,
		sgstRate: taxPreference !== 'None' ? taxRate / 2 : 0,
		sgstAmount: taxPreference !== 'None' ? (taxAmount / 2).toFixed(2) : 0,
		igstRate: 0,
		igstAmount: 0,
		totalAmount: totalAmount.toFixed(2),
		taxableAmount,
	};
};

const AddInvoiceFunctional = () => {
	const taxes = useSelector((state) => state?.globalRedux?.taxes || [])?.sort((a, b) => a.taxValue - b.taxValue);
	const [selectedData, setSelectedData] = useState(null);
	const [invoiceInputDetails, setInvoiceInputDetails] = useState({
		shippingCharges: 0,
	});
	const [customerAddModal, setCustomerAddModal] = useState(false);
	const [invoiceDetails, setInvoiceDetails] = useState({
		data: null,
		loading: false,
	});
	const idForZeroTax = useMemo(() => taxes.find((tax) => tax.taxValue === 0)?._id, [taxes]);
	const [tableData, setTableData] = useState([{ ...itemDefaultRecord, taxId: idForZeroTax }]);
	const [itemAddModal, setItemAddModal] = useState(false);
	const [showAddItemModal, setShowAddItemModal] = useState(false);
	const items = useSelector((state) => state.itemRedux?.items || []);
	const globalRedux = useSelector((state) => state.globalRedux);
	const projects = useSelector((state) => state?.projectRedux?.projects);
	const customers = useSelector((state) => state.customerRedux?.customers || []);
	const salesPersons = useSelector((state) => state?.globalRedux.salesPersons);
	const [form] = Form.useForm();
	const customerIdValue = Form.useWatch('customerId', form);
	const taxPreferenceValue = Form.useWatch('taxPreference', form);
	const placeOfSupplyValue = Form.useWatch('placeOfSupply', form);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	let { invoiceId } = useParams();

	const getInvoiceDetails = useCallback(
		async (invoiceId) => {
			await setInvoiceDetails({
				data: null,
				loading: true,
			});
			const data = await sendGetRequest(null, `${SERVER_IP}invoice/${invoiceId}?orgId=${globalRedux?.selectedOrganization?._id}`);
			await setInvoiceDetails({
				data: data?.data,
				loading: false,
			});
		},
		[globalRedux?.selectedOrganization?._id]
	);

	useEffect(() => {
		if (invoiceId) {
			getInvoiceDetails(invoiceId);
		}
	}, [invoiceId, getInvoiceDetails]);

	useEffect(() => {
		if (invoiceDetails?.data) {
			form.setFieldsValue({
				customerId: invoiceDetails?.data?.customerId,
				dueDate: moment(invoiceDetails?.data?.dueDate),
				invoiceDate: moment(invoiceDetails?.data?.invoiceDate),
				shippingCharges: invoiceDetails?.data?.shippingCharges,
				placeOfSupply: invoiceDetails?.data?.placeOfSupply,
			});
			generateTableData(invoiceDetails?.data);
		}
	}, [invoiceDetails?.data, form]);

	const { billingDetails, shippingDetails } = useMemo(() => {
		let billingDetails = null;
		let shippingDetails = null;
		if (customerIdValue) {
			billingDetails = customers?.find((customer) => customer?._id === customerIdValue)?.billingDetails?.[0] || {};
			shippingDetails = {};
		}
		return {
			billingDetails,
			shippingDetails,
		};
	}, [customerIdValue, customers]);

	const SortableItem = SortableElement((props) => <tr {...props} />);
	const SortableBody = SortableContainer((props) => <tbody {...props} />);

	const getItems = useCallback(() => {
		let url = `${SERVER_IP}item?orgId=${globalRedux.selectedOrganization._id}`;
		dispatch(getApi('GET_ITEMS', url));
	}, [dispatch, globalRedux.selectedOrganization._id]);

	const getCustomers = useCallback(() => {
		let url = `${SERVER_IP}customer?orgId=${globalRedux?.selectedOrganization?._id}`;
		dispatch(getApi('GET_CUSTOMERS', url));
	}, [dispatch, globalRedux?.selectedOrganization?._id]);

	const getSalesPersons = useCallback(() => {
		let url = `${SERVER_IP}salesperson/?orgId=${globalRedux?.selectedOrganization?._id}`;
		dispatch(getApi('GET_SALES_PERSONS', url));
	}, [dispatch, globalRedux?.selectedOrganization?._id]);

	const getProjects = useCallback(() => {
		let url = `${SERVER_IP}project?orgId=${globalRedux.selectedOrganization._id}`;
		dispatch(getApi('GET_PROJECTS', url));
	}, [dispatch, globalRedux.selectedOrganization._id]);

	useEffect(() => {
		getCustomers();
		getSalesPersons();
		getItems();
		getProjects();
	}, [getCustomers, getSalesPersons, getItems, getProjects]);

	const handleInputChange = useCallback(
		(label, value, rowId) => {
			let item = null;
			let qty = 0;
			if (label === 'itemId') {
				item = items.find((item) => item._id === value);
				qty = item?.isSerial ? 0 : 1;
			}
			// if (label === 'taxPreference') {
			// 	const updatedTableData = tableData.map((data) => {
			// 		return {
			// 			...data,
			// 			...calculateTaxRateTotalAmount(data, value),
			// 		};
			// 	});
			// 	setTableData(updatedTableData);
			// 	return;
			// }
			const data = tableData.map((data) => {
				let newObj = {};
				const taxRateFromId = taxes.find((tax) => tax._id === item?.taxId?._id)?.taxValue || null;
				const sellingPrice = taxRateFromId ? item?.sellingPrice : 0; // if there is no taxPercentage don’t fill item rate, user will fill
				const taxAmount = sellingPrice * qty * (taxRateFromId / 100) || 0;
				if (data.id === rowId) {
					newObj = {
						...data,
						...(item && {
							itemId: item?._id || '',
							itemCode: item?.itemCode || '',
							itemName: item?.itemName || '',
							hsnSac: item?.hsnSac || '',
							qty: item?.qty || 1,
							rate: sellingPrice,
							totalAmount: sellingPrice * qty,
							description: item?.description || '',
							// unitId: item?.unitId?._id || '',
							// isSerial: item?.isSerial || false,
							// discount: item?.discount || 0,
							// discountAmount: item?.discountAmount || 0,
							// serials: item?.serials || [],

							// taxRate: taxRateFromId || 0,
							// taxId: item?.taxId?._id || idForZeroTax,
							// taxAmount: taxAmount,
						}),
						[label]: value,
					};
					if (label === 'serials') {
						newObj['qty'] = value?.length || 0;
					}
					// if (label === 'taxId') {
					// 	const taxRate = taxes.find((tax) => tax._id === value)?.taxValue || 0;
					// 	newObj['taxRate'] = taxRate;
					// 	newObj['taxAmount'] = (newObj?.rate || 0) * (newObj?.qty || 0) * (taxRate / 100);
					// 	newObj['totalAmount'] = (newObj?.rate || 0) * (newObj?.qty || 0) + newObj?.taxAmount;
					// }
					return {
						...newObj,
						// totalAmount: calculateTotalAmount(newObj),
						...calculateTaxRateTotalAmount(newObj),
					};
				} else {
					return data;
				}
			});
			setTableData([...data]);
		},
		[tableData, items, taxPreferenceValue, taxes, idForZeroTax]
	);

	const handleAddTableData = useCallback(() => {
		let data = [...tableData];
		data.push({
			...itemDefaultRecord,
			id: uuidv4(),
			index: tableData?.length,
			taxId: idForZeroTax,
		});
		setTableData(data);
	}, [tableData, idForZeroTax]);

	const handleRemove = (id) => {
		const data = tableData.filter((data) => data.id !== id);
		setTableData([...data]);
	};

	useEffect(() => {
		const filledList = tableData?.map((data) => data.itemId).filter((data) => data);
		if (tableData?.length === filledList.length) {
			handleAddTableData();
		}
	}, [tableData, handleAddTableData]);

	const columns = [
		{
			title: '#',
			dataIndex: 'sno',
			key: 'sno',
			width: '5%',
			align: 'center',
			render: (value, record, index) => <div>{index + 1}</div>,
		},
		{
			title: 'Item Details',
			dataIndex: 'itemId',
			key: 'itemId',
			width: '30%',
			render: (value, record) => (
				<Row>
					<Col span={24}>
						<Select
							{...{
								...(value && { value }),
							}}
							showSearch
							optionFilterProp="children"
							filterOption={(input, option) => option.children?.toLowerCase().indexOf(input?.toLowerCase()) >= 0}
							filterSort={(optionA, optionB) => optionA.children?.toLowerCase().localeCompare(optionB.children?.toLowerCase())}
							style={{ width: '100%' }}
							placeholder="Select item"
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
								<Select.Option value={item?._id}>{item?.itemName}</Select.Option>
							))}
						</Select>
					</Col>

					<Col span={24} style={{ paddingTop: 10 }}>
						<Input.TextArea
							value={record?.description}
							onChange={({ target: { value } }) => handleInputChange('description', value, record?.id)}
							disabled={!record?.itemId}
							style={{ width: '100%' }}
							placeholder="Add a description to your item"
						/>
					</Col>
				</Row>
			),
		},
		{
			title: 'HSNSAC',
			dataIndex: 'hsnSac',
			align: 'left',
			width: '12%',
			render: (value, record) => <Input value={value} onChange={({ target: { value } }) => handleInputChange('hsnSac', value, record?.id)} style={{ width: '100%' }} placeholder="HsnSac" />,
		},
		{
			title: 'Qty',
			dataIndex: 'qty',
			key: 'qty',
			width: '12%',
			align: 'right',
			render: (value, record) =>
				record?.isSerial ? (
					<Tooltip style={{ width: '100%' }} title={(record?.serials || [])?.map((serial) => serial?.serial).join(',')}>
						<Button style={{ width: '100%', textAlign: 'right' }} onClick={() => setSelectedData(record)} disabled={!record?.itemId} value="default">
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
			align: 'left',
			width: '12%',
			render: (value, record) => (
				<Input
					value={value}
					onChange={({ target: { value } }) => handleInputChange('rate', parseFloat(value), record?.id)}
					type="number"
					pattern="^-?[0-9]\d*\.?\d*$"
					className="textAlignRight"
					style={{ width: '100%' }}
					placeholder="Enter rate"
				/>
			),
		},
		// {
		// 	title: 'Discount',
		// 	dataIndex: 'discount',
		// 	align: 'left',
		// 	width: '12%',
		// 	render: (value, record) => (
		// 		<Row style={{ flexWrap: 'nowrap' }}>
		// 			<Col>
		// 				<Input
		// 					value={value}
		// 					onChange={({ target: { value } }) => handleInputChange('discount', parseFloat(value), record?.id)}
		// 					// onBlur={({ target: { value } }) => handleInputChange('discount', parseFloat(value), record?.id)}
		// 					type="number"
		// 					pattern="^-?[0-9]\d*\.?\d*$"
		// 					className="textAlignRight"
		// 					style={{ width: 60 }}
		// 					placeholder="Enter discount"
		// 				/>
		// 			</Col>
		// 			<Col>
		// 				<Select defaultValue={'PERCENT'} style={{ width: 55 }} onChange={(value) => handleInputChange('discountType', value, record?.id)}>
		// 					<Select.Option value="PERCENT">%</Select.Option>
		// 					<Select.Option value="AMOUNT">₹</Select.Option>
		// 				</Select>
		// 			</Col>
		// 		</Row>
		// 	),
		// },
		// {
		// 	title: 'Taxable',
		// 	dataIndex: 'taxableAmount',
		// 	align: 'right',
		// 	width: '12%',
		// 	render: (value, record) => {
		// 		return <span style={{ fontWeight: 'bold' }}>{parseFloat(value || 0).toFixed(2)}</span>;
		// 	},
		// },
		// {
		// 	title: 'Tax',
		// 	dataIndex: 'taxId',
		// 	align: 'left',
		// 	width: '12%',
		// 	render: (value, record) => (
		// 		<Select value={value} style={{ width: 80 }} onChange={(newTaxRate) => handleInputChange('taxId', newTaxRate, record?.id)}>
		// 			{taxes?.map((tax) => (
		// 				<Select.Option key={tax._id} value={tax._id}>
		// 					{tax.taxName}
		// 				</Select.Option>
		// 			))}
		// 		</Select>
		// 	),
		// },
		{
			title: 'Amount',
			dataIndex: 'totalAmount',
			align: 'right',
			width: '12%',
			render: (value, record) => {
				return <span style={{ fontWeight: 'bold' }}>{parseFloat(value || 0).toFixed(2)}</span>;
			},
		},
		{
			title: 'Action',
			dataIndex: 'item',
			key: 'item',
			align: 'center',
			width: '3%',
			render: (value, record) => (tableData.length > 1 && record?.itemId ? <DeleteOutlined style={{ color: 'red' }} onClick={() => handleRemove(record.id)} /> : null),
		},
	];

	const onSortEnd = ({ oldIndex, newIndex }) => {
		if (oldIndex !== newIndex) {
			const newData = arrayMoveImmutable(tableData.slice(), oldIndex, newIndex).filter((el) => !!el);
			setTableData(newData);
		}
	};

	const { subTotal, roundOff, totalAmount, totalTaxableAmount } = useMemo(() => {
		const subTotal = parseFloat(tableData?.reduce((acc, data) => +acc + +data?.totalAmount, 0)).toFixed(2);
		const totalTaxableAmount = tableData.reduce((acc, obj) => +acc + +(obj?.taxableAmount || 0), 0);

		const roundOff = getTheRoundOffValue(parseFloat(subTotal) + parseFloat(invoiceInputDetails?.shippingCharges || 0)) || 0;
		const totalAmount = roundOff?.value || 0;

		return { subTotal, roundOff: roundOff?.remain, totalAmount, totalTaxableAmount };
	}, [tableData, invoiceInputDetails?.shippingCharges]);

	const generateTableData = (editData) => {
		if (editData?.items?.length > 0) {
			const data = editData.items.map(({ itemId, description, qty, rate, discount, discountAmount, totalAmount, taxRate }) => ({
				itemId,
				qty,
				rate,
				discount: discount || discountAmount,
				discountType: discount > 0 ? 'PERCENT' : 'AMOUNT',
				taxId: taxRate,
				description,
				totalAmount,
				id: uuidv4(),
			}));
			setTableData(data);
		}
	};

	const handleSubmit = (values) => {
		let data = {
			orgId: globalRedux?.selectedOrganization?._id,
			...values,
			projectId: values?.projectId || '',
			salesPersonId: values?.salesPersonId || '',
			billingDetails: {
				addressLine1: billingDetails?.addressLine1 || '',
				addressLine2: billingDetails?.addressLine2 || '',
				city: billingDetails?.city || '',
				pincode: billingDetails?.pincode || '',
			},
			shippingDetails: {},
			// subTotal,
			totalAmount,
			discount: 0,
			taxableTotal: totalTaxableAmount,
			taxPreference: taxPreferenceValue,
			taxType: placeOfSupplyValue === 'Tamil Nadu' ? 'IntraState' : 'InterState',
			...invoiceInputDetails,
			roundOff: parseFloat(parseFloat(roundOff || 0).toFixed(2)) || 0,
			shippingCharges: parseFloat(parseFloat(invoiceInputDetails?.shippingCharges || 0).toFixed(2)) || 0,
			items: tableData
				?.filter((data) => data?.itemId)
				.map(({ itemId, itemCode, itemName, description, isSerial, serials, hsnSac, qty, rate, discount, discountAmount, taxId, taxRate, taxAmount, totalAmount, discountType, unitId }) => {
					// if (discountType === 'PERCENT') {
					// 	discount = discount;
					// }
					// if (discountType === 'AMOUNT') {
					// 	discountAmount = discount;
					// }
					return {
						itemId,
						itemCode,
						itemName,
						hsnsac: hsnSac,
						qty,
						rate,
						totalAmount: parseFloat(totalAmount),
						// unitId,
						// description,
						// isSerial,
						// serials: serials?.map((serial) => serial?.serial) || [],
						// discount: discount || 0,
						// discountAmount: discountAmount || 0,
						// taxId,
						// taxRate,
						// taxAmount,
					};
				}),
		};
		dispatch(postApi(data, 'ADD_INVOICE'));
	};

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_INVOICE === 'SUCCESS') {
			dispatch(resetApiStatus('ADD_INVOICE'));
			navigate(-1);
		}
	}, [globalRedux.apiStatus, dispatch, navigate]);

	const loading = useMemo(() => globalRedux.apiStatus.ADD_INVOICE === API_STATUS.PENDING, [globalRedux.apiStatus]);

	return (
		<>
			<AddInvoicePresentational
				{...{
					columns,
					dataSource: tableData,
					customers,
					customerAddModal,
					setCustomerAddModal,
					getCustomers,
					itemAddModal,
					setItemAddModal,
					getItems,
					form,
					billingDetails,
					shippingDetails,
					customerIdValue,
					handleSubmit,
					subTotal,
					roundOff,
					totalAmount,
					navigate,
					loading,
					invoiceDetails,
					invoiceInputDetails,
					setInvoiceInputDetails,
					selectedData,
					setSelectedData,
					tableData,
					setTableData,
					handleInputChange,
					totalTaxableAmount,
				}}
			/>
			<AddItem {...{ showAddItemModal, setShowAddItemModal }} />
		</>
	);
};

export default AddInvoiceFunctional;
