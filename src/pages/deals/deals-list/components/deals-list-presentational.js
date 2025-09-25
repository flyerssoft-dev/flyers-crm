import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { Popconfirm, Input, Button, Pagination, Row, Col } from "antd";
import { useDispatch } from "react-redux";
import { SERVER_IP } from "assets/Config";
import TableComponent from "components/table-component";
import { deleteApi } from "redux/sagas/deleteApiSaga";
import {
  ApartmentOutlined,
  PlusCircleOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { DisplayedColumns } from "pages/accounts/components/DisplayedColumn";
import AddDeal from "pages/deals/add-deal";
import Pipelines from "pages/pipelines";

const DealListPresentational = ({
  filteredData,
  column,
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
  refreshList,
  editDeal,
  handleClose,
  navigate,
}) => {
  const dispatch = useDispatch();

  const [columns, setColumns] = useState(column);
  const [view, setView] = useState("list");
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
      <Row
        style={{
          marginBottom: 16,
          marginTop: 16,
          justifyContent: "space-between",
          marginLeft: 20,
          marginRight: 20,
        }}
        align="middle"
      >
        <Col span={8}>
          <Row gutter={[10, 10]}>
            <Col xl={24}>
              <Row gutter={[10, 10]} align="middle">
                <Col>
                  <Input
                    placeholder="Search"
                    suffix={<AiOutlineSearch />}
                    style={{ height: "30px" }}
                    onChange={({ target: { value } }) => setSearchKey(value)}
                  />
                </Col>
                {selectedRowKeys?.length === 1 ? (
                  <Col>
                    <Popconfirm
                      title={`Are you sure to delete this Deal?`}
                      okText="Delete"
                      cancelText="No"
                      onConfirm={() => {
                        let url = `${SERVER_IP}deals/${selectedRowKeys?.[0]}`;
                        dispatch(deleteApi("DELETE_DEAL", url));
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
          <Button type="primary" onClick={handleAddDeal}>
            Create Deal
          </Button>
          <Col onClick={() => setIsColumnModalOpen(true)}>
            <Button type="primary" icon={<PlusCircleOutlined />} />
          </Col>
          <Button
            icon={<UnorderedListOutlined />}
            type={view === "list" ? "primary" : "default"}
            onClick={() => setView("list")}
            style={{ marginLeft: 8 }}
          />
          <Button
            icon={<ApartmentOutlined />}
            type={view === "pipeline" ? "primary" : "default"}
            onClick={() => setView("pipeline")}
            style={{ marginLeft: 8 }}
          />
        </Col>
      </Row>

      {view === "list" ? (
        <Row
          style={{
            marginBottom: 16,
            justifyContent: "space-between",
            marginLeft: 20,
            marginRight: 20,
          }}
          align="middle"
        >
          <Col span={24}>
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
                    navigate(`/deals/${record.id}`);
                  },
                };
              }}
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
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
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
      ) : (
        <Pipelines />
      )}

      <AddDeal
        {...{
          dealAddModal,
          setDealAddModal,
          refreshList,
          editDeal,
          handleClose,
        }}
      />
      <DisplayedColumns
        columns={columns}
        onSave={handleSaveColumns}
        onCancel={handleCancelColumns}
        isOpen={isColumnModalOpen}
      />
    </>
  );
};

export default DealListPresentational;
