import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { sendGetRequest } from 'redux/sagas/utils';
import { SERVER_IP } from 'assets/Config';
import AddTaxInvoiceFunctional from './components/add-tax-invoice-functional';
import './styles.scss';

export const validateItemStock = async (orgId, purchaseId, purchaseItemId) => {
	try {
		const url = `${SERVER_IP}stock/validate_pi?orgId=${orgId}&purchaseId=${purchaseId}&purchaseItemId=${purchaseItemId}`;
		return await sendGetRequest(null, url);
	} catch (error) {
		console.error('Error validating stock:', error);
		return null;
	}
};

export const groupByColumns = [
	{
		title: 'HSN/SAC',
		dataIndex: 'hsnSac',
		key: 'hsnSac',
		width: '10%',
		align: 'center',
	},
	{
		title: 'Taxable',
		dataIndex: 'taxableAmount',
		key: 'taxableAmount',
		width: '10%',
		align: 'right',
		render: (value) => parseFloat(value || 0).toFixed(2),
	},
	{
		title: 'Tax (%)',
		dataIndex: 'taxRate',
		key: 'taxRate',
		width: '10%',
		align: 'right',
		render: (value) => `${parseFloat(value || 0).toFixed(2)}%`,
	},
	{
		title: 'CGST (%)',
		dataIndex: 'cgstPer',
		key: 'cgstPer',
		width: '10%',
		align: 'right',
		render: (value) => `${parseFloat(value || 0).toFixed(2)}%`,
	},
	{
		title: 'CGST',
		dataIndex: 'cgstValue',
		key: 'cgstValue',
		width: '10%',
		align: 'right',
		render: (value) => parseFloat(value || 0).toFixed(2),
	},
	{
		title: 'SGST (%)',
		dataIndex: 'sgstPer',
		key: 'sgstPer',
		width: '10%',
		align: 'right',
		render: (value) => `${parseFloat(value || 0).toFixed(2)}%`,
	},
	{
		title: 'SGST',
		dataIndex: 'sgstValue',
		key: 'sgstValue',
		width: '10%',
		align: 'right',
		render: (value) => parseFloat(value || 0).toFixed(2),
	},
	{
		title: 'IGST (%)',
		dataIndex: 'igstPer',
		key: 'igstPer',
		width: '10%',
		align: 'right',
		render: (value) => `${parseFloat(value || 0).toFixed(2)}%`,
	},
	{
		title: 'IGST',
		dataIndex: 'igstValue',
		key: 'igstValue',
		width: '10%',
		align: 'right',
		render: (value) => parseFloat(value || 0).toFixed(2),
	},
	{
		title: 'Total Tax',
		dataIndex: 'taxAmount',
		key: 'taxAmount',
		width: '10%',
		align: 'right',
		render: (value) => parseFloat(value || 0).toFixed(2),
	},
];


export let itemDefaultRecord = {
	itemId: null,
	itemName: null,
	description: '',
	rate: null,
	discount: null,
	discountAmount: null,
	qty: null,
	taxRate: null,
	taxId: null,
	totalAmount: null,
	serials: [],
	id: uuidv4(),
};

export const calculatePurchaseValues = (data, itemTaxPreferenceValue) => {
	const actualTotal = (parseFloat(data?.qty) || 0) * (parseFloat(data?.rate) || 0);
	const discountPercentage = parseFloat(data?.discount) || 0;
	const discountAmountFromUser = parseFloat(data?.discountAmount) || 0;

	let discountAmount = 0;

	if (discountPercentage > 0) {
		discountAmount = actualTotal * (discountPercentage / 100);
	} else if (discountAmountFromUser > 0) {
		discountAmount = discountAmountFromUser;
	}

	const taxableValue = actualTotal - discountAmount;

	let netAmount, taxAmount, grossAmount;
	const rate = parseFloat(data?.taxRate) || 0;

	if (itemTaxPreferenceValue === 'exclusive') {
		netAmount = taxableValue;
		taxAmount = taxableValue * (rate / 100);
		grossAmount = netAmount + taxAmount;
	} else {
		grossAmount = taxableValue;
		netAmount = (100 * taxableValue) / (100 + rate);
		taxAmount = grossAmount - netAmount;
	}

	return {
		actualTotal: actualTotal.toFixed(2),
		discountAmount: discountAmount,
		taxableValue: netAmount.toFixed(2),
		taxAmount: taxAmount.toFixed(2),
		totalAmount: grossAmount.toFixed(2),
	};
};

const AddTaxInvoice = ({ state, setState, refreshList, editData }) => {
	return <AddTaxInvoiceFunctional {...{ state, setState, refreshList, editData }} />;
};

export default AddTaxInvoice;
