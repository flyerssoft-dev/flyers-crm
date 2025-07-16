import React from 'react';
import AddTransportInvoiceFunctional from './components/add-transport-invoice-functional';
import './styles.scss';

const AddTransportInvoice = ({ state, setState, refreshList, editData }) => {
	return <AddTransportInvoiceFunctional {...{ state, setState, refreshList, editData }} />;
};

export default AddTransportInvoice;
