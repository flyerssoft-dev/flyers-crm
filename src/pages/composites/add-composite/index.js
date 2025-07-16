import React from 'react';
import AddCompositeFunctional from './components/add-composite-functional';
import './styles.scss';

const AddComposite = ({ state, setState, refreshList, editData }) => {
	return <AddCompositeFunctional {...{ state, setState, refreshList, editData }} />;
};

export default AddComposite;
