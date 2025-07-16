import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Row, Col } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { SERVER_IP } from 'assets/Config';
import HighlightComponent from 'components/HighlightComponent';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { generatePagination } from 'helpers';
import { API_STATUS, CUSTOMER_TYPE } from 'constants/app-constants';
import SupplierListPresentational from './suppliers-list-presentational';

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const SupplierListFunctional = React.memo(() => {
	const supplierRedux = useSelector((state) => state.supplierRedux);
	const globalRedux = useSelector((state) => state.globalRedux);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [supplierAddModal, setSupplierAddModal] = useState(false);
	const [searchKey, setSearchKey] = useState('');
	const [tableData, setTableData] = useState(supplierRedux.suppliers);
	const [editSupplier, setEditSupplier] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);

	const dispatch = useDispatch();

	const getSuppliers = useCallback(() => {
		let url = `${SERVER_IP}customer?orgId=${globalRedux?.selectedOrganization?._id}&type=${CUSTOMER_TYPE[1]}`;
		dispatch(getApi('GET_SUPPLIERS', url));
	}, [dispatch, globalRedux?.selectedOrganization?._id]);

	useEffect(() => {
		getSuppliers();
	}, [getSuppliers]);

	useEffect(() => {
		generatePagination(tableData);
	}, [tableData]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_SUPPLIER === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_SUPPLIER'));
			setSelectedRowKeys([]);
			doIt = true;
		}
		if (doIt) {
			getSuppliers();
		}
	}, [globalRedux.apiStatus, dispatch, getSuppliers]);

	useEffect(() => {
		setTableData(supplierRedux.suppliers);
	}, [supplierRedux.suppliers]);

	const filteredData = useMemo(() => {
		if (searchKey === '') return tableData;
		return tableData.filter((supplier) => {
			return (
				(supplier?.customerNumber || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(supplier?.displayName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(supplier?.mobile || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(supplier?.email || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(supplier?.gstTreatment || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(supplier?.address || '')?.toString().toLowerCase().includes(searchKey.toLowerCase()) ||
				(supplier?.gstin || '')?.toString().toLowerCase().includes(searchKey.toLowerCase()) ||
				(supplier?.gstTreatment || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(supplier?.panCard || '')?.toLowerCase().includes(searchKey.toLowerCase) ||
				// (supplier?.remarks || '')?.toLowerCase().includes(searchKey.toLowerCase())
				(supplier?.outstandingBalance || '')?.toString().toLowerCase().includes(searchKey.toLowerCase())
			);
		});
	}, [tableData, searchKey]);

	const handleDrawer = (rowData) => {
		setEditSupplier(rowData);
		setSupplierAddModal(true);
	};

	const handleAddSupplier = () => {
		setEditSupplier(null);
		setSupplierAddModal(true);
	};

	const column = [
		{
			title: '#',
			dataIndex: 'customerNumber',
			key: 'customerNumber',
			sorter: (a, b) => a?.customerNumber - b?.customerNumber,
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
			title: 'Supplier Name',
			dataIndex: 'displayName',
			key: 'displayName',
			sorter: (a, b) => a?.displayName?.localeCompare(b?.displayName),
			fixed: 'left',
			render: (value) => (
				<div style={{ fontWeight: 'bold' }}>
					<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
				</div>
			),
		},
		{
			title: 'Mobile',
			dataIndex: 'mobile',
			sorter: (a, b) => a?.mobile - b?.mobile,
			align: 'left',
			render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			sorter: (a, b) => a?.email?.localeCompare(b?.email),
			align: 'left',
			width: '15%',
			render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />,
		},
		{
			title: 'GST Treatment',
			dataIndex: 'gstTreatment',
			sorter: (a, b) => a?.gstTreatment?.localeCompare(b?.gstTreatment),
			align: 'left',
			render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />,
		},
		{
			title: 'GSTIN',
			dataIndex: 'gstin',
			sorter: (a, b) => a?.gstTreatment?.localeCompare(b?.gstTreatment),
			align: 'left',
			render: (value) => <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />,
		},
		{
			title: 'Balance',
			dataIndex: 'outstandingBalance',
			align: 'right',
			sorter: (a, b) => a?.outstandingBalance - b?.outstandingBalance,
			render: (value) => {
				if (!!value) {
					return <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={value.toFixed(2)} />;
				} else {
					return <HighlightComponent searchWords={[searchKey]} autoEscape={true} textToHighlight={(0).toFixed(2)} />;
				}
			},
		},
		{
			title: 'Action',
			align: 'center',
			dataIndex: 'displayName',
			render: (value, row, index) => {
				return (
					<Row justify="center">
						<Col className="edit_icon" onClick={() => handleDrawer(row)}>
							<EditOutlined />
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

	const tableLoading = useMemo(() => globalRedux.apiStatus.GET_SUPPLIERS === API_STATUS.PENDING, [globalRedux.apiStatus]);

	const onSelectChange = (selectedRowKeys) => {
		setSelectedRowKeys(selectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
		// fixed: true,
	};

	const handleClose = useCallback(
		() => {
			setSupplierAddModal(false)
			setEditSupplier(null)
		},
	  [setSupplierAddModal,setEditSupplier],
	)
	

	return (
		<SupplierListPresentational
			{...{
				filteredData,
				column,
				tableLoading,
				rowSelection,
				selectedRowKeys,
				handleAddSupplier,
				currentPage,
				pageSize,
				intialPageSizeOptions,
				initialPageSize,
				handleTableChange,
				setSearchKey,
				getStartingValue,
				getEndingValue,
				supplierAddModal,
				setSupplierAddModal,
				refreshList: getSuppliers,
				editSupplier,
				handleClose
			}}
		/>
	);
});

export default SupplierListFunctional;
