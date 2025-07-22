import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { SERVER_IP } from 'assets/Config';
import HighlightComponent from 'components/HighlightComponent';
import { sendGetRequest } from 'redux/sagas/utils';
import { objToQs } from 'helpers';
import CustomerStatementListPresentational from './customer-statement-list-presentational';
import { DATE_FORMAT } from 'constants/app-constants';
import PdfViewerModal from 'components/pdf-viewer-modal';

const DEFAULT_PAGE_SIZE = 10;

const CustomerStatementListFunctional = React.memo(() => {
	const dispatch = useDispatch();

	const [searchKey, setSearchKey] = useState('');
	const [filterOptions, setFilterOptions] = useState({ customerId: '', department: '', fromDate: moment().subtract(1, 'months'), toDate: moment() });
	const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
	const [currentPage, setCurrentPage] = useState(1);
	const [tableData, setTableData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [previewModalVisible, setPreviewModalVisible] = useState(false);

	const globalState = useSelector((state) => state.globalRedux);
	const customers = useSelector((state) => state?.customerRedux?.customers);

	const getCustomers = useCallback(() => {
		const url = `${SERVER_IP}customer?orgId=${globalState?.selectedOrganization?.id}`;
		dispatch(getApi('GET_CUSTOMERS', url));
	}, [dispatch, globalState?.selectedOrganization?.id]);

	const fetchCustomerStatements = useCallback(async () => {
		if (filterOptions?.customerId) {
			const string = objToQs({
				orgId: globalState.selectedOrganization?.id,
				startDate: filterOptions?.fromDate,
				endDate: filterOptions?.toDate,
			});
			setLoading(true);
			const { data } = await sendGetRequest(null, `${SERVER_IP}statement/customer/${filterOptions?.customerId}?${string}`);
			setTableData(data?.statement || []);
			setLoading(false);
		}
	}, [globalState.selectedOrganization?.id, filterOptions]);

	useEffect(() => {
		getCustomers();
	}, [getCustomers]);

	useEffect(() => {
		if (filterOptions?.customerId) fetchCustomerStatements();
	}, [fetchCustomerStatements, filterOptions?.customerId]);

	const filteredData = useMemo(() => {
		if (!searchKey) return tableData?.transactions || [];
		const key = searchKey.toLowerCase();
		return (tableData?.transactions || []).filter((record) => record?.number?.toString().toLowerCase().includes(key) || record?.description?.toLowerCase().includes(key) || record?.type?.toLowerCase().includes(key));
	}, [searchKey, tableData?.transactions]);

	const columns = useMemo(
		() => [
			{
				title: '#',
				dataIndex: 'number',
				width: '8%',
				sorter: (a, b) => a?.number - b?.number,
				render: (val) => <HighlightComponent searchWords={[searchKey]} textToHighlight={val?.toString()} />,
			},
			{
				title: 'Inv. Date',
				dataIndex: 'formattedDate',
				width: '10%',
				sorter: (a, b) => new Date(a.formattedDate) - new Date(b.formattedDate),
				render: (val) => <HighlightComponent searchWords={[searchKey]} textToHighlight={val} />,
			},
			{
				title: 'Description',
				dataIndex: 'description',
				width: '15%',
				sorter: (a, b) => a?.description?.localeCompare(b?.description),
				render: (val) => <HighlightComponent searchWords={[searchKey]} textToHighlight={val || ''} />,
			},
			{
				title: 'Type',
				dataIndex: 'type',
				width: '12%',
				sorter: (a, b) => a?.type?.localeCompare(b?.type),
				render: (val) => <HighlightComponent searchWords={[searchKey]} textToHighlight={val?.toString()} />,
			},
			{
				title: 'Debit',
				dataIndex: 'debit',
				width: '10%',
				align: 'right',
				sorter: (a, b) => a?.debit - b?.debit,
				render: (val) => parseFloat(val || 0).toFixed(2),
			},
			{
				title: 'Credit',
				dataIndex: 'credit',
				width: '10%',
				align: 'right',
				sorter: (a, b) => a?.credit - b?.credit,
				render: (val) => parseFloat(val || 0).toFixed(2),
			},
			{
				title: 'Balance',
				dataIndex: 'balance',
				width: '10%',
				align: 'right',
				sorter: (a, b) => a?.balance - b?.balance,
				render: (val) => parseFloat(val || 0).toFixed(2),
			},
		],
		[searchKey]
	);

	const handlePageChange = (page, size) => {
		setCurrentPage(page || 1);
		setPageSize(size);
	};

	const pdfPreviewURL = `${SERVER_IP}statement/preview/${filterOptions?.customerId}?orgId=${globalState?.selectedOrganization?.id}&startDate=${moment(filterOptions?.fromDate).format(DATE_FORMAT.YYYY_MM_DD)}&endDate=${moment(
		filterOptions?.toDate
	).format(DATE_FORMAT.YYYY_MM_DD)}`;

	return (
		<>
			<CustomerStatementListPresentational
				filteredData={filteredData}
				tableLoading={loading}
				customers={customers}
				handleFilterOptions={(key, value) => setFilterOptions((prev) => ({ ...prev, [key]: value }))}
				columns={columns}
				searchKey={searchKey}
				setSearchKey={setSearchKey}
				pageSize={pageSize}
				currentPage={currentPage}
				handlePageChange={handlePageChange}
				fetchCustomerStatements={fetchCustomerStatements}
				filterOptions={filterOptions}
				tableData={tableData}
				setPreviewModalVisible={setPreviewModalVisible}
			/>
			<PdfViewerModal open={previewModalVisible} onClose={() => setPreviewModalVisible(false)} previewUrlFromProps={pdfPreviewURL} download={false} />
		</>
	);
});

export default CustomerStatementListFunctional;
