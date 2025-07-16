import React from 'react';
import TicketDetailsFunctional from './components/ticket-details-functional';
import './ticket-details.scss';

const TicketDetail = ({ visible, closeModal }) => <TicketDetailsFunctional {...{ visible, closeModal }}/>;

export default TicketDetail;
