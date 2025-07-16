import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { sendGetRequest } from 'redux/sagas/utils';
import { SERVER_IP } from 'assets/Config';
import AddPurchaseFunctional from './components/add-purchase-functional';
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

const AddPurchase = ({ state, setState, refreshList, editData }) => {
	return <AddPurchaseFunctional {...{ state, setState, refreshList, editData }} />;
};

export default AddPurchase;
