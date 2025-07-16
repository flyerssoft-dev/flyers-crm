import React from 'react';
import AddReceiptFunctional from './components/add-receipt-functional';
import './styles.scss';

const AddReceipt = ({ state, setState, refreshList }) => {
	return <AddReceiptFunctional {...{ state, setState, refreshList }} />;
};

export default AddReceipt;
