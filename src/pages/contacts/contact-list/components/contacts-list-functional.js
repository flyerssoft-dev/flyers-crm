import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Row, Col } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { getApi } from "redux/sagas/getApiDataSaga";
import { SERVER_IP } from "assets/Config";
import HighlightComponent from "components/HighlightComponent";
import { resetApiStatus } from "redux/reducers/globals/globalActions";
import { generatePagination } from "helpers";
import {
  Actions,
  API_STATUS,
  CUSTOMER_TYPE,
  Feature,
} from "constants/app-constants";
import ContactsListPresentational from "./contacts-list-presentational";
import { useNavigate } from "react-router-dom";
import { postApi } from "redux/sagas/postApiDataSaga";
import { CheckPermission } from "hooks/usePermission";

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const ContactListFunctional = React.memo(() => {
  const contactRedux = useSelector((state) => state.contactRedux);
  const globalRedux = useSelector((state) => state.globalRedux);
  const loginRedux = useSelector((state) => state.loginRedux);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [contactAddModal, setContactAddModal] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [editContact, setEditContact] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountDropdownValue, setAccountDropDownValue] = useState([]);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const getContacts = useCallback(() => {
    let url = `${SERVER_IP}contact?page=${currentPage}&limit=${pageSize}&sort=asc&search=${searchKey}`;
    dispatch(getApi("GET_CONTACT", url));
  }, [dispatch, searchKey, currentPage, pageSize]);

  const getuserDetails = useCallback(() => {
    const page = 1;
    const limit = 500;
    let user_details_url = `${SERVER_IP}employeeDetails/getAllEmployeeDetails?page=${page}&limit=${limit}&sort=asc`;
    dispatch(getApi("GET_USER_DETAILS", user_details_url));
  }, [dispatch]);

  useEffect(() => {
    getContacts();
    getuserDetails();
  }, [getContacts]);

  useEffect(() => {
    const value = globalRedux?.accountBooks?.data?.map((item) => ({
      label: item?.account_name,
      value: item?.id,
    }));
    setAccountDropDownValue(value);
  }, [globalRedux?.accountBooks]);

  useEffect(() => {
    let doIt = false;
    if (globalRedux.apiStatus.DELETE_CONTACT === "SUCCESS") {
      dispatch(resetApiStatus("DELETE_CONTACT"));
      setSelectedRowKeys([]);
      doIt = true;
    }
    if (doIt) {
      getContacts();
    }
  }, [globalRedux.apiStatus, dispatch, getContacts]);

  useEffect(() => {
    if (globalRedux.apiStatus.ADD_BULK_CONTACT_DATA === "SUCCESS") {
      dispatch(resetApiStatus("ADD_BULK_CONTACT_DATA"));
      getContacts?.();
    }
  }, [globalRedux.apiStatus]);

  const handleDrawer = (rowData) => {
    setEditContact(rowData);
    setContactAddModal(true);
  };

  const handleAddContact = () => {
    setEditContact(null);
    setContactAddModal(true);
  };

  const canUpdateAccount = CheckPermission(Feature.CONTACTS, Actions.UPDATE);

  const contactColumns = [
    {
      title: "Contact Owner Name",
      dataIndex: "contact_owner_name",
      key: "contact_owner_name",
      visible: true,
      default: true,
      order: 1,
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
      visible: true,
      order: 2,
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
      visible: true,
      order: 3,
    },
    {
      title: "Account Name",
      dataIndex: "account_name",
      key: "account_name",
      visible: true,
      order: 4,
      render: (name) => {
        const account = globalRedux.accountBooks?.data?.find(
          (item) => item?.id === name
        );
        return <span>{account?.account_name || name || "-"}</span>;
      },
    },

    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      visible: false,
      order: 5,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      visible: false,
      order: 6,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      visible: false,
      order: 7,
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      visible: false,
      order: 8,
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      visible: false,
      order: 9,
    },
    {
      title: "LinkedIn Profile",
      dataIndex: "linkedin_profile",
      key: "linkedin_profile",
      visible: false,
      order: 10,
    },
    {
      title: "Company Size",
      dataIndex: "company_size",
      key: "company_size",
      visible: false,
      order: 11,
    },
    {
      title: "Website",
      dataIndex: "website",
      key: "website",
      visible: false,
      order: 12,
    },
    {
      title: "Industry",
      dataIndex: "industry",
      key: "industry",
      visible: false,
      order: 13,
    },
    {
      title: "Secondary Email",
      dataIndex: "secondary_email",
      key: "secondary_email",
      visible: false,
      order: 14,
    },
    {
      title: "Time Zone",
      dataIndex: "time_zone",
      key: "time_zone",
      visible: false,
      order: 15,
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      visible: false,
      order: 16,
    },
    {
      title: "Mailing Street",
      dataIndex: "mailing_street",
      key: "mailing_street",
      visible: false,
      order: 17,
    },
    {
      title: "Other Street",
      dataIndex: "other_street",
      key: "other_street",
      visible: false,
      order: 18,
    },
    {
      title: "Mailing City",
      dataIndex: "mailing_city",
      key: "mailing_city",
      visible: false,
      order: 19,
    },
    {
      title: "Other City",
      dataIndex: "other_city",
      key: "other_city",
      visible: false,
      order: 20,
    },
    {
      title: "Mailing State",
      dataIndex: "mailing_state",
      key: "mailing_state",
      visible: false,
      order: 21,
    },
    {
      title: "Other State",
      dataIndex: "other_state",
      key: "other_state",
      visible: false,
      order: 22,
    },
    {
      title: "Mailing Zip Code",
      dataIndex: "mailing_zip_code",
      key: "mailing_zip_code",
      visible: false,
      order: 23,
    },
    {
      title: "Other Zip Code",
      dataIndex: "other_zip_code",
      key: "other_zip_code",
      visible: false,
      order: 24,
    },
    {
      title: "Mailing Country",
      dataIndex: "mailing_country",
      key: "mailing_country",
      visible: false,
      order: 25,
    },
    {
      title: "Other Country",
      dataIndex: "other_country",
      key: "other_country",
      visible: false,
      order: 26,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      visible: false,
      order: 27,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      visible: false,
      order: 28,
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      visible: false,
      order: 29,
    },

    ...(canUpdateAccount
      ? [
          {
            title: "Action",
            key: "action",
            align: "center",
            render: (_, row) => (
              <Row justify="center">
                <Col
                  className="edit_icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDrawer(row);
                  }}
                >
                  <EditOutlined />
                </Col>
              </Row>
            ),
            visible: true,
            default: true,
            order: 30,
          },
        ]
      : []),
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
      return contactRedux?.contact.data.length < pageSize
        ? contactRedux?.contact.data.length
        : pageSize;
    else {
      let end = currentPage * pageSize;
      return end > contactRedux?.contact.data.length
        ? contactRedux?.contact.data.length
        : end;
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
    setContactAddModal(false);
    setEditContact(null);
  }, [setContactAddModal, setEditContact]);

  const onUploadData = (data) => {
    const accountMap = {};
    globalRedux?.accountBooks?.data?.forEach((acc) => {
      accountMap[acc.account_name] = acc?.id;
    });

    const value = data?.map((item) => ({
      contact_owner_name: loginRedux?.display_name,
      contact_owner_id: loginRedux?.id,
      first_name: item?.["First Name"],
      last_name: item?.["Last Name"],
      account_id: accountMap[item?.["Account Name"]],
      account_name: item?.["Account Name"],
      email: item?.Email,
      title: item?.Title,
      phone: item?.Phone,
      department: item?.["Department"],
      mobile: item?.mobile,
      linkedin_profile: item?.["LinkedIn Profile"],
      company_size: `${item?.["Company Size"]}` || null,
      website: item?.["Website"],
      industry: item?.["Industry"],
      time_zone: item?.["Time Zone"],
      Status: item?.["Status"],
      secondary_email: item?.["Secondary Email"],
      mailing_street: item?.["Mailing Street"],
      other_street: item?.["Other Street"],
      mailing_city: item?.["Mailing City"],
      other_city: item?.["Other City"],
      mailing_state: item?.["Mailing State"],
      mailing_state: item?.["Other State"],
      mailing_zip_code: item?.["Mailing Zip Code"],
      other_zip_code: item?.["Other Zip Code"],
      mailing_country: item?.["Mailing Country"],
      other_country: item?.["Other Country"],
      description: item?.Description,
    }));
    let url = `${SERVER_IP}contact/multiple-records`;
    dispatch(postApi(value, "ADD_BULK_CONTACT_DATA", url));
  };

  const handleApplyFilters = (filters) => {
    console.log("Applied filters:", filters);
    const queryString = filters
      .map((f) => {
        if (f.field === "created_time" && typeof f.value === "object") {
          const { from, to } = f.value || {};
          return [
            from ? `created_from=${encodeURIComponent(from)}` : "",
            to ? `created_to=${encodeURIComponent(to)}` : "",
          ]
            .filter(Boolean)
            .join("&");
        }

        return `${encodeURIComponent(
          f.field.replace(/\s+/g, "")
        )}=${encodeURIComponent(f.value ?? true)}`;
      })
      .filter(Boolean)
      .join("&");

    let url = `${SERVER_IP}contact?page=${currentPage}&limit=${pageSize}&sort=asc&${queryString}`;
    dispatch(getApi("GET_CONTACT", url));
  };

  return (
    <ContactsListPresentational
      {...{
        filteredData: contactRedux?.contact,
        column: contactColumns,
        tableLoading,
        rowSelection,
        selectedRowKeys,
        handleAddContact,
        currentPage,
        pageSize,
        intialPageSizeOptions,
        initialPageSize,
        handleTableChange,
        setSearchKey,
        getStartingValue: () => (currentPage - 1) * pageSize + 1,
        getEndingValue: () => currentPage * pageSize,
        contactAddModal,
        setContactAddModal,
        refreshList: getContacts,
        editContact,
        handleClose,
        navigate,
        drawerOpen,
        setDrawerOpen,
        onUploadData,
        setSelectedRowKeys,
        handleApplyFilters,
      }}
    />
  );
});

export default ContactListFunctional;
