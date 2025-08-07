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
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { putApi } from "redux/sagas/putApiSaga";
import {
  API_STATUS,
  CATEGORIES,
  CUSTOMER_TYPE,
  GST_TREATMENT,
  INDUSTRY,
  LEAD_SOURCE,
  LEAD_STATUS,
  PLACE_OF_SUPPLY,
  RATING,
  STATUS_VALUE,
} from "constants/app-constants";
import { SERVER_IP } from "assets/Config";
import { postApi } from "redux/sagas/postApiDataSaga";
import { resetApiStatus } from "redux/reducers/globals/globalActions";
import { Checkbox } from "antd";

const AddLead = ({
  leadAddModal,
  width = "50%",
  editLead,
  setLeadAddModal,
  refreshList,
  handleClose,
}) => {
  const [gstTreatment, setGstTreatment] = React.useState(
    GST_TREATMENT[0]?.value
  );
  const [form] = Form.useForm();
  const globalRedux = useSelector((state) => state.globalRedux);
  const dispatch = useDispatch();
  const { TextArea } = Input;

  const isConsumer = React.useMemo(
    () => gstTreatment === GST_TREATMENT[0]?.value,
    [gstTreatment]
  );

  useEffect(() => {
    if (isConsumer) {
      form.setFieldsValue({ gstin: "" });
    }
  }, [gstTreatment, form, isConsumer]);

  useEffect(() => {
    if (editLead) {
      form.setFieldsValue(editLead);
    } else {
      form?.resetFields();
    }
  }, [editLead, form]);

  const handleSubmit = (values) => {
    const data = {
      ...values,
    };
    if (!editLead) {
      let url = `${SERVER_IP}leads`;
      dispatch(postApi(data, "ADD_LEAD", url));
    } else {
      let url = `${SERVER_IP}leads/${editLead.id}`;
      dispatch(putApi(data, "EDIT_LEAD", url));
    }
  };

  useEffect(() => {
    if (
      globalRedux.apiStatus.ADD_LEAD === "SUCCESS" ||
      globalRedux.apiStatus.EDIT_LEAD === "SUCCESS"
    ) {
      dispatch(resetApiStatus(editLead ? "EDIT_LEAD" : "ADD_LEAD"));
      refreshList?.();
      handleClose?.();
      form?.resetFields();
    }
  }, [globalRedux.apiStatus]);

  const loading =
    globalRedux.apiStatus.ADD_LEAD === API_STATUS.PENDING ||
    globalRedux.apiStatus.EDIT_LEAD === API_STATUS.PENDING;

  return (
    <Drawer
      placement="right"
      title={`${editLead ? "Edit" : "New"} Lead`}
      width={width}
      open={leadAddModal}
      closable
      onClose={() => setLeadAddModal(false)}
      destroyOnClose
      size="large"
    >
      <Form
        form={form}
        name="add-lead"
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          category: "Individual",
          gstTreatment,
          placeOfSupply: PLACE_OF_SUPPLY[0],
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: 16 }}>
          Lead Information
        </div>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Lead Owner" name="lead_owner_name">
              <Input placeholder="Enter owner name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Company Name"
              name="company_name"
              rules={[{ required: true, message: "Required!" }]}
            >
              <Input placeholder="Enter company name" />
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
            <Form.Item label="Title" name="title">
              <Input maxLength={10} placeholder="Enter title number" />
            </Form.Item>
          </Col>
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
              <Input />
            </Form.Item>
          </Col>
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
              <Input maxLength={10} placeholder="Enter phone number" />
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
            <Form.Item
              label="Website"
              name="website"
              rules={[
                {
                  pattern:
                    /^(https?:\/\/)?([\w\d-]+\.){1,}[\w]{2,}(\/[\w\d#?&%=.-]*)*\/?$/,
                  message: "Please enter a valid website URL",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Industry" name="industry">
              <Select placeholder="Select industry">
                {INDUSTRY.map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="No.of Employees" name="no_of_employees">
              <Input />
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
            <Form.Item label="Address Line 1" name="address_line_one">
              <Input placeholder="Address line 1" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Address Line 2" name="address_line_two">
              <Input placeholder="Address line 2" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="City" name="city">
              <Input placeholder="City" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="State" name="state">
              <Input placeholder="State" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Zip Code"
              name="zip_code"
              rules={[
                {
                  pattern: /^\d{5,6}$/,
                  message: "Zip Code must be 5 or 6 digits",
                },
              ]}
            >
              <Input placeholder="Zip code" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Country" name="country">
              <Input placeholder="country" />
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
              <Button danger block onClick={() => setLeadAddModal(false)}>
                Cancel
              </Button>
            </Col>
            <Col span={12}>
              <Button type="primary" htmlType="submit" loading={loading} block>
                {editLead ? "Update" : "Save"}
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddLead;
