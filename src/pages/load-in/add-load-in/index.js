import React from 'react';
import AddLoadInFunctional from './components/add-load-in-functional';
import './styles.scss';

const AddLoadIn = ({ state, setState, refreshList, editData }) => {
	return <AddLoadInFunctional {...{ state, setState, refreshList, editData }} />;
};

export default AddLoadIn;
