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

const AddContact = ({
  contactAddModal,
  width = "50%",
  editContact,
  setContactAddModal,
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
    if (editContact) {
      form.setFieldsValue({
        category: editContact?.category || "Individual",
        displayName: editContact?.displayName,
        mobile: editContact?.mobile,
        secondaryMobile: editContact?.secondaryMobile,
        openingBalance: editContact?.openingBalance,
        email: editContact?.email,
        panCard: editContact?.panCard,
        aadharCard: editContact?.aadharCard,
        gstTreatment: editContact?.gstTreatment || GST_TREATMENT[0]?.value,
        gstin: editContact?.gstin,
        placeOfSupply: editContact?.placeOfSupply || PLACE_OF_SUPPLY[0],
        addressLine1: editContact?.billingDetails?.[0]?.addressLine1,
        addressLine2: editContact?.billingDetails?.[0]?.addressLine2,
        city: editContact?.billingDetails?.[0]?.city,
        pincode: editContact?.billingDetails?.[0]?.pincode,
      });
      setGstTreatment(editContact?.gstTreatment);
    } else {
      form?.resetFields();
    }
  }, [editContact, form]);

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

    if (!editContact) {
      dispatch(postApi(data, "ADD_LEAD"));
    } else {
      let url = `${SERVER_IP}customer/${editContact._id}?orgId=${globalRedux?.selectedOrganization?._id}`;
      dispatch(putApi(data, "EDIT_LEAD", url));
    }
  };

  useEffect(() => {
    if (
      globalRedux.apiStatus.ADD_LEAD === "SUCCESS" ||
      globalRedux.apiStatus.EDIT_LEAD === "SUCCESS"
    ) {
      dispatch(resetApiStatus(editContact ? "EDIT_LEAD" : "ADD_LEAD"));
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
        initialValues={{
          category: "Individual",
          gstTreatment,
          placeOfSupply: PLACE_OF_SUPPLY[0],
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: 16 }}>
          Contact Information
        </div>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Contact Owner" name="contactowner">
              <Select placeholder="Select Contact">
                {CATEGORIES.map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
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
            <Form.Item label="Account Name" name="acountname">
              <Input maxLength={10} placeholder="Enter account number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Vendor Name" name="vndorname">
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
            <Form.Item label="Other Phone" name="otherphone">
              <Input placeholder="Enter Phone number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Home Phone" name="homephone">
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
            <Form.Item label="Assistant" name="assitant">
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
            <Form.Item label="Skype ID" name="skypeid">
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
            <Form.Item label="Reporting To" name="reportingto">
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
              <Input/>
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
            <Form.Item label="Mailing Zip Code" name="mailing_zipcode">
              <Input  />
            </Form.Item>
          </Col>
		  <Col span={12}>
            <Form.Item label="Other Zip Code" name="other_zipcode">
              <Input  />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Mailing Country" name="mailing_country">
              <Input  />
            </Form.Item>
          </Col>
		   <Col span={12}>
            <Form.Item label="Other Country" name="other_country">
              <Input  />
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
