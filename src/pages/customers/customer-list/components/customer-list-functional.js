import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Row, Col } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { SERVER_IP } from 'assets/Config';
import HighlightComponent from 'components/HighlightComponent';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { convertToIndianRupees, generatePagination } from 'helpers';
import { API_STATUS, CUSTOMER_TYPE } from 'constants/app-constants';
import CustomerListPresentational from './customer-list-presentational';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

const initialPageSize = 20;
const intialPageSizeOptions = [10, 15, 20];

const useQuery = () => {
	return queryString.parse(useLocation().search);
};

const CustomerListFunctional = React.memo(() => {
	const query = useQuery();
	const selectedCustomer = query.selectedCustomer;
	// const selectedCustomer = query.get('selectedCustomer');
	console.log('🚀 ~ CustomerListFunctional ~ selectedCustomer:', selectedCustomer);

	const customerRedux = useSelector((state) => state.customerRedux);
	const globalRedux = useSelector((state) => state.globalRedux);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [customerAddModal, setCustomerAddModal] = useState(false);
	const [searchKey, setSearchKey] = useState('');
	const [tableData, setTableData] = useState(customerRedux.customers);
	const [editCustomer, setEditCustomer] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const dispatch = useDispatch();

	const getCustomers = useCallback(() => {
		let url = `${SERVER_IP}customer?orgId=${globalRedux?.selectedOrganization?._id}&type=${CUSTOMER_TYPE[0]}`;
		dispatch(getApi('GET_CUSTOMERS', url));
	}, [dispatch, globalRedux?.selectedOrganization?._id]);

	useEffect(() => {
		getCustomers();
	}, [getCustomers]);

	useEffect(() => {
		generatePagination(tableData);
	}, [tableData]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_CUSTOMER === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_CUSTOMER'));
			setSelectedRowKeys([]);
			doIt = true;
		}
		if (doIt) {
			getCustomers();
		}
	}, [globalRedux.apiStatus, dispatch, getCustomers]);

	useEffect(() => {
		setTableData(customerRedux.customers);
	}, [customerRedux.customers]);

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((customer) => {
			return (
				(customer?.customerNumber || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(customer?.displayName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(customer?.mobile || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(customer?.email || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(customer?.gstTreatment || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(customer?.address || '')?.toString().toLowerCase().includes(searchKey.toLowerCase()) ||
				(customer?.gstin || '')?.toString().toLowerCase().includes(searchKey.toLowerCase()) ||
				(customer?.gstTreatment || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(customer?.panCard || '')?.toLowerCase().includes(searchKey.toLowerCase) ||
				// (customer?.remarks || '')?.toLowerCase().includes(searchKey.toLowerCase())
				(customer?.closingBalance || '')?.toString().toLowerCase().includes(searchKey.toLowerCase())
			);
		});
	}, [tableData, searchKey]);

	const handleDrawer = (rowData) => {
		setEditCustomer(rowData);
		setCustomerAddModal(true);
	};

	const handleAddCustomer = () => {
		setEditCustomer(null);
		setCustomerAddModal(true);
	};

	const column = useMemo(() => {
		const baseColumns = [
			{
				title: '#',
				dataIndex: 'customerNumber',
				key: 'customerNumber',
				width: 50,
				sorter: (a, b) => a?.customerNumber - b?.customerNumber,
				render: (value) => <HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape textToHighlight={value?.toString()} />,
			},
			{
				title: 'All Customers',
				dataIndex: 'displayName',
				key: 'displayName',
				sorter: (a, b) => a?.displayName?.localeCompare(b?.displayName),
				render: (value) => (
					<div style={{ fontWeight: 'bold' }}>
						<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape textToHighlight={value} />
					</div>
				),
			},
			{
				title: 'Mobile',
				dataIndex: 'mobile',
				sorter: (a, b) => a?.mobile - b?.mobile,
				align: 'left',
				render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape textToHighlight={value} />,
			},
			{
				title: 'Email',
				dataIndex: 'email',
				sorter: (a, b) => a?.email?.localeCompare(b?.email),
				align: 'left',
				width: '15%',
				render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape textToHighlight={value} />,
			},
			{
				title: 'GST Treatment',
				dataIndex: 'gstTreatment',
				sorter: (a, b) => a?.gstTreatment?.localeCompare(b?.gstTreatment),
				align: 'left',
				render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape textToHighlight={value} />,
			},
			{
				title: 'GSTIN',
				dataIndex: 'gstin',
				sorter: (a, b) => a?.gstTreatment?.localeCompare(b?.gstTreatment),
				align: 'left',
				render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape textToHighlight={value} />,
			},
			{
				title: 'Balance',
				dataIndex: 'closingBalance',
				align: 'right',
				sorter: (a, b) => a?.closingBalance - b?.closingBalance,
				render: (value) => {
					const formattedValue = value ? convertToIndianRupees(value) : (0).toFixed(2);
					return <HighlightComponent searchWords={[searchKey]} autoEscape textToHighlight={formattedValue} />;
				},
			},
			{
				title: 'Unused Credits',
				dataIndex: 'unusedCredits',
				align: 'right',
				sorter: (a, b) => a?.unusedCredits - b?.unusedCredits,
				render: (value) => {
					const formattedValue = value ? convertToIndianRupees(value) : (0).toFixed(2);
					return <HighlightComponent searchWords={[searchKey]} autoEscape textToHighlight={formattedValue} />;
				},
			},
			{
				title: 'Action',
				align: 'center',
				dataIndex: 'displayName',
				render: (value, row) => (
					<Row justify="center">
						<Col className="edit_icon" onClick={() => handleDrawer(row)}>
							<EditOutlined />
						</Col>
					</Row>
				),
			},
		];

		// Modify columns if selectedCustomer is present
		if (selectedCustomer) {
			return [
				{
					title: 'All Customers',
					dataIndex: 'displayName',
					key: 'displayName',
					render: (value, record) => (
						<div>
							<b>{value}</b>
							<div>Balance: {convertToIndianRupees(record?.closingBalance)}</div>
						</div>
					),
				},
			];
		}

		return baseColumns;
	}, [selectedCustomer, searchKey]);

	const handleTableChange = (currentPage, pageSize) => {
		setCurrentPage(currentPage);
		setPageSize(pageSize);
	};

	const getStartingValue = () => {
		if (currentPage === 1) return 1;
		else {
			return (currentPage - 1) * pageSize + 1;
		}
	};

	const getEndingValue = () => {
		if (currentPage === 1) return tableData.length < pageSize ? tableData.length : pageSize;
		else {
			let end = currentPage * pageSize;
			return end > tableData.length ? tableData.length : end;
		}
	};

	const tableLoading = useMemo(() => globalRedux.apiStatus.GET_CUSTOMERS === API_STATUS.PENDING, [globalRedux.apiStatus]);

	const onSelectChange = (selectedRowKeys) => {
		setSelectedRowKeys(selectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
		// fixed: true,
	};

	const handleClose = useCallback(() => {
		setCustomerAddModal(false);
		setEditCustomer(null);
	}, [setCustomerAddModal, setEditCustomer]);

	const selectedCustomerDetails = useMemo(() => {
		if (selectedCustomer) {
			return tableData.find((customer) => customer._id === selectedCustomer);
		}
		return null;
	}, [selectedCustomer, tableData]);
	console.log('🚀 ~ selectedCustomerDetails ~ selectedCustomerDetails:', selectedCustomerDetails);

	return (
		<CustomerListPresentational
			{...{
				filteredData,
				column,
				tableLoading,
				rowSelection,
				selectedRowKeys,
				handleAddCustomer,
				currentPage,
				pageSize,
				intialPageSizeOptions,
				initialPageSize,
				handleTableChange,
				setSearchKey,
				getStartingValue,
				getEndingValue,
				customerAddModal,
				setCustomerAddModal,
				refreshList: getCustomers,
				editCustomer,
				handleClose,
				selectedCustomerDetails,
			}}
		/>
	);
});

export default CustomerListFunctional;
