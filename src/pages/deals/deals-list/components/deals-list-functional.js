import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Row, Col } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { getApi } from "redux/sagas/getApiDataSaga";
import { SERVER_IP } from "assets/Config";
import { resetApiStatus } from "redux/reducers/globals/globalActions";
import { API_STATUS } from "constants/app-constants";
import DealListPresentational from "./deals-list-presentational";
import { useNavigate } from "react-router-dom";

const initialPageSize = 10;
const intialPageSizeOptions = [10, 15, 20];

const DealListFunctional = React.memo(() => {
  const dealsRedux = useSelector((state) => state.dealsRedux);
  const globalRedux = useSelector((state) => state.globalRedux);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dealAddModal, setDealAddModal] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [editDeal, setEditDeal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const getDeals = useCallback(() => {
    let url = `${SERVER_IP}deals?page=${currentPage}&limit=${pageSize}&sort=asc&search=${searchKey}`;
    dispatch(getApi("GET_DEALS", url));
  }, [dispatch, searchKey, currentPage, pageSize]);

  useEffect(() => {
    getDeals();
  }, [getDeals]);

  useEffect(() => {
    let doIt = false;
    if (globalRedux.apiStatus.DELETE_DEAL === "SUCCESS") {
      dispatch(resetApiStatus("DELETE_DEAL"));
      setSelectedRowKeys([]);
      doIt = true;
    }
    if (doIt) {
      getDeals();
    }
  }, [globalRedux.apiStatus, dispatch, getDeals]);

  const handleDrawer = (rowData) => {
    setEditDeal(rowData);
    setDealAddModal(true);
  };

  const handleAddDeal = () => {
    setEditDeal(null);
    setDealAddModal(true);
  };

  const dealColumns = [
    {
      title: "Deal Owner Name",
      dataIndex: "deal_owner_name",
      key: "deal_owner_name",
      visible: true,
      default: true,
      order: 1,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      visible: true,
      default: true,
      order: 2,
    },
    {
      title: "Deal Name",
      dataIndex: "deal_name",
      key: "deal_name",
      visible: true,
      order: 3,
    },
    {
      title: "Closing Date",
      dataIndex: "closing_date",
      key: "closing_date",
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
      title: "Stage",
      dataIndex: "stage",
      key: "stage",
      visible: true,
      order: 6,
    },
    {
      title: "Contact Name",
      dataIndex: "contact_name",
      key: "contact_name",
      visible: false,
      order: 7,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      visible: false,
      order: 8,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      visible: false,
      order: 9,
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      visible: false,
      order: 10,
    },
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
      order: 11,
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
      return dealsRedux?.deals.length < pageSize
        ? dealsRedux?.deals.length
        : pageSize;
    else {
      let end = currentPage * pageSize;
      return end > dealsRedux?.deals.length ? dealsRedux?.deals.length : end;
    }
  };

  const tableLoading = useMemo(
    () => globalRedux.apiStatus.GET_DEALS === API_STATUS.PENDING,
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
    setDealAddModal(false);
    setEditDeal(null);
  }, [setDealAddModal, setEditDeal]);

  return (
    <DealListPresentational
      {...{
        filteredData: dealsRedux?.deals,
        column: dealColumns,
        tableLoading,
        rowSelection,
        selectedRowKeys,
        handleAddDeal,
        currentPage,
        pageSize,
        intialPageSizeOptions,
        initialPageSize,
        handleTableChange,
        setSearchKey,
        getStartingValue,
        getEndingValue,
        dealAddModal,
        setDealAddModal,
        refreshList: getDeals,
        editDeal,
        handleClose,
        navigate,
      }}
    />
  );
});

export default DealListFunctional;
