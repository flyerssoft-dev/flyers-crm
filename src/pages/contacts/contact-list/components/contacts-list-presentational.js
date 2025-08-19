import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import {
  Popconfirm,
  Input,
  Button,
  Pagination,
  Row,
  Col,
  Modal,
  Select,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { SERVER_IP } from "assets/Config";
import TableComponent from "components/table-component";
import { deleteApi } from "redux/sagas/deleteApiSaga";
import AddContact from "pages/contacts/add-contacts";
import { DisplayedColumns } from "pages/accounts/components/DisplayedColumn";
import { PlusCircleOutlined, UploadOutlined } from "@ant-design/icons";
import ExcelUploader from "components/bulk-upload-modal";
import { postApi } from "redux/sagas/postApiDataSaga";

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
  setSelectedRowKeys,
}) => {
  const userRedux = useSelector((state) => state.userRedux);
  const dispatch = useDispatch();

  const [columns, setColumns] = useState(column);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [assignDropdownValue, setAssignDropdownValue] = useState([]);

  useEffect(() => {
    const user = userRedux?.userDetails?.message;
    if (user?.length > 0) {
      const value = user?.map((item) => ({
        label: item?.display_name,
        value: item?.id,
        image_url: item?.image_url,
        employee_id: item?.employee_id,
        job_title: item?.job_title,
        department: item?.department,
      }));
      setAssignDropdownValue(value);
    }
  }, [userRedux?.userDetails]);

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

  const getUserName = (id) => {
    const user = userRedux?.userDetails?.message;
    const value = user?.find((item) => item?.id === id);
    return value;
  };

  const handleAssign = () => {
    if (!selectedUser) return;
    console.log("selectedUser", selectedUser);
    const payload = {
      followed_by_id: selectedUser,
      followed_by_name: getUserName(selectedUser)?.display_name,
      contact_ids: selectedRowKeys,
    };

    const url = `${SERVER_IP}contact/assign-contact`;
    dispatch(postApi(payload, "ASSIGN_CONTACT", url));
    setAssignModalOpen(false);
    setSelectedRowKeys([]);
  };

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
                <Col>
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
                        {selectedRowKeys?.length > 0 ? (
                          <Col>
                            <Button
                              type="primary"
                              onClick={() => setAssignModalOpen(true)}
                            >
                              Assign Contact
                            </Button>
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
        validationRules={{
          Email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
          "Secondary Email": (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
          Phone: (v) => /^\+?[0-9]{10,15}$/.test(v?.toString()),
          Mobile: (v) => /^\+?[0-9]{10,15}$/.test(v?.toString()),
          "Mailing Zip Code": (v) => /^[0-9]{5,6}$/.test(v),
          "Other Zip Code": (v) => /^[0-9]{5,6}$/.test(v),
        }}
        onDataSubmit={(data) => onUploadData(data)}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <Modal
        title="Assign Contact"
        open={assignModalOpen}
        onCancel={() => setAssignModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setAssignModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="assign"
            type="primary"
            onClick={handleAssign}
            disabled={!selectedUser}
          >
            Assign
          </Button>,
        ]}
      >
        <p>Select a user to assign this contact:</p>
        <Select
          style={{ width: "100%" }}
          placeholder="Select user"
          value={selectedUser}
          onChange={(val) => setSelectedUser(val)}
          showSearch
          optionLabelProp="label"  
        >
          {assignDropdownValue.map((user) => (
            <Select.Option
              key={user.value}
              label={user.label}
              value={user.value}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                {/* Avatar Circle with initials */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                  }}
                >
                  {user.label
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>

                {/* User Info */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>
                    {user.label}
                  </span>
                  <span style={{ fontSize: 12, color: "#555" }}>
                    {user.email}
                  </span>
                  <span style={{ fontSize: 12, color: "#888" }}>
                    {user.job_title} ({user.department})
                  </span>
                </div>
              </div>
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </>
  );
};

export default ContactsListPresentational;
