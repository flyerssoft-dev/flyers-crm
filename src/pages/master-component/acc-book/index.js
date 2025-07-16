import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Popconfirm, Button, Pagination, Row, Col } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { CloseOutlined } from '@ant-design/icons';
import AddDrawer from 'components/drawer-component';
import { generatePagination } from 'helpers';
import TableComponent from 'components/table-component';
import { getApi } from '../../../redux/sagas/getApiDataSaga';
import { SERVER_IP } from '../../../assets/Config';
import { getDateFormat } from '../../../services/Utils';
import { deleteApi } from '../../../redux/sagas/deleteApiSaga';
import { resetApiStatus } from '../../../redux/reducers/globals/globalActions';
import HighlightComponent from '../../../components/HighlightComponent';
import { API_STATUS } from 'constants/app-constants';
import AddAccountBook from './add-acc-book';

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const AccountBook = React.memo(() => {
	const globalRedux = useSelector((state) => state.globalRedux);
	const dispatch = useDispatch();

	const [accBookAddModal, setAccBookAddModal] = useState(false);
	const [searchKey] = useState('');
	const [tableData, setTableData] = useState(globalRedux.accountBooks);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [editAccountBooks, setEditAccountBooks] = useState(null);

	const getAccountBooks = useCallback(() => {
		let url = `${SERVER_IP}accbook/?orgId=${globalRedux?.selectedOrganization?._id}`;
		dispatch(getApi('GET_ACCOUNT_BOOKS', url));
	}, [dispatch, globalRedux?.selectedOrganization?._id]);

	useEffect(() => {
		getAccountBooks();
	}, [getAccountBooks]);
	
	useEffect(() => {
		generatePagination(tableData);
	}, [tableData]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_ACC_BOOK === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_ACC_BOOK'));
			doIt = true;
		}
		if (doIt) {
			getAccountBooks();
		}
	}, [globalRedux.apiStatus, getAccountBooks, dispatch]);

	useEffect(() => {
		setTableData(globalRedux?.accountBooks);
	}, [globalRedux?.accountBooks]);

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((accBook) => {
			return (
				(accBook?.accbookName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(accBook?.openingBalance || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(accBook?.openingDate || '')?.toLowerCase().includes(searchKey.toLowerCase())
			);
		});
	}, [tableData, searchKey]);

	// const handleDrawer = (rowData) => {
	// 	setEditAccountBooks(rowData);
	// 	setAccBookAddModal(true);
	// };

	const handleStaff = () => {
		setAccBookAddModal(true);
		setEditAccountBooks(null);
	};

	const column = [
		{
			title: 'Account book name',
			dataIndex: 'accbookName',
			key: 'accbookName',
			// sorter: (a, b) => a.displayName.localeCompare(b.displayName),
			fixed: 'left',
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
			),
		},
		{
			title: 'Opening Balance',
			dataIndex: 'openingBalance',
			key: 'openingBalance',
			align: 'right',
			render: (value) => value,
		},
		{
			title: 'Closing Balance',
			dataIndex: 'closingBalance',
			key: 'closingBalance',
			align: 'right',
			render: (value) => value,
		},
		{
			title: 'Created Date',
			dataIndex: 'createdAt',
			align: 'left',
			// sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
			render: (value) => getDateFormat(value),
		},
		{
			title: 'Created By',
			dataIndex: 'createdBy',
			align: 'left',
			// sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
			render: (value) => value?.firstName,
		},
		{
			title: 'Action',
			align: 'center',
			dataIndex: 'accbookName',
			render: (value, row) => {
				return (
					<Row gutter={10} justify="center">
						{/* <Col onClick={() => handleDrawer(row)} className="edit_icon">
							<EditOutlined />
						</Col> */}
						<Col className="delete_icon">
							<Popconfirm
								title={`Are you sure to Delete ${value}?`}
								okText="Delete"
								cancelText="No"
								onConfirm={() => {
									let url = `${SERVER_IP}accbook/${row._id}?orgId=${globalRedux?.selectedOrganization?._id}`;
									dispatch(deleteApi('DELETE_ACC_BOOK', url));
								}}
								placement="rightTop">
								<CloseOutlined />
							</Popconfirm>
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

	const handleClose = () => {
		setAccBookAddModal(false);
		setEditAccountBooks(null);
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

	const loading = useMemo(() => globalRedux.apiStatus.GET_ACCOUNT_BOOKS === API_STATUS.PENDING, [globalRedux.apiStatus]);

	return (
		<>
			<Row style={{ padding: '20px 10px' }}>
				<Col xl={24}>
					<TableComponent
						loading={loading}
						className="custom-table"
						style={{ width: '100%' }}
						columns={column}
						bordered
						rowKey={(record) => record._id}
						dataSource={filteredData}
						title={() => (
							<Row justify="space-between">
								<Col md={3}>
									{/* <Input
										placeholder="Search"
										suffix={<AiOutlineSearch />}
										style={{ borderRadius: '8px' }}
										onChange={({ target: { value } }) => setSearchKey(value)}
									/> */}
								</Col>

								<Col md={7}></Col>
								<Col>
									<Button type="primary" style={{ width: '100%' }} onClick={() => handleStaff(true)}>
										Add Account book
									</Button>
								</Col>
							</Row>
						)}
						pagination={{
							current: currentPage,
							pageSize: pageSize,
							position: ['none', 'none'],
						}}
						footer={() => (
							<Row justify="space-between">
								<Col>
									<div>
										{!!filteredData?.length &&
											`Showing ${getStartingValue()} - ${getEndingValue()} of ${filteredData?.length} Data`}
									</div>
								</Col>
								<Col md={8}>
									<div style={{ textAlign: 'right' }}>
										<Pagination
											pageSizeOptions={intialPageSizeOptions}
											defaultPageSize={initialPageSize}
											showSizeChanger={true}
											total={filteredData?.length}
											onChange={handleTableChange}
											responsive
										/>
									</div>
								</Col>
							</Row>
						)}
						onChange={handleTableChange}
					/>
				</Col>
			</Row>
			<AddAccountBook {...{ accBookAddModal, setAccBookAddModal, getAccountBooks, editAccountBooks, handleClose, refreshList: getAccountBooks }} />
		</>
	);
});

export default AccountBook;
