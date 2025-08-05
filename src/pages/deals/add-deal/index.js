import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Form,
  Select,
  InputNumber,
  Drawer,
  DatePicker,
  Tooltip,
  Modal,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { putApi } from "redux/sagas/putApiSaga";
import {
  API_STATUS,
  DEAL_STAGE,
  LEAD_SOURCE,
  RATING,
} from "constants/app-constants";
import { SERVER_IP } from "assets/Config";
import { postApi } from "redux/sagas/postApiDataSaga";
import { resetApiStatus } from "redux/reducers/globals/globalActions";
import dayjs from "dayjs";
import { InfoCircleOutlined } from "@ant-design/icons";
import { getApi } from "redux/sagas/getApiDataSaga";

const AddDeal = ({
  dealAddModal,
  width = "50%",
  editDeal,
  setDealAddModal,
  refreshList,
  handleClose,
}) => {
  const [form] = Form.useForm();
  const globalRedux = useSelector((state) => state.globalRedux);
  const dispatch = useDispatch();
  const { TextArea } = Input;

  const [form1] = Form.useForm();
  const [accountDropdownValue, setAccountDropDownValue] = useState([]);
  const [accountSearchvalue, setAccountSearchValue] = useState();
  const [addNewButtonVisible, setAddNewButtonVisible] = useState(false);
  const [addNewModalVisible, setAddnewModalVisible] = useState(false);

  const originalAccountList = useRef([]);

  const renderLabelWithTooltip = (label, tooltip) => (
    <span>
      {label}{" "}
      <Tooltip title={tooltip}>
        <InfoCircleOutlined />
      </Tooltip>
    </span>
  );

  const getAccounts = useCallback(() => {
    const url = `${SERVER_IP}account`;
    dispatch(getApi("GET_ACCOUNT_BOOKS", url));
  }, [dispatch]);

  useEffect(() => {
    if (editDeal) {
      const patchedValues = {
        ...editDeal,
        closing_date: dayjs(editDeal.closing_date).isValid()
          ? dayjs(editDeal.closing_date)
          : null,
      };
      form.setFieldsValue(patchedValues);
    } else {
      form?.resetFields();
    }
  }, [editDeal, form]);

  const handleSubmit = (values) => {
    const data = { ...values };
    if (!editDeal) {
      dispatch(postApi(data, "ADD_DEAL", `${SERVER_IP}deals`));
    } else {
      dispatch(putApi(data, "EDIT_DEAL", `${SERVER_IP}deals/${editDeal.id}`));
    }
  };

  useEffect(() => {
    if (
      globalRedux.apiStatus.ADD_DEAL === "SUCCESS" ||
      globalRedux.apiStatus.EDIT_DEAL === "SUCCESS"
    ) {
      dispatch(resetApiStatus(editDeal ? "EDIT_DEAL" : "ADD_DEAL"));
      refreshList?.();
      handleClose?.();
      form?.resetFields();
    }
  }, [globalRedux.apiStatus]);

  const loading =
    globalRedux.apiStatus.ADD_DEAL === API_STATUS.PENDING ||
    globalRedux.apiStatus.EDIT_DEAL === API_STATUS.PENDING;

  useEffect(() => {
    if (globalRedux?.accountBooks) {
      const value = globalRedux.accountBooks.map((item) => ({
        label: item?.account_name,
        value: item?.id,
      }));
      originalAccountList.current = value;
      setAccountDropDownValue(value);
    }
  }, [globalRedux?.accountBooks]);

  useEffect(() => {
    if (globalRedux.apiStatus.ADD_ACCOUNT_BOOK === "SUCCESS") {
      dispatch(resetApiStatus("ADD_ACCOUNT_BOOK"));
      getAccounts?.();
      setAddnewModalVisible(false);
      form1?.resetFields();
      if (accountSearchvalue) {
        const newlyAdded = globalRedux?.accountBooks?.find(
          (a) =>
            a.account_name?.toLowerCase() === accountSearchvalue?.toLowerCase()
        );
        if (newlyAdded) {
          form.setFieldsValue({ account_name: newlyAdded.id });
        }
      }
    }
  }, [globalRedux.apiStatus]);

  const handleTypeSearch = (value) => {
    setAccountSearchValue(value);
    const filtered = originalAccountList.current.filter((type) =>
      type.label.toLowerCase().includes(value.toLowerCase())
    );
    setAccountDropDownValue(filtered);

    const exactMatch = filtered.some(
      (type) => type.label.toLowerCase() === value.toLowerCase()
    );
    setAddNewButtonVisible(!exactMatch && value.trim() !== "");
  };

  // Debounce function
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedSearch = useCallback(debounce(handleTypeSearch, 300), []);

  const handleNewAcountName = () => {
    setAddnewModalVisible(true);
  };

  const handleSubmitAccount = () => {
    const value = form1.getFieldsValue();
    dispatch(postApi(value, "ADD_ACCOUNT_BOOK"));
  };

  const handleDrawerClose = () => {
    setAccountDropDownValue(originalAccountList.current);
    setAccountSearchValue("");
    setAddNewButtonVisible(false);
    setDealAddModal(false);
  };

  return (
    <Drawer
      placement="right"
      title={`${editDeal ? "Edit" : "New"} Deal`}
      width={width}
      open={dealAddModal}
      closable
      onClose={handleDrawerClose}
      destroyOnClose
      size="large"
    >
      <Form
        form={form}
        name="add-deal"
        layout="vertical"
        onFinish={handleSubmit}
      >
        <div style={{ fontWeight: "bold", marginBottom: 16 }}>
          Lead Information
        </div>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Deal Owner" name="deal_owner_name">
              <Input placeholder="Enter owner name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Amount" name="amount">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Deal Name"
              name="deal_name"
              rules={[{ required: true, message: "Required!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Closing Date"
              name="closing_date"
              rules={[{ required: true, message: "Required!" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Account Name" name="account_name">
              <Select
                showSearch
                placeholder="Select Account"
                onSearch={debouncedSearch}
                filterOption={false}
                onChange={(value) =>
                  form.setFieldsValue({ account_name: value })
                }
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    {addNewButtonVisible && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 16px",
                          backgroundColor: "#f6f8fa",
                          borderTop: "1px solid #e8e8e8",
                          cursor: "pointer",
                          color: "#1890ff",
                          fontWeight: "500",
                        }}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          if (accountSearchvalue) handleNewAcountName();
                        }}
                      >
                        <span>Add New Account Name</span>
                      </div>
                    )}
                  </>
                )}
              >
                {accountDropdownValue.map((type) => (
                  <Select.Option key={type?.value} value={type?.value}>
                    {type?.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Stage"
              name="stage"
              rules={[{ required: true, message: "Required!" }]}
            >
              <Select>
                {DEAL_STAGE.map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Type" name="type">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Probability (%)" name="probability">
              <InputNumber min={0} max={100} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Next Step" name="next_step">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Expected Revenue" name="expected_revenue">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Lead Source" name="lead_resource">
              <Select placeholder="Select Lead Source">
                {LEAD_SOURCE.map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Campaign Source" name="campaign_source">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Contact Name" name="contact_name">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ fontWeight: "bold", marginBottom: 16, marginTop: 16 }}>
          Description Information
        </div>
        <Form.Item label="Description" name="description">
          <TextArea placeholder="Description" />
        </Form.Item>

        <Form.Item>
          <Row gutter={16} justify="space-between" style={{ margin: "16px 0" }}>
            <Col span={12}>
              <Button danger block onClick={handleDrawerClose}>
                Cancel
              </Button>
            </Col>
            <Col span={12}>
              <Button type="primary" htmlType="submit" loading={loading} block>
                {editDeal ? "Update" : "Save"}
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>

      <Modal
        open={addNewModalVisible}
        title="Quick Create: Account"
        okText="Save"
        onCancel={() => setAddnewModalVisible(false)}
        onOk={() => form1.submit()}
      >
        <Form form={form1} layout="vertical" onFinish={handleSubmitAccount}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={renderLabelWithTooltip(
                  "Account Owner",
                  "Person responsible for this account"
                )}
                name="account_owner_name"
                rules={[{ required: true, message: "Please enter account owner name" }]}
              >
                <Input placeholder="Account Owner Name" autoFocus />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={renderLabelWithTooltip("Rating", "Internal engagement score")}
                name="rating"
                rules={[{ required: true, message: "Please select a rating" }]}
              >
                <Select placeholder="Select Rating">
                  {RATING.map((r) => (
                    <Select.Option key={r} value={r}>
                      {r}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={renderLabelWithTooltip("Account Name", "Registered name of the account")}
                name="account_name"
                rules={[{ required: true, message: "Please enter account name" }]}
              >
                <Input placeholder="Enter the Account Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={renderLabelWithTooltip("Phone", "Primary contact number")}
                name="phone"
                rules={[
                  { required: true, message: "Please enter phone number" },
                  {
                    pattern: /^\d{10}$/,
                    message: "Phone number must be 10 digits",
                  },
                ]}
              >
                <Input placeholder="Enter the Phone Number" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Drawer>
  );
};

export default AddDeal;
