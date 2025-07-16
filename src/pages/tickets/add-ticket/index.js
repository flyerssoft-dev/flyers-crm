import React from 'react';
import AddTicketFunctional from './components/add-ticket-functional';
import './styles.scss';

const AddTicket = ({ visible, toggleVisible, refreshList }) => {
	return <AddTicketFunctional {...{ toggleVisible, refreshList, visible }} />;
};

export default AddTicket;
