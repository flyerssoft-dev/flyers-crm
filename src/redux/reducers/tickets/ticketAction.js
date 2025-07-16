import { ACTIONS } from '../../../constants/app-constants';

function setTickets(data) {
	return {
		type: ACTIONS.GET_TICKETS,
		payload: data,
	};
}

function setTicketDetails(data) {
	return {
		type: ACTIONS.GET_TICKETS_DETAILS,
		payload: data,
	};
}

export { setTickets, setTicketDetails };
