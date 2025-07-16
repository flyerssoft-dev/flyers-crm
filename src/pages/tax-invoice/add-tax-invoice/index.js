import React from 'react';
import AddTaxInvoiceFunctional from './components/add-tax-invoice-functional';
import './styles.scss';

const AddTaxInvoice = ({ state, setState, refreshList, editData }) => {
	return <AddTaxInvoiceFunctional {...{ state, setState, refreshList, editData }} />;
};

export default AddTaxInvoice;
