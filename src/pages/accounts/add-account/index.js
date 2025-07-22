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
  ACCOUNT_INDUSTRY,
  ACCOUNT_TYPE,
  API_STATUS,
  CATEGORIES,
  CUSTOMER_TYPE,
  GST_TREATMENT,
  OWNERSHIP,
  PLACE_OF_SUPPLY,
  RATING,
} from "constants/app-constants";
import { SERVER_IP } from "assets/Config";
import { postApi } from "redux/sagas/postApiDataSaga";
import { resetApiStatus } from "redux/reducers/globals/globalActions";
import { Checkbox } from "antd";

const AddAccount = ({
  accountAddModal,
  width = "50%",
  editAccount,
  setAccountAddModal,
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
    if (editAccount) {
      form.setFieldsValue({
        category: editAccount?.category || "Individual",
        displayName: editAccount?.displayName,
        mobile: editAccount?.mobile,
        secondaryMobile: editAccount?.secondaryMobile,
        openingBalance: editAccount?.openingBalance,
        email: editAccount?.email,
        panCard: editAccount?.panCard,
        aadharCard: editAccount?.aadharCard,
        gstTreatment: editAccount?.gstTreatment || GST_TREATMENT[0]?.value,
        gstin: editAccount?.gstin,
        placeOfSupply: editAccount?.placeOfSupply || PLACE_OF_SUPPLY[0],
        addressLine1: editAccount?.billingDetails?.[0]?.addressLine1,
        addressLine2: editAccount?.billingDetails?.[0]?.addressLine2,
        city: editAccount?.billingDetails?.[0]?.city,
        pincode: editAccount?.billingDetails?.[0]?.pincode,
      });
      setGstTreatment(editAccount?.gstTreatment);
    } else {
      form?.resetFields();
    }
  }, [editAccount, form]);

  const handleSubmit = (values) => {
    let data = {
      orgId: globalRedux?.selectedOrganization?.id,
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

    if (!editAccount) {
      dispatch(postApi(data, "ADD_LEAD"));
    } else {
      let url = `${SERVER_IP}customer/${editAccount._id}?orgId=${globalRedux?.selectedOrganization?.id}`;
      dispatch(putApi(data, "EDIT_LEAD", url));
    }
  };

  useEffect(() => {
    if (
      globalRedux.apiStatus.ADD_LEAD === "SUCCESS" ||
      globalRedux.apiStatus.EDIT_LEAD === "SUCCESS"
    ) {
      dispatch(resetApiStatus(editAccount ? "EDIT_LEAD" : "ADD_LEAD"));
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
      title={`${editAccount ? "Edit" : "New"} Lead`}
      width={width}
      open={accountAddModal}
      closable
      onClose={() => setAccountAddModal(false)}
      destroyOnClose
      size="large"
    >
      <Form
        form={form}
        name="add-Account"
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          category: "Individual",
          gstTreatment,
          placeOfSupply: PLACE_OF_SUPPLY[0],
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: 16 }}>
          Account Information
        </div>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Account Owner" name="accountowner">
              <Select placeholder="Select Account owner">
                {CATEGORIES.map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Rating" name="rating">
              <Select placeholder="Select rating">
                {RATING.map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Account Name"
              name="accountname"
              rules={[{ required: true, message: "Required!" }]}
            >
              <Input placeholder="Enter account name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Phone" name="phone">
              <Input placeholder="Enter phone number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Account site" name="account site">
              <Input placeholder="Enter account site" />
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
            <Form.Item label="Parent Account" name="parentaccount">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Website" name="website">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Account Number" name="accountnumber">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Ticker Symbol" name="tickersymbol">
              <Input/>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Account Type" name="accounttype">
              <Select>
                {ACCOUNT_TYPE.map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Ownership" name="ownership">
              <Select>
                {OWNERSHIP.map((type) => (
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
                {ACCOUNT_INDUSTRY.map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Employees" name="employees">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Annual Revenue" name="annualrevenue">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="SIC code" name="siccode">
             <Input />
            </Form.Item>
          </Col>
        </Row>
        <div style={{ fontWeight: "bold", marginBottom: 16 }}>
          Address Information
        </div>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Billing Street" name="billingstreet">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Shipping Street" name="shippingstreet">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Billing City" name="billingcity">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Shipping City" name="shippingcity">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Billing State" name="billingstate">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Shipping State" name="shippingstate">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Billing Code" name="billingcode">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Shipping Code" name="shippingcode">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Billing Country" name="billingcountry">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Shipping Country" name="shippingcountry">
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
              <Button danger block onClick={() => setAccountAddModal(false)}>
                Cancel
              </Button>
            </Col>
            <Col span={12}>
              <Button type="primary" htmlType="submit" loading={loading} block>
                {editAccount ? "Update" : "Save"}
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddAccount;
