import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import { Input, Button, Form, Pagination, Popconfirm, Row, Col } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { deleteApi } from 'redux/sagas/deleteApiSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { SERVER_IP } from 'assets/Config';
import { API_STATUS } from 'constants/app-constants';
import TableComponent from 'components/table-component';
import { generatePagination } from 'helpers';
import AddItem from './add-item';
import HighlightComponent from 'components/HighlightComponent';

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const Items = React.memo(() => {
	const itemRedux = useSelector((state) => state.itemRedux);
	const globalRedux = useSelector((state) => state.globalRedux);
	const categories = useSelector((state) => state?.globalRedux.categories);
	const [tableData, setTableData] = useState(itemRedux.items);
	const [searchKey, setSearchKey] = useState('');
	const [showAddItemModal, setShowAddItemModal] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [, setIsStock] = useState(false);
	const dispatch = useDispatch();

	const [showEditItemModal, setShowEditItemModal] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);
	const [formInstance] = Form.useForm();
	const categoryIdValue = Form.useWatch('categoryId', formInstance);
	const purchasePriceValue = Form.useWatch('purchasePrice', formInstance);

	useEffect(() => {
		if (categoryIdValue) {
			const profitMargin = categories?.find((category) => category?._id === categoryIdValue)?.profitMargin || 0;
			const sellingPrice = parseFloat(purchasePriceValue || 0) + parseFloat(((purchasePriceValue || 0) * profitMargin) / 100);
			formInstance.setFieldsValue({
				sellingPrice,
			});
		}
	}, [categoryIdValue, purchasePriceValue, categories, formInstance]);

	const getItems = React.useCallback(() => {
		let url = `${SERVER_IP}item?orgId=${globalRedux.selectedOrganization._id}`;
		dispatch(getApi('GET_ITEMS', url));
	}, [dispatch, globalRedux.selectedOrganization._id]);

	useEffect(() => {
		!showAddItemModal && setIsStock(false);
	}, [showAddItemModal]);

	const getUnits = useCallback(() => {
		let url = `${SERVER_IP}unit?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(getApi('GET_UNITS', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	useEffect(() => {
		getUnits();
	}, [getUnits]);

	useEffect(() => {
		getItems();
	}, [getItems]);

	useEffect(() => {
		generatePagination(tableData);
	}, [tableData]);

	useEffect(() => {
		setTableData(itemRedux.items);
	}, [itemRedux.items]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_ITEM === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_ITEM'));
			doIt = true;
		}
		if (doIt) {
			let url = `${SERVER_IP}item?orgId=${globalRedux.selectedOrganization._id}`;
			dispatch(getApi('GET_ITEMS', url));
		}
	}, [globalRedux.apiStatus, dispatch, globalRedux.selectedOrganization._id, formInstance]);

	const column = [
		{
			title: '#',
			dataIndex: 'itemNumber',
			sorter: (a, b) => a?.itemNumber - b?.itemNumber,
			align: 'center',
			fixed: 'left',
		},
		{
			title: 'Item Group',
			dataIndex: 'itemgroupId',
			align: 'left',
			width: '8%',
			render: (value) => <div>{value?.itemGroupName}</div>,
		},
		{
			title: 'Item Name',
			dataIndex: 'itemName',
			align: 'left',
			width: '12%',
			sorter: (a, b) => a.itemName?.localeCompare(b.itemName),
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
			title: 'Item/Barcode',
			dataIndex: 'itemCode',
			sorter: (a, b) => a.itemCode?.localeCompare(b.itemCode),
			align: 'left',
			render: (value) => (
				<HighlightComponent
					highlightClassName="highlightClass"
					searchWords={[searchKey]}
					autoEscape={true}
					textToHighlight={value?.toString()}
				/>
			),
		},
		// {
		// 	title: 'Print Name',
		// 	dataIndex: 'printName',
		// 	align: 'left',
		// },
		{
			title: 'HsnSac',
			dataIndex: 'hsnSac',
			align: 'left',
			sorter: (a, b) => a.hsnSac?.localeCompare(b.hsnSac),
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
			title: 'Unit',
			dataIndex: 'unitId',
			align: 'left',
			sorter: (a, b) => a.unitId?.unitName?.localeCompare(b.unitId?.unitName),
			render: (value) => (
				<HighlightComponent
					highlightClassName="highlightClass"
					searchWords={[searchKey]}
					autoEscape={true}
					textToHighlight={value?.unitName?.toString()}
				/>
			),
		},
		{
			title: 'Pur. Price',
			dataIndex: 'purchasePrice',
			align: 'right',
			width: '10%',
			sorter: (a, b) => a?.purchasePrice - b?.purchasePrice,
			render: (value) => parseFloat(value || 0).toFixed(2),
		},
		{
			title: 'Sell. Price',
			dataIndex: 'sellingPrice',
			align: 'right',
			width: '10%',
			sorter: (a, b) => a?.sellingPrice - b?.sellingPrice,
			render: (value) => parseFloat(value || 0).toFixed(2),
		},
		{
			title: 'MRP',
			dataIndex: 'mrp',
			align: 'right',
			sorter: (a, b) => a?.mrp - b?.mrp,
			render: (value) => parseFloat(value || 0).toFixed(2),
		},
		{
			title: 'GST %',
			dataIndex: 'taxId',
			align: 'right',
			render: (value) => (
				<HighlightComponent
					highlightClassName="highlightClass"
					searchWords={[searchKey]}
					autoEscape={true}
					textToHighlight={value?.taxName?.toString() || '-'}
				/>
			),
		},
		{
			title: 'Curr. Stock',
			dataIndex: 'currentStock',
			align: 'right',
			width: '8%',
		},
		{
			title: 'Action',
			dataIndex: 'itemName',
			render: (value, row, index) => {
				return (
					<Row>
						<Col
							className="edit_icon"
							onClick={() => {
								setSelectedItem(row);
								formInstance.setFieldsValue({
									...row,
									categoryId: row?.categoryId?._id,
									unitId: row?.unitId?._id,
								});
								setShowEditItemModal(true);
							}}>
							<EditOutlined />
						</Col>
						<Col className="delete_icon">
							<Popconfirm
								title={`Are you sure to Delete ${value} ?`}
								okText="Delete"
								cancelText="No"
								placement="left"
								onConfirm={() => {
									let url = `${SERVER_IP}item/${row._id}?orgId=${globalRedux.selectedOrganization._id}`;
									dispatch(deleteApi('DELETE_ITEM', url));
								}}>
								<CloseOutlined />
							</Popconfirm>
						</Col>
					</Row>
				);
			},
			fixed: 'right',
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

	useEffect(() => {
		if (!showEditItemModal) {
			setSelectedItem(null);
		}
	}, [showEditItemModal]);

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((item) => {
			return (
				(item?.taxRate || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(item?.itemName || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(item?.unitId?.unitName || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(item?.itemNumber || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(item?.itemCode || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(item?.hsnSac || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(item?.unitId?.unitName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(item?.purchasePrice || '')?.toString().toLowerCase().includes(searchKey.toLowerCase()) ||
				(item?.sellingPrice || '')?.toString().toLowerCase().includes(searchKey.toLowerCase())
			);
		});
	}, [tableData, searchKey]);

	const tableLoading = useMemo(() => globalRedux.apiStatus.GET_ITEMS === API_STATUS.PENDING, [globalRedux.apiStatus]);

	return (
		<>
			<Row>
				<Col span={24} style={{ padding: 0 }}>
					<TableComponent
						className="custom-table"
						style={{ width: '100%' }}
						scroll={{ x: 'auto' }}
						columns={column}
						loading={tableLoading}
						rowKey={(record) => record._id}
						dataSource={filteredData}
						title={() => (
							<Row style={{ justifyContent: 'space-between' }}>
								<Col span={6}>
									<Input
										placeholder="Search"
										suffix={<AiOutlineSearch />}
										style={{ height: '30px' }}
										onChange={({ target: { value } }) => setSearchKey(value)}
									/>
								</Col>
								<Col>
									<Button
										// icon={<PlusOutlined />}
										type="primary"
										style={{ width: '100%' }}
										onClick={() => {
											setShowAddItemModal(true);
										}}>
										Create Item
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
							<Row>
								<Col span={12}>
									{!!filteredData?.length && `Showing ${getStartingValue()} - ${getEndingValue()} of ${filteredData?.length} Data`}
								</Col>
								<Col span={12}>
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
						// onChange={handleTableChange}
					/>
				</Col>
			</Row>
			<AddItem {...{ selectedItem, showAddItemModal, showEditItemModal, setShowAddItemModal, setShowEditItemModal, setSelectedItem }} />
			{/* <AddUnit {...{ unitAddModal, setUnitAddModal, refreshList: getUnits, handleClose: () => setUnitAddModal(false) }} /> */}
		</>
	);
});

export default Items;
