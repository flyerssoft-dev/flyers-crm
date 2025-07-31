import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'antd';
import moment from 'moment';
import { SERVER_IP } from 'assets/Config';
import { ACTIONS, API_STATUS } from 'constants/app-constants';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { putApi } from 'redux/sagas/putApiSaga';
import AddStudentPresentational from './add-student-presentational';

const AddStudentFunctional = ({ state, setState, refreshList }) => {
	const [form] = Form.useForm();
	const globalRedux = useSelector((state) => state.globalRedux);
	const { classes = [] } = globalRedux;
	const dispatch = useDispatch();

	useEffect(() => {
		if (state?.selectedRow) {
			form.setFieldsValue({
				...state?.selectedRow,
				classId: state?.selectedRow?.classId?._id,
				dateofBirth: moment(state?.selectedRow?.dateofBirth),
				dateofJoin: moment(state?.selectedRow?.dateofJoin),
			});
		} else {
			form.resetFields();
		}
	}, [state?.selectedRow, form]);

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_STUDENT === API_STATUS.SUCCESS || globalRedux.apiStatus.EDIT_STUDENT === API_STATUS.SUCCESS) {
			setState({ ...state, visible: false });
			refreshList();
			dispatch(resetApiStatus(state?.selectedRow ? ACTIONS.EDIT_STUDENT : ACTIONS.ADD_STUDENT));
		}
	}, [globalRedux.apiStatus, dispatch, setState, state, refreshList]);

	const handleSubmit = (values) => {
		const request = {
			orgId: globalRedux?.selectedOrganization?.id,
			currentBatchId: globalRedux?.activeBatch,
			students: [{ ...values }],
		};
		dispatch(postApi(request, ACTIONS.ADD_STUDENT));
	};

	const handleEdit = (values) => {
		let data = {
			...values,
			orgId: globalRedux?.selectedOrganization?.id,
			currentBatchId: globalRedux?.activeBatch,
		};
		let url = `${SERVER_IP}student/${state?.selectedRow?._id}`;
		dispatch(putApi(data, ACTIONS.EDIT_STUDENT, url));
	};

	const loading = globalRedux.apiStatus.ADD_STUDENT === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_STUDENT === API_STATUS.PENDING;

	return (
		<AddStudentPresentational
			{...{
				state,
				setState,
				classes,
				loading,
				form,
				handleSubmit,
				handleEdit,
			}}
		/>
	);
};

export default AddStudentFunctional;
