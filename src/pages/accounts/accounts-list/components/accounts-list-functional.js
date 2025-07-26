import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Row, Col, message, Input, Button } from "antd";
import {
	EditOutlined,
	CopyOutlined,
	DownloadOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { getApi } from "redux/sagas/getApiDataSaga";
import { SERVER_IP } from "assets/Config";
import HighlightComponent from "components/HighlightComponent";
import { API_STATUS } from "constants/app-constants";
import AccountsListPresentational from "./accounts-list-presentational";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

// ✅ Attach autoTable manually
// jsPDF.API.autoTable = autoTable;

const mockAccounts = [
	{
		account_number: "A001",
		account_name: "Acme Corporation",
		account_owner_name: "John Doe",
		phone: "9876543210",
		email: "john@acme.com",
		account_type: "Customer",
		website: "https://acme.com",
	},
	{
		account_number: "A002",
		account_name: "Beta Technologies",
		account_owner_name: "Jane Smith",
		phone: "9123456780",
		email: "jane@beta.tech",
		account_type: "Partner",
		website: "https://beta.tech",
	},
	{
		account_number: "A003",
		account_name: "Gamma Retail",
		account_owner_name: "David Kumar",
		phone: "9988776655",
		email: "david@gamma.in",
		account_type: "Vendor",
		website: "https://gamma.in",
	},
];

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const AccountsListFunctional = React.memo(() => {
	const globalRedux = useSelector((state) => state.globalRedux);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [accountAddModal, setAccountAddModal] = useState(false);
	const [searchKey, setSearchKey] = useState("");
	const [columnFilters, setColumnFilters] = useState({});
	const [editAccount, setEditAccount] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const dispatch = useDispatch();

	const getAccounts = useCallback(() => {
		const url = `${SERVER_IP}account`;
		dispatch(getApi("GET_ACCOUNT_BOOKS", url));
	}, [dispatch]);

	useEffect(() => {
		getAccounts();
	}, [getAccounts]);

	const handleCopy = (text) => {
		navigator.clipboard.writeText(text);
		message.success("Copied to clipboard!");
	};

	const filteredData = useMemo(() => {
		return mockAccounts.filter((item) =>
			Object.keys(columnFilters).every((key) =>
				item[key]
					?.toLowerCase()
					.includes(columnFilters[key]?.toLowerCase() || "")
			)
		);
	}, [columnFilters]);

	const renderFilterDropdown = (dataIndex) => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
			<div style={{ padding: 8 }}>
				<Input
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) => {
						const value = e.target.value;
						setSelectedKeys(value ? [value] : []);
						setColumnFilters((prev) => ({ ...prev, [dataIndex]: value }));
					}}
					onPressEnter={() => confirm()}
					style={{ marginBottom: 8, display: "block" }}
				/>
				<Button
					onClick={() => {
						const updated = { ...columnFilters };
						delete updated[dataIndex];
						setColumnFilters(updated);
						confirm();
					}}
					size="small"
				>
					Reset
				</Button>
			</div>
		),
		filterIcon: () => <span style={{ color: "#1890ff" }}>🔍</span>,
	});

	const exportToExcel = () => {
		const worksheet = XLSX.utils.json_to_sheet(filteredData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Accounts");
		XLSX.writeFile(workbook, "accounts.xlsx");
	};

	const exportToPDF = () => {
		const doc = new jsPDF();
		const headers = [["Account #", "Name", "Owner", "Phone", "Email"]];
		const data = filteredData.map((item) => [
			item.account_number,
			item.account_name,
			item.account_owner_name,
			item.phone,
			item.email,
		]);
		doc.autoTable({
			head: headers,
			body: data,
			startY: 20,
			styles: { fontSize: 10 },
		});
		doc.save("accounts.pdf");
	};

	const column = [
		{
			title: "#",
			dataIndex: "account_number",
			key: "account_number",
			...renderFilterDropdown("account_number"),
			render: (value) => (
				<HighlightComponent textToHighlight={value} searchWords={[searchKey]} />
			),
		},
		{
			title: "Website",
			dataIndex: "website",
			key: "website",
			...renderFilterDropdown("website"),
			render: (value) =>
				value ? (
					<a href={value} target="_blank" rel="noopener noreferrer">
						{value}
					</a>
				) : (
					"-"
				),
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
			...renderFilterDropdown("email"),
			render: (value) => (
				<a href={`mailto:${value}`}>
					<HighlightComponent
						textToHighlight={value}
						searchWords={[searchKey]}
					/>
				</a>
			),
		},
		{
			title: "Phone",
			dataIndex: "phone",
			key: "phone",
			...renderFilterDropdown("phone"),
			render: (value) => (
				<Row align="middle" gutter={8} wrap={false}>
					<Col>
						<HighlightComponent
							textToHighlight={value}
							searchWords={[searchKey]}
						/>
					</Col>
					<Col>
						<CopyOutlined
							style={{ cursor: "pointer", color: "#1890ff" }}
							onClick={() => handleCopy(value)}
						/>
					</Col>
				</Row>
			),
		},
		{
			title: "Owner",
			dataIndex: "account_owner_name",
			key: "account_owner_name",
			...renderFilterDropdown("account_owner_name"),
			render: (value) => (
				<HighlightComponent textToHighlight={value} searchWords={[searchKey]} />
			),
		},
		{
			title: "Action",
			key: "action",
			align: "center",
			render: (_, row) => (
				<Row justify="center">
					<Col className="edit_icon" onClick={() => handleDrawer(row)}>
						<EditOutlined />
					</Col>
				</Row>
			),
		},
	];

	const handleDrawer = (rowData) => {
		setEditAccount(rowData);
		setAccountAddModal(true);
	};

	const handleClose = () => {
		setAccountAddModal(false);
		setEditAccount(null);
	};

	return (
		<>
			<Row justify="space-between" style={{ marginBottom: 16 }}>
				<Col>
					<Button onClick={exportToExcel} icon={<DownloadOutlined />}>
						Export Excel
					</Button>
				</Col>
				{/* <Col>
          <Button onClick={exportToPDF} icon={<DownloadOutlined />}>
            Export PDF
          </Button>
        </Col> */}
			</Row>

			<AccountsListPresentational
				{...{
					filteredData,
					column,
					tableLoading:
						globalRedux.apiStatus.GET_ACCOUNT_BOOKS === API_STATUS.PENDING,
					rowSelection: {
						selectedRowKeys,
						onChange: (keys) => setSelectedRowKeys(keys),
					},
					selectedRowKeys,
					handleAddAccount: () => {
						setEditAccount(null);
						setAccountAddModal(true);
					},
					currentPage,
					pageSize,
					intialPageSizeOptions,
					initialPageSize,
					handleTableChange: (current, size) => {
						setCurrentPage(current);
						setPageSize(size);
					},
					setSearchKey,
					getStartingValue: () => (currentPage - 1) * pageSize + 1,
					getEndingValue: () =>
						Math.min(currentPage * pageSize, filteredData.length),
					accountAddModal,
					setAccountAddModal,
					refreshList: getAccounts,
					editAccount,
					handleClose,
				}}
			/>
		</>
	);
});

export default AccountsListFunctional;
