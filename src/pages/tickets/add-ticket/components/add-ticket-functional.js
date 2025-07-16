import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'antd';
import AddTicketPresentational from './add-ticket-presentational';
import { SERVER_IP } from 'assets/Config';
import { ACTIONS, API_STATUS } from 'constants/app-constants';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { sendGetRequest } from 'redux/sagas/utils';
import { debounce } from 'lodash';

const AddTicketFunctional = ({ toggleVisible, refreshList, visible }) => {
	const [customerAddModal, setCustomerAddModal] = useState(false);
	const [searchString, setSearchString] = useState('');
	const [inputString, setInputString] = useState('');
	const [selectedCustomer, setSelectedCustomer] = useState(null);
	const [searchList, setSearchList] = useState({
		data: [],
		loading: false,
	});
	const [form] = Form.useForm();
	const customers = useSelector((state) => state.customerRedux?.customers);
	// const itemData = useSelector((state) => state.itemRedux?.items);
	const globalRedux = useSelector((state) => state.globalRedux);
	const organizationId = globalRedux.selectedOrganization._id;
	const dispatch = useDispatch();

	const handleSearch = useCallback(
		async (searchString) => {
			setSearchString(searchString);
			if (searchString) {
				setSearchList({
					loading: true,
				});
				const { data } = await sendGetRequest(
					null,
					`${SERVER_IP}customer/search?orgId=${globalRedux.selectedOrganization._id}&searchText=${searchString}`
				);
				setSearchList({ data, loading: false });
			}
		},
		[globalRedux.selectedOrganization._id]
	);

	useEffect(() => {
		if (!searchString || !visible) {
			setSearchList({
				data: [],
				loading: false,
			});
		}
	}, [searchString, visible]);

	const debounceFn = debounce(handleSearch, 1000);

	const getItems = useCallback(() => {
		let url = `${SERVER_IP}item?orgId=${organizationId}`;
		dispatch(getApi(ACTIONS.GET_ITEMS, url));
	}, [dispatch, organizationId]);

	const getCustomers = useCallback(() => {
		let url = `${SERVER_IP}customer?orgId=${organizationId}`;
		dispatch(getApi("GET_CUSTOMERS", url));
	}, [dispatch, organizationId]);

	useEffect(() => {
		getItems();
		getCustomers();
	}, [getCustomers, getItems]);

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_TICKET === 'SUCCESS') {
			form.resetFields();
			getItems();
			refreshList();
			toggleVisible(false);
			dispatch(resetApiStatus('ADD_TICKET'));
		}
	}, [globalRedux.apiStatus, getItems, refreshList, dispatch, toggleVisible, form]);

	const handleRowClick = useCallback(
		(data) => {
			form.setFieldsValue({
				customerName: data?.displayName,
				mobile: data?.mobile,
				address: `${data?.billingDetails?.[0]?.addressLine1 || ''} ${data?.billingDetails?.[0]?.addressLine2 || ''}`,
			});
			// setSearchString('');
			// setInputString('');
		},
	  [form],
	)
	
	const customersLoading = useMemo(() => globalRedux.apiStatus.GET_CUSTOMERS === API_STATUS.PENDING, [globalRedux.apiStatus]);
	
	useEffect(() => {
		const data = customers.find(customer => customer?._id === selectedCustomer)
		handleRowClick(data)
	}, [selectedCustomer, customers, handleRowClick])
	

	const handleSubmit = (values) => {
		const request = {
			orgId: globalRedux.selectedOrganization._id,
			customerId: selectedCustomer,
			...values,
			// customerId: '62642c8fcd1f4500e4b6b219',
		};
		delete request?.customerName;
		dispatch(postApi(request, 'ADD_TICKET'));
	};

	useEffect(() => {
	  !visible && form.resetFields();
	}, [visible, form])
	

	return (
		<AddTicketPresentational
			{...{
				visible,
				toggleVisible,
				form,
				handleSubmit,
				debounceFn,
				searchList,
				searchString,
				handleRowClick,
				inputString,
				setInputString,
				customers,
				setSelectedCustomer,
				getCustomers,
				customersLoading,
				customerAddModal,
				setCustomerAddModal,
			}}
		/>
	);
};

export default AddTicketFunctional;
