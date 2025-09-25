// UsersAndControlsPage.js
import React, { useCallback, useEffect, useState } from "react";
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
import { SERVER_IP } from "assets/Config";
import { useDispatch } from "react-redux";
import { getApi } from "redux/sagas/getApiDataSaga";
import { useSelector } from "react-redux";
import AssignContactTab from "./components/assigne-contact-tab";

const { TabPane } = Tabs;

export default function UsersAndControlsPage() {
  const [activeTab, setActiveTab] = useState("assign");
  const dispatch = useDispatch();

  const userRedux = useSelector((state) => state.userRedux);

  const contactRedux = useSelector((state) => state.contactRedux);

  const getuserDetails = useCallback(() => {
    const page = 1;
    const limit = 500;
    let user_details_url = `${SERVER_IP}employeeDetails/getAllEmployeeDetails?page=${page}&limit=${limit}&sort=asc`;
    dispatch(getApi("GET_USER_DETAILS", user_details_url));
  }, [dispatch]);

  const getContactDetails = useCallback(() => {
    const url = `${SERVER_IP}call/all-phone-numbers`;
    dispatch(getApi("GET_PHONE_NUMBERS", url));
  }, [dispatch]);


  useEffect(() => {
    getuserDetails();
    getContactDetails();
  }, []);
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
          <UsersTab usersValue={userRedux?.userDetails?.message} />
        </TabPane>

        {/* <TabPane
					key="profiles"
					tab={
						<Space>
							<ProfileOutlined />
							Profiles
						</Space>
					}
				>
					<ProfilesTab />
				</TabPane> */}

        {/* <TabPane
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
				</TabPane> */}
        <TabPane
          key="assign"
          tab={
            <Space>
              <SafetyCertificateOutlined />
              Assign Contact
            </Space>
          }
        >
          <AssignContactTab
            usersValue={userRedux?.userDetails?.message}
            phoneNumbers={contactRedux?.phoneNumbers}
          />
        </TabPane>
      </Tabs>
    </Card>
  );
}
