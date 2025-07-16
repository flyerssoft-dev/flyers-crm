import toast from 'react-hot-toast';
import { call, put, takeEvery } from 'redux-saga/effects';
import { setApiStatus } from '../reducers/globals/globalActions';
import { RESTCallError, sendPutRequest } from './utils';
import { store } from '../store';

function putApi(body, apiName, url, extras) {
	return {
		type: 'PUT_API_DATA',
		url: url,
		body: body,
		apiName: apiName,
		extras: extras,
	};
}

function* putApiDataSaga() {
	yield takeEvery('PUT_API_DATA', putApiDataWorker);
}

function* putApiDataWorker(param) {
	let apiName = param.apiName;
	try {
		store.dispatch(setApiStatus(apiName, 'PENDING'));
		const result = yield call(sendPutRequest, param);
		if (result.status >= 200 && result.status <= 204) {
			yield putApiDataSuccess(result.data, apiName, param.extras);
		} else if (result.status === 'Error') {
			toast.error(result?.error?.response?.data?.message || 'Something went wrong!');
			RESTCallError(result, apiName);
		}
	} catch (error) {
	}
}

function* putApiDataSuccess(response, apiName, extras) {
	toast.success('Updated!!');
	// switch (apiName) {
	// 	case 'EDIT_ITEM':
	// 		SuccessNotification('Success', 'Item Details Edited');
	// 		break;
	// 	default:
	// 		break;
	// }
	yield put(setApiStatus(apiName, 'SUCCESS'));
}

export { putApi, putApiDataSaga };
