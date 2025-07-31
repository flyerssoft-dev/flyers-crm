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
import UnitListPresentational from './unit-list-presentational';

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const UnitListFunctional = React.memo(() => {
	const units = useSelector((state) => state?.globalRedux?.units || []);
	const globalRedux = useSelector((state) => state.globalRedux);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [unitAddModal, setUnitAddModal] = useState(false);
	const [searchKey, setSearchKey] = useState('');
	const [tableData, setTableData] = useState(units);
	const [editUnit, setEditUnit] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const dispatch = useDispatch();

	const getUnits = useCallback(() => {
		// let url = `${SERVER_IP}unit`;
		let url = `${SERVER_IP}unit?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(getApi('GET_UNITS', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	useEffect(() => {
		getUnits();
	}, [getUnits]);

	useEffect(() => {
		generatePagination(tableData);
	}, [tableData]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_UNIT === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_UNIT'));
			setSelectedRowKeys([]);
			doIt = true;
		}
		if (doIt) {
			getUnits();
		}
	}, [globalRedux.apiStatus, dispatch, getUnits]);

	useEffect(() => {
		setTableData(units);
	}, [units]);

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((unit) => {
			return (
				(unit?.unitNumber || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(unit?.unitName || '')?.toLowerCase().includes(searchKey.toLowerCase())
			);
		});
	}, [tableData, searchKey]);

	const handleDrawer = (rowData) => {
		setEditUnit(rowData);
		setUnitAddModal(true);
	};

	const handleAddUnit = () => {
		setEditUnit(null);
		setUnitAddModal(true);
	};

	const column = [
		{
			title: '#',
			dataIndex: 'unitNumber',
			key: 'unitNumber',
			width: "10%",
			sorter: (a, b) => a?.unitNumber - b?.unitNumber,
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
			title: 'Unit Name',
			dataIndex: 'unitName',
			key: 'unitName',
			width: "70%",
			sorter: (a, b) => a?.unitName?.localeCompare(b?.unitName),
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
			dataIndex: 'unitName',
			width: "20%",
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
									let url = `${SERVER_IP}unit/${row._id}?orgId=${globalRedux?.selectedOrganization?.id}`;
									dispatch(deleteApi('DELETE_UNIT', url));
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

	const tableLoading = useMemo(() => globalRedux.apiStatus.GET_UNITS === API_STATUS.PENDING, [globalRedux.apiStatus]);

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
			setUnitAddModal(false)
			setEditUnit(null)
		},
	  [setUnitAddModal,setEditUnit],
	)
	

	return (
		<UnitListPresentational
			{...{
				filteredData,
				column,
				tableLoading,
				rowSelection,
				selectedRowKeys,
				handleAddUnit,
				currentPage,
				pageSize,
				intialPageSizeOptions,
				initialPageSize,
				handleTableChange,
				setSearchKey,
				getStartingValue,
				getEndingValue,
				unitAddModal,
				setUnitAddModal,
				refreshList: getUnits,
				editUnit,
				handleClose
			}}
		/>
	);
});

export default UnitListFunctional;
