import React from 'react';
import { Row, Col, Tabs } from 'antd';
import { DatabaseOutlined, AppstoreOutlined } from '@ant-design/icons';
import InventoryTab from './inventory-tab';
import ItemsTab from './items-tab';
import './preference.scss';

const MASTER_TAB = [
    {
        label: (
            <span>
                <DatabaseOutlined style={{ marginRight: 8 }} />
                Inventory
            </span>
        ),
        key: '0',
        children: <InventoryTab />,
    },
    {
        label: (
            <span>
                <AppstoreOutlined style={{ marginRight: 8 }} />
                Items
            </span>
        ),
        key: '1',
        children: <ItemsTab />,
    },
];

const Preferences = () => {
    return (
        <Row style={{ padding: 20 }}>
            <Col span={24} style={{ paddingBottom: 10 }}>
                <h4>Preferences</h4>
            </Col>
            <Col span={24}>
                <Tabs defaultActiveKey="0" rootClassName="preference_tab" items={MASTER_TAB} />
            </Col>
        </Row>
    );
};

export default Preferences;
