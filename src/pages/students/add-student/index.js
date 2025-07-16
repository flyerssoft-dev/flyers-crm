import React from 'react';
import AddStudentFunctional from './components/add-student-functional';
import './styles.scss';

const AddStudent = ({ state, setState, refreshList }) => {
	return <AddStudentFunctional {...{ state, setState, refreshList }} />;
};

export default AddStudent;
