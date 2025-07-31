import React, { useEffect } from "react";
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
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { putApi } from "redux/sagas/putApiSaga";
import { API_STATUS, LEAD_SOURCE } from "constants/app-constants";
import { SERVER_IP } from "assets/Config";
import { postApi } from "redux/sagas/postApiDataSaga";
import { resetApiStatus } from "redux/reducers/globals/globalActions";
import { Checkbox } from "antd";
import dayjs from "dayjs";

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

  useEffect(() => {
    if (editContact) {
      const patchedValues = {
        ...editContact,
        date_of_birth: dayjs(editContact.date_of_birth).isValid()
          ? dayjs(editContact.date_of_birth)
          : null,
      };

      form.setFieldsValue(patchedValues);
    } else {
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
            <Form.Item label="Lead Source" name="lead_source">
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
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Account Name" name="account_name">
              <Input maxLength={10} placeholder="Enter account number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Vendor Name" name="vendor_name">
              <Input placeholder="Enter vendor name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Email" name="email">
              <Input maxLength={10} placeholder="Enter email" />
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
            <Form.Item label="Phone" name="phone">
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Enter phone number"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Department" name="department">
              <Input placeholder="Enter Department" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Other Phone" name="other_phone">
              <Input placeholder="Enter Phone number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Home Phone" name="home_phone">
              <Input placeholder="Enter Phone number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Mobile" name="mobile">
              <Input placeholder="Enter mobile number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Fax" name="fax">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Assistant" name="assistant">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Date of Birth" name="date_of_birth">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}></Col>
          <Col span={12}>
            <Form.Item name="email_opt_out" valuePropName="checked">
              <Checkbox>Email Opt Out</Checkbox>
            </Form.Item>
          </Col>
          <Col span={12}></Col>
          <Col span={12}>
            <Form.Item label="Skype ID" name="skype_id">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}></Col>
          <Col span={12}>
            <Form.Item label="Secondary Email" name="secondary_email">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}></Col>
          <Col span={12}>
            <Form.Item label="Twitter" name="twitter">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}></Col>
          <Col span={12}>
            <Form.Item label="Reporting To" name="reporting_to">
              <Input />
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
            <Form.Item label="Mailing Zip Code" name="mailing_zip_code">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Other Zip Code" name="other_zip_code">
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
    </Drawer>
  );
};

export default AddContact;
