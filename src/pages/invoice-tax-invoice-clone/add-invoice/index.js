import React from 'react';
import AddInvoiceFunctional from './components/add-invoice-functional';
import './styles.scss';

const AddInvoice = ({ state, setState, refreshList, editData }) => {
	return <AddInvoiceFunctional {...{ state, setState, refreshList, editData }} />;
};

export default AddInvoice;
