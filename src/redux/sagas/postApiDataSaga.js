import toast from 'react-hot-toast';
import { call, put, takeEvery } from 'redux-saga/effects';
import { setRegisterSuccess } from 'redux/reducers/register/registerActions';
import { RESTCallError, sendGetRequest, sendPostRequest } from './utils';
import { store } from '../store';
import { setApiStatus } from '../reducers/globals/globalActions';
import { setLoginSuccess } from '../reducers/login/loginActions';
import API_ENDPOINTS from 'redux/endpoints';

// Constants for API names
const API_NAMES = {
  LOGIN: 'LOGIN',
  VERIFY_OTP: 'VERIFY_OTP',
  REGISTER: 'REGISTER',
  ADD_STUDENT: 'ADD_STUDENT',
  ADD_VOUCHER: 'ADD_VOUCHER',
  ADD_RECEIPT: 'ADD_RECEIPT',
  ADD_LOAD_IN: 'ADD_LOAD_IN',
  ADD_ACCOUNT_BOOK: 'ADD_ACCOUNT_BOOK',
  ADD_PROJECT: 'ADD_PROJECT',
  ADD_VOUCHER_HEAD: 'ADD_VOUCHER_HEAD',
  ADD_STAFF: 'ADD_STAFF',
  ADD_ASSETS: 'ADD_ASSETS',
  ADD_VEHICLE: 'ADD_VEHICLE',
  ADD_VENDOR: 'ADD_VENDOR',
  ADD_INVOICE: 'ADD_INVOICE',
  ADD_CREDENTIAL: 'ADD_CREDENTIAL',
  ADD_CUSTOMER: 'ADD_CUSTOMER',
  ADD_USER: 'ADD_USER',
  MODIFY_USER_ROLE: 'MODIFY_USER_ROLE',
  ADD_PART_NUMBER: 'ADD_PART_NUMBER',
  ADD_BATCH: 'ADD_BATCH',
  ADD_CLASS: 'ADD_CLASS',
  ADD_BATCH_BALANCE: 'ADD_BATCH_BALANCE',
  ADD_CATEGORY: 'ADD_CATEGORY',
  ADD_UNIT: 'ADD_UNIT',
};

// Constants for API statuses
const API_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};

function postApi(body, apiName, url, extras) {
  return {
    type: 'POST_API_DATA',
    url,
    body,
    apiName,
    extras,
  };
}

// Reusable helper for displaying toast and dispatching success actions
function* handleSuccess(apiName, response) {
  const successMessages = {
    [API_NAMES.LOGIN]: 'Logged In!',
    [API_NAMES.VERIFY_OTP]: 'Logged In!',
    [API_NAMES.REGISTER]: 'Registered successfully!',
    [API_NAMES.ADD_STUDENT]: 'Student added successfully!',
    [API_NAMES.ADD_VOUCHER]: 'Voucher added successfully!',
    [API_NAMES.ADD_RECEIPT]: 'Receipt added successfully!',
    [API_NAMES.ADD_LOAD_IN]: 'Load In added successfully!',
    [API_NAMES.ADD_ACCOUNT_BOOK]: 'Account book added successfully!',
    [API_NAMES.ADD_PROJECT]: 'Project added successfully!',
    [API_NAMES.ADD_VOUCHER_HEAD]: 'Voucher head added successfully!',
    [API_NAMES.ADD_STAFF]: 'Staff added successfully!',
    [API_NAMES.ADD_ASSETS]: 'Asset added successfully!',
    [API_NAMES.ADD_VEHICLE]: 'Vehicle added successfully!',
    [API_NAMES.ADD_VENDOR]: 'Vendor added successfully!',
    [API_NAMES.ADD_INVOICE]: 'Invoice created successfully!',
    [API_NAMES.ADD_CREDENTIAL]: 'Credential added successfully!',
    [API_NAMES.ADD_CUSTOMER]: 'Customer added successfully!',
    [API_NAMES.ADD_USER]: 'User added successfully!',
    [API_NAMES.MODIFY_USER_ROLE]: 'User role modified!',
    [API_NAMES.ADD_PART_NUMBER]: 'Part number added successfully!',
    [API_NAMES.ADD_BATCH]: 'Batch added successfully!',
    [API_NAMES.ADD_CLASS]: 'Class added successfully!',
    [API_NAMES.ADD_BATCH_BALANCE]: 'Updated successfully!',
    [API_NAMES.ADD_CATEGORY]: 'Category created successfully!',
    [API_NAMES.ADD_UNIT]: 'Unit created successfully!',
  };

  const message = successMessages[apiName] || 'Action successful!';
  toast.success(message);

  // Dispatch specific actions for API names that require it
  if (apiName === API_NAMES.LOGIN || apiName === API_NAMES.VERIFY_OTP) {
    yield put(setLoginSuccess(response));
  } else if (apiName === API_NAMES.REGISTER) {
    yield put(setRegisterSuccess(response));
  }

  yield put(setApiStatus(apiName, API_STATUS.SUCCESS));
}

function* postApiDataWorker(param) {
	let apiName = param.apiName;
	try {
	//   yield put(setApiStatus(apiName, API_STATUS.PENDING));
	  store.dispatch(setApiStatus(apiName, API_STATUS.PENDING));
	  const result = yield call(sendPostRequest, param);
  
	  if (result?.status >= 200 && result?.status <= 204) {
		yield handleSuccess(apiName, result.data);
	  } else {
		const errorMessage = result?.error?.response?.data?.message || 'Something went wrong!';
		toast.error(errorMessage);
		RESTCallError(result, apiName);
		yield put(setApiStatus(apiName, API_STATUS.ERROR));
	  }
	} catch (error) {
	  toast.error('An error occurred!');
	  console.error('Error in postApiDataWorker:', error);
	  yield put(setApiStatus(apiName, API_STATUS.ERROR));
	}
  }
  

function* postApiDataSaga() {
  yield takeEvery('POST_API_DATA', postApiDataWorker);
}

export { postApi, postApiDataSaga };
