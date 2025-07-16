import { ACTIONS } from '../../../constants/app-constants';

function setInvoices(data) {
	return {
		type: ACTIONS.GET_INVOICES,
		payload: data,
	};
}

export { setInvoices };
