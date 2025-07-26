import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Row, Col } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { getApi } from "redux/sagas/getApiDataSaga";
import { SERVER_IP } from "assets/Config";
import HighlightComponent from "components/HighlightComponent";
import { resetApiStatus } from "redux/reducers/globals/globalActions";
import { generatePagination } from "helpers";
import { API_STATUS, CUSTOMER_TYPE } from "constants/app-constants";
import AccountsListPresentational from "./accounts-list-presentational";

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const AccountsListFunctional = React.memo(() => {
	const leadsRedux = useSelector((state) => state.leadsRedux);
	const globalRedux = useSelector((state) => state.globalRedux);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [accountAddModal, setAccountAddModal] = useState(false);
	const [searchKey, setSearchKey] = useState("");
	const [tableData, setTableData] = useState(leadsRedux.leads);
	const [editAccount, setEditAccount] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);

	const dispatch = useDispatch();

	const getAccounts = useCallback(() => {
		let url = `${SERVER_IP}account`;
		dispatch(getApi("GET_ACCOUNT_BOOKS", url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	useEffect(() => {
		getAccounts();
	}, [getAccounts]);

	useEffect(() => {
		generatePagination(tableData);
	}, [tableData]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.DELETE_LEAD === "SUCCESS") {
			dispatch(resetApiStatus("DELETE_LEAD"));
			setSelectedRowKeys([]);
			doIt = true;
		}
		if (doIt) {
			getAccounts();
		}
	}, [globalRedux.apiStatus, dispatch, getAccounts]);

	useEffect(() => {
		setTableData(leadsRedux.leads);
	}, [leadsRedux.leads]);

	const filteredData = useMemo(() => {
		if (searchKey === "") return tableData;
		return tableData.filter((lead) => {
			return (
				(lead?.customerNumber || "")
					?.toString()
					?.toLowerCase()
					.includes(searchKey.toLowerCase()) ||
				(lead?.displayName || "")
					?.toLowerCase()
					.includes(searchKey.toLowerCase()) ||
				(lead?.mobile || "")?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(lead?.email || "")?.toLowerCase().includes(searchKey.toLowerCase()) ||
				(lead?.gstTreatment || "")
					?.toLowerCase()
					.includes(searchKey.toLowerCase()) ||
				(lead?.address || "")
					?.toString()
					.toLowerCase()
					.includes(searchKey.toLowerCase()) ||
				(lead?.gstin || "")
					?.toString()
					.toLowerCase()
					.includes(searchKey.toLowerCase()) ||
				(lead?.gstTreatment || "")
					?.toLowerCase()
					.includes(searchKey.toLowerCase()) ||
				(lead?.panCard || "")?.toLowerCase().includes(searchKey.toLowerCase) ||
				// (lead?.remarks || '')?.toLowerCase().includes(searchKey.toLowerCase())
				(lead?.outstandingBalance || "")
					?.toString()
					.toLowerCase()
					.includes(searchKey.toLowerCase())
			);
		});
	}, [tableData, searchKey]);

	const handleDrawer = (rowData) => {
		setEditAccount(rowData);
		setAccountAddModal(true);
	};

	const handleAddAccount = () => {
		console.log("fff");
		setEditAccount(null);
		setAccountAddModal(true);
	};

	const column = [
		{
			title: "#",
			dataIndex: "account_number",
			key: "account_number",
			fixed: "left",
			render: (value) => (
				<HighlightComponent
					highlightClassName="highlightClass"
					searchWords={[searchKey]}
					autoEscape
					textToHighlight={value?.toString() || ""}
				/>
			),
		},
		{
			title: "Account Name",
			dataIndex: "account_name",
			key: "account_name",
			fixed: "left",
			sorter: (a, b) => a?.account_name?.localeCompare(b?.account_name),
			render: (value) => (
				<HighlightComponent
					highlightClassName="highlightClass"
					searchWords={[searchKey]}
					autoEscape
					textToHighlight={value || ""}
				/>
			),
		},
		{
			title: "Account Owner",
			dataIndex: "account_owner_name",
			key: "account_owner_name",
			render: (value) => (
				<HighlightComponent
					searchWords={[searchKey]}
					autoEscape
					textToHighlight={value || ""}
				/>
			),
		},
		{
			title: "Phone",
			dataIndex: "phone",
			key: "phone",
			render: (value) => (
				<HighlightComponent
					searchWords={[searchKey]}
					autoEscape
					textToHighlight={value || ""}
				/>
			),
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
			render: (value) => (
				<HighlightComponent
					searchWords={[searchKey]}
					autoEscape
					textToHighlight={value || ""}
				/>
			),
		},
		{
			title: "Account Type",
			dataIndex: "account_type",
			key: "account_type",
			render: (value) => (
				<HighlightComponent
					searchWords={[searchKey]}
					autoEscape
					textToHighlight={value || ""}
				/>
			),
		},
		{
			title: "Rating",
			dataIndex: "rating",
			key: "rating",
			render: (value) => (
				<HighlightComponent
					searchWords={[searchKey]}
					autoEscape
					textToHighlight={value || ""}
				/>
			),
		},
		{
			title: "Ownership",
			dataIndex: "ownership",
			key: "ownership",
			render: (value) => (
				<HighlightComponent
					searchWords={[searchKey]}
					autoEscape
					textToHighlight={value || ""}
				/>
			),
		},
		{
			title: "Industry",
			dataIndex: "industry",
			key: "industry",
			render: (value) => (
				<HighlightComponent
					searchWords={[searchKey]}
					autoEscape
					textToHighlight={value || ""}
				/>
			),
		},
		{
			title: "Annual Revenue",
			dataIndex: "annual_revenue",
			key: "annual_revenue",
			align: "right",
			render: (value) => (
				<HighlightComponent
					searchWords={[searchKey]}
					autoEscape
					textToHighlight={value ? value.toLocaleString() : "0"}
				/>
			),
		},
		{
			title: "Action",
			align: "center",
			key: "action",
			render: (_, row) => (
				<Row justify="center">
					<Col className="edit_icon" onClick={() => handleDrawer(row)}>
						<EditOutlined />
					</Col>
				</Row>
			),
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
		if (currentPage === 1)
			return tableData.length < pageSize ? tableData.length : pageSize;
		else {
			let end = currentPage * pageSize;
			return end > tableData.length ? tableData.length : end;
		}
	};

	const tableLoading = useMemo(
		() => globalRedux.apiStatus.GET_ACCOUNT_BOOKS === API_STATUS.PENDING,
		[globalRedux.apiStatus]
	);

	const onSelectChange = (selectedRowKeys) => {
		setSelectedRowKeys(selectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
		// fixed: true,
	};

	const handleClose = useCallback(() => {
		setAccountAddModal(false);
		setEditAccount(null);
	}, [setAccountAddModal, setEditAccount]);

	return (
		<AccountsListPresentational
			{...{
				filteredData,
				column,
				tableLoading,
				rowSelection,
				selectedRowKeys,
				handleAddAccount,
				currentPage,
				pageSize,
				intialPageSizeOptions,
				initialPageSize,
				handleTableChange,
				setSearchKey,
				getStartingValue,
				getEndingValue,
				accountAddModal,
				setAccountAddModal,
				refreshList: getAccounts,
				editAccount,
				handleClose,
			}}
		/>
	);
});

export default AccountsListFunctional;
