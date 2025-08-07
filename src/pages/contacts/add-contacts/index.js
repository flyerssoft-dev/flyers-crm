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
  Modal,
  Tooltip,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { putApi } from "redux/sagas/putApiSaga";
import {
  API_STATUS,
  LEAD_SOURCE,
  RATING,
  STATUS_VALUE,
} from "constants/app-constants";
import { SERVER_IP } from "assets/Config";
import { postApi } from "redux/sagas/postApiDataSaga";
import { resetApiStatus } from "redux/reducers/globals/globalActions";
import { Checkbox } from "antd";
import dayjs from "dayjs";
import { getApi } from "redux/sagas/getApiDataSaga";
import { InfoCircleOutlined } from "@ant-design/icons";

const AddContact = ({
  contactAddModal,
  width = "50%",
  editContact,
  setContactAddModal,
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
    if (editContact) {
      const patchedValues = {
        ...editContact,
        date_of_birth: dayjs(editContact.date_of_birth).isValid()
          ? dayjs(editContact.date_of_birth)
          : null,
      };
      getAccounts();
      form.setFieldsValue(patchedValues);
    } else {
      getAccounts();
      form?.resetFields();
    }
  }, [editContact, form]);

  const handleSubmit = (values) => {
    let data = {
      ...values,
    };

    if (!editContact) {
      let url = `${SERVER_IP}contact`;
      dispatch(postApi(data, "ADD_CONTACT", url));
    } else {
      let url = `${SERVER_IP}contact/${editContact.id}`;
      dispatch(putApi(data, "EDIT_CONTACT", url));
    }
  };

  useEffect(() => {
    if (
      globalRedux.apiStatus.ADD_CONTACT === "SUCCESS" ||
      globalRedux.apiStatus.EDIT_CONTACT === "SUCCESS"
    ) {
      dispatch(resetApiStatus(editContact ? "EDIT_CONTACT" : "ADD_CONTACT"));
      refreshList?.();
      handleClose?.();
      form?.resetFields();
    }
  }, [globalRedux.apiStatus]);

  const loading =
    globalRedux.apiStatus.ADD_CONTACT === API_STATUS.PENDING ||
    globalRedux.apiStatus.EDIT_CONTACT === API_STATUS.PENDING;

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
        const newlyAdded = globalRedux.accountBooks?.find(
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
  return (
    <Drawer
      placement="right"
      title={`${editContact ? "Edit" : "New"} Lead`}
      width={width}
      open={contactAddModal}
      closable
      onClose={() => setContactAddModal(false)}
      destroyOnClose
      size="large"
    >
      <Form
        form={form}
        name="add-Contact"
        layout="vertical"
        onFinish={handleSubmit}
      >
        <div style={{ fontWeight: "bold", marginBottom: 16 }}>
          Contact Information
        </div>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Contact Owner" name="contact_owner_name">
              <Input placeholder="Enter contact owner name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="First Name" name="first_name">
              <Input placeholder="Enter first name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Last Name"
              name="last_name"
              rules={[{ required: true, message: "Required!" }]}
            >
              <Input placeholder="Enter last name" />
            </Form.Item>
          </Col>
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
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  type: "email",
                  message: "Please enter a valid email address",
                },
              ]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Title" name="title">
              <Input placeholder="Enter title" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[
                {
                  pattern: /^\d{10}$/,
                  message: "Phone number must be exactly 10 digits",
                },
              ]}
            >
              <Input
                style={{ width: "100%" }}
                placeholder="Enter phone number"
                maxLength={10}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Department" name="department">
              <Input placeholder="Enter Department" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Mobile"
              name="mobile"
              rules={[
                {
                  pattern: /^\d{10}$/,
                  message: "Mobile number must be exactly 10 digits",
                },
              ]}
            >
              <Input maxLength={10} placeholder="Enter mobile number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="LinkedIn Profile" name="linkedin_profile">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}></Col>
          <Col span={12}>
            <Form.Item label="Secondary Email" name="secondary_email">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}></Col>
          <Col span={12}>
            <Form.Item label="Time Zone" name="time_zone">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}></Col>
          <Col span={12}>
            <Form.Item label="Status" name="Status">
              <Select>
                {STATUS_VALUE.map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <div style={{ fontWeight: "bold", marginBottom: 16 }}>
          Address Information
        </div>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Mailing Street" name="mailing_street">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Other Street" name="other_street">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Mailing City" name="mailing_city">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Other City" name="other_city">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Mailing State" name="mailing_state">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Other State" name="other_state">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Mailing Zip Code"
              name="mailing_zip_code"
              rules={[
                {
                  pattern: /^\d{5,6}$/,
                  message: "Zip Code must be 5 or 6 digits",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Other Zip Code"
              name="other_zip_code"
              rules={[
                {
                  pattern: /^\d{5,6}$/,
                  message: "Zip Code must be 5 or 6 digits",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Mailing Country" name="mailing_country">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Other Country" name="other_country">
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
          <Row
            gutter={16}
            justify="space-between"
            style={{ marginTop: 16, marginBottom: 16 }}
          >
            <Col span={12}>
              <Button danger block onClick={() => setContactAddModal(false)}>
                Cancel
              </Button>
            </Col>
            <Col span={12}>
              <Button type="primary" htmlType="submit" loading={loading} block>
                {editContact ? "Update" : "Save"}
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
                rules={[
                  {
                    required: true,
                    message: "Please enter account owner name",
                  },
                ]}
              >
                <Input placeholder="Account Owner Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={renderLabelWithTooltip(
                  "Rating",
                  "Internal engagement score"
                )}
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
                label={renderLabelWithTooltip(
                  "Account Name",
                  "Registered name of the account"
                )}
                name="account_name"
                rules={[
                  { required: true, message: "Please enter account name" },
                ]}
              >
                <Input placeholder="Enter the Account Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={renderLabelWithTooltip(
                  "Phone",
                  "Primary contact number"
                )}
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

export default AddContact;
