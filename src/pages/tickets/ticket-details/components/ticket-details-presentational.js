import React from 'react';
import { Col, Drawer, Row, Tabs } from 'antd';
import { useSelector } from 'react-redux';
import Overview from './overview';
import Images from './images';
import Sales from './sales';
import Summary from './summary';

const { TabPane } = Tabs;

const MASTER_TAB = [
	{
		tabName: 'Overview',
		component: Overview,
	},
	{
		tabName: 'Images',
		component: Images,
	},
	{
		tabName: 'Sales',
		component: Sales,
	},
	{
		tabName: 'Summary',
		component: Summary,
	},
];

const TicketDetailsPresentational = ({ visible, closeModal }) => {
	const ticketRedux = useSelector((state) => state.ticketRedux);
	return (
		<Drawer
			maskClosable={false}
			title={`Ticket Details #${ticketRedux?.ticketDetails?.ticketNumber}`}
			placement="right"
			width={'60%'}
			open={visible}
			onClose={closeModal}>
			<Row className="ticket_details_container">
				<Col xl={24}>
					<Row style={{ padding: 0 }} className="ticket">
						<Col span={24} className="ticket_viewer">
							<Tabs defaultActiveKey="0">
								{MASTER_TAB.map(({ tabName, component }, index) => {
									const Component = component;
									return (
										<TabPane tab={tabName} key={index}>
											<Component />
										</TabPane>
									);
								})}
							</Tabs>
						</Col>
					</Row>
				</Col>
			</Row>
		</Drawer>
	);
};

export default TicketDetailsPresentational;
