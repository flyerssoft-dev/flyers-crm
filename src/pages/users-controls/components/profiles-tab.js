// components/ProfilesTab.js
import React, { useState } from 'react';
import { Table, Button, Input, Divider, Select, Row, Col, Typography, Switch, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const initialProfiles = [
  {
    key: 1,
    name: 'Administrator',
    description: 'This profile will have all the permissions.',
    modifiedBy: 'FlyersSoft Admin',
    basicPermissions: {},
    advancedFeatures: {}
  },
  {
    key: 2,
    name: 'Standard',
    description: 'This profile will have all the permissions except administrative privileges.',
    modifiedBy: 'System',
    basicPermissions: {},
    advancedFeatures: {}
  },
];

const BasicPermissions = [
  'Pipeline Records', 'Contacts', 'Companies', 'Products', 'Activities', 'Notes', 'Files', 'Dashboards',
];

const AdvancedFeatures = [
  'Manage Team Pipelines', 'Automation', 'Forms', 'User Management',
  'Bulk Actions', 'Data Administration', 'Miscellaneous', 'Payment Links',
];

const defaultPermission = ['View', 'Create', 'Edit'];

const ProfilesTab = () => {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [creating, setCreating] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [profileName, setProfileName] = useState('');
  const [basicPermissionsSelections, setBasicPermissionsSelections] = useState({});
  const [advancedFeaturesToggles, setAdvancedFeaturesToggles] = useState({});

  const handleEdit = (record) => {
    setProfileName(record.name);
    setEditingProfile(record);
    setCreating(true);
    setBasicPermissionsSelections(record.basicPermissions || {});
    setAdvancedFeaturesToggles(record.advancedFeatures || {});
  };

  const handleDelete = (key) => {
    setProfiles(profiles.filter(p => p.key !== key));
    message.success('Profile deleted');
  };

  const handleSave = () => {
    if (!profileName.trim()) {
      message.error('Profile name is required');
      return;
    }

    const newProfileData = {
      name: profileName,
      basicPermissions: basicPermissionsSelections,
      advancedFeatures: advancedFeaturesToggles,
    };

    if (editingProfile) {
      const updated = profiles.map(p =>
        p.key === editingProfile.key
          ? {
              ...p,
              ...newProfileData,
              modifiedBy: 'Current User',
              description: p.description || 'Updated profile',
            }
          : p
      );
      setProfiles(updated);
      message.success('Profile updated');
    } else {
      const newProfile = {
        key: profiles.length ? profiles[profiles.length - 1].key + 1 : 1,
        description: 'New custom profile',
        modifiedBy: 'Current User',
        ...newProfileData,
      };
      setProfiles([...profiles, newProfile]);
      message.success('Profile created');
    }

    // Reset states
    setProfileName('');
    setCreating(false);
    setEditingProfile(null);
    setBasicPermissionsSelections({});
    setAdvancedFeaturesToggles({});
  };

  return (
    <>
      {!creating && (
        <>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ marginBottom: 16 }}
            onClick={() => {
              setCreating(true);
              setProfileName('');
              setEditingProfile(null);
              setBasicPermissionsSelections({});
              setAdvancedFeaturesToggles({});
            }}
          >
            Create New Profile
          </Button>
          <Table
            columns={[
              { title: 'Profile Name', dataIndex: 'name' },
              { title: 'Profile Description', dataIndex: 'description' },
              { title: 'Modified By', dataIndex: 'modifiedBy' },
              {
                title: 'Actions',
                key: 'actions',
                render: (_, record) => (
                  <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Popconfirm title="Delete this profile?" onConfirm={() => handleDelete(record.key)}>
                      <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                  </Space>
                )
              }
            ]}
            dataSource={profiles}
            pagination={false}
          />
        </>
      )}

      {creating && (
        <div style={{ padding: 24, background: '#fafafa', borderRadius: 8 }}>
          <Title level={5}>{editingProfile ? 'Edit Profile' : 'Create New Profile'}</Title>
          <Input
            placeholder="Enter Profile Name"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            style={{ width: 400, marginBottom: 24 }}
          />

          <Divider />

          <Title level={5}>Basic Permissions</Title>
          <Row gutter={[24, 16]}>
            {BasicPermissions.map((perm) => (
              <Col span={12} key={perm}>
                <strong>{perm}</strong>
                <br />
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Select permissions"
                  value={basicPermissionsSelections[perm] || defaultPermission}
                  onChange={(value) =>
                    setBasicPermissionsSelections({
                      ...basicPermissionsSelections,
                      [perm]: value,
                    })
                  }
                  style={{ width: '100%', marginTop: 8 }}
                >
                  {['View', 'Create', 'Edit', 'Delete'].map((option) => (
                    <Option key={option} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
              </Col>
            ))}
          </Row>

          <Divider />

          <Title level={5}>Advanced Features</Title>
          <Row gutter={[24, 16]} style={{ marginBottom: 20 }}>
            {AdvancedFeatures.map((feat) => (
              <Col
                span={12}
                key={feat}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span>{feat}</span>
                <Switch
                  checked={advancedFeaturesToggles[feat] ?? (feat !== 'Payment Links')}
                  onChange={(checked) =>
                    setAdvancedFeaturesToggles({
                      ...advancedFeaturesToggles,
                      [feat]: checked,
                    })
                  }
                />
              </Col>
            ))}
          </Row>

          <Divider />

          <div style={{ textAlign: 'right', marginTop: 20 }}>
            <Button
              onClick={() => {
                setCreating(false);
                setProfileName('');
                setEditingProfile(null);
                setBasicPermissionsSelections({});
                setAdvancedFeaturesToggles({});
              }}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button type="primary" onClick={handleSave}>
              {editingProfile ? 'Update' : 'Save'}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilesTab;
