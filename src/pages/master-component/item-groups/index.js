import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Popconfirm, Button, Pagination, Row, Col } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import { generatePagination } from 'helpers';
import TableComponent from 'components/table-component';
import { API_STATUS } from 'constants/app-constants';
import AddItemGroup from './add-item-group';
import { getApi } from '../../../redux/sagas/getApiDataSaga';
import { SERVER_IP } from '../../../assets/Config';
import { deleteApi } from '../../../redux/sagas/deleteApiSaga';
import { resetApiStatus } from '../../../redux/reducers/globals/globalActions';

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const ItemGroups = React.memo(() => {
	const globalRedux = useSelector((state) => state.globalRedux);
	const dispatch = useDispatch();

	const [itemGroupAddModal, setItemGroupAddModal] = useState(false);
	const [searchKey] = useState('');
	const [tableData, setTableData] = useState(globalRedux.itemGroups);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [editItemGroups, setEditItemGroups] = useState(null);

	const getItemGroups = useCallback(() => {
		let url = `${SERVER_IP}itemgroup/?orgId=${globalRedux?.selectedOrganization?._id}`;
		dispatch(getApi('GET_ITEM_GROUPS', url));
	}, [dispatch, globalRedux?.selectedOrganization?._id]);

	useEffect(() => {
		getItemGroups();
	}, [getItemGroups]);

	useEffect(() => {
		generatePagination(tableData);
	}, [tableData]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_ITEM_GROUP === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_ITEM_GROUP'));
			doIt = true;
		}
		if (doIt) {
			getItemGroups();
		}
	}, [globalRedux.apiStatus, getItemGroups, dispatch]);

	useEffect(() => {
		setTableData(globalRedux?.itemGroups);
	}, [globalRedux.itemGroups]);

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((accBook) => {
			return (accBook?.itemGroupName || '')?.toLowerCase().includes(searchKey.toLowerCase()) || (accBook?.profitMargin || '')?.toLowerCase().includes(searchKey.toLowerCase());
		});
	}, [tableData, searchKey]);

	const handleDrawer = (rowData) => {
		setEditItemGroups(rowData);
		setItemGroupAddModal(true);
	};

	const handleItemGroup = () => {
		setItemGroupAddModal(true);
		setEditItemGroups(null);
	};

	const column = [
		{
			title: 'ITEM GROUP NAME',
			dataIndex: 'itemGroupName',
			key: 'itemGroupName',
			width: '50%',
			align: 'left',
		},
		{
			title: 'REMARKS',
			dataIndex: 'remarks',
			key: 'remarks',
			width: '30%',
			align: 'left',
		},
		{
			title: 'Action',
			align: 'center',
			width: '20%',
			dataIndex: 'itemGroupName',
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
								onConfirm={() => {
									let url = `${SERVER_IP}itemgroup/${row._id}?orgId=${globalRedux?.selectedOrganization?._id}`;
									dispatch(deleteApi('DELETE_ITEM_GROUP', url));
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
		setItemGroupAddModal(false);
		setEditItemGroups(null);
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

	const loading = useMemo(() => globalRedux.apiStatus.GET_ITEM_GROUPS === API_STATUS.PENDING, [globalRedux.apiStatus]);

	return (
		<>
			<Row style={{ padding: '20px 10px' }}>
				<Col xl={16}>
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
									<Button type="primary" style={{ width: '100%' }} onClick={() => handleItemGroup()}>
										Add Item Group
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
								<Col span={8}>
									<div>{!!filteredData?.length && `Showing ${getStartingValue()} - ${getEndingValue()} of ${filteredData?.length} Data`}</div>
								</Col>
								<Col span={16}>
									<div style={{ textAlign: 'right' }}>
										<Pagination pageSizeOptions={intialPageSizeOptions} defaultPageSize={initialPageSize} showSizeChanger={true} total={filteredData?.length} onChange={handleTableChange} responsive />
									</div>
								</Col>
							</Row>
						)}
						onChange={handleTableChange}
					/>
				</Col>
			</Row>
			<AddItemGroup {...{ itemGroupAddModal, setItemGroupAddModal, refreshList: getItemGroups, handleClose, editItemGroups }} />
		</>
	);
});

export default ItemGroups;
