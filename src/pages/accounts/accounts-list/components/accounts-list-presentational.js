import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { Popconfirm, Input, Button, Pagination, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { SERVER_IP } from "assets/Config";
import TableComponent from "components/table-component";
import { deleteApi } from "redux/sagas/deleteApiSaga";
import AddAccount from "pages/accounts/add-account";
import { DisplayedColumns } from "pages/accounts/components/DisplayedColumn";
import { PlusCircleOutlined, UploadOutlined } from "@ant-design/icons";
import ExcelUploader from "components/bulk-upload-modal";
import parsePhoneNumberFromString from "libphonenumber-js";

const AccountsListPresentational = ({
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
  refreshList,
  editAccount,
  handleClose,
  navigate,
  drawerOpen,
  setDrawerOpen,
  onUploadData,
  data
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


  console.log('${getStartingValue()} - ${getEndingValue()}', `${getStartingValue()} - ${getEndingValue()}`)

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
                  navigate(`/account/${record.id}`);
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
                              title={`Are you sure to delete this Account?`}
                              okText="Delete"
                              cancelText="No"
                              onConfirm={() => {
                                let url = `${SERVER_IP}account/${selectedRowKeys?.[0]}`;
                                dispatch(deleteApi("DELETE_CUSTOMER", url));
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
                  <Button type="primary" onClick={handleAddAccount}>
                    Create Account
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
                      data?.meta?.total_items
                    } Data`}
                </Col>
                <Col span={12}>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Pagination
                      pageSizeOptions={intialPageSizeOptions}
                      defaultPageSize={initialPageSize}
                      showSizeChanger={true}
                      total={data?.meta?.total_items}
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
      <AddAccount
        {...{
          accountAddModal,
          setAccountAddModal,
          refreshList,
          editAccount,
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
        requiredFields={["Account Owner", "Account Name", "Phone"]}
        formFields={[
          "Account Owner",
          "Account Name",
          "Phone",
          "Website",
          "Employees",
          "Billing Street",
          "Shipping Street",
          "Billing City",
          "Shipping City",
          "Billing State",
          "Shipping State",
          "Billing Zip Code",
          "Shipping Zip Code",
          "Billing Country",
          "Shipping Country",
          "Description",
        ]}
         validationRules={{
          Phone: (v) => parsePhoneNumberFromString(v),
          Website: (v) =>
            /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/.test(
              v
            ),
          "Billing Zip Code": (v) => /^[0-9]{5,6}$/.test(v),
          "Shipping Zip Code": (v) => /^[0-9]{5,6}$/.test(v),
        }}
        onDataSubmit={(data) => onUploadData(data)}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
};

export default AccountsListPresentational;
