import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'antd';
import moment from 'moment';
import { SERVER_IP } from 'assets/Config';
import { ACTIONS, API_STATUS } from 'constants/app-constants';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { putApi } from 'redux/sagas/putApiSaga';
import { getApi } from 'redux/sagas/getApiDataSaga';
import AddVoucherPresentational from './add-voucher-presentational';

const AddVoucherFunctional = ({ state, setState, refreshList }) => {
	const [voucherHeadModal, setVoucherHeadModal] = useState(false);
	const [form] = Form.useForm();
	const projects = useSelector((state) => state?.projectRedux?.projects);
	const globalRedux = useSelector((state) => state.globalRedux);
	const { accountBooks = [], users = [], subCategories = [] } = globalRedux;
	const voucherTypeValue = Form.useWatch('voucherType', form);
	const categoryIdValue = Form.useWatch('categoryId', form);
	const isPersonal = voucherTypeValue === 'Personal';
	const dispatch = useDispatch();

	const getVoucherHeads = useCallback(() => {
		let url = `${SERVER_IP}voucherhead/?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(getApi('GET_VOUCHERS_HEAD', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	useEffect(() => {
		if (state?.selectedRow) {
			form.setFieldsValue({
				...state?.selectedRow,
				voucherDate: moment(state?.selectedRow?.voucherDate),
				categoryId: state?.selectedRow?.categoryId?._id,
				subcategoryId: state?.selectedRow?.subcategoryId?._id,
				accbookId: state?.selectedRow?.accbookId?._id,
				personalUserId: state?.selectedRow?.personalUserId?._id,
			});
		} else {
			form.resetFields();
		}
	}, [state?.selectedRow, form]);

	useEffect(() => {
		if (!state?.visible) {
			form.resetFields();
		}
	}, [state?.visible, form]);

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_VOUCHER === API_STATUS.SUCCESS || globalRedux.apiStatus.EDIT_VOUCHER === API_STATUS.SUCCESS) {
			setState({ ...state, visible: false });
			refreshList();
			form.resetFields();
			dispatch(resetApiStatus(state?.selectedRow ? ACTIONS.EDIT_VOUCHER : ACTIONS.ADD_VOUCHER));
		}
	}, [globalRedux.apiStatus, dispatch, setState, state, refreshList, form]);

	const handleSubmit = (values) => {
		const request = {
			orgId: globalRedux?.selectedOrganization?.id,
			...values,
		};
		dispatch(postApi(request, ACTIONS.ADD_VOUCHER));
	};

	const handleEdit = (values) => {
		let data = {
			...values,
			orgId: globalRedux?.selectedOrganization?.id,
		};
		let url = `${SERVER_IP}voucher/${state?.selectedRow?._id}`;
		dispatch(putApi(data, ACTIONS.EDIT_VOUCHER, url));
	};

	const loading = globalRedux.apiStatus.ADD_VOUCHER === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_VOUCHER === API_STATUS.PENDING;

	const getProjects = useCallback(() => {
		let url = `${SERVER_IP}project/?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(getApi('GET_PROJECTS', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	const getAccountBooks = useCallback(() => {
		let url = `${SERVER_IP}accbook/?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(getApi('GET_ACCOUNT_BOOKS', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);
	
	const getUsers = useCallback(() => {
		let url = `${SERVER_IP}user?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(getApi('GET_USERS', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	const getSubCategories = useCallback(() => {
		let url = `${SERVER_IP}subcategory/?orgId=${globalRedux?.selectedOrganization?.id}&categoryId=${categoryIdValue}`;
		dispatch(getApi('GET_SUB_CATEGORIES', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id, categoryIdValue]);

	useEffect(() => {
		if (state?.visible) {
			getProjects();
			getAccountBooks();
			getUsers();
		}
	}, [getProjects, getAccountBooks, getUsers, state?.visible]);

	useEffect(() => {
		if (!form || !state?.selectedRow) return;
	
		const selectedRow = state.selectedRow;
	
		form.setFieldsValue({
			personalUserId: isPersonal
				? selectedRow?.personalUserId?._id || undefined
				: null,
			projectId: isPersonal
				? null
				: selectedRow?.projectId?._id || undefined,
		});
	}, [isPersonal, state?.selectedRow, form]);
	
	const accountBooksLoading = useMemo(() => globalRedux.apiStatus.GET_ACCOUNT_BOOKS === API_STATUS.PENDING, [globalRedux.apiStatus]);
	// const categoriesLoading = useMemo(() => globalRedux.apiStatus.GET_CATEGORIES === API_STATUS.PENDING, [globalRedux.apiStatus]);
	// const subCategoriesLoading = useMemo(() => globalRedux.apiStatus.GET_SUB_CATEGORIES === API_STATUS.PENDING, [globalRedux.apiStatus]);
	const projectsLoading = useMemo(() => globalRedux.apiStatus.GET_PROJECTS === API_STATUS.PENDING, [globalRedux.apiStatus]);

	useEffect(() => {
		if (categoryIdValue) {
			const currentSubCat = form.getFieldValue('subcategoryId');
			const validSubCats = subCategories.map((sub) => sub._id);
			if (!validSubCats.includes(currentSubCat)) {
				// form.setFieldsValue({ subcategoryId: undefined });
			}
		}
	}, [categoryIdValue, subCategories]);

	useEffect(() => {
		if (categoryIdValue) {
			getSubCategories();
		}
	}, [categoryIdValue, getSubCategories]);
		
		
	return (
		<AddVoucherPresentational
			{...{
				state,
				setState,
				form,
				handleSubmit,
				loading,
				handleEdit,
				voucherHeadModal,
				setVoucherHeadModal,
				getVoucherHeads,
				accountBooks,
				users,
				isPersonal,
				projects,
				categoryIdValue,
				projectsLoading,
				accountBooksLoading,
			}}
		/>
	);
};

export default AddVoucherFunctional;
