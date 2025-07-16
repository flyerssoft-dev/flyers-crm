import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Popconfirm, Button, Pagination, Row, Col } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import TableComponent from 'components/table-component';
import { getApi } from '../../redux/sagas/getApiDataSaga';
import { SERVER_IP } from '../../assets/Config';
import { getDateFormat } from '../../services/Utils';
import { deleteApi } from '../../redux/sagas/deleteApiSaga';
import { resetApiStatus } from '../../redux/reducers/globals/globalActions';
import HighlightComponent from '../../components/HighlightComponent';
import AddDrawer from 'components/drawer-component';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import { generatePagination } from 'helpers';

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const Assets = React.memo(() => {
	const globalRedux = useSelector((state) => state.globalRedux);
	const [assetsAddModal, setAssetsAddModal] = useState(false);
	const [searchKey] = useState('');
	const [tableData, setTableData] = useState(globalRedux?.assets || []);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [editAsset, setEditAsset] = useState(null);
	const dispatch = useDispatch();

	const getAssets = useCallback(() => {
		let url = `${SERVER_IP}asset?orgId=${globalRedux?.selectedOrganization?._id}`;
		dispatch(getApi('GET_ASSETS', url));
	}, [dispatch, globalRedux?.selectedOrganization?._id]);

	useEffect(() => {
		getAssets();
		generatePagination(tableData);
	}, [getAssets, tableData]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_ASSETS === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_ASSETS'));
			doIt = true;
		}
		if (doIt) {
			getAssets();
		}
	}, [globalRedux.apiStatus, getAssets, dispatch]);

	useEffect(() => {
		setTableData(globalRedux?.assets || []);
	}, [globalRedux?.assets]);

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
		setAssetsAddModal(true);
	};

	const handleStaff = () => {
		setEditAsset(null);
		setAssetsAddModal(true);
	};

	const column = [
		{
			title: 'Asset name',
			dataIndex: 'assetName',
			key: 'assetName',
			fixed: 'left',
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
			),
		},
		{
			title: 'Opening balance',
			dataIndex: 'openingBalance',
			align: 'right',
			render: (value) => value,
		},
		{
			title: 'Opening Date',
			dataIndex: 'openingDate',
			align: 'left',
			render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />,
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
			dataIndex: 'assetName',
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
									let url = `${SERVER_IP}asset/${row._id}?orgId=${globalRedux?.selectedOrganization?._id}`;
									dispatch(deleteApi('DELETE_ASSETS', url));
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
										Add Asset
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
			<AddDrawer {...{ assetsAddModal, setAssetsAddModal, getAssets, editAsset }} />
		</>
	);
});

export default Assets;
