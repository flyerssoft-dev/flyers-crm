import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Popconfirm, Button, Pagination, Row, Col } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import { generatePagination } from 'helpers';
import TableComponent from 'components/table-component';
import AddDrawer from 'components/drawer-component';
import { getApi } from '../../redux/sagas/getApiDataSaga';
import { SERVER_IP } from '../../assets/Config';
import { getDateFormat } from '../../services/Utils';
import { deleteApi } from '../../redux/sagas/deleteApiSaga';
import { resetApiStatus } from '../../redux/reducers/globals/globalActions';
import HighlightComponent from '../../components/HighlightComponent';

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const Credentials = React.memo(() => {
	const globalRedux = useSelector((state) => state?.globalRedux);
	const dispatch = useDispatch();

	const [credentialAddModal, setCredentialAddModal] = useState(false);
	const [searchKey] = useState('');
	const [tableData, setTableData] = useState(globalRedux?.credentials || []);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [editCredential, setEditAsset] = useState(null);

	const getCredential = useCallback(() => {
		let url = `${SERVER_IP}credential?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(getApi('GET_CREDENTIALS', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	const getUsers = useCallback(() => {
		let url = `${SERVER_IP}user?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(getApi('GET_USERS', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	useEffect(() => {
		getCredential();
		getUsers();
		generatePagination(tableData);
	}, [getCredential, getUsers, tableData]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_CREDENTIAL === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_CREDENTIAL'));
			doIt = true;
		}
		if (doIt) {
			getCredential();
		}
	}, [globalRedux.apiStatus, dispatch, getCredential]);

	useEffect(() => {
		setTableData(globalRedux?.credentials || []);
	}, [globalRedux?.credentials]);

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((asset) => {
			return (
				(asset?.assetName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(asset?.openingBalance || '')?.toLowerCase().includes(searchKey.toLowerCase())
			);
		});
	}, [tableData, searchKey]);

	const handleDrawer = (rowData) => {
		setEditAsset(rowData);
		setCredentialAddModal(true);
	};

	const handleStaff = () => {
		setEditAsset(null);
		setCredentialAddModal(true);
	};

	const column = [
		{
			title: 'Credential name',
			dataIndex: 'credName',
			key: 'credName',
			fixed: 'left',
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
			),
		},
		{
			title: 'User name',
			dataIndex: 'userName',
			key: 'userName',
			fixed: 'left',
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
			),
		},
		{
			title: 'URL',
			dataIndex: 'url',
			key: 'url',
			fixed: 'left',
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
			),
		},
		{
			title: 'Auth Key',
			dataIndex: 'authkey',
			key: 'authkey',
			fixed: 'left',
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
			),
		},
		{
			title: 'GSTIN',
			dataIndex: 'gstin',
			key: 'gstin',
			fixed: 'left',
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
			),
		},
		{
			title: 'Created Date',
			dataIndex: 'createdAt',
			align: 'left',
			render: (value) => getDateFormat(value),
		},
		{
			title: 'Created By',
			dataIndex: 'createdBy',
			align: 'left',
			render: (value) => value?.firstName,
		},
		{
			title: 'Action',
			align: 'center',
			dataIndex: 'credName',
			render: (value, row) => {
				return (
					<Row gutter={10} justify="center">
						<Col onClick={() => handleDrawer(row)} className="edit_icon">
							<EditOutlined />
						</Col>
						<Col className="delete_icon">
							<Popconfirm
								title={`Are you sure to Delete ${value}?`}
								okText="Delete"
								cancelText="No"
								placement="rightTop"
								onConfirm={() => {
									let url = `${SERVER_IP}credential/${row._id}?orgId=${globalRedux?.selectedOrganization?.id}`;
									dispatch(deleteApi('DELETE_CREDENTIAL', url));
								}}>
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

	return (
		<>
			<Row style={{ padding: '20px 10px' }}>
				<Col xl={24}>
					<TableComponent
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
										Add Credential
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
									<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
			<AddDrawer {...{ credentialAddModal, setCredentialAddModal, getCredential, editCredential }} />
		</>
	);
});

export default Credentials;
