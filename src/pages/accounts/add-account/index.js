import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Form,
  Select,
  Drawer,
  Tooltip,
  Checkbox,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { putApi } from "redux/sagas/putApiSaga";
import {
  ACCOUNT_INDUSTRY,
  ACCOUNT_TYPE,
  API_STATUS,
  OWNERSHIP,
  RATING,
} from "constants/app-constants";
import { SERVER_IP } from "assets/Config";
import { postApi } from "redux/sagas/postApiDataSaga";
import { resetApiStatus } from "redux/reducers/globals/globalActions";

const { TextArea } = Input;

const AddAccount = ({
  accountAddModal,
  width = "50%",
  editAccount,
  setAccountAddModal,
  refreshList,
  handleClose,
}) => {
  const [form] = Form.useForm();
  const globalRedux = useSelector((state) => state.globalRedux);
  const loginRedux = useSelector((state) => state.loginRedux);
  const dispatch = useDispatch();
  const [sameAsBilling, setSameAsBilling] = useState(false);

  useEffect(() => {
    if (editAccount) {
      form.setFieldsValue(editAccount);
    } else {
      form.resetFields();
    }
  }, [editAccount, form]);

  const handleSubmit = (values) => {
    const payload = {
      ...values,
      account_owner_id: loginRedux?.id,
      orgId: globalRedux?.selectedOrganization?.id,
    };

    if (!editAccount) {
      dispatch(postApi(payload, "ADD_ACCOUNT_BOOK"));
    } else {
      const url = `${SERVER_IP}account/${editAccount?.id}`;
      dispatch(putApi(payload, "EDIT_ACCOUNT_BOOK", url));
    }
  };

  useEffect(() => {
    if (
      globalRedux.apiStatus.ADD_ACCOUNT_BOOK === "SUCCESS" ||
      globalRedux.apiStatus.EDIT_ACCOUNT_BOOK === "SUCCESS"
    ) {
      dispatch(
        resetApiStatus(editAccount ? "EDIT_ACCOUNT_BOOK" : "ADD_ACCOUNT_BOOK")
      );
      refreshList?.();
      handleClose?.();
      form?.resetFields();
      setSameAsBilling(false);
    }
  }, [globalRedux.apiStatus]);

  const loading =
    globalRedux.apiStatus.ADD_ACCOUNT_BOOK === API_STATUS.PENDING ||
    globalRedux.apiStatus.EDIT_ACCOUNT_BOOK === API_STATUS.PENDING;

  const renderLabelWithTooltip = (label, tooltip) => (
    <span>
      {label}{" "}
      <Tooltip title={tooltip}>
        <InfoCircleOutlined />
      </Tooltip>
    </span>
  );

  const handleCopyBillingToShipping = () => {
    const {
      billing_street,
      billing_city,
      billing_state,
      billing_zip_code,
      billing_country,
    } = form.getFieldsValue([
      "billing_street",
      "billing_city",
      "billing_state",
      "billing_zip_code",
      "billing_country",
    ]);

    form.setFieldsValue({
      shipping_street: billing_street,
      shipping_city: billing_city,
      shipping_state: billing_state,
      shipping_zip_code: billing_zip_code,
      shipping_country: billing_country,
    });
  };

  const handleShippingChange = () => {
    if (sameAsBilling) setSameAsBilling(false);
  };

  const handleResetShipping = () => {
    form.setFieldsValue({
      shipping_street: "",
      shipping_city: "",
      shipping_state: "",
      shipping_zip_code: "",
      shipping_country: "",
    });
    setSameAsBilling(false);
  };
  return (
    <Drawer
      placement="right"
      title={`${editAccount ? "Edit" : "New"} Account`}
      width={width}
      open={accountAddModal}
      closable
      onClose={() => setAccountAddModal(false)}
      destroyOnClose
      size="large"
    >
      <Form
        form={form}
        layout="vertical"
        name="add-account"
        onFinish={handleSubmit}
        initialValues={{
          account_owner_name: loginRedux?.display_name,
        }}
        scrollToFirstError={{
          behavior: "smooth",
          block: "center",
          inline: "center",
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: 16 }}>
          Account Information
        </div>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={renderLabelWithTooltip(
                "Account Owner",
                "Person responsible for this account"
              )}
              name="account_owner_name"
              rules={[
                { required: true, message: "Please enter account owner name" },
              ]}
              
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={renderLabelWithTooltip(
                "Account Name",
                "Registered name of the account"
              )}
              name="account_name"
              rules={[{ required: true, message: "Please enter account name" }]}
            >
              <Input />
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
              <Input />
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
              <Input placeholder="e.g., https://example.com" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Employees" name="employees">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ fontWeight: "bold", margin: "24px 0 8px" }}>
          Address Information
        </div>

        <Form.Item>
          <Checkbox
            checked={sameAsBilling}
            onChange={(e) => {
              const checked = e.target.checked;
              setSameAsBilling(checked);
              if (checked) handleCopyBillingToShipping();
            }}
          >
            Shipping address same as billing address
          </Checkbox>
        </Form.Item>

        {!sameAsBilling && (
          <Button type="dashed" size="small" onClick={handleResetShipping}>
            Reset Shipping Address from Billing
          </Button>
        )}

        <Row gutter={16} style={{ marginTop: 12 }}>
          <Col span={12}>
            <Form.Item label="Billing Street" name="billing_street">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Shipping Street" name="shipping_street">
              <Input onChange={handleShippingChange} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Billing City" name="billing_city">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Shipping City" name="shipping_city">
              <Input onChange={handleShippingChange} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Billing State" name="billing_state">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Shipping State" name="shipping_state">
              <Input onChange={handleShippingChange} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Billing Zip Code"
              name="billing_zip_code"
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
              label="Shipping Zip Code"
              name="shipping_zip_code"
              rules={[
                {
                  pattern: /^\d{5,6}$/,
                  message: "Zip Code must be 5 or 6 digits",
                },
              ]}
            >
              <Input onChange={handleShippingChange} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Billing Country" name="billing_country">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Shipping Country" name="shipping_country">
              <Input onChange={handleShippingChange} />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ fontWeight: "bold", marginTop: 24 }}>Description</div>
        <Form.Item name="description">
          <TextArea
            rows={4}
            placeholder="Add description or notes for follow-up"
          />
        </Form.Item>

        <Row gutter={16} style={{ marginTop: 24 }}>
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
      </Form>
    </Drawer>
  );
};

export default AddAccount;
