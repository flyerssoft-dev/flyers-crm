import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'antd';
import { SERVER_IP } from 'assets/Config';
import { API_STATUS } from 'constants/app-constants';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { putApi } from 'redux/sagas/putApiSaga';
import moment from 'moment';
import { getApi } from 'redux/sagas/getApiDataSaga';
import AddTaskPresentational from './add-task-presentational';

const AddTaskFunctional = ({ state, setState, refreshList, editData }) => {
	const globalRedux = useSelector((state) => state.globalRedux);
	const users = useSelector((state) => state.globalRedux?.users);
	const [form] = Form.useForm();
	const dispatch = useDispatch();

	const generateTableData = useCallback(
		(editData) => {
			if (editData._id) {
				form.setFieldsValue({
					projectId: editData?.projectId,
					taskName: editData?.taskName,
					dueDate: moment(editData?.dueDate),
					description: editData?.description,
					priority: editData?.priority,
				});
			}
		},
		[form]
	);

	const getProjects = useCallback(() => {
		let url = `${SERVER_IP}project/?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(getApi('GET_PROJECTS', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	const getUsers = useCallback(() => {
		let url = `${SERVER_IP}user?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(getApi('GET_USERS', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	useEffect(() => {
		getProjects();
		getUsers();
	}, [getProjects, getUsers]);

	useEffect(() => {
		if (!state?.visible) {
			form.resetFields();
		}
	}, [state?.visible, form]);

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_TASK === API_STATUS.SUCCESS || globalRedux.apiStatus.EDIT_TASK === API_STATUS.SUCCESS) {
			setState((state) => ({ ...state, visible: false }));
			refreshList();
			form.resetFields();
			dispatch(resetApiStatus(editData ? 'EDIT_TASK' : 'ADD_TASK'));
		}
		if (editData) {
			generateTableData(editData);
		}
	}, [globalRedux.apiStatus, editData, refreshList, dispatch, setState, form, generateTableData]);

	const loading = globalRedux.apiStatus.ADD_TASK === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_TASK === API_STATUS.PENDING;

	const handleSubmit = (values) => {
		const request = {
			orgId: globalRedux?.selectedOrganization?.id,
			...values,
		};
		editData ? dispatch(putApi(request, 'EDIT_TASK', `${SERVER_IP}task/${editData?._id}`)) : dispatch(postApi(request, 'ADD_TASK'));
	};

	// const debounceFn = debounce(handleSearch, 1000);

	return (
		<>
			<AddTaskPresentational
				{...{
					state,
					setState,
					handleSubmit,
					loading,
					editData,
					form,
					users,
				}}
			/>
		</>
	);
};

export default AddTaskFunctional;
