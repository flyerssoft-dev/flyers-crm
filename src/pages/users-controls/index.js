// UsersAndControlsPage.js
import React, { useState } from 'react';
import { Tabs, Card } from 'antd';
import UsersTab from './components/user-tab';
import ProfilesTab from './components/profiles-tab';
import RolesTab from './components/roles-tab';
import ComplianceTab from './components/compliance-tab';

const { TabPane } = Tabs;

export default function UsersAndControlsPage() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <Card style={{ margin: 24 }}>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Users" key="users">
          <UsersTab />
        </TabPane>
        <TabPane tab="Profiles" key="profiles">
          <ProfilesTab />
        </TabPane>
        <TabPane tab="Roles" key="roles">
          <RolesTab />
        </TabPane>
        <TabPane tab="Compliance" key="compliance">
          <ComplianceTab />
        </TabPane>
      </Tabs>
    </Card>
  );
}
