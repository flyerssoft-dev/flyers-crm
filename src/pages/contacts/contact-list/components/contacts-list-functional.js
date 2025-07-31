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
import ContactsListPresentational from "./contacts-list-presentational";
import { useNavigate } from "react-router-dom";

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const ContactListFunctional = React.memo(() => {
  const contactRedux = useSelector((state) => state.contactRedux);
  const globalRedux = useSelector((state) => state.globalRedux);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [contactAddModal, setContactAddModal] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [editContact, setEditContact] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const dispatch = useDispatch();

  const navigate= useNavigate()

  const getContacts = useCallback(() => {
    let url = `${SERVER_IP}contact?page=${currentPage}&limit=${pageSize}&sort=asc&search=${searchKey}`;
    dispatch(getApi("GET_CONTACT", url));
  }, [dispatch, searchKey, currentPage, pageSize]);

  useEffect(() => {
    getContacts();
  }, [getContacts]);

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

  const handleDrawer = (rowData) => {
    setEditContact(rowData);
    setContactAddModal(true);
  };

  const handleAddContact = () => {
    setEditContact(null);
    setContactAddModal(true);
  };

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
      title: "Lead Source",
      dataIndex: "lead_source",
      key: "lead_source",
      visible: true,
      default: true,
      order: 2,
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
      visible: true,
      order: 3,
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
      visible: true,
      order: 4,
    },
    {
      title: "Account Name",
      dataIndex: "account_name",
      key: "account_name",
      visible: true,
      order: 5,
    },
    {
      title: "Vendor Name",
      dataIndex: "vendor_name",
      key: "vendor_name",
      visible: false,
      order: 6,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      visible: false,
      order: 7,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      visible: false,
      order: 8,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      visible: false,
      order: 9,
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      visible: false,
      order: 10,
    },
    {
      title: "Other Phone",
      dataIndex: "other_phone",
      key: "other_phone",
      visible: false,
      order: 11,
    },
    {
      title: "Home Phone",
      dataIndex: "home_phone",
      key: "home_phone",
      visible: false,
      order: 12,
    },
    { title: "Fax", dataIndex: "fax", key: "fax", visible: false, order: 13 },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      visible: false,
      order: 14,
    },
    {
      title: "Assistant",
      dataIndex: "assistant",
      key: "assistant",
      visible: false,
      order: 15,
    },
    {
      title: "Date Of Birth",
      dataIndex: "date_of_birth",
      key: "date_of_birth",
      visible: false,
      order: 16,
    },
    {
      title: "Email Opt Out",
      dataIndex: "email_opt_out",
      key: "email_opt_out",
      visible: false,
      order: 17,
    },
    {
      title: "Skype Id",
      dataIndex: "skype_id",
      key: "skype_id",
      visible: false,
      order: 18,
    },
    {
      title: "Secondary Email",
      dataIndex: "secondary_email",
      key: "secondary_email",
      visible: false,
      order: 19,
    },
    {
      title: "Twitter",
      dataIndex: "twitter",
      key: "twitter",
      visible: false,
      order: 20,
    },
    {
      title: "Reporting To",
      dataIndex: "reporting_to",
      key: "reporting_to",
      visible: false,
      order: 21,
    },
    {
      title: "Mailing Street",
      dataIndex: "mailing_street",
      key: "mailing_street",
      visible: false,
      order: 22,
    },
    {
      title: "Other Street",
      dataIndex: "other_street",
      key: "other_street",
      visible: false,
      order: 23,
    },
    {
      title: "Mailing City",
      dataIndex: "mailing_city",
      key: "mailing_city",
      visible: false,
      order: 24,
    },
    {
      title: "Other City",
      dataIndex: "other_city",
      key: "other_city",
      visible: false,
      order: 25,
    },
    {
      title: "Mailing State",
      dataIndex: "mailing_state",
      key: "mailing_state",
      visible: false,
      order: 26,
    },
    {
      title: "Other State",
      dataIndex: "other_state",
      key: "other_state",
      visible: false,
      order: 27,
    },
    {
      title: "Mailing Zip Code",
      dataIndex: "mailing_zip_code",
      key: "mailing_zip_code",
      visible: false,
      order: 28,
    },
    {
      title: "Other Zip Code",
      dataIndex: "other_zip_code",
      key: "other_zip_code",
      visible: false,
      order: 29,
    },
    {
      title: "Mailing Country",
      dataIndex: "mailing_country",
      key: "mailing_country",
      visible: false,
      order: 30,
    },
    {
      title: "Other Country",
      dataIndex: "other_country",
      key: "other_country",
      visible: false,
      order: 31,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      visible: false,
      order: 32,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      visible: false,
      order: 33,
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      visible: false,
      order: 34,
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
      order: 35,
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
      return contactRedux?.contact.length < pageSize
        ? contactRedux?.contact.length
        : pageSize;
    else {
      let end = currentPage * pageSize;
      return end > contactRedux?.contact.length
        ? contactRedux?.contact.length
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
        getStartingValue,
        getEndingValue,
        contactAddModal,
        setContactAddModal,
        refreshList: getContacts,
        editContact,
        handleClose,
        navigate
      }}
    />
  );
});

export default ContactListFunctional;
