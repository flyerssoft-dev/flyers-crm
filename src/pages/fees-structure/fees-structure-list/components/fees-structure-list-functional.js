import React, { useEffect, useMemo, useState } from 'react';
import { InputNumber } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { SERVER_IP } from 'assets/Config';
import HighlightComponent from 'components/HighlightComponent';
import { sendGetRequest } from 'redux/sagas/utils';
import FeesStructurePresentational from './fees-structure-list-presenatational';
import { postApi } from 'redux/sagas/postApiDataSaga';

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const FeesStructureFunctional = React.memo(() => {
	const [selectedClass, setSelectedClass] = useState(null);
	const users = useSelector((state) => state?.userRedux?.users);
	const globalRedux = useSelector((state) => state.globalRedux);
	const classes = globalRedux?.classes || [];
	const categories = globalRedux?.categories || [];
	const [visible, toggleVisible] = useState(false);
	const [searchKey, setSearchKey] = useState('');
	const [tableData, setTableData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const dispatch = useDispatch();

	const DEFAULT_COLUMNS = [
		{
			title: 'Student Name',
			dataIndex: 'studentName',
			key: 'studentName',
			fixed: 'left',
			width: 150,
			render: (value) => (
				<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
			),
		},
	];

	const generateNewColumnsWithCategories = useMemo(() => {
		return categories?.map((category) => {
			return {
				title: category?.categoryName,
				dataIndex: 'categoryList',
				key: 'categoryList',
				width: 150,
				render: (value, row) => {
					const feesAmount = value.find((data) => data._id === category._id)?.feesAmount || '';
					return (
						<InputNumber
							value={feesAmount}
							onBlur={() => handleEdit(row?.studentId, category?._id, feesAmount)}
							onChange={(value) => handleEditTableData(category?._id, value, row, tableData)}
						/>
					);
				},
			};
		});
	});

	const handleGetStudents = (classId) => {
		setSelectedClass(classId);
	};

	useEffect(async () => {
		if (selectedClass) {
			await setLoading(true);
			const {
				data: { data },
			} = await sendGetRequest(null, `${SERVER_IP}student/fees?orgId=${globalRedux?.selectedOrganization?._id}&classId=${selectedClass}`);
			setTableData(data);
			await setLoading(false);
		}
	}, [selectedClass]);

	const filteredData = useMemo(() => {
		if (searchKey === '') {
			return tableData;
		}
		return tableData.filter((record) => {
			return (
				(record?.ticketType || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.priority || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.customerName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.mobile || '')?.toLowerCase().includes(searchKey.toLowerCase())
			);
		});
	}, [tableData, searchKey]);

	const handleEdit = (studentId, categoryId, feesAmount) => {
		let data = {
			orgId: globalRedux?.selectedOrganization?._id,
			batchId: globalRedux?.activeBatch,
			categoryId,
			feesAmount,
			studentId,
		};
		dispatch(postApi(data, 'ADD_BATCH_BALANCE'));
	};

	const handleEditTableData = (categoryId, value, row, tableData = []) => {
		let newTableData = tableData.map((record) => {
			if (record.studentId === row.studentId) {
				return {
					...record,
					categoryList: record?.categoryList?.map((category) => {
						if (category._id === categoryId) {
							return {
								...category,
								feesAmount: value,
							};
						}
						return category;
					}),
				};
			}
			return record;
		});
		setTableData(newTableData);
	};

	const column = [...DEFAULT_COLUMNS, ...generateNewColumnsWithCategories];

	const handleTableChange = (currentPage, pageSize) => {
		setCurrentPage(currentPage === 0 ? 1 : currentPage);
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

	// const tableLoading = useMemo(() => globalRedux.apiStatus.GET_TICKETS === API_STATUS.PENDING, [globalRedux.apiStatus]);

	const onSelectChange = (selectedRowKeys) => {
		setSelectedRowKeys(selectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	return (
		<FeesStructurePresentational
			{...{
				column,
				filteredData,
				visible,
				toggleVisible,
				handleTableChange,
				getStartingValue,
				getEndingValue,
				pageSize,
				intialPageSizeOptions,
				initialPageSize,
				currentPage,
				setSearchKey,
				tableLoading: loading,
				rowSelection,
				users,
				classes,
				handleGetStudents,
				loading,
			}}
		/>
	);
});

export default FeesStructureFunctional;
