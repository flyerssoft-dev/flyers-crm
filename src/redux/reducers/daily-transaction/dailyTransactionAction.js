import { ACTIONS } from '../../../constants/app-constants';

function setDailyTransaction(data) {
	return {
		type: ACTIONS.GET_DAILY_TRANSACTION_LIST,
		payload: data,
	};
}

export { setDailyTransaction };
