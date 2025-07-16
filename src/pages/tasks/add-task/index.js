import React from 'react';
import AddTaskFunctional from './components/add-task-functional';
import './styles.scss';

const AddTask = ({ state, setState, refreshList, editData }) => {
	return <AddTaskFunctional {...{ state, setState, refreshList, editData }} />;
};

export default AddTask;
