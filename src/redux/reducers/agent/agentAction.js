import { ACTIONS } from '../../../constants/app-constants';

function setAgents(data) {
	return {
		type: ACTIONS.GET_AGENTS,
		payload: data,
	};
}

export { setAgents };
