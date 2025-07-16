import API_ENDPOINTS from '../endpoints';
import axios from 'axios';
import { store } from '../store';
import { setApiStatus } from '../reducers/globals/globalActions';
import { ErrorNotification } from '../../components/Notification';

const timeoutInMs = 10000;

const sendPostRequest = async (data) => {
	try {
		const response = await axios.post(data.url || API_ENDPOINTS[data.apiName], data.body, {
			timeout: timeoutInMs,
			headers: {
				Authorization: store.getState().loginRedux.token,
			},
		});
		return response;
	} catch (err) {
		return {
			status: 'Error',
			request: data,
			error: err,
		};
	}
};

const sendGetRequest = async (apiName, url) => {
	try {
		const response = await axios.get(url || API_ENDPOINTS[apiName], {
			timeout: timeoutInMs,
			headers: {
				Authorization: store.getState().loginRedux.token,
			},
		});
		return response;
	} catch (err) {
		return {
			status: 'Error',
			apiName: apiName,
			error: err,
		};
	}
};

const sendDeleteRequest = async (apiName, url, body) => {
	try {
		const response = await axios.delete(url || API_ENDPOINTS[apiName], {
			timeout: timeoutInMs,
			headers: {
				Authorization: store.getState().loginRedux.token,
			},
			data: body,
		});
		return response;
	} catch (err) {
		return {
			status: 'Error',
			apiName: apiName,
			error: err,
		};
	}
};

const sendPutRequest = async (data) => {
	try {
		const response = await axios.put(data.url || API_ENDPOINTS[data.apiName], data.body, {
			timeout: timeoutInMs,
			headers: {
				Authorization: store.getState().loginRedux.token,
			},
		});
		return response;
	} catch (err) {
		return {
			status: 'Error',
			request: data,
			error: err,
		};
	}
};

function RESTCallError(result, apiName) {
	// const message = result?.error?.response?.data?.message || 'Error';
	store.dispatch(setApiStatus(apiName, 'FAILED'));
	if (navigator.onLine) {
		// switch (apiName) {
		// 	case 'LOGIN':
		// 		ErrorNotification('LOGIN', message);
		// 		break;
		// 	case 'REGISTER':
		// 		ErrorNotification('REGISTER', message);
		// 		break;
		// 	case 'ADD_ATTACHMENT':
		// 		ErrorNotification('ADD_DOCUMENT', message);
		// 		break;
		// 	case 'ADD_ITEM':
		// 		ErrorNotification('ADD_ITEM', message);
		// 		break;
		// 	case 'ADD_SUB_ITEM':
		// 		ErrorNotification('ADD_SUB_ITEM', message);
		// 		break;
		// 	default:
		// 		break;
		// }
	} else {
		ErrorNotification('Network Error', 'Check Your Connection');
	}
}

export { sendPostRequest, sendGetRequest, sendPutRequest, RESTCallError, sendDeleteRequest };
