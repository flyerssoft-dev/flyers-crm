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

const Vendors = React.memo(() => {
	const globalRedux = useSelector((state) => state?.globalRedux);
	const dispatch = useDispatch();

	const [vendorAddModal, setVendorAddModal] = useState(false);
	const [searchKey] = useState('');
	const [tableData, setTableData] = useState(globalRedux?.vendors || []);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [editVendor, setEditAsset] = useState(null);

	const getVendor = useCallback(() => {
		let url = `${SERVER_IP}vendor?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(getApi('GET_VENDORS', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	useEffect(() => {
		getVendor();
		generatePagination(tableData);
	}, [getVendor, tableData]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_VENDOR === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_VENDOR'));
			doIt = true;
		}
		if (doIt) {
			getVendor();
		}
	}, [globalRedux.apiStatus, getVendor, dispatch]);

	useEffect(() => {
		setTableData(globalRedux?.vendors || []);
	}, [globalRedux?.vendors]);

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
		setVendorAddModal(true);
	};

	const handleStaff = () => {
		setEditAsset(null);
		setVendorAddModal(true);
	};

	const column = [
		{
			title: 'Vendor name',
			dataIndex: 'vendorName',
			key: 'vendorName',
			fixed: 'left',
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
			),
		},
		{
			title: 'Vendor Type',
			dataIndex: 'vendorType',
			key: 'vendorType',
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
			title: 'Mobile',
			dataIndex: 'mobile',
			key: 'mobile',
			fixed: 'left',
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
			),
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			fixed: 'left',
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
			),
		},
		{
			title: 'Place Of Supply',
			dataIndex: 'placeOfSupply',
			key: 'placeOfSupply',
			fixed: 'left',
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
			),
		},
		{
			title: 'Remarks',
			dataIndex: 'remarks',
			render: (value) => value,
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
			dataIndex: 'vendorName',
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
									let url = `${SERVER_IP}vendor/${row._id}?orgId=${globalRedux?.selectedOrganization?.id}`;
									dispatch(deleteApi('DELETE_VENDOR', url));
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
										Add Vendor
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
			<AddDrawer {...{ vendorAddModal, setVendorAddModal, getVendor, editVendor }} />
		</>
	);
});

export default Vendors;
