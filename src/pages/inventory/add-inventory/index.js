import React from 'react';
import AddInventoryFunctional from './components/add-inventory-functional';
import './styles.scss';

const AddInventory = ({ state, setState, refreshList, editData }) => {
	return <AddInventoryFunctional {...{ state, setState, refreshList, editData }} />;
};

export default AddInventory;
