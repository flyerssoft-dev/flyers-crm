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
import LeadsListPresentational from "./leads-list-presentational";
import { useNavigate } from "react-router-dom";
import { postApi } from "redux/sagas/postApiDataSaga";

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const LeadsListFunctional = React.memo(() => {
  const leadsRedux = useSelector((state) => state.leadsRedux);
  const globalRedux = useSelector((state) => state.globalRedux);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [leadAddModal, setLeadAddModal] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [editLead, setEditLead] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getLeads = useCallback(() => {
    let url = `${SERVER_IP}leads?page=${currentPage}&limit=${pageSize}&sort=asc&search=${searchKey}`;
    dispatch(getApi("GET_LEADS", url));
  }, [dispatch, searchKey, currentPage, pageSize]);

  useEffect(() => {
    getLeads();
  }, [getLeads]);

  useEffect(() => {
    let doIt = false;
    if (globalRedux.apiStatus.DELETE_LEAD === "SUCCESS") {
      dispatch(resetApiStatus("DELETE_LEAD"));
      setSelectedRowKeys([]);
      doIt = true;
    }
    if (doIt) {
      getLeads();
    }
  }, [globalRedux.apiStatus, dispatch, getLeads]);


  useEffect(() => {
      if (
        globalRedux.apiStatus.ADD_BULK_DATA === "SUCCESS") {
        dispatch(resetApiStatus("ADD_BULK_DATA"));
        getLeads?.();
      }
    }, [globalRedux.apiStatus]);

  const handleDrawer = (rowData) => {
    setEditLead(rowData);
    setLeadAddModal(true);
  };

  const handleAddLead = () => {
    setEditLead(null);
    setLeadAddModal(true);
  };

  const leadColumns = [
    {
      title: "Lead Owner Name",
      dataIndex: "lead_owner_name",
      key: "lead_owner_name",
      visible: true,
      default: true,
      order: 2,
    },
    {
      title: "Company Name",
      dataIndex: "company_name",
      key: "company_name",
      visible: true,
      default: true,
      order: 3,
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
      visible: true,
      order: 4,
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
      visible: true,
      order: 5,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      visible: true,
      order: 6,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      visible: true,
      order: 7,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      visible: true,
      order: 8,
    },
    { title: "Fax", dataIndex: "fax", key: "fax", visible: false, order: 9 },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      visible: false,
      order: 10,
    },
    {
      title: "Website",
      dataIndex: "website",
      key: "website",
      visible: false,
      order: 11,
    },
    {
      title: "Lead Source",
      dataIndex: "lead_source",
      key: "lead_source",
      visible: false,
      order: 12,
    },
    {
      title: "Lead Status",
      dataIndex: "lead_status",
      key: "lead_status",
      visible: false,
      order: 13,
    },
    {
      title: "Industry",
      dataIndex: "industry",
      key: "industry",
      visible: false,
      order: 14,
    },
    {
      title: "No Of Employees",
      dataIndex: "no_of_employees",
      key: "no_of_employees",
      visible: false,
      order: 15,
    },
    {
      title: "Annual Revenue",
      dataIndex: "annual_revenue",
      key: "annual_revenue",
      visible: false,
      order: 16,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      visible: false,
      order: 17,
    },
    {
      title: "Email Opt Out",
      dataIndex: "email_opt_out",
      key: "email_opt_out",
      visible: false,
      order: 18,
    },
    {
      title: "Skype Id",
      dataIndex: "skype_id",
      key: "skype_id",
      visible: false,
      order: 19,
    },
    {
      title: "Secondary Email",
      dataIndex: "secondary_email",
      key: "secondary_email",
      visible: false,
      order: 20,
    },
    {
      title: "Twitter",
      dataIndex: "twitter",
      key: "twitter",
      visible: false,
      order: 21,
    },
    {
      title: "Address Line One",
      dataIndex: "address_line_one",
      key: "address_line_one",
      visible: false,
      order: 22,
    },
    {
      title: "Address Line Two",
      dataIndex: "address_line_two",
      key: "address_line_two",
      visible: false,
      order: 23,
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      visible: false,
      order: 24,
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      visible: false,
      order: 25,
    },
    {
      title: "Zip Code",
      dataIndex: "zip_code",
      key: "zip_code",
      visible: false,
      order: 26,
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      visible: false,
      order: 27,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      visible: false,
      order: 28,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      visible: false,
      order: 29,
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      visible: false,
      order: 30,
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
      order: 31,
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
      return leadsRedux.leads.length < pageSize
        ? leadsRedux.leads.length
        : pageSize;
    else {
      let end = currentPage * pageSize;
      return end > leadsRedux.leads.length ? leadsRedux.leads.length : end;
    }
  };

  const tableLoading = useMemo(
    () => globalRedux.apiStatus.GET_LEADS === API_STATUS.PENDING,
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
    setLeadAddModal(false);
    setEditLead(null);
  }, [setLeadAddModal, setEditLead]);

  const onUploadData = (data) => {
    const value = data.map((item) => ({
      lead_owner_name: item?.["Lead Owner"],
      company_name: item?.["Company Name"],
      first_name:item?.["First Name"],
      last_name:item?.["Last Name"],
      title:item?.["Title"],
      email: item?.Email,
      phone: item?.Phone,
      fax: item?.Fax,
      mobile: item?.Mobile,
      website: item?.Website,
      lead_source: item?.['Lead Source'],
      lead_status: item?.["Lead Status"],
      industry: item?.Industry,
      no_of_employees: item?.["No.of Employees"],
      annual_revenue: item?.["Annual Revenue"],
      rating:item?.Rating,
      // email_opt_out: item?.['Email Opt Out'],
      skype_id: item?.["Skype ID"],
      secondary_email: item?.["Secondary Email"],
      twitter:item?.["Twitter"],
      address_line_one: item?.["Address Line 1"],
      address_line_two: item?.["Address Line 2"],
      city: item?.City,
      state: item?.State,
      zip_code: item?.["Zip Code"],
      country: item?.Country,
      description: item?.Description
    }));
    let url = `${SERVER_IP}leads/multiple-leads`;
    dispatch(postApi(value, "ADD_BULK_DATA", url));
  };

  return (
    <LeadsListPresentational
      {...{
        filteredData: leadsRedux?.leads,
        column: leadColumns,
        tableLoading,
        rowSelection,
        selectedRowKeys,
        handleAddLead,
        currentPage,
        pageSize,
        intialPageSizeOptions,
        initialPageSize,
        handleTableChange,
        setSearchKey,
        getStartingValue,
        getEndingValue,
        leadAddModal,
        setLeadAddModal,
        refreshList: getLeads,
        editLead,
        handleClose,
        navigate,
        drawerOpen,
        setDrawerOpen,
        onUploadData,
      }}
    />
  );
});

export default LeadsListFunctional;
