import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { Popconfirm, Input, Button, Pagination, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { SERVER_IP } from "assets/Config";
import TableComponent from "components/table-component";
import { deleteApi } from "redux/sagas/deleteApiSaga";
import AddLead from "pages/leads/add-lead";
import {
  PlusCircleOutlined,
  UpCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { DisplayedColumns } from "pages/accounts/components/DisplayedColumn";
import ExcelUploader from "components/bulk-upload-modal";
import parsePhoneNumberFromString from "libphonenumber-js";

const LeadsListPresentational = ({
  filteredData,
  column,
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
  refreshList,
  editLead,
  handleClose,
  navigate,
  drawerOpen,
  setDrawerOpen,
  onUploadData,
}) => {
  const globalRedux = useSelector((state) => state.globalRedux);
  const dispatch = useDispatch();

  const [columns, setColumns] = useState(column);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

  const handleSaveColumns = (updatedColumns) => {
    setColumns(updatedColumns);
    setIsColumnModalOpen(false);
  };

  const handleCancelColumns = () => {
    setIsColumnModalOpen(false);
  };

  const visibleColumns = columns
    .filter((col) => col.visible)
    .sort((a, b) => a.order - b.order);
  return (
    <>
      <Row>
        <Col span={24} style={{ padding: 0 }}>
          <TableComponent
            loading={tableLoading}
            className="custom-table"
            style={{ width: "100%" }}
            columns={visibleColumns}
            bordered
            rowKey={(record) => record.id}
            dataSource={filteredData}
            rowSelection={rowSelection}
            title={() => (
              <Row style={{ justifyContent: "space-between" }}>
                <Col span={8}>
                  <Row gutter={[10, 10]}>
                    <Col xl={24}>
                      <Row gutter={[10, 10]} align="middle">
                        <Col>
                          <Input
                            placeholder="Search"
                            suffix={<AiOutlineSearch />}
                            style={{ height: "30px" }}
                            onChange={({ target: { value } }) =>
                              setSearchKey(value)
                            }
                          />
                        </Col>
                        {selectedRowKeys?.length === 1 ? (
                          <Col>
                            <Popconfirm
                              title={`Are you sure to delete this Lead?`}
                              okText="Delete"
                              cancelText="No"
                              onConfirm={() => {
                                let url = `${SERVER_IP}leads/${selectedRowKeys?.[0]}`;
                                dispatch(deleteApi("DELETE_LEAD", url));
                              }}
                            >
                              <div
                                style={{
                                  textDecoration: "underline",
                                  color: "red",
                                  cursor: "pointer",
                                }}
                              >
                                Delete
                              </div>
                            </Popconfirm>
                          </Col>
                        ) : null}
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col style={{ display: "flex", gap: "10px" }}>
                  <Button type="primary" onClick={handleAddLead}>
                    Create Lead
                  </Button>
                  <Col onClick={() => setIsColumnModalOpen(true)}>
                    <Button type="primary" icon={<PlusCircleOutlined />} />
                  </Col>
                  <Col onClick={() => setDrawerOpen(true)}>
                    <Button type="primary" icon={<UploadOutlined />} />
                  </Col>
                </Col>
              </Row>
            )}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              position: ["none", "none"],
            }}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  navigate(`/leads/${record.id}`);
                },
              };
            }}
            footer={() => (
              <Row justify="space-between">
                <Col span={12}>
                  {!!filteredData?.length &&
                    `Showing ${getStartingValue()} - ${getEndingValue()} of ${
                      filteredData?.length
                    } Data`}
                </Col>
                <Col span={12}>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Pagination
                      pageSizeOptions={intialPageSizeOptions}
                      defaultPageSize={initialPageSize}
                      showSizeChanger={true}
                      total={filteredData?.length}
                      onChange={handleTableChange}
                      responsive
                    />
                  </div>
                </Col>
              </Row>
            )}
          />
        </Col>
      </Row>
      <AddLead
        {...{
          leadAddModal,
          setLeadAddModal,
          refreshList,
          editLead,
          handleClose,
        }}
      />
      <DisplayedColumns
        columns={columns}
        onSave={handleSaveColumns}
        onCancel={handleCancelColumns}
        isOpen={isColumnModalOpen}
      />
      <ExcelUploader
        requiredFields={["Company Name", "Last Name"]}
        formFields={[
          "Lead Owner",
          "Company Name",
          "First Name",
          "Last Name",
          "Email",
          "Phone",
          "Mobile",
          "Website",
          "Industry",
          "No.of Employees",
          "Secondary Email",
          "Address Line 1",
          "Address Line 2",
          "City",
          "State",
          "Zip Code",
          "Country",
          "Description",
        ]}
        validationRules={{
          Email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
          Phone: (v) =>  parsePhoneNumberFromString(v),
          Mobile: (v) =>  parsePhoneNumberFromString(v),
          Website: (v) =>
            /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/.test(
              v
            ),
          "Zip Code": (v) => /^[0-9]{5,6}$/.test(v),
        }}
        onDataSubmit={(data) => onUploadData(data)}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
};

export default LeadsListPresentational;
