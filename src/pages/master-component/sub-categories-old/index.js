import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Popconfirm, Button, Pagination, Row, Col, Select } from 'antd';
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

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const SubCategories = React.memo(() => {
	const [selectedCategory, setSelectedCategory] = useState(null);
	const categories = useSelector((state) => state?.globalRedux.categories || []);
	const globalRedux = useSelector((state) => state.globalRedux);
	const dispatch = useDispatch();

	const [subCategoryAddModal, setSubCategoryAddModal] = useState(false);
	const [searchKey] = useState('');
	const [tableData, setTableData] = useState(globalRedux.subCategories || []);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [editSubCategory, setEditSubCategories] = useState(null);

	const getSubCategories = useCallback(() => {
		let url = `${SERVER_IP}subcategory/?orgId=${globalRedux?.selectedOrganization?.id}&categoryId=${selectedCategory}`;
		dispatch(getApi('GET_SUB_CATEGORIES', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id, selectedCategory]);

	useEffect(() => {
		selectedCategory && getSubCategories(selectedCategory);
	}, [getSubCategories, selectedCategory]);

	useEffect(() => {
		generatePagination(tableData);
	}, [tableData]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_SUB_CATEGORY === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_SUB_CATEGORY'));
			doIt = true;
		}
		if (doIt) {
			getSubCategories();
		}
	}, [globalRedux.apiStatus, getSubCategories, dispatch]);

	useEffect(() => {
		setTableData(globalRedux?.subCategories);
	}, [globalRedux.subCategories]);

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((accBook) => {
			return (
				(accBook?.subCategoryName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(accBook?.remarks || '')?.toLowerCase().includes(searchKey.toLowerCase())
			);
		});
	}, [tableData, searchKey]);

	const handleDrawer = (rowData) => {
		setEditSubCategories(rowData);
		setSubCategoryAddModal(true);
	};

	const handleSubCategories = () => {
		setSubCategoryAddModal(true);
		setEditSubCategories(null);
	};

	const column = [
		{
			title: 'SUB CATEGORY NAME',
			dataIndex: 'subCategoryName',
			key: 'subCategoryName',
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
			dataIndex: 'subCategoryName',
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
									let url = `${SERVER_IP}category/${row._id}?orgId=${globalRedux?.selectedOrganization?.id}`;
									dispatch(deleteApi('DELETE_SUB_CATEGORY', url));
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

	const loading = useMemo(() => globalRedux.apiStatus.GET_SUB_CATEGORIES === API_STATUS.PENDING, [globalRedux.apiStatus]);

	return (
		<>
			<Row style={{ padding: '20px 10px' }}>
				<Col xl={12}>
					<TableComponent
						loading={loading}
						className="custom-table"
						style={{ width: '100%' }}
						columns={column}
						bordered
						rowKey={(record) => record._id}
						dataSource={selectedCategory ? filteredData : []}
						title={() => (
							<Row justify="space-between">
								<Col md={3}>
									<Select
										placeholder="Select Category"
										showSearch
										optionFilterProp="children"
										value={selectedCategory}
										onChange={(value) => {
											setSelectedCategory(value);
										}}
										style={{ width: 150 }}
										filterOption={(input, option) => option.children?.toLowerCase().indexOf(input?.toLowerCase()) >= 0}>
										{categories?.map((category) => (
											<Select.Option key={category?._id} value={category?._id}>
												{category?.categoryName}
											</Select.Option>
										))}
									</Select>
								</Col>

								<Col md={7}></Col>
								{selectedCategory && (
									<Col>
										<Button type="primary" style={{ width: '100%' }} onClick={() => handleSubCategories()}>
											Add Sub Category
										</Button>
									</Col>
								)}
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
									<div>
										{!!filteredData?.length &&
											`Showing ${getStartingValue()} - ${getEndingValue()} of ${filteredData?.length} Data`}
									</div>
								</Col>
								<Col span={16}>
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
			<AddDrawer
				{...{
					subCategoryAddModal,
					setSubCategoryAddModal,
					refreshList: getSubCategories,
					getSubCategories,
					editSubCategory,
					selectedCategory,
				}}
			/>
		</>
	);
});

export default SubCategories;
