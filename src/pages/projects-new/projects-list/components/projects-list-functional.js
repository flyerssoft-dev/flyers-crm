import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { SERVER_IP } from 'assets/Config';
import HighlightComponent from 'components/HighlightComponent';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { formQueryStringFromObject, generatePagination } from 'helpers';
import { ACTIONS, API_STATUS, DATE_FORMAT } from 'constants/app-constants';
import ProjectListPresentational from './projects-list-presentational';

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const ProjectListFunctional = React.memo(() => {
	const projects = useSelector((state) => state?.projectRedux?.projects);
	const globalRedux = useSelector((state) => state.globalRedux);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [projectAddModal, setProjectAddModal] = useState(false);
	const [searchKey, setSearchKey] = useState('');
	const [tableData, setTableData] = useState(projects);
	const [editProject, setEditProject] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	let { selectedProjectId } = useParams();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const getProjectDetails = useCallback(
		(selectedProjectId) => {
			const string = formQueryStringFromObject({
				orgId: globalRedux.selectedOrganization._id,
			});
			let url = `${SERVER_IP}project/${selectedProjectId}?${string}`;
			dispatch(getApi(ACTIONS.GET_PROJECTS_DETAILS, url));
		},
		[dispatch, globalRedux.selectedOrganization._id]
	);

	const getProjects = useCallback(() => {
		let url = `${SERVER_IP}project?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(getApi('GET_PROJECTS', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	const getUsers = useCallback(() => {
		let url = `${SERVER_IP}user?orgId=${globalRedux.selectedOrganization._id}`;
		dispatch(getApi('GET_USERS', url));
	}, [dispatch, globalRedux.selectedOrganization._id]);

	useEffect(() => {
		getProjects();
		getUsers();
	}, [getProjects, getUsers]);

	useEffect(() => {
		selectedProjectId && getProjectDetails(selectedProjectId);
	}, [getProjectDetails, selectedProjectId]);

	useEffect(() => {
		generatePagination(tableData);
	}, [tableData]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_PROJECT === 'SUCCESS') {
			dispatch(resetApiStatus('DELETE_PROJECT'));
			setSelectedRowKeys([]);
			doIt = true;
		}
		if (doIt) {
			getProjects();
		}
	}, [globalRedux.apiStatus, dispatch, getProjects]);

	useEffect(() => {
		setTableData(projects);
	}, [projects]);

	const filteredData = useMemo(() => {
		if (searchKey === '') return tableData;
		return tableData.filter((record) => {
			return (
				(record?.projectNumber || '')?.toString()?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.projectName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.customerId?.displayName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.categoryId?.categoryName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				// (record?.referredBy?.displayName || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				// (moment(record?.startDate).format(DATE_FORMAT.DD_MM_YYYY)?.toString() || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(moment(record?.dueDate).format(DATE_FORMAT.DD_MM_YYYY)?.toString() || '')?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(record?.remarks || '')?.toString().toLowerCase().includes(searchKey.toLowerCase())
			);
		});
	}, [tableData, searchKey]);

	const handleDrawer = (rowData) => {
		setEditProject(rowData);
		setProjectAddModal(true);
	};

	const handleAddProject = () => {
		setEditProject(null);
		setProjectAddModal(true);
	};

	const column = [
		{
			title: '#',
			dataIndex: 'projectNumber',
			key: 'projectNumber',
			sorter: (a, b) => a?.projectNumber - b?.projectNumber,
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
			title: 'Project Title',
			dataIndex: 'projectName',
			key: 'projectName',
			sorter: (a, b) => a?.projectName?.localeCompare(b?.projectName),
			fixed: 'left',
			render: (value) => (
				<div style={{ fontWeight: 'bold' }}>
					<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
				</div>
			),
		},
		{
			title: 'Customer',
			dataIndex: 'customerId',
			key: 'customerId',
			sorter: (a, b) => a?.customerId?.displayName?.localeCompare(b?.customerId?.displayName),
			fixed: 'left',
			render: (value) => (
				<div style={{ fontWeight: 'bold' }}>
					<HighlightComponent
						highlightClassName="highlightClass"
						searchWords={[searchKey]}
						autoEscape={true}
						textToHighlight={value?.displayName || ''}
					/>
				</div>
			),
		},
		// {
		// 	title: 'Referred By',
		// 	dataIndex: 'referredBy',
		// 	key: 'referredBy',
		// 	sorter: (a, b) => a?.referredBy?.displayName?.localeCompare(b?.referredBy?.displayName),
		// 	fixed: 'left',
		// 	render: (value) => (
		// 		<div style={{ fontWeight: 'bold' }}>
		// 			<HighlightComponent
		// 				highlightClassName="highlightClass"
		// 				searchWords={[searchKey]}
		// 				autoEscape={true}
		// 				textToHighlight={value?.displayName || ''}
		// 			/>
		// 		</div>
		// 	),
		// },
		{
			title: 'Assigned To',
			dataIndex: 'assignedTo',
			key: 'assignedTo',
			sorter: (a, b) => a?.assignedTo?.firstName?.localeCompare(b?.assignedTo?.firstName),
			fixed: 'left',
			render: (value) => (
				<div style={{ fontWeight: 'bold' }}>
					<HighlightComponent
						highlightClassName="highlightClass"
						searchWords={[searchKey]}
						autoEscape={true}
						textToHighlight={`${value?.firstName || '-'} ${value?.lastName || '-'}` || ''}
					/>
				</div>
			),
		},
		{
			title: 'Category',
			dataIndex: 'categoryId',
			key: 'categoryId',
			sorter: (a, b) => a?.categoryId?.categoryName?.localeCompare(b?.categoryId?.categoryName),
			fixed: 'left',
			render: (value) => (
				<div style={{ fontWeight: 'bold' }}>
					<HighlightComponent
						highlightClassName="highlightClass"
						searchWords={[searchKey]}
						autoEscape={true}
						textToHighlight={value?.categoryName || ''}
					/>
				</div>
			),
		},
		// {
		// 	title: 'Start Date',
		// 	dataIndex: 'startDate',
		// 	key: 'startDate',
		// 	sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
		// 	fixed: 'left',
		// 	render: (value) =>
		// 		value ? (
		// 			<HighlightComponent
		// 				highlightClassName="highlightClass"
		// 				searchWords={[searchKey]}
		// 				autoEscape={true}
		// 				textToHighlight={moment(value).format(DATE_FORMAT.DD_MM_YYYY)}
		// 			/>
		// 		) : (
		// 			'-'
		// 		),
		// },
		{
			title: 'Due Date',
			dataIndex: 'dueDate',
			key: 'dueDate',
			sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
			fixed: 'left',
			render: (value) =>
				value ? (
					<HighlightComponent
						highlightClassName="highlightClass"
						searchWords={[searchKey]}
						autoEscape={true}
						textToHighlight={moment(value).format(DATE_FORMAT.DD_MM_YYYY)}
					/>
				) : (
					'-'
				),
		},
		{
			title: 'Description',
			dataIndex: 'description',
			align: 'left',
			sorter: (a, b) => a?.description?.localeCompare(b?.description),
			render: (value) => (
				<div style={{ fontWeight: 'bold' }}>
					<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
				</div>
			),
		},
		{
			title: 'Status',
			dataIndex: 'status',
			align: 'center',
			sorter: (a, b) => a?.status?.localeCompare(b?.status),
			render: (value) => (
				<div style={{ fontWeight: 'bold' }}>
					<HighlightComponent highlightClassName="highlightClass" searchWords={[searchKey]} autoEscape={true} textToHighlight={value} />
				</div>
			),
		},
		{
			title: 'Action',
			align: 'center',
			dataIndex: 'displayName',
			render: (value, row, index) => {
				return (
					<Row justify="center" onClick={(e) => e.stopPropagation()}>
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

	const tableLoading = useMemo(() => globalRedux.apiStatus.GET_PROJECTS === API_STATUS.PENDING, [globalRedux.apiStatus]);

	const onSelectChange = (selectedRowKeys) => {
		setSelectedRowKeys(selectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
		// fixed: true,
	};

	const handleClose = useCallback(() => {
		setProjectAddModal(false);
		setEditProject(null);
	}, [setProjectAddModal, setEditProject]);

	return (
		<ProjectListPresentational
			{...{
				filteredData,
				column,
				tableLoading,
				rowSelection,
				selectedRowKeys,
				handleAddProject,
				currentPage,
				pageSize,
				intialPageSizeOptions,
				initialPageSize,
				handleTableChange,
				setSearchKey,
				getStartingValue,
				getEndingValue,
				projectAddModal,
				setProjectAddModal,
				refreshList: getProjects,
				editProject,
				handleClose,
				selectedProjectId,
				navigate,
			}}
		/>
	);
});

export default ProjectListFunctional;
