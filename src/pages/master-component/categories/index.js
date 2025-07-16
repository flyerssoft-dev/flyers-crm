import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Popconfirm, Button, Pagination, Row, Col } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import AddDrawer from 'components/drawer-component';
import { generatePagination } from 'helpers';
import TableComponent from 'components/table-component';
import { API_STATUS } from 'constants/app-constants';
import { getApi } from '../../../redux/sagas/getApiDataSaga';
import { SERVER_IP } from '../../../assets/Config';
import { deleteApi } from '../../../redux/sagas/deleteApiSaga';
import { resetApiStatus } from '../../../redux/reducers/globals/globalActions';
import AddCategory from './add-category';

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const Categories = React.memo(() => {
	const globalRedux = useSelector((state) => state.globalRedux);
	const dispatch = useDispatch();

	const [categoryAddModal, setCategoryAddModal] = useState(false);
	const [searchKey] = useState('');
	const [tableData, setTableData] = useState(globalRedux.categories);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [editCategories, setEditCategories] = useState(null);

	const getCategories = useCallback(() => {
		let url = `${SERVER_IP}category/?orgId=${globalRedux?.selectedOrganization?._id}`;
		dispatch(getApi('GET_CATEGORIES', url));
	}, [dispatch, globalRedux?.selectedOrganization?._id]);

	useEffect(() => {
		getCategories();
	}, [getCategories]);

	useEffect(() => {
		generatePagination(tableData);
	}, [tableData]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_CATEGORY === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_CATEGORY'));
			doIt = true;
		}
		if (doIt) {
			getCategories();
		}
	}, [globalRedux.apiStatus, getCategories, dispatch]);

	useEffect(() => {
		setTableData(globalRedux?.categories);
	}, [globalRedux.categories]);

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((accBook) => {
			return (accBook?.categoryName || '')?.toLowerCase().includes(searchKey.toLowerCase()) || (accBook?.profitMargin || '')?.toLowerCase().includes(searchKey.toLowerCase());
		});
	}, [tableData, searchKey]);

	const handleDrawer = (rowData) => {
		setEditCategories(rowData);
		setCategoryAddModal(true);
	};

	const handleCategory = () => {
		setCategoryAddModal(true);
		setEditCategories(null);
	};

	const column = [
		{
			title: 'CATEGORY NAME',
			dataIndex: 'categoryName',
			key: 'categoryName',
			width: '25%',
			align: 'left',
		},
		{
			title: 'TYPE',
			dataIndex: 'type',
			key: 'type',
			width: '25%',
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
			dataIndex: 'categoryName',
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
									let url = `${SERVER_IP}category/${row._id}?orgId=${globalRedux?.selectedOrganization?._id}`;
									dispatch(deleteApi('DELETE_CATEGORY', url));
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
		setCategoryAddModal(false);
		setEditCategories(null);
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

	const loading = useMemo(() => globalRedux.apiStatus.GET_CATEGORIES === API_STATUS.PENDING, [globalRedux.apiStatus]);

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
									<Button type="primary" style={{ width: '100%' }} onClick={() => handleCategory()}>
										Add Category
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
			<AddCategory {...{ categoryAddModal, setCategoryAddModal, refreshList: getCategories, handleClose, editCategories }} />
		</>
	);
});

export default Categories;
