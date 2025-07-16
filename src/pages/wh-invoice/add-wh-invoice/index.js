import React from 'react';
import AddWHInvoiceFunctional from './components/add-wh-invoice-functional';
import './styles.scss';

const AddWHInvoice = ({ state, setState, refreshList, editData }) => {
	return <AddWHInvoiceFunctional {...{ state, setState, refreshList, editData }} />;
};

export default AddWHInvoice;
