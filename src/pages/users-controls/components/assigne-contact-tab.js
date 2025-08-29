// components/AssignContactTab.js
import React, { useCallback, useEffect, useState } from "react";
import { Table, Button, Modal, Form, Select, message, Space } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { getApi } from "redux/sagas/getApiDataSaga";
import { useDispatch, useSelector } from "react-redux";
import { SERVER_IP } from "assets/Config";
import { postApi } from "redux/sagas/postApiDataSaga";
import { putApi } from "redux/sagas/putApiSaga";
import { resetApiStatus } from "redux/reducers/globals/globalActions";

const { Option } = Select;

const AssignContactTab = ({ usersValue, phoneNumbers }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const contactRedux = useSelector((state) => state.contactRedux);
  const globalRedux = useSelector((state) => state.globalRedux);
  const [editingContact, setEditingContact] = useState(null); // track editing row

  const getAssginedContactUserDetails = useCallback(() => {
    const url = `${SERVER_IP}user-contacts?page=1&limit=10&sort=asc`;
    dispatch(getApi("GET_USER_CONTACT", url));
  }, [dispatch]);

  useEffect(() => {
    getAssginedContactUserDetails();
  }, [getAssginedContactUserDetails]);

  useEffect(() => {
    if (isModalVisible && editingContact) {
      form.setFieldsValue({
        userId: editingContact.userId,
        phone: editingContact.phone,
      });
    }
  }, [isModalVisible, editingContact, form]);

  useEffect(() => {
    if (globalRedux.apiStatus.UPDATE_CONTACT === "SUCCESS") {
      getAssginedContactUserDetails();
      handleCancel();
      dispatch(resetApiStatus("UPDATE_CONTACT"));
    }

    if (globalRedux.apiStatus.ASSIGN_CONTACT === "SUCCESS") {
      getAssginedContactUserDetails();
      handleCancel();
      dispatch(resetApiStatus("ASSIGN_CONTACT"));
    }
  }, [globalRedux.apiStatus, dispatch, getAssginedContactUserDetails]);

  const showModal = () => {
    setEditingContact(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingContact(null);
  };

  const handleSaveAssignment = async () => {
    try {
      const values = await form.validateFields();
      const user = usersValue.find((u) => u.id === values.userId);
      if (!user) {
        message.error("User not found");
        return;
      }

      const payload = {
        phone_number_id: values?.phone,
        employee_id: values?.userId,
        createrId: values?.userId,
        createrName: user?.display_name,
      };

      if (editingContact) {
        // 🔹 UPDATE existing assignment
        const url = `${SERVER_IP}user-contacts/${editingContact.id}`;
        dispatch(putApi(payload, "UPDATE_CONTACT", url));
        message.success("Contact assignment updated successfully");
      } else {
        // 🔹 CREATE new assignment
        const url = `${SERVER_IP}user-contacts`;
        dispatch(postApi(payload, "ASSIGN_CONTACT", url));
        message.success("Contact assigned successfully");
      }
    } catch (errorInfo) {
      console.error("Validation Failed:", errorInfo);
    }
  };
  const handleEdit = (record) => {
     console.log("Editing record:", record);
    setEditingContact(record);
    form.setFieldsValue({
      userId: record.userId,
      phone: record.phone,
    });
    setIsModalVisible(true);
  };

  const columnsUser = [
    { title: "Employee Name", dataIndex: "employeeName" },
    { title: "Phone Number", dataIndex: "phoneNumber" },
    { title: "Number Status", dataIndex: "status" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  // 🔹 transform contacts with both ID + display data
  const transformedContacts = contactRedux?.assginedContacts?.map(
    (item, index) => ({
      key: item.id || index,
      id: item.id,
      userId: item?.employee_details?.id,
      employeeName: item?.employee_details?.display_name,
      phone: item?.phone_numbers?.id,
      phoneNumber: item?.phone_numbers?.phone_number,
      status: item?.phone_numbers?.status,
    })
  );

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={showModal}
        style={{ marginBottom: 16 }}
      >
        Assign Phone Number
      </Button>

      <Table
        columns={columnsUser}
        dataSource={transformedContacts}
        pagination={false}
      />

      <Modal
        title={editingContact ? "Edit Assignment" : "Assign Phone Number"}
        open={isModalVisible}
        onOk={handleSaveAssignment}
        onCancel={handleCancel}
        okText={editingContact ? "Update" : "Assign"}
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="userId"
            label="Select User"
            rules={[{ required: true, message: "Please select a user" }]}
          >
            <Select placeholder="Select user">
              {usersValue.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.display_name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              { required: true, message: "Please select a phone number" },
            ]}
          >
            <Select placeholder="Select phone">
              {phoneNumbers.map((ph) => (
                <Option key={ph.id} value={ph.id}>
                  {ph.phone_number}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AssignContactTab;
