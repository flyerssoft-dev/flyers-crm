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
      form.setFieldsValue({
        category: editLead?.category || "Individual",
        displayName: editLead?.displayName,
        mobile: editLead?.mobile,
        secondaryMobile: editLead?.secondaryMobile,
        openingBalance: editLead?.openingBalance,
        email: editLead?.email,
        panCard: editLead?.panCard,
        aadharCard: editLead?.aadharCard,
        gstTreatment: editLead?.gstTreatment || GST_TREATMENT[0]?.value,
        gstin: editLead?.gstin,
        placeOfSupply: editLead?.placeOfSupply || PLACE_OF_SUPPLY[0],
        addressLine1: editLead?.billingDetails?.[0]?.addressLine1,
        addressLine2: editLead?.billingDetails?.[0]?.addressLine2,
        city: editLead?.billingDetails?.[0]?.city,
        pincode: editLead?.billingDetails?.[0]?.pincode,
      });
      setGstTreatment(editLead?.gstTreatment);
    } else {
      form?.resetFields();
    }
  }, [editLead, form]);

  const handleSubmit = (values) => {
    let data = {
      orgId: globalRedux?.selectedOrganization?._id,
      type: CUSTOMER_TYPE[2] || "",
      category: values?.category,
      displayName: values?.displayName || "",
      email: values?.email || "",
      mobile: values?.mobile || "",
      secondaryMobile: values?.secondaryMobile || "",
      panCard: values?.panCard || "",
      aadharCard: values?.aadharCard || "",
      gstTreatment: values?.gstTreatment || "",
      gstin: values?.gstin || "",
      openingBalance: values?.openingBalance || 0,
      billingDetails: [
        {
          addressLine1: values?.addressLine1 || "",
          addressLine2: values?.addressLine2 || "",
          city: values?.city || "",
          pincode: values?.pincode || "",
        },
      ],
      placeOfSupply: values?.placeOfSupply || "",
      remarks: values?.remarks || "",
    };

    if (!editLead) {
      dispatch(postApi(data, "ADD_LEAD"));
    } else {
      let url = `${SERVER_IP}customer/${editLead._id}?orgId=${globalRedux?.selectedOrganization?._id}`;
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
            <Form.Item label="Lead Owner" name="leadowner">
              <Select placeholder="Select lead">
                {CATEGORIES.map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Company Name"
              name="companyname"
              rules={[{ required: true, message: "Required!" }]}
            >
              <Input placeholder="Enter company name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="First Name" name="firstname">
              <Input placeholder="Enter first name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Last Name"
              name="lastname"
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
            <Form.Item label="Email" name="email">
              <Input maxLength={10} placeholder="Enter email" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Phone" name="phone">
              <Input maxLength={10} placeholder="Enter phone number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Fax" name="fax">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Mobile" name="mobile">
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Enter mobile number"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Website" name="website">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Lead Source" name="leadsource">
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
            <Form.Item label="Lead Status" name="leadstatus">
              <Select placeholder="Select Lead Status">
                {LEAD_STATUS.map((type) => (
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
          <Col span={12}>
            <Form.Item label="No.of Employees" name="noofemployees">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Annual Revenue" name="annualrevenue">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Rating" name="rating">
              <Select>
                {RATING.map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="email_opt_out" valuePropName="checked">
              <Checkbox>Email Opt Out</Checkbox>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Skype ID" name="skypeid">
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
            <Form.Item label="Twitter" name="twitter">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ fontWeight: "bold", marginBottom: 16 }}>
          Address Information
        </div>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Address Line 1" name="addressLine1">
              <Input placeholder="Address line 1" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Address Line 2" name="addressLine2">
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
            <Form.Item label="Zip Code" name="zipcode">
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
