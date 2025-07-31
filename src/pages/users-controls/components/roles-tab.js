// components/RolesTab.js
import React, { useState } from 'react';
import { Tree, Button, Typography, Modal, Input, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';

const { Title } = Typography;

const RolesTab = () => {
  const [treeData, setTreeData] = useState([
    {
      title: 'Manager',
      key: '0-0',
      icon: <TeamOutlined />,
      children: [
        { title: 'Employee', key: '0-0-0', icon: <UserOutlined /> },
        { title: 'Lead', key: '0-0-1', icon: <UserOutlined /> },
        { title: 'Mentor', key: '0-0-2', icon: <UserOutlined /> },
      ]
    }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [selectedKey, setSelectedKey] = useState(null);
  const [editingKey, setEditingKey] = useState(null);

  const showModal = (parentKey = null) => {
    setSelectedKey(parentKey);
    setRoleName('');
    setEditingKey(null);
    setModalVisible(true);
  };

  const handleEdit = (key, title) => {
    setRoleName(title);
    setEditingKey(key);
    setModalVisible(true);
  };

  const handleDelete = (keyToDelete, nodes = treeData) => {
    return nodes
      .map(node => {
        if (node.key === keyToDelete) return null;
        if (node.children) node.children = handleDelete(keyToDelete, node.children);
        return node;
      })
      .filter(Boolean);
  };

  const updateTitle = (keyToUpdate, newTitle, nodes = treeData) => {
    return nodes.map(node => {
      if (node.key === keyToUpdate) return { ...node, title: newTitle };
      if (node.children) node.children = updateTitle(keyToUpdate, newTitle, node.children);
      return node;
    });
  };

  const addRole = (nodes, parentKey, newRole) => {
    return nodes.map(node => {
      if (node.key === parentKey) {
        const children = node.children || [];
        const newKey = `${node.key}-${children.length}`;
        return {
          ...node,
          children: [...children, { title: newRole, key: newKey, icon: <UserOutlined /> }]
        };
      }
      if (node.children) node.children = addRole(node.children, parentKey, newRole);
      return node;
    });
  };

  const handleSave = () => {
    if (!roleName.trim()) {
      message.error('Role name is required');
      return;
    }

    let updatedData = [...treeData];

    if (editingKey) {
      updatedData = updateTitle(editingKey, roleName, updatedData);
      message.success('Role updated');
    } else if (selectedKey) {
      updatedData = addRole(updatedData, selectedKey, roleName);
      message.success('Role added under parent');
    } else {
      const newKey = `0-${treeData.length}`;
      updatedData.push({ title: roleName, key: newKey, icon: <TeamOutlined /> });
      message.success('Top-level role added');
    }

    setTreeData(updatedData);
    setModalVisible(false);
    setRoleName('');
    setEditingKey(null);
    setSelectedKey(null);
  };

  const handleDrop = ({ dragNode, node, dropToGap }) => {
    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) return callback(data, i);
        if (data[i].children) loop(data[i].children, key, callback);
      }
    };

    const data = [...treeData];
    let dragItem;
    loop(data, dragNode.key, (arr, index) => {
      dragItem = arr.splice(index, 1)[0];
    });

    if (!dropToGap) {
      loop(data, node.key, item => {
        item.children = item.children || [];
        item.children.unshift(dragItem);
      });
    } else {
      loop(data, node.key, (arr, index) => {
        arr.splice(index + 1, 0, dragItem);
      });
    }

    setTreeData(data);
    message.success('Roles rearranged');

    // Optionally integrate with API
    // fetch('/api/roles/reorder', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
  };

  const renderTreeNodes = nodes =>
    nodes.map(node => ({
      title: (
        <Space>
          {node.title}
          <Button size="small" icon={<PlusOutlined />} onClick={() => showModal(node.key)} />
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(node.key, node.title)} />
          <Popconfirm title="Delete this role?" onConfirm={() => setTreeData(handleDelete(node.key))}>
            <Button size="small" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
      key: node.key,
      icon: node.icon,
      children: node.children ? renderTreeNodes(node.children) : []
    }));

  return (
    <>
      <Title level={5}>Roles</Title>
      <p>Roles help you define visibility levels for records in your organization.</p>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} style={{ marginBottom: 16 }}>
        Create New Role
      </Button>
      <Tree
        defaultExpandAll
        treeData={renderTreeNodes(treeData)}
        draggable
        onDrop={handleDrop}
        showIcon
      />

      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSave}
        title={editingKey ? 'Edit Role' : 'Add Role'}
        okText={editingKey ? 'Update' : 'Add'}
        cancelText="Cancel"
      >
        <Input
          placeholder="Enter role name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default RolesTab;
