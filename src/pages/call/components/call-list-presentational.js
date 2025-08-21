import { UserOutlined } from "@ant-design/icons";
import { Card, Space, Tabs } from "antd";
import { History, Radio } from "lucide-react";
import React from "react";
import Recordings from "./recording";
import HistoryList from "./history";
const { TabPane } = Tabs;
function CallListPresentional({
  activeTab,
  setActiveTab,
  recordings,
  playingRecording,
  transcriptions,
  handlePlayRecording,
  callHistory,
}) {
  return (
    <Card style={{ margin: 24 }}>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane
          key="history"
          tab={
            <Space>
              <History />
              History
            </Space>
          }
        >
          <HistoryList {...{ callHistory }} />
        </TabPane>
        <TabPane
          key="recordings"
          tab={
            <Space>
              <Radio />
              Recordings
            </Space>
          }
        >
          <Recordings
            {...{
              recordings,
              playingRecording,
              transcriptions,
              handlePlayRecording,
            }}
          />
        </TabPane>
      </Tabs>
    </Card>
  );
}

export default CallListPresentional;
