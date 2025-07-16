import React from 'react';
import TicketDetailsPresentational from './ticket-details-presentational';

const TicketDetailsFunctional = ({ visible, closeModal }) => {
	return <TicketDetailsPresentational {...{ visible, closeModal }}/>;
};

export default TicketDetailsFunctional;
