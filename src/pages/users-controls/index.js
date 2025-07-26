// UsersAndControlsPage.js
import React, { useState } from "react";
import { Tabs, Card, Space } from "antd";
import {
	UserOutlined,
	ProfileOutlined,
	TeamOutlined,
	SafetyCertificateOutlined,
} from "@ant-design/icons";

import UsersTab from "./components/user-tab";
import ProfilesTab from "./components/profiles-tab";
import RolesTab from "./components/roles-tab";
import ComplianceTab from "./components/compliance-tab";

const { TabPane } = Tabs;

export default function UsersAndControlsPage() {
	const [activeTab, setActiveTab] = useState("users");

	return (
		<Card style={{ margin: 24 }}>
			<Tabs activeKey={activeTab} onChange={setActiveTab}>
				<TabPane
					key="users"
					tab={
						<Space>
							<UserOutlined />
							Users
						</Space>
					}
				>
					<UsersTab />
				</TabPane>

				<TabPane
					key="profiles"
					tab={
						<Space>
							<ProfileOutlined />
							Profiles
						</Space>
					}
				>
					<ProfilesTab />
				</TabPane>

				<TabPane
					key="roles"
					tab={
						<Space>
							<TeamOutlined />
							Roles
						</Space>
					}
				>
					<RolesTab />
				</TabPane>

				<TabPane
					key="compliance"
					tab={
						<Space>
							<SafetyCertificateOutlined />
							Compliance
						</Space>
					}
				>
					<ComplianceTab />
				</TabPane>
			</Tabs>
		</Card>
	);
}
