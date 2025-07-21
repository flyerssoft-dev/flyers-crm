import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Row, Col } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { SERVER_IP } from 'assets/Config';
import HighlightComponent from 'components/HighlightComponent';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { generatePagination } from 'helpers';
import { API_STATUS, CUSTOMER_TYPE } from 'constants/app-constants';
import AccountsListPresentational from './accounts-list-presentational';

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const AccountsListFunctional = React.memo(() => {
	const leadsRedux = useSelector((state) => state.leadsRedux);
	const globalRedux = useSelector((state) => state.globalRedux);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [accountAddModal, setAccountAddModal] = useState(false);
	const [searchKey, setSearchKey] = useState('');
	const [tableData, setTableData] = useState(leadsRedux.leads);
	const [editAccount, setEditAccount] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);

	const dispatch = useDispatch();

	const getAccounts = useCallback(() => {
		let url = `${SERVER_IP}customer?orgId=${globalRedux?.selectedOrganization?._id}&type=${CUSTOMER_TYPE[2]}`;
		dispatch(getApi('GET_LEADS', url));
	}, [dispatch, globalRedux?.selectedOrganization?._id]);

	useEffect(() => {
		getAccounts();
	}, [getAccounts]);

	useEffect(() => {
		generatePagination(tableData);
	}, [tableData]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_LEAD === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_LEAD'));
			setSelectedRowKeys([]);
			doIt = true;
		}
		if (doIt) {
			getAccounts();
		}
	}, [globalRedux.apiStatus, dispatch, getAccounts]);

	useEffect(() => {
		setTableData(leadsRedux.leads);
	}, [leadsRedux.leads]);

	const filteredData = useMemo(() => {
		if (searchKey === '') return tableData;
		return tableData.filter((lead) => {
			return (
				(lead?.customerNumber || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(lead?.displayName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(lead?.mobile || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(lead?.email || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(lead?.gstTreatment || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(lead?.address || '')?.toString().toLowerCase().includes(searchKey.toLowerCase()) ||
				(lead?.gstin || '')?.toString().toLowerCase().includes(searchKey.toLowerCase()) ||
				(lead?.gstTreatment || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(lead?.panCard || '')?.toLowerCase().includes(searchKey.toLowerCase) ||
				// (lead?.remarks || '')?.toLowerCase().includes(searchKey.toLowerCase())
				(lead?.outstandingBalance || '')?.toString().toLowerCase().includes(searchKey.toLowerCase())
			);
		});
	}, [tableData, searchKey]);

	const handleDrawer = (rowData) => {
		setEditAccount(rowData);
		setAccountAddModal(true);
	};

	const handleAddAccount = () => {
		console.log('fff')
		setEditAccount(null);
		setAccountAddModal(true);
	};

	const column = [
		{
			title: '#',
			dataIndex: 'customerNumber',
			key: 'customerNumber',
			sorter: (a, b) => a?.customerNumber - b?.customerNumber,
			fixed: 'left',
			render: (value) => (
				<HighlightComponent
					highlightClassName="highlightClass"
					searchWords={[searchKey]}
					autoEscape={true}
					textToHighlight={value?.toString()}
				/>
			),
		},
		{
			title: 'Account Name',
			dataIndex: 'displayName',
			key: 'displayName',
			sorter: (a, b) => a?.displayName?.localeCompare(b?.displayName),
			fixed: 'left',
			render: (value) => (
				<div style={{ fontWeight: 'bold' }}>
					<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
				</div>
			),
		},
		{
			title: 'Mobile',
			dataIndex: 'mobile',
			sorter: (a, b) => a?.mobile - b?.mobile,
			align: 'left',
			render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			sorter: (a, b) => a?.email?.localeCompare(b?.email),
			align: 'left',
			width: '15%',
			render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />,
		},
		{
			title: 'GST Treatment',
			dataIndex: 'gstTreatment',
			sorter: (a, b) => a?.gstTreatment?.localeCompare(b?.gstTreatment),
			align: 'left',
			render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />,
		},
		{
			title: 'GSTIN',
			dataIndex: 'gstin',
			sorter: (a, b) => a?.gstTreatment?.localeCompare(b?.gstTreatment),
			align: 'left',
			render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />,
		},
		{
			title: 'Balance',
			dataIndex: 'outstandingBalance',
			align: 'right',
			sorter: (a, b) => a?.outstandingBalance - b?.outstandingBalance,
			render: (value) => {
				if (!!value) {
					return <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value.toFixed(2)} />;
				} else {
					return <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={(0).toFixed(2)} />;
				}
			},
		},
		{
			title: 'Action',
			align: 'center',
			dataIndex: 'displayName',
			render: (value, row, index) => {
				return (
					<Row justify="center">
						<Col className="edit_icon" onClick={() => handleDrawer(row)}>
							<EditOutlined />
						</Col>
					</Row>
				);
			},
		},
	];

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

	const tableLoading = useMemo(() => globalRedux.apiStatus.GET_LEADS === API_STATUS.PENDING, [globalRedux.apiStatus]);

	const onSelectChange = (selectedRowKeys) => {
		setSelectedRowKeys(selectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
		// fixed: true,
	};

	const handleClose = useCallback(
		() => {
			setAccountAddModal(false)
			setEditAccount(null)
		},
	  [setAccountAddModal,setEditAccount],
	)
	

	return (
		<AccountsListPresentational
			{...{
				filteredData,
				column,
				tableLoading,
				rowSelection,
				selectedRowKeys,
				handleAddAccount,
				currentPage,
				pageSize,
				intialPageSizeOptions,
				initialPageSize,
				handleTableChange,
				setSearchKey,
				getStartingValue,
				getEndingValue,
				accountAddModal,
				setAccountAddModal,
				refreshList: getAccounts,
				editAccount,
				handleClose
			}}
		/>
	);
});

export default AccountsListFunctional;
