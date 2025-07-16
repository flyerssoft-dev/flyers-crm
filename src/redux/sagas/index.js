import { all } from 'redux-saga/effects';
import { deleteApiDataSaga } from './deleteApiSaga';
import { getApiDataSaga } from './getApiDataSaga';
import { postApiDataSaga } from './postApiDataSaga';
import { putApiDataSaga } from './putApiSaga';

function* rootSaga() {
	yield all([postApiDataSaga(), getApiDataSaga(), deleteApiDataSaga(), putApiDataSaga()]);
}

export default rootSaga;
