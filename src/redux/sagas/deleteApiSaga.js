import toast from 'react-hot-toast';
import { call, takeEvery, put } from 'redux-saga/effects';
import { setApiStatus } from '../reducers/globals/globalActions';
import { store } from '../store';
import { RESTCallError, sendDeleteRequest } from './utils';

function deleteApi(apiName, url, body, extras) {
	return {
		type: 'DELETE_API_DATA',
		apiName: apiName,
		url: url,
		body: body,
		extras: extras,
	};
}

function* deleteApiDataSaga() {
	yield takeEvery('DELETE_API_DATA', deleteApiDataWorker);
}

function* deleteApiDataWorker(param) {
	let url = param.url;
	let apiName = param.apiName;
	try {
		store.dispatch(setApiStatus(apiName, 'PENDING'));
		const result = yield call(sendDeleteRequest, apiName, url, param.body);
		if (result.status === 200) {
			yield deleteApiDataSuccess(result.data, apiName, param.extras);
		} else if (result.status === 'Error') {
			toast.error(result?.error?.response?.data?.message || 'Something went wrong!');
			RESTCallError(result, apiName);
		}
	} catch (error) {
	}
}

function* deleteApiDataSuccess(response, apiName, extras) {
	// toast.success('Deleted');
	switch (apiName) {
		// case 'DELETE_PROJECT':
		// 	SuccessNotification('Success', 'Project Deleted');
		// 	break;

		// case 'DELETE_DOCUMENT':
		// 	SuccessNotification('Success', 'Document deleted');
		// 	break;

		// case 'DELETE_ITEM':
		// 	SuccessNotification('Success', 'Item Deleted');
		// 	break;
		// case 'DELETE_SUB_ITEM':
		// 	SuccessNotification('Success', 'Sub Item Deleted');
		// 	break;

		// case 'DELETE_CUSTOMER':
		// 	SuccessNotification('Success', 'Customer has Been Removed');
		// 	break;
		// case 'DELETE_SUPPLIER':
		// 	SuccessNotification('Success', 'Supplier has Been Removed');
		// 	break;
		// case 'DELETE_AGENT':
		// 	SuccessNotification('Success', 'Agent has Been Removed');
		// 	break;
		case 'DELETE_INVOICE':
			toast.success('Deleted');
			break;
		case 'DELETE_TICKET':
			toast.success('Ticket has been deleted');
			break;
		case 'DELETE_ORDER':
			toast.success('Order has been deleted');
			break;
		// case 'DELETE_DAILY_TRANSACTION':
		// 	SuccessNotification('Success', 'Daily Transaction has Been Removed');
		// 	break;
		// case 'DELETE_PRODUCTION':
		// 	SuccessNotification('Success', 'Production has Been Removed');
		// 	break;
		// case 'DELETE_ACC_BOOK':
		// 	SuccessNotification('Success', 'Account Book has Been Removed');
		// 	break;
		// case 'DELETE_VOUCHER':
		// 	SuccessNotification('Success', 'Voucher has Been Removed');
		// 	break;

		default:
			break;
	}
	yield put(setApiStatus(apiName, 'SUCCESS'));
}

export { deleteApi, deleteApiDataSaga };
