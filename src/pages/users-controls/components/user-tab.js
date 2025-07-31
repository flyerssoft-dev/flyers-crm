// components/UsersTab.js
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const initialUsers = [
  {
    key: 1,
    name: 'FlyersSoft Admin',
    email: 'crm@flyerssoft.com',
    role: 'Manager',
    profile: 'Super Admin',
  },
  {
    key: 2,
    name: 'Ajith Asirvatham',
    email: 'ajith.asirvatham@flyerssoft.com',
    role: 'Employee',
    profile: 'Standard',
  },
];

const UsersTab = () => {
  const [users, setUsers] = useState(initialUsers);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);

  const showModal = (user = null) => {
    setEditingUser(user);
    if (user) form.setFieldsValue(user);
    else form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setEditingUser(null);
    setIsModalVisible(false);
  };

  const handleSaveUser = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        setUsers(users.map(user => user.key === editingUser.key ? { ...values, key: editingUser.key } : user));
        message.success('User updated successfully');
      } else {
        const newUser = {
          ...values,
          key: users.length ? users[users.length - 1].key + 1 : 1,
        };
        setUsers([...users, newUser]);
        message.success('User added successfully');
      }
      handleCancel();
    } catch (errorInfo) {
      console.error('Validation Failed:', errorInfo);
      message.error('Please fix the form errors and try again.');
    }
  };

  const handleDelete = key => {
    setUsers(users.filter(user => user.key !== key));
    message.success('User deleted');
  };

  const columnsUser = [
    { title: 'Full Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Role', dataIndex: 'role' },
    { title: 'Profile', dataIndex: 'profile' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
          <Popconfirm title="Are you sure you want to delete this user?" onConfirm={() => handleDelete(record.key)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} style={{ marginBottom: 16 }}>
        Add User
      </Button>

      <Table columns={columnsUser} dataSource={users} pagination={false} />

      <Modal
        title={editingUser ? 'Edit User' : 'Add New User'}
        open={isModalVisible}
        onOk={handleSaveUser}
        onCancel={handleCancel}
        okText={editingUser ? 'Update' : 'Add'}
        cancelText="Cancel"
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter full name' }, { min: 3, message: 'Minimum 3 characters' }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input type="email" placeholder="Enter email address" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select placeholder="Select user role">
              <Option value="Manager">Manager</Option>
              <Option value="Employee">Employee</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="profile"
            label="Profile"
            rules={[{ required: true, message: 'Please select a profile' }]}
          >
            <Select placeholder="Select user profile">
              <Option value="Super Admin">Super Admin</Option>
              <Option value="Standard">Standard</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UsersTab;
