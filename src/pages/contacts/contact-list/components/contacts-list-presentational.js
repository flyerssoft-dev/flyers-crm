import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { Popconfirm, Input, Button, Pagination, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { SERVER_IP } from "assets/Config";
import TableComponent from "components/table-component";
import { deleteApi } from "redux/sagas/deleteApiSaga";
import AddContact from "pages/contacts/add-contacts";
import { DisplayedColumns } from "pages/accounts/components/DisplayedColumn";
import { PlusCircleOutlined, UploadOutlined } from "@ant-design/icons";
import ExcelUploader from "components/bulk-upload-modal";

const ContactsListPresentational = ({
  filteredData,
  column,
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
  refreshList,
  editContact,
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
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  navigate(`/contact/${record.id}`);
                },
              };
            }}
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
                              title={`Are you sure to delete this Contact?`}
                              okText="Delete"
                              cancelText="No"
                              onConfirm={() => {
                                let url = `${SERVER_IP}contact/${selectedRowKeys?.[0]}`;
                                dispatch(deleteApi("DELETE_CONTACT", url));
                                refreshList();
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
                  <Button type="primary" onClick={handleAddContact}>
                    Create Contact
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
      <AddContact
        {...{
          contactAddModal,
          setContactAddModal,
          refreshList,
          editContact,
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
        requiredFields={["Last Name"]}
        formFields={[
          "Contact Owner",
          "First Name",
          "Last Name",
          "Account Name",
          "Email",
          "Title",
          "Phone",
          "Department",
          "Mobile",
          "LinkedIn Profile",
          "Secondary Email",
          "Time Zone",
          "Status",
          "Mailing Street",
          "Other Street",
          "Mailing City",
          "Other City",
          "Mailing State",
          "Other State",
          "Mailing Zip Code",
          "Other Zip Code",
          "Mailing Country",
          "Other Country",
          "Description",
        ]}
        onDataSubmit={(data) => onUploadData(data)}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
};

export default ContactsListPresentational;
