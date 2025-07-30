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
  DEAL_STAGE,
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
import dayjs from "dayjs";

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
    const data = {
      ...values,
    };
    if (!editDeal) {
      let url = `${SERVER_IP}deals`;
      dispatch(postApi(data, "ADD_DEAL", url));
    } else {
      let url = `${SERVER_IP}deals/${editDeal.id}`;
      dispatch(putApi(data, "EDIT_DEAL", url));
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

  return (
    <Drawer
      placement="right"
      title={`${editDeal ? "Edit" : "New"} Deal`}
      width={width}
      open={dealAddModal}
      closable
      onClose={() => setDealAddModal(false)}
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
              <Input />
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
            <Form.Item
              label="Account Name"
              name="account_name"
              rules={[{ required: true, message: "Required!" }]}
            >
              <Input />
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
              <Input />
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
              <Input />
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
          <Row
            gutter={16}
            justify="space-between"
            style={{ marginTop: 16, marginBottom: 16 }}
          >
            <Col span={12}>
              <Button danger block onClick={() => setDealAddModal(false)}>
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
    </Drawer>
  );
};

export default AddDeal;
