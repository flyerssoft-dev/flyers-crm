import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Row, Col, Popconfirm } from 'antd';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { SERVER_IP } from 'assets/Config';
import HighlightComponent from 'components/HighlightComponent';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { deleteApi } from 'redux/sagas/deleteApiSaga';
import { generatePagination } from 'helpers';
import { API_STATUS } from 'constants/app-constants';
import SizeListPresentational from './size-list-presentational';

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const SizeListFunctional = React.memo(() => {
	const sizes = useSelector((state) => state?.globalRedux?.sizes || []);
	const globalRedux = useSelector((state) => state.globalRedux);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [sizeAddModal, setSizeAddModal] = useState(false);
	const [searchKey, setSearchKey] = useState('');
	const [tableData, setTableData] = useState(sizes);
	const [editSize, setEditSize] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const dispatch = useDispatch();

	const getSizes = useCallback(() => {
		let url = `${SERVER_IP}size?orgId=${globalRedux?.selectedOrganization?._id}`;
		dispatch(getApi('GET_SIZES', url));
	}, [dispatch, globalRedux?.selectedOrganization?._id]);

	useEffect(() => {
		getSizes();
	}, [getSizes]);

	useEffect(() => {
		generatePagination(tableData);
	}, [tableData]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_SIZE === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_SIZE'));
			setSelectedRowKeys([]);
			doIt = true;
		}
		if (doIt) {
			getSizes();
		}
	}, [globalRedux.apiStatus, dispatch, getSizes]);

	useEffect(() => {
		setTableData(sizes);
	}, [sizes]);

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((size) => {
			return (
				(size?.sizeNumber || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(size?.sizeName || '')?.toLowerCase().includes(searchKey.toLowerCase())
			);
		});
	}, [tableData, searchKey]);

	const handleDrawer = (rowData) => {
		setEditSize(rowData);
		setSizeAddModal(true);
	};

	const handleAddSize = () => {
		setEditSize(null);
		setSizeAddModal(true);
	};

	const column = [
		{
			title: '#',
			dataIndex: 'sizeNumber',
			key: 'sizeNumber',
			width: '10%',
			sorter: (a, b) => a?.sizeNumber - b?.sizeNumber,
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
			title: 'Size Name',
			dataIndex: 'sizeName',
			key: 'sizeName',
			width: '70%',
			sorter: (a, b) => a?.sizeName?.localeCompare(b?.sizeName),
			fixed: 'left',
			render: (value) => (
				<div style={{ fontWeight: 'bold' }}>
					<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
				</div>
			),
		},
		{
			title: 'Action',
			align: 'center',
			dataIndex: 'sizeName',
			width: '20%',
			render: (value, row, index) => {
				return (
					<Row justify="center">
						<Col className="edit_icon" onClick={() => handleDrawer(row)}>
							<EditOutlined />
						</Col>
						<Col className="delete_icon">
							<Popconfirm
								title={`Are you sure to Delete ${value}?`}
								okText="Delete"
								cancelText="No"
								onConfirm={() => {
									let url = `${SERVER_IP}size/${row._id}?orgId=${globalRedux?.selectedOrganization?._id}`;
									dispatch(deleteApi('DELETE_SIZE', url));
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

	const tableLoading = useMemo(() => globalRedux.apiStatus.GET_SIZES === API_STATUS.PENDING, [globalRedux.apiStatus]);

	const onSelectChange = (selectedRowKeys) => {
		setSelectedRowKeys(selectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
		// fixed: true,
	};

	const handleClose = useCallback(() => {
		setSizeAddModal(false);
		setEditSize(null);
	}, [setSizeAddModal, setEditSize]);

	return (
		<SizeListPresentational
			{...{
				filteredData,
				column,
				tableLoading,
				rowSelection,
				selectedRowKeys,
				handleAddSize,
				currentPage,
				pageSize,
				intialPageSizeOptions,
				initialPageSize,
				handleTableChange,
				setSearchKey,
				getStartingValue,
				getEndingValue,
				sizeAddModal,
				setSizeAddModal,
				refreshList: getSizes,
				editSize,
				handleClose,
			}}
		/>
	);
});

export default SizeListFunctional;
