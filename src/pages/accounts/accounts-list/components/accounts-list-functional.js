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

  const accountColumns = [
    {
      title: "Account Owner Name",
      dataIndex: "account_owner_name",
      ...renderFilterDropdown("account_owner_name"),
      render: (value) => (
        <HighlightComponent textToHighlight={value} searchWords={[searchKey]} />
      ),
      key: "account_owner_name",
      visible: true,
      default: true,
      order: 0,
    },

    {
      title: "Account Name",
      dataIndex: "account_name",
      key: "account_name",
      default: true,
      visible: true,
      ...renderFilterDropdown("account_name"),
      render: (value) => (
        <HighlightComponent textToHighlight={value} searchWords={[searchKey]} />
      ),
      order: 1,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      visible: true,
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
      order: 2,
    },
    {
      title: "Account Site",
      dataIndex: "account_site",
      key: "account_site",
      visible: true,
      ...renderFilterDropdown("account_site"),
      render: (value) => (
        <HighlightComponent textToHighlight={value} searchWords={[searchKey]} />
      ),
      order: 3,
    },

    {
      title: "Parent Account",
      dataIndex: "parent_account",
      key: "parent_account",
      visible: true,
      ...renderFilterDropdown("parent_account"),
      render: (value) => (
        <HighlightComponent textToHighlight={value} searchWords={[searchKey]} />
      ),
      order: 4,
    },
    {
      title: "Website",
      dataIndex: "website",
      key: "website",
      visible: true,
      ...renderFilterDropdown("website"),
      render: (value) =>
        value ? (
          <a href={value} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        ) : (
          "-"
        ),
      order: 5,
    },
    {
      title: "Account Number",
      dataIndex: "account_number",
      key: "account_number",
      visible: true,
      ...renderFilterDropdown("account_number"),
      render: (value) => (
        <HighlightComponent textToHighlight={value} searchWords={[searchKey]} />
      ),
      order: 6,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      visible: false,
      order: 7,
    },
    { title: "Fax", dataIndex: "fax", key: "fax", visible: false, order: 8 },
    {
      title: "Ticker Symbol",
      dataIndex: "ticker_symbol",
      key: "ticker_symbol",
      visible: false,
      order: 9,
    },
    {
      title: "Account Type",
      dataIndex: "account_type",
      key: "account_type",
      visible: false,
      order: 10,
    },
    {
      title: "Ownership",
      dataIndex: "ownership",
      key: "ownership",
      visible: false,
      order: 11,
    },
    {
      title: "Industry",
      dataIndex: "industry",
      key: "industry",
      visible: false,
      order: 12,
    },
    {
      title: "Employees",
      dataIndex: "employees",
      key: "employees",
      visible: false,
      order: 13,
    },
    {
      title: "Annual Revenue",
      dataIndex: "annual_revenue",
      key: "annual_revenue",
      visible: false,
      order: 14,
    },
    {
      title: "SIC Code",
      dataIndex: "sic_code",
      key: "sic_code",
      visible: false,
      order: 15,
    },
    {
      title: "Billing Street",
      dataIndex: "billing_street",
      key: "billing_street",
      visible: false,
      order: 16,
    },
    {
      title: "Shipping Street",
      dataIndex: "shipping_street",
      key: "shipping_street",
      visible: false,
      order: 17,
    },
    {
      title: "Billing City",
      dataIndex: "billing_city",
      key: "billing_city",
      visible: false,
      order: 18,
    },
    {
      title: "Shipping City",
      dataIndex: "shipping_city",
      key: "shipping_city",
      visible: false,
      order: 19,
    },
    {
      title: "Billing State",
      dataIndex: "billing_state",
      key: "billing_state",
      visible: false,
      order: 20,
    },
    {
      title: "Shipping State",
      dataIndex: "shipping_state",
      key: "shipping_state",
      visible: false,
      order: 21,
    },
    {
      title: "Billing Zip Code",
      dataIndex: "billing_zip_code",
      key: "billing_zip_code",
      visible: false,
      order: 22,
    },
    {
      title: "Shipping Zip Code",
      dataIndex: "shipping_zip_code",
      key: "shipping_zip_code",
      visible: false,
      order: 23,
    },
    {
      title: "Billing Country",
      dataIndex: "billing_country",
      key: "billing_country",
      visible: false,
      order: 24,
    },
    {
      title: "Shipping Country",
      dataIndex: "shipping_country",
      key: "shipping_country",
      visible: false,
      order: 25,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      visible: false,
      order: 26,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      visible: false,
      order: 27,
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      visible: false,
      order: 28,
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
      visible: true,
      default: true,
      order: 29,
    },
  ];

  const getAccounts = useCallback(() => {
    const url = `${SERVER_IP}account?page=${currentPage}&limit=${pageSize}&sort=asc`;
    dispatch(getApi("GET_ACCOUNT_BOOKS", url));
  }, [dispatch, pageSize, currentPage]);

  useEffect(() => {
    getAccounts();
  }, [getAccounts, pageSize, currentPage]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    message.success("Copied to clipboard!");
  };

  const filteredData = useMemo(() => {
    return globalRedux?.accountBooks?.filter((item) =>
      Object.keys(columnFilters).every((key) =>
        item[key]
          ?.toLowerCase()
          .includes(columnFilters[key]?.toLowerCase() || "")
      )
    );
  }, [columnFilters, globalRedux.accountBooks]);

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

  const handleDrawer = (rowData) => {
    setEditAccount(rowData);
    setAccountAddModal(true);
  };

  const handleClose = () => {
    setAccountAddModal(false);
    setEditAccount(null);
  };

  console.log("refreshList", globalRedux);

  return (
    <>
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <Button onClick={exportToExcel} icon={<DownloadOutlined />}>
            Export Excel
          </Button>
        </Col>
      </Row>

      <AccountsListPresentational
        {...{
          filteredData,
          column: accountColumns,
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
