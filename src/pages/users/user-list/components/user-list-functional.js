import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
	// Row, Col,
	Select,
	Switch,
	Modal,
} from 'antd';
// import { EditOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { SERVER_IP } from 'assets/Config';
import HighlightComponent from 'components/HighlightComponent';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { generatePagination } from 'helpers';
import { API_STATUS, USER_TYPE } from 'constants/app-constants';
import { postApi } from 'redux/sagas/postApiDataSaga';
import UserListPresentational from './user-list-presentational';
import { sendPostRequest } from 'redux/sagas/utils';

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const { confirm } = Modal;

const UserListFunctional = React.memo(() => {
	const globalRedux = useSelector((state) => state.globalRedux);
	const loginUser = useSelector((state) => state.loginRedux);
	const users = useSelector((state) => state?.globalRedux?.users);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [userAddModal, setUserAddModal] = useState(false);
	const [searchKey, setSearchKey] = useState('');
	const [tableData, setTableData] = useState(users);
	const [editUser, setEditUser] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const dispatch = useDispatch();

	const getUsers = useCallback(() => {
		let url = `${SERVER_IP}user?orgId=${globalRedux.selectedOrganization._id}`;
		dispatch(getApi('GET_USERS', url));
	}, [dispatch, globalRedux.selectedOrganization._id]);

	useEffect(() => {
		getUsers();
	}, [getUsers]);

	useEffect(() => {
		generatePagination(tableData);
	}, [tableData]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_USER === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_USER'));
			setSelectedRowKeys([]);
			doIt = true;
		}
		if (doIt) {
			getUsers();
		}
		if (globalRedux.apiStatus.MODIFY_USER_ROLE === 'SUCCESS') {
			dispatch(resetApiStatus('MODIFY_USER_ROLE'));
			getUsers?.();
		}
	}, [globalRedux.apiStatus.DELETE_USER, globalRedux.apiStatus.MODIFY_USER_ROLE, dispatch, getUsers]);

	useEffect(() => {
		setTableData(users);
	}, [users]);

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((user) => {
			return (
				(user?.userNumber || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(user?.firstName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(user?.lastName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(user?.mobile || '')?.toLowerCase().includes(searchKey.toLowerCase())
			);
		});
	}, [tableData, searchKey]);

	// const handleDrawer = (rowData) => {
	// 	setEditUser(rowData);
	// 	setUserAddModal(true);
	// };

	const handleModifyRole = async (rowData, value) => {
		let data = {
			orgId: globalRedux?.selectedOrganization?._id,
			userId: loginUser?.id,
			accessLevel: value || '',
			staffId: rowData?._id,
		};
		dispatch(postApi(data, 'MODIFY_USER_ROLE'));
	};

	const handleAddUser = () => {
		setEditUser(null);
		setUserAddModal(true);
	};

	const handleClick = (value, row) => {
		confirm({
			title: `${row?.userId?.firstName} ${row?.userId?.lastName}`,
			content: (
				<div>
					Are you sure you want to{' '}
					<span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{value ? 'Deactivate' : 'Activate'}</span> this user?
				</div>
			),
			okText: 'Yes',
			cancelText: 'No',
			onOk() {
				console.log(true);
				sendPostRequest({
					url: `${SERVER_IP}user/updatestatus`,
					body: {
						orgId: globalRedux.selectedOrganization._id,
						userId: loginUser?.id,
						staffId: row?.userId?._id,
						isActive: !value,
					},
				})
					.then((res) => {
						if (res?.error?.response?.data?.code) {
							toast.error(res?.error?.response?.data?.message || 'Something went wrong!');
						} else {
							getUsers();
						}
					})
					.catch((err) => {
						// console.log('🚀 ~ file: user-list-functional.js:124 ~ onOk ~ err:', err);
					});
			},
		});
	};

	const column = [
		{
			title: 'First Name',
			dataIndex: 'firstName',
			key: 'firstName',
			width: '20%',
			sorter: (a, b) => a?.firstName?.localeCompare(b?.firstName),
			render: (value, row) => (
				<HighlightComponent
					highlightClassName="highlightClass"
					searchWords={[searchKey]}
					autoEscape={true}
					textToHighlight={`${(row?.firstName || '-')} ${(row?.lastName || '-')}`}
				/>
			),
		},
		// {
		// 	title: 'Last Name',
		// 	dataIndex: 'userId',
		// 	key: 'userId',
		// 	sorter: (a, b) => a?.lastName?.localeCompare(b?.userId?.lastName),
		// 	fixed: 'left',
		// 	render: (value) => (
		// 		<HighlightComponent
		// 			highlightClassName="highlightClass"
		// 			searchWords={[searchKey]}
		// 			autoEscape={true}
		// 			textToHighlight={value?.lastName}
		// 		/>
		// 	),
		// },
		{
			title: 'Mobile',
			dataIndex: 'mobile',
			sorter: (a, b) => a?.mobile - b?.mobile,
			align: 'left',
			width: '20%',
			render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />,
		},
		// {
		// 	title: 'Email',
		// 	dataIndex: 'userId',
		// 	sorter: (a, b) => a?.email?.localeCompare(b?.userId?.email),
		// 	align: 'left',
		// 	width: '25%',
		// 	render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value?.email} />,
		// },
		{
			title: 'Status',
			dataIndex: 'isActive',
			align: 'center',
			width: '10%',
			render: (value, row) => (
				<Switch
					disabled={loginUser?.id === row?._id}
					style={{ width: '80%' }}
					checkedChildren="Active"
					unCheckedChildren="Inactive"
					checked={value}
					onChange={() => handleClick(value, row)}
				/>
			),
		},
		{
			title: 'Access Level',
			dataIndex: 'accessLevel',
			sorter: (a, b) => a?.accessLevel?.localeCompare(b?.accessLevel),
			align: 'left',
			width: '20%',
			render: (value, rowData) => (
				<Select
					disabled={loginUser?.id === rowData?._id}
					style={{ width: '100%' }}
					onChange={(value) => handleModifyRole(rowData, value)}
					placeholder="select user type"
					value={value}>
					{USER_TYPE.map((type) => (
						<Select.Option key={type} value={type}>
							{type}
						</Select.Option>
					))}
				</Select>
			),
		},
		// {
		// 	title: 'Action',
		// 	align: 'center',
		// 	dataIndex: 'displayName',
		// 	render: (value, row, index) => {
		// 		return (
		// 			<Row justify="center">
		// 				<Col className="edit_icon" onClick={() => handleDrawer(row)}>
		// 					<EditOutlined />
		// 				</Col>
		// 			</Row>
		// 		);
		// 	},
		// },
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

	const tableLoading = useMemo(
		() => globalRedux.apiStatus.GET_USERS === API_STATUS.PENDING || globalRedux.apiStatus.MODIFY_USER_ROLE === API_STATUS.PENDING,
		[globalRedux?.apiStatus?.GET_USERS, globalRedux.apiStatus.MODIFY_USER_ROLE]
	);

	const onSelectChange = (selectedRowKeys) => {
		setSelectedRowKeys(selectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
		columnWidth: '5%',
		// fixed: true,
	};

	const handleClose = useCallback(() => {
		setUserAddModal(false);
		setEditUser(null);
	}, [setUserAddModal, setEditUser]);

	const selectedRowKey = selectedRowKeys?.[0];

	const userDetail = useMemo(() => {
		if (selectedRowKey) {
			return filteredData?.find((data) => data?._id === selectedRowKey);
		}
		return null;
	}, [selectedRowKey, filteredData]);
	// console.log("🚀 ~ file: user-list-functional.js:239 ~ userDetail ~ userDetail:", userDetail, selectedRowKeys)

	return (
		<UserListPresentational
			{...{
				filteredData,
				column,
				tableLoading,
				rowSelection,
				selectedRowKeys,
				handleAddUser,
				currentPage,
				pageSize,
				intialPageSizeOptions,
				initialPageSize,
				handleTableChange,
				setSearchKey,
				getStartingValue,
				getEndingValue,
				userAddModal,
				setUserAddModal,
				refreshList: getUsers,
				editUser,
				handleClose,
				userDetail,
			}}
		/>
	);
});

export default UserListFunctional;
