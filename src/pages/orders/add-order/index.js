import React from 'react';
import AddOrderFunctional from './components/add-order-functional';
import './styles.scss';

const AddOrder = ({ state, setState, refreshList, editData }) => {
	return <AddOrderFunctional {...{ state, setState, refreshList, editData }} />;
};

export default AddOrder;
