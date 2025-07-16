import React, { useState } from 'react';
import { List, Typography, Collapse, Badge, Avatar } from 'antd';
import { MailOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const emails = [
  {
    id: 1,
    sender: 'John Doe',
    subject: 'Meeting Reminder',
    time: '10:30 AM',
    content: 'Hey, just reminding you about our meeting at 2 PM today.',
    read: false,
  },
  {
    id: 2,
    sender: 'Jane Smith',
    subject: 'Project Update',
    time: 'Yesterday',
    content: 'The project is on track. Let’s catch up later!',
    read: true,
  },
  {
    id: 3,
    sender: 'Support Team',
    subject: 'Your Ticket #12345',
    time: '2 days ago',
    content: 'Your support ticket has been resolved. Let us know if you need anything else!',
    read: true,
  },
];

const MailList = () => {
  const [mailData, setMailData] = useState(emails);

  const markAsRead = (id) => {
    setMailData(mailData.map(mail => mail.id === id ? { ...mail, read: true } : mail));
  };

  return (
    <List
      itemLayout="horizontal"
      dataSource={mailData}
      renderItem={item => (
        <Collapse
          style={{ marginBottom: 12 }}
          onChange={() => markAsRead(item.id)}
        >
          <Panel
            key={item.id}
            header={
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar icon={<MailOutlined />} />
                <div style={{ flex: 1 }}>
                  <Title level={5} style={{ margin: 0 }}>
                    {item.sender}
                    {!item.read && <Badge color="blue" />}
                  </Title>
                  <Text type="secondary">{item.subject}</Text>
                </div>
                <Text type="secondary">
                  <ClockCircleOutlined style={{ marginRight: 4 }} />
                  {item.time}
                </Text>
              </div>
            }
          >
            <Text>{item.content}</Text>
          </Panel>
        </Collapse>
      )}
    />
  );
};

export default MailList;
