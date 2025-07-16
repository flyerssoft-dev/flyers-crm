import { ACTIONS } from '../../../constants/app-constants';

function setProduction(data) {
	return {
		type: ACTIONS.GET_PRODUCTION_LIST,
		payload: data,
	};
}

export { setProduction };
