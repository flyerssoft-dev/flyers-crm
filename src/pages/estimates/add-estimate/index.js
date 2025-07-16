import React from 'react';
import AddEstimateFunctional from './components/add-estimate-functional';
import './styles.scss';

const AddEstimate = ({ state, setState, refreshList, editData }) => {
	return <AddEstimateFunctional {...{ state, setState, refreshList, editData }} />;
};

export default AddEstimate;
